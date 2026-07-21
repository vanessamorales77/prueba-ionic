# App List — To-Do List con categorías (Ionic + Angular + Capacitor)

Prueba técnica para el rol de Frontend Developer. Aplicación híbrida de lista de tareas (To-Do List) construida con **Ionic 8**, **Angular 20 (standalone components)** y **Capacitor**, con persistencia local mediante `@capacitor/preferences`.

## Estado del proyecto

Este README se actualiza a medida que se avanza en la prueba. Estado actual:

- [x] Lista de tareas: agregar, marcar como completada, eliminar.
- [x] Persistencia local de tareas con `@capacitor/preferences`.
- [x] Categorías: crear, editar, eliminar.
- [x] Asignar categoría a cada tarea.
- [x] Filtrar tareas por categoría.
- [x] Persistencia local de categorías con `@capacitor/preferences`.
- [ ] Estructura híbrida verificada para build de Android.
- [x] ~~Build de iOS~~ — no realizable en este entorno, ver sección [Limitaciones conocidas](#limitaciones-conocidas).
- [ ] Integración de Firebase.
- [ ] Feature flag con Firebase Remote Config.
- [ ] Optimización de rendimiento (carga inicial, listas grandes, memoria).
- [ ] Exportación de APK.
- [ ] Capturas/video de las funcionalidades.
- [ ] Respuestas a las preguntas técnicas de la prueba.

## Decisiones técnicas

**Capacitor en lugar de Cordova.** El enunciado original de la prueba menciona Cordova, pero se optó por Capacitor porque es el runtime nativo recomendado actualmente por el propio equipo de Ionic; Cordova se encuentra en modo de mantenimiento/legado. Capacitor es compatible con el mismo flujo de trabajo de Ionic y permite compilar tanto para Android como para iOS.

**Modelo de datos con `id` único.** Tanto las tareas como las categorías se identifican con un `id` generado con `crypto.randomUUID()`, en lugar de usar el texto como identificador. Esto evita conflictos cuando hay nombres duplicados y permite operaciones seguras de edición/eliminación sin afectar registros que no correspondan.

**`@capacitor/preferences` para almacenamiento local.** Se eligió sobre `localStorage` porque, al ejecutarse dentro de una app nativa empaquetada, usa el almacenamiento nativo de cada plataforma (`UserDefaults` en iOS, `SharedPreferences` en Android) en lugar de depender del WebView, lo que lo hace más confiable en dispositivos reales.

## Limitaciones conocidas

**No se entrega archivo IPA ni build de iOS.** Generar y firmar una build de iOS requiere Xcode, que solo corre en macOS, y no se contó con acceso a un equipo macOS durante el desarrollo de esta prueba (ni físico ni en la nube). El código de la aplicación es multiplataforma por estar construido sobre Ionic/Angular y Capacitor, por lo que en un entorno con macOS disponible debería poder compilarse para iOS siguiendo los mismos pasos documentados en la sección [Ejecutar en iOS](#ejecutar-en-ios), sin cambios adicionales en el código. Se priorizó dejar completamente funcional y verificado el build de Android, junto con el resto de los requerimientos de la prueba (categorías, Firebase/Remote Config, optimización de rendimiento), dentro del tiempo disponible.

## Estructura del proyecto

```
app-list/
├── src/
│   └── app/
│       ├── models/
│       │   ├── tasks.model.ts       # Interfaz Task (id, name, completed, categoryId)
│       │   └── category.model.ts    # Interfaz Category (id, name)
│       ├── pages/
│       │   └── home/
│       │       ├── home.page.ts     # Lógica de tareas y categorías
│       │       ├── home.page.html   # Vista principal
│       │       └── home.page.scss
│       └── services/
│           └── action-sheet.ts      # Confirmaciones y mensajes con ion-action-sheet
```

## Requisitos previos

- Node.js (LTS recomendado)
- npm
- [Ionic CLI](https://ionicframework.com/docs/cli): `npm install -g @ionic/cli`
- Para compilar en Android: Android Studio con el SDK configurado.
- Para compilar en iOS: macOS con Xcode instalado.
- npm install @capacitor/android
- npm install @capacitor/ios


## Instalación

```bash
cd app-list
npm install
```

## Ejecutar en el navegador (desarrollo)

```bash
ionic serve
```

## Ejecutar en Android

```bash
npx cap add android      # solo la primera vez
npx cap sync android
npx cap open android
```

Esto abre el proyecto en Android Studio, desde donde se puede ejecutar en un emulador o dispositivo físico.

## Ejecutar en iOS

```bash
npx cap add ios      # solo la primera vez
npx cap sync ios
npx cap open ios
```

Esto abre el proyecto en Xcode, desde donde se puede ejecutar en un simulador o dispositivo físico.

> **Nota:** estos comandos requieren macOS con Xcode instalado. No fue posible ejecutarlos ni generar el IPA en este entorno de desarrollo por no contar con acceso a una Mac — ver [Limitaciones conocidas](#limitaciones-conocidas).

## Funcionalidades

### Tareas

- Agregar una tarea escribiendo su nombre y presionando "Agregar" (no permite tareas con nombre duplicado).
- Marcar/desmarcar una tarea como completada con el checkbox; el texto se tacha visualmente.
- Eliminar una tarea mediante el ícono de basurero, con confirmación por action sheet.
- Cada tarea puede asignarse a una categoría al momento de crearla.

### Categorías

- Crear una nueva categoría escribiendo su nombre (no permite nombres duplicados).
- Editar el nombre de una categoría existente desde el ícono de lápiz (edición en línea, sin ventanas emergentes).
- Eliminar una categoría con confirmación por action sheet; las tareas que tenían esa categoría no se eliminan, solo quedan sin categoría asignada.
- Filtrar la lista de tareas por categoría desde el selector "Filtrar por categoría".

### Persistencia

Tanto las tareas como las categorías se guardan automáticamente en el almacenamiento local del dispositivo (`@capacitor/preferences`) cada vez que se crean, editan o eliminan, y se recuperan al volver a abrir la pantalla.

## Pendiente por documentar

- [ ] Integración de Firebase y Remote Config, con demostración del feature flag.
- [ ] Técnicas de optimización de rendimiento aplicadas.
- [ ] Enlace de descarga del archivo APK.
- [ ] Capturas de pantalla o video de la aplicación en funcionamiento.
- [ ] Respuestas a las preguntas técnicas de la prueba (desafíos, optimización, calidad y mantenibilidad del código). La limitación de no poder generar el build de iOS es un buen candidato para mencionar en la pregunta sobre "principales desafíos".
