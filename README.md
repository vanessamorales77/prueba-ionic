# App List — To-Do List con categorías (Ionic + Angular + Capacitor)

Prueba técnica para el rol de Frontend Developer. Aplicación híbrida de lista de tareas (To-Do List) construida con **Ionic 8**, **Angular 20 (standalone components)** y **Capacitor**, con persistencia local mediante `@capacitor/preferences`.

## Decisiones técnicas

**Capacitor en lugar de Cordova.** El enunciado original de la prueba menciona Cordova, pero se optó por Capacitor porque es el runtime nativo recomendado actualmente por el propio equipo de Ionic; Cordova se encuentra en modo de mantenimiento/legado. Capacitor es compatible con el mismo flujo de trabajo de Ionic y permite compilar tanto para Android como para iOS.

**Modelo de datos con `id` único.** Tanto las tareas como las categorías se identifican con un `id` generado con `crypto.randomUUID()`, en lugar de usar el texto como identificador. Esto evita conflictos cuando hay nombres duplicados y permite operaciones seguras de edición/eliminación sin afectar registros que no correspondan.

**`@capacitor/preferences` para almacenamiento local.** Se eligió sobre `localStorage` porque, al ejecutarse dentro de una app nativa empaquetada, usa el almacenamiento nativo de cada plataforma (`UserDefaults` en iOS, `SharedPreferences` en Android) en lugar de depender del WebView, lo que lo hace más confiable en dispositivos reales.

## Limitaciones conocidas

**No se entrega archivo IPA ni build de iOS.** Generar y firmar una build de iOS requiere Xcode, que solo corre en macOS, y no se contó con acceso a un equipo macOS durante el desarrollo de esta prueba (ni físico ni en la nube). El código de la aplicación es multiplataforma por estar construido sobre Ionic/Angular y Capacitor, por lo que en un entorno con macOS disponible debería poder compilarse para iOS siguiendo los mismos pasos documentados en la sección [Ejecutar en iOS](#ejecutar-en-ios), sin cambios adicionales en el código. Se priorizó dejar completamente funcional y verificado el build de Android, junto con el resto de los requerimientos de la prueba (categorías, Firebase/Remote Config, optimización de rendimiento), dentro del tiempo disponible.

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
ionic capacitor build android
button-inner   # Se debe ejecutar despues de hacer el build para generar los iconos
```

Esto abre el proyecto en Android Studio, desde donde se puede ejecutar en un emulador o dispositivo físico.

## Ejecutar en iOS

```bash
ionic capacitor build ios
npm run generate-icons-ios    # Se debe ejecutar despues de hacer el build para generar los iconos
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

### Firebase y feature flag

Se creo el proyecto "app-list" en firebase. En la consola se agrego la app tipo web "app-list-web". Una vez creada la app, en el menu "Categorías de producto" en la opción Remote Config se creo la feature flag de tipo booleano, la cual controla si la funcionalidad de categorías se muestra según su valor, su valor viene de Firebase Remote Config (parámetro "show_categories"), true para verlas, false para esconderlas.
Se guardaron las variables de entorno en el enviroment.ts y en el enviroment.prod.ts
Se creo el servicio remote-config y se agregó la propiedad minimumFetchIntervalMillis de 10 segundos para no esperar las 12 horas de intervalo que trae por defecto firebase
En home.page.ts se creo el atributo categoriesEnabled y se inyecto el servicio RemoteConfigService

### Rendimiento

Se activó `ChangeDetectionStrategy.OnPush` en `home.page.ts` para que Angular no revise esta pantalla en cada ciclo de detección de cambios, sino solo cuando ocurre una interacción propia de su plantilla (clic, `ngModel`, etc.). Como algunas actualizaciones de datos ocurren fuera de ese flujo normal, se inyectó `ChangeDetectorRef` y se llama a `markForCheck()` en esos puntos puntuales para que la vista se siga actualizando bien:

- Al terminar de cargar las tareas y categorías guardadas en `ionViewWillEnter` (es un hook async, no un clic directo).
- Dentro del callback de confirmación de `deleteTask` y `deleteCategory`, porque el botón "Eliminar" vive dentro del `ion-action-sheet`, que es un componente aparte de `HomePage`.

Se instala e implementa Prettier - Code para formatear el código de una manera estandar
