1. Configurar el entorno

Primero, accede a la carpeta de tu proyecto de Next.js desde la terminal. Si tu proyecto está organizado así:
taller1/
├── backend/   (tu proyecto de Django)
└── frontend/  (tu proyecto de Next.js)

2. Instalar dependencias

Aunque creas que ya las tienes, es muy recomendable correr el instalador para asegurarte de que no falta ninguna:

npm install

Este comando leerá el archivo package.json e instalará todas las dependencias necesarias.

3. Configurar variables de entorno

Si tu proyecto usa variables de entorno (por ejemplo, la URL de tu API de Django), asegúrate de que exista un archivo .env.local en la raíz de la carpeta frontend. Next.js soporta estos archivos de forma nativa. Un ejemplo de su contenido podría ser:

NEXT_PUBLIC_API_URL=http://localhost:8000/api

Acuérdate de reiniciar el servidor si creas o modificas este archivo después de haberlo iniciado.

4. Ejecutar el servidor de desarrollo

Este es el comando principal para desarrollar:

npm run dev

Por defecto, la aplicación estará disponible en http://localhost:3000. Si necesitas usar un puerto diferente, puedes especificarlo así: