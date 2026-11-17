
// Light circuit trace cursor. No portrait popup or click-to-expand animation.
(()=>{
 if(!matchMedia('(pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const c=document.createElement('canvas');c.className='cursor-canvas';document.body.appendChild(c);
 const x=c.getContext('2d');let w,h,dpr,trail=[],rings=[],mouse={x:-100,y:-100};
 function resize(){dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;c.width=w*dpr;c.height=h*dpr;c.style.width=w+'px';c.style.height=h+'px';x.setTransform(dpr,0,0,dpr,0,0)}
 addEventListener('resize',resize,{passive:true});
 addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;trail.push({x:e.clientX,y:e.clientY,t:performance.now()});if(trail.length>20)trail.shift();if(trail.length%4===0)rings.push({x:e.clientX,y:e.clientY,r:1,a:.27})},{passive:true});
 function frame(){x.clearRect(0,0,w,h);for(let i=1;i<trail.length;i++){let a=i/trail.length;x.beginPath();x.moveTo(trail[i-1].x,trail[i-1].y);x.lineTo(trail[i].x,trail[i].y);x.strokeStyle=`rgba(165,201,169,${a*.25})`;x.lineWidth=.6+a;x.stroke()}
 x.beginPath();x.arc(mouse.x,mouse.y,3,0,Math.PI*2);x.fillStyle='rgba(211,162,125,.8)';x.fill();
 for(let i=rings.length-1;i>=0;i--){let r=rings[i];r.r+=.7;r.a*=.95;x.beginPath();x.arc(r.x,r.y,r.r,0,Math.PI*2);x.strokeStyle=`rgba(211,162,125,${r.a})`;x.lineWidth=.7;x.stroke();if(r.a<.02)rings.splice(i,1)}
 let now=performance.now();trail=trail.filter(p=>now-p.t<550);requestAnimationFrame(frame)}
 resize();frame();
})();
document.querySelector('.menu')?.addEventListener('click',()=>document.querySelector('nav')?.classList.toggle('open'));


// Home-page micro-interactions: rotating expertise line, scroll reveals, card tilt, animated footer field.
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const role=document.getElementById('roleText');
 if(role&&!reduced){
  const words=['Embedded systems engineer','Hardware design & development','IoT product integration','Electronics prototyping'];
  let i=0;
  setInterval(()=>{i=(i+1)%words.length;role.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-7px)'}],{duration:180,fill:'forwards'}).onfinish=()=>{role.textContent=words[i];role.animate([{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,fill:'forwards'})}},2600);
 }
 const revealTargets=document.querySelectorAll('.section,.stats,.callout,.feature');
 if('IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});
  revealTargets.forEach(el=>{el.classList.add('reveal-on-scroll');observer.observe(el)});
 }else revealTargets.forEach(el=>el.classList.add('is-visible'));
 if(matchMedia('(pointer:fine)').matches&&!reduced){
  document.querySelectorAll('.feature').forEach(card=>{
   card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateY(${x*5}deg) rotateX(${-y*4}deg) translateY(-4px)`});
   card.addEventListener('pointerleave',()=>card.style.transform='');
  });
 }
 const canvas=document.getElementById('footerWave');
 if(canvas&&!reduced){
  const ctx=canvas.getContext('2d');let w=0,h=0,dpr=1,points=[];
  function resize(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);points=Array.from({length:Math.max(36,Math.floor(w/17))},(_,i)=>({phase:i*.23,speed:.4+Math.random()*.5}))}
  function frame(t){ctx.clearRect(0,0,w,h);for(let layer=0;layer<3;layer++){ctx.beginPath();points.forEach((p,i)=>{const x=i/(points.length-1)*w,y=h*(.56+layer*.12)+Math.sin(t*.00045*p.speed+p.phase+layer)*12+Math.sin(t*.0002+p.phase*1.7)*8;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.strokeStyle=`rgba(${layer===1?'211,162,125':'165,201,169'},${.18-layer*.035})`;ctx.lineWidth=layer===0?1.1:.7;ctx.stroke()}
   for(let i=0;i<8;i++){const x=((t*.018+i*w/8)%(w+30))-15,y=h*.58+Math.sin(t*.0005+i*1.3)*18;ctx.beginPath();ctx.arc(x,y,1.5+(i%3)*.5,0,Math.PI*2);ctx.fillStyle='rgba(201,230,199,.8)';ctx.shadowBlur=12;ctx.shadowColor='#a5c9a9';ctx.fill();ctx.shadowBlur=0}
   requestAnimationFrame(frame)}
  resize();addEventListener('resize',resize,{passive:true});requestAnimationFrame(frame);
 }
})();
