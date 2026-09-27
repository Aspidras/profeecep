# ProfeECEP 3.0.7 — banco de práctica

| Especialidad | Específicas conservadas | Nuevas | Activas | Plantillas archivadas |
|---|---:|---:|---:|---:|
| Básica Matemática | 159 | 50 | 209 | 98 |
| Básica Ciencias | 82 | 50 | 132 | 56 |
| Básica Historia | 80 | 50 | 130 | 50 |
| Básica Inglés | 80 | 50 | 130 | 52 |
| Básica Lenguaje | 80 | 50 | 130 | 30 |
| Media Lengua y Literatura | 50 | 50 | 100 | 47 |
| Total | 531 | 300 | 831 | 333 |

Los 864 objetos anteriores se conservan exactamente. Las 333 plantillas repetitivas se retiran de nuevas selecciones, pero sus enunciados, claves y explicaciones permanecen accesibles a la recuperación de simulacros iniciados antes de actualizar. No se elimina progreso ni se recalifican intentos anteriores. Hay 1.164 registros conservados y nuevos, de los cuales 831 son ejercicios activos; estas cantidades no deben confundirse.

Cada incorporación contiene una pregunta original, cuatro alternativas y cuatro razones propias relacionadas con su contenido. Los casos, problemas, datos y fragmentos se revisaron durante la autoría e integración. Las claves se distribuyen 13/13/12/12 en cada especialidad. El compilador desplaza cada alternativa junto con su razón para preservar su correspondencia.

Los 241 indicadores cargados reciben al menos una pregunta nueva. Los 25 que solo tenían plantillas reciben al menos dos. La cobertura se comprueba contra `auditoria-307.json`; no equivale a una nueva certificación de todos los documentos oficiales de 2026. La dificultad es estimada y no calibrada psicométricamente. Se recomienda revisión docente y ajuste posterior con datos de uso.

## Materiales y acceso

- Cuatro audios originales con voz sintética para 16 preguntas de comprensión auditiva. Sus guiones están en `content-307/materials.json`. La transcripción se presenta en revisión o solución, no en la pregunta sin responder; la práctica guiada mantiene la solución dentro de un desplegable cerrado.
- Cuatro lecturas originales en inglés y dos cómics propios con título, descripción y ampliación. Las imágenes y grabaciones forman parte de la caché offline. Los audios admiten solicitudes de rangos para reproducción y avance.
- El catálogo incluye 50 preguntas nuevas por especialidad. Las sesiones nuevas procuran distintos estímulos cuando hay variedad suficiente; los simulacros pueden contener varias preguntas del mismo material.
- Los audios originales nuevos no reemplazan los siete audios faltantes de las 17 preguntas auditivas del cuadernillo 2023. Ese pendiente sigue registrado en `pruebas-anteriores-306.md`. También siguen faltando cuadernillo y pauta de Media; sus 50 nuevas preguntas son de autoría propia.

## Fuentes conceptuales contrastadas

Son referencias para conceptos puntuales, no fuentes de copia de los nuevos enunciados.

- [BCN — Constituciones](https://www.bcn.cl/historiapolitica/constituciones/index.html): leyes federales de 1826, textos constitucionales y organización estatal.
- [BCN — Ley 9.292 y voto femenino](https://www.bcn.cl/historiapolitica/elecciones/detalle_eleccion?handle=10221.1/63027&periodo=1925-1973): alcance de la ampliación de 1949.
- [BCN — Reconstrucción democrática](https://www.bcn.cl/historiapolitica/hitos_periodo/detalle_periodo.html?per=1990-2022): elección de 1989 y asunción presidencial de 1990.
- [Archivo Nacional — Plebiscito de 1988](https://www.archivonacional.gob.cl/plebiscito-de-1988).
- [OpenStax Biology 2e, 5.2](https://openstax.org/books/biology-2e/pages/5-2-passive-transport), [42.1](https://openstax.org/books/biology-2e/pages/42-1-innate-immune-response) y [43.4](https://openstax.org/books/biology-2e/pages/43-4-hormonal-control-of-human-reproduction): transporte, inmunidad y control hormonal.

## Reproducir y verificar

1. Editar los seis archivos `content-307/*.tsv` y los materiales originales.
2. Ejecutar `python scripts/build-307.py` y `python scripts/draw-comics-307.py`.
3. Ejecutar `npm test`. Se preservan las comprobaciones históricas y se agregan cobertura específica, huellas de los 864 objetos previos, recuperación de sesiones archivadas, selección, estímulos y reproducción offline.
4. Verificar interfaz en vista previa antes de promover desde `work`; mantener `main` sin cambios.

Las pruebas estructurales y funcionales no equivalen a certificación pedagógica experta ni validación psicométrica. Las preguntas se presentan como práctica ProfeECEP y no como preguntas oficiales o predicciones del examen.
