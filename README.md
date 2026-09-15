# ProfeECEP

Plataforma web para preparar la Evaluación de Conocimientos Específicos y Pedagógicos (ECEP) en Chile.

## Versión 3.0.3 — Continuidad y sincronización

- Sesión recuperable sin conexión, renovación de tokens al vencer y reintento al volver internet o a la aplicación. Estado visible de los cambios pendientes y de los errores.
- Recuperación del respaldo local de cada cuenta al entrar nuevamente; el cierre en línea intenta guardar y revoca la sesión de este dispositivo. Los cambios sin conexión se conservan para el próximo inicio de sesión.
- Sincronización serializada y actualización condicional por `updated_at`: no sobrescribe una escritura concurrente. Se compara cada especialidad con la última copia confirmada; cambios divergentes detienen el envío y ofrecen descargar ambas copias y elegir cuál conservar. No se suman estadísticas potencialmente duplicadas.
- Simulacros guardados localmente por cuenta y especialidad. Se recuperan preguntas, respuestas, marcas e índice al recargar. El tiempo continúa fuera de la pantalla; una sesión vencida se evalúa una sola vez al recuperarla.
- Doble toque en Responder protegido; comenzar una práctica conserva el simulacro pendiente sin evaluar las preguntas de la nueva práctica como parte de ese simulacro.
- Respaldos validados antes de reemplazar datos; una copia parcial conserva las demás especialidades. Se guarda una copia local anterior a la importación.
- Caché 3.0.3 con recursos nuevos y documento offline compatible. Las rutas API no reciben HTML de respaldo.

### Verificación 3.0.3

81 pruebas automatizadas: las 48 anteriores y 33 nuevas de cuenta, sincronización, carreras de escritura, recuperación, diagnóstico, respaldo y actualización offline. La red, los usuarios y los dispositivos de las pruebas automatizadas son simulados y no escriben datos de usuarios reales. La base remota conserva RLS por usuario; esta versión no requiere migraciones ni nuevas credenciales.

La recuperación del simulacro es local al dispositivo. El progreso finalizado se sincroniza; un simulacro en curso no se traslada a otro teléfono. La autenticación real con una cuenta y la sincronización entre dos dispositivos físicos requieren una prueba con credenciales del usuario; no se incluyen como verificadas por la suite simulada.

## Versión 3.0.2 — Experiencia móvil y accesibilidad

- Inicio con una acción principal según el progreso, accesos a estudio, práctica y simulacros, y un resumen de la especialidad activa.
- Las herramientas anteriores conservan sus controles dentro de tres secciones desplegables: plan y constancia, herramientas de estudio, e información y aplicación.
- Cabecera compacta, navegación inferior con sección activa y espacio seguro; controles táctiles y tipografía escalable.
- Ajustes de lectura accesibles desde la cabecera: tamaños de texto, modo oscuro, alto contraste y movimiento reducido. Se reutilizan las preferencias guardadas.
- Ventanas con nombre accesible, foco contenido, cierre con Escape y retorno al control que las abrió. Altura y scroll se ajustan al espacio disponible.
- Enlace para saltar al contenido, indicadores operables con teclado, etiquetas en formularios y estados anunciables en opciones y navegación.
- Caché 3.0.2 con los nuevos recursos. No modifica preguntas, identificadores, progreso, autenticación ni configuración de nube.

### Próximos avances

1. **3.0.4:** consistencia de contadores y etiquetas anteriores, mensajes y optimización.
2. **3.1 (alcance propuesto):** revisión editorial del banco y desarrollo de microlecciones pendientes.

## Versión 3.0.1 — Corrección de simulacros y microlecciones

- El simulacro largo selecciona hasta 60 preguntas **sin repetir identificadores**, redistribuye cupos si un dominio tiene pocas preguntas y conserva las respuestas del banco. El equilibrio entre dominios es una regla interna de práctica, no una ponderación oficial.
- Los simulacros configurables y de cobertura registran su duración real. Cambiar una respuesta no crea un segundo registro.
- Las guías se recuperan por indicador exacto y las ampliaciones del banco ya no las sobrescriben. Se conservan las 25 guías específicas iniciales de las cinco especialidades no matemáticas; las plantillas genéricas quedan como borradores y se muestra «Microlección específica pendiente» cuando corresponde.
- Matemática conserva sus guías históricas de subdominio con ese alcance visible. Los ejercicios y la práctica de una microlección se limitan al indicador elegido.
- El panel muestra la cantidad del banco activo y distingue los bancos completos no cargados. Sus comprobaciones son estructurales, no una certificación editorial o de instalación.
- La caché incluye las mismas URLs versionadas que la página. El documento HTML de respaldo se utiliza solo para navegación, nunca como respuesta a un script o llamada API.

Se mantienen las 714 preguntas, sus identificadores, la separación de progreso por especialidad y el contador de días oculto. Esta actualización no reescribe las preguntas de cobertura ni sus explicaciones: la revisión editorial continúa pendiente.

### Pruebas de regresión

Requieren Node.js 22 o posterior, sin instalar dependencias:

```sh
npm test
```

