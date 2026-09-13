# ProfeECEP

Plataforma web para preparar la Evaluación de Conocimientos Específicos y Pedagógicos (ECEP) en Chile.

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
