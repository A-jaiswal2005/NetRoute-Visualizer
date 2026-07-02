import { buildAdjacency } from '../utils/graphUtils.js'
import { StepBuilder } from './stepBuilder.js'

// Depth-First Search, implemented iteratively (explicit stack) so the
// step-by-step frames match what you'd see tracing the recursion by hand.
export function run(graph, { source }) {
  const { nodes, edges } = graph
  const adj = buildAdjacency(nodes, edges)
  const sb = new StepBuilder(nodes, edges)

  const visited = new Set()
  const order = []
  const stack = [source]

  sb.setNode(source, 'frontier')
  sb.push(`Start DFS at node ${source}. Pushed onto stack.`, { stack: [...stack] })

  while (stack.length) {
    const current = stack.pop()
    if (visited.has(current)) continue

    visited.add(current)
    order.push(current)
    sb.setNode(current, 'active')
    sb.push(`Visit node ${current}.`, { stack: [...stack] })

    const neighbors = (adj.get(current) || [])
      .slice()
      .sort((a, b) => a.to - b.to || 0)
      .reverse() // reverse so ascending order is explored first (stack is LIFO)

    for (const { to, key } of neighbors) {
      sb.setEdge(key, 'evaluating')
      sb.push(`Check edge ${current} - ${to}.`, { stack: [...stack] })

      if (!visited.has(to)) {
        stack.push(to)
        sb.setEdge(key, 'included')
        sb.setNode(to, 'frontier')
        sb.push(`Node ${to} unvisited -> push it. Tree edge ${current} - ${to} kept.`, {
          stack: [...stack],
        })
      } else {
        sb.setEdge(key, 'rejected')
        sb.push(`Node ${to} already visited -> skip edge ${current} - ${to}.`, {
          stack: [...stack],
        })
        sb.setEdge(key, 'default')
      }
    }

    sb.setNode(current, 'finalized')
    sb.push(`Node ${current} fully explored.`, { stack: [...stack] })
  }

  const summary = `DFS order from ${source}: ${order.join(' -> ')}`
  return { steps: sb.result(), summary }
}

export const meta = {
  id: 'dfs',
  label: 'DFS',
  fullName: 'Depth-First Search',
  needsSource: true,
}
