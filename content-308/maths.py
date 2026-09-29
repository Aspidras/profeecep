from common import *
from assets import line,bars
S='basica-matematica'
def n(x):return f'{S}-307-{x:02d}'
def f(asset,title,alt):return [fig(asset,title,alt)]

rev(n(16),'Según la tabla de la máquina, ¿cuál es el recorrido de la función?',
 ('{1, 3, 5, 7}.','El recorrido reúne las salidas de la segunda fila: 1, 3, 5 y 7; cada una se obtiene de una entrada mostrada.'),
 ('{1, 2, 3, 4}.','Estos son los valores de entrada; forman el dominio de la tabla, no el recorrido.'),
 ('{2, 4, 6, 8}.','Esos resultados corresponderían a duplicar las entradas, pero no son las salidas registradas.'),
 ('Todos los números reales.','La tabla representa solo cuatro entradas y cuatro salidas; no autoriza extender el recorrido a todos los reales.'),
 [table('Entradas y salidas',['Entrada x',1,2,3,4],[['Salida f(x)',1,3,5,7]])])

params=[(n(18),250,1500,4,1500,2500,'Costo de entrega','250 pesos por cada kilómetro.','El ascenso de la recta por cada unidad horizontal es 250; representa el aumento de costo por kilómetro.', '1.500 pesos por cada kilómetro.','1.500 es el valor inicial cuando x es cero; corresponde al costo fijo, no a la pendiente.'),
 ('a3',4,2,4,0,20,'Recta y = 4x + 2','La ordenada aumenta 4 cuando x aumenta 1.','La pendiente 4 corresponde al aumento vertical por una unidad horizontal; se ve entre puntos consecutivos de la recta.','La recta corta el eje y en 4.','La intersección con el eje vertical es 2, obtenida cuando x es cero; no es el coeficiente de x.'),
 ('a6',5,2,4,0,25,'Relación entre x e y','La pendiente es 5.','Entre (0,2) y (1,7), y aumenta cinco unidades por una unidad de x; esa razón de cambio es la pendiente.','El intercepto es 5.','El intercepto es la ordenada cuando x vale cero: en esta gráfica es 2, no 5.'),
 ('a11',2,-3,4,-5,5,'Recta y = 2x − 3','Corta el eje y en −3 y sube 2 por cada unidad de x.','El término independiente sitúa la intersección en (0,−3); el coeficiente 2 expresa la pendiente positiva.','Corta el eje y en 2 y baja 3 por cada unidad de x.','Intercambia los papeles de los parámetros; −3 es el valor inicial y 2 es la razón de cambio.'),
 (S+'-28-10',-2,7,3,0,10,'Recta y = −2x + 7','Desciende 2 unidades por cada unidad que avanza x.','La pendiente −2 indica cambio vertical negativo: los puntos (0,7) y (1,5) muestran un descenso de dos.','Desciende 7 unidades por cada unidad que avanza x.','El número 7 representa la intersección con el eje y; no el descenso por unidad de x.'),
 (S+'-287-18',-3,12,4,0,15,'Recta y = −3x + 12','La intersección con el eje y es 12.','En la gráfica, x = 0 corresponde a y = 12; ese punto representa el término independiente.','La pendiente es 12.','La pendiente se obtiene del cambio de y por unidad de x; aquí es −3, mientras 12 es el valor inicial.')]
for k,(qid,m,b,xmax,lo,hi,title,co,ce,wo,we) in enumerate(params):
 asset=f'308-funcion-{k}.svg';line(asset,m,b,xmax,lo,hi,title)
 rev(qid,f'Observa la gráfica «{title}». ¿Qué interpretación de sus parámetros es correcta?',(co,ce),(wo,we),
 ('La recta pasa por el origen.','El origen requiere que x e y sean cero simultáneamente; el punto donde esta recta corta el eje y tiene ordenada distinta de cero.'),
 ('La variable y permanece constante al cambiar x.','La recta no es horizontal: su pendiente es distinta de cero y sus puntos muestran variación de y.'),
 f(asset,title,f'Recta por (0,{b}), (1,{m+b}) y ({xmax},{m*xmax+b}); las escalas de ambos ejes están indicadas.'))

rev(n(21),'Un cuerpo tiene dos caras triangulares congruentes y paralelas; sus otras tres caras son rectángulos que unen lados correspondientes. ¿Cómo se clasifica?',
 ('Prisma triangular.','Las dos bases triangulares congruentes y paralelas, unidas por caras laterales rectangulares, caracterizan un prisma triangular.'),
 ('Pirámide triangular.','Una pirámide tiene una base y caras laterales que se reúnen en un vértice; aquí hay dos bases paralelas.'),
 ('Prisma rectangular.','En un prisma rectangular las bases son rectángulos; la presencia de bases triangulares determina otro tipo de prisma.'),
 ('Cilindro.','Un cilindro tiene bases circulares y superficie lateral curva; las caras descritas son polígonos planos.'),[])

