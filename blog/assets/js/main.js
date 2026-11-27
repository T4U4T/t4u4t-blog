(function(){
  var prog=document.getElementById('prog'),topBar=document.getElementById('top-bar'),links=[].slice.call(document.querySelectorAll('nav a'));
  var hashLinks=links.filter(function(a){var h=a.getAttribute('href')||'';return h.charAt(0)==='#'});
  var secs=hashLinks.map(function(a){return document.querySelector(a.getAttribute('href'))});
  function upd(){
    var h=document.documentElement.scrollHeight-innerHeight;
    if(prog){prog.style.height=(h>0?Math.min(100,scrollY/h*100):0)+'%';}
    if(topBar){topBar.classList.toggle('scrolled',scrollY>16);}
    if(hashLinks.length){
      var cur=0;secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<innerHeight*.4)cur=i});
      hashLinks.forEach(function(a,i){a.classList.toggle('on',i===cur)});
    }
  }
  addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
})();

var onThemeUpdate=null;

(function(){
  var btn=document.getElementById('theme-toggle');
  var meta=document.getElementById('theme-color');
  var root=document.documentElement;

  function currentTheme(){
    return root.getAttribute('data-theme')==='light'?'light':'dark';
  }

  function applyTheme(theme,persist){
    var next=theme==='light'?'light':'dark';
    root.setAttribute('data-theme',next);
    if(meta){meta.setAttribute('content',next==='light'?'#f6f5f0':'#0d0d0f');}
    if(btn){
      var isLight=next==='light';
      btn.setAttribute('aria-pressed',isLight?'true':'false');
      btn.setAttribute('aria-label',isLight?'Ativar modo escuro':'Ativar modo claro de leitura');
    }
    if(persist){
      try{localStorage.setItem('t4u4t-theme',next);}catch(e){}
    }
    if(typeof onThemeUpdate==='function'){onThemeUpdate();}
  }

  applyTheme(currentTheme(),false);
  if(btn){
    btn.addEventListener('click',function(){
      applyTheme(currentTheme()==='light'?'dark':'light',true);
    });
  }
})();

/* Chuva discreta "T4U4T" (home) */
(function(){
  var cv=document.getElementById('rain');if(!cv||!cv.getContext)return;
  var ctx=cv.getContext('2d'),word='T4U4T',size=16,w=0,h=0,cols=[],last=0,raf=0,visible=true;
  var color='#8d8e94';

  function readColor(){
    var v=getComputedStyle(document.documentElement).getPropertyValue('--rain');
    color=(v||'#8d8e94').trim()||'#8d8e94';
  }

  function step(){
    for(var i=0;i<cols.length;i++){
      var c=cols[i],next=[];
      for(var j=0;j<c.g.length;j++){
        var g=c.g[j];
        g.a*=0.91;
        if(g.a>=0.025)next.push(g);
      }
      c.g=next;
      if(c.y>=-size&&c.y<=h+size){
        c.g.push({y:c.y,ch:word.charAt(c.o%word.length),a:0.55});
      }
      c.o++;
      c.y+=size*c.v*1.1;
      if(c.y>h+size){
        c.y=-size*Math.random()*12;
        c.v=.35+Math.random()*.55;
        c.o=Math.floor(Math.random()*word.length);
      }
    }
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle=color;
    for(var i=0;i<cols.length;i++){
      var c=cols[i];
      for(var j=0;j<c.g.length;j++){
        var g=c.g[j];
        ctx.globalAlpha=g.a;
        ctx.fillText(g.ch,c.x,g.y);
      }
    }
    ctx.globalAlpha=1;
  }

  function setup(){
    var dpr=Math.min(devicePixelRatio||1,2),r=cv.getBoundingClientRect();
    w=r.width;h=r.height;cv.width=Math.max(1,w*dpr);cv.height=Math.max(1,h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.font='500 '+size+'px "JetBrains Mono",ui-monospace,monospace';
    ctx.textBaseline='top';
    var n=Math.ceil(w/(size*1.5));cols=[];
    for(var i=0;i<n;i++){
      cols.push({
        x:i*size*1.5,
        y:-Math.random()*h,
        v:.35+Math.random()*.55,
        o:Math.floor(Math.random()*word.length),
        g:[]
      });
    }
    for(var s=0;s<24;s++)step();
    ctx.clearRect(0,0,w,h);
  }

  function frame(t){
    raf=requestAnimationFrame(frame);
    if(document.hidden||!visible||t-last<55)return;
    last=t;
    step();
    draw();
  }

  onThemeUpdate=function(){
    readColor();
    draw();
  };

  readColor();setup();draw();
  raf=requestAnimationFrame(frame);
  addEventListener('resize',function(){setup();draw();});
  if('IntersectionObserver' in window)new IntersectionObserver(function(e){visible=e[0].isIntersecting}).observe(cv);
})();
