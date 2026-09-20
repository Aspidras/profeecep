// Retroalimentación compartida por práctica, estudio, revisión y tutores.
(function () {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  const generic = /no tiene todavía una explicación|según la explicación disponible|no (?:se ajusta|responde).*?(?:evidencia|indicador)|no muestra el desempeño|confunde (?:el concepto central|una relación relevante)|esta alternativa responde al problema y se apoya/i;

  // Las preguntas de cobertura preguntan por decisiones de enseñanza. Sus
  // razones se vinculan al desempeño del indicador, no a una lección supuesta.
  function evidenceFor(indicator) {
    const text = String(indicator || '').toLocaleLowerCase('es');
    const rules = [
      [/punto de vista|postura del emisor/, 'pedir que identifique qué sostiene o valora el emisor y lo justifique con palabras o fragmentos del texto'],
      [/propósito.*(?:texto|comunicativo)|intención comunicativa/, 'pedir que explique para qué se comunica el mensaje y qué marcas del texto permiten reconocerlo'],
      [/inferir|inferencia|implícit/, 'pedir una conclusión que no esté dicha literalmente y las pistas que permiten construirla'],
      [/resumir|síntesis/, 'comparar un resumen con el texto para comprobar que conserva las ideas centrales sin añadir información'],
      [/figura.*literari|lenguaje figurado|metáfora/, 'pedir que explique el sentido figurado y su efecto usando palabras del fragmento'],
      [/fuentes|investigación/, 'pedir que seleccione fuentes pertinentes y fundamente su uso con autoría, contexto y evidencias'],
      [/hipótesis|experiment|indagación/, 'recoger una propuesta que relacione la pregunta, las variables y la evidencia que permitiría ponerla a prueba'],
      [/argument|justific/, 'recoger una afirmación y las razones o evidencias con que el estudiante la sostiene'],
      [/comparar|diferenciar|distinguir|contrastar/, 'pedir una comparación de casos que explicite el criterio, las semejanzas y las diferencias relevantes'],
      [/calcular|cálculo|operaciones|perímetro|áreas|volumen/, 'observar cómo elige la operación, usa los datos y comprueba el resultado con las unidades correspondientes'],
      [/ecuacion|ecuación|inecuacion|inecuación|resolución|problemas/, 'recoger la representación del problema, los pasos de resolución y la comprobación de la respuesta'],
      [/modelación|modelar|traducción/, 'pedir una representación de la situación y explicar qué significa cada elemento del modelo'],
      [/gráfico|tabla|frecuencia|probabilidad|estadístic|población|muestra|tendencia central/, 'pedir que use los datos o resultados posibles para fundamentar una interpretación, explicitando qué cantidades compara'],
      [/representaciones|representar|transformaciones|traslaciones|congruencia|construcción|ejes|familias/, 'recoger una representación y una explicación de las propiedades que se mantienen o cambian en ella'],
      [/retroaliment|errores|dificultades/, 'analizar una respuesta del estudiante, identificar la dificultad y proponer una ayuda que permita revisarla'],
      [/evaluar|calificar|indicadores|criterios|instrumentos|evidencias de aprendizaje/, 'definir criterios ligados al objetivo y aplicarlos a una producción, justificando qué evidencia muestra el logro'],
      [/diseñar|proponer|seleccionar|selección|disponer|estrategias|actividades|decisiones/, 'pedir una propuesta o selección y la justificación de cómo responde al propósito y a las condiciones de la situación'],
      [/explicar|relacionar|relación|establecer/, 'pedir una explicación que conecte los elementos del fenómeno y la sustente con datos o ejemplos pertinentes'],
      [/interpretar|analizar|atribuir/, 'pedir una interpretación sustentada en rasgos concretos del caso, distinguiendo información y conclusiones'],
      [/identificar|reconocer|reconocimiento|clasificación|múltiplos|divisores|orden/, 'presentar casos y pedir que reconozca o clasifique sus rasgos, explicando el criterio que permite decidir'],
      [/caracterizar|describir|propiedades/, 'pedir una descripción de rasgos relevantes y ejemplos que permitan distinguir el concepto de otros'],
      [/localizar|dominio|variables|parámetros/, 'pedir que identifique los elementos de la representación y explique su función o ubicación en el caso'],
      [/conocimientos previos/, 'recoger respuestas iniciales que permitan reconocer qué conceptos maneja el curso antes de planificar la ayuda']
    ];
    return rules.find(([pattern]) => pattern.test(text))?.[1] || 'recoger una respuesta aplicada al contenido del indicador y pedir que explique las decisiones tomadas';
  }

  function coverage(q) {
    const target = String(q.indicator || q.i).trim().replace(/[.\s]+$/, '');
    const evidence = evidenceFor(target);
    const correct = 'Para trabajar «' + target + '», conviene ' + evidence + '. La opción correcta permite observar ese desempeño y usar criterios para valorar la respuesta.';
    const reasons = {
      'Copiar una definición sin relacionarla con una situación': 'Copiar muestra que puede reproducir una definición, pero no cómo la usa para «' + target + '». Haría falta ' + evidence + '.',
      'Memorizar términos sin producir evidencia del desempeño': 'El vocabulario puede ayudar, pero recordarlo por sí solo no permite comprobar «' + target + '». La evidencia sería ' + evidence + '.',
      'Responder una actividad que evalúa un contenido diferente': 'Aunque esté bien resuelta, una tarea de otro contenido no permite concluir si se logró «' + target + '». Debe recoger el aprendizaje que se pretende evaluar.',
      'Repetir un procedimiento sin explicar ni justificar': 'Repetir pasos puede mostrar ejecución mecánica, pero aquí no permite saber cómo el estudiante comprende «' + target + '». Para hacerlo visible conviene ' + evidence + '.'
    };
    // Conserva las posiciones y la clave de respuesta de cada ítem.
    q.explanations = q.o.map((option, index) => index === q.a ? correct : reasons[option] || '');
    q.o[q.a] = q.id.endsWith('-0')
      ? 'Resolver una tarea sobre «' + target + '» y justificar la respuesta con procedimientos o evidencias.'
      : 'Definir criterios observables para «' + target + '» y recoger una respuesta o producción que permita aplicarlos.';
    q.e = correct;
    q.feedbackApproach = evidence.charAt(0).toUpperCase() + evidence.slice(1) + '.';
    q.feedbackKind = 'criterio-del-indicador';
  }

  const corrections = {
    a1: {q:'Al doble de un número se le resta 7. ¿Qué expresión representa el resultado?'},
    a7: {q:'A la mitad de un número se le suma 4. ¿Qué expresión representa el resultado?'},
    'basica-matematica-287-11': {q:'A un número se le suma 5 y luego se duplica el resultado. ¿Qué expresión representa estas operaciones?'},
    'basica-ciencias-28-09': {q:'Sobre un carrito se aplica una fuerza neta en la misma dirección y sentido de su movimiento. Mientras actúa esa fuerza, el carrito:'},
    'basica-ciencias-28-13': {q:'En un experimento se modifica la cantidad de luz y se mide el crecimiento de una planta. La cantidad de luz es la variable:'},
    'basica-ciencias-287-17': {q:'Una cantidad fija de gas está encerrada en un recipiente rígido. Si aumenta su temperatura y el volumen no cambia, la presión:'},
    'basica-lenguaje-28-06': {q:'¿Cuál de estas palabras lleva tilde y la tiene correctamente escrita?'},
    'basica-lenguaje-287-03': {q:'En los versos «La abeja trabaja / junto a la tinaja», ¿qué elemento se debe observar para estudiar la rima?'},
    'basica-lenguaje-287-19': {option:'Explicar que haber impersonal se usa en singular y pedir revisar la oración'},
    'basica-historia-287-14': {q:'Las constituciones de 1823 y 1828 y las leyes federales de 1826 muestran que la organización nacional chilena:'},
    'media-lengua-287-17': {q:'Un texto presenta primero un problema, luego analiza sus causas y finalmente propone soluciones. ¿Qué organización de la información predomina?', option:'Organización en problema, causas y soluciones'}
  };
  const banks = new Set([window.QBANK, ...Object.values(window.PE22_CONTENT || {}).map(pack => pack.questions)]);
  for (const rows of banks) for (const q of rows || []) {
    if (q.id.includes('-281-')) coverage(q);
    else {
      const authored = window.PE304_EXPLANATIONS[q.id];
      if (authored) {
        q.explanations = authored.map((reason, i) => reason === null && i === q.a ? q.e : reason);
        q.e = q.explanations[q.a];
      }
      q.feedbackKind = authored ? 'por-pregunta' : 'original';
    }
    const correction = corrections[q.id];
    if (correction?.q) q.q = correction.q;
    if (correction?.option) q.o[q.a] = correction.option;
  }

  function complete(q) {
    return !!q && Array.isArray(q.explanations) && q.explanations.length === q.o?.length &&
      q.explanations.every(reason => typeof reason === 'string' && reason.trim().length >= 8 && !generic.test(reason)) &&
      new Set(q.explanations).size === q.o.length;
  }
  function reason(q, index) {
    const explanation = q?.explanations?.[index];
    if (typeof explanation === 'string' && explanation.trim() && !generic.test(explanation)) return explanation;
    if (index === q?.a && typeof q.e === 'string' && !generic.test(q.e)) return q.e;
    return 'Esta alternativa necesita una explicación específica. Puedes marcar la pregunta para revisión.';
  }
  function alternatives(q, selected) {
    if (!q) return '';
    return '<div class="pe304-options">' + q.o.map((option, index) => {
      const correct = index === q.a, chosen = index === selected;
      return '<details class="pe304-option' + (correct ? ' is-correct' : '') + '"' + (chosen ? ' open' : '') + '><summary>' +
        '<span class="pe304-letter">' + String.fromCharCode(65 + index) + '</span><span>' + esc(option) +
        '<small>' + (correct ? 'Respuesta correcta' : 'Alternativa incorrecta') + (chosen ? ' · Tu elección' : '') + '</small></span></summary>' +
        '<p>' + esc(reason(q, index)) + '</p></details>';
    }).join('') + '</div>';
  }
  function feedback(q, selected) {
    if (!q) return '';
    const answered = Number.isInteger(selected) && selected >= 0 && selected < q.o.length;
    const wrong = answered && selected !== q.a;
    return '<section class="pe304-feedback" aria-label="Explicación de la pregunta"><p class="pe304-question">' + esc(q.q) + '</p>' +
      (wrong ? '<div class="pe304-selected"><b>Por qué tu respuesta no corresponde</b><p>' + esc(String.fromCharCode(65 + selected) + '. ' + q.o[selected]) + '</p><p>' + esc(reason(q, selected)) + '</p></div>' : '') +
      '<div class="answerKey">Respuesta correcta: <b>' + esc(String.fromCharCode(65 + q.a) + '. ' + q.o[q.a]) + '</b></div>' +
      '<p>' + esc(reason(q, q.a)) + '</p><details class="pe304-all"><summary>Entender las cuatro alternativas</summary>' + alternatives(q, selected) + '</details></section>';
  }
  function review(q, selected) {
    if (!q) return '';
    return '<details class="card pe304-review"><summary>' + esc(q.q) + '<small>' + (selected === undefined ? 'Sin responder' : selected === q.a ? 'Correcta' : 'Revisar tu respuesta') + '</small></summary>' + feedback(q, selected) + '</details>';
  }
  function selected(q) {
    // Use the current question/session only; a historical attempt must not leak
    // into the feedback of an unanswered question or another specialty.
    const current = typeof answers !== 'undefined' && answers.find(row => row.id === q?.id);
    return current?.selected;
  }
  window.PE304 = {complete, reason, alternatives, feedback, review, selected, esc, evidenceFor};
}());
