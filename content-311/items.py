"""Adaptaciones de las referencias 1–17 de SC-I(23), con razones particulares."""
ITEMS=[]
def add(n,track,indicator,kind,q,o,a,reasons,start,end,note):
    ITEMS.append(dict(number=n,track=track,page=track+1,indicatorId=indicator,questionType='escucha · '+kind,q=q,o=o,a=a,explanations=reasons,evidence=dict(start=start,end=end),adaptation=note))

add(1,1,'1-0-3','idea principal',
 'Which sentence best summarizes the main finding presented in “Happiness”?',
 ['Watching nature footage can increase positive emotions and reduce negative feelings.',
 'Buying expensive possessions produces more lasting happiness than watching nature.',
 'Nature programmes improve well-being only when viewers already live near wildlife.',
 'The study mainly explains how to film wildlife without disturbing animals.'],0,
 ['Entre 1:15 y 1:38 se enumeran aumentos de alegría, satisfacción y asombro, junto con disminuciones de cansancio y estrés. Esa combinación resume el hallazgo sobre ver imágenes de naturaleza.',
 'Las compras aparecen al inicio como posibles respuestas a qué nos hace felices. El estudio posterior analiza imágenes de naturaleza; no demuestra la superioridad de comprar cosas.',
 'Se comparan emociones antes y después de ver fragmentos en seis países. No se establece que los participantes deban vivir cerca de animales silvestres.',
 'La grabación trata de las emociones de quienes ven los documentales. No explica técnicas de cámara ni un procedimiento para filmar animales.'],75.8,98.4,
 'Se distinguen cuatro síntesis de alcance diferente para evitar dos alternativas casi equivalentes sobre naturaleza y felicidad. Se resume el efecto global informado.')

add(2,1,'1-1-0','vocabulario en contexto',
 'In the list of emotions reported in “Happiness”, what does “contentment” most nearly mean?',
 ['Support received from another person.','A feeling of satisfaction with one’s situation.','Curiosity about something unfamiliar.','A sudden feeling of astonishment.'],1,
 ['Support se refiere al apoyo recibido. La pista enumera estados emocionales del espectador; contentment nombra satisfacción, no la ayuda de otra persona.',
 'Contentment expresa satisfacción o conformidad con la propia situación. En 1:16 aparece junto a joy y curiosity: emociones relacionadas, pero con significados diferentes.',
 'Curiosity es el deseo de conocer o descubrir. La grabación la menciona como otro elemento de la lista, separado de contentment.',
 'Astonishment se aproxima a amazement o wonder, también presentes en la lista. Contentment expresa satisfacción sin requerir sorpresa.'],75.8,82.5,
 'Se usa la enumeración oral para interpretar vocabulario. Los distractores representan conceptos distintos y evitan enfrentar placer y satisfacción como categorías excluyentes.')

add(3,2,'1-0-0','argumento central',
 'According to the interviewee in “Going to Mars”, what is a major scientific benefit of an ambitious Mars mission?',
 ['It guarantees a profitable business as soon as the spacecraft arrives.','It makes every student physically fit enough to become an astronaut.','It can inspire a generation to pursue science, engineering and technology.','It removes the need for future scientific research on Earth.'],2,
 ['No se presenta una garantía de rentabilidad. El argumento se centra en cómo la exploración puede despertar aspiraciones científicas en la siguiente generación.',
 'Los hábitos saludables y las notas aparecen como ejemplos al imaginar la selección de astronautas. No se afirma que todos los estudiantes podrán convertirse en astronautas.',
 'En 0:14–0:23 afirma que el proyecto podría galvanize a generation of students hacia la ciencia, la ingeniería y la tecnología. Después vuelve a la ambición de la siguiente generación.',
 'La exploración se presenta como estímulo para hacer más ciencia. No se dice que sustituya toda la investigación terrestre ni que vuelva innecesarios otros proyectos.'],14,23,
 'Se identifica el argumento global explícito y se distingue de ejemplos secundarios sobre condición física y selección de astronautas.')

