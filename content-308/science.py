from common import *
S='basica-ciencias'
def n(x):return f'{S}-307-{x:02d}'
rev(n(3),'Después de la absorción intestinal, la glucosa llega por la sangre a un músculo. ¿Qué característica de los capilares favorece que pase hacia sus células?',
 ('Sus paredes delgadas facilitan el intercambio entre sangre y tejidos.','Los capilares tienen paredes muy delgadas y una extensa superficie de contacto; allí ocurre el intercambio con el líquido que rodea las células.'),
 ('Sus válvulas descomponen la glucosa antes de su salida.','Las válvulas no realizan digestión de glucosa. El paso de sustancias se relaciona con las paredes capilares y los mecanismos de transporte.'),
 ('Su pared muscular impulsa la sangre como lo hace el corazón.','La propulsión principal corresponde al corazón. Los capilares se especializan en intercambio, no en una pared muscular gruesa.'),
 ('Sus paredes impiden todo intercambio para conservar los nutrientes.','Una pared impermeable a todas las sustancias impediría que los tejidos recibieran nutrientes y eliminaran desechos.'),[])
rev(S+'-28-02','Durante actividad física, el corazón bombea sangre hacia los músculos. ¿Qué función de los ventrículos permite ese transporte?',
 ('Su contracción genera presión para impulsar la sangre hacia las arterias.','Los ventrículos se contraen y expulsan sangre: el derecho hacia la circulación pulmonar y el izquierdo hacia la circulación sistémica.'),
 ('Sus paredes absorben nutrientes directamente desde el intestino.','La absorción intestinal ocurre en el intestino delgado; los ventrículos impulsan sangre que transporta sustancias ya absorbidas.'),
 ('Sus cavidades producen el oxígeno que consumen los músculos.','El oxígeno se incorpora a la sangre en los pulmones. El corazón lo distribuye mediante el bombeo, pero no lo produce.'),
 ('Sus válvulas intercambian gases con el aire inspirado.','Las válvulas dirigen el flujo de sangre y evitan retrocesos. El intercambio con el aire ocurre en los alvéolos pulmonares.'),[])
rev(n(5),'¿Cómo trabajan juntos el moco y los cilios de las vías respiratorias para disminuir la entrada de microorganismos?',
 ('El moco los atrapa y el movimiento ciliar desplaza el material hacia la faringe.','La retención y el transporte hacia la faringe facilitan su eliminación o deglución; es una defensa inespecífica que no requiere reconocer un antígeno particular.'),
 ('El moco fabrica anticuerpos y los cilios conservan memoria de cada virus.','La fabricación de anticuerpos y la memoria específica corresponden a componentes adaptativos, no al mecanismo físico mucociliar.'),
 ('Los cilios impulsan los microorganismos hacia los alvéolos para aumentar la ventilación.','El barrido ciliar favorece retirar material de las vías respiratorias; dirigirlo hacia zonas profundas dificultaría esa defensa.'),
 ('El moco destruye todos los microorganismos y evita cualquier infección.','El sistema reduce la exposición, pero no elimina todos los agentes ni garantiza ausencia de infección; pueden superar las barreras.'),[])
rev(n(12),'Una explicación sostiene que el preservativo actúa como barrera; otra dice que evita el embarazo al inhibir la ovulación. ¿Qué evidencia del mecanismo permite evaluar ambas?',
 ('La primera es coherente: el método obstaculiza el paso de espermatozoides sin actuar hormonalmente sobre el ovario.','El preservativo es un método de barrera. Su mecanismo no depende de inhibir la ovulación, a diferencia de ciertos métodos hormonales.'),
 ('La segunda es coherente: todo método anticonceptivo inhibe necesariamente la ovulación.','Existen mecanismos diversos. Una barrera física no necesita impedir la liberación de un ovocito para dificultar la fecundación.'),
 ('Ambas son equivalentes porque barrera e inhibición hormonal describen el mismo proceso.','Bloquear físicamente el paso y modificar señales hormonales son mecanismos distintos, aunque ambos puedan reducir la probabilidad de embarazo.'),
 ('Ninguna es coherente: el preservativo actúa después de la implantación.','El mecanismo de barrera actúa antes de la fecundación; no depende de intervenir sobre un embrión implantado.'),[])

