import { edgeKey } from '../utils/graphUtils.js'
import { StepBuilder } from './stepBuilder.js'
import { DSU } from './dsu.js'

// Kruskal's MST: sort edges by weight, greedily add any edge that doesn't
// close a cycle (checked via Union-Find). No source node needed.
export function run(graph) {
  const { nodes, edges } = graph
  const sb = new StepBuilder(nodes, edges)
  const dsu = new DSU(nodes)

  const sorted = edges.slice().sort((a, b) => a.w - b.w)
  sb.push(`Sort all ${edges.length} edges by weight ascending.`, {
    order: sorted.map((e) => `${e.u}-${e.v}(${e.w})`),
  })

  const mst = []
  let totalCost = 0

  for (const { u, v, w } of sorted) {
    const key = edgeKey(u, v)
    sb.setEdge(key, 'evaluating')
    sb.setNode(u, sb.nodeStates[u] === 'default' ? 'frontier' : sb.nodeStates[u])
    sb.setNode(v, sb.nodeStates[v] === 'default' ? 'frontier' : sb.nodeStates[v])
    sb.push(`Consider edge ${u} - ${v} (weight ${w}).`, { mstCost: totalCost })

    if (!dsu.connected(u, v)) {
      dsu.union(u, v)
      mst.push({ u, v, w })
      totalCost += w
      sb.setEdge(key, 'included')
      sb.setNode(u, 'finalized')
      sb.setNode(v, 'finalized')
      sb.push(`No cycle formed -> add edge ${u} - ${v} to MST. Running cost: ${totalCost}.`, {
        mstCost: totalCost,
      })
    } else {
      sb.setEdge(key, 'rejected')
      sb.push(`${u} and ${v} already connected -> would form a cycle. Reject edge.`, {
        mstCost: totalCost,
      })
    }

    if (mst.length === nodes.length - 1) break
  }

  const summary =
    mst.length === nodes.length - 1
      ? `Minimum Spanning Tree Cost: ${totalCost} | Edges: ${mst.map((e) => `${e.u}-${e.v}`).join(', ')}`
      : `Graph is disconnected -> no full spanning tree. Partial forest cost: ${totalCost}.`

  return { steps: sb.result(), summary }
}

export const meta = {
  id: 'kruskal',
  label: "Kruskal's MST",
  fullName: "Kruskal's Minimum Spanning Tree",
  needsSource: false,
}
