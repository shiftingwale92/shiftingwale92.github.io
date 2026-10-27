(function(){
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0, rootMargin: '0px 0px 300px 0px' });
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  var y = document.getElementById('yr'); if (y) y.textContent = String(new Date().getFullYear());
  var back = document.querySelector('#sceneBack svg');
  var frontEl = document.getElementById('sceneFront');
  var lys = Array.from(document.querySelectorAll('.ly'));
  var fys = Array.from(document.querySelectorAll('.fy'));
  var vis = new Set();
  var sio = new IntersectionObserver(function(es){ es.forEach(function(e){ var y = Number(e.target.dataset.y); if (e.isIntersecting) vis.add(y); else vis.delete(y); }); }, { threshold: 0 });
  document.querySelectorAll('.sen').forEach(function(el){ sio.observe(el); });
  document.querySelectorAll('.band').forEach(function(b){ if (back && !b.firstChild) { var c = back.cloneNode(true); c.setAttribute('viewBox', b.dataset.vb || '0 0 1600 900'); c.setAttribute('preserveAspectRatio', 'xMidYMid slice'); c.removeAttribute('style'); b.appendChild(c); } });
  var mx = 0, my = 0, tx = 0, ty = 0, sy = 0, tsy = 0;
  var apply = function(){
    if (vis.size) { tsy = Math.max(0, Math.min.apply(null, Array.from(vis)) - 40); } else { tsy = 1400; }
    sy += (tsy - sy) * 0.08; tx += (mx - tx) * 0.06; ty += (my - ty) * 0.06;
    var p = Math.min(sy / 700, 1);
    if (back) back.style.transform = 'scale(' + (1 + p * 0.12) + ')';
    lys.forEach(function(l){ var k = parseFloat(l.getAttribute('data-k') || '0'); l.style.transform = 'translate(' + (tx * k * 70) + 'px,' + (sy * k * 0.5 + ty * k * 30) + 'px)'; });
    fys.forEach(function(l){ var k = parseFloat(l.getAttribute('data-k') || '0'); l.style.transform = 'translate(' + (tx * k * 110) + 'px,' + (-sy * k * 0.45 + ty * k * 20) + 'px)'; });
    if (frontEl) frontEl.style.opacity = String(1 - p * 0.3);
  };
  var onMove = function(e){ mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5; };
  window.addEventListener('mousemove', onMove, { passive: true });
  var loop = function(){ apply(); requestAnimationFrame(loop); };
  loop();
  var cv = document.getElementById('leaves');
  var ctx = cv ? cv.getContext('2d') : null;
  var leaves = [];
  var cols = ['#c8281f', '#e0402a', '#a31c1c', '#d9532c', '#f2c4cf'];
  var fit = function(){ if (cv) { cv.width = cv.clientWidth || 1200; cv.height = cv.clientHeight || 900; } };
  fit(); window.addEventListener('resize', fit);
  var n = window.innerWidth < 700 ? 14 : 28;
  for (var i = 0; i < n; i++) leaves.push({ x: Math.random() * 1200, y: Math.random() * 900, s: 0.5 + Math.random() * 0.9, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.03, vx: 0.2 + Math.random() * 0.6, vy: 0.4 + Math.random() * 0.9, c: cols[i % cols.length] });
  var leafPath = new Path2D('M0,-12L3,-6L9,-9L7,-2L13,0L7,4L9,10L2,7L0,16L-2,7L-9,10L-7,4L-13,0L-7,-2L-9,-9L-3,-6Z');
  var draw = function(){
    if (ctx && cv) {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.globalAlpha = 0.75;
      leaves.forEach(function(l){
        l.x += l.vx + Math.sin(l.y * 0.01) * 0.4; l.y += l.vy; l.r += l.vr;
        if (l.y > cv.height + 20) { l.y = -20; l.x = Math.random() * cv.width; }
        if (l.x > cv.width + 20) l.x = -20;
        ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.r); ctx.scale(l.s, l.s * Math.cos(l.r * 1.7)); ctx.fillStyle = l.c; ctx.fill(leafPath); ctx.restore();
      });
    }
    requestAnimationFrame(draw);
  };
  draw();
})();
