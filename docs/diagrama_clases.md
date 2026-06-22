# Diagrama de Clases — Sistema de Recomendación VARK
**Notación UML 2.5**

---

## Convenciones de visibilidad
| Símbolo | Significado |
|---|---|
| `+` | público |
| `-` | privado |
| `#` | protegido |

## Convenciones de tipos de dato
| Tipo UML | Tipo Django |
|---|---|
| `entero` | `AutoField / PositiveSmallIntegerField / PositiveIntegerField` |
| `texto[N]` | `CharField(max_length=N)` |
| `texto` | `TextField` |
| `decimal` | `FloatField` |
| `booleano` | `BooleanField` |
| `fechaHora` | `DateTimeField` |
| `json` | `JSONField` |
| `FK → Clase` | `ForeignKey` |
| `1:1 → Clase` | `OneToOneField` |
| `[nullable]` | `null=True` |
| `[unique]` | `unique=True` |

---

## PAQUETE 1 — accounts (Identidad y Acceso)

---

### Clase: `Usuario`
> Tabla: `usuario` · Hereda de: `AbstractBaseUser`, `PermissionsMixin`

```
┌─────────────────────────────────────────────────────────────────┐
│                           Usuario                               │
├─────────────────────────────────────────────────────────────────┤
│ - id             : entero            [PK]                       │
│ - email          : texto[254]        [unique] [NOT NULL]        │
│ - password       : texto[128]        [NOT NULL]  (heredado)     │
│ - nombre         : texto[100]        [NOT NULL]                 │
│ - apellido       : texto[100]        [NOT NULL]                 │
│ - rol            : texto[20]         [NOT NULL]                 │
│   {estudiante, docente, administrador}                          │
│ - is_active      : booleano          [NOT NULL]  default=True   │
│ - is_staff       : booleano          [NOT NULL]  default=False  │
│ - is_superuser   : booleano          [NOT NULL]  (heredado)     │
│ - last_login     : fechaHora         [nullable]  (heredado)     │
│ - fecha_registro : fechaHora         [NOT NULL]                 │
├─────────────────────────────────────────────────────────────────┤
│ + registrar(email, password, nombre, apellido, rol) : Usuario   │
│ + autenticar(email, password) : token                           │
│ + cerrarSesion(refreshToken) : void                             │
│ + obtenerNombreCompleto() : texto          «property»           │
│ + __str__() : texto                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

### Clase: `PerfilVARK`
> Tabla: `perfil_vark` · Composición con `Usuario` (CASCADE)

```
┌─────────────────────────────────────────────────────────────────┐
│                         PerfilVARK                              │
├─────────────────────────────────────────────────────────────────┤
│ - id                  : entero       [PK]                       │
│ - usuario_id          : 1:1 → Usuario [NOT NULL] [CASCADE]     │
│ - puntaje_visual      : decimal      [NOT NULL]  default=0.0   │
│ - puntaje_auditivo    : decimal      [NOT NULL]  default=0.0   │
│ - puntaje_lectura     : decimal      [NOT NULL]  default=0.0   │
│ - puntaje_kinestesico : decimal      [NOT NULL]  default=0.0   │
│ - test_completado     : booleano     [NOT NULL]  default=False  │
│ - fecha_test          : fechaHora    [nullable]                 │
├─────────────────────────────────────────────────────────────────┤
│ + obtenerVector() : json{V,A,R,K}    «property»                 │
│ + actualizar(vector: json) : void                               │
│ + __str__() : texto                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

### Clase: `SesionTestVARK`
> Tabla: `sesion_test_vark` · Composición con `Usuario` (CASCADE)

```
┌─────────────────────────────────────────────────────────────────┐
│                       SesionTestVARK                            │
├─────────────────────────────────────────────────────────────────┤
│ - id             : entero       [PK]                            │
│ - usuario_id     : FK → Usuario [NOT NULL] [CASCADE]           │
│ - preguntas_json : json         [NOT NULL]                      │
│ - completado     : booleano     [NOT NULL]  default=False       │
│ - creado_en      : fechaHora    [NOT NULL]  auto                │
├─────────────────────────────────────────────────────────────────┤
│ + generarPreguntas(fuente: texto) : json                        │
│ + completar(respuestas: json) : void                            │
│ + __str__() : texto                                             │
└─────────────────────────────────────────────────────────────────┘
```

