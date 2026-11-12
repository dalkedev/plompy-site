(() => {
  const hero = document.querySelector('.ocean-hero');
  if (!hero) return;
  const fish = hero.querySelector('.ocean-fish');
  const speech = hero.querySelector('.ocean-speech');
  const map = hero.querySelector('.ocean-map');
  if (!fish || !speech || !map) return;

  // The eye-free mascot and its pupils share a transform, so the face stays
  // intact while Plompy swims. Only diagram controls can attract his gaze.
  const eyeLayer = fish.querySelector('.ocean-eyes');
  const pupils = [...fish.querySelectorAll('.ocean-pupil')];
  const eyeCenters = [{ x: 640, y: 637 }, { x: 947, y: 637 }];
  const targets = [...map.querySelectorAll('.ocean-map-link')];
  let hoveredTarget = null;
  let focusedTarget = null;
  let touchedTarget = null;
  let touchTimeout;

  const updateGaze = () => {
    const target = touchedTarget || hoveredTarget || focusedTarget;
    const transform = target && eyeLayer?.getScreenCTM();
    if (!target || !transform) {
      pupils.forEach(pupil => { pupil.style.transform = ''; });
      return;
    }
    const mark = target.querySelector('.ocean-node-icon, .ocean-discord-mark') || target;
    const bounds = mark.getBoundingClientRect();
    const point = new DOMPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
      .matrixTransform(transform.inverse());
    pupils.forEach((pupil, index) => {
      const center = eyeCenters[index];
      const dx = point.x - center.x;
      const dy = point.y - center.y;
      const distance = Math.hypot(dx, dy) || 1;
      const x = center.x + dx / distance * 64 - Number(pupil.getAttribute('cx'));
      const y = center.y + dy / distance * 58 - Number(pupil.getAttribute('cy'));
      pupil.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
    });
  };
  const resetGaze = () => {
    clearTimeout(touchTimeout);
    hoveredTarget = focusedTarget = touchedTarget = null;
    updateGaze();
  };
  targets.forEach(target => {
    target.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      focusedTarget = null;
      hoveredTarget = target;
      updateGaze();
    });
    target.addEventListener('pointerleave', () => {
      if (hoveredTarget === target) hoveredTarget = null;
      updateGaze();
    });
    target.addEventListener('focus', () => {
      if (!target.matches(':focus-visible')) return;
      hoveredTarget = touchedTarget = null;
      focusedTarget = target;
      updateGaze();
    });
    target.addEventListener('blur', () => {
      if (focusedTarget === target) focusedTarget = null;
      updateGaze();
    });
  });
  document.addEventListener('pointerdown', event => {
    const target = targets.find(node => node.contains(event.target));
    clearTimeout(touchTimeout);
    focusedTarget = touchedTarget = null;
    if (event.pointerType === 'touch' && target) {
      hoveredTarget = null;
      touchedTarget = target;
    }
    updateGaze();
  }, { passive: true });
  document.addEventListener('pointerup', () => {
    if (!touchedTarget) return;
    // A short hold makes quick taps readable without delaying link navigation.
    touchTimeout = setTimeout(() => { touchedTarget = null; updateGaze(); }, 600);
  }, { passive: true });
  document.addEventListener('pointercancel', resetGaze, { passive: true });
  window.addEventListener('blur', resetGaze);
  new ResizeObserver(updateGaze).observe(map);
  const isPolish = () => document.documentElement.lang === 'pl';
  fish.setAttribute('aria-label', isPolish() ? 'Przywitaj się z Plompy' : 'Say hello to Plompy');
  map.setAttribute('aria-label', isPolish() ? 'Discord, Plompy na Twoim serwerze i podłączone narzędzia' : 'Discord, Plompy on your server, and your connected tools');
  let visible = true;
  let timeout;
  const sync = () => {
    const paused = !visible || document.hidden;
    hero.dataset.paused = String(paused);
    if (paused) resetGaze();
  };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0 });
  observer.observe(hero);
  document.addEventListener('visibilitychange', sync);
  fish.addEventListener('click', () => {
    clearTimeout(timeout);
    speech.textContent = isPolish() ? 'bul bul. zbudujmy coś.' : 'blub. let’s build something.';
    timeout = setTimeout(() => { speech.textContent = ''; }, 3200);
  });
  sync();
})();
