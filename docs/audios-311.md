# Inglés 2023 · ProfeECEP 3.0.11

Revisión del 7 de octubre de 2026. Las siete grabaciones aportadas permiten incorporar 17 adaptaciones con 68 explicaciones particulares. Inglés pasa de 130 a 147 preguntas y el banco completo de 877 a 894. Las preguntas anteriores, sus versiones históricas y el progreso se conservan.

| Pista | Referencias | Práctica |
|---|---|---|
| Happiness | 1–2 | Síntesis y vocabulario emocional |
| Going to Mars | 3–4 | Argumento central y vocabulario contextual |
| Agriculture | 5–6 | Situación y propósito comunicativo |
| Plastic Trash | 7–9 | Comparación, conclusión y destinatario |
| The Song of My Life | 10–11 | Testimonios y expresión figurada |
| Passenger | 12–14 | Actitud, dato específico e intención |
| Certificate of Citizenship | 15–17 | Referencia familiar, ironía y polisemia |

Todas se vinculan a comprensión auditiva: 11 indicadores del temario 2026 conservado en `content-308/indicators-2026.json`. La auditoría incluye el texto del indicador, página, clave histórica y clave de práctica separadas. Son adaptaciones de estudio, sin certificación externa ni calibración psicométrica.

Se utilizan las siete grabaciones completas, optimizadas a MP3 mono de 64 kbps y 44,1 kHz: 7.868.594 bytes en total. Las huellas Git coinciden con las subidas el 5 de octubre; las duraciones difieren menos de una décima de segundo de los originales. No se recortó ni se generó voz. El manifiesto registra huellas SHA-256, tamaños y duraciones.

Las transcripciones de apoyo proceden del reconocimiento automático del 5 de octubre, con edición de puntuación, agrupación por pasajes y omisión de algunas muletillas. Los nombres no confirmados aparecen entre corchetes; ninguna respuesta exige reconocerlos. SITA se normalizó con el nombre escrito en el cuadernillo. Los tiempos son aproximados. No se afirma escucha humana completa ni transcripción literal certificada; puede mejorarse con una segunda revisión humana de los audios.

La pauta de las 17 referencias fue cotejada visualmente. Las claves ya guardadas eran correctas y se conservan. En Agriculture se evalúa la organización de la exposición, sin afirmar una comprobación manual de efectos sonoros. En Plastic Trash se diferencia al narrador de los invitados y participación colectiva de culpa idéntica. En The Song of My Life se reconoce el tema común sin inferir el protocolo completo de entrevista. En Passenger se respeta «as little as» y se distinguen las localizaciones. Las cifras y referencias temporales se atribuyen a las grabaciones históricas, sin tratarlas como datos actuales.

El reproductor no inicia automáticamente. La transcripción, referencias temporales y razones aparecen al revisar la respuesta; los simulacros no las adelantan. Las once pistas totales de la aplicación están precargadas y admiten solicitudes parciales de reproducción sin conexión.

`python content-311/build.py` reconstruye los datos y la auditoría. `npm test` comprueba las respuestas por contenido, las 68 explicaciones, filtros, conservación de preguntas anteriores, recuperación del progreso y transcripciones después de responder. La decodificación usa FFmpeg y FFprobe, además de Node.js.

El inventario de 3.0.6 conserva su estado histórico: las 17 referencias entonces marcadas `requiere-audio` quedan resueltas por esta entrega. Las otras 33 preguntas históricas en reserva de Historia e Inglés siguen pendientes.
