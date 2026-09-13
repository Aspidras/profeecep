# ProfeECEP

Plataforma web para preparar la Evaluación de Conocimientos Específicos y Pedagógicos (ECEP) en Chile.

## Versión 1.5

Piloto actual: **Educación Básica Matemática 2026**.

### Funciones principales
- Cuentas reales y progreso sincronizado con Supabase.
- Temario organizado por dominio, subdominio e indicador.
- Centro de estudio.
- Diagnóstico inicial.
- Banco de 60 preguntas propias clasificadas por dificultad y razonamiento.
- Simulador completo.
- Analítica avanzada.
- Motor adaptativo 2.0.

### Nuevo en 1.5 — Planificador ECEP 2.0
- Meta semanal basada en días de estudio y minutos por sesión.
- Calendario automático para la semana actual.
- Detección de sesiones ya realizadas.
- Conteo de sesiones pendientes.
- Detección de atraso respecto de la meta semanal.
- Redistribución automática de las sesiones pendientes en los días disponibles.
- Priorización de dominios según el motor adaptativo 2.0.
- Acceso directo desde el calendario a una sesión recomendada.
- Reajuste automático al modificar fecha objetivo, minutos o días por semana.

El planificador utiliza el historial real del usuario. Si una semana no se cumple exactamente según lo esperado, ProfeECEP redistribuye lo pendiente sin borrar el progreso anterior.

## Fuente del temario
La estructura del temario se basa en el documento oficial ECEP 2026 de Educación Básica Matemática. Las explicaciones, preguntas, recomendaciones, simulacros y planes son contenido propio de ProfeECEP.

## Próximo avance
1.6: centro de estudio completo por indicador, con microlecciones, ejemplos, errores frecuentes, ejercicios y resúmenes.