for qid,context in [(n(15),'La extracción intensiva de un pez depredador aumenta los ingresos inmediatos de una localidad.'),(S+'-28-06','Una pesquería aumenta la captura de un depredador para vender más ejemplares durante una temporada.')]:
 rev(qid,context+' Luego aumentan sus presas herbívoras y disminuye la vegetación acuática. ¿Qué evaluación integra beneficio y perjuicio?',
 ('Puede aumentar el ingreso a corto plazo, pero alterar la red alimentaria y los recursos de los que depende la actividad.','La extracción entrega un beneficio económico inmediato, mientras la reducción del depredador puede favorecer herbívoros y reducir la vegetación; esos efectos comprometen el sistema a más largo plazo.'),
 ('El ingreso económico demuestra que no hubo perjuicios ecológicos.','El beneficio monetario no permite descartar cambios en la red alimentaria; la evidencia describe un efecto ecológico que también debe evaluarse.'),
 ('La pérdida de vegetación beneficia necesariamente a todas las especies de la zona.','La vegetación aporta alimento o hábitat a distintos organismos. Su disminución puede perjudicarlos y no tiene un efecto favorable universal.'),
 ('Como la presa aumenta, la extracción del depredador puede crecer sin límite.','El aumento de una presa no demuestra sustentabilidad. Deben considerarse recuperación del depredador, efectos indirectos y capacidad del ecosistema.'),[])

for qid,context in [(n(17),'Un gas ideal se calienta de 300 K a 450 K'),(S+'-287-17','Se eleva la temperatura de un gas ideal encerrado')]:
 rev(qid,context+' en un recipiente rígido y cerrado. Según el modelo cinético molecular, ¿por qué aumenta su presión?',
 ('Las partículas tienen mayor energía cinética media y transfieren más momento a las paredes mediante sus choques.','A volumen y cantidad constantes, aumentar la temperatura absoluta eleva la energía cinética media. El efecto de los choques sobre las paredes incrementa la presión.'),
 ('Las partículas aumentan su masa y por eso el recipiente pesa el doble.','El calentamiento del modelo no modifica la masa de las partículas ni duplica necesariamente la masa del gas.'),
 ('El calor crea nuevas partículas, aunque no entre materia al recipiente.','En este modelo cerrado la cantidad de gas permanece fija. El aumento de presión no se explica por creación de partículas.'),
 ('Las partículas quedan inmóviles y ejercen una presión estática mayor.','El calentamiento aumenta la agitación térmica media, no inmoviliza las partículas; la presión se relaciona con sus choques.'),[])

for qid,charge,time in [(n(27),12,3),(S+'-305-2023-47',6,3)]:
 intensity=charge/time
 rev(qid,f'Por una sección de un conductor pasan {charge} C en {time} s. Una estudiante dice que la corriente es una carga almacenada de {charge} A. ¿Qué corrección distingue las magnitudes?',
 (f'Los {charge} C son carga transportada; la corriente es su flujo y su intensidad media es {intensity:g} A.',f'La carga se mide en coulomb. La intensidad expresa carga que atraviesa una sección por tiempo: I = {charge}/{time} = {intensity:g} A; no es una reserva de carga.'),
 (f'Los {charge} C son intensidad y los {time} s son carga.','Intercambia magnitudes y unidades: coulomb mide carga y segundo mide tiempo; amperio mide intensidad de corriente.'),
 (f'La intensidad es {charge*time} A porque se multiplica carga por tiempo.','La intensidad media es carga dividida por intervalo temporal, no su producto; multiplicar no mide rapidez de transporte de carga.'),
 ('Corriente e intensidad no se relacionan con movimiento de cargas.','La corriente describe movimiento neto de carga y su intensidad cuantifica la carga que atraviesa una sección por unidad de tiempo.'),[])

