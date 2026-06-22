mensaje 1:

═══ CONTEXTO DEL PROYECTO ═══
Proyecto: Sistema de Recomendación VARK
Stack: Next.js 14 (App Router) + Django REST Framework + PostgreSQL
Estado: Backend y frontend ya implementados y funcionando
Tarea ÚNICA: Conectar frontend con los endpoints del backend
NO modificar diseño, NO cambiar lógica existente, NO tocar componentes UI

═══ ARCHIVOS DEL BACKEND ═══
Revisa estos archivos para entender los endpoints:
- C:\Users\HP\Desktop\taller1\proyecto_vark\backend\apps\accounts\urls.py
- C:\Users\HP\Desktop\taller1\proyecto_vark\backend\apps\accounts\serializers.py

De esos archivos extrae:
- Las URLs exactas de cada endpoint
- El método HTTP (GET, POST, PUT, DELETE)
- Los campos que recibe (request)
- Los campos que devuelve (response)

═══ ARCHIVOS DEL FRONTEND ═══
Revisa la lógica TypeScript existente en:
- C:\Users\HP\Desktop\taller1\proyecto_vark\frontend\src

Identifica:
- Cómo está estructurada la capa de servicios
- Si usa Axios, Fetch o React Query
- Dónde van los tipos TypeScript (interfaces)

═══ TAREA ═══
Conecta SOLO los endpoints del urls.py de accounts.

Para cada endpoint:
1. Crea o actualiza el tipo TypeScript con los campos
   exactos del serializer (ni más ni menos)
2. Crea la función de servicio que llama al endpoint
3. Conéctala al componente frontend correspondiente
4. Maneja los 3 estados: cargando / éxito / error

═══ RESTRICCIONES ═══
- Base URL del backend: http://localhost:8000/api/
- NO modificar componentes UI ni estilos
- NO cambiar lógica de negocio existente
- NO inventar endpoints que no estén en urls.py
- Seguir la estructura de archivos que ya existe en /frontend/src
- Si hay autenticación JWT ya configurada, usarla tal como está
- Un endpoint a la vez, confirma antes de pasar al siguiente


mensaje 2: 

═══ CONTEXTO DEL PROYECTO ═══
Proyecto: Sistema de Recomendación VARK
Stack: Next.js 14 (App Router) + Django REST Framework + PostgreSQL
Estado: Backend y frontend ya implementados y funcionando
Tarea ÚNICA: Conectar frontend con los endpoints del backend
NO modificar diseño, NO cambiar lógica existente, NO tocar componentes UI
SOLO nos enfocaremos en los casos de uso 9,10,12,13

═══ ARCHIVOS DEL BACKEND ═══
Revisa estos archivos para entender los endpoints, específicamente de los casos de uso 9,10,12,13:
- C:\Users\HP\Desktop\taller1\proyecto_vark\backend\apps\contenido\urls.py
- C:\Users\HP\Desktop\taller1\proyecto_vark\backend\apps\contenido\serializers.py

- C:\Users\HP\Desktop\taller1\proyecto_vark\backend\apps\recomendacion\urls.py
- C:\Users\HP\Desktop\taller1\proyecto_vark\backend\apps\recomendacion\serializers.py


De esos archivos extrae:
- Las URLs exactas de cada endpoint
- El método HTTP (GET, POST, PUT, DELETE)
- Los campos que recibe (request)
- Los campos que devuelve (response)

═══ ARCHIVOS DEL FRONTEND ═══
Revisa la lógica TypeScript existente en:
- C:\Users\HP\Desktop\taller1\proyecto_vark\frontend\src

Identifica:
- Cómo está estructurada la capa de servicios
- Si usa Axios, Fetch o React Query
- Dónde van los tipos TypeScript (interfaces)

═══ TAREA ═══
Conecta SOLO los endpoints del urls.py de recomendaciones , contenido, específicamente de los casos de uso 9,10,12,13.

Para cada endpoint:
1. Crea o actualiza el tipo TypeScript con los campos
   exactos del serializer (ni más ni menos)
2. Crea la función de servicio que llama al endpoint
3. Conéctala al componente frontend correspondiente
4. Maneja los 3 estados: cargando / éxito / error

═══ RESTRICCIONES ═══
- Base URL del backend: http://localhost:8000/api/
- NO modificar componentes UI ni estilos
- NO cambiar lógica de negocio existente
- NO inventar endpoints que no estén en urls.py
- Seguir la estructura de archivos que ya existe en /frontend/src
- Si hay autenticación JWT ya configurada, usarla tal como está
- Un endpoint a la vez, confirma antes de pasar al siguiente



mensaje 3:

═══ CONTEXTO DEL PROYECTO ═══
Proyecto: Sistema de Recomendación VARK
Stack: Next.js 14 (App Router) + Django REST Framework + PostgreSQL
Estado: Backend y frontend ya implementados y funcionando
Tarea ÚNICA: Conectar frontend con los endpoints del backend
NO modificar diseño, NO cambiar lógica existente, NO tocar componentes UI
SOLO nos enfocaremos en los casos de uso 9,10,12,13

═══ ARCHIVOS DEL BACKEND ═══
Revisa estos archivos para entender los endpoints, específicamente de los casos de uso 19,20,21,22:
- C:\Users\HP\Desktop\taller1\proyecto_vark\backend\apps\analitica\urls.py
- C:\Users\HP\Desktop\taller1\proyecto_vark\backend\apps\analitica\serializers.py


De esos archivos extrae:
- Las URLs exactas de cada endpoint
- El método HTTP (GET, POST, PUT, DELETE)
- Los campos que recibe (request)
- Los campos que devuelve (response)

═══ ARCHIVOS DEL FRONTEND ═══
Revisa la lógica TypeScript existente en:
- C:\Users\HP\Desktop\taller1\proyecto_vark\frontend\src

Identifica:
- Cómo está estructurada la capa de servicios
- Si usa Axios, Fetch o React Query
- Dónde van los tipos TypeScript (interfaces)

═══ TAREA ═══
Conecta SOLO los endpoints del urls.py de recomendaciones , contenido, específicamente de los casos de uso 19,20,21,22.

Para cada endpoint:
1. Crea o actualiza el tipo TypeScript con los campos
   exactos del serializer (ni más ni menos)
2. Crea la función de servicio que llama al endpoint
3. Conéctala al componente frontend correspondiente
4. Maneja los 3 estados: cargando / éxito / error

═══ RESTRICCIONES ═══
- Base URL del backend: http://localhost:8000/api/
- NO modificar componentes UI ni estilos
- NO cambiar lógica de negocio existente
- NO inventar endpoints que no estén en urls.py
- Seguir la estructura de archivos que ya existe en /frontend/src
- Si hay autenticación JWT ya configurada, usarla tal como está
- Un endpoint a la vez, confirma antes de pasar al siguiente

