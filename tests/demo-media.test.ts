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
const demoDiagramsRoot = join(repositoryRoot, "public/assets/diagrams/demos");
const enablementImagesRoot = join(
  repositoryRoot,
  "public/assets/images/projects/cinev/enablement",
);

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

const expectedPromptPreludeDiagram = {
  path: "prompt-enhancer-before-api.svg",
  width: "1400",
  height: "500",
  viewBox: "0 0 1400 500",
  sha256: "96bcc34169f0d54eeb32a7d8d5b1cd916f13058d17d9980790576df7af48a099",
  stages: [
    "개인 프롬프트 노하우",
    "Organization Skill",
    "내부 크리에이터 정성 평가",
    "Prompt Enhancer API 제품화",
  ],
} as const;

const expectedEnablementImages = [
  {
    path: "r2v-user-purpose.webp",
    width: 1600,
    height: 809,
    sha256: "662ca885b4f77acd390ccbd9a84610dc15b883c7950bc56122f9f5ccd5b9dac2",
  },
  {
    path: "r2v-developer-checklist.webp",
    width: 1600,
    height: 809,
    sha256: "6d31545b7c523594e534c5d3292fe2dab623f90cc506d5d218aa5dde9fea80c3",
  },
  {
    path: "ai101-multimodal-translation.webp",
    width: 1600,
    height: 839,
    sha256: "0e116dc2bd6e5ed7979d40f3b796b1822eed1669bec9a14934fa245c8a187ead",
  },
  {
    path: "ai101-training-vs-inference.webp",
    width: 1600,
    height: 839,
    sha256: "f91246d6f8b9a9b5c3d0e18adbb3b5c7cb29d7b8143c23f473c35ec4903f49d5",
  },
  {
    path: "3d-language-gap.webp",
    width: 2200,
    height: 816,
    sha256: "5b22c3c107b4f942c838f01c020da008a144364d940d9dc9d58fd28378ca41f1",
  },
] as const;

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

test("ships only the five approved Enablement evidence images with fixed bytes and dimensions", () => {
  assert.equal(existsSync(enablementImagesRoot), true, "Enablement evidence directory must exist");
  assert.deepEqual(
    listFiles(enablementImagesRoot).sort(),
    expectedEnablementImages.map(({ path }) => path).sort(),
  );

  const hashes = new Set<string>();
  for (const expected of expectedEnablementImages) {
    assert.doesNotMatch(
      expected.path,
      /(?:^|[-_.])(raw|original|source|screenshot|screen-shot|img-?\d+|copy|export)(?:[-_.]|$)/i,
    );

    const image = readFileSync(join(enablementImagesRoot, expected.path));
    const digest = sha256(image);
    hashes.add(digest);
    assert.equal(digest, expected.sha256, `${expected.path} bytes must remain unchanged`);
    assert.deepEqual(inspectImage(image), {
      format: "webp",
      width: expected.width,
      height: expected.height,
    });

    const containerText = image.toString("latin1");
    assert.doesNotMatch(
      containerText,
      /(?:cinev\.github\.io|app\.notion\.com|github\.com\/CINEV|NSIRD_screencaptureui|TemporaryItems|스크린샷)/i,
      `${expected.path} must not retain source URLs, paths, or capture names`,
    );
  }

  assert.equal(hashes.size, expectedEnablementImages.length, "evidence images must be distinct");
});