for qid,L,W,h,v,name in [(n(28),10,8,2,3,'lámina'),('g10',12,9,2,3,'terraza'),(S+'-287-28',14,10,3,3,'cartel')]:
 total=L*W;double=total-L*h-W*v;area=double+h*v;used=total-area
 rev(qid,f'Una {name} rectangular de {L} m por {W} m reserva dos franjas: una de {h} m de ancho a lo largo de todo el lado de {L} m y otra de {v} m a lo largo de todo el lado de {W} m. Se cruzan en una esquina. ¿Qué área queda fuera de ambas franjas?',
 (f'{area} m².',f'El total es {total} m². Se descuentan {L*h} y {W*v}, pero su cruce de {h*v} m² se descontó dos veces: {total} − {L*h} − {W*v} + {h*v} = {area}.'),
 (f'{double} m².',f'Restar ambas franjas sin recuperar el cruce descuenta dos veces una región de {h*v} m²; por eso este resultado es menor que el área libre.'),
 (f'{used} m².',f'Este valor es el área ocupada por la unión de las dos franjas, contando su cruce una sola vez; se pregunta por la parte libre.'),
 (f'{total} m².',f'Es el área de toda la {name}; incluye las dos franjas reservadas y no responde por el espacio que queda fuera de ellas.'),[],diff='alta')

bars('308-prestamos.svg',['Mayo','Junio'],[48,52],46,'Préstamos de libros','Préstamos')
rev(n(32),'Observa el gráfico. ¿Qué conclusión distingue el cambio real del efecto de la escala?',
 ('Aumentaron 4 préstamos; el eje que parte en 46 amplifica la diferencia visual.','La diferencia es 52 − 48 = 4. Como las barras parten de 46, su altura visible no representa la cantidad total desde cero.'),
 ('Los préstamos se triplicaron porque una barra tiene triple altura visible.','La altura visible mide el exceso sobre 46, no el total; la comparación 52 frente a 48 no es una triplicación.'),
 ('Aumentaron 52 préstamos respecto de mayo.','52 es el total de junio. Para obtener el aumento hay que restar los 48 préstamos de mayo.'),
 ('No es posible comparar los meses porque el eje no parte en cero.','La escala está rotulada y permite leer los valores; el problema es la impresión visual, no la imposibilidad de calcular el cambio.'),f('308-prestamos.svg','Préstamos mensuales','Mayo:48; junio:52. Eje vertical comienza en 46 y muestra su escala.'))

medians=[(n(33),[3,4,4,5,19],'tiempos de espera','4','minutos'),('d1',[4,4,6,8,8],'tiempos de recorrido','6','minutos'),('d7',[2,4,4,6,9],'libros prestados por persona','4','libros'),(S+'-287-33',[1,3,3,5,8],'visitas semanales','3','visitas')]
for qid,values,context,mid,unit in medians:
 rev(qid,f'En un registro de {context} aparecen {", ".join(map(str,values))}. ¿Cómo se interpreta la mediana de este conjunto?',
 (f'Es {mid} {unit}: al menos la mitad de los datos es menor o igual a ese valor y al menos la mitad es mayor o igual.',f'Al ordenar los cinco datos, el tercero es {mid}. Esa posición central divide el conjunto; no implica que todos tengan ese valor.'),
 (f'Es {mid} {unit}, porque todos los datos deben coincidir con ella.','La mediana es una posición central y permite valores distintos; no exige igualdad entre las observaciones.'),
 (f'Es {sum(values)} {unit}, porque resume la suma de las observaciones.','La suma no es la mediana. Para esta medida se ordenan los datos y se identifica el valor central.'),
 (f'Es {max(values)} {unit}, porque representa el mayor valor registrado.','El mayor valor es el máximo. La mediana ocupa una posición central, no el extremo superior.'),[])

rev(n(35),'Se quiere conocer cómo viajan los 600 escolares de una escuela. Se encuesta a 80 de ellos que llegan al estacionamiento. ¿Qué identifica correctamente población y muestra?',
 ('Población: los 600 escolares; muestra: los 80 encuestados.','La población es el conjunto sobre el que se quiere concluir y la muestra son las personas observadas. Encuestar solo en el estacionamiento puede sesgarla.'),
 ('Población: los 80 encuestados; muestra: los 600 escolares.','Invierte los conceptos: la muestra es el subconjunto observado dentro de la población objetivo.'),
 ('Población: todos los automóviles; muestra: los 80 escolares.','La investigación estudia formas de viaje de personas; los automóviles no constituyen la población definida.'),
 ('Población y muestra: únicamente quienes usan automóvil.','Llegar al estacionamiento no define la población de interés. Se quiere describir a los 600 escolares, incluidos quienes viajan de otras maneras.'),[])

