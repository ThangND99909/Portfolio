import type { DiagramEdge, DiagramNode, DiagramSpec } from '@/content/types';

/* Geometry. Every diagram on the site is measured with these numbers, which is
   what makes five different diagrams read as one drawing style. */
const NODE_H = 48;
/* Horizontal room for an edge plus its mono note. A same-row note is centred in
   this gap and cannot be measured server-side, so it is sized by hand: at 9.5px
   mono this fits roughly 15 characters. Keep same-row edge notes short. */
const GAP_X = 96;
const CORNER = 7; // elbow radius
const PAD = 14; // viewBox padding so strokes and notes are not clipped

/* Node width differs per orientation on purpose. The SVG is never scaled up
   past its natural width, so mono labels render at their authored pixel size in
   both layouts — a single width would either overflow 375px or leave the
   stacked column looking like a ribbon. */
const NODE_W_GRID = 168;
const NODE_W_STACK = 288;
const GAP_Y_GRID = 44;
const GAP_Y_STACK = 40;

/* Side channel: where an edge that skips over a node is routed so it does not
   draw straight through it. Successive side edges step further out. */
const CHANNEL_BASE = 18;
const CHANNEL_STEP = 14;
const CHANNEL_STUB = 14; // how far the edge runs before turning aside

export type LaidOutNode = {
  node: DiagramNode;
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  row: number;
  col: number;
  /** Position in the laid-out sequence; used to detect skipped nodes. */
  seq: number;
};

/** Arrowhead placement. Drawn as its own path rather than an SVG <marker>: a
 *  marker is painted the instant the path exists, so it would hang in mid-air
 *  while the line is still drawing. Own element = own fade-in timing, and no
 *  marker-id collisions between the diagrams on the site. */
export type ArrowTip = { x: number; y: number; angle: number };

export type LaidOutEdge = {
  key: string;
  d: string;
  /** Path length, used to seed stroke-dasharray/dashoffset. */
  len: number;
  note?: string;
  noteX: number;
  noteY: number;
  noteAnchor: 'start' | 'middle';
  dashed: boolean;
  tip: ArrowTip;
  /** Present only on two-way edges (e.g. calendar sync). */
  tail?: ArrowTip;
};

export type DiagramLayout = {
  width: number;
  height: number;
  nodes: LaidOutNode[];
  edges: LaidOutEdge[];
};

export type Orientation = 'grid' | 'stack';

type Point = { x: number; y: number };

/**
 * Turns a spec into coordinates.
 *
 * `grid` honours each node's col/row.
 *
 * `stack` collapses everything onto one column for mobile — ordered by column
 * first, then row. Column-major matters: it keeps the primary pipeline
 * contiguous top to bottom and pushes side branches (a metadata store, an error
 * path, a second modality) below it, so only those branches need routing around
 * anything. Row-major ordering interleaves parallel paths and turns a two-path
 * diagram into nonsense.
 */
