import csv
import io
from collections import defaultdict
from datetime import timedelta

from django.db.models import Avg, Count
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import EsAdmin, EsDocenteOAdmin, EsEstudiante

from .models import AsignacionExperimento, ExperimentoAB, Notificacion
from .serializers import (
    AsignarEstudiantesSerializer,
    AsignacionExperimentoSerializer,
    ExperimentoABSerializer,
    ExportReporteSerializer,
    NotificacionSerializer,
)


# ─── CU-17: Dashboard personal del estudiante ────────────────────────────────

class DashboardEstudianteView(APIView):
    """
    GET /api/analitica/dashboard/
    Retorna radar VARK actual, evolución semanal y progreso por tema.
    """
    permission_classes = [EsEstudiante]

    def get(self, request):
        from apps.contenido.models import ResultadoQuiz, Tema
        from apps.recomendacion.models import EventoClickstream, HistorialPerfilVARK

        estudiante = request.user

        # ── Perfil VARK actual ──────────────────────────────────────────────
        try:
            perfil = estudiante.perfilvark
            vector = perfil.vector
            estilo_dominante = max(vector, key=vector.get)
        except Exception:
            vector = {'V': 0, 'A': 0, 'R': 0, 'K': 0}
            estilo_dominante = 'N/A'

        # ── Evolución semanal (últimas 8 semanas) ───────────────────────────
        hace_8_semanas = timezone.now() - timedelta(weeks=8)
        historial = list(
            HistorialPerfilVARK.objects.filter(
                estudiante=estudiante,
                fecha__gte=hace_8_semanas,
            ).order_by('fecha')
        )

        evolucion = []
        for h in historial:
            nv = h.vector_nuevo
            evolucion.append({
                'fecha': h.fecha.date().isoformat(),
                'origen': h.origen,
                'V': round(nv.get('V', 0), 3),
                'A': round(nv.get('A', 0), 3),
                'R': round(nv.get('R', 0), 3),
                'K': round(nv.get('K', 0), 3),
            })

        # ── Progreso por tema ───────────────────────────────────────────────
        resultados = (
            ResultadoQuiz.objects.filter(estudiante=estudiante)
            .values('tema__id', 'tema__nombre')
            .annotate(
                puntaje_promedio=Avg('puntaje'),
                quizzes_realizados=Count('id'),
            )
        )

        progreso_por_tema = [
            {
                'tema_id': r['tema__id'],
                'tema': r['tema__nombre'],
                'puntaje_promedio': round(r['puntaje_promedio'], 3),
                'quizzes_realizados': r['quizzes_realizados'],
            }
            for r in resultados
        ]

        # ── Totales ─────────────────────────────────────────────────────────
        total_recursos_vistos = EventoClickstream.objects.filter(
            estudiante=estudiante, tipo_evento='clic'
        ).values('recurso_id').distinct().count()

        total_quizzes = ResultadoQuiz.objects.filter(estudiante=estudiante).count()

        return Response({
            'perfil_vark': {k: round(v, 3) for k, v in vector.items()},
            'estilo_dominante': estilo_dominante,
            'evolucion_semanal': evolucion,
            'progreso_por_tema': progreso_por_tema,
            'total_recursos_vistos': total_recursos_vistos,
            'total_quizzes_realizados': total_quizzes,
        })


# ─── CU-18: Historial detallado de evolución VARK ────────────────────────────

class HistorialVARKDetalleView(APIView):
    """
    GET /api/analitica/perfil/historial-detalle/
    Lista entrada por entrada todos los cambios del perfil VARK con diff.
    """
    permission_classes = [EsEstudiante]

    def get(self, request):
        from apps.recomendacion.models import HistorialPerfilVARK

        historial = HistorialPerfilVARK.objects.filter(
            estudiante=request.user
        ).order_by('-fecha')

        data = []
        for h in historial:
            va = h.vector_anterior
            vn = h.vector_nuevo
            data.append({
                'id': h.pk,
                'fecha': h.fecha.isoformat(),
                'origen': h.get_origen_display(),
                'vector_anterior': {k: round(v, 3) for k, v in va.items()},
                'vector_nuevo': {k: round(v, 3) for k, v in vn.items()},
                'delta': {
                    k: round(vn.get(k, 0) - va.get(k, 0), 3)
                    for k in ['V', 'A', 'R', 'K']
                },
            })

        return Response(data)


