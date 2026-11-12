import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { buildDocs, renderMarkdown, verifyGeneratedDocs } from './build-docs.mjs';

async function fixture(t){
 const root=await mkdtemp(join(tmpdir(),'plompy-docs-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const source=join(root,'source'),dist=join(root,'dist');await mkdir(source);await mkdir(dist);
 const pages=[{slug:'',source:'introduction.md',title:'Start',description:'Start here',group:'Start'},{slug:'next',source:'next.md',title:'Next',description:'Go next',group:'Start'}];
 await writeFile(join(source,'navigation.json'),JSON.stringify({version:'Test',updated:'2026-11-12',pages}));
 await writeFile(join(source,'introduction.md'),'# Start\n\n[Next](next.md#read)\n\n## Read\n\nText.\n');
 await writeFile(join(source,'next.md'),'# Next\n\n## Read\n\n[Back](introduction.md)\n');
 return {root,source,dist};
}

test('generates linked nested documentation and searchable content from Markdown',async t=>{
 const {source,dist}=await fixture(t);const result=await buildDocs({sourceDir:source,distDir:dist});
 assert.equal(result.pages.length,2);const html=await readFile(join(dist,'docs/index.html'),'utf8');
 assert.match(html,/href="\/docs\/next\/#read"/);assert.match(html,/<title>Start \| Plompy Docs<\/title>/);assert.match(html,/aria-current="page"/);
 const search=JSON.parse(await readFile(join(dist,'docs/search-index.json'),'utf8'));assert.equal(search.length,2);assert.equal(search[1].url,'/docs/next/');
});

test('rejects broken page/fragment links before generating files',async t=>{
 const {source,dist}=await fixture(t);await writeFile(join(source,'next.md'),'# Next\n\n[Bad](introduction.md#missing)\n');
 await assert.rejects(buildDocs({sourceDir:source,distDir:dist}),/Broken fragment/);
 await writeFile(join(source,'next.md'),'# Next\n\n[Bad](missing.md)\n');await assert.rejects(buildDocs({sourceDir:source,distDir:dist}),/Unknown documentation link/);
});

test('escapes raw HTML and code while keeping heading targets unique',()=>{
 const source=resolve('/docs/a.md');const rendered=renderMarkdown('# Title\n\n<script>alert(1)</script>\n\n## Same\n\n## Same\n\n```html\n<img onerror="bad">\n```\n',source,new Map());
 assert.doesNotMatch(rendered.html,/<script>|<img/);assert.match(rendered.html,/&lt;script&gt;/);assert.match(rendered.html,/id="same-2"/);
});

test('refuses source traversal and unsafe link schemes',async t=>{
 const {source,dist}=await fixture(t);await writeFile(join(source,'next.md'),'# Next\n\n[Bad](javascript:alert)\n');await assert.rejects(buildDocs({sourceDir:source,distDir:dist}),/Unknown documentation link/);
 const manifest=JSON.parse(await readFile(join(source,'navigation.json'),'utf8'));manifest.pages[0].source='../escape.md';await writeFile(join(source,'navigation.json'),JSON.stringify(manifest));await assert.rejects(buildDocs({sourceDir:source,distDir:dist}),/Unsafe documentation/);
});

test('detects manual generated-page changes and requires canonical-source rebuild',async t=>{
 const {source,dist}=await fixture(t);await buildDocs({sourceDir:source,distDir:dist});for(const file of ['docs.css','docs.js'])await writeFile(join(dist,'docs',file),'');
 assert.equal((await verifyGeneratedDocs(dist)).pages.length,2);await assert.rejects(verifyGeneratedDocs(dist,'https://different.example'),/origin differs/);await writeFile(join(dist,'docs/index.html'),'edited');await assert.rejects(verifyGeneratedDocs(dist),/Generated docs changed directly/);
});

test('rejects a second H1, unclosed code fences and em dashes',async t=>{
 const {source,dist}=await fixture(t);await writeFile(join(source,'next.md'),'# Next\n\n# Another\n');await assert.rejects(buildDocs({sourceDir:source,distDir:dist}),/Expected one H1/);
 await writeFile(join(source,'next.md'),'# Next\n\n```sh\necho test\n');await assert.rejects(buildDocs({sourceDir:source,distDir:dist}),/Unclosed code fence/);
 await writeFile(join(source,'next.md'),'# Next\n\nWord\u2014word\n');await assert.rejects(buildDocs({sourceDir:source,distDir:dist}),/Em dash/);
});


test('allows an intentional H1 line break while keeping its next word pair together',()=>{
 const rendered=renderMarkdown('# Your agent.<br>A\u00a0little more reach.\n\n## More\n\n<br onclick="bad">\n',resolve('/docs/a.md'),new Map());
 assert.match(rendered.html, /<h1>Your agent\.<br>A\u00a0little more reach\.<\/h1>/);
 assert.match(rendered.html, /&lt;br onclick=&quot;bad&quot;&gt;/);
 assert.doesNotMatch(rendered.html, /<br onclick/);
});
