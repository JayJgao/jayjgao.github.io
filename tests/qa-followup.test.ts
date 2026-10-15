import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import * as projects from '../src/lib/projects';
const read=(path:string)=>readFileSync(path,'utf8');
test('saved company selection survives returning to the project list and rejects obsolete values',()=>{
 const restore=(projects as unknown as {restoreCompanyFilter:(storage:Pick<Storage,'getItem'>)=>string}).restoreCompanyFilter;
 assert.equal(typeof restore,'function');
 assert.equal(restore({getItem:()=> 'BUZZNI'}),'BUZZNI');
 assert.equal(restore({getItem:()=> 'obsolete-company'}),'all');
 assert.equal(restore({getItem:()=> null}),'all');
 assert.equal(restore({getItem:()=>{throw new Error('storage disabled')}}),'all');
});
test('site shell no longer renders reading progress',()=>{
 assert.doesNotMatch(read('src/components/layout/SiteShell.tsx'),/ScrollProgress/);
});
test('approved project demo links are localized and placed before the next subsection',()=>{
 for(const locale of ['ko','en','zh']){
 const source=read(`src/content/projects/${locale}/cinev-ai-po-leadership.mdx`);
 for(const slug of ['prompt-enhancer','voice-adaptor','reverse-storyboard']) {
 const position=source.indexOf(`/${locale}/demos/${slug}/`);
 assert.ok(position > source.indexOf('### Product Integration') || locale === 'zh');
 assert.ok(position < source.lastIndexOf('### '));
 }
 }
 assert.match(read('src/components/demos/DemoDetail.tsx'),/related-project/);
});

test('interview content keeps private experiment details out of public copy',()=>{
 for(const locale of ['ko','en','zh']) {
  const source=read(`src/content/projects/${locale}/cinev-ai-enablement.mdx`);
  assert.match(source,/2\.8/);
  assert.doesNotMatch(source,/71\s*%|25\s*%|20\s*%|유저해시|user.hash/);
  const lunit=read(`src/content/projects/${locale}/lunit-biomarker.mdx`);
  assert.match(lunit,/Medical Device Specification/);
  assert.match(lunit,/Figma/);
 }
 assert.equal(projects.getAllProjects().find(p=>p.slug==='lunit-biomarker')?.contribution,30);
});

test('MDX disclosure text uses ink on its paper background', () => {
 const css = read('src/styles/globals.css');
 const rule = css.match(/\.mdx-content details\s*\{([^}]+)\}/)?.[1];
 assert.ok(rule);
 assert.match(rule, /background:\s*var\(--color-paper\)/);
 assert.match(rule, /color:\s*var\(--color-ink\)/);
});