Las pruebas cargan los scripts reales en el orden de `index.html`, generan 100 simulacros por especialidad y verifican selección, puntajes, omisiones, duración, guías, práctica por indicador y persistencia aislada. También comprueban las rutas de caché y la sintaxis de los scripts.

Son pruebas automatizadas de lógica con almacenamiento, red y DOM simulados. **No sustituyen una prueba visual en celular, la autenticación real ni la verificación de la URL pública en Vercel.** Subir a `work` puede crear una vista previa protegida; no equivale a actualizar producción.

## Versión 2.1

Especialidades oficiales 2026 cargadas:
- Educación Básica Matemática
- Educación Básica Ciencias Naturales
- Educación Básica Historia, Geografía y Ciencias Sociales
- Educación Básica Inglés
- Educación Básica Lenguaje y Comunicación
- Educación Media Lengua y Literatura

### Nuevo en 2.1 — Generador inteligente de simulacros
Permite configurar:
- cantidad de preguntas;
- dificultad;
- dominios;
- enfoque equilibrado;
- enfoque en debilidades;
- enfoque en errores pendientes;
- distribución equilibrada entre dominios.

El generador utiliza únicamente el banco disponible de la especialidad activa. Si una especialidad aún no tiene preguntas propias, ProfeECEP informa que el banco está pendiente y no reutiliza preguntas de otra asignatura.

La duración se calcula automáticamente según la cantidad seleccionada y el simulacro mantiene navegación, marcado para revisión, cronómetro y análisis final.

## Contenido oficial y contenido propio
Los temarios cargados corresponden a la estructura de los documentos ECEP 2026 entregados por el usuario. Las preguntas, guías, simulacros y explicaciones de ProfeECEP son contenido propio y se identifican como tal.

## Versión 2.3

Los bancos iniciales de las cinco especialidades no matemáticas pasan de 5 a 10 preguntas propias por especialidad. Cada pregunta se asocia a un indicador del temario, incorpora dificultad, habilidad, explicación y retroalimentación de alternativas.

La aplicación conserva el progreso separado por especialidad y mantiene Matemática compatible con las versiones anteriores.


## Banco ampliado 2.8

La expansión 2.8 incorpora 20 preguntas propias adicionales por especialidad. El banco queda con 80 preguntas para Educación Básica Matemática y 30 para cada una de las otras cinco especialidades. Cada pregunta incluye indicador, habilidad, dificultad y explicación de la alternativa correcta; se identifica como contenido propio y no como pregunta oficial.


## Cobertura 2.8.1

La fase 2.8.1 asegura al menos dos oportunidades de trabajo por cada indicador del temario activo. El banco resultante contiene 178 preguntas para Matemática, 86 para Ciencias Naturales, 80 para Historia y Geografía, 82 para Inglés, 60 para Lenguaje básico y 77 para Lengua y Literatura media. Las preguntas generadas para cubrir indicadores se identifican como contenido propio de cobertura y quedan disponibles para una revisión editorial posterior.

## Clasificación y tutor 2.8.5

Las preguntas incluyen dominio, subdominio, indicador exacto, habilidad, tipo, dificultad, origen y explicación de alternativas. El tutor socrático guía el razonamiento en pasos antes de mostrar la solución y permite iniciar sesiones a partir de errores pendientes.

## Accesibilidad, calendario e informes 2.8.6

La aplicación incorpora controles de tamaño de texto, alto contraste, modo oscuro y reducción de movimiento, con preferencias guardadas en el dispositivo. También muestra la cuenta regresiva de las sesiones ECEP previstas para el 18 y 19 de diciembre de 2026 y enlaces a la información oficial. El progreso se puede descargar como JSON o CSV, o imprimir como informe resumido por especialidad y dominio.

## Banco ampliado y fuentes públicas 2.8.7

Se agregan 151 preguntas originales de práctica: 49 para Educación Básica Matemática, 22 para Ciencias Naturales y 20 para cada una de las otras cuatro especialidades. Cada ítem queda clasificado por dominio, subdominio, indicador, habilidad, dificultad y tipo de tarea, con explicación de la respuesta.

La expansión se diseñó a partir de los temarios ECEP 2026 y del formato descrito por CPEIP/Docentemás para las pruebas públicas (60 preguntas de selección múltiple, cuatro alternativas, dominios y niveles de complejidad). La aplicación enlaza los portales oficiales y las publicaciones de cuadernillos y plantillas liberados por año. Las preguntas de ProfeECEP son nuevas, no son preguntas oficiales ni provienen de filtraciones o material obtenido de forma no autorizada.

## Ajuste de calendario 2.8.8

Se mantiene la información de las fechas ECEP, pero se oculta la cuenta regresiva de días para evitar presión visual y dejar el calendario como referencia informativa.

## Versión 3.0 — Cierre de lanzamiento

La versión 3.0 incorpora un panel de estado que comprueba en el navegador las seis especialidades, la estructura de sus preguntas, la ausencia de identificadores o enunciados duplicados, el sistema de progreso, el manifiesto instalable y el soporte offline.

También renueva la caché de la aplicación para que los celulares reciban el build final y elimina automáticamente cachés anteriores. El contador de días para la ECEP permanece oculto. Las preguntas siguen identificadas según su procedencia: el contenido propio de ProfeECEP no se presenta como pregunta oficial.
