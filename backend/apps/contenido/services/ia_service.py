import json
import logging

from django.conf import settings

logger = logging.getLogger(__name__)

PROMPT_SUGERIR_RECURSOS = """Eres un experto en recursos educativos para programación.

Sugiere exactamente {cantidad} recursos educativos en línea para estudiantes universitarios de programación básica.

Parámetros:
- Tema: {tema}
- Estilo de aprendizaje VARK: {estilo_nombre} ({estilo_codigo})
- Nivel de complejidad sugerido: {nivel}

Criterios para el estilo {estilo_codigo}:
{criterios_estilo}

Reglas:
- Todos los recursos deben ser accesibles de forma gratuita.
- URLs deben ser reales y verificables.
- El campo "justificacion_pedagogica" debe explicar por qué el recurso encaja con el estilo VARK indicado.
- Todo en español.

Responde ÚNICAMENTE con JSON válido, sin bloques markdown, con esta estructura:
{{
  "recursos": [
    {{
      "titulo": "Nombre del recurso",
      "url": "https://...",
      "descripcion": "Descripción breve del recurso",
      "tipo_formato": "video|articulo|ejercicio|documento",
      "justificacion_pedagogica": "Por qué encaja con el estilo {estilo_codigo}"
    }}
  ]
}}"""

CRITERIOS_VARK = {
    'V': 'Recursos visuales: videos explicativos, infografías, diagramas animados, presentaciones visuales.',
    'A': 'Recursos auditivos: podcasts, videos con narración, explicaciones orales, clases grabadas.',
    'R': 'Recursos de lectura/escritura: artículos técnicos, documentación oficial, tutoriales escritos, libros.',
    'K': 'Recursos kinestésicos: ejercicios interactivos, desafíos de código (coding challenges), proyectos prácticos, sandboxes.',
}

NOMBRES_VARK = {
    'V': 'Visual',
    'A': 'Auditivo',
    'R': 'Lectura/Escritura',
    'K': 'Kinestésico',
}


def sugerir_recursos_ia(tema_nombre, categoria_vark, nivel='basico', cantidad=8):
    """
    Llama a Groq para obtener sugerencias de recursos educativos.

    Args:
        tema_nombre: str — nombre del tema (ej: "Vectores")
        categoria_vark: str — 'V', 'A', 'R' o 'K'
        nivel: str — 'basico', 'intermedio', 'avanzado'
        cantidad: int — número de recursos solicitados (entre 5 y 10)

    Returns:
        list[dict] — lista de recursos con: titulo, url, descripcion,
                     tipo_formato, justificacion_pedagogica
    """
    cantidad = max(5, min(10, cantidad))

    prompt = PROMPT_SUGERIR_RECURSOS.format(
        tema=tema_nombre,
        estilo_codigo=categoria_vark,
        estilo_nombre=NOMBRES_VARK.get(categoria_vark, categoria_vark),
        nivel=nivel,
        cantidad=cantidad,
        criterios_estilo=CRITERIOS_VARK.get(categoria_vark, ''),
    )

    try:
        from groq import Groq
        client = Groq(api_key=settings.GROQ_API_KEY)

        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[{'role': 'user', 'content': prompt}],
            temperature=0.6,
            max_tokens=3000,
        )

        content = response.choices[0].message.content.strip()

        if '```json' in content:
            content = content.split('```json')[1].split('```')[0].strip()
        elif '```' in content:
            content = content.split('```')[1].split('```')[0].strip()

        data = json.loads(content)
        recursos = data.get('recursos', [])

        if not recursos:
            raise ValueError('Groq retornó una lista vacía de recursos.')

        tipos_validos = {'video', 'articulo', 'ejercicio', 'documento'}
        for r in recursos:
            if r.get('tipo_formato') not in tipos_validos:
                r['tipo_formato'] = 'articulo'

        return recursos

    except Exception as exc:
        logger.error('Error al sugerir recursos via Groq: %s', exc)
        raise
