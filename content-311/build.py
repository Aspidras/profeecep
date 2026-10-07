"""Banco reproducible con claves históricas separadas de las adaptaciones."""
import hashlib,json
from pathlib import Path
from items import ITEMS
from transcripts import TEXTS
ROOT=Path(__file__).resolve().parents[1]
read=lambda p:json.loads((ROOT/p).read_text())
source=read('tests/fixtures/prior-keys-2023-306.json')['SC-I(23).pdf']
tracks=read('content-311/audio-manifest.json')
indicators={x['id']:x for x in read('content-308/indicators-2026.json')['basica-ingles']}
rows,audit=[],[]
assert [x['number'] for x in ITEMS]==list(range(1,18))
for q in ITEMS:
    n=q['number'];identifier=f'basica-ingles-311-2023-{n:02}';t=tracks[q['track']-1]
    assert n in t['questions'] and q['indicatorId'] in indicators
    assert len(set(q['o']))==len(set(q['explanations']))==4
    assert all(len(e)>65 for e in q['explanations'])
    assert 0<=q['evidence']['start']<q['evidence']['end']<=t['duration']
    order=sorted(range(4),key=lambda i:hashlib.sha256(f'{identifier}:opcion:{i}'.encode()).digest())
    answer=order.index(q['a']);reasons=[q['explanations'][i] for i in order]
    row=dict(id=identifier,specialtyId='basica-ingles',indicatorId=q['indicatorId'],questionType=q['questionType'],diff='media',
        q=q['q'],o=[q['o'][i] for i in order],a=answer,explanations=reasons,e=reasons[answer],questionLang='en',
        stimulus=[dict(kind='audio',asset=t['file'],title=t['title'],track=t['track'],transcript=TEXTS[q['track']-1],
            transcriptNote='Transcripción de apoyo editada desde reconocimiento automático; puede contener errores. Se omiten algunas muletillas y los nombres no confirmados aparecen entre corchetes. Tiempos aproximados: contrasta con la grabación.')],
        evidence=q['evidence'],source=dict(year=2023,file='SC-I(23).pdf',number=n,page=q['page'],key=source['keys'][str(n)],practiceKey='ABCD'[answer],adaptation=q['adaptation']),
        version='3.0.11',skill=q['questionType'],feedbackKind='por-pregunta',familyId=f'ingles-2023-audio-{q["track"]:02}',
        origin='Adaptación ProfeECEP · audio aportado · referencia 2023',
        sourceNote='Práctica adaptada de SC-I 2023 con las grabaciones aportadas y vinculada al temario 2026. No es una pregunta oficial de 2026.',
        difficultyNote='Dificultad editorial estimada para estudio; no calibración psicométrica.')
    rows.append(row)
    audit.append(dict(number=n,questionId=identifier,sourceKey=row['source']['key'],practiceKey=row['source']['practiceKey'],track=q['track'],sourcePage=q['page'],indicatorId=q['indicatorId'],syllabusPage=indicators[q['indicatorId']]['page'],syllabusIndicator=indicators[q['indicatorId']]['text'],alignment=q['adaptation'],evidence=q['evidence'],status='adaptada'))
(ROOT/'prior-data-311.js').write_text('// Grabaciones aportadas de Inglés 2023 y transcripción automática de apoyo.\nwindow.PE311_ITEMS = '+json.dumps(rows,ensure_ascii=False,indent=2)+';\n')
(ROOT/'docs/revision-fuentes-311.json').write_text(json.dumps(dict(version='3.0.11',reviewDate='2026-10-07',source=source,tracks=tracks,count=17,explanations=68,previousActive=877,activeTotal=894,previousEnglish=130,activeEnglish=147,scope='Correspondencia editorial con la pauta y transcripciones automáticas; no se afirma escucha humana completa ni transcripción literal certificada. Indicadores del temario 2026 conservado.',items=audit),ensure_ascii=False,indent=2)+'\n')
print('17 adaptaciones; 68 explicaciones; 11 indicadores auditivos.')
