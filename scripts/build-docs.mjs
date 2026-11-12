import { readFile, writeFile, mkdir, rm, stat } from 'node:fs/promises';
import { resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { createReleaseHistory, releaseMarkdown, releaseIndexHtml, releaseMetadataHtml } from './release-history.mjs';

const projectDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hash = value => createHash('sha256').update(value).digest('hex');
const slugify = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const inside = (base, path) => path === base || path.startsWith(base + sep);
const route = slug => `/docs/${slug ? slug + '/' : ''}`;

function resolveLink(href, source, sources) {
  if (/^(https?:|mailto:)/.test(href) || href.startsWith('#')) return href;
  if (href.startsWith('/')) return href;
  const [path, fragment] = href.split('#');
  const resolved = resolve(dirname(source), path);
  const target = sources.get(resolved);
  if (!target) throw new Error(`Unknown documentation link in ${source}: ${href}`);
  return route(target.slug) + (fragment ? '#' + fragment : '');
}

function inline(value, source, sources) {
  const tokens = [];
  const token = html => `\u0000${tokens.push(html)-1}\u0000`;
  let text = value.replace(/`([^`\n]+)`/g, (_, code) => token(`<code>${escape(code)}</code>`));
  text = text.replace(/\[([^\]\n]+)\]\(([^\s)]+)\)/g, (_, label, href) => token(`<a href="${escape(resolveLink(href,source,sources))}">${escape(label)}</a>`));
  text = escape(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return text.replace(/\u0000(\d+)\u0000/g, (_, n) => tokens[Number(n)]);
}

// A deliberately small, escaped Markdown dialect for this checked-in guide.
// Raw HTML is escaped. An exact <br> in H1 is the only presentation exception.
// No attributes, embeds, scripts or runtime Markdown are accepted.
export function renderMarkdown(markdown, source, sources) {
  const lines = markdown.replace(/\r\n/g,'\n').split('\n');
  const output = [], toc = [], ids = new Set();
  let h1 = 0, paragraph = [];
  const flush = () => {if(paragraph.length) {output.push(`<p>${inline(paragraph.join(' '),source,sources)}</p>`); paragraph=[];}};
  const isTableRule = line => /^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
  const cells = line => line.trim().replace(/^\||\|$/g,'').split('|').map(cell=>cell.trim());
  for(let i=0;i<lines.length;i++) {
    const line=lines[i];
    if(line.startsWith('```')) {
      flush(); const language=line.slice(3).trim(); const code=[];
      while(++i<lines.length && !lines[i].startsWith('```')) code.push(lines[i]);
      if(i===lines.length) throw new Error(`Unclosed code fence: ${source}`);
      output.push(`<div class="doc-code"><div class="code-caption"><span>${escape(language||'text')}</span><button type="button" class="copy-code" aria-label="Copy code example">Copy</button></div><pre tabindex="0"><code>${escape(code.join('\n'))}</code></pre></div>`);
      continue;
    }
    const heading=/^(#{1,3})\s+(.+)$/.exec(line);
    if(heading) {
      flush(); const level=heading[1].length, label=heading[2];
      if(level===1) {h1++;output.push(`<h1>${label.split('<br>').map(part=>inline(part,source,sources)).join('<br>')}</h1>`);continue;}
      let id=slugify(label), base=id, n=2; while(ids.has(id)) id=`${base}-${n++}`;ids.add(id);
      toc.push({level,id,label}); output.push(`<h${level} id="${id}">${inline(label,source,sources)}<a class="heading-anchor" href="#${id}" aria-label="Link to ${escape(label)}">#</a></h${level}>`);continue;
    }
    if(line.includes('|') && i+1<lines.length && isTableRule(lines[i+1])) {
      flush(); const headers=cells(line);i++;const rows=[];
      while(i+1<lines.length && lines[i+1].includes('|') && lines[i+1].trim()) rows.push(cells(lines[++i]));
      if(rows.some(row=>row.length!==headers.length)) throw new Error(`Uneven table: ${source}`);
      output.push(`<div class="doc-table" role="region" aria-label="Comparison table" tabindex="0"><table><thead><tr>${headers.map(x=>`<th scope="col">${inline(x,source,sources)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${inline(x,source,sources)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);continue;
    }
    if(/^- /.test(line)) {
      flush();const items=[line.slice(2)];while(i+1<lines.length && /^- /.test(lines[i+1]))items.push(lines[++i].slice(2));
      output.push(`<ul>${items.map(x=>`<li>${inline(x,source,sources)}</li>`).join('')}</ul>`);continue;
    }
    if(!line.trim()) {flush();continue;}
    paragraph.push(line.trim());
  }
  flush();if(h1!==1)throw new Error(`Expected one H1 in ${source}, found ${h1}`);
  return {html:output.join('\n'),toc};
}

function pageHtml(page, manifest, rendered, origin) {
  const visible = manifest.pages.filter(item=>!item.hiddenFromNav);
  const groups = [...new Set(visible.map(item=>item.group))];
  const nav = groups.map(group=>`<section class="doc-nav-group"><h2>${escape(group)}</h2><ul>${visible.filter(item=>item.group===group).map(item=>`<li><a href="${route(item.slug)}"${item.slug===page.slug?' aria-current="page"':page.release&&item.kind==='release-index'?' aria-current="location"':''}>${escape(item.title)}</a></li>`).join('')}</ul></section>`).join('');
  const index=visible.indexOf(page), previous=page.release ? page.newerRelease : visible[index-1], next=page.release ? page.olderRelease : visible[index+1];
  const toc=rendered.toc.filter(item=>item.level===2).map(item=>`<li><a href="#${item.id}">${escape(item.label)}</a></li>`).join('');
  const canonical=origin+route(page.slug);
  const structured={'@context':'https://schema.org','@type':'TechArticle',headline:page.title,description:page.description,url:canonical,inLanguage:'en',isPartOf:{'@type':'WebSite',name:'Plompy documentation',url:origin+'/docs/'},about:{'@type':'SoftwareApplication',name:page.release||page.kind==='release-index'?'Plompy Engine':'Plompy Local',applicationCategory:'DeveloperApplication',operatingSystem:'Linux containers',...(page.release?{softwareVersion:page.release.version}:{})},...(page.release?{datePublished:page.release.publishedAt}:{})};
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#101515"><title>${escape(page.title)} | Plompy Docs</title><meta name="description" content="${escape(page.description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${escape(canonical)}"><meta property="og:type" content="article"><meta property="og:title" content="${escape(page.title)} | Plompy Docs"><meta property="og:description" content="${escape(page.description)}"><meta property="og:url" content="${escape(canonical)}"><meta property="og:image" content="${origin}/assets/social-preview.jpg"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/favicon.png"><link rel="stylesheet" href="/docs/docs.css"><script src="/docs/docs.js" defer></script><script type="application/ld+json">${JSON.stringify(structured).replaceAll('<','\\u003c')}</script></head>
<body><a class="skip" href="#doc-main">Skip to content</a>
<header class="docs-header"><a class="docs-brand" href="/" aria-label="Plompy home"><img src="/assets/logo.png" alt="" width="48" height="48"><span>plompy-engine<span class="brand-dot">.</span></span></a><a class="docs-home" href="/docs/">Docs</a><button class="search-open" type="button"><span>Search the guide</span><kbd aria-hidden="true">⌘ K</kbd></button><nav aria-label="Project links">${manifest.releaseHistory?'<a href="/docs/releases/">Releases</a>':''}<a href="/">Website</a><a href="https://github.com/dalkedev/plompy-engine">GitHub<span aria-hidden="true"> ↗</span></a></nav></header>
<div class="docs-shell"><aside class="docs-sidebar"><details class="mobile-nav"><summary>Browse documentation</summary><nav aria-label="Documentation">${nav}</nav></details><nav class="desktop-nav" aria-label="Documentation">${nav}</nav><p class="docs-version">${escape(manifest.version)}<span>Source guide · ${escape(manifest.updated)}</span></p></aside>
<main id="doc-main" tabindex="-1"><div class="doc-breadcrumb"><a href="/docs/">Documentation</a><span aria-hidden="true">/</span>${page.release?'<a href="/docs/releases/">Release history</a><span aria-hidden="true">/</span>':''}<span>${escape(page.title)}</span></div><article class="doc-article">${rendered.html}</article><nav class="doc-pager" aria-label="${page.release?'Adjacent releases':'Adjacent documentation'}">${previous?`<a href="${route(previous.slug)}"><small>${page.release?'Newer release':'Previous'}</small><strong>${escape(previous.title)}</strong></a>`:'<span></span>'}${next?`<a href="${route(next.slug)}"><small>${page.release?'Earlier release':'Next'}</small><strong>${escape(next.title)}</strong></a>`:''}</nav><footer class="doc-footer"><span>Keep the thread. Follow the sources.</span><a href="https://buymeacoffee.com/dalkedev">Buy me a coffee ↗</a></footer></main>
<aside class="docs-toc"><div><p>On this page</p><nav aria-label="On this page"><ul>${toc}</ul></nav><a class="doc-top" href="#doc-main">Back to top ↑</a><img src="/assets/logo.png" alt="" width="104" height="104" loading="lazy"></div></aside></div>
<dialog class="search-dialog" aria-labelledby="search-title"><div class="search-top"><h2 id="search-title">Find your next step</h2><button class="search-close" type="button" aria-label="Close search">Close <kbd>Esc</kbd></button></div><label for="docs-search">Search documentation</label><input id="docs-search" type="search" placeholder="Try Codex, Ollama, API key…" autocomplete="off"><p id="search-status" role="status" aria-live="polite">Search titles and guide content.</p><ul id="search-results"></ul></dialog><p id="copy-status" class="sr-only" role="status" aria-live="polite"></p></body></html>\n`;
}

export async function buildDocs({sourceDir,distDir=resolve(projectDir,'dist'),siteUrl='https://plompy.dev'}={}) {
  if(!sourceDir)throw new Error('Supply --docs-source /path/to/plompy-engine/docs/local. Markdown is maintained in the engine repository.');
  sourceDir=resolve(sourceDir);
  const origin=new URL(siteUrl).origin;
  const manifest=JSON.parse(await readFile(resolve(sourceDir,'navigation.json'),'utf8'));
  if(!Array.isArray(manifest.pages)||!manifest.pages.length)throw new Error('No documentation pages.');
  let history, releaseSources;
  const generated = new Map();
  if(manifest.releaseHistory) {
    const [changelog,catalogText] = await Promise.all([readFile(resolve(sourceDir,'../../CHANGELOG.md'),'utf8'),readFile(resolve(sourceDir,'../releases/catalog.json'),'utf8')]);
    history=createReleaseHistory(changelog,JSON.parse(catalogText));
    if(manifest.pages.filter(page=>page.kind==='release-index').length!==1)throw new Error('Release history needs exactly one index.');
    releaseSources={changelog:{source:'CHANGELOG.md',hash:hash(changelog)},catalog:{source:'docs/releases/catalog.json',hash:hash(catalogText)}};
    const releasePages=history.releases.map(release=>({slug:`releases/${release.version}`,source:`releases/version-${release.version.replaceAll('.','-')}.md`,title:`Plompy ${release.version}`,description:`${release.title}. Published ${release.publishedAt.slice(0,10)}. Changes, downloads and version boundaries.`,group:'Releases',hiddenFromNav:true,release}));
    releasePages.forEach((page,index)=>{
      page.newerRelease=releasePages[index-1];page.olderRelease=releasePages[index+1];
      generated.set(page.source,releaseMarkdown(page.release,history));
    });
    manifest.pages.push(...releasePages);
  }
  const sources=new Map();
  for(const page of manifest.pages) {
    if(!/^(?:[a-z0-9]+(?:[-.][a-z0-9]+)*(?:\/[a-z0-9]+(?:[-.][a-z0-9]+)*)*)?$/.test(page.slug)||!/^[a-z0-9/-]+\.md$/.test(page.source))throw new Error('Unsafe documentation route/source.');
    const source=resolve(sourceDir,page.source);if(!inside(sourceDir,source))throw new Error('Source escapes docs root.');
    sources.set(source,page);
  }
  if(new Set(manifest.pages.map(page=>page.slug)).size!==manifest.pages.length)throw new Error('Duplicate route.');
  const prepared=[];
  for(const page of manifest.pages) {
    const source=resolve(sourceDir,page.source), markdown=generated.get(page.source)??await readFile(source,'utf8');
    if(markdown.includes('\u2014'))throw new Error(`Em dash in ${page.source}`);
    const rendered=renderMarkdown(markdown,source,sources);
    if(page.kind==='release-index'&&history) {
      rendered.html+=releaseIndexHtml(history);
      rendered.toc.push({level:2,id:'latest-release',label:`Latest: ${history.current.version}`},{level:2,id:'published-versions',label:'Published versions'},{level:2,id:'history-sources',label:'History sources'});
    }
    if(page.release)rendered.html=releaseMetadataHtml(page.release,history)+rendered.html;
    prepared.push({page,markdown,rendered,html:pageHtml(page,manifest,rendered,origin)});
  }
  // Validate inter-page fragments against the rendered headings before writing.
  const routes=new Map(prepared.map(item=>[route(item.page.slug),new Set(['doc-main',...item.rendered.toc.map(h=>h.id)])]));
  for(const {page,html} of prepared)for(const match of html.matchAll(/<a\b[^>]*\bhref="([^\"]+)"/g)) {
    const url=new URL(match[1].replaceAll('&amp;','&'),origin+route(page.slug));
    if(url.origin!==origin||!url.pathname.startsWith('/docs/'))continue;
    const ids=routes.get(url.pathname);if(!ids)throw new Error(`Broken doc route: ${match[1]}`);
    if(url.hash&&!ids.has(decodeURIComponent(url.hash.slice(1))))throw new Error(`Broken fragment: ${match[1]} in ${page.source}`);
  }
  const docsDir=resolve(distDir,'docs');
  await mkdir(docsDir,{recursive:true});
  let previous;try{previous=JSON.parse(await readFile(resolve(docsDir,'manifest.json'),'utf8'));}catch{}
  for(const old of previous?.pages??[]) if(!manifest.pages.some(p=>p.slug===old.slug)&&/^[a-z0-9]+(?:[-.][a-z0-9]+)*(?:\/[a-z0-9]+(?:[-.][a-z0-9]+)*)*$/.test(old.slug))await rm(resolve(docsDir,old.slug,'index.html'),{force:true});
  const files=[];
  for(const {page,html,markdown}of prepared) {
    const file=resolve(docsDir,page.slug,'index.html');await mkdir(dirname(file),{recursive:true});await writeFile(file,html);
    files.push({slug:page.slug,source:page.release?'CHANGELOG.md':page.source,...(page.release?{version:page.release.version,publicationSource:'docs/releases/catalog.json'}:{}),sourceHash:hash(markdown),htmlHash:hash(html)});
  }
  await writeFile(resolve(docsDir,'search-index.json'),JSON.stringify(prepared.map(({page,markdown})=>({title:page.title,description:page.description,url:route(page.slug),text:markdown.replace(/```[\s\S]*?```/g,' ').replace(/[#|`*\[\]]/g,' ').slice(0,24000)}))));
  const result={version:manifest.version,updated:manifest.updated,origin,source:'dalkedev/plompy-engine/docs/local',...(releaseSources?{releaseSources}:{}),pages:files};
  await writeFile(resolve(docsDir,'manifest.json'),JSON.stringify(result,null,2)+'\n');
  return result;
}

export async function verifyGeneratedDocs(distDir=resolve(projectDir,'dist'), expectedOrigin) {
  let manifest;try{manifest=JSON.parse(await readFile(resolve(distDir,'docs/manifest.json'),'utf8'));}catch(error){if(error.code==='ENOENT')return null;throw error;}
  if(expectedOrigin && manifest.origin!==expectedOrigin)throw new Error('Generated docs origin differs from SITE_URL. Rebuild with --docs-source.');
  for(const page of manifest.pages){const body=await readFile(resolve(distDir,'docs',page.slug,'index.html'),'utf8');if(hash(body)!==page.htmlHash)throw new Error(`Generated docs changed directly: ${page.slug}. Rebuild from engine Markdown.`);}
  for(const asset of ['docs.css','docs.js','search-index.json'])await stat(resolve(distDir,'docs',asset));
  return manifest;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const i=process.argv.indexOf('--docs-source');
  const result=await buildDocs({sourceDir:i>=0?process.argv[i+1]:process.env.PLOMPY_DOCS_SOURCE,siteUrl:process.env.SITE_URL||'https://plompy.dev'});
  console.log(`Built ${result.pages.length} documentation pages from canonical engine Markdown.`);
}