---



## PAQUETE 2 — contenido (Recursos, Temas y Quizzes)

---

### Clase: `Tema`
> Tabla: `tema`

```
┌─────────────────────────────────────────────────────────────────┐
│                            Tema                                 │
├─────────────────────────────────────────────────────────────────┤
│ - id          : entero    [PK]                                  │
│ - nombre      : texto[100] [unique] [NOT NULL]                  │
│ - descripcion : texto      [NOT NULL] (vacío permitido)         │
│ - orden       : entero     [NOT NULL]  default=0                │
│ - activo      : booleano   [NOT NULL]  default=True             │
├─────────────────────────────────────────────────────────────────┤
│ + activar() : void                                              │
│ + desactivar() : void                                           │
│ + __str__() : texto                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

### Clase: `Subtema`
> Tabla: `subtema` · Composición con `Tema` (CASCADE)
> unique_together: (tema_id, nombre)

```
┌─────────────────────────────────────────────────────────────────┐
│                           Subtema                               │
├─────────────────────────────────────────────────────────────────┤
│ - id          : entero    [PK]                                  │
│ - tema_id     : FK → Tema [NOT NULL] [CASCADE]                 │
│ - nombre      : texto[100] [NOT NULL]                           │
│ - descripcion : texto      [NOT NULL] (vacío permitido)         │
│ - orden       : entero     [NOT NULL]  default=0                │
│ - activo      : booleano   [NOT NULL]  default=True             │
├─────────────────────────────────────────────────────────────────┤
│ + activar() : void                                              │
│ + desactivar() : void                                           │
│ + __str__() : texto                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

### Clase: `Recurso`
> Tabla: `recurso`

```
┌─────────────────────────────────────────────────────────────────┐
│                           Recurso                               │
├─────────────────────────────────────────────────────────────────┤
│ - id                   : entero      [PK]                       │
│ - titulo               : texto[255]  [NOT NULL]                 │
│ - url                  : texto[500]  [NOT NULL]                 │
│ - descripcion          : texto       [NOT NULL] (vacío perm.)   │
│ - tema_id              : FK → Tema   [NOT NULL] [PROTECT]      │
│ - subtema_id           : FK → Subtema [nullable] [SET_NULL]    │
│ - categoria_vark       : texto[1]    [NOT NULL]                 │
│   {V, A, R, K}                                                  │
│ - nivel_complejidad    : texto[20]   [NOT NULL]                 │
│   {basico, intermedio, avanzado}                                │
│ - tipo_formato         : texto[20]   [NOT NULL]                 │
│   {video, articulo, ejercicio, documento}                       │
│ - activo               : booleano    [NOT NULL]  default=True   │
│ - url_valida           : booleano    [NOT NULL]  default=True   │
│ - ultima_verificacion  : fechaHora   [nullable]                 │
│ - sugerido_por_ia      : booleano    [NOT NULL]  default=False  │
│ - validado_por_id      : FK → Usuario [nullable] [SET_NULL]    │
│ - creado_por_id        : FK → Usuario [nullable] [SET_NULL]    │
│ - fecha_creacion       : fechaHora   [NOT NULL]  auto           │
│ - fecha_actualizacion  : fechaHora   [NOT NULL]  auto           │
├─────────────────────────────────────────────────────────────────┤
│ + activar() : void                                              │
│ + desactivar() : void                                           │
│ + verificarURL() : booleano                                     │
│ + __str__() : texto                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

### Clase: `SugerenciaIA`
> Tabla: `sugerencia_ia`

```
┌─────────────────────────────────────────────────────────────────┐
│                         SugerenciaIA                            │
├─────────────────────────────────────────────────────────────────┤
│ - id                       : entero      [PK]                   │
│ - titulo                   : texto[255]  [NOT NULL]             │
│ - url                      : texto[500]  [NOT NULL]             │
│ - descripcion              : texto       [NOT NULL] (vacío p.)  │
│ - justificacion_pedagogica : texto       [NOT NULL]             │
│ - tema_id                  : FK → Tema   [NOT NULL] [CASCADE]  │
│ - categoria_vark           : texto[1]    [NOT NULL] {V,A,R,K}  │
│ - nivel_complejidad        : texto[20]   [NOT NULL]             │
│ - tipo_formato             : texto[20]   [NOT NULL]             │
│ - estado                   : texto[20]   [NOT NULL]             │
│   {pendiente, aprobado, rechazado}                              │
│ - revisado_por_id          : FK → Usuario [nullable] [SET_NULL]│
│ - recurso_creado           : 1:1 → Recurso [nullable] [SET_NULL]│
│ - fecha_sugerencia         : fechaHora   [NOT NULL]  auto       │
│ - fecha_revision           : fechaHora   [nullable]             │
├─────────────────────────────────────────────────────────────────┤
│ + aprobar(revisor: Usuario) : Recurso                           │
│ + rechazar(revisor: Usuario) : void                             │
│ + __str__() : texto                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

