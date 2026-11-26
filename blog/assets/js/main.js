(function(){
  var prog=document.getElementById('prog'),links=[].slice.call(document.querySelectorAll('nav a'));
  var hashLinks=links.filter(function(a){var h=a.getAttribute('href')||'';return h.charAt(0)==='#'});
  var secs=hashLinks.map(function(a){return document.querySelector(a.getAttribute('href'))});
  function upd(){
    var h=document.documentElement.scrollHeight-innerHeight;
    if(prog){prog.style.height=(h>0?Math.min(100,scrollY/h*100):0)+'%';}
    if(hashLinks.length){
      var cur=0;secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<innerHeight*.4)cur=i});
      hashLinks.forEach(function(a,i){a.classList.toggle('on',i===cur)});
    }
  }
  addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
})();

/* Chuva discreta "T4U4T" (home) */
(function(){
  var cv=document.getElementById('rain');if(!cv||!cv.getContext)return;
  var ctx=cv.getContext('2d'),word='T4U4T',size=16,w=0,h=0,cols=[],last=0,raf=0,visible=true;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var color='#8d8e90';
  function readColor(){color=(getComputedStyle(document.documentElement).getPropertyValue('--mut')||'#8d8e90').trim()||'#8d8e90'}
  function setup(){
    var dpr=Math.min(devicePixelRatio||1,2),r=cv.getBoundingClientRect();
    w=r.width;h=r.height;cv.width=Math.max(1,w*dpr);cv.height=Math.max(1,h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.font='500 '+size+'px "JetBrains Mono",ui-monospace,monospace';ctx.textBaseline='top';
    var n=Math.ceil(w/(size*1.5));cols=[];
    for(var i=0;i<n;i++)cols.push({x:i*size*1.5,y:-Math.random()*h,v:.35+Math.random()*.55,o:Math.floor(Math.random()*word.length)});
    ctx.clearRect(0,0,w,h);
  }
  function frame(t){
    raf=requestAnimationFrame(frame);
    if(!visible||t-last<55)return;last=t;
    ctx.globalCompositeOperation='destination-out';ctx.fillStyle='rgba(0,0,0,.09)';ctx.fillRect(0,0,w,h);
    ctx.globalCompositeOperation='source-over';ctx.fillStyle=color;
    for(var i=0;i<cols.length;i++){
      var c=cols[i];
      ctx.globalAlpha=.55;ctx.fillText(word.charAt(c.o%word.length),c.x,c.y);
      c.o++;c.y+=size*c.v*1.1;
      if(c.y>h+size){c.y=-size*Math.random()*12;c.v=.35+Math.random()*.55;c.o=Math.floor(Math.random()*word.length)}
    }
    ctx.globalAlpha=1;
  }
  function drawStatic(){
    ctx.fillStyle=color;ctx.globalAlpha=.25;
    for(var i=0;i<cols.length;i++)for(var y=Math.random()*h*.6,k=0;y<h;y+=size,k++)ctx.fillText(word.charAt((i+k)%word.length),cols[i].x,y);
    ctx.globalAlpha=1;
  }
  readColor();setup();
  if(reduce){drawStatic();return}
  raf=requestAnimationFrame(frame);
  addEventListener('resize',function(){setup()});
  if('IntersectionObserver' in window)new IntersectionObserver(function(e){visible=e[0].isIntersecting}).observe(cv);
  matchMedia('(prefers-color-scheme: light)').addEventListener&&matchMedia('(prefers-color-scheme: light)').addEventListener('change',readColor);
})();
