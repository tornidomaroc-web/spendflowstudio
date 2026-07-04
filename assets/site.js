/* SpendFlow Studio - shared motion.
   Opt-in: only runs when <html class="motion-ok"> (set by the inline head
   script when JS is on AND prefers-reduced-motion is not set).
   Every page renders fully without this file; motion is pure enhancement.
   Selectors that a given page doesn't use simply match nothing. */
(function(){
  var docEl = document.documentElement;
  if (!docEl.classList.contains('motion-ok')) return;

  var reveals = [].slice.call(document.querySelectorAll('[data-reveal]'));
  var counts  = [].slice.call(document.querySelectorAll('[data-count-to]'));

  function reveal(el){
    if (el.__shown) return; el.__shown = true;
    var dly = (+el.getAttribute('data-reveal-delay')) || 0;
    el.style.transitionDelay = dly + 'ms';
    el.classList.add('is-revealed');
  }

  function fmt(v, dec){ return dec > 0 ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US'); }
  function runCount(el){
    if (el.__counted) return; el.__counted = true;
    var to  = parseFloat(el.getAttribute('data-count-to'));
    var dec = (+el.getAttribute('data-count-decimals')) || 0;
    var suf = el.getAttribute('data-count-suffix') || '';
    var dur = 1300, t0 = performance.now();
    function step(now){
      var p = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e, dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    setTimeout(function(){ el.textContent = fmt(to, dec) + suf; }, 1500);
  }

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(reveal);
  } else {
    counts.forEach(function(el){ el.textContent = '0' + (el.getAttribute('data-count-suffix') || ''); });

    var ioR = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting){ reveal(en.target); ioR.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function(el){ ioR.observe(el); });

    var ioC = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting){ runCount(en.target); ioC.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -5% 0px' });
    counts.forEach(function(el){ ioC.observe(el); });

    setTimeout(function(){
      var vh = window.innerHeight || 800;
      reveals.forEach(function(el){ var r = el.getBoundingClientRect(); if (!el.__shown && r.top < vh) reveal(el); });
      counts.forEach(function(el){ var r = el.getBoundingClientRect(); if (!el.__counted && r.top < vh) runCount(el); });
    }, 1400);
  }

  // Hero one-time draw + grow (Home only; harmless elsewhere).
  setTimeout(function(){
    [].forEach.call(document.querySelectorAll('[data-draw]'), function(arc){
      var len = parseFloat(arc.getAttribute('data-draw'));
      arc.style.transition = 'none';
      arc.style.strokeDashoffset = len;
      void arc.getBoundingClientRect();
      arc.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.3,.8,.3,1)';
      arc.style.transitionDelay = ((+arc.getAttribute('data-draw-delay')) || 0) + 'ms';
      requestAnimationFrame(function(){ arc.style.strokeDashoffset = '0'; });
    });
    [].forEach.call(document.querySelectorAll('[data-grow]'), function(bar){
      var w = bar.getAttribute('data-grow');
      bar.style.transition = 'none';
      bar.style.width = '0%';
      void bar.getBoundingClientRect();
      bar.style.transition = 'width 1.3s cubic-bezier(.3,.8,.3,1)';
      bar.style.transitionDelay = ((+bar.getAttribute('data-grow-delay')) || 0) + 'ms';
      requestAnimationFrame(function(){ bar.style.width = w; });
    });
  }, 160);
})();
