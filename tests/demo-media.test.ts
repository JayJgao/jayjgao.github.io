import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { inspectImage } from "../scripts/lib/image-inspection";
import demosJson from "../src/data/demos.json";
import type { Demo } from "../src/types/demo";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const demoImagesRoot = join(repositoryRoot, "public/assets/images/demos");

const expectedImages = [
  {
    path: "prompt-enhancer/product-overview.webp",
    width: 1920,
    height: 952,
    sha256: "a59c2067e9c846fd57f37b55eee9dde6098f678ef0c0e73d36123eea434415ef",
  },
  {
    path: "reverse-storyboard/image-only-vs-use-video.webp",
    width: 2744,
    height: 1270,
    sha256: "5c9ae9e819b227da1b54811eb3c9288d55f3f10efc6f20e9751ab258c0141a7a",
  },
  {
    path: "reverse-storyboard/product-overview.webp",
    width: 1800,
    height: 1535,
    sha256: "c47698b9f22791d744e699c5f0f90680c9a9b51d9026188e62c3be091e69387e",
  },
  {
    path: "script-to-bgm/slack-results.png",
    width: 2770,
    height: 1656,
    sha256: "e3e518a185f1e23e7d783f187ed8831ee3ca4f7737e9144aca482c02bf4bac17",
  },
  {
    path: "script-to-bgm/workflow-overview.png",
    width: 3274,
    height: 924,
    sha256: "6a3a78e0a90a7c865fd2eceafb94597ce0a85cf49f4f30151790bca0991aa9ba",
  },
  {
    path: "voice-adaptor/audio-routing.webp",
    width: 1149,
    height: 1102,
    sha256: "8db6ab61956ed18d3191fb6375fd0241dc1f4fc8cd0293172761e7f3c3db209d",
  },
  {
    path: "voice-adaptor/product-canvas.webp",
    width: 1920,
    height: 967,
    sha256: "b2e012284c9a2c0058cb981777346e3a98dc3a6d690ae567619a487f0b170b55",
  },
] as const;

const expectedDiagrams = {
  "prompt-enhancer": {
    viewBox: "0 0 1500 840",
    sha256: "4b7aa5bbc9d24f473a179a05c1dbdfae160639aae5286a8f8135f073f0ff9383",
  },
  "prompt-enhance-skills": {
    viewBox: "0 0 1400 410",
    sha256: "a1e1838d13274995e7a41f9c3abfb0ba9ac01f71c65c2630184ededcd643870b",
  },
  "voice-adaptor": {
    viewBox: "0 0 1600 660",
    sha256: "81a2ea1b10f87481b7624fb42467f77c7d8f8a6d0f3f19ab97e92f9a48a1a548",
  },
  "reverse-storyboard": {
    viewBox: "0 0 1400 580",
    sha256: "492e793dcb4826d9c0f96dd6781beb1593abb444dfbfcef9569088322ccb22c9",
  },
  reframer: {
    viewBox: "0 0 1400 540",
    sha256: "6696b1f886fdacdf210ee8db2af1ab29412e33c7c283bd0fc1a3ebb34ddad69f",
  },
  "boundary-deduper": {
    viewBox: "0 0 1400 580",
    sha256: "50ef1d5a556c86d0381b55848128dfcc8c4e314ba6274b8bc1dc97af492584e4",
  },
  "iro-matcher": {
    viewBox: "0 0 1400 620",
    sha256: "63aeaf26d6f9df265db79d07de20a51575e6b8426c976c7cf7bdbee43d3d69a8",
  },
  "loudness-matcher": {
    viewBox: "0 0 1600 840",
    sha256: "8992c2bf1ca8d995a868f88c23398afc43206b4205c87170d7328201e222f888",
  },
  "script-to-bgm": {
    viewBox: "0 0 1520 620",
    sha256: "42a2a2d9b99d1403a93270fc6c6c07efb1dfd7c4ffbce44ec5600c4ec537e7ce",
  },
} as const;

