# ProfeECEP

Plataforma web para preparar la Evaluación de Conocimientos Específicos y Pedagógicos (ECEP) en Chile.

## Versión 2.0

Especialidad activa: **Educación Básica Matemática 2026**.

### Funciones principales
- Cuentas reales y progreso sincronizado con Supabase.
- Diagnóstico, banco de preguntas, simulador y analítica.
- Motor adaptativo 2.0.
- Planificador ECEP 2.0.
- Centro de estudio por microlecciones.
- Tutor contextual.
- Entrenador de errores.
- Motivación, constancia e índice interno de preparación.

### Nuevo en 2.0 — Arquitectura multiespecialidad
ProfeECEP deja de asumir una única ECEP y pasa a trabajar con un sistema de especialidades.

Cada especialidad podrá tener de forma independiente:
- temario;
- banco de preguntas;
- guías de estudio;
- diagnóstico;
- simulador;
- analítica;
- planificador;
- tutor;
- historial y progreso.

Actualmente solo **Educación Básica Matemática 2026** está habilitada con contenido real. Las demás opciones visibles en el selector se muestran como próximas especialidades y no cargan contenido inventado.

La especialidad elegida queda persistida en el estado del usuario y la interfaz permite cambiarla desde la cabecera.

## Fuente del contenido
La estructura del temario de Educación Básica Matemática se basa en el documento oficial ECEP 2026 correspondiente. Las explicaciones, preguntas, recomendaciones, simulacros y planes son contenido propio de ProfeECEP.

## Próximo avance
2.1: generador inteligente de simulacros por cantidad, dificultad, dominio y debilidades.