rev(n(31),'En un modelo del borde de placas de Chile, la placa de Nazca converge bajo la Sudamericana. Un segmento de contacto permanece trabado mientras continúa el movimiento y luego se desliza bruscamente. ¿Qué explica el sismo?',
 ('La deformación acumuló energía elástica que se liberó en parte como ondas al producirse el deslizamiento.','La resistencia al deslizamiento permite acumular deformación. Al superar esa resistencia, el movimiento súbito libera energía; es coherente con la tectónica de placas.'),
 ('El movimiento de placas comenzó solo después del sismo, sin deformación anterior.','El modelo indica movimiento previo y contacto trabado; omitir la deformación anterior elimina el mecanismo de acumulación de energía.'),
 ('La energía del sismo se creó desde cero al abrirse el contacto.','La explicación debe conservar energía: parte de la almacenada por deformación se transforma en ondas y otros efectos durante la ruptura.'),
 ('La convergencia impide cualquier desplazamiento y por eso nunca puede generar ondas.','Aunque el contacto se trabe temporalmente, puede romperse y deslizarse. La convergencia no excluye liberaciones sísmicas de energía.'),[])

for qid,place,cause in [(n(32),'una ladera cultivada de la zona central de Chile','se retira la cubierta vegetal antes de lluvias intensas'),(S+'-23-04','una ladera del sur de Chile','una intervención deja expuesto el suelo a lluvias intensas'),(S+'-28-12','un terreno de secano de Chile central','se comparan sectores con y sin vegetación durante una lluvia')]:
 rev(qid,f'En un caso didáctico situado en {place}, {cause}. ¿Qué explicación relaciona agente, proceso y consecuencia de la erosión?',
 ('El agua de escorrentía desprende y transporta partículas; al reducirse la protección vegetal puede perderse la capa superficial.','La lluvia y el escurrimiento actúan como agentes. La cubierta vegetal amortigua el impacto y las raíces ayudan a estabilizar el suelo; su pérdida puede favorecer el arrastre.'),
 ('El agua forma inmediatamente nueva roca y aumenta la capa fértil en toda la ladera.','La erosión descrita implica remoción y transporte, no formación inmediata de roca ni aumento general de la capa fértil.'),
 ('La ausencia de vegetación elimina el escurrimiento porque no quedan raíces.','Sin cubierta, el suelo puede quedar más expuesto al impacto y al escurrimiento; la falta de raíces no elimina la acción del agua.'),
 ('Solo cambia el color del agua; el material transportado no puede provenir del suelo.','El agua puede llevar partículas desprendidas de la superficie. Reducir el fenómeno a un color ignora la pérdida de suelo.'),[])

rev(n(47),'La tabla presenta mediciones de dos profundidades de un lago. ¿Qué lectura distingue un parámetro físico y uno biológico?',
 ('La temperatura es un parámetro físico y la abundancia de algas es biológico.','La temperatura describe una condición física del agua; la abundancia de algas se refiere a organismos. La tabla registra ambos tipos en dos profundidades.'),
 ('Ambos parámetros son biológicos porque fueron medidos en un lago.','El lugar de medición no define el tipo de parámetro: la temperatura no es un organismo ni una medida de su abundancia.'),
 ('Las algas son un parámetro físico porque su abundancia se expresa con números.','La cuantificación no vuelve físico al objeto medido; se está contando una población de seres vivos.'),
 ('La tabla demuestra por sí sola que la temperatura causó toda la diferencia en algas.','Comparar dos registros muestra una asociación; no controla luz, nutrientes u otros factores necesarios para atribuir una causa única.'),
 [table('Datos didácticos del lago',['Profundidad','Temperatura','Algas por mL'],[['1 m','18 °C',800],['8 m','12 °C',200]])])

