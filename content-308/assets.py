from common import ROOT
from html import escape
DEST=ROOT/'assets/revision-308';DEST.mkdir(exist_ok=True)
def svg(name,title,desc,body,w=660,h=360):
    head=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">{escape(desc)}</desc><rect width="100%" height="100%" fill="white"/><g font-family="Arial,sans-serif" font-size="18" fill="#17324d">'
    (DEST/name).write_text(head+body+'</g></svg>')
def line(name,m,b,xmax=4,ymin=0,ymax=20,title='Función afín',xlabel='x',ylabel='y'):
    px=lambda x:80+500*x/xmax;py=lambda y:285-220*(y-ymin)/(ymax-ymin)
    body=f'<text x="330" y="27" text-anchor="middle">{escape(title)}</text>'
    for x in range(xmax+1):body+=f'<path d="M{px(x)} 55V285" stroke="#ddd"/><text x="{px(x)}" y="315" text-anchor="middle">{x}</text>'
    for i in range(6):
        y=ymin+(ymax-ymin)*i/5
        body+=f'<path d="M80 {py(y)}H580" stroke="#ddd"/><text x="69" y="{py(y)+6}" text-anchor="end">{y:g}</text>'
    # The horizontal axis lies at y=0 when zero is in the visible window.
    axis_y=py(0) if ymin<=0<=ymax else 285
    body+=f'<path d="M80 55V285 M80 {axis_y}H580" fill="none" stroke="#17324d" stroke-width="2"/><text x="600" y="{axis_y+10}">{escape(xlabel)}</text><text x="25" y="54">{escape(ylabel)}</text>'
    if ymin>0:body+='<path d="M73 281L87 275M73 290L87 284" stroke="#17324d" stroke-width="2"/>'
    body+=f'<path d="M{px(0)} {py(b)}L{px(xmax)} {py(m*xmax+b)}" stroke="#28765b" stroke-width="4"/>'
    for x in [0,1,xmax]:body+=f'<circle cx="{px(x)}" cy="{py(m*x+b)}" r="5" fill="#17324d"/>'
    svg(name,title,f'Gráfica cartesiana de una recta por (0, {b}), (1, {m+b}) y ({xmax}, {m*xmax+b}). Ejes con unidades y escala.',body)
def bars(name,labels,values,minimum=0,title='Registro',unit='Frecuencia'):
    maximum=max(values)+max(2,(max(values)-minimum)/4);step=(maximum-minimum)/5
    py=lambda y:285-220*(y-minimum)/(maximum-minimum)
    body=f'<text x="330" y="27" text-anchor="middle">{escape(title)}</text><text x="20" y="53">{escape(unit)}</text>'
    for i in range(6):
        y=minimum+i*step;body+=f'<path d="M90 {py(y)}H610" stroke="#ccc"/><text x="78" y="{py(y)+6}" text-anchor="end">{y:g}</text>'
    for i,(label,y) in enumerate(zip(labels,values)):
        x=175+i*250
        body+=f'<rect x="{x}" y="{py(y)}" width="100" height="{285-py(y)}" fill="{["#28765b","#587b9b"][i%2]}" stroke="#17324d"/><text x="{x+50}" y="{py(y)-10}" text-anchor="middle">{y}</text><text x="{x+50}" y="320" text-anchor="middle">{escape(label)}</text>'
    body+='<path d="M90 55V285H610" fill="none" stroke="#17324d" stroke-width="2"/>'
    svg(name,title,f'Gráfico de barras: '+', '.join(f'{a}: {b}' for a,b in zip(labels,values))+f'. Eje vertical comienza en {minimum}.',body)
