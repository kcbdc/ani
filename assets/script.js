(function(){
  const panels = Array.from(document.querySelectorAll('.panel'));
  const total = panels.length;
  let current = 0;
  let autoTimer = null;
  let playing = false;

  const progressEl = document.getElementById('progress');
  panels.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('on');
    progressEl.appendChild(dot);
  });
  const dots = progressEl.children;

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const playBtn = document.getElementById('playBtn');

  // bubbleSchedule is defined per-page as window.BUBBLE_SCHEDULE = { panelIndex: [[id, delayMs], ...] }
  const bubbleSchedule = window.BUBBLE_SCHEDULE || {};

  function clearBubbles(panelIndex){
    panels[panelIndex].querySelectorAll('.bubble').forEach(b => b.classList.remove('show'));
  }

  function runBubbles(panelIndex){
    const sched = bubbleSchedule[panelIndex];
    if(!sched) return;
    sched.forEach(([id, delay]) => {
      const el = document.getElementById(id);
      if(!el) return;
      setTimeout(() => el.classList.add('show'), delay);
    });
  }

  function showPanel(index){
    panels[current].classList.remove('active');
    clearBubbles(current);
    current = index;
    panels[current].classList.add('active');
    runBubbles(current);

    Array.from(dots).forEach((d, i) => d.classList.toggle('on', i === current));
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;

    if(current === total - 1) stopAuto();
  }

  function next(){
    if(current < total - 1) showPanel(current + 1);
    else stopAuto();
  }
  function prev(){
    if(current > 0) showPanel(current - 1);
  }

  function startAuto(){
    playing = true;
    playBtn.textContent = '⏸ 정지';
    autoTimer = setInterval(next, 3200);
  }
  function stopAuto(){
    playing = false;
    playBtn.textContent = '▶ 자동재생';
    clearInterval(autoTimer);
  }

  prevBtn.addEventListener('click', () => { stopAuto(); prev(); });
  nextBtn.addEventListener('click', () => { stopAuto(); next(); });
  playBtn.addEventListener('click', () => { playing ? stopAuto() : startAuto(); });

  document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowRight'){ stopAuto(); next(); }
    if(e.key === 'ArrowLeft'){ stopAuto(); prev(); }
  });

  showPanel(0);
})();
