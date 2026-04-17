import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Nation } from '../types';

interface Props {
  slug: string;
  mapName: string;
  mapWidth: number;
  mapHeight: number;
  thumbnailSrc: string;
  nations?: Nation[];
  base: string;
  launchLabel?: string;
  clearConfirm?: string;
}

type Tool = 'pen' | 'eraser' | 'text';

type Point = { x: number; y: number };

type StrokeAction = {
  kind: 'stroke';
  tool: 'pen' | 'eraser';
  color: string;
  widthRatio: number;
  points: Point[];
};

type LabelAction = {
  kind: 'label';
  x: number;
  y: number;
  text: string;
  color: string;
  fontSizeRatio: number;
};

type Action = StrokeAction | LabelAction;

const COLORS = ['#ef4444', '#facc15', '#34d399', '#38bdf8', '#ffffff'];
const WIDTHS = [3, 6, 12];
const FONT_SIZES = [16, 22, 32];

export default function MapDrawingOverlay({
  mapName,
  mapWidth,
  mapHeight,
  thumbnailSrc,
  nations,
  base,
  launchLabel = 'Draw on map',
  clearConfirm = 'Clear all annotations?',
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState(COLORS[0]);
  const [widthIdx, setWidthIdx] = useState(1);
  const [showNations, setShowNations] = useState(true);
  const [actions, setActions] = useState<Action[]>([]);
  const [redoStack, setRedoStack] = useState<Action[]>([]);
  const [labelInput, setLabelInput] = useState<{ x: number; y: number; text: string } | null>(null);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const activeStrokeRef = useRef<StrokeAction | null>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof document === 'undefined') return 'dark';
    return (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') || 'dark';
  });

  const resolvedSrc = useMemo(() => {
    if (theme === 'dark' && thumbnailSrc.includes('/thumbnails/')) {
      return thumbnailSrc.replace('/thumbnails/', '/thumbnails-dark/');
    }
    return thumbnailSrc;
  }, [thumbnailSrc, theme]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const el = document.documentElement;
    const obs = new MutationObserver(() => {
      const t = (el.getAttribute('data-theme') as 'dark' | 'light') || 'dark';
      setTheme(t);
    });
    obs.observe(el, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const strokeWidth = WIDTHS[widthIdx];
  const fontSize = FONT_SIZES[widthIdx];

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setLabelInput(null);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (labelInput) {
          setLabelInput(null);
        } else {
          close();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, labelInput]);

  // Compute the stage size (contained within viewport minus toolbar), preserving aspect ratio.
  useLayoutEffect(() => {
    if (!isOpen) return;
    const compute = () => {
      const padding = 24;
      const toolbar = 64;
      const availW = Math.max(200, window.innerWidth - padding * 2);
      const availH = Math.max(200, window.innerHeight - toolbar - padding * 2);
      const ratio = mapWidth / mapHeight;
      let w = availW;
      let h = w / ratio;
      if (h > availH) {
        h = availH;
        w = h * ratio;
      }
      setStageSize({ width: Math.floor(w), height: Math.floor(h) });
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [isOpen, mapWidth, mapHeight]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = stageSize;
    if (width === 0 || height === 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const drawStroke = (a: StrokeAction) => {
      if (a.points.length === 0) return;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = a.widthRatio * width;
      ctx.strokeStyle = a.color;
      ctx.globalCompositeOperation = a.tool === 'eraser' ? 'destination-out' : 'source-over';
      ctx.beginPath();
      const [first, ...rest] = a.points;
      ctx.moveTo(first.x * width, first.y * height);
      if (rest.length === 0) {
        ctx.lineTo(first.x * width + 0.01, first.y * height + 0.01);
      } else {
        for (const p of rest) ctx.lineTo(p.x * width, p.y * height);
      }
      ctx.stroke();
      ctx.restore();
    };

    const drawLabel = (a: LabelAction) => {
      ctx.save();
      const px = a.fontSizeRatio * width;
      ctx.font = `bold ${px}px "Space Grotesk", system-ui, sans-serif`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      ctx.lineWidth = Math.max(2, px * 0.18);
      ctx.strokeStyle = 'rgba(0,0,0,0.75)';
      ctx.fillStyle = a.color;
      ctx.strokeText(a.text, a.x * width, a.y * height);
      ctx.fillText(a.text, a.x * width, a.y * height);
      ctx.restore();
    };

    for (const a of actions) {
      if (a.kind === 'stroke') drawStroke(a);
      else drawLabel(a);
    }
    if (activeStrokeRef.current) drawStroke(activeStrokeRef.current);
  }, [actions, stageSize]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  useEffect(() => {
    if (labelInput && inputRef.current) {
      const el = inputRef.current;
      requestAnimationFrame(() => {
        el.focus();
        el.select();
      });
    }
  }, [labelInput?.x, labelInput?.y]);

  const pointFromEvent = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = rect.width > 0 ? (e.clientX - rect.left) / rect.width : 0;
    const y = rect.height > 0 ? (e.clientY - rect.top) / rect.height : 0;
    return {
      x: Math.min(1, Math.max(0, x)),
      y: Math.min(1, Math.max(0, y)),
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const p = pointFromEvent(e);
    if (tool === 'text') {
      e.preventDefault();
      if (labelInput) commitLabel();
      setLabelInput({ x: p.x, y: p.y, text: '' });
      return;
    }
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    const refW = stageSize.width || 1;
    const widthPx = tool === 'eraser' ? strokeWidth * 2.5 : strokeWidth;
    activeStrokeRef.current = {
      kind: 'stroke',
      tool: tool === 'eraser' ? 'eraser' : 'pen',
      color,
      widthRatio: widthPx / refW,
      points: [p],
    };
    redraw();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeStrokeRef.current) return;
    const p = pointFromEvent(e);
    activeStrokeRef.current.points.push(p);
    redraw();
  };

  const finishStroke = () => {
    const stroke = activeStrokeRef.current;
    activeStrokeRef.current = null;
    if (!stroke) return;
    setActions((prev) => [...prev, stroke]);
    setRedoStack([]);
  };

  const onPointerUp = () => finishStroke();
  const onPointerCancel = () => finishStroke();

  const commitLabel = () => {
    if (!labelInput) return;
    const text = labelInput.text.trim();
    if (text.length > 0) {
      const refW = stageSize.width || 1;
      const action: LabelAction = {
        kind: 'label',
        x: labelInput.x,
        y: labelInput.y,
        text,
        color,
        fontSizeRatio: fontSize / refW,
      };
      setActions((prev) => [...prev, action]);
      setRedoStack([]);
    }
    setLabelInput(null);
  };

  const undo = () => {
    setActions((prev) => {
      if (prev.length === 0) return prev;
      const next = prev.slice(0, -1);
      const popped = prev[prev.length - 1];
      setRedoStack((r) => [...r, popped]);
      return next;
    });
  };

  const redo = () => {
    setRedoStack((prev) => {
      if (prev.length === 0) return prev;
      const next = prev.slice(0, -1);
      const popped = prev[prev.length - 1];
      setActions((a) => [...a, popped]);
      return next;
    });
  };

  const clearAll = () => {
    if (actions.length === 0 && redoStack.length === 0) return;
    if (window.confirm(clearConfirm)) {
      setActions([]);
      setRedoStack([]);
    }
  };

  const nationMarkers = useMemo(() => {
    if (!nations || !showNations || stageSize.width === 0) return null;
    return (
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        {nations.map((nation, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${(nation.x / mapWidth) * 100}%`,
              top: `${(nation.y / mapHeight) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {nation.flag ? (
              <img
                src={`${base}flags/${nation.flag}.svg`}
                alt=""
                style={{
                  width: 20,
                  height: 14,
                  borderRadius: 3,
                  border: '1.5px solid rgba(255,255,255,0.7)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : (
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: 'var(--accent-primary)',
                  border: '1.5px solid rgba(255,255,255,0.85)',
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  }, [nations, showNations, stageSize, mapWidth, mapHeight, base]);

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="draw-launch-btn"
        aria-label={`Draw on ${mapName}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          width={16}
          height={16}
          aria-hidden="true"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
        <span>{launchLabel}</span>
      </button>

      {isOpen && (
        <div
          className="draw-overlay-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Drawing on ${mapName}`}
        >
          <div className="draw-toolbar">
            <div className="draw-toolbar-group">
              <button
                type="button"
                className={`draw-tool-btn ${tool === 'pen' ? 'is-active' : ''}`}
                onClick={() => setTool('pen')}
                aria-label="Pen"
                aria-pressed={tool === 'pen'}
                title="Pen"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </button>
              <button
                type="button"
                className={`draw-tool-btn ${tool === 'eraser' ? 'is-active' : ''}`}
                onClick={() => setTool('eraser')}
                aria-label="Eraser"
                aria-pressed={tool === 'eraser'}
                title="Eraser"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
                  <path d="M20 20H9l-6-6a2 2 0 0 1 0-2.83l9.17-9.17a2 2 0 0 1 2.83 0l6.83 6.83a2 2 0 0 1 0 2.83L13 20" />
                  <line x1="14" y1="7" x2="17" y2="10" />
                </svg>
              </button>
              <button
                type="button"
                className={`draw-tool-btn ${tool === 'text' ? 'is-active' : ''}`}
                onClick={() => setTool('text')}
                aria-label="Text label"
                aria-pressed={tool === 'text'}
                title="Text label"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
                  <polyline points="4 7 4 4 20 4 20 7" />
                  <line x1="9" y1="20" x2="15" y2="20" />
                  <line x1="12" y1="4" x2="12" y2="20" />
                </svg>
              </button>
            </div>

            <div className="draw-toolbar-sep" />

            <div className="draw-toolbar-group" aria-label="Colors">
              {COLORS.map((c) => {
                const active = tool !== 'eraser' && color === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setColor(c);
                      if (tool === 'eraser') setTool('pen');
                    }}
                    className={`draw-color-swatch ${active ? 'is-active' : ''}`}
                    style={{ background: c }}
                    aria-label={`Color ${c}`}
                    aria-pressed={active}
                  />
                );
              })}
            </div>

            <div className="draw-toolbar-sep" />

            <div className="draw-toolbar-group" aria-label="Size">
              {WIDTHS.map((w, i) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWidthIdx(i)}
                  className={`draw-size-btn ${widthIdx === i ? 'is-active' : ''}`}
                  aria-label={`Size ${w}`}
                  aria-pressed={widthIdx === i}
                >
                  <span
                    className="draw-size-dot"
                    style={{
                      width: w + 4,
                      height: w + 4,
                      background: tool === 'eraser' ? 'rgba(255,255,255,0.85)' : color,
                    }}
                  />
                </button>
              ))}
            </div>

            <div className="draw-toolbar-sep" />

            <div className="draw-toolbar-group">
              <button
                type="button"
                className="draw-tool-btn"
                onClick={undo}
                disabled={actions.length === 0}
                aria-label="Undo"
                title="Undo"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
                  <path d="M3 7v6h6" />
                  <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6.7 3L3 13" />
                </svg>
              </button>
              <button
                type="button"
                className="draw-tool-btn"
                onClick={redo}
                disabled={redoStack.length === 0}
                aria-label="Redo"
                title="Redo"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
                  <path d="M21 7v6h-6" />
                  <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6.7 3L21 13" />
                </svg>
              </button>
              <button
                type="button"
                className="draw-tool-btn"
                onClick={clearAll}
                aria-label="Clear all"
                title="Clear all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
              </button>
            </div>

            {nations && nations.length > 0 && (
              <>
                <div className="draw-toolbar-sep" />
                <button
                  type="button"
                  className={`draw-tool-btn ${showNations ? 'is-active' : ''}`}
                  onClick={() => setShowNations((v) => !v)}
                  aria-pressed={showNations}
                  aria-label="Toggle nation markers"
                  title="Toggle nation markers"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </>
            )}

            <div style={{ flex: 1 }} />

            <button
              type="button"
              className="draw-tool-btn draw-close-btn"
              onClick={close}
              aria-label="Close"
              title="Close (Esc)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="draw-stage-wrap">
            <div
              ref={stageRef}
              className="draw-stage"
              style={{ width: stageSize.width, height: stageSize.height }}
            >
              <img
                src={resolvedSrc}
                alt={mapName}
                draggable={false}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  imageRendering: 'crisp-edges',
                }}
              />
              {nationMarkers}
              <canvas
                ref={canvasRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
                style={{
                  position: 'absolute',
                  inset: 0,
                  touchAction: 'none',
                  cursor:
                    tool === 'text'
                      ? 'text'
                      : tool === 'eraser'
                      ? 'cell'
                      : 'crosshair',
                }}
              />
              {labelInput && (
                <input
                  ref={inputRef}
                  value={labelInput.text}
                  onChange={(e) => setLabelInput((prev) => (prev ? { ...prev, text: e.target.value } : prev))}
                  onBlur={commitLabel}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      commitLabel();
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      setLabelInput(null);
                    }
                  }}
                  placeholder="Type, Enter"
                  style={{
                    position: 'absolute',
                    left: stageSize.width
                      ? Math.max(0, Math.min(labelInput.x * stageSize.width, stageSize.width - 220))
                      : 0,
                    top: stageSize.height
                      ? Math.max(0, Math.min(labelInput.y * stageSize.height, stageSize.height - (fontSize + 14)))
                      : 0,
                    font: `bold ${fontSize}px "Space Grotesk", system-ui, sans-serif`,
                    color,
                    background: 'rgba(0,0,0,0.7)',
                    border: `2px solid ${color}`,
                    borderRadius: 4,
                    padding: '2px 6px',
                    outline: 'none',
                    minWidth: 200,
                    zIndex: 50,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .draw-launch-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          padding: 0.55rem 0.9rem;
          border-radius: 0.625rem;
          border: 1px solid rgba(119, 224, 255, 0.45);
          background: linear-gradient(135deg, rgba(119, 224, 255, 0.18), rgba(119, 224, 255, 0.05));
          color: var(--accent-primary, #77e0ff);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: transform 0.12s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
          font-family: 'Space Grotesk', sans-serif;
          box-shadow: 0 6px 24px rgba(119, 224, 255, 0.12), inset 0 1px 0 rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
        }
        .draw-launch-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
          pointer-events: none;
        }
        .draw-launch-btn:hover {
          background: linear-gradient(135deg, rgba(119, 224, 255, 0.28), rgba(119, 224, 255, 0.1));
          border-color: var(--accent-primary, #77e0ff);
          box-shadow: 0 8px 32px rgba(119, 224, 255, 0.25), inset 0 1px 0 rgba(255,255,255,0.08);
          transform: translateY(-1px);
        }
        .draw-launch-btn:hover::before { transform: translateX(100%); }
        .draw-launch-btn:active { transform: translateY(0); }
        .draw-cta-wrap {
          display: flex;
          justify-content: flex-start;
          margin-top: 1.25rem;
        }

        .draw-overlay-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(8, 10, 16, 0.96);
          display: flex;
          flex-direction: column;
          backdrop-filter: blur(6px);
        }
        .draw-toolbar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 0.9rem;
          background: rgba(16, 20, 28, 0.95);
          border-bottom: 1px solid var(--border-strong, rgba(255,255,255,0.12));
          flex-wrap: wrap;
        }
        .draw-toolbar-group {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        .draw-toolbar-sep {
          width: 1px;
          height: 24px;
          background: rgba(255,255,255,0.12);
          margin: 0 0.15rem;
        }
        .draw-tool-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.82);
          cursor: pointer;
          transition: background 0.12s, border-color 0.12s, color 0.12s;
        }
        .draw-tool-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.22);
          color: #fff;
        }
        .draw-tool-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .draw-tool-btn.is-active {
          background: rgba(119, 224, 255, 0.18);
          border-color: #77e0ff;
          color: #77e0ff;
        }
        .draw-close-btn { border-color: rgba(239, 68, 68, 0.35); color: #fca5a5; }
        .draw-close-btn:hover { background: rgba(239, 68, 68, 0.15); color: #fff; }

        .draw-color-swatch {
          width: 28px;
          height: 28px;
          border-radius: 999px;
          border: 2px solid rgba(255,255,255,0.25);
          cursor: pointer;
          padding: 0;
          transition: transform 0.08s, border-color 0.12s, box-shadow 0.12s;
        }
        .draw-color-swatch:hover { transform: scale(1.1); }
        .draw-color-swatch.is-active {
          border-color: #fff;
          box-shadow: 0 0 0 2px rgba(255,255,255,0.25);
        }
        .draw-size-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          cursor: pointer;
          transition: background 0.12s, border-color 0.12s;
        }
        .draw-size-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.22); }
        .draw-size-btn.is-active { border-color: #77e0ff; background: rgba(119, 224, 255, 0.12); }
        .draw-size-dot { display: inline-block; border-radius: 999px; }

        .draw-stage-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          overflow: hidden;
        }
        .draw-stage {
          position: relative;
          background: #000;
          box-shadow: 0 20px 80px rgba(0,0,0,0.6);
          border-radius: 4px;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