# ─── CU-19: Reporte estadístico para docentes ────────────────────────────────

class ReporteDocenteView(APIView):
    """
    GET /api/analitica/reporte/docente/
    Panel analítico: correlación recursos/quizzes, top recursos, bajo engagement.
    """
    permission_classes = [EsDocenteOAdmin]

    def get(self, request):
        from apps.accounts.models import PerfilVARK, Usuario
        from apps.contenido.models import Recurso, ResultadoQuiz
        from apps.recomendacion.models import EventoClickstream

        # ── Estadísticas generales ──────────────────────────────────────────
        total_estudiantes = Usuario.objects.filter(rol='estudiante', is_active=True).count()
        avg_puntaje = ResultadoQuiz.objects.aggregate(avg=Avg('puntaje'))['avg'] or 0.0

        # ── Recursos más efectivos: los más clickeados con mejor puntaje ────
        recursos_efectivos = (
            EventoClickstream.objects
            .filter(tipo_evento='clic')
            .values('recurso__id', 'recurso__titulo', 'recurso__categoria_vark')
            .annotate(total_clics=Count('id'))
            .order_by('-total_clics')[:10]
        )

        # ── Estudiantes con bajo engagement (< 3 clics en últimos 30 días) ──
        hace_30 = timezone.now() - timedelta(days=30)
        clics_recientes = (
            EventoClickstream.objects
            .filter(tipo_evento='clic', timestamp__gte=hace_30)
            .values('estudiante_id')
            .annotate(total=Count('id'))
        )
        ids_activos = {r['estudiante_id'] for r in clics_recientes if r['total'] >= 3}
        todos_estudiantes = Usuario.objects.filter(rol='estudiante', is_active=True)
        bajo_engagement = [
            {'id': u.pk, 'email': u.email, 'nombre': u.nombre_completo}
            for u in todos_estudiantes if u.pk not in ids_activos
        ]

        # ── Distribución VARK ───────────────────────────────────────────────
        perfiles = PerfilVARK.objects.filter(test_completado=True)
        dist = {'V': 0, 'A': 0, 'R': 0, 'K': 0}
        for p in perfiles:
            dominante = max(p.vector, key=p.vector.get)
            dist[dominante] += 1

        return Response({
            'total_estudiantes': total_estudiantes,
            'promedio_puntaje_quizzes': round(avg_puntaje, 3),
            'recursos_mas_efectivos': list(recursos_efectivos),
            'estudiantes_bajo_engagement': bajo_engagement,
            'distribucion_vark': dist,
        })


# ─── CU-20: Experimento A/B ──────────────────────────────────────────────────

