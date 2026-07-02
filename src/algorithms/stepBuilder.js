import { defaultNodeStates, defaultEdgeStates } from '../utils/graphUtils.js'

// StepBuilder is the one piece of shared machinery every algorithm module
// uses to produce animation frames. It owns mutable "current" node/edge
// state maps and snapshots them (as plain objects, so later mutation can't
// corrupt earlier frames) every time `.push()` is called.
//
// A "step" looks like:
// {
//   nodeStates: { [nodeId]: 'default' | 'frontier' | 'active' | 'visited' | 'finalized' },
//   edgeStates: { [edgeKey]:  'default' | 'evaluating' | 'included' | 'rejected' },
//   message: string,          // shown in the console panel
//   info: Record<string,any>  // optional extra data for the side "state" panel
// }
export class StepBuilder {
  constructor(nodes, edges) {
    this.nodeStates = defaultNodeStates(nodes)
    this.edgeStates = defaultEdgeStates(edges)
    this.steps = []
  }

  setNode(id, state) {
    this.nodeStates[id] = state
  }

  setEdge(key, state) {
    this.edgeStates[key] = state
  }

  push(message, info = null) {
    this.steps.push({
      nodeStates: { ...this.nodeStates },
      edgeStates: { ...this.edgeStates },
      message,
      info,
    })
  }

  result() {
    return this.steps
  }
}
