import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import * as routes from "../src/lib/routes";
import * as career from "../src/lib/career";
test("navigation matches descendants at segment boundaries in every locale", () => {
  const active = (routes as unknown as {isNavigationActive:(path:string,href:string)=>boolean}).isNavigationActive;
  assert.equal(typeof active,"function");
  for(const locale of ["ko","en","zh"]) for(const section of ["projects","demos"]) {
    assert.equal(active(`/${locale}/${section}/example/`,`/${section}`),true);
    assert.equal(active(`/${locale}/${section}`,`/${section}/`),true);
    assert.equal(active(`/${locale}/${section}-other/`,`/${section}`),false);
    assert.equal(active(`/${locale}/${section}/example/`,"/"),false);
  }
  assert.equal(active("/ko/","/"),true);
});
test("career ticks share the bar scale and the axis follows the rows", () => {
  const ticks = (career as unknown as {getCareerTicks:(year:number)=>{year:number;offset:number}[]}).getCareerTicks;
  assert.equal(typeof ticks,"function");
  assert.equal(ticks(2026).length,8);
  assert.deepEqual(ticks(2026)[0],{year:2019,offset:3/99*100});
  const source=readFileSync("src/components/home/CareerTimeline.tsx","utf8");
  assert.ok(source.indexOf('className="career-bars"')<source.indexOf('className="career-axis num"'));
  assert.match(source,/career-period/);
});
test("film portfolio titles do not hardcode a work count",()=>{
  for(const [locale,title] of [["ko","AI 영상 작업 포트폴리오"],["en","AI Film Portfolio"],["zh","AI 影像作品集"]]) assert.equal(JSON.parse(readFileSync(`src/i18n/${locale}.json`,"utf8")).home.films.title,title);
});
