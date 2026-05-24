Aquí te recuerdo la secuencia típica de comandos (asumiendo que ya tienes el entorno virtual activado y los requisitos instalados):

Activar el entorno virtual (si no lo tienes activo):

En Windows: venv\Scripts\activate

En Linux/macOS: source venv/bin/activate

Aplicar las migraciones (crear las tablas en la BD):

python manage.py migrate

python manage.py createsuperuser

python manage.py runserver

Si por alguna razón te falta algún paquete, puedes instalarlo con pip install -r requirements.txt (si tienes el archivo). Y si necesitas generar nuevas migraciones por cambios en los modelos, sería python manage.py makemigrations antes del migrate.