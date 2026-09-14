// ProfeECEP 2.3 — expansión inicial de bancos (contenido propio)
(function () {
  'use strict';
  const packs = {
    'basica-ciencias': [
      [0,1,0,'La función principal de los alvéolos pulmonares es:', ['Impulsar la sangre hacia todo el cuerpo','Intercambiar oxígeno y dióxido de carbono con la sangre','Producir enzimas digestivas','Filtrar sustancias de la orina'],1,'Intercambio gaseoso'],
      [3,1,3,'En un circuito en serie, si una ampolleta se desconecta, ¿qué ocurre con la otra?', ['Sigue encendida con mayor intensidad','También deja de recibir corriente porque se interrumpe el circuito','Se transforma en una pila','Aumenta automáticamente el voltaje'],1,'circuitos eléctricos'],
      [0,3,1,'¿Qué relación entre ciclo ovárico y ciclo uterino es más adecuada?', ['Ambos son independientes de hormonas','Las variaciones hormonales coordinan cambios en ovarios y endometrio','El ciclo uterino ocurre solo en el sistema digestivo','La ovulación ocurre después de la menstruación en todos los casos'],1,'regulación hormonal'],
      [4,0,3,'Una ladera pierde vegetación y queda expuesta a lluvias intensas. ¿Qué consecuencia es más probable?', ['Disminución de la erosión','Mayor erosión y arrastre de suelo','Conversión del suelo en roca ígnea','Desaparición de la gravedad'],1,'erosión y ambiente'],
      [6,2,0,'Para evaluar si estudiantes comprenden fotosíntesis, ¿qué evidencia es más pertinente?', ['Copiar la definición del libro','Explicar el proceso relacionando luz, agua, dióxido de carbono y glucosa','Memorizar nombres sin relacionarlos','Colorear una planta sin explicación'],1,'evaluación alineada']
    ],
    'basica-historia': [
      [0,1,1,'¿Qué conjunto caracteriza mejor una zona natural de Chile?', ['Solo su nombre administrativo','Relaciones entre clima, relieve, aguas, vegetación y población','Únicamente la cantidad de habitantes','Solo las actividades comerciales'],1,'análisis territorial'],
      [1,1,0,'Una herencia relevante de Roma para sociedades posteriores es:', ['La desaparición de toda norma escrita','El desarrollo de instituciones jurídicas y formas de organización política','La invención de la imprenta industrial','La prohibición de construir caminos'],1,'legado histórico'],
      [2,0,2,'¿Qué rasgo es propio de un sistema democrático?', ['Concentrar todo el poder sin controles','Participación ciudadana, elecciones y respeto de derechos','Eliminar la deliberación pública','Impedir la alternancia de autoridades'],1,'democracia y ciudadanía'],
      [0,2,0,'Una industria vierte residuos en un río. ¿Qué análisis histórico-geográfico es más completo?', ['Considerar solo la producción inmediata','Relacionar la actividad con efectos ambientales, sociales y económicos a distintas escalas temporales','Afirmar que todo efecto es positivo','Ignorar a las comunidades cercanas'],1,'impactos productivos'],
      [3,2,1,'Si el objetivo es interpretar fuentes y argumentar una explicación histórica, ¿qué tarea entrega mejor evidencia?', ['Seleccionar una fecha aislada','Construir una explicación que compare fuentes y cite evidencias','Repetir una definición','Ordenar nombres alfabéticamente'],1,'evaluación histórica']
    ],
    'basica-ingles': [
      [0,0,1,'Read: “The school garden uses rainwater collected from the roof. This reduces the amount of drinking water used for plants.” What is the main idea?', ['The roof needs painting','Collecting rainwater helps the garden use less drinking water','Plants cannot grow at school','Drinking water is never useful'],1,'reading for gist'],
      [0,0,5,'In “The students designed a poster. They displayed it in the hall”, what does “They” refer to?', ['The poster','The hall','The students','The design'],2,'reference'],
      [2,0,3,'Which sentence uses the passive voice correctly?', ['The experiment conducted the students','The students was conducted the experiment','The experiment was conducted by the students','The experiment conducting students'],2,'passive voice'],
      [3,0,4,'Which activity best connects language learning with culture while developing interpretation?', ['Memorise country names only','Compare two short celebrations texts and discuss whose perspectives are represented','Copy a list of foods','Translate isolated days of the week'],1,'culture and language'],
      [3,1,2,'An assessment objective is “identify the purpose of an email”. Which task is best aligned?', ['Underline every verb','Choose the purpose after reading an authentic or adapted email','Draw a picture unrelated to the email','Recite grammar terminology'],1,'assessment alignment']
    ],
    'basica-lenguaje': [
      [0,0,0,'En una narración, el personaje que enfrenta el conflicto principal cumple principalmente la función de:', ['Ambientar el lugar sin intervenir','Protagonizar las acciones centrales del relato','Indicar siempre quién narra','Reemplazar el desenlace'],1,'elementos narrativos'],
      [0,0,6,'Un cómic usa una viñeta sin texto y un cambio brusco de tamaño en la imagen. ¿Qué interpretación es más pertinente?', ['Los recursos visuales pueden sugerir información y enfatizar un momento','La viñeta carece de significado','El tamaño siempre indica una medida real','Una imagen no puede aportar al relato'],0,'recursos del cómic'],
      [1,1,0,'¿Cuál opción presenta correctamente una palabra aguda tildada?', ['camion','canción','árboles','rápidamente'],1,'ortografía acentual'],
      [1,1,1,'En una conversación para buscar un acuerdo, ¿qué intervención favorece el diálogo?', ['Interrumpir para imponer la propia idea','Escuchar, reformular la propuesta y plantear una razón','Cambiar de tema ante cualquier diferencia','Responder solo con un sí o no'],1,'gestión del diálogo'],
      [2,2,1,'Si se evalúa el proceso de escritura, ¿qué evidencia es más útil?', ['Solo la versión final calificada','Borradores y revisiones acompañados de decisiones justificadas','La cantidad de páginas','El color de la portada'],1,'evaluación del proceso']
    ],
    'media-lengua': [
      [0,0,3,'En una obra dramática, las acotaciones cumplen principalmente la función de:', ['Narrar siempre los pensamientos del público','Orientar acciones, gestos, espacio o tono de la representación','Reemplazar todos los diálogos','Presentar estadísticas del contexto'],1,'elementos dramáticos'],
      [0,1,2,'En un texto se afirma: “La medida debe aprobarse porque tres especialistas independientes muestran resultados convergentes”. ¿Qué tipo de apoyo predomina?', ['Ataque personal','Apelación a una autoridad o evidencia experta','Falsa causa necesariamente','Definición circular'],1,'argumentación'],
      [1,1,0,'En «Quizás la propuesta sea viable, pero todavía faltan antecedentes», “quizás” y “todavía” contribuyen a:', ['Modalizar y situar temporalmente el enunciado','Eliminar toda perspectiva del emisor','Construir una rima','Indicar exclusivamente lugar'],0,'modalización discursiva'],
      [2,0,0,'Al modelar una investigación literaria, ¿qué acción ayuda a evitar el uso superficial de fuentes?', ['Copiar el primer resultado','Comparar autoría, propósito, evidencia y relación con la pregunta de investigación','Elegir solo la página más colorida','Omitir las referencias'],1,'investigación literaria'],
      [2,2,0,'Para evaluar una interpretación de un poema, ¿qué criterio es más pertinente?', ['Que tenga muchas palabras','Que formule una lectura coherente y la sostenga con recursos y fragmentos del texto','Que repita la biografía completa del autor','Que use palabras técnicas sin explicación'],1,'evaluación literaria']
    ]
  };
  const qExplanation = (opts, answer) => opts.map((o, i) => i === answer
    ? 'Esta alternativa responde al problema y se apoya en el indicador trabajado.'
    : 'No es la mejor alternativa: no responde a la evidencia o confunde el concepto central.');
  for (const [specialtyId, specs] of Object.entries(packs)) {
    const pack = window.PE22_CONTENT[specialtyId];
    if (!pack) continue;
    specs.forEach(([di, si, ii, q, o, a, skill], n) => {
      const domain = window.PE_SYLLABUS_2026[specialtyId][di], sub = domain[1][si], indicator = sub[1][ii];
      const indicatorId = [di, si, ii].join('-'), id = specialtyId + '-23-' + String(n + 1).padStart(2, '0');
      const guide = {title: skill, learn: 'Este indicador exige identificar las relaciones relevantes, justificar la respuesta y distinguir alternativas plausibles de aquellas que no cuentan con evidencia suficiente.', example: 'Lee la situación, subraya la evidencia y explica por qué tu elección se conecta con el indicador. Después revisa qué dato haría cambiar tu conclusión.', error: 'Elegir una alternativa por una palabra conocida, sin analizar la relación entre la situación y el concepto, produce errores de interpretación.', pedagogy: 'Pide verbalizar la evidencia antes de seleccionar una respuesta y utiliza los distractores para discutir concepciones alternativas.', summary: 'Relaciona evidencia, concepto y justificación.', indicatorId, indicator, minutes: 5, questionIds: [id]};
      const question = {id, d: domain[0], i: sub[0], q, o, a, e: qExplanation(o, a)[a], explanations: qExplanation(o, a), diff: n % 2 ? 'media' : 'básica', skill, specialtyId, indicatorId, indicator, origin: 'Contenido propio ProfeECEP', version: '2.3'};
      pack.questions.push(question);
      if (!pack.guides[indicatorId]) pack.guides[indicatorId] = {...guide, status: 'draft'};
      else if (!pack.guides[indicatorId].questionIds.includes(id)) pack.guides[indicatorId].questionIds.push(id);
    });
  }
  window.PE22_ACTIVATE();
}());
