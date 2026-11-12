import { readFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyGeneratedDocs } from './build-docs.mjs';
const dist=resolve(dirname(fileURLToPath(import.meta.url)),'../dist');
const manifest=await verifyGeneratedDocs(dist);
if(!manifest?.pages.length)throw new Error('Documentation has not been generated.');
let checked=0;
const knownIds=new Map();
const pages=[{slug:null,file:'index.html'},{slug:null,file:'pl/index.html'},...manifest.pages.map(page=>({...page,file:`docs/${page.slug? page.slug+'/':''}index.html`}))];
for(const page of pages){
  const html=await readFile(resolve(dist,page.file),'utf8');
  const ids=[...html.matchAll(/\bid="([^\"]+)"/g)].map(match=>match[1]);
  if(new Set(ids).size!==ids.length)throw new Error(`Duplicate IDs: ${page.file}`);
  const url='https://plompy.dev/'+page.file.replace(/index\.html$/,'');knownIds.set(new URL(url).pathname,new Set(ids));
}
for(const page of pages){
  const html=await readFile(resolve(dist,page.file),'utf8');
  if((html.match(/<h1(?:\s|>)/g)??[]).length!==1)throw new Error(`Expected one H1: ${page.file}`);
  if(page.slug!==null){
    if(!/<html lang="en"/.test(html)||!html.includes('rel="canonical"')||!html.includes('name="description"'))throw new Error(`Missing SEO: ${page.file}`);
    if(html.includes('\u2014'))throw new Error(`Em dash: ${page.file}`);
    if(!html.includes('aria-label="Documentation"')||!html.includes('aria-label="On this page"'))throw new Error(`Missing navigation: ${page.file}`);
  }
  for(const match of html.matchAll(/\b(?:href|src)="([^\"]+)"/g)){
    const value=match[1].replaceAll('&amp;','&');
    if(/^(https?:|mailto:|data:)/.test(value))continue;
    const url=new URL(value,'https://plompy.dev/'+page.file.replace(/index\.html$/,''));
    const file=resolve(dist,'.'+url.pathname+(url.pathname.endsWith('/')?'index.html':''));
    await stat(file).catch(()=>{throw new Error(`Missing local asset/link ${value} from ${page.file}`);});
    if(url.hash&&knownIds.has(url.pathname)&&!knownIds.get(url.pathname).has(decodeURIComponent(url.hash.slice(1))))throw new Error(`Missing fragment ${value} from ${page.file}`);
    checked++;
  }
}
const search=JSON.parse(await readFile(resolve(dist,'docs/search-index.json'),'utf8'));
if(search.length!==manifest.pages.length)throw new Error('Incomplete search index.');
const sitemap=await readFile(resolve(dist,'sitemap.xml'),'utf8');
for(const page of manifest.pages){const route=`https://plompy.dev/docs/${page.slug?page.slug+'/':''}`;if(!sitemap.includes(`<loc>${route}</loc>`))throw new Error(`Missing sitemap route: ${route}`);}
console.log(`PASS: ${manifest.pages.length} docs pages, ${checked} local links/assets, heading IDs, metadata, search index and sitemap.`);
