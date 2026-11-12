const dialog = document.querySelector('.search-dialog');
const input = document.querySelector('#docs-search');
const results = document.querySelector('#search-results');
const status = document.querySelector('#search-status');
let indexPromise;
let queryId = 0;
const loadIndex = () => indexPromise ??= fetch('/docs/search-index.json').then(response => {
  if (!response.ok) throw new Error('Search unavailable');
  return response.json();
});
async function search() {
  const id = ++queryId;
  const query = input.value.trim().toLocaleLowerCase();
  results.replaceChildren();
  if (!query) { status.textContent = 'Search titles and guide content.'; return; }
  status.textContent = 'Searching the guide…';
  try {
    const pages = await loadIndex();
    if (id !== queryId) return;
    const words = query.split(/\s+/).filter(Boolean);
    const matches = pages.map(page => {
      const title = page.title.toLocaleLowerCase();
      const body = (page.description + ' ' + page.text).toLocaleLowerCase();
      return {page, score: words.every(word => title.includes(word) || body.includes(word)) ? words.reduce((score,word) => score + (title.includes(word) ? 10 : 1), 0) : 0};
    }).filter(item => item.score).sort((a,b) => b.score-a.score).slice(0,8);
    status.textContent = matches.length ? `${matches.length} ${matches.length===1?'result':'results'}. Use Tab to choose a page.` : 'No results. Try a tool name, OpenCode, browser or credentials.';
    for (const {page} of matches) {
      const li=document.createElement('li'), a=document.createElement('a'), title=document.createElement('strong'), description=document.createElement('p');
      a.href=page.url;title.textContent=page.title;description.textContent=page.description;
      a.append(title,description);li.append(a);results.append(li);
    }
  } catch {if(id===queryId) status.textContent='Search could not load. Use Browse documentation to find a page.';indexPromise=undefined;}
}
const openSearch = () => {if(!dialog.open)dialog.showModal();input.focus();loadIndex().catch(()=>{});};
document.querySelector('.search-open').addEventListener('click',openSearch);
document.querySelector('.search-close').addEventListener('click',()=>dialog.close());
input.addEventListener('input',search);
dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openSearch();}});
input.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){const first=results.querySelector('a');if(first){event.preventDefault();first.focus();}}});
results.addEventListener('keydown',event=>{if(!['ArrowDown','ArrowUp'].includes(event.key))return;const links=[...results.querySelectorAll('a')],i=links.indexOf(document.activeElement);event.preventDefault();if(event.key==='ArrowUp'&&i===0)input.focus();else links[Math.max(0,Math.min(links.length-1,i+(event.key==='ArrowDown'?1:-1)))]?.focus();});
for(const button of document.querySelectorAll('.copy-code'))button.addEventListener('click',async()=>{
  const code=button.closest('.doc-code').querySelector('code').textContent;
  try {await navigator.clipboard.writeText(code);button.textContent='Copied';document.querySelector('#copy-status').textContent='Code example copied.';setTimeout(()=>button.textContent='Copy',1800);}
  catch {document.querySelector('#copy-status').textContent='Copy unavailable. Select the code example and copy it manually.';button.textContent='Select code';}
});
