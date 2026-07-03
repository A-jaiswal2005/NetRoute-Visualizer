import { buildAdjacency } from '../utils/graphUtils.js'
import { StepBuilder } from './stepBuilder.js'

// Depth-First Search, implemented with an explicit state stack 
// to perfectly visualize true recursive depth-first traversal.
export function run(graph, { source }) {
  const { nodes, edges } = graph
  const adj = buildAdjacency(nodes, edges)
  const sb = new StepBuilder(nodes, edges)

  const visited = new Set()
  const order = []
  
  // Stack now tracks the node AND which neighbor index it is currently exploring
  const stack = [{ node: source, edgeIndex: 0 }]
  
  visited.add(source)
  order.push(source)
  sb.setNode(source, 'active')
  
  // Helper to format stack for the UI
  const getStackDisplay = () => stack.map(s => s.node)
  
  sb.push(`Start DFS at node ${source}.`, { stack: getStackDisplay() })

  while (stack.length > 0) {
    const currentObj = stack[stack.length - 1]
    const current = currentObj.node
    
    // Get neighbors in ascending order
    const neighbors = (adj.get(current) || [])
      .slice()
      .sort((a, b) => a.to - b.to || 0)

    // Check if we still have neighbors left to explore for this node
    if (currentObj.edgeIndex < neighbors.length) {
      const { to, key } = neighbors[currentObj.edgeIndex]
      currentObj.edgeIndex++ // Increment so we know where to resume if we backtrack

      sb.setEdge(key, 'evaluating')
      sb.push(`Check edge ${current} - ${to}.`, { stack: getStackDisplay() })

      if (!visited.has(to)) {
        // Unvisited! Dive deep immediately.
        visited.add(to)
        order.push(to)
        
        sb.setEdge(key, 'included')
        sb.setNode(to, 'active')
        
        // Push new node to the top of the stack to begin exploring its depth
        stack.push({ node: to, edgeIndex: 0 }) 
        sb.push(`Node ${to} unvisited -> exploring depth.`, { stack: getStackDisplay() })
      } else {
        // Already visited, skip it
        sb.setEdge(key, 'rejected')
        sb.push(`Node ${to} already visited -> skip edge ${current} - ${to}.`, { stack: getStackDisplay() })
        sb.setEdge(key, 'default')
      }
    } else {
      // No more neighbors to explore, pop from stack (Backtrack)
      stack.pop()
      sb.setNode(current, 'finalized')
      sb.push(`Node ${current} fully explored. Backtracking.`, { stack: getStackDisplay() })
      
      // If there's still a node on the stack, visually return to it
      if (stack.length > 0) {
        sb.setNode(stack[stack.length - 1].node, 'active')
      }
    }
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
