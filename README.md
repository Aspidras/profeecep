# ProfeECEP

Plataforma web para preparar la Evaluación de Conocimientos Específicos y Pedagógicos (ECEP) en Chile.

## Versión 1.0

Piloto actual: **Educación Básica Matemática 2026**.

### Funciones actuales
- Temario oficial organizado por dominio, subdominio e indicador.
- Centro de estudio.
- Diagnóstico inicial.
- Banco de preguntas propias y simulacro.
- Analítica de progreso.
- Plan de estudio personalizado.
- Entrenamiento adaptativo.
- Repetición espaciada y revisión inteligente.
- **Cuentas reales con Supabase Auth.**
- **Sincronización del progreso entre dispositivos.**
- Recuperación de sesión.
- Migración del progreso local a la nube al iniciar sesión.
- Seguridad por usuario mediante RLS en `user_progress`.

## Arquitectura 1.0
- GitHub: código fuente.
- Vercel: despliegue.
- Supabase: autenticación y progreso sincronizado.
- Las variables `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY` se configuran en Vercel.

## Fuente del temario
La estructura del temario se basa en el documento oficial ECEP 2026 de Educación Básica Matemática. Las explicaciones, preguntas, recomendaciones, simulacros y planes son contenido propio de ProfeECEP.

## Próximo avance
1.1: ampliar de forma importante el banco de preguntas y clasificarlo por indicador, dificultad y tipo de razonamiento.