function listFiles(root: string, directory = root): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(root, path) : [relative(root, path)];
  });
}

function sha256(buffer: Uint8Array): string {
  return createHash("sha256").update(buffer).digest("hex");
}

function pngChunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  return Buffer.concat([length, Buffer.from(type, "ascii"), data, Buffer.alloc(4)]);
}

function makePng(width: number, height: number, metadataChunk?: string): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    ...(metadataChunk ? [pngChunk(metadataChunk, Buffer.from("metadata"))] : []),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function webpChunk(type: string, data: Buffer): Buffer {
  const size = Buffer.alloc(4);
  size.writeUInt32LE(data.length);
  return Buffer.concat([
    Buffer.from(type, "ascii"),
    size,
    data,
    ...(data.length % 2 === 1 ? [Buffer.alloc(1)] : []),
  ]);
}

function makeWebp(...chunks: Buffer[]): Buffer {
  const body = Buffer.concat([Buffer.from("WEBP", "ascii"), ...chunks]);
  const size = Buffer.alloc(4);
  size.writeUInt32LE(body.length);
  return Buffer.concat([Buffer.from("RIFF", "ascii"), size, body]);
}

test("inspects PNG IHDR dimensions", () => {
  assert.deepEqual(inspectImage(makePng(3274, 924)), {
    format: "png",
    width: 3274,
    height: 924,
  });
});

test("inspects WebP VP8X dimensions", () => {
  const vp8x = Buffer.alloc(10);
  vp8x.writeUIntLE(1919, 4, 3);
  vp8x.writeUIntLE(951, 7, 3);

  assert.deepEqual(inspectImage(makeWebp(webpChunk("VP8X", vp8x))), {
    format: "webp",
    width: 1920,
    height: 952,
  });
});

test("inspects WebP VP8 dimensions", () => {
  const vp8 = Buffer.alloc(10);
  vp8.set([0x9d, 0x01, 0x2a], 3);
  vp8.writeUInt16LE(2744, 6);
  vp8.writeUInt16LE(1270, 8);

  assert.deepEqual(inspectImage(makeWebp(webpChunk("VP8 ", vp8))), {
    format: "webp",
    width: 2744,
    height: 1270,
  });
});

test("inspects WebP VP8L dimensions", () => {
  const widthMinusOne = 1148;
  const heightMinusOne = 1101;
  const vp8l = Buffer.from([
    0x2f,
    widthMinusOne & 0xff,
    ((widthMinusOne >> 8) & 0x3f) | ((heightMinusOne & 0x03) << 6),
    (heightMinusOne >> 2) & 0xff,
    (heightMinusOne >> 10) & 0x0f,
  ]);

  assert.deepEqual(inspectImage(makeWebp(webpChunk("VP8L", vp8l))), {
    format: "webp",
    width: 1149,
    height: 1102,
  });
});

test("rejects PNG metadata chunks", () => {
  for (const chunk of ["eXIf", "iTXt", "tEXt", "zTXt", "iCCP"]) {
    assert.throws(() => inspectImage(makePng(10, 20, chunk)), new RegExp(chunk));
  }
});

test("rejects WebP metadata chunks", () => {
  const vp8x = Buffer.alloc(10);
  vp8x.writeUIntLE(9, 4, 3);
  vp8x.writeUIntLE(19, 7, 3);

  for (const chunk of ["EXIF", "XMP ", "ICCP"]) {
    assert.throws(
      () =>
        inspectImage(
          makeWebp(webpChunk("VP8X", vp8x), webpChunk(chunk, Buffer.from("metadata"))),
        ),
      new RegExp(chunk.trim()),
    );
  }
});