### Clase: `Pregunta`
> Tabla: `pregunta` · Composición con `Tema` (CASCADE)

```
┌─────────────────────────────────────────────────────────────────┐
│                           Pregunta                              │
├─────────────────────────────────────────────────────────────────┤
│ - id               : entero      [PK]                           │
│ - enunciado        : texto       [NOT NULL]                     │
│ - tema_id          : FK → Tema   [NOT NULL] [CASCADE]          │
│ - subtema_id       : FK → Subtema [nullable] [SET_NULL]        │
│ - nivel_dificultad : texto[10]   [NOT NULL]                     │
│   {facil, media, dificil}                                       │
│ - activo           : booleano    [NOT NULL]  default=True       │
│ - creado_por_id    : FK → Usuario [nullable] [SET_NULL]        │
│ - fecha_creacion   : fechaHora   [NOT NULL]  auto               │
├─────────────────────────────────────────────────────────────────┤
│ + activar() : void                                              │
│ + desactivar() : void                                           │
│ + __str__() : texto                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

### Clase: `OpcionPregunta`
> Tabla: `opcion_pregunta` · Composición con `Pregunta` (CASCADE)

```
┌─────────────────────────────────────────────────────────────────┐
│                        OpcionPregunta                           │
├─────────────────────────────────────────────────────────────────┤
│ - id           : entero        [PK]                             │
│ - pregunta_id  : FK → Pregunta [NOT NULL] [CASCADE]            │
│ - texto        : texto[500]    [NOT NULL]                       │
│ - es_correcta  : booleano      [NOT NULL]  default=False        │
├─────────────────────────────────────────────────────────────────┤
│ + __str__() : texto                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

### Clase: `ResultadoQuiz`
> Tabla: `resultado_quiz` · Asociación con `Usuario` y `Tema` (CASCADE)

```
┌─────────────────────────────────────────────────────────────────┐
│                        ResultadoQuiz                            │
├─────────────────────────────────────────────────────────────────┤
│ - id                  : entero      [PK]                        │
│ - estudiante_id       : FK → Usuario [NOT NULL] [CASCADE]      │
│ - tema_id             : FK → Tema    [NOT NULL] [CASCADE]      │
│ - puntaje             : decimal      [NOT NULL]                 │
│ - total_preguntas     : entero       [NOT NULL]                 │
│ - respuestas_correctas: entero       [NOT NULL]                 │
│ - respuestas_json     : json         [NOT NULL]                 │
│ - fecha_realizacion   : fechaHora    [NOT NULL]  auto           │
├─────────────────────────────────────────────────────────────────┤
│ + calcularPuntaje(respuestas: json) : decimal                   │
│ + __str__() : texto                                             │
└─────────────────────────────────────────────────────────────────┘
```

---
---

## PAQUETE 3 — recomendacion (Motor CBF, Clickstream, Valoraciones)

---

### Clase: `EventoClickstream`
> Tabla: `evento_clickstream` · Asociación con `Usuario` y `Recurso` (CASCADE)

