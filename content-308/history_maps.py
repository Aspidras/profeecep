from assets import svg

def grid(lat,name):
 px=lambda lon:100+(80-lon)*6;py=lambda lat:80+lat*5
 b='<text x="330" y="28" text-anchor="middle">Red de coordenadas geográficas</text>'
 for lon in range(0,81,10):
  b+=f'<path d="M{px(lon)} 70V290" stroke="#aac"/><text x="{px(lon)}" y="319" text-anchor="middle">{lon}°'+(' O' if lon else '')+'</text>'
 for la in range(0,41,10):
  b+=f'<path d="M90 {py(la)}H590" stroke="#aac"/><text x="77" y="{py(la)+6}" text-anchor="end">{la}°'+(' S' if la else '')+'</text>'
 b+=f'<path d="M90 80H590 M580 70V290" stroke="#17324d" stroke-width="3"/><text x="340" y="65">Ecuador</text><text x="605" y="210" transform="rotate(-90 605 210)">Greenwich</text><circle cx="{px(70)}" cy="{py(lat)}" r="7" fill="#ba4624"/><text x="{px(70)+14}" y="{py(lat)+6}">P ({lat}° S; 70° O)</text><text x="95" y="350">Esquema de paralelos y meridianos. Norte hacia arriba.</text>'
 svg(name,'Coordenadas geográficas',f'P se ubica {lat} grados al sur del ecuador y 70 grados al oeste de Greenwich.',b,h=380)
grid(35,'308-coord35.svg');grid(33,'308-coord33.svg')
b='<text x="330" y="27" text-anchor="middle">Plano del barrio • cada tramo equivale a una cuadra</text>'
for x in range(120,601,120):b+=f'<path d="M{x} 70V310" stroke="#bac7d2" stroke-width="4"/>'
for y in range(70,311,80):b+=f'<path d="M120 {y}H600" stroke="#bac7d2" stroke-width="4"/>'
b+='<circle cx="240" cy="150" r="7" fill="#28765b"/><text x="250" y="138">Plaza</text><circle cx="480" cy="230" r="7" fill="#ba4624"/><text x="420" y="264">Biblioteca</text><path d="M60 155V70L50 88M60 70L70 88" fill="none" stroke="#17324d" stroke-width="3"/><text x="53" y="58">N</text>'
svg('308-plano.svg','Plano de plaza y biblioteca','Norte arriba. La biblioteca se ubica dos cuadras al este y una al sur de la plaza.',b)
b='<text x="330" y="28" text-anchor="middle">Regiones seleccionadas • esquema de ubicación</text><path d="M260 60L350 65L360 120L335 180L330 250L310 315L250 312L260 240L255 180L270 120Z" fill="#e6eef4" stroke="#17324d"/><path d="M270 90H353M256 180H335M258 255H329" stroke="#999"/><text x="380" y="112">Coquimbo</text><path d="M305 108H370" stroke="#17324d"/><text x="380" y="274">Maule</text><path d="M298 270H370" stroke="#17324d"/><path d="M80 160V70L70 88M80 70L90 88" fill="none" stroke="#17324d" stroke-width="3"/><text x="73" y="57">N</text><text x="140" y="347">Esquema sin escala ni detalle de límites regionales.</text>'
svg('308-regiones.svg','Ubicación relativa de regiones chilenas','Coquimbo aparece al norte de Maule. Esquema, no mapa de límites.',b)
for cm,scale,km in [(4,'200.000',8),(3,'100.000',3)]:
 b=f'<text x="330" y="35" text-anchor="middle">Segmento en un mapa a escala 1:{scale}</text><path d="M120 175H540M120 160V190M540 160V190" stroke="#17324d" stroke-width="4"/><text x="120" y="220" text-anchor="middle">A</text><text x="540" y="220" text-anchor="middle">B</text><text x="330" y="150" text-anchor="middle">{cm} cm en el mapa original</text><text x="330" y="280" text-anchor="middle">Usa la medida indicada; el tamaño en pantalla puede variar.</text>'
 svg(f'308-escala{cm}.svg','Distancia representada en un mapa',f'Segmento A-B mide {cm} cm en el mapa original. Escala 1 a {scale}.',b)
b='<text x="165" y="30" text-anchor="middle">Mapa A: densidad</text><text x="485" y="30" text-anchor="middle">Mapa B: altitud</text>'
for x in [70,390]:
 b+=f'<rect x="{x}" y="60" width="90" height="135" fill="#cbdfe3" stroke="#17324d"/><rect x="{x+90}" y="60" width="100" height="135" fill="#28765b" stroke="#17324d"/><text x="{x+140}" y="133" fill="white" text-anchor="middle">P</text>'
b+='<text x="70" y="237">Claro: 0–49 hab./km²</text><text x="70" y="267">Oscuro: ≥50 hab./km²</text><text x="390" y="237">Claro: 0–999 m</text><text x="390" y="267">Oscuro: ≥1.000 m</text><text x="330" y="325" text-anchor="middle">Mismo territorio esquemático; norte arriba.</text>'
svg('308-leyendas.svg','Dos mapas temáticos','La zona P es oscura en ambos mapas. En A oscuro significa al menos 50 habitantes por km²; en B al menos 1000 metros de altitud.',b)
b='<text x="160" y="28" text-anchor="middle">Mapa A</text><text x="490" y="28" text-anchor="middle">Mapa B</text><rect x="50" y="55" width="220" height="185" fill="#d9ead3" stroke="#17324d"/><path d="M190 55Q140 100 190 145T200 240H270V55Z" fill="#cda577"/><path d="M235 55Q195 120 240 190L255 240H270V55Z" fill="#a87755"/><rect x="380" y="55" width="220" height="185" fill="#eef1f3" stroke="#17324d"/><path d="M380 120L495 150L600 100M495 150L530 240" stroke="#28765b" stroke-width="3" fill="none"/><text x="420" y="95">R1</text><text x="410" y="195">R2</text><text x="550" y="190">R3</text><text x="50" y="278">Verde: 0–499 m</text><text x="50" y="305">Café claro: 500–1.499 m</text><text x="50" y="332">Café oscuro: ≥1.500 m</text><text x="380" y="278">Líneas: límites regionales</text><text x="380" y="305">R1, R2 y R3: regiones</text><text x="330" y="375" text-anchor="middle">Territorio didáctico esquemático; norte arriba.</text>'
svg('308-tiposmapa.svg','Representaciones física y política','Mapa A muestra franjas de altitud. Mapa B muestra tres regiones con límites administrativos.',b,h=400)
