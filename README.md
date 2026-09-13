# ProfeECEP

Plataforma web para preparar la Evaluación de Conocimientos Específicos y Pedagógicos (ECEP) en Chile.

## Versión 1.4

Piloto actual: **Educación Básica Matemática 2026**.

### Funciones principales
- Cuentas reales y progreso sincronizado con Supabase.
- Temario organizado por dominio, subdominio e indicador.
- Centro de estudio.
- Diagnóstico inicial.
- Banco de 60 preguntas propias clasificadas por dificultad y razonamiento.
- Plan de estudio personalizado.
- Repetición espaciada y revisión inteligente.
- Simulador completo.
- Analítica avanzada.

### Nuevo en 1.4 — Motor adaptativo 2.0
El entrenamiento recomendado ahora pondera:
- errores pendientes;
- preguntas nunca practicadas;
- precisión del dominio;
- precisión histórica de cada pregunta;
- repetición espaciada y repaso vencido;
- velocidad de respuesta;
- errores rápidos;
- dificultad de la pregunta;
- variedad de tipo de razonamiento.

El motor evita cargar una sesión con demasiadas preguntas del mismo tipo y ajusta la dificultad según el dominio estimado.

## Fuente del temario
La estructura del temario se basa en el documento oficial ECEP 2026 de Educación Básica Matemática. Las explicaciones, preguntas, recomendaciones, simulacros y planes son contenido propio de ProfeECEP.

## Próximo avance
1.5: planificador ECEP 2.0 con calendario, metas semanales, atrasos y reajuste automático.
