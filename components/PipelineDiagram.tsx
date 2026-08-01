import type { CSSProperties } from 'react';
import type { DiagramSpec } from '@/content/types';
import {
  describeDiagram,
  layoutDiagram,
  type LaidOutEdge,
  type LaidOutNode,
  type Orientation,
} from '@/lib/diagram-layout';

type Props = {
  spec: DiagramSpec;
  /** Unique within a page; keeps generated element ids from colliding. */
  uid: string;
  /** Screen-reader label, translated by the caller. */
  a11yLabel: string;
  /**
   * Lets a diagram render larger than its natural width — used by the hero,
   * where the diagram is the whole point of the layout and needs the weight.
   * Stroke widths are divided by the same factor so lines stay exactly one
   * device pixel and the drawing does not get heavier as it gets bigger.
   */
  scale?: number;
  className?: string;
};

/**
 * The signature element. Renders a spec twice — once as a grid (desktop) and
 * once as a single column (mobile) — from the same layout engine, so a diagram
 * is authored once and never drawn by hand.
 *
 * A server component. The draw-on animation is driven by <DiagramScript>, a few
 * lines of vanilla JS that add `is-drawn` when a diagram scrolls into view;
 * making this a client component would pull React hydration onto every page for
 * one IntersectionObserver.
 */
export function PipelineDiagram({ spec, uid, a11yLabel, scale = 1, className = '' }: Props) {
  const description = describeDiagram(spec);

  return (
    <figure data-diagram className={className}>
      <figcaption className="label mb-4 text-muted">{spec.caption}</figcaption>

      {/* Two orientations from one spec: the stacked column below md, the grid
          above it. Same layout engine, so the diagram is authored once. */}
      <div className="md:hidden">
        <DiagramSvg
          spec={spec}
          orientation="stack"
          uid={uid}
          label={a11yLabel}
          description={description}
          scale={1}
        />
      </div>
      <div className="hidden md:block">
        <DiagramSvg
          spec={spec}
          orientation="grid"
          uid={uid}
          label={a11yLabel}
          description={description}
          scale={scale}
        />
      </div>
    </figure>
  );
}

function DiagramSvg({
  spec,
  orientation,
  uid,
  label,
  description,
  scale,
}: {
  spec: DiagramSpec;
  orientation: Orientation;
  uid: string;
  label: string;
  description: string;
  scale: number;
}) {
  const { width, height, nodes, edges } = layoutDiagram(spec, orientation);
  const descId = `dg-${uid}-${orientation}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      // Capped at natural width × scale, so mono labels render at a known pixel
      // size instead of ballooning to fill whatever column they land in.
      style={
        {
          maxWidth: width * scale,
          height: 'auto',
          '--dg-stroke': 1 / scale,
        } as CSSProperties
      }
      role="img"
      // A role="img" element needs a name, not only a description — aria-label
      // here is the short one, <desc> is the full flow read out in order.
      aria-label={label}
      aria-describedby={descId}
      className="mx-auto block"
    >
      <desc id={descId}>{description}</desc>

      {edges.map((edge) => (
        <Edge key={edge.key} edge={edge} />
      ))}

      {nodes.map((n) => (
        <Node key={n.node.id} laid={n} />
      ))}
    </svg>
  );
}

function Edge({ edge }: { edge: LaidOutEdge }) {
  // Exact path length + a rounding margin, so the line is fully hidden before
  // it draws and fully revealed after.
  const edgeVars = { '--edge-len': edge.len + 2 } as CSSProperties;

  return (
    <g>
      <path
        d={edge.d}
        className={edge.dashed ? 'diagram-edge diagram-edge--dashed' : 'diagram-edge'}
        style={edge.dashed ? undefined : edgeVars}
      />
      <Arrow x={edge.tip.x} y={edge.tip.y} angle={edge.tip.angle} />
      {edge.tail ? <Arrow x={edge.tail.x} y={edge.tail.y} angle={edge.tail.angle} /> : null}
      {edge.note ? (
        <text
          x={edge.noteX}
          y={edge.noteY}
          textAnchor={edge.noteAnchor}
          className="dg-note diagram-edge-note"
        >
          {edge.note}
        </text>
      ) : null}
    </g>
  );
}

function Arrow({ x, y, angle }: { x: number; y: number; angle: number }) {
  return (
    <path
      d="M -4.5 -3.2 L 0 0 L -4.5 3.2"
      className="diagram-arrow"
      transform={`translate(${x} ${y}) rotate(${angle})`}
    />
  );
}

function Node({ laid }: { laid: LaidOutNode }) {
  const { node, x, y, w, h, cx } = laid;
  const accent = node.tone === 'accent';
  const hasSub = Boolean(node.sub);

  // With a sub-label the two lines sit above/below centre; without one the
  // label is centred on its own.
  const labelY = hasSub ? y + h / 2 - 3 : y + h / 2 + 4;
  const subY = y + h / 2 + 13;

  return (
    <g className="diagram-node dg-node-group">
      {node.hover ? <title>{`${node.label} — ${node.hover}`}</title> : null}

      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        className={accent ? 'dg-box dg-box--accent' : 'dg-box'}
      />

      <text x={cx} y={labelY} textAnchor="middle" className="dg-label">
        {node.label}
      </text>

      {hasSub ? (
        <text x={cx} y={subY} textAnchor="middle" className="dg-sub dg-sub-default">
          {node.sub}
        </text>
      ) : null}

      {node.hover ? (
        <text x={cx} y={subY} textAnchor="middle" className="dg-sub dg-hover">
          {node.hover}
        </text>
      ) : null}
    </g>
  );
}
