from common import *
S='basica-ingles'
def aud(key):return [material('audio-'+key)]
rev(S+'-28-04','Listen to the garden message. Which general view of volunteering is implied by the arrangements?',
 ('People with different experience levels and schedules can contribute.','No se exige experiencia y se acepta ayuda de media hora. Al integrar ambas pistas se infiere una participación flexible y abierta a distintos voluntarios.'),
 ('Only experienced gardeners who can stay all morning are useful.','Contradice las dos pistas: no se requiere experiencia y también se valora una participación breve.'),
 ('The main aim is to select people for paid gardening jobs.','El audio convoca voluntarios y ofrece una planta; no habla de selección laboral ni de empleos remunerados.'),
 ('Volunteers are expected to work alone without shared resources.','La organización proporciona herramientas y propone un taller. No hay indicios de trabajo exclusivamente individual sin apoyo.'),aud('garden'))
rev(S+'-28-17','Listen to the Westport recording. In which communicative situation does this message occur?',
 ('A public announcement to passengers at a railway station.','El aviso se dirige a pasajeros y menciona servicios cancelados, andenes, billetes y personal de estación; esas pistas sitúan la comunicación.'),
 ('A private phone conversation between two friends arranging a trip.','La llamada inicial a pasajeros y las instrucciones generales corresponden a un aviso público, no a una conversación privada entre amistades.'),
 ('A classroom discussion about the history of transport.','Se dan instrucciones inmediatas sobre trenes y billetes, no una explicación histórica ni un intercambio de aula.'),
 ('A sales meeting promoting a newly designed train.','El mensaje resuelve una cancelación y ofrece una alternativa de viaje; no busca comercializar un producto nuevo.'),aud('station'))
rev(S+'-287-10','Listen to the museum message. Which set of information is explicitly provided for the visit as a whole?',
 ('What to carry, where to leave backpacks, when to meet the guide and how to take photos.','El mensaje incluye cuadernos en bolsas pequeñas, mochilas en casilleros, encuentro en cinco minutos y fotos sin flash. La opción reúne información explícita del conjunto.'),
 ('Ticket prices, the museum’s history and the café opening hours.','El audio no entrega precios, historia del museo ni horario del café; son datos plausibles para un museo, pero no los comunicados.'),
 ('The guide’s biography, the bus route and the lunch menu.','Ninguno de esos datos aparece en el mensaje, que se centra en instrucciones para entrar y participar en la visita.'),
 ('How to buy art, book a hotel and apply for museum jobs.','El mensaje no trata ventas, alojamiento ni empleo; da indicaciones prácticas al grupo que ingresará al museo.'),aud('museum'))
rev(S+'-287-11','Listen to the garden announcement. Which item must volunteers bring themselves?',
 ('Their gloves.','Se indica literalmente «Bring your own gloves». Las herramientas serán proporcionadas por la organización.'),
 ('All the gardening tools.','El audio señala que la organización proporcionará las herramientas; el objeto solicitado a cada voluntario son sus guantes.'),
 ('A plant to donate at the end.','La planta se puede llevar a casa al terminar; no se pide traer una para donarla.'),
 ('A certificate of gardening experience.','El aviso dice que no se necesita experiencia. No solicita ningún certificado.'),aud('garden'))
rev(S+'-287-12','What is the main communicative purpose of the Westport announcement?',
 ('To inform passengers about a cancellation and explain their travel alternative.','El aviso comunica el problema del tren y especifica servicio alternativo, andén y validez de billetes; su propósito es orientar a quienes necesitan viajar.'),
 ('To persuade passengers to buy a more expensive ticket.','Se aceptarán los billetes existentes y no es necesario acudir a la boletería; no se intenta vender una tarifa mayor.'),
 ('To describe how engineers manufacture train components.','Se menciona una avería como causa, pero no se explica un proceso técnico de fabricación.'),
 ('To ask passengers to evaluate the station’s architecture.','No se solicita una evaluación del edificio; se entregan instrucciones frente a una cancelación.'),aud('station'))