export function layoutDiagram(spec: DiagramSpec, orientation: Orientation): DiagramLayout {
  // In the stacked layout a node that spans columns is a merge point — the one
  // interface two paths arrive at — so it is pushed to the end. Otherwise it
  // would appear before the second path that feeds it.
  const isMerge = (n: DiagramNode) => ((n.span ?? 1) > 1 ? 1 : 0);

  const ordered =
    orientation === 'stack'
      ? [...spec.nodes].sort(
          (a, b) => isMerge(a) - isMerge(b) || a.col - b.col || a.row - b.row,
        )
      : [...spec.nodes].sort((a, b) => a.row - b.row || a.col - b.col);

  const placed: DiagramNode[] =
    orientation === 'stack'
      ? ordered.map((n, i) => ({ ...n, col: 0, row: i, span: 1 }))
      : ordered;

  const cols = orientation === 'stack' ? 1 : spec.cols;
  const NODE_W = orientation === 'stack' ? NODE_W_STACK : NODE_W_GRID;
  const GAP_Y = orientation === 'stack' ? GAP_Y_STACK : GAP_Y_GRID;

  const nodes: LaidOutNode[] = placed.map((node, seq) => {
    const span = Math.max(1, node.span ?? 1);
    const w = span * NODE_W + (span - 1) * GAP_X;
    const x = node.col * (NODE_W + GAP_X);
    const y = node.row * (NODE_H + GAP_Y);
    return {
      node,
      x,
      y,
      w,
      h: NODE_H,
      cx: x + w / 2,
      cy: y + NODE_H / 2,
      row: node.row,
      col: node.col,
      seq,
    };
  });

  const rows = nodes.reduce((max, n) => Math.max(max, n.row), 0) + 1;
  let innerW = cols * NODE_W + (cols - 1) * GAP_X;
  const innerH = rows * NODE_H + (rows - 1) * GAP_Y;

  const byId = new Map(nodes.map((n) => [n.node.id, n]));
  const edges: LaidOutEdge[] = [];
  let channelIndex = 0;
  let widestChannel = 0;

  for (const edge of spec.edges) {
    const a = byId.get(edge.from);
    const b = byId.get(edge.to);
    // A spec referencing a missing node is an authoring bug, not a runtime one —
    // skip it so a typo never blanks the whole page.
    if (!a || !b) continue;

    // Whether the straight line between a and b would cross a third node.
    // This has to be a geometry test, not a sequence test: in the grid layout
    // two nodes can be several places apart in reading order while nothing at
    // all sits between them in their own column.
    const aligned = Math.abs(a.cx - b.cx) < 2;
    const blocked =
      aligned &&
      nodes.some((other) => {
        if (other === a || other === b) return false;
        const between =
          other.row > Math.min(a.row, b.row) && other.row < Math.max(a.row, b.row);
        if (!between) return false;
        return other.x - 4 < a.cx && a.cx < other.x + other.w + 4;
      });

    if (blocked) {
      const offset = CHANNEL_BASE + channelIndex * CHANNEL_STEP;
      channelIndex += 1;
      const channelX = Math.max(a.x + a.w, b.x + b.w) + offset;
      widestChannel = Math.max(widestChannel, channelX);
      edges.push(routeAside(edge, a, b, channelX));
    } else {
      edges.push(routeDirect(edge, a, b));
    }
  }

  if (widestChannel > innerW) innerW = widestChannel + 4;

  return {
    width: round(innerW + PAD * 2),
    height: round(innerH + PAD * 2),
    nodes: nodes.map((n) => ({
      ...n,
      x: round(n.x + PAD),
      y: round(n.y + PAD),
      cx: round(n.cx + PAD),
      cy: round(n.cy + PAD),
    })),
    edges: edges.map((e) => ({
      ...e,
      d: shiftPath(e.d, PAD),
      noteX: round(e.noteX + PAD),
      noteY: round(e.noteY + PAD),
      tip: shiftTip(e.tip, PAD),
      tail: e.tail ? shiftTip(e.tail, PAD) : undefined,
    })),
  };
}

/* -------------------------------------------------------------------------- */
/* Routing                                                                    */
/* -------------------------------------------------------------------------- */

