import { Buffer } from "node:buffer";

export type ImageInspection = {
  format: "png" | "webp";
  width: number;
  height: number;
};

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const FORBIDDEN_PNG_CHUNKS = new Set(["eXIf", "iTXt", "tEXt", "zTXt", "iCCP"]);
const FORBIDDEN_WEBP_CHUNKS = new Set(["EXIF", "XMP ", "ICCP"]);

function inspectPng(buffer: Buffer): ImageInspection {
  let offset = PNG_SIGNATURE.length;
  let dimensions: Omit<ImageInspection, "format"> | null = null;

  while (offset + 12 <= buffer.length) {
    const chunkLength = buffer.readUInt32BE(offset);
    const chunkType = buffer.toString("ascii", offset + 4, offset + 8);
    const nextOffset = offset + 12 + chunkLength;

    if (nextOffset > buffer.length) {
      throw new Error(`Truncated PNG ${chunkType || "chunk"}`);
    }
    if (FORBIDDEN_PNG_CHUNKS.has(chunkType)) {
      throw new Error(`Forbidden PNG metadata chunk: ${chunkType}`);
    }
    if (chunkType === "IHDR") {
      if (chunkLength < 8) throw new Error("Invalid PNG IHDR chunk");
      dimensions = {
        width: buffer.readUInt32BE(offset + 8),
        height: buffer.readUInt32BE(offset + 12),
      };
    }

    offset = nextOffset;
    if (chunkType === "IEND") break;
  }

  if (!dimensions || dimensions.width === 0 || dimensions.height === 0) {
    throw new Error("PNG is missing valid IHDR dimensions");
  }
  return { format: "png", ...dimensions };
}

function readUint24LE(buffer: Buffer, offset: number): number {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function inspectVp8x(data: Buffer): Omit<ImageInspection, "format"> {
  if (data.length < 10) throw new Error("Invalid WebP VP8X chunk");
  return {
    width: readUint24LE(data, 4) + 1,
    height: readUint24LE(data, 7) + 1,
  };
}

function inspectVp8(data: Buffer): Omit<ImageInspection, "format"> {
  if (
    data.length < 10 ||
    data[3] !== 0x9d ||
    data[4] !== 0x01 ||
    data[5] !== 0x2a
  ) {
    throw new Error("Invalid WebP VP8 frame header");
  }
  return {
    width: data.readUInt16LE(6) & 0x3fff,
    height: data.readUInt16LE(8) & 0x3fff,
  };
}

function inspectVp8l(data: Buffer): Omit<ImageInspection, "format"> {
  if (data.length < 5 || data[0] !== 0x2f) {
    throw new Error("Invalid WebP VP8L frame header");
  }
  return {
    width: 1 + data[1] + ((data[2] & 0x3f) << 8),
    height: 1 + ((data[2] & 0xc0) >> 6) + (data[3] << 2) + ((data[4] & 0x0f) << 10),
  };
}

function inspectWebp(buffer: Buffer): ImageInspection {
  const declaredEnd = buffer.readUInt32LE(4) + 8;
  if (declaredEnd > buffer.length) throw new Error("Truncated WebP RIFF container");

  let offset = 12;
  let dimensions: Omit<ImageInspection, "format"> | null = null;

  while (offset + 8 <= declaredEnd) {
    const chunkType = buffer.toString("ascii", offset, offset + 4);
    const chunkLength = buffer.readUInt32LE(offset + 4);
    const dataStart = offset + 8;
    const dataEnd = dataStart + chunkLength;

    if (dataEnd > declaredEnd) throw new Error(`Truncated WebP ${chunkType || "chunk"}`);
    if (FORBIDDEN_WEBP_CHUNKS.has(chunkType)) {
      throw new Error(`Forbidden WebP metadata chunk: ${chunkType.trim()}`);
    }

    const data = buffer.subarray(dataStart, dataEnd);
    if (chunkType === "VP8X") dimensions = inspectVp8x(data);
    if (chunkType === "VP8 ") dimensions = inspectVp8(data);
    if (chunkType === "VP8L") dimensions = inspectVp8l(data);

    offset = dataEnd + (chunkLength % 2);
  }

  if (!dimensions || dimensions.width === 0 || dimensions.height === 0) {
    throw new Error("WebP is missing valid image dimensions");
  }
  return { format: "webp", ...dimensions };
}

export function inspectImage(image: Uint8Array): ImageInspection {
  const buffer = Buffer.from(image);

  if (buffer.length >= PNG_SIGNATURE.length && buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    return inspectPng(buffer);
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return inspectWebp(buffer);
  }
  throw new Error("Unsupported image format");
}