add(4,2,'1-1-0','vocabulario en contexto',
 'The interviewee says that a loss of ambition has “stymied” efforts to imagine the future. What does “stymied” mean here?',
 ['Encouraged those efforts to develop faster.','Obstructed those efforts or held them back.','Recorded those efforts in a written report.','Replaced those efforts with a completed mission.'],1,
 ['Encouraged expresa impulso, el sentido contrario al pasaje. El entrevistado lamenta que la pérdida de ambición limite la capacidad de proyectarse hacia el futuro.',
 'Stymied significa obstaculizado o frenado. En 0:52–1:07 la desaparición del deseo de soñar con el mañana dificulta los esfuerzos mientras otros países avanzan.',
 'El pasaje relaciona la pérdida de aspiraciones con dificultades para avanzar. No trata de registrar ni de documentar los esfuerzos realizados.',
 'La frase no afirma que una misión esté terminada. Describe un impedimento para imaginar el futuro, no la sustitución por un proyecto ya realizado.'],52.3,67.5,
 'Se interpreta el significado contextual de stymied mediante la relación causal del pasaje, sin confundir obstaculizar con hacer desaparecer.')

add(5,3,'1-0-9','situación comunicativa',
 'Which description best fits the way “Agriculture” presents its information?',
 ['A personal conversation in which two farmers disagree about a recent event.','An instruction session that guides the listener through operating a specific machine.','An explanatory documentary segment that introduces precision agriculture through examples.','A sales announcement that asks listeners to buy one named product at a special price.'],2,
 ['La pista ofrece una exposición organizada de aplicaciones tecnológicas. No presenta un intercambio entre agricultores con posiciones enfrentadas sobre un acontecimiento.',
 'Se explica para qué sirven mapas, GPS y drones, pero no se dan pasos para operar una máquina determinada. Describir aplicaciones no equivale a impartir un tutorial.',
 'La pregunta inicial introduce una explicación general, seguida de ejemplos sobre datos de suelos, GPS, fertilización variable y drones. Esa organización corresponde a un segmento documental explicativo.',
 'Se mencionan beneficios económicos, pero no se ofrece un producto identificado, un precio especial ni una orden de compra. Las ventajas son parte de la explicación.'],7.5,69.2,
 'La situación comunicativa se fundamenta en la organización expositiva y los ejemplos. No se evalúan efectos de sonido que no se verificaron manualmente.')

add(6,3,'1-0-8','propósito comunicativo',
 'What is the main communicative purpose of “Agriculture”?',
 ['To tell the life story of a farmer who invented a drone.','To explain how data and technology can improve farming decisions and productivity.','To instruct listeners to stop using all fertilizers immediately.','To persuade listeners to purchase a particular brand of farming equipment.'],1,
 ['No se organiza la información como una biografía. Se presentan varias tecnologías y sus aplicaciones, sin seguir la vida de un agricultor inventor.',
 'El recorrido va desde la recolección y análisis de datos hasta GPS, insumos de aplicación variable y drones. Informa cómo esas herramientas pueden mejorar el trabajo agrícola.',
 'La aplicación variable ajusta fertilizantes y pesticidas a las necesidades del terreno. La grabación no ordena eliminar todos los fertilizantes.',
 'Aunque se describen ventajas, no se identifica una marca que se quiera vender. El foco es explicar un conjunto de aplicaciones de la agricultura de precisión.'],11.5,88.9,
 'Se distingue el propósito informativo global de una instrucción operativa, un relato biográfico y una venta de marca.')

