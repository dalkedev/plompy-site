(() => {
  const root = document.getElementById('routes');
  const polish = document.documentElement.lang === 'pl';
  const t = (en, pl) => polish ? pl : en;
  const byId = id => document.getElementById(id);
  const map = document.querySelector('.ocean-map');
  const discordMapLabel = map.getAttribute('aria-label');
  const selectors = [...root.querySelectorAll('[data-route-select]')];

  function choose(route) {
    for (const button of selectors) {
      const selected = button.dataset.routeSelect === route;
      button.setAttribute('aria-pressed', String(selected));
      byId(button.getAttribute('aria-controls')).hidden = !selected;
    }
    document.querySelectorAll('[data-ocean-route]').forEach(node => {
      node.hidden = node.dataset.oceanRoute !== route;
    });
    map.setAttribute('aria-label', route === 'discord' ? discordMapLabel : t(
      'Your agent reads a source through Plompy Local and saves a JSON file.',
      'Twój agent odczytuje źródło przez Plompy Local i zapisuje plik JSON.'
    ));
    document.querySelectorAll('[data-route-open]').forEach(link => {
      if (link.dataset.routeOpen === route) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function routeFromHash() {
    return selectors.find(button => '#' + button.getAttribute('aria-controls') === location.hash)?.dataset.routeSelect;
  }

  selectors.forEach(button => button.addEventListener('click', () => {
    choose(button.dataset.routeSelect);
    if (routeFromHash()) history.replaceState(history.state, '', '#' + button.getAttribute('aria-controls'));
  }));
  document.querySelectorAll('[data-route-open]').forEach(link => link.addEventListener('click', event => {
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) choose(link.dataset.routeOpen);
  }));
  window.addEventListener('hashchange', () => {
    const route = routeFromHash();
    if (route) choose(route);
  });

  const read = byId('route-read');
  const readLabel = read.textContent;
  const reset = byId('route-local-reset');
  const output = byId('route-record');
  const localNotice = byId('route-local-notice');
  const empty = byId('route-empty');
  const sample = root.querySelector('.route-source');
  let artifact;

  read.addEventListener('click', () => {
    if (!artifact) {
      const record = {
        title: sample.querySelector('[data-source-title]').textContent,
        source_url: sample.dataset.sourceUrl,
        checked_at: new Date().toISOString(),
      };
      const json = JSON.stringify(record, null, 2) + '\n';
      artifact = new Blob([json], { type: 'application/json;charset=utf-8' });
      output.textContent = json;
      output.hidden = false;
      empty.hidden = true;
      reset.hidden = false;
      read.textContent = t('Download JSON', 'Pobierz JSON');
      localNotice.textContent = t('Record ready. The timestamp is the time you read this sample, in UTC.', 'Rekord gotowy. Znacznik czasu podaje moment odczytu tej próbki w UTC.');
      return;
    }
    const url = URL.createObjectURL(artifact);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plompy-first-result.json';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    localNotice.textContent = t('Download requested: plompy-first-result.json.', 'Rozpoczęto pobieranie pliku plompy-first-result.json.');
  });
  reset.addEventListener('click', () => {
    artifact = null;
    output.textContent = '';
    output.hidden = true;
    empty.hidden = false;
    reset.hidden = true;
    read.textContent = readLabel;
    read.focus();
    localNotice.textContent = t('Ready to read the sample again.', 'Możesz ponownie odczytać próbkę.');
  });

  const advance = byId('route-advance');
  const hold = byId('route-hold');
  const job = byId('route-job');
  const log = byId('route-log');
  const notice = byId('route-discord-notice');
  // Replay the published v0.13.1 recovery fixture. Only the visitor advances it.
  const steps = {
    running: {
      title: job.textContent, log: log.textContent, action: advance.textContent, next: 'failed',
    },
    failed: {
      title: t('The task stopped. A follow-up arrived in the same thread.', 'Zadanie zostało przerwane. W tym samym wątku pojawiła się kolejna wiadomość.'),
      log: '#release · failed · Codex\nsession=saved',
      action: t('Inspect the queue', 'Sprawdź kolejkę'), next: 'inspected',
    },
    inspected: {
      title: t('The worker is idle. One follow-up is waiting for your decision.', 'Agent czeka na decyzję. W kolejce jest jedna wiadomość.'),
      log: '!status\n#release · blocked\n1 queued · 0 running\nsession=saved',
      action: t('Resume the session', 'Wznów sesję'), next: 'recovered',
    },
    paused: {
      title: t('The thread stays blocked. The follow-up is still waiting.', 'Wątek nadal jest zablokowany. Wiadomość czeka w kolejce.'),
      log: '#release · blocked\n1 queued · 0 running\nsession=saved',
      action: t('Resume the session', 'Wznów sesję'), next: 'recovered',
    },
    recovered: {
      title: t('The saved session recovered the note and cancelled the stale follow-up.', 'Silnik wznowił zapisaną sesję, dokończył notkę i anulował nieaktualną wiadomość.'),
      log: '!recover 940000000000000001\n#release · succeeded · Codex\nsession=saved',
      action: t('Replay the task', 'Powtórz zadanie'), next: 'running',
    },
  };
  let state = 'running';
  function showStep(key) {
    state = key;
    const step = steps[key];
    job.textContent = step.title;
    log.textContent = step.log;
    advance.textContent = step.action;
    hold.hidden = key !== 'inspected';
    notice.textContent = step.title;
  }
  advance.addEventListener('click', () => showStep(steps[state].next));
  hold.addEventListener('click', () => {
    showStep('paused');
    advance.focus();
  });

  choose(routeFromHash() || 'local');
  document.documentElement.classList.add('has-route-demo');
})();
