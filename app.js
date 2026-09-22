(function(){
  'use strict';
  // A clean template is captured before animation, answers or edits modify the page.
  const cleanTemplate='<!doctype html>\n'+document.documentElement.outerHTML;
  const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
  const {breathAt,comparison}=RespiraModel;
  let stored={};try{stored=JSON.parse($('#user-config').textContent||'{}')}catch{}
  const edits={};
  Object.entries(stored.edits||{}).forEach(([k,v])=>{if(typeof v==='string')edits[k]=v.slice(0,8000)});
  let members=Array.isArray(stored.members)?stored.members.slice(0,12).map(m=>({name:String(m.name||'').slice(0,100),reflection:String(m.reflection||'').slice(0,2400)})):[{name:'',reflection:''}];
  let editing=false,dirty=false;
  let selectedRoute='nose',selectedConcept='memory';
  const experience={state:'setup',elapsed:0,duration:60,before:5,after:5,example:false};
  const tour={active:false,index:0,running:false,elapsed:0};
  const steps=[
    {view:'presentar',part:'intro',title:'El libro y el equipo',seconds:40,script:'Presenten a los integrantes. Expliquen quién es la autora, el año, el tipo de texto y su idea central. El capítulo relaciona la respiración con la memoria y la emoción. Nuestro proyecto permite observar esa relación y discutir qué puede afirmarse con evidencia.'},
    {view:'explorar',title:'La mecánica respiratoria',seconds:50,script:'Pulsen Inspirar y describan el descenso del diafragma. Expliquen el aumento de volumen y la entrada del aire por diferencia de presión. Pulsen Espirar y describan el retroceso elástico. La curva es ilustrativa; no mide a una persona. Los pulmones conservan aire después de espirar.'},
    {view:'vias',title:'Dos vías para el aire',seconds:30,script:'Alternen entre nariz y boca. Señalen la contribución nasal al filtrado, la humedad y la temperatura. Sigan el recorrido a los alvéolos y distingan ventilación de intercambio gaseoso. Eviten describir la respiración bucal como siempre perjudicial.'},
    {view:'cerebro',title:'Los dos conceptos',seconds:55,script:'Expliquen el acoplamiento respiratorio y su relación con tareas de memoria. Cambien a Emoción y describan la relación en ambos sentidos con el estado corporal. Planteen las preguntas críticas que aparecen en cada concepto, sin atribuir a la animación la capacidad de medir el cerebro.'},
    {view:'experiencia',title:'La pausa y su interpretación',seconds:75,script:'Inviten a participar solo a quien lo desee. Valoren la tensión, realicen la pauta de un minuto y comparen. Si prefieren abreviar, muestren el ejemplo ficticio, identificándolo como tal. La comparación personal no establece causalidad. No hay resultados correctos o esperados.'},
    {view:'evidencia',title:'Qué respalda y qué cuestiona la lectura',seconds:50,script:'Abran los hallazgos y argumentos críticos. Contrasten el resultado de una tarea concreta con una afirmación general. Comparen el ensayo favorable con el que no mostró superioridad del ritmo lento. Los protocolos y comparadores difieren, por lo que no son pruebas idénticas.'},
    {view:'presentar',part:'conclusion',title:'Valor cotidiano y conclusión',seconds:55,script:'Expongan las dos razones para recomendar el capítulo a estudiantes de salud: comprender al paciente de forma integral y ejercitar la lectura crítica. Den el ejemplo cotidiano y lean su conclusión, nombrando las dos citas externas. Eviten prometer una mejora universal.'},
    {view:'presentar',part:'reflections',title:'Reflexiones de cada integrante',seconds:45,script:'Cada integrante comparte una experiencia propia y la conecta con una idea del capítulo. Una frase concreta por persona puede bastar. Este apartado aporta 20 puntos y requiere voces personales. Si el equipo es grande, usen el ejemplo ficticio para liberar tiempo en el paso de la experiencia.'}
  ];
  const formatTime=s=>`${Math.floor(Math.max(0,s)/60).toString().padStart(2,'0')}:${Math.floor(Math.max(0,s)%60).toString().padStart(2,'0')}`;
  const sim={phase:0,rate:12,playing:!matchMedia('(prefers-reduced-motion: reduce)').matches,route:'nose',manual:null};
  let view='explorar',last=performance.now(),lastPhase='';
  const ns='http://www.w3.org/2000/svg';
  const particleNodes=Array.from({length:12},()=>{const n=document.createElementNS(ns,'circle');n.setAttribute('r','3.6');$('#particles').append(n);return n});
  const curve=[];for(let i=0;i<=120;i++){const b=breathAt(i/120);curve.push(`${i?'L':'M'}${20+i/120*680},${82-b.volume*65}`)}$('#volume-curve').setAttribute('d',curve.join(' '));
  function renderSim(){
    const b=breathAt(sim.phase),v=b.volume;
    $('#lung-organs').setAttribute('transform',`translate(340 137) scale(${.93+v*.08} ${.94+v*.13}) translate(-340 -137)`);
    $('#thorax').setAttribute('transform',`translate(340 70) scale(${1+v*.026} 1) translate(-340 -70)`);
    $('#diaphragm').setAttribute('d',`M191 ${408+v*12}Q340 ${325+v*93} 489 ${408+v*12}`);
    $('#diaphragm-label-line').setAttribute('d',`M132 419L191 ${408+v*12}`);
    $('#nasal-airway').setAttribute('stroke',sim.route==='nose'?'#157e99':'#c5d9dc');
    $('#oral-airway').setAttribute('stroke',sim.route==='mouth'?'#157e99':'#c5d9dc');
    const flowing=sim.playing||!!sim.manual;
    particleNodes.forEach((n,i)=>{const t=((b.inhale?sim.phase*4:-sim.phase*4)+i/12+10)%1;const y=70+t*236;const side=i%2?1:-1;const x=y<184?340:340+side*(y-184)*.5;n.setAttribute('cx',x);n.setAttribute('cy',y);n.setAttribute('fill',b.inhale?'#167f9a':'#c6614b');n.setAttribute('opacity',flowing&&Math.abs(b.flow)>.01?'.85':'0')});
    $('#volume-cursor').setAttribute('cx',20+sim.phase*680);$('#volume-cursor').setAttribute('cy',82-v*65);
    const endpoint=!flowing&&(v<.0001||v>.9999);
    const key=endpoint?(v>.5?'full':'empty'):(b.inhale?'in':'out');if(key!==lastPhase){lastPhase=key;$('#phase-chip').textContent=$('#phase-title').textContent=endpoint?(v>.5?'Fin de inspiración':'Fin de espiración'):(b.inhale?'Inspiración':'Espiración');$('#phase-description').textContent=endpoint?(v>.5?'El diafragma ha descendido. Al terminar la entrada de aire, la presión alveolar se iguala a la exterior.':'El diafragma recupera su posición. Al terminar la salida de aire, la presión alveolar se iguala a la exterior.'):(b.inhale?'El diafragma se contrae y desciende. El volumen torácico aumenta y entra aire.':'El diafragma se relaja y asciende. El retroceso elástico favorece la salida de aire.');$('#volume-status').textContent=endpoint?(v>.5?'Máximo de este ciclo':'Mínimo de este ciclo'):(b.inhale?'Aumenta':'Disminuye')}
    $('#pressure-status').textContent=Math.abs(b.flow)<.02?'Igual a la exterior':b.inhale?'Menor que la exterior':'Mayor que la exterior';
    $('#play').textContent=sim.playing?'Pausar':'Reproducir';
  }
  function navigate(id){if(!$('#'+id)||!$('#'+id).classList.contains('view'))return;if(view==='experiencia'&&id!==view&&experience.state==='running')pauseExperience('La actividad se pausó al cambiar de sección.');view=id;$$('.view').forEach(n=>n.hidden=n.id!==id);$$('.nav-item').forEach(n=>{const on=n.dataset.view===id;n.classList.toggle('active',on);on?n.setAttribute('aria-current','page'):n.removeAttribute('aria-current')});try{history.replaceState(null,'','#'+id)}catch{}window.scrollTo({top:0,behavior:'instant'})}
  $$('[data-view]').forEach(n=>n.addEventListener('click',()=>navigate(n.dataset.view)));
  $('.brand').addEventListener('click',e=>{e.preventDefault();navigate('explorar')});
  window.addEventListener('hashchange',()=>navigate(location.hash.slice(1)));
  $('#play').onclick=()=>{sim.playing=!sim.playing;sim.manual=null;renderSim()};
  $('#reset-sim').onclick=()=>{Object.assign(sim,{phase:0,rate:12,route:'nose',manual:null,playing:false});$('#rate').value=12;$('#rate-value').textContent=12;$('#cycle-time').textContent='5 s por ciclo';setRoute('nose');renderSim()};
  $('#rate').oninput=e=>{sim.rate=+e.target.value;$('#rate-value').textContent=sim.rate;$('#cycle-time').textContent=`${(60/sim.rate).toLocaleString('es-CL',{maximumFractionDigits:1})} s por ciclo`};
  function setRoute(route){sim.route=route;['nose','mouth'].forEach(r=>{$('#sim-'+r).classList.toggle('selected',r===route);$('#sim-'+r).setAttribute('aria-pressed',String(r===route))});renderSim()}
  $('#sim-nose').onclick=()=>setRoute('nose');$('#sim-mouth').onclick=()=>setRoute('mouth');
  function manual(inhale){sim.playing=false;sim.phase=inhale?0:.4;sim.manual={from:sim.phase,to:inhale?.4:1,elapsed:0};renderSim()}
  $('#inhale').onclick=()=>manual(true);$('#exhale').onclick=()=>manual(false);
  $('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{toast('Usa F11 en tu navegador para ampliar la pantalla.')}};
  let toastTimer;function toast(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4500)}
  function selectRoute(route){selectedRoute=route;const nasal=route==='nose';$('#route-name').textContent=nasal?'Respiración nasal':'Respiración bucal';$('#nasal-copy').hidden=!nasal;$('#oral-copy').hidden=nasal;['nose','mouth'].forEach(r=>{const selected=r===route;$('#route-'+r).classList.toggle('selected',selected);$('#route-'+r).setAttribute('aria-pressed',String(selected));$('#'+r+'-route-path').setAttribute('stroke',selected?'#087888':'#cedee2');$('#'+r+'-node rect').setAttribute('fill',selected?'#087888':'#e5edf0');$('#'+r+'-node text').setAttribute('fill',selected?'white':'#4f707d')})}
  $('#route-nose').onclick=()=>selectRoute('nose');$('#route-mouth').onclick=()=>selectRoute('mouth');
  function selectConcept(c){selectedConcept=c;['memory','emotion'].forEach(k=>{$('#concept-'+k).classList.toggle('selected',k===c);$('#concept-'+k).setAttribute('aria-pressed',String(k===c));$('#'+k+'-copy').hidden=k!==c;$('#'+k+'-node').setAttribute('stroke',k===c?'#087888':'#d6e2e6');$('#'+k+'-node').setAttribute('stroke-width',k===c?'3':'1')})}
  $('#concept-memory').onclick=()=>selectConcept('memory');$('#concept-emotion').onclick=()=>selectConcept('emotion');

  // Session values are held in memory only and excluded from exported copies.
  function experienceScreen(name){['setup','running','after','result'].forEach(k=>$('#experience-'+k).hidden=k!==name)}
  function resetExperience(){Object.assign(experience,{state:'setup',elapsed:0,duration:+$('#duration').value,before:5,after:5,example:false});$('#before').value=$('#after').value=5;['before','after'].forEach(k=>$('#'+k+'-output').innerHTML='5<small>/10</small>');$('#experience-mode').textContent='EXPERIENCIA GUIADA';$('#breath-instruction').textContent='A tu ritmo';$('#breath-count').textContent='Listo para comenzar';$('#breath-hint').textContent='Inspira suavemente 4 s · Espira 6 s';$('#breathing-disc').style.transform='scale(.72)';$('#experience-fill').style.width='0%';$('#session-clock').textContent=formatTime(experience.duration);experienceScreen('setup')}
  $('#before').oninput=e=>$('#before-output').innerHTML=`${e.target.value}<small>/10</small>`;
  $('#after').oninput=e=>$('#after-output').innerHTML=`${e.target.value}<small>/10</small>`;
  $('#duration').onchange=e=>{experience.duration=+e.target.value;$('#session-clock').textContent=formatTime(experience.duration)};
  $('#start-experience').onclick=()=>{Object.assign(experience,{state:'running',elapsed:0,duration:+$('#duration').value,before:+$('#before').value,example:false});$('#pause-experience').textContent='Pausar ejercicio';$('#session-note').textContent='Tu valoración queda solo en esta sesión.';$('#experience-mode').textContent='EXPERIENCIA GUIADA';experienceScreen('running');renderExperience()};
  function pauseExperience(message){if(experience.state!=='running')return;experience.state='paused';$('#pause-experience').textContent='Reanudar ejercicio';$('#breath-instruction').textContent='En pausa';$('#breath-count').textContent='Respira naturalmente';$('#session-note').textContent=message||'La guía está detenida. Vuelve a respirar a tu ritmo.'}
  $('#pause-experience').onclick=()=>{if(experience.state==='running')pauseExperience();else if(experience.state==='paused'){experience.state='running';$('#pause-experience').textContent='Pausar ejercicio';$('#session-note').textContent='Guía reanudada.'}};
  $('#stop-experience').onclick=()=>{resetExperience();toast('Actividad detenida. Respira a tu ritmo natural.')};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseExperience('La actividad se pausó al ocultar la pestaña.')});
  function finishExperience(){experience.elapsed=experience.duration;experience.state='after';$('#experience-fill').style.width='100%';$('#session-clock').textContent='00:00';$('#breath-instruction').textContent='Observa';$('#breath-count').textContent='Pausa terminada';$('#breath-hint').textContent='Vuelve a tu respiración natural';$('#breathing-disc').style.transform='scale(.72)';$('#after').value=experience.before;$('#after-output').innerHTML=`${experience.before}<small>/10</small>`;experienceScreen('after');$('#after').focus()}
  function renderExperience(){const e=experience;if(e.state!=='running')return;const b=breathAt((e.elapsed%10)/10);$('#breathing-disc').style.transform=`scale(${.72+b.volume*.28})`;$('#breath-instruction').textContent=b.inhale?'Inspira':'Espira';$('#breath-count').textContent=`${Math.ceil((b.inhale?4:6)*(1-b.progress))} segundos`;$('#session-clock').textContent=formatTime(Math.ceil(e.duration-e.elapsed));$('#experience-fill').style.width=`${e.elapsed/e.duration*100}%`}
  function showResult(example){const before=example?6:experience.before,after=example?4:+$('#after').value;Object.assign(experience,{state:'result',after,example});const result=comparison(before,after);$('#result-kind').textContent=example?'EJEMPLO FICTICIO · SIN MEDICIÓN REAL':'OBSERVACIÓN PERSONAL';$('#result-kind').classList.toggle('example',example);$('#result-heading').textContent=example?'Un caso para interpretar':'Tu comparación';$('#before-number').textContent=before;$('#after-number').textContent=after;$('#before-bar').style.width=`${before*10}%`;$('#after-bar').style.width=`${after*10}%`;$('#result-description').textContent=(example?'Datos inventados para demostrar la pantalla. ':'')+result.description;$('#breath-instruction').textContent=example?'Ejemplo':'Observa';$('#breath-count').textContent=example?'6 antes · 4 después':'Respira a tu ritmo';$('#experience-mode').textContent=example?'EJEMPLO FICTICIO':'EXPERIENCIA COMPLETADA';$('#session-clock').textContent=example?'—':'00:00';$('#breath-hint').textContent=example?'No representa el resultado de una persona':'Toda respuesta merece una interpretación prudente';$('#breathing-disc').style.transform='scale(.8)';$('#experience-fill').style.width=example?'0%':'100%';experienceScreen('result')}
  $('#compare').onclick=()=>showResult(false);$('#show-example').onclick=()=>showResult(true);$('#new-experience').onclick=resetExperience;

  // Text edits are plain text. No HTML supplied by an editor is executed.
  function applyEdits(){ $$('[data-edit]').forEach(n=>{if(Object.hasOwn(edits,n.dataset.edit))n.textContent=edits[n.dataset.edit]}) }
  function setEditing(on){editing=on;document.body.classList.toggle('editing',on);$('#edit-bar').hidden=!on;$('#edit-toggle').textContent=on?'Terminar edición':'Editar textos';$$('[data-edit]').forEach(n=>{if(on){n.contentEditable='true';n.setAttribute('role','textbox');n.setAttribute('aria-label','Editar: '+n.dataset.edit)}else{n.removeAttribute('contenteditable');n.removeAttribute('role');n.removeAttribute('aria-label')}});if(!on&&dirty)toast('Para conservar los cambios, descarga una copia editada.')}
  $$('[data-edit]').forEach(n=>{n.addEventListener('input',()=>{edits[n.dataset.edit]=n.innerText.slice(0,8000);dirty=true});n.addEventListener('paste',e=>{e.preventDefault();const text=e.clipboardData.getData('text/plain');const selection=getSelection();if(selection?.rangeCount){const range=selection.getRangeAt(0);range.deleteContents();range.insertNode(document.createTextNode(text));range.collapse(false);selection.removeAllRanges();selection.addRange(range)}edits[n.dataset.edit]=n.innerText.slice(0,8000);dirty=true})});
  $('#edit-toggle').onclick=()=>setEditing(!editing);$('#edit-done').onclick=()=>setEditing(false);
  function syncTeamNames(){const names=members.map(m=>m.name.trim()).filter(Boolean);$('#team-names').textContent=names.length?'Equipo: '+names.join(' · '):'Equipo: agrega los nombres en «Equipo y reflexiones».'}
  function renderMembers(){const list=$('#team-list');list.replaceChildren();members.forEach((m,i)=>{const row=document.createElement('div');row.className='team-member';const nameLabel=document.createElement('label');nameLabel.textContent=`Integrante ${i+1}`;const input=document.createElement('input');input.type='text';input.maxLength=100;input.placeholder='Nombre';input.value=m.name;input.setAttribute('aria-label',`Nombre del integrante ${i+1}`);input.oninput=()=>{m.name=input.value;dirty=true;syncTeamNames()};nameLabel.append(input);const reflectionLabel=document.createElement('label');reflectionLabel.textContent='Reflexión personal';const area=document.createElement('textarea');area.rows=3;area.maxLength=2400;area.placeholder='Relaciona una experiencia real con una idea del capítulo…';area.value=m.reflection;area.setAttribute('aria-label',`Reflexión del integrante ${i+1}`);area.oninput=()=>{m.reflection=area.value;dirty=true};reflectionLabel.append(area);const remove=document.createElement('button');remove.className='remove-member';remove.textContent='×';remove.setAttribute('aria-label',`Quitar integrante ${i+1}`);remove.onclick=()=>{members.splice(i,1);dirty=true;renderMembers()};row.append(nameLabel,reflectionLabel,remove);list.append(row)});$('#add-member').disabled=members.length>=12;syncTeamNames()}
  $('#add-member').onclick=()=>{if(members.length>=12)return;members.push({name:'',reflection:''});dirty=true;renderMembers();$('#team-list').lastElementChild.querySelector('input').focus()};
  async function exportCopy(){
    let html=cleanTemplate;
    const json=JSON.stringify({version:1,edits,members}).replaceAll('<','\\u003c').replaceAll('>','\\u003e').replaceAll('&','\\u0026');
    html=html.replace(/(<script id="user-config" type="application\/json">)[\s\S]*?(<\/script>)/,(_,a,b)=>a+json+b);
    try{
      // In the editable folder, bundle local dependencies when served locally.
      const links=[...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)];
      // The delivered portable file already has inline styles and scripts.
      for(const match of links){const response=await fetch(match[1]);if(!response.ok)throw Error('CSS');const css=await response.text();html=html.replace(match[0],()=>'<style>'+css+'</style>')}
      const scripts=[...html.matchAll(/<script src="([^"]+)"><\/script>/g)];
      for(const match of scripts){const response=await fetch(match[1]);if(!response.ok)throw Error('JS');const js=await response.text();html=html.replace(match[0],()=>'<script>'+js.replace(/<\/script/gi,'<\\/script')+'<\/script>')}
      const blob=new Blob([html],{type:'text/html;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='RespiraLab-personalizado.html';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);dirty=false;toast('Copia descargada con tus textos y equipo. La valoración de tensión no se incluye.');
    }catch{toast('Abre RespiraLab.html, la versión portátil, para descargar una copia con tus cambios.')}
  }
  $('#download').onclick=exportCopy;$('#save-team').onclick=exportCopy;

  function tourStep(index){tour.index=Math.max(0,Math.min(index,steps.length-1));const step=steps[tour.index];$$('[data-present-part]').forEach(n=>n.hidden=!!step.part&&n.dataset.presentPart!==step.part);navigate(step.view);$('#tour-step').textContent=`PASO ${tour.index+1} DE ${steps.length} · ${step.seconds} S SUGERIDOS`;$('#tour-title').textContent=step.title;$('#tour-script').textContent=step.script;$('#tour-prev').disabled=tour.index===0;$('#tour-next').textContent=tour.index===steps.length-1?'Finalizar':'Siguiente';if(step.view==='evidencia')$$('.study details').forEach(n=>n.open=true)}
  function endTour(){tour.active=false;tour.running=false;document.body.classList.remove('touring');$('#tour-dock').hidden=true;$$('[data-present-part]').forEach(n=>n.hidden=false);navigate('presentar');toast('Recorrido terminado. Tiempo utilizado: '+formatTime(tour.elapsed)+'.')}
  $('#start-tour').onclick=()=>{setEditing(false);Object.assign(tour,{active:true,index:0,running:true,elapsed:0});$('#tour-clock').textContent='00:00';$('#tour-pause').textContent='Pausar reloj';document.body.classList.add('touring');$('#tour-dock').hidden=false;tourStep(0)};
  $('#tour-prev').onclick=()=>tourStep(tour.index-1);$('#tour-next').onclick=()=>tour.index===steps.length-1?endTour():tourStep(tour.index+1);$('#tour-close').onclick=endTour;
  $('#tour-pause').onclick=()=>{tour.running=!tour.running;$('#tour-pause').textContent=tour.running?'Pausar reloj':'Reanudar reloj'};
  document.addEventListener('keydown',e=>{if(editing||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable)return;if(tour.active&&e.key==='ArrowRight'){e.preventDefault();$('#tour-next').click()}if(tour.active&&e.key==='ArrowLeft'){e.preventDefault();$('#tour-prev').click()}if(e.key===' '&&view==='explorar'){e.preventDefault();$('#play').click()}});
  function frame(now){const realDt=Math.max(0,(now-last)/1000),dt=Math.min(realDt,.1);last=now;
    if(!document.hidden&&view==='explorar'){if(sim.manual){sim.manual.elapsed+=dt;const u=Math.min(sim.manual.elapsed/1.6,1);sim.phase=sim.manual.from+(sim.manual.to-sim.manual.from)*u;if(u===1){sim.phase=sim.manual.to===1?0:sim.manual.to;sim.manual=null}}else if(sim.playing)sim.phase=(sim.phase+dt*sim.rate/60)%1;renderSim()}
    if(!document.hidden&&view==='experiencia'&&experience.state==='running'){experience.elapsed+=realDt;if(experience.elapsed>=experience.duration)finishExperience();else renderExperience()}
    if(tour.active&&tour.running){tour.elapsed+=realDt;$('#tour-clock').textContent=formatTime(tour.elapsed);$('#tour-fill').style.width=`${Math.min(tour.elapsed/400*100,100)}%`}
    if(!document.hidden&&!matchMedia('(prefers-reduced-motion: reduce)').matches){if(view==='vias'){const t=(now/3300)%1;const path=$('#'+selectedRoute+'-route-path');const point=path.getPointAtLength(t*path.getTotalLength());$('#route-particle').setAttribute('cx',point.x);$('#route-particle').setAttribute('cy',point.y)}if(view==='cerebro'){$('#brain-pulse').setAttribute('cx',435-205*((now/2400)%1))}}
    requestAnimationFrame(frame)
  }
  applyEdits();renderMembers();resetExperience();navigate(location.hash.slice(1)||'explorar');renderSim();requestAnimationFrame(frame);
  window.RespiraApp={navigate,toast,sim,experience,tour,getView:()=>view};
  // Optional browser tooling: no effect in browsers without WebMCP.
  if(document.modelContext?.registerTool){const tools=[
    {name:'get_lab_state',title:'Consultar el laboratorio',description:'Lee la sección visible y el estado del modelo educativo. No devuelve valoraciones personales ni nombres.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({section:view,rate:sim.rate,route:sim.route,playing:sim.playing})},
    {name:'configure_respiratory_model',title:'Configurar modelo respiratorio',description:'Ajusta exclusivamente la animación educativa y abre Explorar. No inicia un ejercicio personal.',inputSchema:{type:'object',properties:{rate:{type:'integer',minimum:6,maximum:24},route:{type:'string',enum:['nose','mouth']},playing:{type:'boolean'}},additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{if(!input||typeof input!=='object'||Object.keys(input).some(k=>!['rate','route','playing'].includes(k))||(input.rate!==undefined&&(!Number.isInteger(input.rate)||input.rate<6||input.rate>24))||(input.route!==undefined&&!['nose','mouth'].includes(input.route))||(input.playing!==undefined&&typeof input.playing!=='boolean'))throw Error('Configuración inválida.');if(input.rate!==undefined){$('#rate').value=input.rate;$('#rate').dispatchEvent(new Event('input'))}if(input.route!==undefined)setRoute(input.route);if(input.playing!==undefined)sim.playing=input.playing;sim.manual=null;navigate('explorar');renderSim();return{section:view,rate:sim.rate,route:sim.route,playing:sim.playing}}}
  ];const controller=new AbortController();for(const tool of tools)try{Promise.resolve(document.modelContext.registerTool(tool,{signal:controller.signal})).catch(()=>{})}catch{}window.addEventListener('pagehide',()=>controller.abort(),{once:true})}
})();
