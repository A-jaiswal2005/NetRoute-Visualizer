# Graph Algorithm Visualizer

A single-page React (Vite) + Tailwind app that animates BFS, DFS, Dijkstra's
Shortest Path, Kruskal's MST, and Prim's MST on a weighted graph, step by
step, in a dark "network ops" aesthetic.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

Output goes to `dist/`. This repo already includes `netlify.toml`, so
dragging the folder into Netlify (or connecting the repo) deploys it with
zero extra configuration — build command `npm run build`, publish directory
`dist`.

## Architecture

```
src/
  algorithms/
    stepBuilder.js   # shared helper every algorithm uses to emit frames
    dsu.js           # Disjoint Set Union (Union-Find) for Kruskal
    bfs.js dfs.js dijkstra.js kruskal.js prim.js
    index.js         # registry — the only place new algorithms get wired in
  hooks/
    useAlgorithmPlayer.js  # the animation engine (setInterval-driven player)
  components/
    WelcomeModal.jsx  # startup popup: demo graph vs custom input
    Navbar.jsx         # algorithm selector buttons
    RunPanel.jsx        # source/target pickers + play/pause/step/speed
    GraphCanvas.jsx      # SVG rendering of nodes/edges, colored by frame
    OutputPanel.jsx       # console log + live state readout + final answer
  utils/graphUtils.js  # parsing, adjacency lists, circular layout, demo data
  App.jsx               # wires it all together
```

### How the animation engine works

Algorithms never touch the DOM. Each one is a pure function:

```js
run(graph, params) -> { steps: Step[], summary: string }
```

Every `Step` is a full, immutable snapshot:

```js
{
  nodeStates: { [nodeId]: 'default' | 'frontier' | 'active' | 'finalized' | 'path' },
  edgeStates: { [edgeKey]: 'default' | 'evaluating' | 'included' | 'rejected' | 'path' },
  message: string,   // pushed into the console log
  info: object | null, // optional live data (distances, queue, stack...)
}
```

`useAlgorithmPlayer` owns a `setInterval` loop that walks through the
`steps` array and exposes the current frame, along with play/pause/step/
reset/speed controls. `GraphCanvas` and `OutputPanel` are just renderers of
whatever frame the player hands them — they have no algorithm knowledge.

### Adding a new algorithm (e.g. Bellman-Ford, Topological Sort)

1. Create `src/algorithms/yourAlgorithm.js`:
   ```js
   import { StepBuilder } from './stepBuilder.js'

   export function run(graph, params) {
     const sb = new StepBuilder(graph.nodes, graph.edges)
     // ...mutate sb.setNode / sb.setEdge, call sb.push(message, info) per frame...
     return { steps: sb.result(), summary: 'Your final answer text' }
   }

   export const meta = {
     id: 'bellman-ford',
     label: 'Bellman-Ford',
     fullName: 'Bellman-Ford Shortest Path',
     needsSource: true,
   }
   ```
2. Add it to `src/algorithms/index.js`:
   ```js
   import * as bellmanFord from './bellmanFord.js'
   export const ALGORITHMS = [bfs, dfs, dijkstra, kruskal, prim, bellmanFord]
   ```

Nothing in `App.jsx`, `Navbar.jsx`, `RunPanel.jsx`, `GraphCanvas.jsx`, or the
player hook needs to change — the navbar button, source/target fields, and
animation all derive from `meta` and the returned `steps`.

### Disjoint Set Union

`src/algorithms/dsu.js` exports a standalone `DSU` class (path compression +
union by rank) used by Kruskal's algorithm for cycle detection, and it's
reusable for any future algorithm that needs union-find.
