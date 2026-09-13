// Original ProfeECEP teaching material. These are NOT official ECEP questions.
// Each at tuple points to an existing domain, subdomain and indicator in data.js.
(function () {
  'use strict';
  const lessons = {
    'basica-ciencias': [
      {
        id: 'cn22-01', at: [0, 0, 0], title: 'Transporte a través de la membrana', diff: 'media', skill: 'explicación de mecanismos',
        q: 'Una célula mantiene más iones de sodio fuera que dentro. Una proteína expulsa sodio desde el interior hacia el exterior y utiliza ATP directamente. ¿Qué mecanismo describe esta situación?',
        o: ['Difusión simple a favor del gradiente', 'Ósmosis de iones de sodio', 'Transporte activo primario', 'Difusión facilitada sin gasto energético'], a: 2,
        why: ['La difusión simple ocurre a favor del gradiente y no consume ATP directamente.', 'La ósmosis corresponde al movimiento de agua, no al bombeo de iones.', 'La bomba utiliza ATP directamente para mover iones contra su gradiente electroquímico.', 'La difusión facilitada es pasiva; requiere proteínas, pero no ATP para impulsar el transporte.'],
        learn: 'La membrana regula intercambios. El transporte pasivo ocurre a favor del gradiente electroquímico; la difusión facilitada emplea proteínas. El transporte activo puede mover sustancias contra ese gradiente usando energía. Si la proteína utiliza ATP directamente, se habla de transporte activo primario.',
        example: 'Primero identifica qué se mueve: sodio. Luego compara la dirección con las concentraciones indicadas. Finalmente observa la fuente de energía: el ATP acciona directamente la proteína. Estas pistas permiten descartar difusión y ósmosis.',
        error: 'La presencia de una proteína no basta para clasificar el mecanismo como activo: también hay canales y transportadores pasivos.',
        pedagogy: 'Presenta dos esquemas con proteínas: uno a favor del gradiente y otro impulsado por ATP. Pide justificar la clasificación usando dirección y energía, no solo la forma del dibujo.',
        summary: 'Clasifica el transporte por sustancia, gradiente y fuente de energía.'
      },
      {
        id: 'cn22-02', at: [1, 1, 0], title: 'Población, comunidad y ecosistema', diff: 'básica', skill: 'clasificación conceptual',
        q: 'En una laguna se estudian todas las poblaciones de plantas, peces, insectos y microorganismos que conviven allí, sin incluir el agua, la luz ni los minerales. ¿Qué nivel de organización se describe?',
        o: ['Una comunidad', 'Una población', 'Un organismo', 'Un ecosistema completo'], a: 0,
        why: ['Una comunidad reúne poblaciones de distintas especies que coexisten en un lugar.', 'Una población reúne individuos de la misma especie en un área y tiempo determinados.', 'El enunciado considera muchos seres vivos, no un individuo.', 'El ecosistema incluye la comunidad, el medio abiótico y las interacciones entre ambos.'],
        learn: 'Una población corresponde a individuos de una misma especie que habitan un área en un momento determinado. Una comunidad reúne poblaciones de distintas especies. Un ecosistema incluye esa comunidad y su ambiente físico, con sus interacciones.',
        example: 'Los peces de una misma especie de la laguna forman una población. Peces, algas y bacterias integran una comunidad. Al analizar también temperatura del agua, luz y nutrientes, se estudia el ecosistema.',
        error: 'Nombrar un lugar no convierte automáticamente la descripción en un ecosistema: hay que reconocer qué componentes e interacciones se consideran.',
        pedagogy: 'Pide ordenar tarjetas de seres vivos y factores físicos. Solicita una justificación para cada agrupación y cambia los componentes para comprobar si cambia la categoría.',
        summary: 'Misma especie: población. Varias poblaciones: comunidad. Comunidad y ambiente físico: ecosistema.'
      },
      {
        id: 'cn22-03', at: [2, 0, 2], title: 'Separar mezclas según sus propiedades', diff: 'media', skill: 'selección de procedimientos',
        q: 'Se dispone de una mezcla de agua, sal completamente disuelta y arena insoluble. Si se desea recuperar la arena y luego la sal sólida, ¿qué secuencia resulta adecuada?',
        o: ['Filtrar para retener la sal y dejar pasar la arena', 'Evaporar primero y usar un imán para separar los sólidos', 'Decantar para separar toda la sal disuelta', 'Filtrar la arena y después evaporar el agua del filtrado'], a: 3,
        why: ['La sal disuelta atraviesa el filtro junto con el agua; la arena queda retenida.', 'La evaporación deja los sólidos juntos y un imán no separa sal de arena común.', 'La decantación no separa un soluto disuelto del agua.', 'La filtración retiene la arena insoluble; evaporar el filtrado permite recuperar la sal sólida.'],
        learn: 'La separación de mezclas aprovecha propiedades físicas. La filtración separa un sólido insoluble de un líquido. La evaporación elimina el solvente y permite recuperar un soluto no volátil. Para recuperar también el agua se necesitaría un procedimiento de condensación, como la destilación.',
        example: 'Dibuja qué hay después de cada etapa: en el filtro queda arena; en el recipiente se recoge agua salada. Al evaporar el agua del recipiente, queda sal. El objetivo del enunciado no exige recuperar el agua.',
        error: 'Un filtro corriente no retiene una sustancia solo porque inicialmente era sólida: importa si está disuelta en la mezcla.',
        pedagogy: 'Antes del procedimiento, pide predecir qué habrá en el filtro y en el filtrado. Contrasta esas predicciones con observaciones y un esquema de partículas.',
        summary: 'Escoge la técnica según solubilidad y estado de la mezcla; comprueba qué recupera cada etapa.'
      },
      {
        id: 'cn22-04', at: [3, 1, 0], title: 'Calor y temperatura', diff: 'básica', skill: 'distinción conceptual',
        q: 'Una cuchara metálica a 20 °C se coloca en agua a 60 °C. Antes de alcanzar el equilibrio térmico, ¿cuál afirmación describe correctamente el proceso?',
        o: ['La cuchara transfiere frío al agua', 'Se transfiere energía como calor desde el agua a la cuchara', 'Ambos cuerpos tienen la misma temperatura desde el primer instante', 'El calor es una sustancia almacenada en el agua'], a: 1,
        why: ['El frío no es una sustancia que se transfiera; se describe una diferencia de temperatura.', 'La diferencia de temperatura origina transferencia neta de energía del cuerpo más caliente al más frío.', 'El equilibrio térmico requiere un proceso; inicialmente las temperaturas son distintas.', 'El calor es energía en transferencia por diferencia de temperatura, no una sustancia almacenada.'],
        learn: 'La temperatura caracteriza el estado térmico de un cuerpo. El calor es energía transferida debido a una diferencia de temperatura. En contacto térmico, la transferencia neta espontánea va del cuerpo de mayor temperatura al de menor temperatura hasta el equilibrio.',
        example: 'Compara 60 °C con 20 °C y dibuja una flecha de energía desde el agua hacia la cuchara. La cuchara se calienta y el agua puede enfriarse. En un sistema aislado, la energía total se conserva.',
        error: 'Temperatura y energía interna no son sinónimos: dos cantidades distintas de agua a igual temperatura no necesariamente tienen la misma energía interna total.',
        pedagogy: 'Recoge expresiones cotidianas como «entra el frío» y pide reformularlas mediante temperaturas medidas y dirección de transferencia de energía.',
        summary: 'La temperatura permite comparar estados; el calor describe una transferencia de energía.'
      },
      {
        id: 'cn22-05', at: [5, 0, 0], title: 'Variables y diseño experimental', diff: 'alta', skill: 'análisis experimental',
        q: 'Se investiga cómo influye la cantidad diaria de luz en la altura de plantas de la misma especie. Se mantienen iguales el riego, suelo y tamaño inicial. Se comparan grupos con 4 y 8 horas de luz por día. ¿Cuál es la variable dependiente?',
        o: ['Las horas diarias de luz asignadas', 'La especie de planta utilizada', 'La altura de las plantas medida al finalizar', 'La cantidad de agua suministrada'], a: 2,
        why: ['Las horas de luz son la variable independiente: se modifican deliberadamente.', 'La especie se mantiene constante para reducir explicaciones alternativas.', 'La altura final es la respuesta medida para evaluar el efecto de las horas de luz.', 'El riego es una variable controlada en el diseño descrito.'],
        learn: 'La variable independiente se manipula; la dependiente es la respuesta que se mide. Las variables controladas se mantienen comparables. Repetir con varias plantas por condición ayuda a considerar la variabilidad, aunque no reemplaza el control de otras diferencias.',
        example: 'Escribe la pregunta como «efecto de X sobre Y»: X son horas de luz; Y es altura final. Registra varias plantas por grupo y compara sus resultados, manteniendo las demás condiciones equivalentes.',
        error: 'Una asociación observada no demuestra por sí sola causalidad si las condiciones comparadas difieren también en riego, suelo u otros factores relevantes.',
        pedagogy: 'Solicita que el estudiante identifique qué cambia, qué mide y qué conserva. Después presenta un diseño con dos factores modificados y pídele corregirlo.',
        summary: 'Independiente: modifico. Dependiente: mido. Controladas: mantengo comparables.'
      }
    ]
    ,
    'basica-historia': [
      {
        id: 'hg22-01', at: [0, 0, 0], title: 'Latitud y longitud', diff: 'básica', skill: 'lectura de representaciones',
        q: 'Un punto aparece en un mapa con coordenadas 33° S, 70° O. ¿Qué interpretación es correcta?',
        o: ['Está al sur del ecuador y al oeste del meridiano de Greenwich', 'Está al norte del ecuador y al oeste de Greenwich', 'Está al sur del ecuador y al este de Greenwich', 'Su latitud es 70° y su longitud es 33°'], a: 0,
        why: ['La latitud 33° S indica hemisferio sur; la longitud 70° O indica posición al oeste de Greenwich.', 'La letra S corresponde al hemisferio sur, no al norte.', 'La letra O señala oeste, no este.', 'La primera coordenada expresa latitud y la segunda longitud en la notación dada.'],
        learn: 'La latitud es la distancia angular respecto del ecuador y se expresa hacia el norte o sur. La longitud se mide angularmente respecto del meridiano de Greenwich hacia el este u oeste. Los paralelos y meridianos forman una red de referencia.',
        example: 'Para ubicar 33° S, 70° O, identifica primero el paralelo al sur del ecuador y después el meridiano al oeste de Greenwich. La intersección sitúa el punto; no indica por sí sola su altitud.',
        error: 'Confundir latitud con longitud o interpretar grados angulares como kilómetros conduce a localizaciones incorrectas.',
        pedagogy: 'Usa un globo o una cuadrícula con ecuador y Greenwich destacados. Pide explicar qué referencia se usa en cada coordenada antes de localizar el punto.',
        summary: 'Latitud: norte o sur del ecuador. Longitud: este u oeste de Greenwich.'
      },
      {
        id: 'hg22-02', at: [1, 0, 1], title: 'Cambio, continuidad y causalidad', diff: 'media', skill: 'pensamiento temporal',
        q: 'Al comparar fotografías de una plaza tomadas con cincuenta años de diferencia, se observa que conserva su trazado, pero sus edificios y usos han cambiado. ¿Qué operación de pensamiento histórico se desarrolla principalmente?',
        o: ['Demostrar una causa única del cambio urbano', 'Determinar que no hubo transformaciones', 'Establecer que todos los cambios ocurrieron al mismo tiempo', 'Reconocer cambios y continuidades entre dos momentos'], a: 3,
        why: ['Las fotografías permiten comparar evidencias, pero no bastan para demostrar una causa única.', 'Los cambios de edificios y usos contradicen esta afirmación.', 'Dos registros no permiten precisar cuándo ocurrió cada transformación.', 'Se distingue lo que permanece —el trazado— de lo que se transforma —edificios y usos—.'],
        learn: 'El pensamiento temporal permite reconocer duración, sucesión, cambios y continuidades. Comparar momentos muestra permanencias y transformaciones. Explicar sus causas exige información adicional: una secuencia temporal no demuestra por sí sola causalidad.',
        example: 'Construye dos columnas: «permanece» y «cambia». Luego formula una pregunta causal: ¿por qué cambió el uso de los edificios? Para responderla, consulta planos, testimonios y registros contextualizados.',
        error: 'Concluir que un hecho causó otro solo porque ocurrió antes confunde sucesión temporal con explicación causal.',
        pedagogy: 'Pide distinguir tres niveles al comentar una imagen: lo que observa, lo que infiere y la evidencia adicional que necesitaría para explicar el cambio.',
        summary: 'Comparar identifica cambios y continuidades; explicar causas exige evidencias adicionales.'
      },
      {
        id: 'hg22-03', at: [1, 1, 4], title: 'Contrastar fuentes sobre la conquista', diff: 'alta', skill: 'análisis de fuentes',
        q: 'Para estudiar la conquista de América, una clase compara un relato de un conquistador y otro de perspectiva indígena. Sus interpretaciones de un mismo episodio difieren. ¿Qué procedimiento es más pertinente?',
        o: ['Descartar la fuente que contradice el libro escolar', 'Examinar autoría, contexto, propósito y evidencias de ambos relatos, y contrastarlos con otras fuentes', 'Suponer que ambos relatos son falsos porque difieren', 'Elegir automáticamente el relato que fue escrito primero'], a: 1,
        why: ['Una discrepancia invita al análisis; el libro escolar no reemplaza la crítica de fuentes.', 'Contextualizar y corroborar permite valorar perspectivas y límites sin asumir neutralidad automática.', 'Diferentes posiciones y propósitos pueden explicar discrepancias sin volver inútiles las fuentes.', 'La cercanía temporal es relevante, pero no garantiza exactitud, independencia ni ausencia de intereses.'],
        learn: 'Una fuente histórica se interpreta atendiendo a quién la produjo, cuándo, para quién y con qué propósito. Las perspectivas influyen en la selección y valoración de hechos. Contrastar fuentes ayuda a sostener afirmaciones y reconocer límites del conocimiento.',
        example: 'Elabora una tabla con autoría, fecha, destinatario, afirmaciones y evidencias. Señala coincidencias y diferencias. Busca una tercera fuente que permita corroborar una afirmación concreta, en vez de decidir cuál relato «gana».',
        error: 'Considerar objetiva cualquier fuente antigua o despreciar una fuente por su perspectiva evita analizar su valor y sus limitaciones.',
        pedagogy: 'Trabaja con fragmentos contextualizados y solicita una conclusión que cite evidencias de ambos, diferenciando lo que se puede sostener de lo que queda incierto.',
        summary: 'Contextualiza, compara y corrobora antes de formular una interpretación histórica.'
      },
      {
        id: 'hg22-04', at: [2, 0, 0], title: 'Reconocer el Estado de derecho', diff: 'media', skill: 'aplicación de conceptos ciudadanos',
        q: 'En una situación hipotética, una autoridad afirma que puede actuar al margen de las normas por contar con apoyo mayoritario. ¿Qué principio del Estado de derecho permite cuestionar esa afirmación?',
        o: ['Las decisiones de una mayoría nunca pueden revisarse', 'Las normas solo obligan a quienes no ejercen cargos públicos', 'Las autoridades también están sometidas al ordenamiento jurídico y a mecanismos de control', 'El apoyo popular reemplaza los límites del poder público'], a: 2,
        why: ['El respaldo mayoritario no excluye los controles ni la protección de derechos.', 'El sometimiento al derecho incluye a quienes ejercen autoridad.', 'La sujeción de las autoridades a las normas y controles limita la arbitrariedad.', 'La legitimidad democrática no elimina los límites jurídicos del ejercicio del poder.'],
        learn: 'El Estado de derecho implica que el ejercicio del poder se somete a normas y controles. La protección de derechos y la posibilidad de revisar actuaciones de las autoridades son elementos relevantes. El respaldo mayoritario no autoriza un poder ilimitado.',
        example: 'Distingue dos preguntas: ¿cómo accedió la autoridad a su cargo? y ¿cómo debe ejercer sus atribuciones? Haber sido elegida no resuelve por sí solo si una actuación respeta las normas.',
        error: 'Reducir la democracia a votar puede hacer invisibles derechos, límites institucionales y mecanismos de control.',
        pedagogy: 'Propón situaciones hipotéticas y pide justificar qué principio se protege. Evita que la respuesta dependa de la simpatía por una autoridad o sector político.',
        summary: 'El poder público está sujeto a normas, derechos y controles.'
      },
      {
        id: 'hg22-05', at: [3, 2, 2], title: 'Retroalimentar una explicación histórica', diff: 'alta', skill: 'retroalimentación formativa',
        q: 'Una estudiante explica un proceso histórico enumerando hechos, pero no establece relaciones causales. El objetivo era justificar una explicación usando fuentes. ¿Qué retroalimentación ayuda mejor a avanzar hacia ese objetivo?',
        o: ['«Identificaste hechos relevantes. Elige una causa, explica cómo contribuyó al proceso y respáldala con evidencia de una fuente»', '«Está incompleto: estudia más»', '«Agrega dos páginas para que la respuesta sea más extensa»', '«Copia esta explicación y entrégala sin cambios»'], a: 0,
        why: ['Reconoce una fortaleza y propone una acción específica alineada con causalidad y uso de evidencias.', 'No identifica la dificultad concreta ni ofrece un siguiente paso.', 'La extensión no demuestra relaciones causales ni uso pertinente de fuentes.', 'Copiar reemplaza el razonamiento de la estudiante y no permite observar su mejora autónoma.'],
        learn: 'Una retroalimentación útil relaciona el desempeño observado con un criterio de logro y propone un próximo paso realizable. En una explicación histórica importa conectar causas, proceso y evidencia, no solo reunir fechas y hechos.',
        example: 'Identifica la evidencia actual: enumera hechos. Explicita la brecha: falta explicar relaciones causales. Propón revisar una oración incorporando «esto contribuyó porque…» y un fragmento pertinente de la fuente.',
        error: 'Elogiar o señalar un error de manera general no entrega información suficiente para revisar el razonamiento.',
        pedagogy: 'Reserva tiempo para que la estudiante use la retroalimentación y vuelve a mirar su nueva explicación con el mismo criterio.',
        summary: 'Observación concreta + criterio + acción de mejora + oportunidad de revisión.'
      }
    ]
    ,
    'basica-ingles': [
      {
        id: 'en22-01', at: [0, 0, 4], title: 'Draw a supported conclusion', diff: 'media', skill: 'inferencia textual',
        q: 'Read this original notice: “The museum opens at ten. School groups must book their visit in advance. Tickets bought at the door are for individual visitors only.” A teacher plans to bring a class tomorrow without a booking. What can be concluded?',
        o: ['All visitors must arrive before ten', 'The museum is closed to school groups', 'Individual visitors must book as a school group', 'The teacher needs to arrange a group booking before the visit'], a: 3,
        why: ['The notice states an opening time, not a requirement to arrive before it.', 'School groups are admitted with an advance booking.', 'The notice distinguishes individual visitors from school groups.', 'The advance-booking requirement applies to the class because it is a school group.'],
        learn: 'Una conclusión válida relaciona información del texto con la situación planteada. Distingue lo que el texto respalda de lo que podría ser posible, pero no está indicado. En avisos, condiciones como must, only y in advance delimitan quién puede hacer qué.',
        example: 'Marca el sujeto de cada regla: school groups e individual visitors. Después clasifica a la clase como school group y aplica su condición. No generalices a todos los visitantes la regla de un solo grupo.',
        error: 'Elegir una alternativa porque contiene palabras del texto no garantiza que exprese la relación correcta entre esas ideas.',
        pedagogy: 'Pide subrayar la evidencia que permite aceptar una conclusión y explicar qué palabra contradice cada distractor.',
        summary: 'A supported conclusion follows the text’s conditions and applies them to the correct reader.'
      },
      {
        id: 'en22-02', at: [0, 1, 0], title: 'Meaning from context', diff: 'básica', skill: 'inferencia léxica',
        q: 'Read: “Mia was reluctant to speak at first: she hesitated and kept looking at her notes. After practising with a partner, she volunteered to present.” In this context, “reluctant” most nearly means:',
        o: ['Unable to hear', 'Unwilling or hesitant', 'Eager and confident', 'Completely unaware'], a: 1,
        why: ['Nothing in the passage suggests a hearing difficulty.', 'Hesitation and the later contrast with volunteering support unwilling or hesitant.', 'The initial hesitation contrasts with eagerness and confidence.', 'Looking at notes does not imply that Mia was unaware of the task.'],
        learn: 'Para inferir vocabulario, identifica pistas próximas, ejemplos, reformulaciones y contrastes. Comprueba si el significado propuesto mantiene el sentido de la oración y del texto completo. La clase gramatical de la palabra también limita las opciones.',
        example: 'Relaciona reluctant con hesitated. Luego observa el cambio introducido por After practising: Mia pasa a ofrecerse para presentar. Sustituye reluctant por hesitant y comprueba que la secuencia conserve sentido.',
        error: 'Atribuir un significado aislado por parecido con una palabra española puede ignorar las pistas del contexto.',
        pedagogy: 'Pide justificar una inferencia léxica con dos pistas distintas y probar una sustitución antes de consultar el diccionario.',
        summary: 'Use nearby clues, contrast and substitution to test a possible meaning.'
      },
      {
        id: 'en22-03', at: [2, 0, 0], title: 'Prohibition and lack of obligation', diff: 'media', skill: 'análisis gramatical en contexto',
        q: 'A safety rule says that entering the laboratory without permission is prohibited. Which sentence expresses that rule?',
        o: ['You do not have to enter without permission', 'You might enter without permission', 'You must not enter without permission', 'You need not enter without permission'], a: 2,
        why: ['Do not have to expresses absence of obligation, not prohibition.', 'Might expresses possibility and does not state the prohibition.', 'Must not expresses that the action is prohibited.', 'Need not also expresses absence of necessity, not prohibition.'],
        learn: 'Los verbos modales expresan funciones en contexto. Must not señala prohibición; do not have to y need not indican ausencia de obligación o necesidad. Estas formas negativas no son intercambiables, aunque todas contengan negación.',
        example: 'Compara “You must not bring food” con “You do not have to bring food”. En la primera situación llevar comida está prohibido; en la segunda es opcional. Identifica la función antes de elegir la forma.',
        error: 'Traducir todas las formas como «no tienes que» puede ocultar la diferencia entre algo prohibido y algo que no es obligatorio.',
        pedagogy: 'Presenta situaciones breves de reglas, permisos y opciones. Pide reformularlas y explicar las consecuencias de cambiar el modal.',
        summary: 'Must not: prohibition. Do not have to / need not: no obligation.'
      },
      {
        id: 'en22-04', at: [3, 0, 0], title: 'Create a reason to communicate', diff: 'alta', skill: 'decisión pedagógica',
        q: 'Students are learning to ask for and give directions in English. Which activity creates a meaningful need for spoken interaction?',
        o: ['Partners receive maps with different missing places and ask each other questions to complete them', 'Everyone silently copies the same list of street names', 'The teacher gives every answer while students underline verbs', 'Students memorise isolated prepositions without using a map'], a: 0,
        why: ['The information gap gives learners a purpose to ask, understand and respond to their partner.', 'Copying vocabulary does not require asking for or giving directions.', 'Receiving all answers removes the need to exchange information.', 'Isolated memorisation does not itself create communicative interaction.'],
        learn: 'Una tarea comunicativa propone un propósito comprensible y una razón para intercambiar mensajes. En una brecha de información, cada participante posee datos que el otro necesita. El éxito implica comprender y responder, además de usar recursos lingüísticos.',
        example: 'Entrega mapas A y B con información complementaria. Modela cómo pedir aclaraciones y permite apoyo visual. El resultado comprobable es completar las ubicaciones mediante preguntas y respuestas, no copiarlas de la hoja del compañero.',
        error: 'Organizar trabajo en parejas no garantiza interacción significativa si ambos ya tienen toda la información o pueden terminar sin comunicarse.',
        pedagogy: 'Ajusta apoyos al nivel del grupo, distribuye turnos y observa si los estudiantes comprenden indicaciones y reparan malentendidos.',
        summary: 'Una tarea necesita propósito, intercambio de información y respuesta al interlocutor.'
      },
      {
        id: 'en22-05', at: [3, 1, 3], title: 'Feedback that supports speaking', diff: 'alta', skill: 'evaluación formativa',
        q: 'The goal of a speaking task is to make a polite request and respond appropriately. A learner makes a clear request but does not respond when the partner asks for clarification. Which feedback best supports the goal?',
        o: ['“Your handwriting must be neater”', '“Memorise twenty unrelated nouns”', '“Speaking is difficult for you”', '“Your request was clear. Try rephrasing it when your partner asks for clarification; then repeat the exchange”'], a: 3,
        why: ['Handwriting is not evidence for the spoken interaction goal.', 'The vocabulary task does not address the observed interaction difficulty.', 'A general judgement about the learner gives no actionable guidance.', 'It identifies a success, addresses the missing response and provides an immediate chance to improve.'],
        learn: 'La retroalimentación de una tarea oral debe relacionarse con su propósito y criterios. La interacción requiere responder al interlocutor, pedir aclaraciones y reformular, además de producir enunciados. Conviene seleccionar un aspecto abordable para la siguiente oportunidad de práctica.',
        example: 'Observa dos criterios: formula una petición comprensible y responde a una solicitud de aclaración. Registra una evidencia para cada uno. Modela una reformulación breve y permite repetir el intercambio con otro compañero.',
        error: 'Corregir todos los errores de manera simultánea o evaluar una habilidad distinta puede desviar la atención del objetivo de la tarea.',
        pedagogy: 'Comparte criterios antes de la actividad y utiliza una nueva interacción para verificar si la retroalimentación se incorporó.',
        summary: 'Connect feedback to the speaking goal and give the learner an opportunity to use it.'
      }
    ]
    ,
    'basica-lenguaje': [
      {
        id: 'lc22-01', at: [0, 0, 3], title: 'Interpretar una personificación', diff: 'media', skill: 'interpretación literaria',
        q: 'En el verso original «La ciudad bostezó al abrir sus ventanas», ¿qué interpretación del recurso literario está mejor fundamentada?',
        o: ['La ciudad se describe mediante una medida exacta de tamaño', 'Se atribuye una acción humana a la ciudad para sugerir su despertar', 'Se afirma literalmente que los edificios tienen órganos humanos', 'Se demuestra que todas las personas están cansadas'], a: 1,
        why: ['El verso no presenta una comparación cuantitativa del tamaño.', 'Bostezar se atribuye a una entidad no humana y contribuye a representar el inicio de la actividad cotidiana.', 'La lectura literal desconoce el uso figurado del lenguaje.', 'El verso sugiere una imagen colectiva; no entrega evidencia sobre cada habitante.'],
        learn: 'La personificación atribuye acciones o cualidades humanas a seres u objetos no humanos. Interpretar una figura exige relacionarla con el sentido del fragmento. Reconocer el nombre del recurso es un primer paso, pero no explica por sí solo su efecto.',
        example: 'Identifica quién realiza la acción: la ciudad. Observa la acción humana: bostezar. Relaciónala con abrir ventanas para proponer una imagen de despertar y comienzo de la actividad.',
        error: 'Nombrar una figura sin apoyar la interpretación en palabras del texto deja sin explicar cómo contribuye al sentido.',
        pedagogy: 'Pide comparar el verso con «Las personas abrieron las ventanas por la mañana» y explicar qué expresividad aporta la formulación figurada.',
        summary: 'Reconoce el recurso, cita una pista y explica su efecto en el fragmento.'
      },
      {
        id: 'lc22-02', at: [0, 1, 4], title: 'Distinguir hechos y opiniones', diff: 'básica', skill: 'lectura crítica',
        q: 'Lee este texto original: «El club de lectura se reunió el martes y asistieron doce personas. Fue la reunión más entretenida del año». ¿Qué enunciado expresa una opinión?',
        o: ['El club se reunió el martes', 'Asistieron doce personas', 'Se realizó una reunión del club', 'Fue la reunión más entretenida del año'], a: 3,
        why: ['La fecha del encuentro es una afirmación que puede contrastarse con registros.', 'La cantidad de asistentes puede comprobarse mediante evidencias.', 'La realización de la reunión es una afirmación verificable.', 'Más entretenida expresa una valoración que depende de criterios o preferencias.'],
        learn: 'Una afirmación de hecho se puede contrastar con evidencia; una opinión expresa una valoración, interpretación o preferencia. Que una afirmación sea verificable no significa que ya se haya demostrado verdadera. También una opinión puede estar argumentada.',
        example: 'Pregunta por cada oración: ¿qué evidencia permitiría comprobarla? Un registro de asistencia puede contrastar «doce personas». Para «más entretenida» habría que explicitar criterios de valoración y perspectivas.',
        error: 'Confundir «hecho» con «afirmación necesariamente verdadera» impide evaluar la calidad y confiabilidad de la información.',
        pedagogy: 'Usa textos que combinen información y valoración. Pide clasificarlas y explicar cómo verificarían una afirmación factual.',
        summary: 'Distingue lo verificable de lo valorativo y luego evalúa la evidencia.'
      },
      {
        id: 'lc22-03', at: [1, 0, 0], title: 'Reparar una referencia ambigua', diff: 'media', skill: 'revisión de cohesión',
        q: 'En «Sofía conversó con Elena cuando ella llegó a la biblioteca», se quiere expresar que Elena llegó. ¿Qué revisión elimina mejor la ambigüedad?',
        o: ['Sofía conversó con Elena cuando esta persona llegó', 'Ella conversó con Elena cuando Sofía llegó', 'Cuando Elena llegó a la biblioteca, Sofía conversó con ella', 'Sofía conversó con Elena, pues ella llegó'], a: 2,
        why: ['Esta persona aún puede dejar incierto a quién se refiere el texto.', 'La revisión atribuye la llegada a Sofía y cambia la información deseada.', 'Nombrar a Elena como sujeto de llegó explicita quién realiza esa acción.', 'Cambiar el conector no resuelve la referencia ambigua de ella y agrega una relación causal.'],
        learn: 'La cohesión relaciona partes del texto mediante pronombres, conectores, reiteraciones y otros recursos. Un pronombre necesita un referente identificable. Si dos antecedentes son posibles, nombrar al referente o reorganizar la oración puede mejorar la claridad.',
        example: 'Subraya «ella» y pregunta quién llegó. Como Sofía y Elena son antecedentes posibles, sustituye el pronombre en esa proposición por Elena. Relee para comprobar que se mantiene el sentido buscado.',
        error: 'Reemplazar palabras repetidas por pronombres de manera automática puede volver ambiguo un texto.',
        pedagogy: 'Pide que dos lectores expliquen a quién atribuyen la acción. Usa sus interpretaciones como evidencia para decidir qué expresión necesita revisión.',
        summary: 'Un pronombre cohesiona cuando su referente se identifica con claridad.'
      },
      {
        id: 'lc22-04', at: [2, 0, 2], title: 'Acompañar el proceso de escritura', diff: 'alta', skill: 'secuenciación didáctica',
        q: 'Un curso escribe una carta para proponer mejoras a la biblioteca escolar. ¿Qué secuencia favorece mejor el proceso de escritura?',
        o: ['Escribir una única versión y corregir solo las tildes', 'Definir destinatario y propósito, planificar ideas, redactar, revisar contenido y organización, editar y compartir', 'Copiar una carta modelo sin discutir su propósito', 'Calificar primero la letra y decidir después qué se quiere comunicar'], a: 1,
        why: ['Una sola versión y la corrección ortográfica no abordan planificación ni revisión del contenido.', 'La secuencia conecta situación comunicativa, elaboración de ideas y mejora del texto; puede retomarse una etapa si es necesario.', 'El modelo puede ayudar, pero copiarlo no desarrolla decisiones propias de escritura.', 'La caligrafía no sustituye la definición del propósito y del destinatario.'],
        learn: 'Escribir supone decisiones sobre propósito, destinatario, contenido y organización. Planificar, redactar, revisar y editar son procesos relacionados que pueden retomarse. Revisar evalúa si el texto comunica lo que se busca; editar atiende convenciones para presentar una versión clara.',
        example: 'Antes de redactar, selecciona una propuesta y dos razones. En la revisión pregunta si el destinatario entenderá el problema y la solicitud. Después revisa puntuación y ortografía, y prepara la versión que se compartirá.',
        error: 'Reducir la revisión a corregir tildes puede dejar intactos problemas de propósito, coherencia o desarrollo de ideas.',
        pedagogy: 'Modela una revisión en voz alta y ofrece criterios separados para contenido, organización y convenciones. Da tiempo para una nueva versión.',
        summary: 'Primero construye el mensaje; revisa su sentido y organización, y edita su presentación.'
      },
      {
        id: 'lc22-05', at: [2, 2, 0], title: 'Evidencias de comprensión lectora', diff: 'alta', skill: 'alineación de evaluación',
        q: 'El objetivo es que el estudiante interprete el efecto de una figura literaria y lo justifique con el texto. ¿Qué evidencia resulta más directa?',
        o: ['Explica el efecto de la figura y utiliza palabras del fragmento para sostener su interpretación', 'Recita de memoria una lista de figuras literarias', 'Cuenta las palabras del poema', 'Indica que el poema le gustó sin explicar por qué'], a: 0,
        why: ['La respuesta hace observables la interpretación y su justificación textual, que son los desempeños del objetivo.', 'Memorizar nombres no demuestra interpretación del efecto en un texto.', 'Contar palabras mide una acción diferente a la comprensión solicitada.', 'Una preferencia sin justificación no entrega evidencia del efecto interpretado.'],
        learn: 'La evaluación debe hacer observable el desempeño expresado en el objetivo. Si este exige interpretar y justificar, conviene recoger una explicación y la evidencia que la sostiene. Conocer una definición puede ser necesario, pero no demuestra por sí solo su aplicación.',
        example: 'Formula dos criterios: propone un efecto coherente con el fragmento y lo respalda con una pista pertinente. Una respuesta que solo nombra la figura cumple una parte distinta del trabajo requerido.',
        error: 'Evaluar un contenido cercano al objetivo, pero con una demanda menor, puede producir una impresión engañosa de logro.',
        pedagogy: 'Comparte ejemplos de explicaciones con y sin evidencia. Pide revisarlas usando los criterios antes de responder de forma individual.',
        summary: 'Objetivo, tarea y criterio deben apuntar al mismo desempeño observable.'
      }
    ]
    ,
    'media-lengua': [
      {
        id: 'll22-01', at: [0, 0, 2], title: 'Analepsis y orden del relato', diff: 'media', skill: 'análisis narrativo',
        q: 'En un relato original, una mujer entra hoy a una estación abandonada. Al tocar una banca, la narración retrocede diez años y cuenta su despedida de una amiga; luego vuelve a la estación actual. ¿Qué técnica organiza ese retroceso?',
        o: ['Prolepsis: anticipación de hechos futuros', 'Narración estrictamente cronológica', 'Analepsis: recuperación de un episodio anterior', 'Descripción sin alteración temporal'], a: 2,
        why: ['La prolepsis anticipa acontecimientos posteriores, mientras aquí se recupera el pasado.', 'El orden del discurso interrumpe la secuencia cronológica al retroceder diez años.', 'La analepsis introduce un acontecimiento previo al momento desde el que avanza el relato.', 'El fragmento incorpora una escena pasada y no se limita a describir el presente.'],
        learn: 'La historia refiere a los acontecimientos y sus relaciones temporales; el discurso es la manera de presentarlos. Una analepsis recupera hechos anteriores y una prolepsis anticipa posteriores. Analizar su efecto implica preguntar qué información se entrega y cómo modifica la comprensión del presente narrativo.',
        example: 'Traza dos líneas: en la historia, primero ocurre la despedida y diez años después la visita. En el discurso, se narra la visita, se recuerda la despedida y se retorna al presente. El recuerdo puede explicar el valor afectivo de la estación.',
        error: 'Toda mención al pasado no constituye necesariamente una escena retrospectiva desarrollada; hay que observar qué hace el discurso con el orden de los acontecimientos.',
        pedagogy: 'Pide reconstruir la cronología y compararla con el orden de lectura. Después solicita una hipótesis sobre el efecto del recuerdo apoyada en el fragmento.',
        summary: 'Distingue el orden de los hechos del orden en que el relato los presenta.'
      },
      {
        id: 'll22-02', at: [0, 1, 2], title: 'Reconocer un argumento por analogía', diff: 'media', skill: 'análisis argumentativo',
        q: 'En el argumento original «Así como una orquesta necesita ensayar de manera coordinada, nuestro equipo de debate necesita preparar sus intervenciones en conjunto», ¿qué procedimiento predomina?',
        o: ['Una apelación a una autoridad citada', 'Un ataque personal al oponente', 'Una demostración basada en porcentajes', 'Una analogía entre dos situaciones para apoyar una propuesta'], a: 3,
        why: ['No se cita una persona o institución como autoridad que sostenga la propuesta.', 'No se descalifica a una persona; se comparan actividades.', 'No se ofrecen datos numéricos ni porcentajes.', 'Se traslada una relación de coordinación desde la orquesta al equipo de debate para respaldar la preparación conjunta.'],
        learn: 'Un argumento por analogía apoya una conclusión mediante semejanzas relevantes entre situaciones. Identificarlo no equivale a aceptar su fuerza: es necesario examinar si las semejanzas justifican trasladar la conclusión y si existen diferencias importantes.',
        example: 'Separa el caso de referencia —la orquesta—, el caso discutido —el debate— y la relación compartida —coordinar intervenciones—. Luego pregunta si esa relación basta para recomendar preparación conjunta.',
        error: 'Dos situaciones pueden parecerse superficialmente sin que la semejanza sea relevante para la conclusión propuesta.',
        pedagogy: 'Invita a formular una analogía alternativa y a identificar un límite de cada comparación. Evalúa la justificación, no solo el nombre del tipo de argumento.',
        summary: 'Identifica qué se compara, qué relación se transfiere y si resulta pertinente.'
      },
      {
        id: 'll22-03', at: [1, 0, 2], title: 'Progresión temática lineal', diff: 'alta', skill: 'análisis de organización textual',
        q: 'Lee: «Las lluvias aumentaron el caudal del río. Ese aumento inundó el sendero. La inundación impidió el paso de excursionistas». ¿Qué organización temática predomina?',
        o: ['Progresión lineal: información nueva de una oración se retoma como tema de la siguiente', 'Tema constante: todas las oraciones mantienen exactamente el mismo tema', 'Ideas sin relación entre sí', 'Una enumeración de rasgos de un único tema sin continuidad entre oraciones'], a: 0,
        why: ['El aumento del caudal y luego la inundación pasan de información introducida a punto de partida de la oración siguiente.', 'Los puntos de partida cambian: lluvias, aumento e inundación.', 'Las referencias y relaciones causales conectan explícitamente las oraciones.', 'El texto construye una cadena de información y no una lista independiente de atributos.'],
        learn: 'La progresión temática organiza la relación entre información retomada y nueva. En una progresión lineal, parte de la información nueva de un enunciado se convierte en el punto de partida del siguiente. En una progresión de tema constante, se mantiene un mismo tema y se agregan datos sobre él.',
        example: 'Marca «aumentaron el caudal» y observa su recuperación como «ese aumento». Luego conecta «inundó el sendero» con «la inundación». Estas retomadas muestran cómo el texto avanza sin perder continuidad.',
        error: 'La repetición de palabras no es el único mecanismo de continuidad: nominalizaciones y expresiones equivalentes también recuperan información.',
        pedagogy: 'Pide reorganizar un párrafo desordenado y justificar cada enlace indicando qué información se retoma y cuál se añade.',
        summary: 'Sigue la cadena: información introducida → nuevo punto de partida.'
      },
      {
        id: 'll22-04', at: [1, 1, 2], title: 'Gestionar un diálogo argumentativo', diff: 'alta', skill: 'interacción argumentativa',
        q: 'En un debate sobre ampliar el horario de la biblioteca, dos estudiantes discrepan y comienzan a repetirse. ¿Qué intervención favorece la gestión de un diálogo argumentativo?',
        o: ['Dar por ganadora la postura del estudiante que habla más fuerte', 'Pedir que cada uno reformule el argumento del otro y luego responda con razones y evidencia pertinente', 'Evitar cualquier desacuerdo cambiando inmediatamente de tema', 'Decidir la conclusión antes de escuchar las razones'], a: 1,
        why: ['El volumen de voz no determina la calidad de un argumento.', 'La reformulación comprueba la comprensión y permite responder a razones efectivamente presentadas.', 'El desacuerdo puede contribuir a deliberar si se examinan las razones.', 'Una conclusión predeterminada impide considerar los argumentos de los participantes.'],
        learn: 'Argumentar en diálogo requiere escuchar, comprender la postura del otro, responder a sus razones y sostener las propias. Gestionar turnos y solicitar aclaraciones ayuda a que el intercambio progrese. Buscar acuerdos no exige eliminar toda diferencia.',
        example: 'Propón dos movimientos: «Entiendo que planteas… porque…» y «Mi respuesta a esa razón es…». Después pide identificar qué evidencia permitiría evaluar el punto en disputa.',
        error: 'Repetir la propia tesis con otras palabras no siempre responde al argumento del interlocutor.',
        pedagogy: 'Usa criterios observables: reformula fielmente, responde a una razón y aporta evidencia relevante. Ofrece un nuevo turno para aplicar la retroalimentación.',
        summary: 'Escucha, reformula, responde y fundamenta para que el diálogo avance.'
      },
      {
        id: 'll22-05', at: [2, 0, 1], title: 'Modelar la evaluación de fuentes', diff: 'alta', skill: 'alfabetización informacional',
        q: 'Un grupo prepara una investigación y elige como única fuente la primera publicación que aparece en una búsqueda. No identifica autor, fecha ni respaldo de las afirmaciones. ¿Qué acompañamiento docente es más pertinente?',
        o: ['Aceptar la fuente porque aparece primero', 'Reemplazar toda búsqueda por copiar una respuesta proporcionada por el docente', 'Modelar cómo revisar autoría, fecha, propósito y evidencias, contrastar otra fuente y registrar las referencias', 'Evaluar la confiabilidad únicamente por el diseño visual del sitio'], a: 2,
        why: ['La posición en un buscador no garantiza confiabilidad ni pertinencia.', 'Copiar evita que los estudiantes aprendan a buscar, contrastar y documentar información.', 'El modelado hace visibles criterios de evaluación y procedimientos transferibles a otras fuentes.', 'Un diseño atractivo puede acompañar información de calidad muy diversa; no basta como criterio.'],
        learn: 'Acompañar la investigación incluye delimitar una pregunta, buscar información pertinente, evaluar fuentes, contrastar afirmaciones y registrar referencias. La confiabilidad depende de evidencias y contexto; distintos tipos de fuente sirven a propósitos diferentes.',
        example: 'Piensa en voz alta ante una página: ¿quién la firma?, ¿qué intenta lograr?, ¿de dónde provienen los datos?, ¿otra fuente independiente los respalda? Registra autoría, título, fecha y enlace para poder volver a consultarla.',
        error: 'La popularidad, posición de búsqueda o apariencia profesional no sustituyen la evaluación de las afirmaciones y sus respaldos.',
        pedagogy: 'Compara dos fuentes sobre la misma pregunta y pide justificar qué aporta cada una, qué límites tiene y cómo se usará sin copiarla como producción propia.',
        summary: 'Busca con una pregunta, evalúa las fuentes, contrasta y registra su procedencia.'
      }
    ]
    ,
    'media-lengua': [
      {
        id: 'll22-01', at: [0, 0, 2], title: 'Analepsis y orden del relato', diff: 'media', skill: 'análisis narrativo',
        q: 'En un relato, una mujer entra hoy a una estación abandonada. Al tocar una banca, la narración retrocede diez años y cuenta su despedida de una amiga; luego vuelve a la estación actual. ¿Qué técnica organiza ese retroceso?',
        o: ['Prolepsis, porque anticipa el futuro', 'Narración estrictamente cronológica', 'Analepsis, porque recupera un episodio anterior', 'Descripción sin alteración temporal'], a: 2,
        why: ['La prolepsis anticipa acontecimientos posteriores, mientras aquí se recupera el pasado.', 'El discurso interrumpe la secuencia cronológica al retroceder diez años.', 'La analepsis introduce un acontecimiento previo al momento narrado.', 'El fragmento incorpora una escena pasada y no se limita a describir el presente.'],
        learn: 'La historia refiere a los acontecimientos y sus relaciones temporales; el discurso es la forma de presentarlos. Una analepsis recupera hechos anteriores y una prolepsis anticipa posteriores. Analizar su efecto implica observar qué información entrega y cómo modifica la comprensión del presente narrativo.',
        example: 'En la historia, primero ocurre la despedida y después la visita. En el discurso se narra la visita, se recuerda la despedida y se retorna al presente. El recuerdo puede explicar el valor afectivo de la estación.',
        error: 'Toda mención al pasado no constituye necesariamente una escena retrospectiva desarrollada: hay que observar cómo el discurso reorganiza la información.',
        pedagogy: 'Pide reconstruir la cronología y compararla con el orden de lectura. Solicita una hipótesis sobre el efecto del recuerdo apoyada en el fragmento.',
        summary: 'Distingue el orden de los hechos del orden en que el relato los presenta.'
      },
      {
        id: 'll22-02', at: [0, 1, 2], title: 'Reconocer un argumento por analogía', diff: 'media', skill: 'análisis argumentativo',
        q: 'En el argumento «Así como una orquesta necesita ensayar de manera coordinada, nuestro equipo de debate necesita preparar sus intervenciones en conjunto», ¿qué procedimiento predomina?',
        o: ['Apelación a una autoridad', 'Ataque personal', 'Demostración basada en porcentajes', 'Analogía entre dos situaciones para apoyar una propuesta'], a: 3,
        why: ['No se cita una autoridad.', 'No se descalifica a una persona.', 'No se ofrecen datos numéricos.', 'Se traslada una relación de coordinación desde la orquesta al equipo de debate.'],
        learn: 'Un argumento por analogía apoya una conclusión mediante semejanzas relevantes entre situaciones. Identificarlo no equivale a aceptar su fuerza: hay que examinar si las semejanzas justifican trasladar la conclusión.',
        example: 'Separa el caso de referencia, el caso discutido y la relación compartida. Después pregunta si esa relación basta para recomendar preparación conjunta.',
        error: 'Dos situaciones pueden parecerse superficialmente sin que la semejanza sea relevante para la conclusión.',
        pedagogy: 'Pide formular una analogía alternativa e identificar un límite de cada comparación. Evalúa la justificación, no solo el nombre.',
        summary: 'Identifica qué se compara, qué relación se transfiere y si resulta pertinente.'
      },
      {
        id: 'll22-03', at: [1, 0, 2], title: 'Progresión temática lineal', diff: 'alta', skill: 'organización textual',
        q: 'Lee: «Las lluvias aumentaron el caudal del río. Ese aumento inundó el sendero. La inundación impidió el paso de excursionistas». ¿Qué organización temática predomina?',
        o: ['Progresión lineal: información nueva se retoma como tema siguiente', 'Tema constante sin cambios', 'Ideas sin relación', 'Enumeración sin continuidad'], a: 0,
        why: ['El aumento del caudal y luego la inundación pasan a ser puntos de partida de la oración siguiente.', 'Los temas cambian: lluvias, aumento e inundación.', 'Las referencias y relaciones causales conectan las oraciones.', 'El texto construye una cadena de información.'],
        learn: 'En una progresión lineal, parte de la información nueva de un enunciado se convierte en el punto de partida del siguiente. En un tema constante, se mantiene un mismo tema y se agregan datos sobre él.',
        example: 'Marca «aumentaron el caudal» y su recuperación como «ese aumento». Luego conecta «inundó el sendero» con «la inundación».',
        error: 'La continuidad no depende solo de repetir palabras: nominalizaciones y expresiones equivalentes también retoman información.',
        pedagogy: 'Pide reorganizar un párrafo desordenado y justificar qué información se retoma y cuál se añade.',
        summary: 'Sigue la cadena: información introducida → nuevo punto de partida.'
      },
      {
        id: 'll22-04', at: [1, 1, 2], title: 'Gestionar un diálogo argumentativo', diff: 'alta', skill: 'interacción argumentativa',
        q: 'En un debate sobre ampliar el horario de la biblioteca, dos estudiantes discrepan y comienzan a repetirse. ¿Qué intervención favorece la gestión del diálogo?',
        o: ['Dar por ganadora la postura del que habla más fuerte', 'Pedir que cada uno reformule el argumento del otro y responda con razones y evidencia', 'Evitar el desacuerdo cambiando de tema', 'Decidir la conclusión antes de escuchar'], a: 1,
        why: ['El volumen no determina la calidad de un argumento.', 'La reformulación comprueba comprensión y permite responder a razones efectivamente presentadas.', 'El desacuerdo puede contribuir a deliberar.', 'Una conclusión predeterminada impide considerar argumentos.'],
        learn: 'Argumentar en diálogo requiere escuchar, comprender la postura del otro, responder a sus razones y sostener las propias. Gestionar turnos y solicitar aclaraciones ayuda a que el intercambio progrese.',
        example: 'Propón: «Entiendo que planteas… porque…» y «Mi respuesta a esa razón es…». Luego identifica qué evidencia permitiría evaluar el punto en disputa.',
        error: 'Repetir la propia tesis no siempre responde al argumento del interlocutor.',
        pedagogy: 'Usa criterios observables: reformula, responde a una razón y aporta evidencia relevante.',
        summary: 'Escucha, reformula, responde y fundamenta para que el diálogo avance.'
      },
      {
        id: 'll22-05', at: [2, 0, 1], title: 'Evaluar fuentes para investigar', diff: 'alta', skill: 'alfabetización informacional',
        q: 'Un grupo elige como única fuente la primera publicación que aparece en una búsqueda y no identifica autor, fecha ni respaldo. ¿Qué acompañamiento docente es más pertinente?',
        o: ['Aceptar la fuente porque aparece primero', 'Reemplazar toda búsqueda por copiar una respuesta del docente', 'Modelar cómo revisar autoría, fecha, propósito y evidencias, contrastar otra fuente y registrar referencias', 'Evaluar confiabilidad por el diseño visual'], a: 2,
        why: ['La posición en un buscador no garantiza confiabilidad.', 'Copiar evita aprender a buscar, contrastar y documentar.', 'El modelado hace visibles criterios y procedimientos transferibles.', 'La apariencia no basta como criterio.'],
        learn: 'Investigar incluye delimitar una pregunta, buscar información pertinente, evaluar fuentes, contrastar afirmaciones y registrar referencias. La confiabilidad depende de evidencias y contexto.',
        example: 'Pregúntate: ¿quién firma?, ¿qué propósito tiene?, ¿de dónde provienen los datos?, ¿otra fuente independiente los respalda? Registra autoría, título, fecha y enlace.',
        error: 'Popularidad, posición o apariencia profesional no sustituyen evaluar afirmaciones y respaldos.',
        pedagogy: 'Compara dos fuentes sobre la misma pregunta y pide justificar qué aporta cada una y qué límites tiene.',
        summary: 'Busca con una pregunta, evalúa, contrasta y registra la procedencia.'
      }
    ]
  };
  window.PE22_CONTENT = {};
  for (const [specialtyId, items] of Object.entries(lessons)) {
    const domains = window.PE_SYLLABUS_2026[specialtyId], guides = {}, questions = [];
    for (const item of items) {
      const [di, si, ii] = item.at, domain = domains[di], sub = domain[1][si];
      const indicatorId = item.at.join('-'), indicator = sub[1][ii];
      if (!indicator) throw new Error('Indicador desconocido: ' + specialtyId + '/' + indicatorId);
      const guide = {title: item.title, learn: item.learn, example: item.example, error: item.error, pedagogy: item.pedagogy, summary: item.summary, indicatorId, indicator, minutes: 5, questionIds: [item.id]};
      guides[indicatorId] = guide;
      questions.push({id: item.id, d: domain[0], i: sub[0], q: item.q, o: item.o, a: item.a, e: item.why[item.a], explanations: item.why, diff: item.diff, skill: item.skill, specialtyId, indicatorId, indicator, origin: 'Contenido propio ProfeECEP', version: '2.2'});
    }
    window.PE22_CONTENT[specialtyId] = {id: specialtyId, questions, guides};
  }
  const active = window.PE22_CONTENT[window.PE_ACTIVE_SPECIALTY];
  if (active) {
    window.QBANK = active.questions;
    window.STUDY_GUIDES = Object.fromEntries(active.questions.map(q => [q.i, active.guides[q.indicatorId]]));
  }
}());