for qid,trials,hits,event in [(n(37),80,18,'obtener un seis'),('d12',100,57,'obtener cara'),(S+'-287-37',200,116,'obtener cara')]:
 frac=str(round(hits/trials,3)).replace('.',',');opposite=str(round(1-hits/trials,3)).replace('.',',')
 rev(qid,f'En {trials} repeticiones bajo condiciones comparables, el evento «{event}» ocurre {hits} veces. Usando la frecuencia relativa, ¿qué probabilidad empírica se estima para la próxima repetición?',
 (frac+'.',f'La estimación empírica usa éxitos sobre ensayos: {hits}/{trials} = {frac}. Describe el registro observado y no garantiza el resultado siguiente.'),
 (opposite+'.',f'Esta es la frecuencia de que el evento no ocurra: ({trials} − {hits})/{trials}. Se pregunta por el evento indicado.'),
 (str(hits)+'.','Es una frecuencia absoluta, un número de ocurrencias. Una probabilidad debe expresarse entre cero y uno.'),
 ('1, porque el evento ya ocurrió varias veces.','Que un evento haya ocurrido no asegura que se repita en el próximo ensayo; el registro sirve para estimar, no para garantizar.'),[])

for qid,axis,point,ans in [('g3','un giro de 90° antihorario alrededor del origen','(2, 1)','(−1, 2)'),('g6','una traslación 4 unidades a la derecha','(−2, 3)','(2, 3)')]:
 if qid=='g3':pairs=[(ans,'En un giro antihorario de 90°, (x,y) pasa a (−y,x); por eso (2,1) llega a (−1,2).'),('(1, −2)','Esta imagen corresponde a un giro de 90° horario, que tiene el sentido contrario al solicitado.'),('(−2, −1)','Cambiar ambos signos corresponde a girar 180°, no 90° alrededor del origen.'),('(2, −1)','Cambiar solo el signo de y refleja respecto del eje x; no realiza el giro solicitado.')]
 else:pairs=[(ans,'Trasladar cuatro unidades a la derecha suma 4 a x y conserva y: −2 + 4 = 2 y la ordenada sigue siendo 3.'),('(−6, 3)','Restar 4 a x desplaza hacia la izquierda, contrario al sentido pedido.'),('(−2, 7)','Sumar 4 a y desplaza hacia arriba; la traslación solicitada es horizontal.'),('(2, −3)','Además de cambiar x, esta opción invierte la ordenada; una traslación horizontal no refleja el punto.')]
 rev(qid,f'En el plano cartesiano, se aplica {axis} al punto {point}. ¿Cuál es su imagen?',*pairs,stim=[])

bars('308-categorias.svg',['A','B'],[12,18],0,'Respuestas por categoría','Personas')
for qid,question in [('d8','Según el gráfico de respuestas, ¿cuántas personas más eligieron B que A?'),(S+'-287-32','Al comparar ambas categorías del gráfico, ¿cuál es la diferencia entre sus frecuencias?')]:
 rev(qid,question,('6 personas.','La barra de B llega a 18 y la de A a 12; la diferencia entre las frecuencias es 18 − 12 = 6.'),('30 personas.','30 es la suma de ambas frecuencias; la pregunta pide cuánto supera una a la otra.'),('12 personas.','12 corresponde a la frecuencia de A, no a la diferencia entre ambas categorías.'),('18 personas.','18 corresponde a la frecuencia total de B; hay que descontar las 12 personas de A.'),f('308-categorias.svg','Frecuencias por categoría','A:12 personas; B:18 personas; eje vertical parte en cero.'))

for qid,x,y in [(S+'-28-09',[-1,0,2],[3,1,-3]),(S+'-287-16',[1,2,5],[0,1,2]),(S+'-305-2023-25',[0,250,500,750,1000],[500,1000,1500,2000,2500])]:
 xs='{'+', '.join(map(str,x))+'}';ys='{'+', '.join(map(str,y))+'}'
 rev(qid,f'La tabla define una función solo para las entradas listadas, cuya primera entrada es {x[0]}. ¿Cuál es su dominio?',
 (xs+'.','El dominio reúne los valores de entrada de la tabla. No se deben añadir números intermedios cuando la función se define solo en las entradas listadas.'),
 (ys+'.','Este conjunto reúne las salidas de la función y corresponde al recorrido, no al dominio.'),
 ('Todos los números reales.','Una tabla de entradas específicas no define automáticamente la función para cualquier número real.'),
 ('Solo la primera entrada de la tabla.','La función está definida para todas las entradas registradas, no únicamente para la que aparece primero.'),
 [table('Función definida por tabla',['Entrada x']+x,[['Salida f(x)']+y])])

