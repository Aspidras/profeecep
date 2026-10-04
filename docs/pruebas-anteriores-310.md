# Lengua y Literatura de Educación Media · EM-L 2023

## Material recibido y resultado

El 4 de octubre de 2026 se recibieron `EM-L(23).pdf` (40 páginas, 46 preguntas) y `EM-L(23)_claves.pdf` (46 claves). Se revisaron las 46 fuentes, incluido el material visual. Todas tienen una adaptación nueva: **46 preguntas y 184 explicaciones**, además de seis recursos SVG originales y textos de práctica propios. El cuadernillo y su pauta no se redistribuyen en el repositorio.

| Banco activo | Antes | Después |
|---|---:|---:|
| Lengua y Literatura media | 100 | 146 |
| Otras cinco especialidades | 731 | 731 |
| Total | 831 | 877 |

Los 831 ítems anteriores y sus versiones históricas se conservan íntegros. Las incorporaciones tienen identificadores nuevos, sin reasignar respuestas ni registros de progreso. Hay 196 adaptaciones de pruebas anteriores entre las seis especialidades.

## Correspondencia con el temario

Cada adaptación se vincula con un indicador del documento oficial 2026 de Lengua y Literatura conservado en la revisión del 28 de septiembre. El lote aporta práctica adicional en **30 de sus 38 indicadores**; no pretende cubrir por sí solo todo el temario. La transcripción y el número de página se contrastan con `content-308/indicators-2026.json`. Los códigos internos no son códigos oficiales del Ministerio.

La URL oficial del documento fue consultada nuevamente el 4 de octubre, pero redirigió a un enlace temporal que la herramienta no pudo recuperar. Se utiliza la copia previamente verificada y su huella, registrada en `content-310/source.json`; no se afirma una nueva descarga ni una actualización del temario.

Las claves históricas y las de práctica se almacenan separadamente. Cada adaptación reordena sus alternativas de forma determinista, conservando unidas opción y explicación. Sus textos y recursos son materiales de estudio originales inspirados en la tarea fuente, no transcripciones del cuadernillo ni preguntas oficiales de ECEP 2026. La dificultad es una estimación editorial, sin calibración psicométrica.

## Ajustes pedagógicos principales

- Pregunta fuente 5: la explicación del microcuento reconoce narratividad condensada y antecedentes implícitos; no exige que cada texto despliegue explícitamente conflicto, clímax y desenlace.
- Fuentes 9 y 18: se distingue persona gramatical, representación del discurso y focalización. La nueva tarea de focalización cero ofrece acceso a dos interioridades y a información desconocida por ambos personajes.
- Fuentes 13 y 25: se diferencia una visión representada en el relato de un hecho histórico demostrado o de una adhesión del autor.
- Fuentes 19, 23, 26 y 27: se aportan rasgos y contextos suficientes para fundamentar clasificaciones dramáticas, histórico-literarias y teóricas.
- Fuentes 38, 42 y 43: los segmentos ortográficos o cohesivos aparecen escritos en la consigna; no dependen de conservar un subrayado del escaneo. Se aplica la regla de hiato y se precisa la función de `más` como cuantificador en el ejemplo nuevo.
- Fuente 46: un foro se define por intercambio temático y moderación; no se afirma que excluya preparación previa ni que deba terminar en consenso.

## Formatos y acceso

El catálogo «Pruebas anteriores · 2023» aparece ahora también en Lengua y Literatura media. Sus filtros incluyen textos y viñetas, gráficos y situaciones de aula. Los seis esquemas y afiches son originales, tienen descripción textual, pueden ampliarse y se incluyen en la caché sin conexión. Las notas de adaptación y las explicaciones se muestran después de responder.

El registro [revision-fuentes-310.json](revision-fuentes-310.json) documenta las 46 decisiones, páginas, claves originales, claves de práctica e indicadores. La construcción se reproduce con `python3 content-310/draw_resources.py` y `python3 content-310/build.py`.

## Material pendiente de otras especialidades

Con estos archivos quedan recibidos los cuadernillos y pautas de las seis especialidades actuales. Siguen pendientes los **siete audios de Inglés 2023** documentados en [pruebas-anteriores-306.md](pruebas-anteriores-306.md). Estos PDF no los sustituyen.

## Verificación

La suite automatizada comprueba conservación del banco histórico, inventario y trazabilidad del lote, clasificación por indicador, separación de claves, cuatro razones por pregunta, materiales sin soluciones anticipadas, revisión y tutor, reportes, recuperación de simulacro y recursos offline. La revisión visual en navegador complementa esas comprobaciones; las pruebas automáticas no certifican validez pedagógica ni equivalencia con la prueba oficial.