rev(S+'-287-13','Which situation best matches the community garden recording?',
 ('An organizer giving a group of volunteers practical updates before an event.','Se habla a voluntarios sobre horario, lugar y materiales para una actividad próxima; corresponde a coordinación previa del evento.'),
 ('Two gardeners negotiating the sale of their business.','No hay negociación ni venta: una voz entrega instrucciones a voluntarios de una actividad comunitaria.'),
 ('A student answering questions in a gardening exam.','El mensaje no contiene preguntas de evaluación ni respuestas de un estudiante; anuncia cambios organizativos.'),
 ('A customer making a complaint about a purchased plant.','La planta se menciona como algo que los voluntarios podrán llevar al final; no se describe una compra ni un reclamo.'),aud('garden'))
rev(S+'-287-14','In the museum message, what does “Keep an eye on the time” mean?',
 ('Pay attention to the time so the group is not late.','La expresión idiomática significa vigilar o prestar atención. La advertencia sobre perder tiempo de taller si llegan tarde confirma el sentido.'),
 ('Draw an eye next to the clock in the notebook.','Interpreta literalmente «eye» y no la expresión completa; la instrucción busca puntualidad, no un dibujo.'),
 ('Stop looking at clocks during the visit.','La expresión pide atender al tiempo, lo opuesto a dejar de mirar la hora.'),
 ('Spend as much time as possible in the lockers.','Se debe encontrar al guía en cinco minutos; prolongar la espera en casilleros contradice la instrucción.'),aud('museum'))
r=rev(S+'-307-14','Which claim is challenged by the cyclist’s experience?',
 ('Changing how you commute is worthwhile only if it reduces travel time.','El trayecto toma aproximadamente lo mismo que en bus, pero el ciclista llega más despierto. Integrar duración y bienestar permite cuestionar que solo el ahorro de tiempo dé valor al cambio.'),
 ('A route can affect how someone experiences a journey.','La ruta más tranquila por el parque respalda esta idea en vez de refutarla.'),
 ('Advice from a colleague can help a commuter find another route.','El colega mostró una ruta alternativa: esa afirmación se confirma en el relato.'),
 ('A traveller’s expectations may differ from the eventual outcome.','Esperaba ahorrar mucho tiempo y obtuvo otro beneficio; el relato ejemplifica esta idea, no la contradice.'),aud('cycling'))
r['indicatorId']='1-0-2'
rev(S+'-306-2023-35','Leo asked his friend, “Can I borrow your dictionary?” Which sentence correctly reports his question?',
 ('Leo asked his friend if he could borrow his dictionary.','Una pregunta indirecta de sí/no usa if o whether y orden sujeto + verbo: he could borrow. Can pasa a could en este reporte en pasado; no se conserva la inversión de la pregunta directa.'),
 ('Leo asked his friend if could he borrow his dictionary.','Después de if se usa orden declarativo: he could borrow. La inversión could he corresponde a una pregunta directa, no a esta subordinada.'),
 ('Leo asked his friend that he could borrow his dictionary.','That no introduce aquí la pregunta indirecta de sí/no. Se necesita if o whether para conservar el sentido de preguntar.'),
 ('Leo asked his friend if he can borrowed his dictionary.','Después de un modal se usa el verbo base borrow, nunca borrowed. En este reporte en pasado también corresponde el ajuste can → could.'),[])
rev(S+'-28-16','Read: “We used 40 plastic cups last week. By bringing reusable bottles, we plan to reduce that number to ten.” What does “reduce” mean here?',
 ('Make the number smaller.','El contexto pasa de 40 a 10 vasos; reduce expresa disminuir esa cantidad.'),
 ('Make the number larger.','Aumentar sería pasar a más de 40. El plan explícito es bajar de 40 a 10.'),
 ('Keep the number exactly the same.','Mantenerla igual no coincide con el cambio numérico descrito en el texto.'),
 ('Count the cups without changing their use.','Contar puede permitir medir, pero reduce se refiere a la disminución buscada, no solo al conteo.'),[])
rev(S+'-307-39','A class must compare weekend plans in English and agree on one group activity. Which use of a short video best promotes interaction and collaboration?',
 ('Give pairs different details from the video, then have them exchange information and justify a shared choice.','El reparto de información crea una necesidad de comunicarse; intercambiar datos y acordar una actividad exige participación y colaboración orientadas al objetivo.'),
 ('Have everyone watch alone and copy the subtitles without discussing any plans.','Copiar puede aportar práctica escrita, pero no exige intercambio de información ni una decisión colaborativa.'),
 ('Let the teacher choose the activity while learners silently check the video’s image quality.','La decisión queda en el docente y el foco es técnico; los estudiantes no negocian planes ni practican la interacción prevista.'),
 ('Ask one fluent learner to speak for every group while classmates only listen.','Concentrar la producción en una persona limita la participación y no ofrece oportunidades de interacción al resto.'),[])
