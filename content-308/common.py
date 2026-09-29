import json, copy, hashlib, random
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BASE={q['id']:q for q in json.loads((ROOT/'content-308/originals.json').read_text())}
AUDIT={q['id']:q for q in json.loads((ROOT/'docs/auditoria-2026-308.json').read_text())['findings']}
ROWS={}
EDITED=set()
for qid,q in BASE.items():
    row=copy.deepcopy(q)
    row.update(id=qid+'-r308',replaces=qid,version='3.0.8',revisionDate='2026-09-28')
    row['indicatorId']=AUDIT[qid]['proposedIndicator'] or q['indicatorId']
    row.pop('d',None);row.pop('i',None);row.pop('indicator',None)
    row['alignmentReview']={'year':2026,'date':'2026-09-28','kind':AUDIT[qid]['alignment'],'officialPage':AUDIT[qid]['officialPage']}
    row.setdefault('stimulus',[])
    row['difficultyNote']='Estimación editorial para práctica; no calibración psicométrica.'
    if row.get('source'):
        row['source']['adaptation']+=' Revisión 3.0.8: contenido y clasificación revisados; la clave de esta adaptación se valida sobre sus propias alternativas.'
    ROWS[qid]=row

def rev(qid,question,correct,wrong1,wrong2,wrong3,stim=None,diff='media'):
    assert qid in ROWS and qid not in EDITED,qid
    EDITED.add(qid)
    row=ROWS[qid];pairs=[correct,wrong1,wrong2,wrong3]
    assert all(len(p)==2 and len(p[1])>=30 for p in pairs),qid
    row.update(q=question,o=[p[0] for p in pairs],explanations=[p[1] for p in pairs],a=0,e=correct[1],diff=diff)
    if stim is not None:row['stimulus']=copy.deepcopy(stim)
    if row.get('source'):
        row['source']['adaptation']='Actividad de práctica reformulada en 3.0.8 para la habilidad del temario 2026. Se conserva la referencia del material que dio origen a la actividad; el enunciado, sus alternativas y su clave son propios de esta revisión, no una reproducción del reactivo histórico.'
    return row

def table(title,columns,rows):return {'kind':'table','title':title,'columns':columns,'rows':[[str(x) for x in r] for r in rows]}
def text(title,body):return {'kind':'text','title':title,'text':body}
def fig(name,title,alt):return {'kind':'figure','asset':name,'title':title,'alt':alt}
MATERIALS=json.loads((ROOT/'content-307/materials.json').read_text())
def material(key):return copy.deepcopy(MATERIALS[key])

def finish():
    required={k for k,v in AUDIT.items() if v['alignment']=='ajustar' or v['critical']}
    assert required<=EDITED,sorted(required-EDITED)
    allq=[]
    indicators=json.loads((ROOT/'content-308/indicators-2026.json').read_text())
    for qid,row in ROWS.items():
        # Stable per-question permutation: no A/B/C/D sequence by catalog index.
        order=list(range(4));random.Random(hashlib.sha256(row['id'].encode()).hexdigest()).shuffle(order)
        answer=row['a'];opts=row['o'];exps=row['explanations']
        row['o']=[opts[i] for i in order];row['explanations']=[exps[i] for i in order];row['a']=order.index(answer);row['e']=row['explanations'][row['a']]
        if row.get('source'):row['source']['practiceKey']='ABCD'[row['a']]
        indicator=next(i for i in indicators[row['specialtyId']] if i['id']==row['indicatorId'])
        row['alignmentReview'].update(officialPage=indicator['page'], indicator=indicator['text'], kind='contenido_y_clasificacion' if qid in EDITED else 'clasificacion')
        assert len(set(row['o']))==4,qid
        allq.append(row)
    (ROOT/'bank-data-308.js').write_text('// Editorial revisions against ECEP 2026. Originals remain available for saved sessions.\nwindow.PE308_ITEMS = '+json.dumps(allq,ensure_ascii=False,indent=2)+';\n')
    manifest=[{'id':q['id'],'replaces':q['replaces'],'specialty':q['specialtyId'],'indicator':q['indicatorId'],'contentRewritten':q['replaces'] in EDITED,'answer':'ABCD'[q['a']]} for q in allq]
    (ROOT/'docs/correcciones-308.json').write_text(json.dumps({'version':'3.0.8','count':len(allq),'contentRewritten':len(EDITED),'items':manifest},ensure_ascii=False,indent=2)+'\n')
    print('Correcciones:',len(allq),'Enunciados revisados:',len(EDITED))
