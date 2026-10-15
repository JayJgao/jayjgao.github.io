import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
const read = (path: string) => readFileSync(path, 'utf8');
const root = '/assets/images/projects/buzzni/';
for (const [locale, execution, result, entry] of [
 ['ko', '실행', '결과', '상품 상세페이지'],
 ['en', 'Execution', 'Results', 'product detail page'],
 ['zh', '执行', '成果', '商品详情页'],
]) {
 test(`${locale} chatbot places localized pivot panels and live screen between execution and results`, () => {
  const source = read(`src/content/projects/${locale}/buzzni-chatbot.mdx`);
  const figure = source.match(/<figure className="pivot-figure">([\s\S]*?)<\/figure>/);
  assert.ok(figure);
  assert.match(figure[1], /^\s*<h3 className="pivot-figure__title">[^<]+<\/h3>/);
  const images = [...figure[1].matchAll(/<img src="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(images, [1,2,3].map(n => `${root}buzzni-chatbot-pivot-0${n}-${locale}.webp`).concat(`${root}buzzni-chatbot-shot-01.webp`));
  const start = source.indexOf(figure[0]);
  assert.ok(start > source.indexOf(`## ${execution}\n`));
  assert.ok(start < source.indexOf(`## ${result}\n`));
  assert.ok(source.slice(source.indexOf(`## ${execution}\n`), start).includes(entry));
  assert.doesNotMatch(source.replace(figure[0], ''), /buzzni-chatbot-shot-01/);
  assert.doesNotMatch(source, /—/);
  if (locale === 'ko') assert.doesNotMatch(source.split('## 문제')[1].split('## 접근')[0], /10%/);
 });
}
test('all nine localized pivot figures are manifested and present', () => {
 const manifest = JSON.parse(read('src/data/asset-manifest.json'));
 const figures = manifest.projects.find((p: {slug: string}) => p.slug === 'buzzni-chatbot').figures;
 assert.deepEqual(figures, ['ko','en','zh'].flatMap(locale => [1,2,3].map(n => `${root}buzzni-chatbot-pivot-0${n}-${locale}.webp`)));
 for (const path of figures) assert.ok(existsSync(`public${path}`), path);
});
test('shopping assistant replaces Solidware MLaaS as sixth featured project', () => {
 const projects = JSON.parse(read('src/data/projects.json'));
 const chatbot = projects.find((p: {slug:string}) => p.slug === 'buzzni-chatbot');
 const solidware = projects.find((p: {slug:string}) => p.slug === 'solidware-mlaas');
 assert.equal(chatbot.featured, true);
 assert.equal(chatbot.showcaseOrder, 6);
 assert.equal(solidware.featured, false);
 assert.equal(solidware.showcaseOrder, null);
 assert.equal(projects.filter((p: {featured:boolean}) => p.featured).length, 6);
});

test('featured chatbot card renders approved copy without replacing its detail title', async () => {
 const React = await import('react');
 const { renderToStaticMarkup } = await import('react-dom/server');
 const { ProjectCard } = await import('../src/components/projects/ProjectCard');
 const { getProjectBySlug } = await import('../src/lib/projects');
 const project = getProjectBySlug('buzzni-chatbot')!;
 const previous = Object.getOwnPropertyDescriptor(globalThis, 'React');
 Object.defineProperty(globalThis, 'React', { value: React, configurable: true });
 try {
  const html = renderToStaticMarkup(React.createElement(ProjectCard, { project, locale: 'ko', variant: 'featured' }));
  for (const copy of ['유저 데이터 기반 제품 개선','상품 구매 여정에서 의사결정을 보좌하는 쇼핑 어시스턴트 챗봇','자사 데이터 기반 쇼핑 챗봇 SaaS','0→1 제품 출시, 홈쇼핑사 2곳 본계약']) assert.ok(html.includes(copy), copy);
  assert.equal(project.title.ko, '이커머스 쇼핑 어시스턴트 챗봇');
 } finally {
  if (previous) Object.defineProperty(globalThis, 'React', previous);
  else Reflect.deleteProperty(globalThis, 'React');
 }
});
