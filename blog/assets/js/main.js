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
  var ctx=cv.getContext('2d'),word='T4U4T',size=16,trail=11,w=0,h=0,cols=[],last=0,raf=0,visible=true;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var color='#8d8e94';

  function readColor(){
    var v=getComputedStyle(document.documentElement).getPropertyValue('--rain');
    color=(v||'#8d8e94').trim()||'#8d8e94';
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
        o:Math.floor(Math.random()*word.length)
      });
    }
    ctx.clearRect(0,0,w,h);
  }

  function drawFrame(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle=color;
    for(var i=0;i<cols.length;i++){
      var c=cols[i];
      for(var k=0;k<trail;k++){
        var y=c.y-k*size*1.12;
        if(y<-size||y>h)continue;
        var alpha=0.60*(1-k/trail);
        if(alpha<=0.03)continue;
        var chIdx=(c.o-k)%word.length;
        if(chIdx<0)chIdx+=word.length;
        ctx.globalAlpha=alpha;
        ctx.fillText(word.charAt(chIdx),c.x,y);
      }
    }
    ctx.globalAlpha=1;
  }

  function frame(t){
    raf=requestAnimationFrame(frame);
    if(!visible||t-last<55)return;
    last=t;
    for(var i=0;i<cols.length;i++){
      var c=cols[i];
      c.o++;
      c.y+=size*c.v*1.1;
      if(c.y-(trail*size*1.12)>h){
        c.y=-size*Math.random()*10;
        c.v=.35+Math.random()*.55;
        c.o=Math.floor(Math.random()*word.length);
      }
    }
    drawFrame();
  }

  function drawStatic(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle=color;
    ctx.globalAlpha=.28;
    for(var i=0;i<cols.length;i++){
      for(var y=(i%3)*size,k=0;y<h;y+=size*1.2,k++){
        ctx.fillText(word.charAt((i+k)%word.length),cols[i].x,y);
      }
    }
    ctx.globalAlpha=1;
  }

  onThemeUpdate=function(){
    readColor();
    if(reduce){drawStatic();}
    else{drawFrame();}
  };

  readColor();setup();
  if(reduce){drawStatic();return;}
  drawFrame();
  raf=requestAnimationFrame(frame);
  addEventListener('resize',function(){setup();if(reduce){drawStatic();}else{drawFrame();}});
  if('IntersectionObserver' in window)new IntersectionObserver(function(e){visible=e[0].isIntersecting}).observe(cv);
})();
