# NetRoute-Visualizer

An interactive, full-stack graph theory and network routing visualization suite built with React.js and Tailwind CSS. This application bridges the gap between competitive programming concepts and real-world network routing infrastructure, designed to be deployed instantly as a static web app on Netlify.

## 🌟 Key Features
* **Interactive Landing Experience:** Welcomes users with an intuitive modal portal offering immediate options to initialize a 6-node pre-configured network topology or input custom adjacency lists (`u v weight`).
* **Core Network & Graph Algorithms:** Step-by-step visualizers for critical routing and spanning tree algorithms:
  * **Dijkstra's Algorithm** (Shortest Path / OSPF Protocol simulation)
  * **Kruskal's & Prim's Algorithms** (Minimum Spanning Tree / Spanning Tree Protocol simulation utilizing an optimized Disjoint Set Union data structure)
  * **Breadth-First Search (BFS) & Depth-First Search (DFS)** (Network broadcasting and structural traversal animations)
* **Decoupled Animation Engine:** Implements a state-driven execution loop that buffers algorithmic snapshots to dynamically highlight processing nodes (evaluating vs. finalized states) without halting the UI main thread.
* **Hacker-Aesthetic Dashboard:** Built with a fully responsive, enterprise-grade dark UI using Tailwind CSS, complete with a live console panel printing final operational metrics and paths.

## 🛠️ Tech Stack
* **Frontend:** React.js (Vite)
* **Styling:** Tailwind CSS
* **Deployment:** Netlify (Static Hosting)
