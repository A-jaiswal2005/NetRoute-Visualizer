// Central graph data helpers.
// A "graph" in this app is always: { nodes: [id,...], edges: [{u, v, w}, ...] }
// Edges are undirected. edgeKey() gives a stable id for an edge regardless of direction.

export function edgeKey(u, v) {
  const a = String(u)
  const b = String(v)
  return a < b ? `${a}-${b}` : `${b}-${a}`
}

export function buildAdjacency(nodes, edges) {
  const adj = new Map()
  nodes.forEach((n) => adj.set(n, []))
  edges.forEach(({ u, v, w }) => {
    if (!adj.has(u)) adj.set(u, [])
    if (!adj.has(v)) adj.set(v, [])
    adj.get(u).push({ to: v, w, key: edgeKey(u, v) })
    adj.get(v).push({ to: u, w, key: edgeKey(u, v) })
  })
  return adj
}

// Circular layout so any node count looks reasonable on the SVG canvas.
export function layoutNodes(nodes, width = 640, height = 440) {
  const cx = width / 2
  const cy = height / 2
  const r = Math.min(width, height) / 2 - 60
  const positions = {}
  const n = nodes.length || 1
  nodes.forEach((id, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2
    positions[id] = {
      x: Math.round(cx + r * Math.cos(angle)),
      y: Math.round(cy + r * Math.sin(angle)),
    }
  })
  return positions
}

export function defaultNodeStates(nodes) {
  const s = {}
  nodes.forEach((n) => (s[n] = 'default'))
  return s
}

export function defaultEdgeStates(edges) {
  const s = {}
  edges.forEach(({ u, v }) => (s[edgeKey(u, v)] = 'default'))
  return s
}

// Hardcoded 6-node weighted demo graph, used for "Run Demo Graph".
export const DEMO_GRAPH = {
  nodes: [1, 2, 3, 4, 5, 6],
  edges: [
    { u: 1, v: 2, w: 4 },
    { u: 1, v: 3, w: 2 },
    { u: 2, v: 3, w: 1 },
    { u: 2, v: 4, w: 5 },
    { u: 3, v: 4, w: 8 },
    { u: 3, v: 5, w: 10 },
    { u: 4, v: 5, w: 2 },
    { u: 4, v: 6, w: 6 },
    { u: 5, v: 6, w: 3 },
  ],
}

// Parses lines like "1 2 5" (u v weight). Weight defaults to 1 if omitted.
// Throws a descriptive Error on malformed input.
export function parseGraphInput(text) {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    throw new Error('No edges provided. Enter at least one line like "1 2 5".')
  }

  const edges = []
  const nodeSet = new Set()

  lines.forEach((line, idx) => {
    const parts = line.split(/\s+/)
    if (parts.length < 2 || parts.length > 3) {
      throw new Error(`Line ${idx + 1} ("${line}") must look like "u v weight" or "u v".`)
    }
    const [uRaw, vRaw, wRaw] = parts
    const u = isNaN(Number(uRaw)) ? uRaw : Number(uRaw)
    const v = isNaN(Number(vRaw)) ? vRaw : Number(vRaw)
    const w = wRaw === undefined ? 1 : Number(wRaw)

    if (wRaw !== undefined && Number.isNaN(w)) {
      throw new Error(`Line ${idx + 1} ("${line}") has a non-numeric weight.`)
    }
    if (u === v) {
      throw new Error(`Line ${idx + 1} ("${line}") is a self-loop, which isn't supported.`)
    }

    nodeSet.add(u)
    nodeSet.add(v)
    edges.push({ u, v, w })
  })

  return { nodes: Array.from(nodeSet), edges }
}
