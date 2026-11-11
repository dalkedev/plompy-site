/* Native document scrolling drives the panorama. No wheel or touch hijacking. */
(() => {
  const section = document.querySelector('.journey');
  if (!section) return;
  const scrollArea = section.querySelector('.journey-scroll');
  const viewport = section.querySelector('.journey-window');
  const track = section.querySelector('.journey-track');
  const stages = [...section.querySelectorAll('.journey-stage')];
  const buttons = [...section.querySelectorAll('[data-journey-step]')];
  const motionButton = section.querySelector('[data-journey-motion]');
  const current = section.querySelector('.journey-current');
  const desktop = matchMedia('(min-width: 1000px) and (min-height: 650px) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let horizontal = false, travel = 0, progress = 0, frame = 0, visible = false;
  let selected = -1;
  const clamp = value => Math.min(1, Math.max(0, value));
  const isPaused = () => document.documentElement.dataset.motion === 'off' || (!document.documentElement.dataset.motion && reduced.matches);
  const locale = () => document.documentElement.lang === 'pl';
  const updateSelected = index => {
    if (index === selected) return;
    selected = index;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(index === i)));
    section.dataset.step = String(index);
  };
  function update() {
    frame = 0;
    if (horizontal) {
      progress = clamp(-scrollArea.getBoundingClientRect().top / Math.max(1, travel));
      section.style.setProperty('--journey-x', `${-progress * travel}px`);
      section.style.setProperty('--journey-progress', String(progress));
      section.style.setProperty('--journey-fish-x', `${progress * Math.max(0, current.clientWidth - 68)}px`);
      section.style.setProperty('--journey-fish-angle', `${Math.sin(progress * Math.PI * 4) * 9}deg`);
      updateSelected(Math.round(progress * (stages.length - 1)));
    } else if (visible) {
      let nearest = 0, distance = Infinity;
      stages.forEach((stage, index) => {
        const box = stage.getBoundingClientRect();
        const candidate = Math.abs(box.top + Math.min(box.height / 2, innerHeight / 2) - innerHeight / 2);
        if (candidate < distance) { distance = candidate; nearest = index; }
      });
      updateSelected(nearest);
    }
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  function measure() {
    const oldHorizontal = horizontal;
    const oldBox = scrollArea.getBoundingClientRect();
    const wasInside = oldHorizontal && oldBox.top <= 0 && oldBox.bottom >= innerHeight;
    const retainedProgress = progress;
    horizontal = desktop.matches && !isPaused();
    section.dataset.layout = horizontal ? 'horizontal' : 'vertical';
    motionButton.setAttribute('aria-pressed', String(isPaused()));
    motionButton.querySelector('use').setAttribute('href', isPaused() ? '#i-play' : '#i-pause');
    motionButton.querySelector('span').textContent = isPaused() ? (locale() ? 'Włącz animacje' : 'Enable motion') : (locale() ? 'Zatrzymaj animacje' : 'Pause motion');
    section.querySelector('.journey-stops').setAttribute('aria-label', locale() ? 'Etapy podróży' : 'Journey steps');
    if (horizontal) {
      travel = Math.max(0, track.scrollWidth - viewport.clientWidth);
      section.style.setProperty('--journey-height', `${viewport.clientHeight + travel}px`);
      if (wasInside) window.scrollTo({top: window.scrollY + scrollArea.getBoundingClientRect().top + retainedProgress * travel, behavior:'instant'});
    } else {
      section.style.removeProperty('--journey-height');
      section.style.removeProperty('--journey-x');
      section.style.removeProperty('--journey-fish-x');
      section.style.removeProperty('--journey-fish-angle');
      if (wasInside && oldHorizontal !== horizontal) stages[Math.round(retainedProgress * (stages.length - 1))].scrollIntoView({block:'start',behavior:'instant'});
    }
    schedule();
  }
  function goTo(index, smooth = true) {
    const safeIndex = Math.max(0, Math.min(stages.length - 1, index));
    if (horizontal) {
      const destination = window.scrollY + scrollArea.getBoundingClientRect().top + travel * safeIndex / (stages.length - 1);
      window.scrollTo({top: destination, behavior: smooth && !isPaused() ? 'smooth' : 'instant'});
    } else stages[safeIndex].scrollIntoView({block:'start',behavior:smooth && !isPaused() ? 'smooth' : 'instant'});
    updateSelected(safeIndex);
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => goTo(index));
    button.addEventListener('keydown', event => {
      let target = index;
      if (event.key === 'ArrowRight') target = (index + 1) % buttons.length;
      else if (event.key === 'ArrowLeft') target = (index + buttons.length - 1) % buttons.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = buttons.length - 1;
      else return;
      event.preventDefault(); buttons[target].focus({preventScroll:true}); goTo(target);
    });
  });
  // Focusing a link in a later panel must reveal that panel for keyboard users.
  stages.forEach((stage, index) => stage.addEventListener('focusin', () => { if (horizontal && selected !== index) goTo(index, false); }));
  motionButton.addEventListener('click', () => document.dispatchEvent(new CustomEvent('plompy:motion-toggle')));
  const syncActivity = () => { section.dataset.paused = String(!visible || document.hidden || isPaused()); };
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncActivity(); if (visible) schedule(); }).observe(section);
  new MutationObserver(() => { measure(); syncActivity(); }).observe(document.documentElement, {attributes:true,attributeFilter:['data-motion','lang']});
  desktop.addEventListener('change', measure); reduced.addEventListener('change', measure);
  document.addEventListener('visibilitychange', syncActivity);
  window.addEventListener('scroll', () => { if (visible || horizontal) schedule(); }, {passive:true});
  window.addEventListener('resize', measure);
  new ResizeObserver(() => { if (horizontal && Math.abs(travel - (track.scrollWidth - viewport.clientWidth)) > 1) measure(); }).observe(viewport);
  document.fonts?.ready.then(measure);
  measure(); syncActivity();
})();