function routeDirect(edge: DiagramEdge, a: LaidOutNode, b: LaidOutNode): LaidOutEdge {
  const base = { key: `${edge.from}->${edge.to}`, note: edge.note, dashed: Boolean(edge.dashed) };

  // Same row → a straight horizontal run between facing edges.
  if (a.row === b.row) {
    const rightward = b.cx > a.cx;
    const points: Point[] = [
      { x: rightward ? a.x + a.w : a.x, y: a.cy },
      { x: rightward ? b.x : b.x + b.w, y: b.cy },
    ];
    const angle = rightward ? 0 : 180;
    return {
      ...base,
      ...pathOf(points),
      noteX: (points[0].x + points[1].x) / 2,
      noteY: a.cy - 9,
      noteAnchor: 'middle',
      tip: { x: points[1].x, y: b.cy, angle },
      tail: edge.biDirectional ? { x: points[0].x, y: a.cy, angle: angle + 180 } : undefined,
    };
  }

  const down = b.row > a.row;
  const sy = down ? a.y + a.h : a.y;
  const ey = down ? b.y : b.y + b.h;
  const vAngle = down ? 90 : -90;
  const tip: ArrowTip = { x: b.cx, y: ey, angle: vAngle };
  const tail = edge.biDirectional ? { x: a.cx, y: sy, angle: -vAngle } : undefined;

  // Vertically aligned → straight drop, note tucked beside the line.
  if (Math.abs(a.cx - b.cx) < 2) {
    return {
      ...base,
      ...pathOf([
        { x: a.cx, y: sy },
        { x: b.cx, y: ey },
      ]),
      noteX: a.cx + 10,
      noteY: (sy + ey) / 2 + 3,
      noteAnchor: 'start',
      tip,
      tail,
    };
  }

  // Otherwise an orthogonal elbow: leave vertically, turn at the midpoint of
  // the gap, arrive vertically.
  //
  // The arrival point is nudged off the node's centre, towards the side the
  // edge came from. A branch and the main spine both land on the same node face,
  // and two arrowheads on the same pixel read as one broken line.
  const midY = (sy + ey) / 2;
  const lean = a.cx > b.cx ? 1 : -1;
  const arriveX = clamp(b.cx + lean * b.w * 0.28, b.x + 14, b.x + b.w - 14);

  return {
    ...base,
    ...pathOf([
      { x: a.cx, y: sy },
      { x: a.cx, y: midY },
      { x: arriveX, y: midY },
      { x: arriveX, y: ey },
    ]),
    noteX: (a.cx + arriveX) / 2,
    noteY: midY - 11,
    noteAnchor: 'middle',
    tip: { ...tip, x: arriveX },
    tail,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * An edge whose endpoints are in the same column but not adjacent would draw
 * straight through the nodes between them. This routes it out to a side channel
 * and back — the shape a wiring diagram uses for exactly this reason.
 */
function routeAside(
  edge: DiagramEdge,
  a: LaidOutNode,
  b: LaidOutNode,
  channelX: number,
): LaidOutEdge {
  const down = b.row > a.row;
  const sy = down ? a.y + a.h : a.y;
  const ey = down ? b.y : b.y + b.h;
  const vAngle = down ? 90 : -90;

  const stubOut = down ? sy + CHANNEL_STUB : sy - CHANNEL_STUB;
  const stubIn = down ? ey - CHANNEL_STUB : ey + CHANNEL_STUB;

  const points: Point[] = [
    { x: a.cx, y: sy },
    { x: a.cx, y: stubOut },
    { x: channelX, y: stubOut },
    { x: channelX, y: stubIn },
    { x: b.cx, y: stubIn },
    { x: b.cx, y: ey },
  ];

  return {
    key: `${edge.from}->${edge.to}`,
    note: edge.note,
    dashed: Boolean(edge.dashed),
    ...pathOf(points),
    // Note sits in the channel, reading down the outside of the diagram.
    noteX: channelX + 6,
    noteY: (stubOut + stubIn) / 2,
    noteAnchor: 'start',
    tip: { x: b.cx, y: ey, angle: vAngle },
    tail: edge.biDirectional ? { x: a.cx, y: sy, angle: -vAngle } : undefined,
  };
}

/* -------------------------------------------------------------------------- */
/* Path building                                                              */
/* -------------------------------------------------------------------------- */

/** Builds an orthogonal polyline with rounded corners and returns its exact
 *  length, which seeds the draw-on animation. */
function pathOf(points: Point[]): { d: string; len: number } {
  const parts: string[] = [`M ${round(points[0].x)} ${round(points[0].y)}`];
  let len = 0;

  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    len += Math.hypot(curr.x - prev.x, curr.y - prev.y);

    if (!next) {
      parts.push(`L ${round(curr.x)} ${round(curr.y)}`);
      continue;
    }

    // `curr` is a corner: stop short of it, curve through, resume.
    const rIn = Math.min(CORNER, dist(prev, curr) / 2);
    const rOut = Math.min(CORNER, dist(curr, next) / 2);
    const before = towards(curr, prev, rIn);
    const after = towards(curr, next, rOut);

    parts.push(`L ${round(before.x)} ${round(before.y)}`);
    parts.push(`Q ${round(curr.x)} ${round(curr.y)} ${round(after.x)} ${round(after.y)}`);
  }

  return { d: parts.join(' '), len: round(len) };
}

function dist(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/** Point `by` units from `from` in the direction of `to`. */
function towards(from: Point, to: Point, by: number): Point {
  const d = dist(from, to);
  if (d === 0) return { ...from };
  return { x: from.x + ((to.x - from.x) / d) * by, y: from.y + ((to.y - from.y) / d) * by };
}

function shiftTip(t: ArrowTip, by: number): ArrowTip {
  return { x: round(t.x + by), y: round(t.y + by), angle: t.angle };
}

/** Offsets a generated path by the viewBox padding. Only touches numbers this
 *  module emitted itself, so the naive replace is safe. */
function shiftPath(d: string, by: number): string {
  return d.replace(/-?\d+(\.\d+)?/g, (m) => String(round(Number(m) + by)));
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Text alternative for screen readers, generated from the spec so it can never
 *  drift from the drawing. */
export function describeDiagram(spec: DiagramSpec): string {
  const label = (id: string) => {
    const node = spec.nodes.find((item) => item.id === id);
    if (!node) return id;
    return [node.label, node.sub, node.hover].filter(Boolean).join(', ');
  };
  const steps = spec.edges.map((e) => {
    const arrow = e.biDirectional ? 'to and from' : 'to';
    const note = e.note ? ` (${e.note})` : '';
    return `${label(e.from)} ${arrow} ${label(e.to)}${note}`;
  });
  return `${spec.caption}. ${steps.join('; ')}.`;
}