```
┌─────────────────────────────────────────────────────────────────┐
│                      EventoClickstream                          │
├─────────────────────────────────────────────────────────────────┤
│ - id                 : entero        [PK]                       │
│ - estudiante_id      : FK → Usuario  [NOT NULL] [CASCADE]      │
│ - recurso_id         : FK → Recurso  [NOT NULL] [CASCADE]      │
│ - tipo_evento        : texto[20]     [NOT NULL]                 │
│   {clic, permanencia, retorno, cierre}                          │
│ - duracion_segundos  : entero        [nullable]                 │
│ - timestamp          : fechaHora     [NOT NULL]  auto [idx]     │
│ - procesado          : booleano      [NOT NULL]  default=False  │
├─────────────────────────────────────────────────────────────────┤
│ + marcarProcesado() : void                                      │
│ + __str__() : texto                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

### Clase: `ValoracionRecurso`
> Tabla: `valoracion_recurso`
> unique_together: (estudiante_id, recurso_id)

```
┌─────────────────────────────────────────────────────────────────┐
│                      ValoracionRecurso                          │
├─────────────────────────────────────────────────────────────────┤
│ - id             : entero        [PK]                           │
│ - estudiante_id  : FK → Usuario  [NOT NULL] [CASCADE]          │
│ - recurso_id     : FK → Recurso  [NOT NULL] [CASCADE]          │
│ - valoracion     : texto[10]     [NOT NULL]  {util, no_util}   │
│ - comentario     : texto         [NOT NULL]  (vacío permitido)  │
│ - fecha          : fechaHora     [NOT NULL]  auto               │
├─────────────────────────────────────────────────────────────────┤
│ + __str__() : texto                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

### Clase: `Recomendacion`
> Tabla: `recomendacion`

```
┌─────────────────────────────────────────────────────────────────┐
│                         Recomendacion                           │
├─────────────────────────────────────────────────────────────────┤
│ - id                    : entero       [PK]                     │
│ - estudiante_id         : FK → Usuario [NOT NULL] [CASCADE]    │
│ - recurso_id            : FK → Recurso [NOT NULL] [CASCADE]    │
│ - tema_id               : FK → Tema    [NOT NULL] [CASCADE]    │
│ - puntuacion            : decimal      [NOT NULL]  (0.0 – 1.0) │
│ - justificacion         : texto        [NOT NULL]               │
│ - vector_vark_snapshot  : json         [NOT NULL]               │
│ - fecha_recomendacion   : fechaHora    [NOT NULL]  auto         │
│ - vista                 : booleano     [NOT NULL]  default=False│
├─────────────────────────────────────────────────────────────────┤
│ + marcarComoVista() : void                                      │
│ + __str__() : texto                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

### Clase: `HistorialPerfilVARK`
> Tabla: `historial_perfil_vark` · Composición con `Usuario` (CASCADE)

```
┌─────────────────────────────────────────────────────────────────┐
│                     HistorialPerfilVARK                         │
├─────────────────────────────────────────────────────────────────┤
│ - id               : entero        [PK]                         │
│ - estudiante_id    : FK → Usuario  [NOT NULL] [CASCADE]        │
│ - vector_anterior  : json          [NOT NULL]                   │
│ - vector_nuevo     : json          [NOT NULL]                   │
│ - origen           : texto[20]     [NOT NULL]                   │
│   {clickstream, quiz, test_inicial}                             │
│ - fecha            : fechaHora     [NOT NULL]  auto [idx]       │
├─────────────────────────────────────────────────────────────────┤
│ + calcularDelta() : json{V,A,R,K}                               │
│ + __str__() : texto                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

### Clase: `ConfiguracionMotor`
> Tabla: `configuracion_motor` · **Singleton** (pk siempre = 1)

