# ProfeECEP 3.0.8 · Correcciones de alineación con ECEP 2026

Se corrigieron las 173 preguntas señaladas por la revisión del banco 3.0.7: 172 observaciones de correspondencia con el temario y una clave errónea de Inglés. Hay 135 reformulaciones sustantivas; las otras 38 reciben ajustes de clasificación y, donde corresponde, de consigna o explicación. Los identificadores internos remiten a los indicadores oficiales transcritos, no son códigos del Ministerio.

| Especialidad | Preguntas corregidas | Banco activo |
|---|---:|---:|
| Matemática básica | 41 | 209 |
| Ciencias Naturales | 26 | 132 |
| Historia y Geografía | 41 | 130 |
| Inglés | 26 | 130 |
| Lenguaje básico | 23 | 130 |
| Lengua y Literatura media | 16 | 100 |
| **Total** | **173** | **831** |

## Qué cambió

- Se distinguen tareas de interpretación, cálculo, reconocimiento y decisiones pedagógicas. Se reubican las preguntas cuya habilidad correspondía a otro indicador.
- Se incorporan tablas, lecturas, cómics y 16 diagramas o mapas originales donde la tarea requiere una representación. Las tareas históricas incluyen síntesis secundarias identificadas como materiales didácticos originales; no se inventan citas de personajes ni documentos primarios.
- Las siete actividades antiguas de escucha sin audio ahora utilizan grabaciones originales ya disponibles. Las 23 preguntas activas del dominio auditivo tienen audio; la transcripción se muestra al revisar. Esto no reemplaza los siete audios históricos pendientes del cuadernillo 2023.
- La pregunta `basica-ingles-306-2023-35-r308` reconoce «Leo asked his friend if he could borrow his dictionary.» y explica el orden declarativo en preguntas indirectas. La clave histórica de referencia y la clave de la adaptación se almacenan por separado.
- Cada revisión tiene cuatro razones asociadas a sus propias alternativas. Se comprueban unicidad de opciones, claves, correspondencia entre clave y explicación, materiales y clasificación.
- Las opciones se permutan de modo determinista por pregunta; no se usa una secuencia A–B–C–D por número de catálogo.

## Continuidad

Los 173 identificadores anteriores y sus opciones permanecen recuperables para los simulacros guardados. Las prácticas nuevas seleccionan las revisiones. El entrenamiento de errores encuentra la revisión correspondiente y, al acertarla, resuelve el pendiente sin reescribir las respuestas históricas.

Se conservan 831 preguntas activas. El archivo completo suma 1.337 registros: 831 activos, 333 plantillas ya retiradas y 173 versiones anteriores de esta revisión. Las preguntas archivadas no se suman al contador de práctica disponible.

## Evidencia y reproducción

- [Hallazgos iniciales](auditoria-2026-308.json), [manifest de correcciones](correcciones-308.json).
- [Temarios oficiales consultados, URL y huella](../content-308/sources.json), [241 indicadores con página](../content-308/indicators-2026.json).
- Construcción: `python content-308/build.py`; no modifica los datos originales de 3.0.7.
- Verificación: `npm test`. Las pruebas cubren conservación de los bancos anteriores, respuestas guardadas, selección activa, feedback, audio, recursos offline y cálculos independientes. La revisión visual complementa las pruebas de lógica.

## Referencias de contraste editorial

- Biblioteca del Congreso Nacional, [organización política de 1823–1833](https://www.bcn.cl/historiapolitica/hitos_periodo/detalle_periodo.html?per=1823-1833).
- Biblioteca Nacional, [Constitución de 1833](https://www.memoriachilena.gob.cl/602/w3-article-3506.html) y [encomienda como institución](https://www.memoriachilena.gob.cl/602/w3-article-95228.html).
- Biblioteca del Congreso Nacional, [plebiscito de 1988](https://www.bcn.cl/historiapolitica/elecciones/detalle_eleccion?handle=10221.1%2F63196&periodo=1973-1990) y [periodo desde 1990](https://www.bcn.cl/historiapolitica/hitos_periodo/detalle_periodo.html?per=1990-2022).
- British Council, [Reported speech: questions](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/reported-speech-questions).

La presencia de práctica en los 241 indicadores no acredita cobertura exhaustiva de cada indicador, dificultad equivalente al examen ni calibración psicométrica. Son materiales de preparación, no preguntas oficiales de ECEP 2026. La revisión corrige los hallazgos identificados; sigue siendo pertinente ampliar diversidad de contextos y validar pedagógicamente con docentes de cada especialidad.