rev(S+'-307-47','Learners will co-write an English invitation and revise it after peer feedback. Some cannot connect from home. Which resource plan best supports participation and collaboration?',
 ('Use shared drafts during class, with paper or offline alternatives, and assign roles for writing, commenting and revising.','El recurso se evalúa por su función pedagógica y acceso: los roles y la retroalimentación permiten colaboración, y las alternativas evitan excluir a quienes no tienen conexión doméstica.'),
 ('Choose an app that ranks individual spelling scores and never allows shared drafts.','Un ranking puede medir una habilidad limitada, pero no responde al objetivo de escritura conjunta y revisión entre pares.'),
 ('Require every student to edit online at home because synchronous access is the only possible collaboration.','La exigencia excluye a quienes no tienen conexión y desconoce opciones presenciales u offline para colaborar.'),
 ('Ask only students with home internet to write while the others copy the final version.','Copiar al final no ofrece participación equivalente en producción ni retroalimentación; convierte una limitación de acceso en exclusión del aprendizaje.'),[])
rev(S+'-306-2023-48','A learner writes “hair short” and “eyes brown” in a description. Which feedback best helps the learner revise the pattern?',
 ('Compare “short hair” and “brown eyes” with your phrases; identify where the describing word goes, then revise both.','La retroalimentación focaliza el orden adjetivo + sustantivo, aporta modelos comparables y pide aplicar la regla a los errores observados.'),
 ('Your description is wrong; copy the whole paragraph five times.','Se sanciona el producto sin identificar el patrón ni orientar una revisión consciente del orden de palabras.'),
 ('Add -s to every adjective because the nouns are plural.','Los adjetivos ingleses no marcan plural de ese modo; además, el error principal del ejemplo es el orden.'),
 ('Change all the verbs to the past tense.','El problema aportado no es temporal: se observa el adjetivo después del sustantivo en grupos nominales.'),[])
rev(S+'-306-2023-51','A learner writes “two childs” and “three womans”. Which feedback most directly supports revision?',
 ('Contrast child/children and woman/women with regular plurals, then revise your examples and explain which pattern changed.','Los errores generalizan -s a sustantivos irregulares. Contrastar formas y aplicarlas ayuda a reconocer la excepción y comprobar la comprensión.'),
 ('Remove the numbers so the sentences cannot be checked.','Eliminar información no enseña las formas plurales ni aborda la generalización que produjo los errores.'),
 ('Keep adding -s because every English noun forms its plural that way.','Child y woman son precisamente contraejemplos: children y women no se forman agregando -s.'),
 ('Focus only on the pronunciation of the first consonant.','El error escrito corresponde a morfología de plural; la consonante inicial no explica ni corrige ambos ejemplos.'),[])
rev(S+'-306-2023-58','A learner writes “We must save the water”, meaning water as a resource in general. Which feedback best helps express that intended meaning?',
 ('For a general reference to this uncountable noun, try “We must save water”; contrast it with “the water in this tank”.','La comparación distingue referencia general sin artículo de una cantidad específica identificada por the. Respeta el significado declarado por el estudiante.'),
 ('Always remove the from every noun phrase, even when it identifies a specific supply.','The sí puede ser pertinente ante un referente identificado, como el agua de un tanque. La regla propuesta es demasiado amplia.'),
 ('Write “a water” because every singular idea requires a.','Water como recurso general es incontable; el artículo indefinido no se usa así para expresar ese sentido.'),
 ('Change must to might because the article depends only on the modal verb.','La elección de artículo depende de referencia y contabilidad, no de cambiar la fuerza del modal.'),[])
# Literal tasks use explicit wording after reclassification.
ROWS[S+'-307-05']['q']='According to the library notice, how can readers return books on Tuesday?'
ROWS[S+'-307-44']['q']='According to the station announcement, what happens to tickets for the cancelled service?'
ROWS[S+'-307-48']['q']='According to the cooking notice, why should families report allergies in advance?'