```
┌─────────────────────────────────────────────────────────────────┐
│                      ConfiguracionMotor                         │
├─────────────────────────────────────────────────────────────────┤
│ - id                       : entero   [PK]  forzado = 1        │
│ - factor_decaimiento       : decimal  [NOT NULL]  default=0.85 │
│ - umbral_similitud         : decimal  [NOT NULL]  default=0.3  │
│ - max_recomendaciones      : entero   [NOT NULL]  default=8    │
│ - peso_valoracion_util     : decimal  [NOT NULL]  default=0.2  │
│ - dias_ventana_clickstream : entero   [NOT NULL]  default=30   │
│ - actualizado_en           : fechaHora [NOT NULL]  auto        │
├─────────────────────────────────────────────────────────────────┤
│ + obtener() : ConfiguracionMotor   «classmethod»                │
│ + save() : void   (fuerza pk=1 — patrón Singleton)             │
│ + __str__() : texto                                             │
└─────────────────────────────────────────────────────────────────┘
```
## PAQUETE 4 — analitica (Dashboards, Reportes, Experimentos, Notificaciones)

---

### Clase: `ExperimentoAB`
> Tabla: `experimento_ab`

```
┌─────────────────────────────────────────────────────────────────┐
│                         ExperimentoAB                           │
├─────────────────────────────────────────────────────────────────┤
│ - id            : entero        [PK]                            │
│ - nombre        : texto[200]    [NOT NULL]                      │
│ - descripcion   : texto         [NOT NULL]  (vacío permitido)   │
│ - estado        : texto[20]     [NOT NULL]                      │
│   {activo, finalizado}                                          │
│ - creado_por_id : FK → Usuario  [nullable] [SET_NULL]          │
│ - fecha_inicio  : fechaHora     [NOT NULL]  auto                │
│ - fecha_fin     : fechaHora     [nullable]                      │
├─────────────────────────────────────────────────────────────────┤
│ + finalizar() : void                                            │
│ + __str__() : texto                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

### Clase: `AsignacionExperimento`
> Tabla: `asignacion_experimento` · Composición con `ExperimentoAB` (CASCADE)
> unique_together: (experimento_id, estudiante_id)

```
┌─────────────────────────────────────────────────────────────────┐
│                    AsignacionExperimento                        │
├─────────────────────────────────────────────────────────────────┤
│ - id               : entero           [PK]                      │
│ - experimento_id   : FK → ExperimentoAB [NOT NULL] [CASCADE]  │
│ - estudiante_id    : FK → Usuario       [NOT NULL] [CASCADE]  │
│ - grupo            : texto[20]          [NOT NULL]              │
│   {experimental, control}                                       │
│ - fecha_asignacion : fechaHora          [NOT NULL]  auto        │
├─────────────────────────────────────────────────────────────────┤
│ + __str__() : texto                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

### Clase: `Notificacion`
> Tabla: `notificacion`

