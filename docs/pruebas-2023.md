# Pruebas aportadas de 2023: análisis e incorporación 3.0.5

Se analizaron tres cuadernillos de Educación Básica y sus pautas: Matemática (48 ítems), Ciencias Naturales (53) y Lenguaje y Comunicación (45): **146 referencias**. El archivo PC-M(23).pdf tiene portada de Matemática básica y su pauta se identifica como EB-M(23); no se deduce el nivel del nombre del archivo.

Se publica una selección de **90 adaptaciones**, 30 por especialidad, para ampliar representaciones y habilidades sin importar de forma ciega el OCR. Las 56 referencias restantes quedan registradas en [revision-2023.json](revision-2023.json), con observaciones particulares cuando corresponde. No son 146 preguntas nuevas, ni se afirma que las no seleccionadas sean todas inválidas.

## Relación con 2026

El [sitio oficial ECEP](https://www.evaluacionconocimientos.cl/) consultado el 21 de septiembre de 2026 describe una prueba de 60 preguntas de selección múltiple que integra conocimientos disciplinarios y pedagógicos. La clasificación de esta entrega usa los indicadores del temario 2026 ya cargado en ProfeECEP. Los enlaces de descarga de los tres PDF oficiales dieron error en esta revisión: no se certifica una comparación nueva línea por línea con esos PDF.

Los formatos de tablas, figuras, lecturas, casos y análisis de error proceden de los cuadernillos aportados. No se presentan como una predicción de las preguntas de 2026. La dificultad es editorial, no un resultado psicométrico, y el simulador mantiene su distribución propia por dominios.

## Decisiones editoriales

- 360 explicaciones redactadas para las alternativas concretas de los 90 ítems. La respuesta correcta no se justifica por autoridad de la pauta: se resuelve el problema adaptado.
- Claves de las tres pautas extraídas directamente de sus PDF, con huellas SHA-256 en la [referencia de pruebas](../tests/fixtures/prior-keys-2023.json). Se mantiene la letra de las claves en la selección; los textos han cambiado y están identificados como adaptaciones.
- Matemática 13: recuperación del período decimal. Matemática 46: 0,3490 en 500 giros no corresponde a un conteo entero; se usa 174/500. Matemática 48: se explicita conteo por posiciones para evitar confundir pares ordenados con combinaciones.
- Ciencias 1, 19, 26 y 44: variables de control y condiciones del modelo explícitas. Ciencias 42: caja deslizante para distinguir roce cinético. Ciencias 43: gravedad local indicada y masa separada del peso. Ciencias 48: lámparas de tensión nominal conocida.
- Lecturas, cómic e infografía de práctica originales, salvo el poema de Xavier Villaurrutia transcrito del cuadernillo aportado con atribución. Dos preguntas comparten la infografía y cada una muestra el recurso completo.
- Trece recursos SVG, con texto alternativo descriptivo, ampliación y precaché para uso sin conexión. Las tablas conservan encabezados y desplazamiento horizontal cuando hace falta.

## Alcance de la revisión

Es revisión asistida de contenido y coherencia, sin validación independiente de especialistas. No se cambia la autoría de las fuentes aportadas ni se atribuye carácter oficial a las adaptaciones. Se preservan los 714 ítems anteriores, sus claves y los identificadores que usa el progreso; el banco pasa a 804.

Referencias conceptuales consultadas: [transporte activo, OpenStax](https://openstax.org/books/biology-2e/pages/5-3-active-transport) y [quien, RAE-ASALE](https://www.rae.es/dpd/quien). No se incorporan sus ilustraciones ni transcripciones.

## Trazabilidad de las 90 adaptaciones

| Especialidad | Referencia 2023 | Página | Clave | Indicador cargado | Formato |
|---|---:|---:|:---:|---|---|
| matematica | 1 | 2 | D | 4-0-0 | caso pedagógico |
| matematica | 2 | 2 | D | 4-0-1 | caso pedagógico |
| matematica | 5 | 5 | D | 4-0-1 | caso pedagógico |
| matematica | 6 | 5 | A | 4-0-5 | análisis de error |
| matematica | 7 | 6 | C | 4-0-1 | diagrama |
| matematica | 9 | 8 | A | 4-1-1 | análisis de error |
| matematica | 11 | 10 | C | 4-2-1 | caso pedagógico |
| matematica | 12 | 11 | C | 4-2-1 | caso pedagógico |
| matematica | 13 | 12 | A | 0-0-1 | expresión matemática |
| matematica | 14 | 12 | D | 0-0-2 | problema contextualizado |
| matematica | 16 | 13 | C | 0-1-0 | tabla |
| matematica | 17 | 14 | A | 0-1-2 | problema contextualizado |
| matematica | 18 | 14 | A | 0-2-0 | expresión matemática |
| matematica | 20 | 15 | B | 0-2-0 | expresión matemática |
| matematica | 21 | 15 | B | 1-0-0 | expresión matemática |
| matematica | 22 | 16 | B | 1-0-1 | problema contextualizado |
| matematica | 23 | 16 | C | 1-1-0 | problema contextualizado |
| matematica | 24 | 17 | B | 1-1-1 | problema contextualizado |
| matematica | 25 | 17 | B | 1-2-0 | problema contextualizado |
| matematica | 27 | 19 | A | 1-2-2 | gráfico |
| matematica | 28 | 20 | A | 1-2-3 | tabla |
| matematica | 32 | 21 | C | 2-0-3 | diagrama |
| matematica | 33 | 22 | B | 2-1-1 | diagrama |
| matematica | 35 | 24 | D | 2-1-3 | diagrama |
| matematica | 36 | 24 | C | 2-0-2 | problema conceptual |
| matematica | 40 | 26 | C | 3-0-0 | gráfico |
| matematica | 42 | 27 | B | 3-0-1 | tabla |
| matematica | 44 | 29 | B | 3-0-3 | problema contextualizado |
| matematica | 46 | 30 | C | 3-1-1 | tabla |
| matematica | 48 | 31 | D | 3-1-2 | tabla |
| ciencias | 1 | 2 | A | 6-0-0 | diseño experimental |
| ciencias | 3 | 3 | D | 6-0-1 | diagrama |
| ciencias | 5 | 4 | D | 6-0-3 | análisis de error |
| ciencias | 6 | 5 | A | 6-0-0 | gráfico |
| ciencias | 8 | 7 | A | 6-0-1 | modelo de proceso |
| ciencias | 12 | 9 | A | 6-1-1 | análisis de error |
| ciencias | 13 | 10 | A | 6-1-1 | análisis de error |
| ciencias | 16 | 12 | D | 6-2-1 | caso pedagógico |
| ciencias | 17 | 12 | C | 6-2-1 | caso pedagógico |
| ciencias | 18 | 13 | B | 5-0-0 | diseño experimental |
| ciencias | 19 | 14 | A | 5-0-1 | diseño experimental |
| ciencias | 20 | 15 | B | 5-0-1 | tabla |
| ciencias | 22 | 16 | D | 2-0-0 | modelo experimental |
| ciencias | 23 | 17 | B | 5-0-2 | tabla |
| ciencias | 26 | 18 | A | 0-0-0 | tabla |
| ciencias | 28 | 19 | A | 0-1-1 | modelo de proceso |
| ciencias | 29 | 20 | C | 0-1-3 | problema conceptual |
| ciencias | 30 | 20 | C | 0-1-2 | problema conceptual |
| ciencias | 36 | 22 | B | 1-0-0 | problema conceptual |
| ciencias | 37 | 23 | A | 1-1-1 | modelo de proceso |
| ciencias | 38 | 23 | C | 1-1-0 | problema contextualizado |
| ciencias | 40 | 24 | A | 2-0-1 | modelo de proceso |
| ciencias | 42 | 25 | A | 3-0-2 | diagrama |
| ciencias | 43 | 26 | A | 3-0-0 | tabla |
| ciencias | 44 | 26 | A | 3-0-1 | tabla |
| ciencias | 45 | 27 | C | 3-1-0 | diagrama |
| ciencias | 47 | 28 | B | 3-1-5 | problema contextualizado |
| ciencias | 48 | 28 | A | 3-1-6 | caso aplicado |
| ciencias | 50 | 30 | D | 4-0-0 | tabla |
| ciencias | 53 | 31 | A | 4-0-2 | diagrama |
| lenguaje | 1 | 2 | C | 2-0-4 | caso pedagógico |
| lenguaje | 2 | 2 | D | 2-0-4 | caso pedagógico |
| lenguaje | 3 | 3 | C | 2-0-1 | texto poético |
| lenguaje | 6 | 5 | B | 2-0-7 | caso pedagógico |
| lenguaje | 8 | 6 | A | 2-0-2 | caso pedagógico |
| lenguaje | 9 | 7 | C | 2-0-5 | afiche |
| lenguaje | 10 | 8 | C | 2-1-1 | texto dramático |
| lenguaje | 11 | 8 | D | 2-1-0 | caso pedagógico |
| lenguaje | 12 | 9 | C | 2-2-0 | caso pedagógico |
| lenguaje | 13 | 10 | B | 2-2-2 | retroalimentación |
| lenguaje | 14 | 11 | C | 2-2-2 | retroalimentación |
| lenguaje | 15 | 12 | B | 0-0-0 | texto narrativo |
| lenguaje | 16 | 13 | C | 0-0-4 | texto narrativo |
| lenguaje | 17 | 14 | C | 0-0-0 | texto narrativo |
| lenguaje | 19 | 15 | C | 0-0-1 | texto poético |
| lenguaje | 21 | 17 | C | 0-0-2 | texto poético |
| lenguaje | 24 | 20 | C | 2-2-0 | texto dramático |
| lenguaje | 26 | 22 | D | 0-1-0 | texto informativo |
| lenguaje | 27 | 22 | C | 0-0-5 | cómic |
| lenguaje | 28 | 23 | C | 0-1-5 | texto de opinión |
| lenguaje | 29 | 24 | B | 0-1-4 | texto argumentativo |
| lenguaje | 31 | 26 | C | 0-1-4 | texto argumentativo |
| lenguaje | 33 | 27 | B | 1-0-0 | cohesión textual |
| lenguaje | 34 | 27 | A | 1-0-0 | cohesión textual |
| lenguaje | 35 | 28 | A | 0-1-4 | hechos y opiniones |
| lenguaje | 36 | 29 | C | 0-1-2 | infografía |
| lenguaje | 37 | 30 | A | 0-1-2 | infografía |
| lenguaje | 40 | 31 | D | 1-1-0 | ortografía contextual |
| lenguaje | 43 | 33 | B | 1-1-2 | discurso oral |
| lenguaje | 45 | 34 | B | 1-1-1 | diálogo académico |