class ExperimentoABListCreateView(APIView):
    permission_classes = [EsAdmin]

    def get(self, request):
        experimentos = ExperimentoAB.objects.all()
        return Response(ExperimentoABSerializer(experimentos, many=True).data)

    def post(self, request):
        serializer = ExperimentoABSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(creado_por=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExperimentoABDetailView(APIView):
    permission_classes = [EsAdmin]

    def _get(self, pk):
        try:
            return ExperimentoAB.objects.get(pk=pk)
        except ExperimentoAB.DoesNotExist:
            return None

    def get(self, request, pk):
        exp = self._get(pk)
        if not exp:
            return Response({'detail': 'No encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ExperimentoABSerializer(exp).data)

    def put(self, request, pk):
        exp = self._get(pk)
        if not exp:
            return Response({'detail': 'No encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ExperimentoABSerializer(exp, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AsignarEstudiantesView(APIView):
    """
    POST /api/analitica/experimentos/<pk>/asignar/
    Asigna masivamente estudiantes a un grupo del experimento.
    """
    permission_classes = [EsAdmin]

    def post(self, request, pk):
        try:
            experimento = ExperimentoAB.objects.get(pk=pk, estado=ExperimentoAB.ESTADO_ACTIVO)
        except ExperimentoAB.DoesNotExist:
            return Response({'detail': 'Experimento no encontrado o finalizado.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AsignarEstudiantesSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        from apps.accounts.models import Usuario

        creados = []
        omitidos = 0
        for est_id in serializer.validated_data['estudiante_ids']:
            try:
                estudiante = Usuario.objects.get(pk=est_id, rol='estudiante')
            except Usuario.DoesNotExist:
                omitidos += 1
                continue

            _, created = AsignacionExperimento.objects.get_or_create(
                experimento=experimento,
                estudiante=estudiante,
                defaults={'grupo': serializer.validated_data['grupo']},
            )
            if created:
                creados.append(est_id)

        return Response({
            'asignados': len(creados),
            'omitidos': omitidos,
            'grupo': serializer.validated_data['grupo'],
        }, status=status.HTTP_200_OK)


class ResultadosExperimentoView(APIView):
    """
    GET /api/analitica/experimentos/<pk>/resultados/
    Compara métricas entre grupo experimental y control.
    """
    permission_classes = [EsAdmin]

    def get(self, request, pk):
        from apps.contenido.models import ResultadoQuiz
        from apps.recomendacion.models import EventoClickstream

        try:
            experimento = ExperimentoAB.objects.get(pk=pk)
        except ExperimentoAB.DoesNotExist:
            return Response({'detail': 'Experimento no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        grupos = {}
        for grupo in ['experimental', 'control']:
            ids = list(
                AsignacionExperimento.objects.filter(
                    experimento=experimento, grupo=grupo
                ).values_list('estudiante_id', flat=True)
            )
            if not ids:
                grupos[grupo] = {'total': 0, 'promedio_puntaje': None, 'total_clics': 0}
                continue

            avg_puntaje = (
                ResultadoQuiz.objects.filter(
                    estudiante_id__in=ids,
                    fecha_realizacion__gte=experimento.fecha_inicio,
                ).aggregate(avg=Avg('puntaje'))['avg']
            )
            total_clics = EventoClickstream.objects.filter(
                estudiante_id__in=ids,
                tipo_evento='clic',
                timestamp__gte=experimento.fecha_inicio,
            ).count()

            grupos[grupo] = {
                'total': len(ids),
                'promedio_puntaje': round(avg_puntaje, 3) if avg_puntaje else None,
                'total_clics': total_clics,
            }

        return Response({
            'experimento': ExperimentoABSerializer(experimento).data,
            'resultados': grupos,
        })


# ─── CU-21: Exportar reporte CSV / PDF ───────────────────────────────────────

class ExportarReporteView(APIView):
    """
    GET /api/analitica/reporte/exportar/?formato=csv&fecha_inicio=...&fecha_fin=...
    Descarga reporte de desempeño. PDF devuelve texto plano (requiere lib externa).
    """
    permission_classes = [EsDocenteOAdmin]

    def get(self, request):
        serializer = ExportReporteSerializer(data=request.query_params)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        from apps.contenido.models import ResultadoQuiz

        formato = serializer.validated_data.get('formato', 'csv')
        fecha_inicio = serializer.validated_data.get('fecha_inicio')
        fecha_fin = serializer.validated_data.get('fecha_fin')
        tema_id = serializer.validated_data.get('tema_id')

        qs = ResultadoQuiz.objects.select_related('estudiante', 'tema').order_by('-fecha_realizacion')

        if fecha_inicio:
            qs = qs.filter(fecha_realizacion__date__gte=fecha_inicio)
        if fecha_fin:
            qs = qs.filter(fecha_realizacion__date__lte=fecha_fin)
        if tema_id:
            qs = qs.filter(tema_id=tema_id)

        if formato == 'csv':
            return self._generar_csv(qs)
        return self._generar_pdf_texto(qs)

    def _generar_csv(self, qs):
        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow([
            'Estudiante', 'Email', 'Tema',
            'Puntaje', 'Respuestas Correctas', 'Total Preguntas', 'Fecha',
        ])
        for r in qs:
            writer.writerow([
                r.estudiante.nombre_completo,
                r.estudiante.email,
                r.tema.nombre,
                f'{r.puntaje:.2%}',
                r.respuestas_correctas,
                r.total_preguntas,
                r.fecha_realizacion.strftime('%Y-%m-%d %H:%M'),
            ])
        buffer.seek(0)
        response = HttpResponse(buffer.getvalue(), content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename="reporte_desempeno.csv"'
        return response

    def _generar_pdf_texto(self, qs):
        """
        Genera un reporte en texto plano con formato tabular.
        Para PDF real con gráficos, integrar ReportLab o WeasyPrint en el futuro.
        """
        lineas = ['REPORTE DE DESEMPEÑO ACADÉMICO', '=' * 60, '']
        for r in qs:
            lineas.append(
                f'{r.fecha_realizacion.strftime("%Y-%m-%d")} | '
                f'{r.estudiante.email} | {r.tema.nombre} | '
                f'{r.puntaje:.0%} ({r.respuestas_correctas}/{r.total_preguntas})'
            )
        contenido = '\n'.join(lineas)
        response = HttpResponse(contenido, content_type='text/plain; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename="reporte_desempeno.txt"'
        return response


# ─── CU-22: Notificaciones ───────────────────────────────────────────────────

class NotificacionListView(APIView):
    """
    GET /api/analitica/notificaciones/
    Lista todas las notificaciones del usuario autenticado.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        solo_no_leidas = request.query_params.get('no_leidas') == 'true'
        qs = Notificacion.objects.filter(destinatario=request.user)
        if solo_no_leidas:
            qs = qs.filter(leida=False)
        return Response(NotificacionSerializer(qs, many=True).data)


class NotificacionMarcarLeidaView(APIView):
    """
    PATCH /api/analitica/notificaciones/<pk>/leer/
    Marca una notificación como leída.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            notif = Notificacion.objects.get(pk=pk, destinatario=request.user)
        except Notificacion.DoesNotExist:
            return Response({'detail': 'Notificación no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        notif.leida = True
        notif.save(update_fields=['leida'])
        return Response({'detail': 'Notificación marcada como leída.'})


class NotificacionMarcarTodasLeidasView(APIView):
    """
    POST /api/analitica/notificaciones/leer-todas/
    Marca todas las notificaciones del usuario como leídas.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        total = Notificacion.objects.filter(
            destinatario=request.user, leida=False
        ).update(leida=True)
        return Response({'detail': f'{total} notificaciones marcadas como leídas.'})


class EnviarNotificacionNuevoRecursoView(APIView):
    """
    POST /api/analitica/notificaciones/nuevo-recurso/
    (Solo docente/admin) Envía notificación a estudiantes cuyo perfil VARK
    coincide con la categoría del recurso nuevo.
    """
    permission_classes = [EsDocenteOAdmin]

    def post(self, request):
        recurso_id = request.data.get('recurso_id')
        if not recurso_id:
            return Response({'recurso_id': 'Este campo es requerido.'}, status=status.HTTP_400_BAD_REQUEST)

        from apps.accounts.models import PerfilVARK, Usuario
        from apps.contenido.models import Recurso

        try:
            recurso = Recurso.objects.select_related('tema').get(pk=recurso_id, activo=True)
        except Recurso.DoesNotExist:
            return Response({'detail': 'Recurso no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        # Estudiantes cuyo estilo dominante coincide con la categoría del recurso
        perfiles = PerfilVARK.objects.filter(test_completado=True).select_related('usuario')
        destinatarios = [
            p.usuario for p in perfiles
            if max(p.vector, key=p.vector.get) == recurso.categoria_vark
        ]

        notificaciones = [
            Notificacion(
                destinatario=u,
                tipo=Notificacion.TIPO_NUEVO_RECURSO,
                titulo=f'Nuevo recurso disponible: {recurso.titulo}',
                mensaje=(
                    f'Hemos agregado un nuevo recurso de tipo '
                    f'{recurso.get_tipo_formato_display()} sobre '
                    f'"{recurso.tema.nombre}" que encaja con tu perfil de aprendizaje.'
                ),
                recurso=recurso,
            )
            for u in destinatarios
        ]
        Notificacion.objects.bulk_create(notificaciones)

        return Response({
            'detail': f'{len(notificaciones)} notificaciones enviadas.',
            'categoria_vark': recurso.categoria_vark,
        }, status=status.HTTP_201_CREATED)