```
┌─────────────────────────────────────────────────────────────────┐
│                         Notificacion                            │
├─────────────────────────────────────────────────────────────────┤
│ - id               : entero        [PK]                         │
│ - destinatario_id  : FK → Usuario  [NOT NULL] [CASCADE]        │
│ - tipo             : texto[20]     [NOT NULL]                   │
│   {nuevo_recurso, nuevo_quiz, sistema}                          │
│ - titulo           : texto[255]    [NOT NULL]                   │
│ - mensaje          : texto         [NOT NULL]                   │
│ - recurso_id       : FK → Recurso  [nullable] [SET_NULL]       │
│ - leida            : booleano      [NOT NULL]  default=False    │
│ - fecha            : fechaHora     [NOT NULL]  auto             │
├─────────────────────────────────────────────────────────────────┤
│ + marcarLeida() : void                                          │
│ + __str__() : texto                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## RELACIONES UML COMPLETAS

### 1. HERENCIA  `——▷`
> La clase hija extiende a la clase padre. Flecha hueca apuntando al padre.

```
Usuario  ——▷  AbstractBaseUser
Usuario  ——▷  PermissionsMixin
```

---

### 2. COMPOSICIÓN  `◆——`
> El hijo NO puede existir sin el padre. Si el padre se elimina, el hijo también (CASCADE).
> Rombo RELLENO en el lado del padre.

| Padre | Hijo | Multiplicidad |
|---|---|---|
| `Usuario` | `PerfilVARK` | `1 ◆── 1` |
| `Usuario` | `SesionTestVARK` | `1 ◆── 0..*` |
| `Usuario` | `HistorialPerfilVARK` | `1 ◆── 0..*` |
| `Tema` | `Subtema` | `1 ◆── 0..*` |
| `Tema` | `Pregunta` | `1 ◆── 0..*` |
| `Pregunta` | `OpcionPregunta` | `1 ◆── 1..*` |
| `ExperimentoAB` | `AsignacionExperimento` | `1 ◆── 0..*` |

---

### 3. ASOCIACIÓN SIMPLE  `——`
> El hijo referencia al padre pero puede existir sin él (SET_NULL) o es dependencia lógica sin destrucción.
> Línea simple con multiplicidades en los extremos.

| Origen | Destino | Multiplicidad | ON DELETE |
|---|---|---|---|
| `Recurso` | `Tema` | `Tema 1 ——< 1..* Recurso` | PROTECT |
| `Recurso` | `Subtema` | `Subtema 0..1 ——< 0..* Recurso` | SET_NULL |
| `Recurso` | `Usuario` (creado_por) | `0..1 ——< 0..*` | SET_NULL |
| `Recurso` | `Usuario` (validado_por) | `0..1 ——< 0..*` | SET_NULL |
| `SugerenciaIA` | `Tema` | `1 ——< 0..*` | CASCADE |
| `SugerenciaIA` | `Usuario` (revisado_por) | `0..1 ——< 0..*` | SET_NULL |
| `SugerenciaIA` | `Recurso` | `0..1 ——— 0..1` | SET_NULL (OneToOne) |
| `Pregunta` | `Subtema` | `0..1 ——< 0..*` | SET_NULL |
| `Pregunta` | `Usuario` (creado_por) | `0..1 ——< 0..*` | SET_NULL |
| `ResultadoQuiz` | `Usuario` | `1 ——< 0..*` | CASCADE |
| `ResultadoQuiz` | `Tema` | `1 ——< 0..*` | CASCADE |
| `Recomendacion` | `Tema` | `1 ——< 0..*` | CASCADE |
| `ExperimentoAB` | `Usuario` (creado_por) | `0..1 ——< 0..*` | SET_NULL |
| `Notificacion` | `Usuario` | `1 ——< 0..*` | CASCADE |
| `Notificacion` | `Recurso` | `0..1 ——< 0..*` | SET_NULL |

---

### 4. ASOCIACIÓN M:N VIA CLASE ASOCIATIVA  `——<>——`
> La relación muchos a muchos se materializa como una clase con atributos propios.
> Rombo VACÍO en el centro.

```
Usuario  1 ——<>——  EventoClickstream  ——<>—— 1  Recurso
           0..*                          0..*
           (un estudiante genera muchos eventos sobre muchos recursos)

Usuario  1 ——<>——  ValoracionRecurso  ——<>—— 1  Recurso
           0..1                          0..*
           (un estudiante valora cada recurso máximo 1 vez — unique_together)

Usuario  1 ——<>——  Recomendacion     ——<>—— 1  Recurso
           0..*                          0..*
           (un estudiante recibe muchas recomendaciones de muchos recursos)

Usuario  1 ——<>——  AsignacionExperimento ——<>—— 1  ExperimentoAB
           0..*                               0..*
           (un estudiante puede estar en un experimento — unique_together)
```

---

## RESUMEN GENERAL

| Paquete | Clases de Dominio | Clases de Control | Total |
|---|---|---|---|
| accounts | 3 | 7 | 10 |
| contenido | 7 | 12 | 19 |
| recomendacion | 5 | 7 | 12 |
| analitica | 3 | 8 | 11 |
| **Total** | **18** | **34** | **52** |

| Tipo de relación | Cantidad | Notación |
|---|---|---|
| Herencia | 2 | `——▷` flecha hueca |
| Composición | 7 | `◆——` rombo relleno |
| Asociación simple | 15 | `——` línea simple |
| Asociación M:N (tabla intermedia) | 4 | `——<>——` rombo vacío |
| Dependencia (View → Model) | 34 | `- - ►` flecha discontinua |
