(() => {
  const hero = document.querySelector('.ocean-hero');
  if (!hero) return;
  const fish = hero.querySelector('.ocean-fish');
  const speech = hero.querySelector('.ocean-speech');
  const map = hero.querySelector('.ocean-map');
  const isPolish = () => document.documentElement.lang === 'pl';
  fish.setAttribute('aria-label', isPolish() ? 'Przywitaj się z Plompy' : 'Say hello to Plompy');
  map.setAttribute('aria-label', isPolish() ? 'Discord, Plompy na Twoim serwerze i podłączone narzędzia' : 'Discord, Plompy on your server, and your connected tools');
  let visible = true;
  let timeout;
  const sync = () => { hero.dataset.paused = String(!visible || document.hidden); };
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
