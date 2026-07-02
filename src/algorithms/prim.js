import { buildAdjacency, edgeKey } from '../utils/graphUtils.js'
import { StepBuilder } from './stepBuilder.js'

// Prim's MST: grow a single tree from `source`, at each step adding the
// cheapest edge that connects the tree to a new node.
export function run(graph, { source }) {
  const { nodes, edges } = graph
  const adj = buildAdjacency(nodes, edges)
  const sb = new StepBuilder(nodes, edges)

  const inTree = new Set([source])
  sb.setNode(source, 'finalized')
  sb.push(`Start Prim's algorithm at node ${source}.`, { mstCost: 0 })

  let totalCost = 0
  const mstEdges = []

  while (inTree.size < nodes.length) {
    // Find the cheapest edge crossing the (inTree, outside) cut.
    let bestEdge = null
    const candidates = []
    for (const n of inTree) {
      for (const { to, w, key } of adj.get(n) || []) {
        if (!inTree.has(to)) {
          candidates.push({ from: n, to, w, key })
        }
      }
    }
    candidates.sort((a, b) => a.w - b.w || 0)

    for (const c of candidates) {
      sb.setEdge(c.key, 'evaluating')
      sb.push(`Check crossing edge ${c.from} - ${c.to} (weight ${c.w}).`, { mstCost: totalCost })
      sb.setEdge(c.key, 'default')
    }

    if (candidates.length === 0) {
      sb.push('No crossing edges remain -> remaining nodes are unreachable from the tree.', {
        mstCost: totalCost,
      })
      break
    }

    bestEdge = candidates[0]
    const { from, to, w, key } = bestEdge
    inTree.add(to)
    totalCost += w
    mstEdges.push({ u: from, v: to, w })
    sb.setEdge(key, 'included')
    sb.setNode(to, 'finalized')
    sb.push(`Cheapest crossing edge is ${from} - ${to} (weight ${w}) -> add node ${to}. Running cost: ${totalCost}.`, {
      mstCost: totalCost,
    })
  }

  const summary =
    inTree.size === nodes.length
      ? `Minimum Spanning Tree Cost: ${totalCost} | Edges: ${mstEdges
          .map((e) => `${e.u}-${e.v}`)
          .join(', ')}`
      : `Graph is disconnected from ${source} -> no full spanning tree. Partial tree cost: ${totalCost}.`

  return { steps: sb.result(), summary }
}

export const meta = {
  id: 'prim',
  label: "Prim's MST",
  fullName: "Prim's Minimum Spanning Tree",
  needsSource: true,
}
