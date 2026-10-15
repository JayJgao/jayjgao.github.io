export type Point = { x: number; y: number };
export const clampZoom = (zoom: number) => Math.min(4, Math.max(1, zoom));
export function clampPan(point: Point, zoom: number, width: number, height: number): Point {
  const x = width * (zoom - 1) / 2;
  const y = height * (zoom - 1) / 2;
  return { x: Math.min(x, Math.max(-x, point.x)), y: Math.min(y, Math.max(-y, point.y)) };
}
