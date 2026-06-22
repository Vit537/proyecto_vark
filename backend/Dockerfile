# ─── Etapa única: producción ──────────────────────────────────────────────────
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Dependencias de sistema para psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY . .

# Variables de entorno requeridas en build
ENV DJANGO_SETTINGS_MODULE=config.settings.production

# Recopilar archivos estáticos (admin + whitenoise)
RUN python manage.py collectstatic --noinput

# Cloud Run inyecta la variable PORT (default 8080)
ENV PORT=8080
EXPOSE 8080

# Gunicorn: 2 workers síncronos — ajustar según CPU de Cloud Run
CMD gunicorn --bind 0.0.0.0:$PORT \
             --workers 2 \
             --timeout 120 \
             --access-logfile - \
             config.wsgi:application
