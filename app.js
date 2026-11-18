(function(){
var top=document.getElementById('top'),hero=document.querySelector('.hero'),mob=document.getElementById('mob');
function przewin(){
  var y=window.scrollY,h=hero.offsetHeight;
  top.classList.toggle('jasny',y>h-90||document.getElementById('menu').classList.contains('otw'));
  mob.classList.toggle('widac',y>h*0.85);
}
window.addEventListener('scroll',przewin,{passive:true});przewin();

var burger=document.getElementById('burger'),menu=document.getElementById('menu');
burger.addEventListener('click',function(){
  var o=menu.classList.toggle('otw');burger.setAttribute('aria-expanded',o);
  burger.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');przewin();
});
menu.addEventListener('click',function(e){if(e.target.tagName==='A'){menu.classList.remove('otw');burger.setAttribute('aria-expanded','false');przewin();}});

/* karuzela */
var pas=document.getElementById('pas'),items=pas.children,licz=document.getElementById('licznik'),
    w=document.getElementById('wstecz'),d=document.getElementById('dalej');
function krok(){return items[1].offsetLeft-items[0].offsetLeft;}
function stan(){
  var i=Math.round(pas.scrollLeft/krok()),max=pas.scrollWidth-pas.clientWidth;
  if(pas.scrollLeft>=max-4)i=items.length-1;
  licz.textContent=(i+1)+' / '+items.length;
  w.disabled=pas.scrollLeft<4;d.disabled=pas.scrollLeft>=max-4;
}
pas.addEventListener('scroll',function(){requestAnimationFrame(stan);},{passive:true});
w.addEventListener('click',function(){pas.scrollBy({left:-krok(),behavior:'smooth'});});
d.addEventListener('click',function(){pas.scrollBy({left:krok(),behavior:'smooth'});});
window.addEventListener('resize',stan);stan();
var dn=false,sx=0,sl=0,ruch=0;
pas.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;dn=true;ruch=0;sx=e.clientX;sl=pas.scrollLeft;});
window.addEventListener('pointermove',function(e){if(!dn)return;var dx=e.clientX-sx;ruch=Math.max(ruch,Math.abs(dx));if(ruch>4){pas.classList.add('ciagnie');pas.scrollLeft=sl-dx;}});
window.addEventListener('pointerup',function(){if(!dn)return;dn=false;if(pas.classList.contains('ciagnie')){pas.classList.remove('ciagnie');var k=krok();pas.scrollTo({left:Math.round(pas.scrollLeft/k)*k,behavior:'smooth'});}});
pas.addEventListener('click',function(e){if(ruch>4){e.preventDefault();e.stopPropagation();ruch=0;}},true);
pas.addEventListener('dragstart',function(e){e.preventDefault();});
pas.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){d.click();e.preventDefault();}if(e.key==='ArrowLeft'){w.click();e.preventDefault();}});

/* zakladki rzutow */
var tabs=[].slice.call(document.querySelectorAll('[role=tab]'));
function wybierz(t){
  tabs.forEach(function(x){var s=x===t;x.setAttribute('aria-selected',s);x.tabIndex=s?0:-1;document.getElementById(x.getAttribute('aria-controls')).hidden=!s;});
}
tabs.forEach(function(t,i){
  t.addEventListener('click',function(){wybierz(t);});
  t.addEventListener('keydown',function(e){var n=null;if(e.key==='ArrowRight')n=tabs[(i+1)%tabs.length];if(e.key==='ArrowLeft')n=tabs[(i-1+tabs.length)%tabs.length];if(n){wybierz(n);n.focus();e.preventDefault();}});
});

/* powiekszenie */
var lb=document.getElementById('lb'),lbi=document.getElementById('lb-img'),grupa=[],poz=0,ost=null;
function pokaz(){var b=grupa[poz];lbi.src=b.getAttribute('data-duze');lbi.alt=b.querySelector('img').alt;}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-duze]');if(!b)return;
  var kont=b.closest('.pas')||b.closest('.plan');
  grupa=kont.classList.contains('pas')?[].slice.call(kont.querySelectorAll('[data-duze]')):[b];
  poz=grupa.indexOf(b);ost=b;pokaz();lb.classList.add('otw');
  lb.querySelector('.pop').hidden=lb.querySelector('.nast').hidden=grupa.length<2;
  lb.querySelector('.zamk').focus();
});
function zamknij(){lb.classList.remove('otw');lbi.removeAttribute('src');if(ost)ost.focus();}
lb.querySelector('.zamk').addEventListener('click',zamknij);
lb.addEventListener('click',function(e){if(e.target===lb)zamknij();});
lb.querySelector('.pop').addEventListener('click',function(){poz=(poz-1+grupa.length)%grupa.length;pokaz();});
lb.querySelector('.nast').addEventListener('click',function(){poz=(poz+1)%grupa.length;pokaz();});
document.addEventListener('keydown',function(e){if(!lb.classList.contains('otw'))return;if(e.key==='Escape')zamknij();if(e.key==='ArrowRight'&&grupa.length>1)lb.querySelector('.nast').click();if(e.key==='ArrowLeft'&&grupa.length>1)lb.querySelector('.pop').click();});

/* formularz pokazowy */
var f=document.getElementById('formularz');
f.addEventListener('submit',function(e){e.preventDefault();
  if(f.querySelector('.wyslane'))return;
  var p=document.createElement('p');p.className='wyslane';p.setAttribute('role','status');
  p.textContent='To podgląd - zapytanie nie zostało wysłane. Na docelowej stronie trafi na biuro@1home4you.pl.';
  f.querySelector('.info').before(p);});
})();
