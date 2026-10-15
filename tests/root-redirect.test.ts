import assert from "node:assert/strict";
import test from "node:test";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import RootRedirectPage from "../src/app/(redirect)/page";

test("root HTML immediately redirects to Korean without JavaScript or language preferences", () => {
  // tsx uses the classic JSX runtime for this project's jsx: preserve setting.
  const previousReact = Object.getOwnPropertyDescriptor(globalThis, "React");
  Object.defineProperty(globalThis, "React", { value: React, configurable: true });
  let html: string;
  try {
    html = renderToStaticMarkup(React.createElement(RootRedirectPage));
  } finally {
    if (previousReact) Object.defineProperty(globalThis, "React", previousReact);
    else Reflect.deleteProperty(globalThis, "React");
  }

  assert.match(html, /<meta[^>]*http-equiv="refresh"[^>]*content="0;url=\/ko\/"/);
  assert.doesNotMatch(html, /Choose a language/);
  for (const locale of ["ko", "en", "zh"]) {
    assert.match(html, new RegExp(`href="/${locale}/?"`));
  }
});