add(7,4,'1-0-4','comparación de ideas',
 'In “Plastic Trash”, consider the two guest contributions, excluding the narrator. What does each guest mainly discuss?',
 ['The first discusses recovering or redesigning plastic packaging; the second discusses farming practices that protect soil and water.','The first explains how to prevent algal growth; the second describes how ocean currents transport plastic.','Both mainly explain how to produce more disposable packaging at a lower price.','The first discusses moving farmers to cities; the second proposes banning all food production.'],0,
 ['El primer aporte, desde 0:52, propone superar take, make, dispose y recuperar o rediseñar envases. El segundo, desde 2:10, relaciona prácticas agrícolas y salud del suelo con nutrientes y calidad del agua.',
 'Las explicaciones sobre algas y corrientes pertenecen a la narración. La alternativa atribuye esos pasajes a los invitados y no recoge el eje de sus intervenciones.',
 'La primera intervención busca que los envases no terminen como residuos; la segunda aborda suelo y agua. Ninguna se centra en abaratar más envases desechables.',
 'No se propone desplazar agricultores ni acabar con la producción de alimentos. Se plantean cambios en envases y prácticas agrícolas para reducir impactos.'],51.7,181.1,
 'Se comparan las ideas de dos invitados y se excluye expresamente al narrador para evitar confundir tres voces con dos aportes.')

add(8,4,'1-0-2','conclusión contextual',
 'The second guest says, “If you eat, you’re involved in agriculture”, and then calls for people to work together. What point is the guest making?',
 ['Eating gives every person specialist knowledge about farming.','Only farmers can take part in discussions about water pollution.','Food connects everyone to agriculture, so addressing its environmental effects requires shared involvement.','Every consumer causes exactly the same amount of agricultural pollution.'],2,
 ['Comer implica depender del sistema alimentario. Esa relación no atribuye conocimientos técnicos a todas las personas que consumen alimentos.',
 'La frase siguiente invita a todos a trabajar juntos. El invitado amplía la participación y no reserva el problema exclusivamente a quienes cultivan.',
 'En 2:10–2:20 enlaza comer, estar involucrado en agricultura y trabajar juntos. El problema concierne a consumidores y productores, aunque sus responsabilidades no sean idénticas.',
 'El pasaje no mide aportes individuales ni afirma una culpa igual para todos. Estar vinculado al problema no equivale a contaminar exactamente la misma cantidad.'],130.1,140.3,
 'La conclusión relaciona la afirmación inclusiva con el llamado a colaborar; se evita transformarla en una supuesta culpa idéntica para todas las personas.')

add(9,4,'1-0-7','destinatario',
 'Who is the most likely intended audience of “Plastic Trash”?',
 ['Only specialists designing industrial plastic-processing machines.','Only researchers who already know the technical details of ocean dead zones.','Only farmers being trained to operate a particular fertilizer applicator.','Members of the general public who need an accessible explanation of pollution and possible responses.'],3,
 ['El audio incorpora envases, océanos, alimentación y suelos. Su alcance excede el diseño técnico de máquinas y ofrece explicaciones para no especialistas.',
 'La narración explica cómo nutrientes, algas y pérdida de oxígeno se relacionan. Esa introducción no presupone que toda la audiencia sea experta en zonas muertas.',
 'La agricultura es solo una parte del mensaje y no se enseña a operar un equipo. La interpelación incluye a consumidores, no únicamente a agricultores.',
 'Los ejemplos cotidianos y If you eat, you’re involved vinculan el problema con cualquier persona. Las explicaciones introductorias y las respuestas posibles apuntan a una audiencia amplia.'],88.8,140.3,
 'Se identifica al destinatario mediante el registro accesible y la interpelación inclusiva, sin reducirlo a uno de los sectores mencionados.')

add(10,5,'1-0-9','organización de testimonios',
 'Which feature best describes the organization of the contributions in “The Song of My Life”?',
 ['The speakers debate one another and reach a single agreement about the best song.','The speakers give separate personal responses to the same guiding topic: music that changed their lives.','A teacher gives step-by-step instructions and the speakers repeat each step.','The speakers discuss unrelated topics without a common focus.'],1,
 ['Se presentan recuerdos personales por separado, sin una discusión entre participantes destinada a acordar cuál canción es la mejor.',
 'Un testimonio cuenta un descubrimiento musical; otro, la influencia de discos y clubes; el último, un cambio de carrera con una canción propia. Los une la música que cambió sus vidas.',
 'No se organiza una secuencia de instrucciones para que otros la reproduzcan. Los participantes recuerdan y valoran experiencias vinculadas a canciones o discos.',
 'Aunque las experiencias y elecciones varían, todas responden al mismo eje autobiográfico. La variedad de respuestas no supone ausencia de tema común.'],0.3,108.4,
 'Se reconoce el rasgo observable de respuestas separadas a un tema común, sin inferir el protocolo completo de una entrevista a partir de un montaje.')

