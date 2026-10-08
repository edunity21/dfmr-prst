const toggle=document.querySelector('.menu');
const nav=document.querySelector('#nav');
function closeMenu(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}
toggle.addEventListener('click',()=>{const expanded=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(expanded));nav.classList.toggle('open',expanded);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();toggle.focus();}});
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){nav.querySelectorAll('a').forEach(a=>{const active=a.getAttribute('href')==='#'+entry.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}});},{rootMargin:'-15% 0px -55% 0px'});document.querySelectorAll('main>section[id]').forEach(s=>observer.observe(s));}

// Preserve ordinary links for local files; hosted pages support inline YouTube playback.
const videoDialog=document.querySelector('.video-dialog');
let videoTrigger=null;
function stopVideo(){videoDialog.querySelector('.video-frame').replaceChildren();}
document.querySelectorAll('[data-video]').forEach(link=>link.addEventListener('click',event=>{
 if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||location.protocol==='file:'||typeof videoDialog.showModal!=='function')return;
 event.preventDefault();videoTrigger=link;
 document.querySelector('#video-title').textContent=link.dataset.title;
 videoDialog.querySelector('.youtube-link').href=link.href;
 const frame=document.createElement('iframe');
 frame.src='https://www.youtube.com/embed/'+encodeURIComponent(link.dataset.video)+'?autoplay=1&rel=0';
 frame.title=link.dataset.title;frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
 frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
 videoDialog.querySelector('.video-frame').replaceChildren(frame);videoDialog.showModal();
}));
videoDialog.querySelector('.video-close').addEventListener('click',()=>videoDialog.close());
videoDialog.addEventListener('close',()=>{stopVideo();videoTrigger?.focus();});
videoDialog.addEventListener('click',event=>{if(event.target===videoDialog){const box=videoDialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)videoDialog.close();}});
document.querySelectorAll('img[data-fallback]').forEach(img=>{const fallback=()=>{img.src=img.dataset.fallback;img.removeAttribute('data-fallback');};img.addEventListener('error',fallback,{once:true});if(img.complete&&img.naturalWidth===0)fallback();});

const imageDialog=document.querySelector('.image-dialog');
let imageTrigger=null;
document.querySelectorAll('[data-full-image]').forEach(link=>link.addEventListener('click',event=>{
 if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||typeof imageDialog.showModal!=='function')return;
 event.preventDefault();imageTrigger=link;
 imageDialog.querySelector('#image-title').textContent=link.dataset.caption;
 const full=imageDialog.querySelector('.full-image');full.src=link.dataset.fullImage;full.alt=link.dataset.caption;
 const canvas=imageDialog.querySelector('.image-canvas');
 canvas.className='image-canvas'+(link.dataset.imageSide?' crop-'+link.dataset.imageSide:'');
 if(link.dataset.imageSide){const size={1:[1506,963],2:[1550,937],3:[1540,981]};const key=link.dataset.fullImage.match(/reference-(\d+)/)?.[1];if(key)canvas.style.aspectRatio=(size[key][0]/2)+' / '+size[key][1];}else{canvas.style.aspectRatio='';}
 imageDialog.showModal();
}));
imageDialog.querySelector('.image-close').addEventListener('click',()=>imageDialog.close());
imageDialog.addEventListener('close',()=>imageTrigger?.focus());
imageDialog.addEventListener('click',event=>{if(event.target===imageDialog){const box=imageDialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)imageDialog.close();}});

// Keep the matching QR when a video thumbnail cannot load.
document.querySelectorAll('.video-thumb').forEach(img=>{
 const unavailable=()=>img.closest('.resource-visual').classList.add('thumbnail-unavailable');
 img.addEventListener('error',unavailable,{once:true});
 if(img.complete&&img.naturalWidth===0)unavailable();
});

// Melody Tree intro film: best available YouTube thumbnail, then in-place playback on hosted pages.
document.querySelectorAll('.film-poster img[data-thumbs]').forEach(img=>{
 const queue=img.dataset.thumbs.split(' ').filter(Boolean);
 const poster=img.closest('.film-poster');
 const next=()=>{const src=queue.shift();if(src)img.src=src;else poster.classList.add('no-thumb');};
 // YouTube answers a missing maxres thumbnail with a 120px placeholder, so treat tiny images as missing.
 const check=()=>{if(img.naturalWidth===0||img.naturalWidth<200)next();};
 img.addEventListener('error',next);img.addEventListener('load',check);
 if(img.complete)check();
});
document.querySelectorAll('[data-inline-video]').forEach(link=>link.addEventListener('click',event=>{
 if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||location.protocol==='file:')return;
 event.preventDefault();
 const frame=document.createElement('iframe');
 frame.src='https://www.youtube.com/embed/'+encodeURIComponent(link.dataset.inlineVideo)+'?autoplay=1&rel=0&playsinline=1';
 frame.title=link.dataset.title;frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
 frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
 link.closest('.film-player')?.classList.add('playing');
 link.replaceWith(frame);frame.focus();
}));