test("gallery entries preserve exact order, dimensions, and approved localized accessibility copy", () => {
  const demos = demosJson as unknown as Demo[];
  const expectedGallery = {
    "prompt-enhancer": [
      ["/assets/images/demos/prompt-enhancer/product-overview.webp", 1920, 952],
    ],
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
  const expectedEnglishCopy = {
    "prompt-enhancer": [
      [
        "Product screen with multiple storyboard shots built from a prompt and reference images",
        "Storyboard editing screen with Prompt Enhancer applied",
      ],
    ],
    "voice-adaptor": [
      [
        "Product screen with speech separation selected for a video clip on the storyboard canvas",
        "Product entry screen for separating speech and background audio in a video clip",
      ],
      [
        "Audio routing screen connecting background audio and speaker tracks to video clips",
        "Routing screen for reviewing separated background audio and speaker voices by clip",
      ],
    ],
    "reverse-storyboard": [
      [
        "Reverse Storyboard screen arranging representative frames and descriptions of a dragon scene under the night sky in chronological order",
        "Representative frames and timestamps for each shot extracted from a finished video",
      ],
      [
        "Comparison screen showing 9 storyboard shots from the IMAGE ONLY VS USE VIDEO approaches",
        "Side-by-side comparison of a single-image composition and a video-based continuous sequence",
      ],
    ],
    reframer: [],
    "boundary-deduper": [],
    "iro-matcher": [],
    "loudness-matcher": [],
    "script-to-bgm": [
      [
        "n8n workflow screen connecting a Webhook and Slack Trigger to two music generation APIs and a Slack upload",
        "n8n workflow connecting a script to a music prompt and two MP3 results",
      ],
      [
        "Slack screen showing prompts and playable MP3 results from two music models",
        "Slack screen used to listen to MiniMax Music 2 and ElevenLabs Music results",
      ],
    ],
  } as const;
  const expectedChineseCopy = {
    "prompt-enhancer": [
      [
        "基于提示词和引用图像编排多个故事板镜头的产品界面",
        "应用 Prompt Enhancer 的故事板编辑界面",
      ],
    ],
    "voice-adaptor": [
      [
        "在故事板画布中选择视频片段人声分离功能的产品界面",
        "从视频片段中分离人声与背景音乐的产品入口界面",
      ],
      [
        "背景音乐轨和说话人语音轨连接到视频片段的音频路由界面",
        "逐片段检查已分离背景音乐和说话人语音的路由界面",
      ],
    ],
    "reverse-storyboard": [
      [
        "Reverse Storyboard 界面将夜空中的龙场景按时间排列为代表帧和说明",
        "从完成视频中提取的逐镜头代表帧与时间戳",
      ],
      [
        "IMAGE ONLY VS USE VIDEO 模式下 9 个故事板镜头的对比界面",
        "单图构图与基于视频的连续场景并排对比结果",
      ],
    ],
    reframer: [],
    "boundary-deduper": [],
    "iro-matcher": [],
    "loudness-matcher": [],
    "script-to-bgm": [
      [
        "从 Webhook 和 Slack Trigger 连接到两个音乐生成 API，再到 Slack 上传的 n8n 工作流界面",
        "把脚本连接到音乐提示词和两个 MP3 结果的 n8n 工作流",
      ],
      [
        "Slack 界面显示两个音乐模型的提示词和 MP3 播放结果",
        "在 Slack 中试听 MiniMax Music 2 与 ElevenLabs Music 结果的界面",
      ],
    ],
  } as const;

  for (const demo of demos) {
    assert.deepEqual(
      demo.gallery.map(({ src, width, height }) => [src, width, height]),
      expectedGallery[demo.slug as keyof typeof expectedGallery],
      `${demo.slug} gallery`,
    );
    assert.deepEqual(
      demo.gallery.map(({ alt, caption }) => [alt.en, caption.en]),
      expectedEnglishCopy[demo.slug as keyof typeof expectedEnglishCopy],
      `${demo.slug} approved English gallery copy`,
    );
    assert.deepEqual(
      demo.gallery.map(({ alt, caption }) => [alt.zh, caption.zh]),
      expectedChineseCopy[demo.slug as keyof typeof expectedChineseCopy],
      `${demo.slug} approved Chinese gallery copy`,
    );

    for (const image of demo.gallery) {
      assert.ok(image.src.startsWith(`/assets/images/demos/${demo.slug}/`));
      assert.equal(existsSync(join(repositoryRoot, "public", image.src.slice(1))), true);
      assert.ok(image.alt.en.trim());
      assert.ok(image.caption.en.trim());
      assert.ok(image.alt.zh.trim());
      assert.ok(image.caption.zh.trim());
      assert.doesNotMatch(image.alt.en, /[가-힣]|[—–]|--/);
      assert.doesNotMatch(image.caption.en, /[가-힣]|[—–]|--/);
      assert.doesNotMatch(image.alt.zh, /[가-힣]|[—–]|--/);
      assert.doesNotMatch(image.caption.zh, /[가-힣]|[—–]|--/);
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

test("all eight demo diagrams preserve canonical SVG bytes and viewBoxes", () => {
  const demos = demosJson as unknown as Demo[];
  assert.equal(demos.length, 8);
  assert.deepEqual(
    listFiles(demoDiagramsRoot).sort(),
    [
      ...Object.keys(expectedDiagrams).map((slug) => `${slug}.svg`),
      expectedPromptPreludeDiagram.path,
    ].sort(),
  );

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

test("Prompt Enhancer Before the API diagram is public-safe and owns the exact four-stage flow", () => {
  const promptEnhancer = (demosJson as unknown as Demo[]).find(
    ({ slug }) => slug === "prompt-enhancer",
  );
  assert.ok(promptEnhancer?.prelude);
  assert.equal(
    promptEnhancer.prelude.diagram,
    `/assets/diagrams/demos/${expectedPromptPreludeDiagram.path}`,
  );

  const diagramPath = join(
    repositoryRoot,
    "public",
    promptEnhancer.prelude.diagram.slice(1),
  );
  assert.equal(existsSync(diagramPath), true, "Before the API diagram must exist");
  const svg = readFileSync(diagramPath, "utf8");

  assert.equal(sha256(readFileSync(diagramPath)), expectedPromptPreludeDiagram.sha256);
  assert.match(svg, new RegExp(`width=["']${expectedPromptPreludeDiagram.width}["']`));
  assert.match(svg, new RegExp(`height=["']${expectedPromptPreludeDiagram.height}["']`));
  assert.match(svg, new RegExp(`viewBox=["']${expectedPromptPreludeDiagram.viewBox}["']`));
  for (const stage of expectedPromptPreludeDiagram.stages) assert.match(svg, new RegExp(stage));
  assert.doesNotMatch(svg, /<script|<foreignObject|<image\b|(?:xlink:)?href=|url\(\s*https?:/i);
});