add(11,5,'1-1-1','expresión figurada',
 'The first speaker says someone had already “cracked the thing we’d been talking about”. What does this expression mean in context?',
 ['Someone had physically broken the recording equipment.','Someone had hidden the song by encoding it.','Someone had abandoned the idea before trying it.','Someone had figured out how to achieve the musical idea they had discussed.'],3,
 ['El problema es combinar hardcore con más melodía y emoción. No se menciona un equipo roto: cracked se usa figuradamente para resolver un desafío.',
 'El amigo invita a escuchar un disco que ya logra lo que imaginaban. No se describe un código que oculte la canción ni una acción de cifrarla.',
 'La escucha produce descubrimiento y entusiasmo porque la idea ya se ha realizado. Eso contradice que se hubiera abandonado sin intentar concretarla.',
 'Desde 0:14 plantea una inquietud musical y, hacia 0:30, cuenta que alguien ya la resolvió. Crack something significa encontrar la forma de lograr o resolver algo difícil.'],14.6,47.2,
 'Se interpreta una expresión figurada dentro del desafío musical que le da sentido, relacionando el problema previo con la solución descubierta.')

add(12,6,'1-0-6','actitud del hablante',
 'Near the end of “Passenger”, the speaker promises “smarter, faster, safer and more efficient” operations. What attitude toward the service does this wording convey?',
 ['Cautious doubt about whether the service has any practical use.','An apologetic attitude focused on admitting that the service has failed.','A confident, promotional attitude that emphasizes benefits to potential customers.','Indifference to whether listeners ever use the service.'],2,
 ['El cierre acumula beneficios y ofrece ayuda al destinatario. No plantea dudas sobre la utilidad de la solución, por lo que escepticismo no describe ese pasaje.',
 'No aparece una disculpa ni el reconocimiento de un fracaso. Los comparativos presentan mejoras que el proveedor afirma poder ofrecer.',
 'En 2:30–2:45 los comparativos positivos y la invitación a conocer el servicio construyen confianza e intención promocional. La inferencia se apoya en palabras explícitas.',
 'La invitación a averiguar cómo pueden ayudar busca una reacción del oyente. Ese interés por que conozca el servicio contradice la indiferencia.'],150.7,164.8,
 'La actitud se infiere de un pasaje delimitado y sus elecciones léxicas; no depende solo de una impresión no contrastada sobre la entonación.')

add(13,6,'1-0-1','dato específico',
 'According to “Passenger”, what result is reported for travellers using e-gates at one European airport?',
 ['They can clear border control in as little as 7.5 seconds.','They complete customs declarations in exactly 90 minutes.','Every traveller at every airport is guaranteed the same processing time.','They complete initial screening and watchlist checks there in less than 60 seconds.'],0,
 ['En 1:34–1:42 se dice in one European airport e in as little as 7.5 seconds. Es un resultado reportado para ese caso, no un tiempo garantizado para todos los controles.',
 'Se mencionan 90 seconds or less para kioscos en Norteamérica. La alternativa cambia segundos por minutos y traslada el dato a otra ubicación.',
 'La expresión as little as señala un tiempo alcanzado en un caso. El audio no formula una garantía universal para todas las personas y aeropuertos.',
 'El dato inferior a 60 segundos corresponde a comprobaciones iniciales en dos aeropuertos del Caribe. No es el ejemplo europeo solicitado.'],94.2,101.6,
 'Se localiza un dato manteniendo el matiz as little as y distinguiendo ubicación, proceso y unidad. Las cifras se atribuyen a la grabación histórica.')

