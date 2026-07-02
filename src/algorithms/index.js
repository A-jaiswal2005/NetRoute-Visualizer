// Central algorithm registry.
//
// To add a new algorithm (e.g. Bellman-Ford, Topological Sort):
//   1. Create src/algorithms/yourAlgorithm.js exporting `run(graph, params)`
//      -> { steps, summary }, plus a `meta` object (see any existing file
//      for the shape).
//   2. Import it below and add it to the ALGORITHMS array.
// Nothing in the UI, the player hook, or the canvas needs to change -
// the navbar, forms, and animation engine all read from this registry.
import * as bfs from './bfs.js'
import * as dfs from './dfs.js'
import * as dijkstra from './dijkstra.js'
import * as kruskal from './kruskal.js'
import * as prim from './prim.js'

export const ALGORITHMS = [bfs, dfs, dijkstra, kruskal, prim]

export function getAlgorithm(id) {
  return ALGORITHMS.find((a) => a.meta.id === id)
}
