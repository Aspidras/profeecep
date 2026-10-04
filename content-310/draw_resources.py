"""Esquemas originales para lectura de recursos visuales, sin imágenes externas."""
from html import escape
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / 'assets/prior-2023'

def label(x,y,value,size=25,weight='normal',anchor='middle'):
    return f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}">{escape(value)}</text>'

def person(x,y,color='#26566b',scale=1):
    return f'<g transform="translate({x} {y}) scale({scale})" stroke="{color}" stroke-width="7" fill="none" stroke-linecap="round"><circle cy="-43" r="17" fill="{color}"/><path d="M0 -20V37M-27 5L0 -12L27 5M0 37L-23 74M0 37L23 74"/></g>'

def write(name,title,desc,body,height=400):
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 {height}" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">{escape(desc)}</desc><rect width="640" height="{height}" rx="18" fill="#f5f9fc"/><g fill="#17374a" font-family="Arial, sans-serif">{body}</g></svg>\n'
    (OUT / name).write_text(svg)

write('media-310-sombra.svg','Antes de salir',
      'Tres personas con una maleta ante una puerta. Una sombra gigante con forma de garra se extiende sobre ellas; no se muestra un animal.',
      '<rect x="60" y="156" width="82" height="188" fill="#b4c9d5"/><path d="M600 18C481 11 364 36 215 94L310 115L201 149L322 165L235 199L374 203L313 247L431 232C512 196 574 180 628 192Z" fill="#42576c"/>'
      + person(260,285,scale=.6)+person(324,300,scale=.42)+person(380,285,scale=.6)
      + '<rect x="422" y="313" width="37" height="28" rx="3" fill="#a26c3d"/><path d="M433 313V306H448V313" fill="none" stroke="#744a2a" stroke-width="4"/>'
      + label(320,375,'Antes de salir',23))

write('media-310-despedida.svg','Despedida',
      'Primera viñeta: dos personas unidas por un hilo rojo entre sus pechos se toman las manos. Segunda: se alejan en direcciones opuestas; el hilo sigue uniéndolas. Una dice Te escribiré.',
      '<rect x="20" y="18" width="600" height="232" rx="10" fill="white" stroke="#628093" stroke-width="3"/><rect x="20" y="270" width="600" height="250" rx="10" fill="white" stroke="#628093" stroke-width="3"/>'
      +label(48,50,'1',24,'bold')+person(263,150)+person(377,150)
      +'<path d="M290 155L350 155" stroke="#26566b" stroke-width="7"/><path d="M263 142Q320 98 377 142" stroke="#ae2941" stroke-width="6" fill="none"/>'
      +label(48,302,'2',24,'bold')+person(160,406)+person(480,406)
      +'<path d="M160 398Q320 463 480 398" stroke="#ae2941" stroke-width="6" fill="none"/>'
      +label(448,333,'Te escribiré.',25)+ '<path d="M119 464L80 464M80 464L94 455M80 464L94 473M521 464L560 464M560 464L546 455M560 464L546 473" fill="none" stroke="#628093" stroke-width="4"/>',540)

write('media-310-campeonato.svg','Radio Patio',
      'Semana del campeonato escolar. Todo gira alrededor del balón. Partidos, entrevistas y resultados, cada tarde. Un balón central y puntos sobre una órbita.',
      label(320,43,'RADIO PATIO',31,'bold')+label(320,83,'Semana del campeonato escolar',25)
      +'<ellipse cx="320" cy="191" rx="220" ry="57" fill="none" stroke="#7095ad" stroke-width="3"/><circle cx="320" cy="190" r="62" fill="white" stroke="#17374a" stroke-width="3"/><path d="M320 152L349 174L338 209H302L291 174Z" fill="#17374a"/><circle cx="106" cy="178" r="10" fill="#b64a3a"/><circle cx="469" cy="232" r="10" fill="#2d7b66"/><circle cx="462" cy="147" r="10" fill="#b28b32"/>'
      +label(320,300,'Todo gira alrededor del balón',29,'bold')+label(320,344,'Partidos, entrevistas y resultados',24)+label(320,374,'cada tarde',24))