add(14,6,'1-0-8','intención promocional',
 'What is the main purpose of “Passenger” as a whole?',
 ['To give travellers the exact steps for renewing a passport at home.','To compare several competing suppliers without favouring any of them.','To criticize the use of technology at every international border.','To promote a provider’s border-automation services to airports and border agencies.'],3,
 ['Se habla de controles automatizados para aeropuertos y agencias. No se detallan pasos, documentos ni requisitos para renovar un pasaporte personal.',
 'El emisor utiliza our government customers y we can help you. Presenta su propia oferta, sin hacer una comparación neutral entre varios proveedores.',
 'El mensaje defiende la automatización mediante ejemplos de rapidez y seguridad. No se organiza como una crítica ni pide retirar esa tecnología.',
 'Los beneficios y datos culminan en una invitación a conocer cómo el proveedor puede mejorar las operaciones. Esa finalidad comercial es más específica que informar en general.'],130.1,164.8,
 'Se determina el propósito comercial global y el destinatario institucional, distinguiéndolos de los datos informativos utilizados como apoyo.')

add(15,7,'1-0-1','referencia familiar',
 'In “Certificate of Citizenship”, whose certificate is being examined?',
 ['The interviewee’s child’s certificate.','The interviewee’s wife’s certificate.','The interviewee’s father’s certificate.','The interviewee’s grandfather’s certificate.'],3,
 ['El documento se identifica como el del abuelo. La posterior mención de un niño que llega con su madre pertenece al relato familiar y no cambia al titular.',
 'La esposa llegó después de la naturalización. Su aparición en esa historia no convierte el certificado que examinan en un documento de ella.',
 'El padre aparece después, al recordar su llegada y experiencias. Your grandfather permite distinguir al titular de esa persona mencionada más adelante.',
 'En 0:15–0:19 el entrevistador dice when your grandfather became an American citizen. La identificación explícita sitúa al abuelo como titular del certificado.'],12.5,19.2,
 'Se identifica una referencia familiar explícita, diferenciando al titular del documento de las personas mencionadas después.')

add(16,7,'1-0-6','ironía',
 'After hearing that the father saw “Dr. Jekyll and Mr. Hyde”, the interviewer says, “Something to help you sleep at night.” How should this comment be understood?',
 ['As literal medical advice for treating the father’s sleeping problems.','As an ironic comment: a frightening film would be unlikely to help someone sleep peacefully.','As a request for the interviewee to stop telling the story and go to sleep.','As confirmation that the film was designed to teach English vocabulary.'],1,
 ['No se habla de un tratamiento ni se diagnostica insomnio. La frase responde a una película inquietante, por lo que no funciona como consejo médico literal.',
 'La aparente ayuda para dormir contrasta con lo perturbador de la película y la sorpresa previa sobre que lo llevaran a verla. Esa oposición entre lo literal y lo sugerido produce la ironía.',
 'El entrevistador comenta la anécdota del padre; no pide al entrevistado que se retire. La conversación continúa sobre experiencias de adaptación familiar.',
 'Después se menciona la dificultad con el inglés, pero no se vincula la película con una actividad de enseñanza. El comentario expresa ironía, no una finalidad didáctica.'],82.1,91.6,
 'Se interpreta el sentido pragmático local mediante el comentario exacto y el contraste contextual, sin deducir consejos médicos ni rasgos de carácter.')

add(17,7,'1-1-0','sentido de moving',
 'When the interviewee says that seeing the certificate is “very moving for me”, what does “moving” express?',
 ['That the certificate causes a strong emotional response.','That the document is physically travelling between countries.','That the speaker is currently preparing to move to another home.','That the speaker wants to change the topic because it is unimportant.'],0,
 ['En 0:48–0:52 moving describe lo que siente al ver el documento del abuelo. El posterior relato de sacrificios familiares refuerza el sentido de conmovedor o emotivo.',
 'La familia realizó un viaje, pero very moving for me valora un efecto emocional. No describe el desplazamiento físico del documento entre países.',
 'No se anuncia una mudanza actual. Moving funciona aquí como adjetivo de una experiencia emotiva, no como un plan de traslado.',
 'El hablante permanece en el tema y explica la importancia del abuelo en su vida. Eso contradice que considere irrelevante la información y quiera descartarla.'],48.1,56.3,
 'Se distingue el adjetivo emotivo del significado de desplazamiento, una confusión posible por el contexto migratorio del relato.')
