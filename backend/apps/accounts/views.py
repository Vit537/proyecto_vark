from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import PerfilVARK, SesionTestVARK
from .serializers import (
    LoginSerializer,
    PerfilVARKSerializer,
    RegistroSerializer,
    RespuestasTestSerializer,
    UsuarioSerializer,
)
from .services.vark_service import calcular_vector_vark, generar_test_vark


# ─── CU-01: Registro ─────────────────────────────────────────────────────────

class RegistroView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistroSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.save()
            return Response(
                UsuarioSerializer(usuario).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── CU-02: Autenticación ────────────────────────────────────────────────────

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'detail': 'El token de refresco es requerido.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {'detail': 'Sesión cerrada correctamente.'},
                status=status.HTTP_200_OK,
            )
        except Exception:
            return Response(
                {'detail': 'Token inválido o ya expirado.'},
                status=status.HTTP_400_BAD_REQUEST,
            )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UsuarioSerializer(request.user).data)


# ─── CU-03: Test VARK ────────────────────────────────────────────────────────

class VARKGenerarTestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario = request.user

        if usuario.rol != usuario.ROL_ESTUDIANTE:
            return Response(
                {'detail': 'Solo los estudiantes pueden tomar el test VARK.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        perfil, _ = PerfilVARK.objects.get_or_create(usuario=usuario)
        if perfil.test_completado:
            return Response(
                {'detail': 'Ya completaste el test VARK.', 'completado': True},
                status=status.HTTP_200_OK,
            )

        # Generar preguntas (Groq con fallback estático)
        preguntas_completas, fuente = generar_test_vark()

        # Invalidar sesiones anteriores incompletas y crear una nueva
        SesionTestVARK.objects.filter(usuario=usuario, completado=False).delete()
        sesion = SesionTestVARK.objects.create(
            usuario=usuario,
            preguntas_json=preguntas_completas,
        )

        # Enviar preguntas al frontend SIN revelar el campo 'estilo'
        preguntas_frontend = [
            {
                'id': p['id'],
                'enunciado': p['enunciado'],
                'opciones': [
                    {'id': o['id'], 'texto': o['texto']}
                    for o in p['opciones']
                ],
            }
            for p in preguntas_completas
        ]

        return Response({
            'sesion_id': sesion.id,
            'fuente': fuente,
            'total_preguntas': len(preguntas_frontend),
            'preguntas': preguntas_frontend,
        }, status=status.HTTP_200_OK)


class VARKCompletarTestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        usuario = request.user

        serializer = RespuestasTestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        sesion_id = serializer.validated_data['sesion_id']
        respuestas = serializer.validated_data['respuestas']

        try:
            sesion = SesionTestVARK.objects.get(
                id=sesion_id, usuario=usuario, completado=False
            )
        except SesionTestVARK.DoesNotExist:
            return Response(
                {'detail': 'Sesión de test no encontrada o ya completada.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        vector = calcular_vector_vark(sesion.preguntas_json, respuestas)

        perfil, _ = PerfilVARK.objects.get_or_create(usuario=usuario)
        perfil.puntaje_visual = vector['V']
        perfil.puntaje_auditivo = vector['A']
        perfil.puntaje_lectura = vector['R']
        perfil.puntaje_kinestesico = vector['K']
        perfil.test_completado = True
        perfil.fecha_test = timezone.now()
        perfil.save()

        sesion.completado = True
        sesion.save()

        return Response({
            'detail': 'Test completado exitosamente.',
            'perfil_vark': PerfilVARKSerializer(perfil).data,
        }, status=status.HTTP_200_OK)


class PerfilVARKView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            perfil = request.user.perfil_vark
            return Response(PerfilVARKSerializer(perfil).data)
        except PerfilVARK.DoesNotExist:
            return Response(
                {'detail': 'Perfil VARK no encontrado.'},
                status=status.HTTP_404_NOT_FOUND,
            )
