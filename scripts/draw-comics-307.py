"""Original educational comics, reproducible vector graphics."""
from pathlib import Path
from html import escape
OUT=Path(__file__).resolve().parents[1]/'assets/original-307';OUT.mkdir(exist_ok=True)
def text(x,y,s,size=26):return f'<text x="{x}" y="{y}" font-size="{size}" stroke="none">{escape(s)}</text>'
def person(x,y,phone=False):
 s=f'<circle cx="{x}" cy="{y}" r="22" fill="#f0c4a8"/><path d="M{x-30} {y+94}V{y+43}Q{x} {y+12} {x+30} {y+43}V{y+94}" fill="#71a9ad"/><circle cx="{x-7}" cy="{y-3}" r="2"/><circle cx="{x+7}" cy="{y-3}" r="2"/>'
 if phone:s+=f'<path d="M{x-25} {y+50}L{x+7} {y+74}L{x+23} {y+48}" fill="none" stroke-width="9"/><rect x="{x+6}" y="{y+48}" width="27" height="40" rx="4" fill="#243c50"/><rect x="{x+11}" y="{y+53}" width="17" height="25" fill="#dbf4ff"/>'
 else:s+=f'<path d="M{x-10} {y+9}Q{x} {y+18} {x+10} {y+9}" fill="none"/>'
 return s
def tap(x,y):return f'<path d="M{x} {y+60}V{y+12}H{x+50}V{y+29}" stroke-width="15" fill="none" stroke="#658792"/><path d="M{x+18} {y+3}V{y-12}M{x+5} {y-12}H{x+32}" stroke-width="5"/><path d="M{x+50} {y+43}q-13 20 0 20q13 0 0-20M{x+50} {y+78}q-10 15 0 15q10 0 0-15" fill="#368bb0" stroke="none"/>'
def base(title,desc):return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 960" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">{escape(desc)}</desc><g font-family="Arial,sans-serif" fill="#203a4b" stroke="#203a4b" stroke-width="2"><rect width="600" height="960" fill="#fff" stroke="none"/>'
def panel(y,n):return f'<g transform="translate(0 {y})"><rect x="16" y="8" width="568" height="302" rx="14" fill="#f0f7f4"/>'+text(34,40,str(n),18)
s=base('Un consejo en el jardín','Tres viñetas originales sobre una persona, una llave de agua y una planta.')
s+=panel(0,1)+text(120,68,'¡Ahorremos agua!')+person(170,150)+tap(400,170)+'</g>'
s+=panel(320,2)+person(515,142)+tap(160,135)+text(245,215,'ploc, ploc')+'<path d="M435 215h35m-42 20h28" stroke-width="4"/></g>'
s+=panel(640,3)+text(290,75,'¿Y la llave?')+tap(130,135)+'<path d="M360 247v-80M360 205q-80 10-62-40q60-10 62 40M360 184q68 0 54-39q-55 0-54 39" fill="#71b692"/><path d="M329 247h67l-9 43h-49Z" fill="#d49f7b"/><circle cx="349" cy="187" r="3"/><circle cx="367" cy="187" r="3"/><path d="M349 200q10 5 18 0" fill="none"/></g></g></svg>'
(OUT/'comic-agua.svg').write_text(s)
s=base('Una tarde en familia','Tres personas alrededor de una mesa antes y después de tomar sus teléfonos.')
for n,y in enumerate([0,320,640],1):
 s+=panel(y,n)
 if n==1:s+=text(108,63,'¡Una tarde para conversar!')
 if n==2:s+='<rect x="64" y="27" width="332" height="40" fill="#fff4cc"/>'+text(77,56,'Media hora después',24)+text(465,103,'…',35)
 if n==3:s+=text(127,64,'¡Qué conectados estamos!')
 for x in [155,300,445]:s+=person(x,143,n>1)
 s+='<path d="M72 247h458l-30 34H95Z" fill="#d8b69b"/><path d="M110 281v22m375-22v22" stroke-width="7"/></g>'
s+='</g></svg>'
(OUT/'comic-pantallas.svg').write_text(s)
