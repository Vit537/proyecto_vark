# VARK — App móvil (estudiante)

App móvil del estudiante para el Sistema VARK, hecha con **Expo (React Native) + TypeScript +
expo-router**. Replica la experiencia web del estudiante (mismo backend, mismo diseño
glassmorphism, tema claro/oscuro y fondo de "figuritas").

> Solo rol **estudiante**. La vista de docente/admin no está incluida (igual que en el plan).

---

## Requisitos
- Node 18+
- App **Expo Go** en tu teléfono, o un emulador Android / simulador iOS.
- El **backend Django corriendo** (por defecto en `http://localhost:8000`).

## Instalación
```bash
cd movil
npm install
# Alinea las versiones nativas con tu SDK de Expo:
npx expo install
```

## Configurar la URL del backend
La base del API se resuelve en este orden (`src/api/client.ts`):
1. Variable de entorno `EXPO_PUBLIC_API_URL`
2. `expo.extra.apiUrl` en `app.json`
3. Fallback `http://10.0.2.2:8000/api`

Según dónde pruebes:
- **Emulador Android**: `http://10.0.2.2:8000/api` (10.0.2.2 = localhost del PC).
- **iOS simulador**: `http://localhost:8000/api`.
- **Dispositivo físico (Expo Go)**: usa la **IP LAN** de tu PC, p. ej. `http://192.168.1.50:8000/api`.

Ejemplo:
```bash
EXPO_PUBLIC_API_URL=http://192.168.1.50:8000/api npx expo start
```
(En Windows PowerShell: `$env:EXPO_PUBLIC_API_URL="http://192.168.1.50:8000/api"; npx expo start`)

> El backend debe permitir esa IP en `ALLOWED_HOSTS` / CORS.

## Correr
```bash
npm start         # abre el panel de Expo (QR para Expo Go)
npm run android   # emulador Android
npm run ios       # simulador iOS (macOS)
```

## Credenciales de prueba (seed)
Estudiante: `lucia.fernandez@est.vark.edu` · contraseña `vark1234`.

---

## Estructura
```
movil/
├── app/                       # Rutas (expo-router)
│   ├── _layout.tsx            # Providers (tema + auth) + fuentes + Stack
│   ├── index.tsx              # Redirección según sesión
│   ├── (auth)/login.tsx       # Login
│   ├── test-vark.tsx          # Test VARK inicial (wizard)
│   ├── (tabs)/                # Navegación principal del estudiante
│   │   ├── index.tsx          # Dashboard (perfil VARK + KPIs + recomendados)
│   │   ├── temas.tsx          # Temas + "Tomar test"
│   │   ├── recursos.tsx       # Recursos (lectura)
│   │   ├── recomendaciones.tsx# Recomendaciones + valorar
│   │   ├── historial.tsx      # Evolución del perfil VARK
│   │   └── perfil.tsx         # Cuenta + tema + logout
│   └── quiz/[id].tsx          # Quiz por tema + resultado
└── src/
    ├── api/                   # client, types, endpoints (espejo del web)
    ├── auth/AuthProvider.tsx  # Sesión JWT
    ├── theme/                 # tokens (claro/oscuro) + ThemeProvider
    └── components/            # AppBackground (figuritas) + ui/
```

## Notas de diseño
- Tema **claro/oscuro** con persistencia (`AsyncStorage`), toggle en el header y en Perfil.
- Fondo de **figuritas** (`react-native-svg`) tema-aware, igual que la web.
- Fuentes **Syne** (títulos) + **DM Sans** (cuerpo) vía `@expo-google-fonts`.
- Animaciones con **moti** / reanimated.
