/* Modelo educativo sin unidades clínicas. La geometría se edita en index.html. */
(function(root){
  'use strict';
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  function breathAt(phase,ratio=.4){
    const p=((phase%1)+1)%1;
    const inhale=p<ratio;
    const u=inhale?p/ratio:(p-ratio)/(1-ratio);
    const volume=inhale?(1-Math.cos(Math.PI*u))/2:(1+Math.cos(Math.PI*u))/2;
    const derivative=(inhale?1:-1)*Math.PI*Math.sin(Math.PI*u)/(2*(inhale?ratio:1-ratio));
    return {phase:p,inhale,volume,flow:Math.abs(derivative)<1e-8?0:derivative,progress:u};
  }
  function comparison(before,after){
    if(!Number.isInteger(before)||!Number.isInteger(after)||before<1||before>10||after<1||after>10)throw new Error('Usa valores enteros entre 1 y 10.');
    const delta=after-before;
    return {delta,description:delta===0?'La tensión percibida se mantuvo igual.':`La tensión percibida ${delta<0?'bajó':'subió'} ${Math.abs(delta)} ${Math.abs(delta)===1?'punto':'puntos'}.`};
  }
  const api={clamp,breathAt,comparison};
  root.RespiraModel=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
