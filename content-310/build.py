"""Construye el lote sin modificar los bancos ni las claves históricas."""
import hashlib
import json
from pathlib import Path
from items import ITEMS

ROOT = Path(__file__).resolve().parents[1]
source = json.loads((ROOT / 'content-310/source.json').read_text())
indicators = {i['id']: i for i in json.loads((ROOT / 'content-308/indicators-2026.json').read_text())['media-lengua']}
rows, audit = [], []
assert [x['number'] for x in ITEMS] == list(range(1, 47))
for item in ITEMS:
    n = item['number']
    identifier = f'media-lengua-310-2023-{n:02}'
    order = sorted(range(4), key=lambda i: hashlib.sha256(f'{identifier}:opcion:{i}'.encode()).digest())
    answer = order.index(item['a'])
    reasons = [item['explanations'][i] for i in order]
    assert item['indicatorId'] in indicators
    assert len(set(item['o'])) == len(set(reasons)) == 4
    assert all(len(x) >= 55 for x in reasons)
    row = dict(id=identifier, specialtyId='media-lengua', indicatorId=item['indicatorId'],
               questionType=item['questionType'], diff='media', q=item['q'],
               o=[item['o'][i] for i in order], a=answer, explanations=reasons, e=reasons[answer],
               stimulus=item['stimulus'], questionLang='es',
               source=dict(year=2023, file=source['file'], number=n, page=item['page'],
                           key=source['keys'][str(n)], practiceKey='ABCD'[answer], adaptation=item['adaptation']),
               version='3.0.10', skill=item['questionType'], feedbackKind='por-pregunta',
               familyId=identifier, origin='Adaptación de práctica ProfeECEP · referencia 2023',
               sourceNote='Actividad de práctica con materiales originales, inspirada en EM-L 2023 y vinculada al temario 2026. No es una pregunta oficial de 2026.',
               difficultyNote='Dificultad editorial estimada para estudio; no calibración psicométrica.')
    rows.append(row)
    audit.append(dict(number=n, sourcePage=item['page'], sourceKey=source['keys'][str(n)],
                      questionId=identifier, practiceKey='ABCD'[answer], status='adaptada',
                      indicatorId=item['indicatorId'], syllabusPage=indicators[item['indicatorId']]['page'],
                      alignment=item['alignment'], adaptation=item['adaptation']))
(ROOT / 'prior-data-310.js').write_text('// Lengua y Literatura media: adaptaciones propias y clave histórica separada.\nwindow.PE310_ITEMS = ' + json.dumps(rows, ensure_ascii=False, indent=2) + ';\n')
(ROOT / 'docs/revision-fuentes-310.json').write_text(json.dumps(dict(
    reviewDate='2026-10-04', version='3.0.10', source=source, count=len(rows), explanations=len(rows)*4,
    previousActive=831, activeTotal=877, previousMedia=100, activeMedia=146,
    scope='Revisión editorial asistida de correspondencia y contenido; no certificación externa ni calibración psicométrica.',
    items=audit), ensure_ascii=False, indent=2) + '\n')
print(f'{len(rows)} adaptaciones, {len(rows)*4} explicaciones, {len(set(q["indicatorId"] for q in rows))} indicadores con práctica adicional.')