test("ships exactly the seven approved derivative images with expected bytes and dimensions", () => {
  const actualPaths = listFiles(demoImagesRoot).sort();
  assert.deepEqual(actualPaths, expectedImages.map(({ path }) => path).sort());

  for (const expected of expectedImages) {
    assert.doesNotMatch(
      expected.path,
      /(?:^|[-_.])(raw|original|source|screenshot|screen-shot|img-?\d+|copy|export)(?:[-_.]|$)/i,
    );
    const image = readFileSync(join(demoImagesRoot, expected.path));
    assert.equal(sha256(image), expected.sha256, `${expected.path} bytes must remain unchanged`);
    assert.deepEqual(inspectImage(image), {
      format: expected.path.endsWith(".png") ? "png" : "webp",
      width: expected.width,
      height: expected.height,
    });
  }
});

test("gallery entries preserve exact order, slug paths, dimensions, and factual Korean copy", () => {
  const demos = demosJson as unknown as Demo[];
  const expectedGallery = {
    "prompt-enhancer": [
      ["/assets/images/demos/prompt-enhancer/product-overview.webp", 1920, 952],
    ],
    "prompt-enhance-skills": [],
    "voice-adaptor": [
      ["/assets/images/demos/voice-adaptor/product-canvas.webp", 1920, 967],
      ["/assets/images/demos/voice-adaptor/audio-routing.webp", 1149, 1102],
    ],
    "reverse-storyboard": [
      ["/assets/images/demos/reverse-storyboard/product-overview.webp", 1800, 1535],
      ["/assets/images/demos/reverse-storyboard/image-only-vs-use-video.webp", 2744, 1270],
    ],
    reframer: [],
    "boundary-deduper": [],
    "iro-matcher": [],
    "loudness-matcher": [],
    "script-to-bgm": [
      ["/assets/images/demos/script-to-bgm/workflow-overview.png", 3274, 924],
      ["/assets/images/demos/script-to-bgm/slack-results.png", 2770, 1656],
    ],
  } as const;

  for (const demo of demos) {
    assert.deepEqual(
      demo.gallery.map(({ src, width, height }) => [src, width, height]),
      expectedGallery[demo.slug as keyof typeof expectedGallery],
      `${demo.slug} gallery`,
    );

    for (const image of demo.gallery) {
      assert.ok(image.src.startsWith(`/assets/images/demos/${demo.slug}/`));
      assert.equal(existsSync(join(repositoryRoot, "public", image.src.slice(1))), true);
      assert.equal(image.alt.en, image.alt.ko);
      assert.equal(image.alt.zh, image.alt.ko);
      assert.equal(image.caption.en, image.caption.ko);
      assert.equal(image.caption.zh, image.caption.ko);
    }
  }

  const comparison = demos
    .find(({ slug }) => slug === "reverse-storyboard")
    ?.gallery.find(({ src }) => src.endsWith("image-only-vs-use-video.webp"));
  assert.ok(comparison);
  assert.match(comparison.alt.ko, /IMAGE ONLY/);
  assert.match(comparison.alt.ko, /VS/);
  assert.match(comparison.alt.ko, /USE VIDEO/);
});

test("all nine demo diagrams preserve canonical SVG bytes and viewBoxes", () => {
  const demos = demosJson as unknown as Demo[];
  assert.equal(demos.length, 9);

  for (const demo of demos) {
    const expected = expectedDiagrams[demo.slug as keyof typeof expectedDiagrams];
    assert.ok(expected, `${demo.slug} must have expected diagram facts`);
    assert.equal(demo.diagram, `/assets/diagrams/demos/${demo.slug}.svg`);

    const diagramPath = join(repositoryRoot, "public", demo.diagram.slice(1));
    assert.equal(existsSync(diagramPath), true, `${demo.slug} diagram must exist`);
    const diagram = readFileSync(diagramPath);
    const svg = diagram.toString("utf8");

    assert.equal(sha256(diagram), expected.sha256, `${demo.slug} SVG must be byte-identical`);
    assert.match(svg, new RegExp(`viewBox=["']${expected.viewBox}["']`));
  }
});
