import { buildAdjacency, edgeKey } from '../utils/graphUtils.js'
import { StepBuilder } from './stepBuilder.js'

// Breadth-First Search. Emits a frame every time a node enters the queue
// (frontier), every time an edge is scanned, and every time a node is
// finalized (dequeued + fully explored marker).
export function run(graph, { source }) {
  const { nodes, edges } = graph
  const adj = buildAdjacency(nodes, edges)
  const sb = new StepBuilder(nodes, edges)

  const visited = new Set([source])
  const order = [source]
  const queue = [source]

  sb.setNode(source, 'frontier')
  sb.push(`Start BFS at node ${source}. Added to queue.`, { queue: [...queue] })

  while (queue.length) {
    const current = queue.shift()
    sb.setNode(current, 'active')
    sb.push(`Dequeue node ${current}. Visiting its neighbors.`, { queue: [...queue] })

    const neighbors = (adj.get(current) || []).slice().sort((a, b) => a.to - b.to || 0)
    for (const { to, key } of neighbors) {
      sb.setEdge(key, 'evaluating')
      sb.push(`Check edge ${current} - ${to}.`, { queue: [...queue] })

      if (!visited.has(to)) {
        visited.add(to)
        order.push(to)
        queue.push(to)
        sb.setEdge(key, 'included')
        sb.setNode(to, 'frontier')
        sb.push(`Node ${to} unvisited -> enqueue it. Tree edge ${current} - ${to} kept.`, {
          queue: [...queue],
        })
      } else {
        sb.setEdge(key, 'rejected')
        sb.push(`Node ${to} already visited -> skip edge ${current} - ${to}.`, {
          queue: [...queue],
        })
        sb.setEdge(key, 'default')
      }
    }

    sb.setNode(current, 'finalized')
    sb.push(`Node ${current} fully explored.`, { queue: [...queue] })
  }

  const summary = `BFS order from ${source}: ${order.join(' -> ')}`
  return { steps: sb.result(), summary }
}

export const meta = {
  id: 'bfs',
  label: 'BFS',
  fullName: 'Breadth-First Search',
  needsSource: true,
}