rev(S+'-28-16','En una encuesta de colores favoritos, azul tiene 14 preferencias, verde 9 y rojo 7. ¿Qué informa que azul sea la moda?',
 ('Azul es la categoría más frecuente.','La moda identifica el valor o categoría con mayor frecuencia; 14 es mayor que 9 y 7.'),
 ('Azul fue elegido por más de la mitad de las personas.','Hubo 30 respuestas y la mitad es 15. Ser la categoría más frecuente no implica superar la mitad.'),
 ('El promedio de colores elegidos es azul.','Los colores son categorías sin valor numérico sobre el que calcular una media aritmética.'),
 ('Todas las personas eligieron azul.','También hay preferencias por verde y rojo; la moda no implica unanimidad.'),[])
rev(S+'-305-2023-42','Cuatro vehículos recorrieron 6.000, 6.000, 12.000 y 14.000 km. Su media es 9.500 km. ¿Qué interpretación es válida?',
 ('Si el total se repartiera por igual entre los cuatro, corresponderían 9.500 km a cada uno.','La media conserva la suma y la distribuye en partes iguales: 38.000/4 = 9.500; no exige que algún vehículo tenga ese recorrido.'),
 ('Cada vehículo recorrió exactamente 9.500 km.','La media resume el conjunto, pero los datos individuales mostrados son distintos de 9.500.'),
 ('9.500 km es el recorrido más frecuente.','El recorrido más frecuente es 6.000 km. La media y la moda describen aspectos diferentes.'),
 ('La mitad de los vehículos recorrió menos de 9.500 y la otra mitad más; por eso media y mediana siempre coinciden.','Esa división sucede en este conjunto, pero no demuestra igualdad general: aquí la mediana es (6.000 + 12.000)/2 = 9.000.'),[])

r=rev(S+'-307-09','¿Cuál es el valor de (0,5)³ · (0,5)² ÷ (0,5)⁴?',
 ('0,5.','Al multiplicar potencias de la misma base se suman exponentes y al dividirlos se restan: 3 + 2 − 4 = 1. Queda (0,5)¹ = 0,5.'),
 ('0,25.','0,25 es (0,5)². El exponente resultante es 3 + 2 − 4 = 1, no 2; no se multiplican los exponentes de factores separados.'),
 ('2.','2 equivale a (0,5)⁻¹. El cociente resta el exponente del denominador al del numerador: 5 − 4, no 4 − 5.'),
 ('0,03125.','Este es el producto (0,5)⁵ antes de dividir. Falta aplicar la división por (0,5)⁴.'),[])
r['indicatorId']='0-2-1'
r=rev(S+'-307-36','Se lanzan dos monedas y se registra el resultado de la primera y luego el de la segunda. C significa cara y S sello. ¿Qué relación entre espacio muestral Ω y evento E «exactamente una cara» es correcta?',
 ('Ω = {CC, CS, SC, SS}; E = {CS, SC}.','El espacio contiene todos los resultados ordenados posibles. El evento es el subconjunto con una cara; CS y SC son resultados distintos porque se registra el orden.'),
 ('Ω = {CC, CS, SS}; E = {CS}.','Se omite SC. Al distinguir primera y segunda moneda, cara-sello y sello-cara deben representarse por separado.'),
 ('Ω = {CS, SC}; E = {CC, CS, SC, SS}.','Se invierten los conjuntos: el espacio incluye todos los resultados y el evento solo los que cumplen la condición.'),
 ('Ω = {CC, CS, SC, SS}; E = {CC, CS, SC}.','CC tiene dos caras. Corresponde incluirlo en «al menos una cara», pero no en «exactamente una cara».'),[])
r['indicatorId']='3-1-0'
# Reclassification also retains concise, concrete reasoning for every choice.
ROWS['n5']['explanations'][ROWS['n5']['a']]='Elevar 0,5 al cuadrado significa multiplicar 0,5 por sí mismo: la mitad de una mitad es un cuarto, 0,25.'
r=ROWS['basica-matematica-28-07']
r['explanations']=[('Dividir ambos miembros de 5x = 35 por 5 conserva la igualdad y da x = 7; al comprobar, 5 × 7 = 35.' if i==r['a'] else f'Al sustituir x por {o}, se obtiene 5 × {o} = {5*int(o)}, que no es 35. El valor debe satisfacer la igualdad, no solo aproximarse al resultado.') for i,o in enumerate(r['o'])]