rev(S+'-305-2023-20','Se propone que una planta acuática libera más oxígeno con luz que en oscuridad. ¿Qué diseño permite contrastar esa hipótesis?',
 ('Comparar plantas semejantes con luz y sin luz, controlando temperatura y tiempo, y medir el oxígeno liberado.','La luz es la condición que cambia y el oxígeno la respuesta que se mide. Mantener comparables las demás condiciones permite interpretar su relación.'),
 ('Comparar especies distintas, una con más luz y mayor temperatura, y observar solo su color.','Cambian varios factores a la vez y no se mide la respuesta de interés; el resultado no aislaría el efecto de la luz sobre oxígeno.'),
 ('Observar una planta iluminada sin comparación y asumir que todas las burbujas son oxígeno.','Faltan una condición de contraste y una medición o identificación adecuada del gas; una observación aislada no sustenta la comparación.'),
 ('Poner ambas plantas a oscuras y variar simultáneamente el agua y el fertilizante.','El diseño no compara luz con oscuridad y cambia factores que no responden a la hipótesis propuesta.'),[])
rev(S+'-305-2023-22','Un modelo asigna masa relativa aproximada 1 al protón y al neutrón, y una masa mucho menor al electrón. ¿Qué comparación de cargas completa correctamente el modelo?',
 ('Protón: +1; neutrón: 0; electrón: −1.','El protón y el electrón poseen cargas de igual magnitud y signo opuesto, mientras el neutrón no tiene carga neta; las masas de protón y neutrón son semejantes.'),
 ('Protón: +1; neutrón: −1; electrón: 0.','El neutrón carece de carga neta y el electrón tiene carga negativa; esta opción intercambia sus propiedades.'),
 ('Protón: −1; neutrón: 0; electrón: +1.','Invierte los signos del protón y del electrón: la carga protónica es positiva y la electrónica negativa.'),
 ('Las tres partículas tienen carga positiva porque forman materia.','Formar parte de la materia no determina una carga positiva; el modelo atómico incluye cargas opuestas y partículas neutras.'),[])
rev(S+'-305-2023-29','¿Qué comparación describe la acción de neutrófilos y macrófagos en la defensa innata frente a una infección?',
 ('Ambos fagocitan; los neutrófilos suelen actuar como respuesta rápida y los macrófagos también procesan y presentan antígenos.','Ambos pueden ingerir microorganismos. La comparación reconoce funciones compartidas y la participación de macrófagos como células presentadoras, sin atribuirles producción de anticuerpos.'),
 ('Los neutrófilos producen los anticuerpos y los macrófagos almacenan glóbulos rojos.','La producción de anticuerpos corresponde a células plasmáticas derivadas de linfocitos B; no describe la función comparada de estos fagocitos.'),
 ('Solo los macrófagos fagocitan; los neutrófilos no interactúan con microorganismos.','Los neutrófilos también fagocitan y participan en la respuesta inflamatoria, por lo que excluirlos de esa acción es incorrecto.'),
 ('Ambos requieren reconocer un único antígeno mediante memoria específica antes de actuar.','La defensa innata utiliza reconocimiento de patrones y puede actuar sin una exposición previa al mismo agente; no depende de memoria específica como la respuesta adaptativa.'),[])
rev(S+'-305-2023-53','En el límite de placas de la figura, segmentos trabados acumulan deformación mientras continúa el desplazamiento lateral. ¿Qué fenómeno y mecanismo son coherentes con ese modelo?',
 ('Un sismo por deslizamiento repentino que libera energía elástica acumulada.','El movimiento paralelo al límite corresponde a una falla transformante. La resistencia puede trabar segmentos y su ruptura liberar parte de la energía acumulada en ondas.'),
 ('Una cordillera formada obligatoriamente por subducción perpendicular en ese mismo límite.','La figura representa desplazamiento lateral paralelo al límite; no muestra una placa hundiéndose bajo la otra.'),
 ('La creación continua de corteza por separación de ambas placas en la dirección dibujada.','Crear corteza en un borde divergente requiere separación; aquí las flechas muestran movimiento lateral opuesto, no apertura del límite.'),
 ('Una marea causada directamente por el roce lateral de estas placas.','Las mareas se explican principalmente por interacciones gravitatorias, no por acumulación y liberación de deformación en un límite transformante.'),
 [fig('transform-boundary.svg','Movimiento relativo de placas','Dos placas separadas por un límite vertical se desplazan paralelas a él en sentidos opuestos.')])
