"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import type { Locale } from "@/lib/locale";
import { clampPan, clampZoom, type Point } from "@/lib/image-preview";

const labels = {
  ko: { open: "이미지 크게 보기", close: "닫기", fit: "화면에 맞추기", plus: "확대", minus: "축소", help: "확대한 뒤 드래그하거나 방향키로 이동하세요. 두 손가락으로 확대할 수 있습니다." },
  en: { open: "View larger image", close: "Close", fit: "Fit to screen", plus: "Zoom in", minus: "Zoom out", help: "After zooming, drag or use arrow keys to pan. Pinch with two fingers to zoom." },
  zh: { open: "查看大图", close: "关闭", fit: "适应屏幕", plus: "放大", minus: "缩小", help: "放大后可拖动或使用方向键移动，也可双指缩放。" },
};

export function ImagePreview({ src, alt, locale }: { src: string; alt: string; locale: Locale }) {
  const copy = labels[locale];
  const titleId = useId();
  const helpId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, Point>());
  const view = useRef({ zoom: 1, x: 0, y: 0 });
  const [transform, setTransform] = useState(view.current);
  const [open, setOpen] = useState(false);

  function update(zoom: number, point: Point = view.current) {
    const bounded = clampZoom(zoom);
    const box = stage.current?.getBoundingClientRect();
    view.current = { zoom: bounded, ...clampPan(point, bounded, box?.width ?? 0, box?.height ?? 0) };
    setTransform(view.current);
  }
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  function show() {
    update(1, { x: 0, y: 0 });
    pointers.current.clear();
    dialog.current?.showModal();
    setOpen(true);
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    const old = pointers.current.get(event.pointerId);
    if (!old) return;
    const before = [...pointers.current.values()];
    const next = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, next);
    if (before.length === 2) {
      const after = [...pointers.current.values()];
      const distance = (points: Point[]) => Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      const previousDistance = distance(before);
      if (previousDistance > 0) update(view.current.zoom * distance(after) / previousDistance);
    } else {
      update(view.current.zoom, { x: view.current.x + next.x - old.x, y: view.current.y + next.y - old.y });
    }
  }
  return <>
    <button ref={trigger} type="button" className="image-preview-trigger" onClick={show} aria-label={`${copy.open}: ${alt}`} aria-haspopup="dialog">
      <Image src={src} alt={alt} width={1200} height={675} sizes="(max-width: 767px) 100vw, 320px" className="project-detail-image" priority />
      <span>{copy.open} ↗</span>
    </button>
    <dialog ref={dialog} className="image-preview-dialog" aria-labelledby={titleId} aria-describedby={helpId} onClose={() => { setOpen(false); pointers.current.clear(); trigger.current?.focus(); }}>
      <header className="image-preview-toolbar">
        <h2 id={titleId}>{alt}</h2>
        <div>
          <button type="button" onClick={() => update(view.current.zoom - 0.5)} disabled={transform.zoom <= 1} aria-label={copy.minus}>−</button>
          <output aria-live="polite">{Math.round(transform.zoom * 100)}%</output>
          <button type="button" onClick={() => update(view.current.zoom + 0.5)} disabled={transform.zoom >= 4} aria-label={copy.plus}>+</button>
          <button type="button" onClick={() => update(1)} disabled={transform.zoom === 1 && transform.x === 0 && transform.y === 0}>{copy.fit}</button>
          <button type="button" autoFocus onClick={() => dialog.current?.close()}>{copy.close}</button>
        </div>
      </header>
      <div ref={stage} className="image-preview-stage" tabIndex={0} role="group" aria-label={copy.open}
        onPointerDown={event => { if (event.button !== 0) return; event.currentTarget.setPointerCapture(event.pointerId); pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY }); }}
        onPointerMove={move}
        onPointerUp={event => pointers.current.delete(event.pointerId)}
        onPointerCancel={event => pointers.current.delete(event.pointerId)}
        onLostPointerCapture={event => pointers.current.delete(event.pointerId)}
        onKeyDown={event => {
          const offsets: Record<string, Point> = { ArrowLeft: { x: 40, y: 0 }, ArrowRight: { x: -40, y: 0 }, ArrowUp: { x: 0, y: 40 }, ArrowDown: { x: 0, y: -40 } };
          const offset = offsets[event.key];
          if (offset) { event.preventDefault(); update(view.current.zoom, { x: view.current.x + offset.x, y: view.current.y + offset.y }); }
        }}>
        <Image src={src} alt={alt} fill sizes="96vw" draggable={false} style={{ objectFit: "contain", transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})` }} />
      </div>
      <p id={helpId} className="image-preview-help">{copy.help}</p>
    </dialog>
  </>;
}
