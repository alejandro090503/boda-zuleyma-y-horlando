/* Sobre ivory Z&H — ZHSobre(el,{sub,hint,card,onOpen,onDone}) */
(function(){
  function wax(){ /* borde irregular de cera */
    var n=26,pts=[],seed=7;
    function rnd(){seed=(seed*9301+49297)%233280;return seed/233280;}
    for(var i=0;i<n;i++){var a=i/n*Math.PI*2,r=46+rnd()*3.2+(i%3===0?1.6:0);pts.push([50+Math.cos(a)*r,50+Math.sin(a)*r]);}
    var d='M'+pts[0][0].toFixed(1)+' '+pts[0][1].toFixed(1);
    for(var j=0;j<n;j++){var p=pts[(j+1)%n],q=pts[j],mx=(q[0]+p[0])/2,my=(q[1]+p[1])/2;d+=' Q'+q[0].toFixed(1)+' '+q[1].toFixed(1)+' '+mx.toFixed(1)+' '+my.toFixed(1);}
    return d+'Z';
  }
  function sealSVG(){
    return '<svg viewBox="0 0 100 100" aria-hidden="true"><defs>'+
      '<radialGradient id="zhW" cx="42%" cy="36%" r="70%"><stop offset="0" stop-color="#fffaf0"/><stop offset=".55" stop-color="#f1e6cd"/><stop offset="1" stop-color="#d8c49a"/></radialGradient>'+
      '<radialGradient id="zhW2" cx="50%" cy="50%" r="50%"><stop offset=".78" stop-color="#e9dcbd" stop-opacity="0"/><stop offset="1" stop-color="#b89c63" stop-opacity=".55"/></radialGradient>'+
      '<linearGradient id="zhG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6f5a33"/><stop offset=".35" stop-color="#b39256"/><stop offset=".5" stop-color="#dcc690"/><stop offset=".68" stop-color="#9a7d47"/><stop offset="1" stop-color="#5e4a28"/></linearGradient>'+
      '</defs><path d="'+wax()+'" fill="url(#zhW)"/><circle cx="50" cy="50" r="46" fill="url(#zhW2)"/>'+
      '<circle cx="50" cy="50" r="35" fill="none" stroke="url(#zhG)" stroke-width=".9"/>'+
      '<circle cx="50" cy="50" r="32.6" fill="none" stroke="#c9b07a" stroke-width=".35" opacity=".8"/>'+
      '<circle cx="50" cy="50" r="35" fill="none" stroke="#fff" stroke-width=".5" opacity=".6" transform="translate(-.5,-.6)"/>'+
      '<text x="50" y="60.5" text-anchor="middle" font-family="Great Vibes" font-size="31" fill="#fff" opacity=".7" transform="translate(-.5,-.6)">Z<tspan font-size="17" dx="1" dy="-2">&amp;</tspan><tspan dx="1" dy="2">H</tspan></text>'+
      '<text x="50" y="60.5" text-anchor="middle" font-family="Great Vibes" font-size="31" fill="url(#zhG)">Z<tspan font-size="17" dx="1" dy="-2">&amp;</tspan><tspan dx="1" dy="2">H</tspan></text>'+
      '</svg>';
  }
  window.ZHSobre=function(el,o){
    o=o||{};
    el.classList.add('zh-env');
    el.innerHTML='<div class="p"></div><div class="in"></div><div class="rays"></div>'+
      (o.card?'<div class="card"><b>Zuleyma &amp; Horlando</b><small>3 · IV · 2027</small></div>':'')+
      '<svg class="lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 100 L46 58"/><path d="M100 100 L54 58"/></svg>'+
      '<div class="fw"><div class="fl"></div></div>'+
      '<div class="seal"><div class="glow"></div>'+sealSVG()+'</div>'+
      '<p class="sub">'+(o.sub||'')+'</p><p class="hint">'+(o.hint||'Toca para abrir')+'</p><div class="wash"></div>';
    el.setAttribute('role','button');el.setAttribute('aria-label',o.label||'Abrir el sobre');el.tabIndex=0;
    var q=function(s){return el.querySelector(s);},done=false;
    if(window.gsap){gsap.fromTo(q('.p'),{scale:1.06},{scale:1,duration:9,ease:'power1.out'});
      gsap.fromTo([q('.seal'),q('.sub')],{autoAlpha:0,y:10,filter:'blur(6px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:1.6,stagger:.35,delay:.3,ease:'power2.out'});
      gsap.fromTo(q('.hint'),{autoAlpha:0},{autoAlpha:1,duration:1,delay:1.6});}
    function open(e){
      if(done)return;done=true;if(e&&e.preventDefault)e.preventDefault();
      if(o.onOpen)try{o.onOpen();}catch(_){}
      if(!window.gsap){el.remove();o.onDone&&o.onDone();return;}
      var tl=gsap.timeline();
      tl.to([q('.hint'),q('.sub')],{autoAlpha:0,duration:.6,ease:'power1.out'},0)
        .to(q('.seal .glow'),{opacity:1,scale:1.2,duration:.6,ease:'power1.out'},0)
        .to(q('.seal'),{scale:1.08,duration:.6,ease:'power2.out'},0)
        .to(q('.seal'),{scale:1.25,autoAlpha:0,filter:'blur(8px)',duration:1.1,ease:'power2.in'},.55)
        .to(q('.fw'),{rotationX:-178,transformPerspective:900,duration:2.1,ease:'power2.inOut',onUpdate:function(){var r=gsap.getProperty(q('.fw'),'rotationX');q('.fl').classList.toggle('back',r<-90);}},1.0)
        .to(q('.in'),{opacity:1,duration:1.4,ease:'power1.inOut'},1.3)
        .fromTo(q('.rays'),{opacity:0,rotation:-8,scale:.7},{opacity:.85,rotation:6,scale:1,duration:3,ease:'power1.out'},1.6);
      if(o.card)tl.fromTo(q('.card'),{opacity:0,yPercent:30},{opacity:1,yPercent:-6,duration:1.8,ease:'power2.out'},2.2).to({},{duration:.8});
      tl.to(q('.wash'),{opacity:1,duration:1.3,ease:'power1.inOut'},o.card?4.3:3.2)
        .call(function(){o.onDone&&o.onDone();})
        .to(el,{autoAlpha:0,duration:.9,ease:'power1.inOut',onComplete:function(){el.style.display='none';}});
    }
    el.addEventListener('click',open);
    el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')open(e);});
    return {open:open};
  };
})();
