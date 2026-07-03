import { buildAdjacency } from '../utils/graphUtils.js'
import { StepBuilder } from './stepBuilder.js'

// Depth-First Search, implemented using TRUE recursion.
// Tracks actual depth level for the visualizer console.
export function run(graph, { source }) {
  const { nodes, edges } = graph
  const adj = buildAdjacency(nodes, edges)
  const sb = new StepBuilder(nodes, edges)

  const visited = new Set()
  const order = []
  
  // We keep this array purely to pass the visual stack state to your UI
  const uiStack = [] 

  // True recursive function tracking the exact depth integer
  function dfs(current, depth) {
    visited.add(current)
    order.push(current)
    uiStack.push(current)

    sb.setNode(current, 'active')
    sb.push(`DFS(${current}) started at Depth ${depth}.`, { stack: [...uiStack] })

    const neighbors = (adj.get(current) || [])
      .slice()
      .sort((a, b) => a.to - b.to || 0)

    for (const { to, key } of neighbors) {
      sb.setEdge(key, 'evaluating')
      sb.push(`Depth ${depth}: Checking edge ${current} - ${to}.`, { stack: [...uiStack] })

      if (!visited.has(to)) {
        sb.setEdge(key, 'included')
        sb.setNode(to, 'active')
        sb.push(`Node ${to} unvisited -> diving deeper.`, { stack: [...uiStack] })
        
        // ACTUAL RECURSION HAPPENS HERE
        dfs(to, depth + 1) 

        // Backtracking: When recursion returns, visually highlight the current node again
        sb.setNode(current, 'active')
        sb.push(`Backtracked to node ${current} at Depth ${depth}.`, { stack: [...uiStack] })
      } else {
        sb.setEdge(key, 'rejected')
        sb.push(`Node ${to} already visited -> skip edge.`, { stack: [...uiStack] })
        sb.setEdge(key, 'default')
      }
    }

    uiStack.pop()
    sb.setNode(current, 'finalized')
    sb.push(`DFS(${current}) finished. Popping from stack.`, { stack: [...uiStack] })
  }

  // Kick off the recursion from the source node at Depth 0
  dfs(source, 0)

  const summary = `DFS order from ${source}: ${order.join(' -> ')}`
  return { steps: sb.result(), summary }
}

export const meta = {
  id: 'dfs',
  label: 'DFS',
  fullName: 'Depth-First Search',
  needsSource: true,
}