write('media-310-lapiz.svg','Con un lápiz',
      'Un lápiz y una fila de libros acompañan el lema Con un lápiz, llena mil bibliotecas en una tarde. Anuncio ficticio para analizar recursos expresivos.',
      label(320,48,'CON UN LÁPIZ',32,'bold')
      +'<g transform="translate(99 116) rotate(12)"><rect width="414" height="27" rx="3" fill="#e4b35d" stroke="#755522" stroke-width="2"/><path d="M414 0L457 13L414 27Z" fill="#c68b5b"/><path d="M445 10L457 13L445 17Z" fill="#17374a"/></g>'
      +''.join(f'<rect x="{104+n*52}" y="202" width="40" height="68" rx="3" fill="{["#4c7d92","#cb9655","#778bb3"][n%3]}"/><path d="M{112+n*52} 210V260" stroke="white" stroke-width="2"/>' for n in range(9))
      +label(320,313,'Llena mil bibliotecas',29,'bold')+label(320,349,'en una tarde',29,'bold')+label(320,382,'Anuncio ficticio para análisis',18))

write('media-310-regalos.svg','Cada edad, su regalo',
      'Anuncio ficticio para análisis crítico: control de videojuegos bajo Para jóvenes, aventura y pantuflas bajo Para mayores, solo descanso. Cada edad, su regalo.',
      label(320,45,'CADA EDAD, SU REGALO',28,'bold')
      +'<rect x="25" y="76" width="283" height="242" rx="12" fill="#e3edf5"/><rect x="332" y="76" width="283" height="242" rx="12" fill="#ece6de"/>'
      +label(166,112,'Para jóvenes,',24)+label(166,144,'aventura',27,'bold')+label(474,112,'Para mayores,',24)+label(474,144,'solo descanso',27,'bold')
      +'<path d="M113 199Q90 235 108 269L147 252H186L226 269Q241 238 215 199Z" fill="#52758b"/><path d="M129 218V244M116 231H142" stroke="white" stroke-width="7"/><circle cx="199" cy="223" r="5" fill="white"/><circle cx="212" cy="237" r="5" fill="white"/>'
      +'<path d="M379 214Q405 180 432 209L442 270H376Z" fill="#b18762"/><path d="M479 213Q506 180 535 209L545 270H476Z" fill="#b18762"/><path d="M383 239H436M484 239H539" stroke="#e3c6a9" stroke-width="13"/>'
      +label(320,355,'Anuncio ficticio para análisis crítico',22)+label(320,383,'Examina cómo representa a las personas.',19))

write('media-310-jornada.svg','La jornada',
      'Conquista tu jornada. Una ciclista con casco similar a un yelmo encara pequeños obstáculos como montañas y una meta con banderín.',
      label(320,47,'CONQUISTA TU JORNADA',31,'bold')
      +'<g stroke="#28576a" stroke-width="5" fill="none"><circle cx="114" cy="277" r="41"/><circle cx="249" cy="277" r="41"/><path d="M114 277L160 211L208 277H114M160 211H229L249 277M208 277L229 211M228 211L222 196H246"/></g>'
      +'<path d="M163 198L192 159L220 192L237 197M178 185L165 230L203 252" stroke="#52758b" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="193" cy="130" r="24" fill="#d5c1a8"/><path d="M165 129Q162 95 198 101L219 115V133H181L181 142H165Z" fill="#718598" stroke="#263e50" stroke-width="3"/><path d="M197 101L185 76L210 91" stroke="#a32942" stroke-width="7" fill="none"/>'
      +'<path d="M305 304L339 260L373 304M372 304L408 253L444 304M444 304L480 244L516 304" stroke="#628093" stroke-width="4" fill="#dbe5eb"/><path d="M555 311V154L603 177L555 202" fill="#b85049" stroke="#294c60" stroke-width="4"/>'
      +label(320,355,'Bicicleta y aventura cotidiana',25)+label(320,385,'Anuncio ficticio para analizar',19))
print('6 recursos SVG originales generados.')
