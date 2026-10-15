import assert from 'node:assert/strict';
import test from 'node:test';
import { clampZoom, clampPan } from '../src/lib/image-preview';
test('preview zoom stays between fitted size and four times size', () => {
 assert.equal(clampZoom(0.4), 1);
 assert.equal(clampZoom(8), 4);
 assert.equal(clampZoom(2.5), 2.5);
});
test('panning cannot move the image completely outside the viewport and resets at fit', () => {
 assert.deepEqual(clampPan({x:800,y:-800},2,400,300),{x:200,y:-150});
 assert.deepEqual(clampPan({x:20,y:30},1,400,300),{x:0,y:0});
});

test('fit control is disabled only when the image is fitted and centered', async () => {
 const { readFileSync } = await import('node:fs');
 const source = readFileSync('src/components/projects/ImagePreview.tsx', 'utf8');
 assert.match(source, /disabled=\{transform\.zoom === 1 && transform\.x === 0 && transform\.y === 0\}/);
 assert.match(source, /fit: "화면에 맞추기"/);
});
