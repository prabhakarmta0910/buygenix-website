/* shared.js - mini ocean animation + nav helpers for inner pages */
function initMiniOcean(canvasId){
  const canvas=document.getElementById(canvasId);
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let W,H,t=0;
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
  resize();window.addEventListener('resize',resize);
  function draw(){
    ctx.clearRect(0,0,W,H);
    const sky=ctx.createLinearGradient(0,0,0,H*0.6);
    sky.addColorStop(0,'#040D1A');sky.addColorStop(1,'#0A1E35');
    ctx.fillStyle=sky;ctx.fillRect(0,0,W,H*0.6);
    // stars
    ctx.fillStyle='rgba(255,255,255,0.6)';
    [[50,40],[200,25],[400,55],[650,18],[900,40],[1100,60],[300,80],[750,30]].forEach(([x,y])=>{
      ctx.globalAlpha=Math.sin(t*0.7+x)*0.3+0.5;ctx.beginPath();ctx.arc(x%W,y,1,0,Math.PI*2);ctx.fill();
    });ctx.globalAlpha=1;
    // ocean layers
    for(let l=0;l<3;l++){
      const y0=H*(0.58+l*0.14);ctx.beginPath();ctx.moveTo(0,y0);
      for(let x=0;x<=W;x+=8){ctx.lineTo(x,y0+Math.sin(x*0.01+t*(0.5+l*0.1)+l)*8+Math.sin(x*0.02+t*0.8)*4);}
      ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();
      const g=ctx.createLinearGradient(0,y0,0,H);
      g.addColorStop(0,`rgba(13,42,80,${0.35+l*0.2})`);g.addColorStop(1,`rgba(5,18,35,${0.55+l*0.15})`);
      ctx.fillStyle=g;ctx.fill();
    }
    // distant ship
    ctx.save();ctx.translate(W*0.7+Math.sin(t*0.18)*4,H*0.62+Math.sin(t*0.25)*1.5);ctx.scale(0.45,0.45);
    ctx.beginPath();ctx.moveTo(-90,0);ctx.lineTo(-100,20);ctx.lineTo(100,20);ctx.lineTo(90,0);ctx.closePath();ctx.fillStyle='#1A2744';ctx.fill();
    const cc=['#C8972A','#1D7A6E','#1B3A5C'];
    for(let i=0;i<4;i++){ctx.fillStyle=cc[i%3];ctx.fillRect(-55+i*28,-16,22,16);}
    ctx.restore();
    t+=0.012;requestAnimationFrame(draw);
  }
  draw();
}

function initNav(){
  const links=document.querySelectorAll('.nav-links a');
  const current=window.location.pathname.split('/').pop()||'index.html';
  links.forEach(a=>{if(a.getAttribute('href')===current)a.classList.add('active');});
}
document.addEventListener('DOMContentLoaded',()=>{initNav();if(document.getElementById('ocean-mini'))initMiniOcean('ocean-mini');});
