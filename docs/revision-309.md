# ProfeECEP 3.0.9 · Reportes y repaso personal

## Alcance

La etiqueta «Calibrada» de 2.8.2 podía activarse tras tres respuestas de la misma cuenta. Ahora ambos paneles presentan únicamente intentos y porcentajes personales. Un porcentaje basado en intentos repetidos no se usa para afirmar dificultad o validez pedagógica. El panel estructural revisa campos, alternativas, duplicados y referencias; las marcas del estudiante se presentan separadamente como repaso personal.

Las marcas anteriores `questionReviews.status=validada` siguen almacenadas sin cambios. Al leerlas se muestran como «Repasada por mí»; ya no se ofrece el estado validada. Las marcas nuevas tampoco cambian el banco o sus claves.

## Reportes

Cada especialidad conserva sus observaciones en `questionReports`, dentro del mismo documento de progreso. Los motivos son ambigüedad, clave, explicación, material, temario, redacción y otro. El comentario admite 1.200 caracteres y es obligatorio para «Otro». Cada registro conserva fecha de creación/actualización, versión, ID, enunciado, alternativas e indicador. No incorpora la clave ni las explicaciones al formulario o a la exportación.

Las marcas antiguas de `flaggedQuestions` se leen sin migración destructiva. Un reporte editado sigue teniendo el mismo ID; archivar no borra el registro ni significa que el equipo haya corregido el ítem. Las observaciones sobre versiones anteriores se mantienen vinculadas al enunciado original y avisan cuando existe una revisión.

Los reportes se guardan con el progreso; se incluyen en su respaldo y reconciliación existentes. Los conflictos entre dispositivos siguen requiriendo elegir una copia. El informe descargable contiene exclusivamente los reportes de la especialidad activa, incluidos los archivados; no exporta historial, correo, credenciales ni el resto del progreso. Se comunica expresamente que no se envía automáticamente al equipo. Una bandeja central de recepción queda fuera de este alcance.

## Conservación y verificación

- Las huellas de los bancos activos y archivos completos de las seis especialidades se comparan con 3.0.8 en `tests/fixtures/bank-308-preservation.json`.
- Pruebas de persistencia, especialidades, marcas antiguas, edición, archivo/reapertura, límite de comentarios, error de almacenamiento, escape de HTML, exportación, paginación y ausencia de claves durante el simulacro.
- Los reportes no alteran notas, historial de respuestas, reloj, respuestas del simulacro ni conteos del banco.
- Recursos y documento offline versionados en 3.0.9, incluidos los estilos y el módulo de reportes.
- La autenticación y sincronización siguen teniendo pruebas con servidor simulado; esto no acredita una prueba entre dos dispositivos físicos con una cuenta real.

Comando: `npm test`. En un entorno Node 24 que limite la salida de subprocesos, `node --test --test-isolation=none --test-reporter=tap tests/*.test.cjs` permite ver cada caso individual.
