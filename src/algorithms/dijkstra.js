import { buildAdjacency } from '../utils/graphUtils.js'
import { StepBuilder } from './stepBuilder.js'

// Classic O(V^2) Dijkstra (fine for the small graphs this visualizer
// targets). Emits a frame for every relaxation attempt so the "why" of
// each distance update is visible, then walks the parent pointers back
// to render the final path.
export function run(graph, { source, target }) {
  const { nodes, edges } = graph
  const adj = buildAdjacency(nodes, edges)
  const sb = new StepBuilder(nodes, edges)

  const dist = new Map(nodes.map((n) => [n, Infinity]))
  const prev = new Map(nodes.map((n) => [n, null]))
  const settled = new Set()
  dist.set(source, 0)

  sb.setNode(source, 'frontier')
  sb.push(`Start Dijkstra at node ${source}. dist[${source}] = 0.`, {
    distances: mapToObj(dist),
  })

  while (settled.size < nodes.length) {
    // Pick the unsettled node with smallest tentative distance.
    let u = null
    let best = Infinity
    for (const n of nodes) {
      if (!settled.has(n) && dist.get(n) < best) {
        best = dist.get(n)
        u = n
      }
    }
    if (u === null) break // remaining nodes are unreachable

    settled.add(u)
    sb.setNode(u, 'active')
    sb.push(`Select unsettled node ${u} with smallest tentative distance (${finite(dist.get(u))}).`, {
      distances: mapToObj(dist),
    })

    const neighbors = (adj.get(u) || []).slice().sort((a, b) => a.to - b.to || 0)
    for (const { to, w, key } of neighbors) {
      if (settled.has(to)) continue
      sb.setEdge(key, 'evaluating')
      sb.push(`Check edge ${u} - ${to} (weight ${w}).`, { distances: mapToObj(dist) })

      const candidate = dist.get(u) + w
      if (candidate < dist.get(to)) {
        dist.set(to, candidate)
        prev.set(to, u)
        sb.setEdge(key, 'included')
        if (sb.nodeStates[to] === 'default') sb.setNode(to, 'frontier')
        sb.push(`Relax: dist[${to}] = ${candidate} via ${u}.`, { distances: mapToObj(dist) })
      } else {
        sb.setEdge(key, 'rejected')
        sb.push(`No improvement for node ${to} (${finite(candidate)} >= ${finite(dist.get(to))}).`, {
          distances: mapToObj(dist),
        })
        sb.setEdge(key, 'default')
      }
    }

    sb.setNode(u, 'finalized')
    sb.push(`Node ${u} distance finalized at ${finite(dist.get(u))}.`, { distances: mapToObj(dist) })
  }

  // Reconstruct + highlight the shortest path to target, if reachable.
  let summary
  if (target !== undefined && target !== null) {
    if (dist.get(target) === Infinity) {
      summary = `No path exists from ${source} to ${target}.`
    } else {
      const path = []
      let cur = target
      while (cur !== null) {
        path.unshift(cur)
        cur = prev.get(cur)
      }
      path.forEach((n) => sb.setNode(n, 'path'))
      for (let i = 0; i < path.length - 1; i++) {
        sb.setEdge(edgeKeyLocal(path[i], path[i + 1]), 'path')
      }
      sb.push(`Shortest path from ${source} to ${target}: ${path.join(' -> ')} (cost ${dist.get(target)}).`, {
        distances: mapToObj(dist),
      })
      summary = `Shortest Path from ${source} to ${target}: ${path.join(' -> ')} | Total Cost: ${dist.get(
        target
      )}`
    }
  } else {
    summary = `Shortest distances from ${source}: ${nodes
      .map((n) => `${n}=${finite(dist.get(n))}`)
      .join(', ')}`
  }

  return { steps: sb.result(), summary }
}

function edgeKeyLocal(u, v) {
  const a = String(u)
  const b = String(v)
  return a < b ? `${a}-${b}` : `${b}-${a}`
}

function finite(v) {
  return v === Infinity ? 'inf' : v
}

function mapToObj(m) {
  const o = {}
  m.forEach((v, k) => (o[k] = finite(v)))
  return o
}

export const meta = {
  id: 'dijkstra',
  label: "Dijkstra's Shortest Path",
  fullName: "Dijkstra's Shortest Path",
  needsSource: true,
  needsTarget: true,
}
