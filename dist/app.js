const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const en = Object.fromEntries($$('[data-i18n]').map(el => [el.dataset.i18n, el.innerHTML]));
const pl = {
  localTitle:"Twój agent. Twój model.",
  localBody:"Plompy Local 0.13.0: gotowe obrazy Dockera dla Codex, Claude Code lub OpenCode. Wybierz model w chmurze lub lokalne Ollama.",
  runLocally:"Uruchom lokalnie",
  connectAgent:"Podłącz swojego agenta",
  localModel:"Użyj lokalnego modelu",
  "journeyYou":"Ty",
  "journeyRequest":"<code>!work 30m</code> Dodaj walidację ilości w API. Pokryj przypadki brzegowe testami.",
  "journeyAccepted":"Zadanie przyjęte. Sprawdzę projekt, przygotuję zmianę i uruchomię testy.",
  "journeySavedQueue":"Zapisane w kolejce.",
  "journeyChooseRunner":"Wybrany przez Ciebie agent",
  "journeyLinuxHost":"Na Twojej maszynie z Linuksem",
  "journeyRepository":"Twoje repozytorium",
  "journeyInstructions":"Twoje instrukcje",
  "journeyBrowser":"Przeglądarka",
  "journeyConnections":"Twoje połączenia",
  "journeyResult":"Dodana walidacja ilości i testy regresji. Wartości ujemne są odrzucane; zero pozostaje poprawne.",
  "journeyResultSaved":"Wynik zapisany. Sesja zachowana.",
  "journeyFollowup":"Super. Teraz zastosuj tę regułę w imporcie.",
  "journeyContinue":"Poznaj narzędzia",
  "oceanTitle":"Mała ryba.<br>Wielkie pomysły.",
  "oceanIntro":"Twoi agenci AI, połączeni z Discordem. Wśród Twoich narzędzi, Twojego kontekstu, na Twojej maszynie.",
  "oceanRelease":"v0.13.0 · Własny serwer. Otwarty kod.",
  "oceanAnywhere":"Ty, z dowolnego miejsca.",
  "oceanMessage":"zbudujmy coś",
  "oceanSpeech":"",
  "oceanFishHint":"przywitaj się",
  "oceanHost":"Na Twojej maszynie z Linuksem",
  "oceanToolNames":"GitHub / Przeglądarka / MCP",
  "oceanReturn":"i z powrotem do Twojego wątku",
  "oceanDive":"Płyń za rybą.<br>Zobacz, jak to działa.",
  "oceanBottomNote":"Mały silnik. Cały ocean możliwości.",
  coffee:"Postaw mi kawę",
  faqHeading:"Warto wiedzieć przed startem.",
  catalogLabel:"Wybierz narzędzie",
  setupPreview:"Podgląd konfiguracji",
  configurationCommand:"Polecenie konfiguracji",
  copySetup:"Kopiuj",
  setupRequirements:"Dodaj integrację, a następnie skonfiguruj wymagane konto, klucz lub lokalne zależności zgodnie z instrukcją.",
  customSetupNote:"Własny serwer? Otwórz menu integracji i podaj jego konfigurację. Może działać lokalnie lub zdalnie.",
  selectedToolGuide:"Instrukcja konfiguracji",
  chooseRunner:"Sprawdź konfigurację dla agenta",
  toolTag0:"Repozytoria i pull requesty",
  toolBody0:"Przeglądaj repozytoria, pracuj ze zgłoszeniami i przygotowuj pull requesty przez osobno skonfigurowane GitHub CLI. Logujesz się własnym kontem.",
  toolTag1:"Automatyzacja przeglądarki",
  toolBody1:"Otwieraj strony, sprawdzaj interfejsy i testuj przepływy w przeglądarce przez MCP. Wymaga opcjonalnych zależności i używa świeżego kontekstu headless.",
  toolTag2:"Przeglądarka na Twojej maszynie",
  toolBody2:"Udostępnij agentowi przeglądarkę przez lokalny serwer MCP. Camoufox wymaga osobno przygotowanej przeglądarki na Linuksie i prywatnego wyświetlacza.",
  toolTag3:"Wyszukiwanie i research",
  toolBody3:"Połącz wyszukiwanie i research z wybranym agentem przez MCP. Wymaga własnego dostępu do API Perplexity.",
  toolTag4:"Treści stron i ekstrakcja",
  toolBody4:"Dodaj zbieranie i ekstrakcję treści stron do narzędzi agenta przez MCP, z własnymi danymi dostępu do usługi.",
  toolTag5:"Automatyzacja stron",
  toolBody5:"Podłącz narzędzia TinyFish MCP do automatyzacji stron. Dostęp do usługi i dane uwierzytelniające zapewniasz samodzielnie.",
  toolTag6:"Oficjalna dokumentacja",
  toolBody6:"Pozwól agentowi korzystać z oficjalnego serwera MCP dokumentacji OpenAI podczas pracy nad projektem.",
  toolTag7:"Dokumentacja bibliotek",
  toolBody7:"Dodaj narzędzia dokumentacji bibliotek Context7 do konfiguracji MCP wybranego agenta.",
  toolTag8:"Analityka produktu: tylko odczyt",
  toolBody8:"Sprawdzaj istniejący projekt PostHog w trybie tylko do odczytu. Ta integracja nie dodaje śledzenia do plompy-engine.",
  toolTag9:"Twoje własne połączenie",
  toolBody9:"Dodaj lokalny lub zdalny serwer MCP z jawną konfiguracją. Rozszerz narzędzia agenta o usługi, którym ufasz.",
  routeTools:'Narzędzia',toolNames:'GitHub / Przeglądarka / Research',contextNames:'Markdown / Pamięć / Git',
  skip:'Przejdź do treści',navHow:'Jak to działa',navTools:'Integracje',navCustom:'Po Twojemu',heroTitle:'Wielkie pomysły.<br>Jedna wiadomość.',heroBody:'Twoi agenci AI, połączeni z Discordem. Na Twojej maszynie. Z Twoimi narzędziami, kontekstem i zasadami.',getStarted:'Uruchom swój silnik',viewSource:'Zobacz kod',release:'v0.13.0 · Otwarty kod, Twoje zasady',fromAnywhere:'Ty, z dowolnego miejsca.',heroMessage:'zbudujmy coś',yourVps:'Twój VPS. Twój silnik.',codingAgents:'Agenci do kodu',yourTools:'Twoje narzędzia',yourContext:'Twój kontekst',selfHosted:'Na własnym Linuksie. Napisany w TypeScript.',scrollExplore:'Przewiń i podążaj za wątkiem',pauseMotion:'Zatrzymaj animacje',
  storyTitle:'Zamknij laptopa.<br>Zachowaj wątek.',storyIntro:'Wiadomość to dopiero początek. Zobacz jej drogę z telefonu na Twoją maszynę i z powrotem.',step1Title:'Pomysł trafia<br>na Discorda.',step1Body:'Wyślij zadanie na prywatnym forum. Plompy sprawdza nadawcę, zapisuje je w trwałej kolejce i rozpoczyna pracę na Twoim Linuksie.',workExplanation:'Cel. Budżet czasu. Przestrzeń do działania.',step2Title:'Twój agent.<br>Cały zestaw narzędzi.',step2Body:'Zapisana sesja agenta korzysta z Twoich instrukcji i kontekstu. Repozytorium, przeglądarka, dokumentacja. Ty wybierasz połączenia.',goalExplanation:'Dodaj osobnego nadzorcę Codex do sprawdzenia zmian.',step3Title:'Wynik wraca.<br>Kontekst zostaje.',step3Body:'Odczytaj wynik w tym samym wątku. Kontynuuj rozmowę w zapisanej sesji. Po przerwaniu pracy sprawdź stan i świadomie wybierz sposób wznowienia.',resultExplanation:'Odczytaj zapisaną odpowiedź bez kolejnego wywołania modelu.',illustrative:'Przykładowy przebieg',scene1:'Wyślij',scene2:'Praca',scene3:'Wynik',
  toolsTitle:'Cały ocean<br>narzędzi.',toolsIntro:'Twoje repozytoria. Przeglądarka. Źródła wiedzy. Połącz używane usługi z wybranym agentem.',integrationGuide:'Zobacz konfigurację integracji',default:'domyślny',experimental:'eksperymentalny',integrationNote:'Jedno menu konfiguracji. Połączenia osobno dla każdego agenta. Własne konta i klucze API.',
  customTitle:'Twój agent.<br>Twój sposób pracy.',customIntro:'Nadaj Plompy’emu osobowość, styl pracy i jasne granice. Jego kontekst to zwykłe pliki Markdown, które możesz czytać, edytować i wersjonować w Git.',browseTemplates:'Przejrzyj szablony workspace',exampleConfig:'Przykładowa konfiguracja',localFiles:'Lokalne pliki. Historia w Git.',
  startTitle:'Trochę konfiguracji.<br>Mnóstwo możliwości.',startIntro:'Zacznij od demonstracji offline. Potem dodaj własnego bota Discord, zalogowanego agenta i maszynę z Linuksem.',offlineDemo:'Wypróbuj demo offline',copy:'Kopiuj',offlineNote:'Przykładowe dane. Bez tokena Discorda i konta modelu. Wymaga Node.js 26.13.0+ (26.x LTS), Gita i Linuksa.',fullSetup:'Połącz swój pierwszy wątek',fullSetupBody:'Bot, agent, uprawnienia. Pełna konfiguracja.',dockerTitle:'Wolisz kontener?',dockerBody:'Ścieżka z Dockerem zawiera Codex.',firstGoal:'Daj mu prawdziwy cel',firstGoalBody:'Wykonawca, recenzent i zmiana do sprawdzenia.',
  faq1Title:'Czy to gotowa usługa AI w chmurze?',faq1Body:'Nie. plompy-engine to oprogramowanie na licencji MIT, które uruchamiasz samodzielnie na Linuksie. Zapewniasz maszynę, bota Discord i dostęp do modelu. VPS to jeden ze sposobów hostowania; zewnętrzne usługi mogą mieć własne opłaty. CLI działa na Twojej maszynie; zapytania do modelu mogą trafiać do zewnętrznego dostawcy.',faq2Title:'Czy mogę korzystać ze wszystkich trzech agentów?',faq2Body:'Codex jest domyślny. Adaptery Claude Code i OpenCode są eksperymentalne i mają inne granice wykonywania zadań. Nadzorowane cele i obrazy wymagają obecnie Codex. Opublikowany obraz Dockera zawiera tylko Codex.',faq3Title:'Co się stanie, jeśli praca zostanie przerwana?',faq3Body:'Przyjęte zadania i wyniki mają trwały zapis. Przerwana praca pozostaje widoczna do sprawdzenia i jawnego wznowienia; niepewne działania zewnętrzne nie są automatycznie powtarzane. Wiadomości wysłane podczas pełnej awarii mogły nie trafić do kolejki. Wersja publiczna korzysta z jednego wspólnego workera.',
  openInvitation:'Otwarty kod. Otwarte zaproszenie.',githubTitle:'Masz pomysł?<br>Narób trochę fal.',githubBody:'Zajrzyj do kodu. Wypróbuj integrację. Zgłoś pomysł. Zbuduj agenta, z którym sam chcesz pracować.',joinGithub:'Wbijaj na GitHuba',footerTagline:'Twoi agenci. Twoja maszyna. Twoje zasady.',docs:'Dokumentacja'
};
const integrations = [
  {name:'GitHub',id:'github',icon:'github',tag:['Repositories & pull requests','Repozytoria i pull requesty'],body:['Inspect repositories, work with issues and prepare pull requests using a dedicated GitHub CLI configuration. You sign in with your own account.','Przeglądaj repozytoria, pracuj ze zgłoszeniami i przygotowuj pull requesty przez osobno skonfigurowane GitHub CLI. Logujesz się własnym kontem.']},
  {name:'Playwright',id:'playwright',icon:'browser',tag:['Browser automation','Automatyzacja przeglądarki'],body:['Navigate pages, inspect interfaces and test browser flows through MCP. Uses pinned optional dependencies and a fresh headless browser context.','Otwieraj strony, sprawdzaj interfejsy i testuj przepływy w przeglądarce przez MCP. Wymaga opcjonalnych zależności i używa świeżego kontekstu headless.']},
  {name:'Camoufox',id:'camoufox',icon:'browser',tag:['A browser on your machine','Przeglądarka na Twojej maszynie'],body:['Give the agent browser tools through a local MCP server. Camoufox uses a separately provisioned Linux browser and private display.','Udostępnij agentowi przeglądarkę przez lokalny serwer MCP. Camoufox wymaga osobno przygotowanej przeglądarki na Linuksie i prywatnego wyświetlacza.']},
  {name:'Perplexity',id:'perplexity',icon:'search',tag:['Search & research','Wyszukiwanie i research'],body:['Connect web search and research tools to the selected runner through MCP. Requires your own Perplexity API access.','Połącz wyszukiwanie i research z wybranym agentem przez MCP. Wymaga własnego dostępu do API Perplexity.']},
  {name:'Firecrawl',id:'firecrawl',icon:'search',tag:['Web content & extraction','Treści stron i ekstrakcja'],body:['Bring web crawling and content extraction into the agent’s toolset through MCP, using your own service credentials.','Dodaj zbieranie i ekstrakcję treści stron do narzędzi agenta przez MCP, z własnymi danymi dostępu do usługi.']},
  {name:'TinyFish',id:'tinyfish',icon:'browser',tag:['Web automation','Automatyzacja stron'],body:['Connect the TinyFish MCP tools for web automation. Service access and credentials are supplied by you.','Podłącz narzędzia TinyFish MCP do automatyzacji stron. Dostęp do usługi i dane uwierzytelniające zapewniasz samodzielnie.']},
  {name:'OpenAI Docs',id:'openai-docs',icon:'book',tag:['Official documentation','Oficjalna dokumentacja'],body:['Let your coding agent consult the official OpenAI documentation MCP server while working on your project.','Pozwól agentowi korzystać z oficjalnego serwera MCP dokumentacji OpenAI podczas pracy nad projektem.']},
  {name:'Context7',id:'context7',icon:'book',tag:['Library documentation','Dokumentacja bibliotek'],body:['Add Context7’s library documentation tools to the chosen runner’s MCP configuration.','Dodaj narzędzia dokumentacji bibliotek Context7 do konfiguracji MCP wybranego agenta.']},
  {name:'PostHog',id:'posthog',icon:'chart',tag:['Read-only product analytics','Analityka produktu: tylko odczyt'],body:['Inspect an existing PostHog project in read-only mode. This integration does not add tracking to plompy-engine.','Sprawdzaj istniejący projekt PostHog w trybie tylko do odczytu. Ta integracja nie dodaje śledzenia do plompy-engine.']},
  {name:'Custom MCP',id:'custom',icon:'plus',tag:['Your own connection','Twoje własne połączenie'],body:['Add a local or remote MCP server with explicit configuration. Extend the tools available to a runner, using services you trust.','Dodaj lokalny lub zdalny serwer MCP z jawną konfiguracją. Rozszerz narzędzia agenta o usługi, którym ufasz.']}
];
const files = {
  soul:{name:'SOUL.md',desc:['A voice you recognize. Set the tone, style and habits you want the agent to bring to its work.','Osobowość, którą rozpoznasz. Ustal ton, styl i nawyki, z którymi agent podejdzie do pracy.'],en:'# How I work\n\nBe direct. Stay curious.\nUse plain language, skip the filler.\n\n## When building\n- Understand the problem first.\n- Prefer a small, focused change.\n- Explain what changed and why.',pl:'# Jak pracuję\n\nMów wprost. Zachowaj ciekawość.\nPisz prosto, bez lania wody.\n\n## Podczas budowania\n- Najpierw zrozum problem.\n- Preferuj małe, konkretne zmiany.\n- Wyjaśnij co i dlaczego się zmieniło.'},
  user:{name:'USER.md',desc:['Make it familiar with you. Name, language, timezone, stack and the work you have authorized.','Niech Cię pozna. Imię, język, strefa czasowa, technologie i zakres zaakceptowanej pracy.'],en:'# About me\n\nName: Alex\nLanguage: English\nTimezone: Europe/Warsaw\n\n## My workflow\n- TypeScript and Node.js\n- Explain the trade-offs.\n- Keep changes inside the project.',pl:'# O mnie\n\nImię: Alex\nJęzyk: polski\nStrefa: Europe/Warsaw\n\n## Mój sposób pracy\n- TypeScript i Node.js\n- Wyjaśniaj kompromisy.\n- Zmieniaj tylko pliki projektu.'},
  policy:{name:'POLICY.md',desc:['Make the boundaries explicit. Define which actions are authorized and which need your approval. Instructions complement the runner’s execution controls.','Określ granice. Zdefiniuj dozwolone działania i te, które wymagają Twojej zgody. Instrukcje uzupełniają mechanizmy kontroli agenta.'],en:'# Working boundaries\n\n## Allowed\n- Read the project and run its tests.\n- Prepare changes for review.\n\n## Ask first\n- Publish or deploy.\n- Delete data or spend money.\n- Send messages to other people.',pl:'# Granice działania\n\n## Dozwolone\n- Czytaj projekt i uruchamiaj testy.\n- Przygotowuj zmiany do przeglądu.\n\n## Najpierw zapytaj\n- Publikacja lub wdrożenie.\n- Usuwanie danych i wydatki.\n- Wysyłanie wiadomości do innych.'},
  memory:{name:'MEMORY.md',desc:['Keep a short durable index. Link longer notes, decisions and working context from your private workspace.','Zachowaj krótki, trwały indeks. Linkuj dłuższe notatki, decyzje i kontekst z prywatnego workspace.'],en:'# Memory index\n\n## Project notes\n- API decisions: memory/api.md\n- Setup notes: memory/setup.md\n\n## Preferences\n- Small pull requests\n- Tests before completion\n- Keep important decisions in Markdown',pl:'# Indeks pamięci\n\n## Notatki projektu\n- Decyzje API: memory/api.md\n- Konfiguracja: memory/setup.md\n\n## Preferencje\n- Małe pull requesty\n- Testy przed zakończeniem\n- Ważne decyzje zapisuj w Markdown'}
};
let lang = location.pathname.startsWith('/pl') ? 'pl' : 'en';
let activeTool = 'github';
let activeRunner = 'codex';
let toolCopyTimer;
let activeFile = 'soul';
let copyTimer;
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let motionOff = motionPreference.matches;
const localized = pair => pair[lang === 'pl' ? 1 : 0];
const escapeHtml = str => str.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function applyLanguage(next) {
  lang = next;
  document.documentElement.lang = lang;
  const dict = lang === 'pl' ? pl : en;
  $$('[data-i18n]').forEach(el => { if (dict[el.dataset.i18n] !== undefined) el.innerHTML = dict[el.dataset.i18n]; });
  $$('.tool-choices').forEach(el=>el.setAttribute('aria-label', localized(['Choose an integration','Wybierz integrację'])));
  $('.runner-options').setAttribute('aria-label', localized(['Coding runner','Agent do kodu']));
  $('nav').setAttribute('aria-label', localized(['Main navigation','Nawigacja główna']));
  $('.language').setAttribute('aria-label',localized(['Language','Język']));
  $('.file-tabs').setAttribute('aria-label',localized(['Agent context files','Pliki kontekstu agenta']));
  renderIntegration(activeTool); renderFile(activeFile); updateMotion();
}
function renderIntegration(id){
  activeTool=id;
  $$('[data-tool]').forEach(button=>{const selected=button.dataset.tool===id;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1});
  $$('[data-panel]').forEach(panel=>{panel.hidden=panel.dataset.panel!==id});
}
function selectRunner(id){
  activeRunner=id;
  $$('[data-runner]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.runner===id)));
  $$('[data-tool-command]').forEach(code=>{const tool=code.dataset.toolCommand;code.textContent='npm run integrations'+(tool==='custom'?'':' -- add '+tool+' --runner '+id+' --yes')});
}
function renderFile(key){
  activeFile=key;const file=files[key];
  $$('[data-file]').forEach(button=>{const selected=button.dataset.file===key;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1});
  $('#file-panel').setAttribute('aria-labelledby',`tab-${key}`);
  $('#file-code').innerHTML=file[lang].split('\n').map(line=>`<span class="code-line ${line.startsWith('#')?'md-heading':line.startsWith('-')?'md-bullet':''}">${escapeHtml(line)||' '}</span>`).join('');
  $('#file-description').innerHTML=`<h3>${file.name}</h3><p>${localized(file.desc)}</p>`;
}
function updateMotion(){
 document.documentElement.dataset.motion=motionOff?'off':'on';
 const button=$('.motion-toggle');button.setAttribute('aria-pressed',String(motionOff));
 $('use',button).setAttribute('href',motionOff?'#i-play':'#i-pause');
 $('span',button).textContent=motionOff?localized(['Enable motion','Włącz animacje']):localized(['Pause motion','Zatrzymaj animacje']);
 document.dispatchEvent(new CustomEvent('plompy:motion-change',{detail:{paused:motionOff}}));
}
$$('[data-tool]').forEach(button=>button.addEventListener('click',()=>renderIntegration(button.dataset.tool)));
$$('[data-runner]').forEach(button=>button.addEventListener('click',()=>selectRunner(button.dataset.runner)));
$('.tool-choices').addEventListener('keydown',event=>{
 const tabs=$$('[data-tool]');let index=tabs.indexOf(document.activeElement);if(index<0)return;
 const step=event.key==='ArrowDown'?2:event.key==='ArrowUp'?-2:event.key==='ArrowRight'?1:event.key==='ArrowLeft'?-1:0;
 if(step)index=(index+step+tabs.length)%tabs.length;else if(event.key==='Home')index=0;else if(event.key==='End')index=tabs.length-1;else return;
 event.preventDefault();renderIntegration(tabs[index].dataset.tool);tabs[index].focus();
});
$$('[data-copy-tool]').forEach(button=>button.addEventListener('click',async()=>{
 const code=$('[data-tool-command="'+button.dataset.copyTool+'"]');
 try{await navigator.clipboard.writeText(code.textContent)}catch{
 const range=document.createRange();range.selectNodeContents(code);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);
 $('#tool-copy-status').textContent=localized(['Select and copy the highlighted command.','Skopiuj zaznaczone polecenie.']);return;
 }
 $$('[data-copy-tool] span').forEach(span=>span.textContent=localized(['Copy','Kopiuj']));
 $('span',button).textContent=localized(['Copied','Skopiowano']);$('#tool-copy-status').textContent=localized(['Configuration command copied.','Skopiowano polecenie konfiguracji.']);
 clearTimeout(toolCopyTimer);toolCopyTimer=setTimeout(()=>{$('span',button).textContent=localized(['Copy','Kopiuj'])},2200);
}));
$$('[data-file]').forEach(button=>button.addEventListener('click',()=>renderFile(button.dataset.file)));
$('.file-tabs').addEventListener('keydown',event=>{
 const tabs=$$('[data-file]');let index=tabs.indexOf(document.activeElement);if(index<0)return;
 if(event.key==='ArrowRight')index=(index+1)%tabs.length;else if(event.key==='ArrowLeft')index=(index-1+tabs.length)%tabs.length;else if(event.key==='Home')index=0;else if(event.key==='End')index=tabs.length-1;else return;
 event.preventDefault();renderFile(tabs[index].dataset.file);tabs[index].focus();
});
$('.motion-toggle').addEventListener('click',()=>{motionOff=!motionOff;updateMotion()});
document.addEventListener('plompy:motion-toggle',()=>{motionOff=!motionOff;updateMotion()});
motionPreference.addEventListener('change',event=>{motionOff=event.matches;updateMotion()});
$('#copy-command').addEventListener('click',async()=>{
 const button=$('#copy-command');const content=$('#install-code').textContent;let success=false;
 try{await navigator.clipboard.writeText(content);success=true}catch{}
 if(!success){const selection=window.getSelection();const range=document.createRange();range.selectNodeContents($('#install-code'));selection.removeAllRanges();selection.addRange(range);$('#copy-status').textContent=localized(['Copy was unavailable. The commands are selected; press Control+C or Command+C.','Kopiowanie niedostępne. Polecenia są zaznaczone; naciśnij Control+C lub Command+C.']);return}
 const message=localized(['Copied','Skopiowano']);$('span',button).textContent=message;$('use',button).setAttribute('href','#i-check');$('#copy-status').textContent=message;
 clearTimeout(copyTimer);copyTimer=setTimeout(()=>{$('span',button).textContent=localized(['Copy','Kopiuj']);$('use',button).setAttribute('href','#i-copy')},2200);
});
applyLanguage(lang);
