import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
const read = (p: string) => readFileSync(p, 'utf8');
const projects = JSON.parse(read('src/data/projects.json'));
const expected: Record<string,string[]> = {
 'cinev-ai-po-leadership':['Web CineV 출시','실험 기능 3건','모델 30종+'],
 'buzzni-aiaas-biz':['MRR 10X','0 → 20명','신규 고객사 12개'],
 'cinev-ai-enablement':['전환율 2.8배','교육·비저닝 13회','R2V 독립 구현'],
 'chroma-awards':['TOP 11 파이널리스트','Element 엔진 개발'],
 'buzzni-shortform-ai':['0→1 출시','본계약 3곳'],
 'solidware-mlaas':['고객 13개사','연매출 2배','15억 원'],
};
test('approved results preserve exact values, order and selected metric',()=>{
 for (const [index,[slug,values]] of Object.entries(expected).entries()) {
  const p=projects.find((p:{slug:string})=>p.slug===slug);
  assert.deepEqual(p.results?.map((r:{value:{ko:string}})=>r.value.ko),values);
  assert.equal(p.showcaseOrder,index+1);
  assert.equal(p.featuredResult,slug==='buzzni-aiaas-biz'?2:0);
  assert.ok(p.results.every((r:{value:Record<string,string>;caption:Record<string,string>})=>['ko','en','zh'].every(l=>r.value[l]&&r.caption[l])));
 }
});
test('company model replaces eras and adds demo shipping boundaries and contacts',()=>{
 assert.ok(projects.every((p:object)=>!('era' in p)));
 const demos=JSON.parse(read('src/data/demos.json'));
 for(const d of demos.filter((d:{productized:boolean})=>d.productized)) assert.equal(d.productStatus,d.slug==='voice-adaptor'?'partial':'shipped');
 for(const l of ['ko','en','zh']) assert.equal(JSON.parse(read(`src/data/resume.${l}.json`)).meta.linkedin,'https://www.linkedin.com/in/jayko-ai/');
});
test('home has shared result band, actionable hero, server career bars and films strip',()=>{
 const hero=read('src/components/home/HeroSection.tsx');
 assert.match(hero,/ResultBand/); assert.match(hero,/copy\.lead\.map/); assert.match(hero,/linkedin/); assert.match(hero,/resume\.pdf/);
 const timeline=read('src/components/home/CareerTimeline.tsx'); assert.doesNotMatch(timeline,/use client|<br/); assert.match(timeline,/career-bars/);
 assert.ok(existsSync('src/components/home/FilmsStrip.tsx'));
 assert.ok(!existsSync('src/components/home/VideoSpotlightCarousel.tsx'));
});
test('case study has result band, small header media, rail, related links and lessons marker',()=>{
 const c=read('src/components/projects/CaseStudy.tsx');
 assert.match(c,/ResultBand/); assert.match(c,/project-detail-rail/); assert.match(c,/data-project-section="results"/); assert.match(c,/project\.links/);
 assert.ok(c.indexOf('project-detail-media')<c.indexOf('</header>'));
 for(const slug of Object.keys(expected)) for(const l of ['ko','en','zh']) {
  const mdx=read(`src/content/projects/${l}/${slug}.mdx`);
  assert.match(mdx,/data-project-section="lessons"/);
  assert.doesNotMatch(mdx,/^## (결과|Results|成果|结果)$/m);
 }
});
test('career periods match company prefixes and bars stop at the build month', async()=>{
 const {getCompanyPeriod,getCareerBars}=await import('../src/lib/career');
 assert.equal(getCompanyPeriod('Cinamon','ko'),'2025.04 - Present');
 assert.equal(getCompanyPeriod('Side Project','ko'),undefined);
 const bars=getCareerBars('ko',2026,10);
 const current=bars.find(b=>b.current)!;
 assert.equal(current.offset,78/99*100);
 assert.equal(current.width,19/99*100);
 const buzzni=bars.find(b=>b.company==='BUZZNI')!;
 assert.equal(buzzni.width,24/99*100);
});
test('company empty states have no era language and partial shipping is consistent',()=>{
 for(const l of ['ko','en','zh']) {
  const x=JSON.parse(read(`src/i18n/${l}.json`));
  assert.doesNotMatch(x.projects.explorer.emptyFeatured+x.projects.explorer.emptyArchive,/Era/);
 }
 for(const name of ['DemoCard','DemoDetail']) assert.match(read(`src/components/demos/${name}.tsx`),/demo\.productStatus === "partial" \? copy\.status\.partial/);
});
test('archive keeps a coherent five-cell desktop grid without overriding mobile at tablet widths',()=>{
 const css=read('src/styles/globals.css');
 const tablet=css.slice(css.indexOf('@media (min-width: 640px)'),css.indexOf('@media (min-width: 1024px)'));
 assert.doesNotMatch(tablet,/\.project-archive-link\s*\{/);
 assert.match(css,/\.project-archive-link\s*\{[^}]*grid-template-columns:\s*2rem minmax\(0, 1fr\)/);
});
