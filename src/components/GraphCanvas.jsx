import React, { useMemo } from 'react'
import { layoutNodes, edgeKey } from '../utils/graphUtils.js'

const WIDTH = 640
const HEIGHT = 440

const NODE_STYLES = {
  default: { fill: '#0e161b', stroke: '#3a4a4f', text: '#d7e6e4', glow: false },
  frontier: { fill: '#241d0d', stroke: '#ffb454', text: '#ffb454', glow: 'amber' },
  active: { fill: '#0c2530', stroke: '#5ad7ff', text: '#5ad7ff', glow: 'ice' },
  finalized: { fill: '#0d2a1d', stroke: '#39ff9c', text: '#39ff9c', glow: 'signal' },
  path: { fill: '#0d2a1d', stroke: '#39ff9c', text: '#39ff9c', glow: 'signal' },
}

const EDGE_STYLES = {
  default: { stroke: '#233238', width: 2, dash: null, opacity: 0.8 },
  evaluating: { stroke: '#ffb454', width: 2.5, dash: '6 4', opacity: 1 },
  included: { stroke: '#39ff9c', width: 3, dash: null, opacity: 1 },
  rejected: { stroke: '#ff5c5c', width: 1.5, dash: '2 3', opacity: 0.45 },
  path: { stroke: '#39ff9c', width: 4.5, dash: null, opacity: 1 },
}

export default function GraphCanvas({ graph, frame }) {
  const positions = useMemo(() => layoutNodes(graph.nodes, WIDTH, HEIGHT), [graph.nodes])
  const nodeStates = frame?.nodeStates || {}
  const edgeStates = frame?.edgeStates || {}

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border bg-panel">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs uppercase tracking-widest text-muted">canvas</span>
        <Legend />
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" role="img" aria-label="Graph visualization">
        {/* edges */}
        {graph.edges.map(({ u, v, w }) => {
          const key = edgeKey(u, v)
          const style = EDGE_STYLES[edgeStates[key] || 'default']
          const p1 = positions[u]
          const p2 = positions[v]
          if (!p1 || !p2) return null
          const mx = (p1.x + p2.x) / 2
          const my = (p1.y + p2.y) / 2
          return (
            <g key={key}>
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={style.stroke}
                strokeWidth={style.width}
                strokeDasharray={style.dash || undefined}
                opacity={style.opacity}
                strokeLinecap="round"
              />
              <rect
                x={mx - 11}
                y={my - 10}
                width={22}
                height={16}
                rx={3}
                fill="#05080a"
                stroke={style.stroke}
                strokeWidth={1}
                opacity={0.9}
              />
              <text
                x={mx}
                y={my + 2}
                textAnchor="middle"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                fill={style.stroke}
              >
                {w}
              </text>
            </g>
          )
        })}

        {/* nodes */}
        {graph.nodes.map((id) => {
          const pos = positions[id]
          if (!pos) return null
          const style = NODE_STYLES[nodeStates[id] || 'default']
          return (
            <g key={id} transform={`translate(${pos.x}, ${pos.y})`}>
              {style.glow && (
                <circle r="22" fill="none" stroke={style.stroke} strokeWidth="1" opacity="0.35">
                  <animate attributeName="r" values="18;26;18" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="1.6s" repeatCount="indefinite" />
                </circle>
              )}
              <circle r="18" fill={style.fill} stroke={style.stroke} strokeWidth="2.5" />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="13"
                fontWeight="700"
                fontFamily="JetBrains Mono, monospace"
                fill={style.text}
              >
                {id}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function Legend() {
  const items = [
    ['#3a4a4f', 'idle'],
    ['#ffb454', 'frontier'],
    ['#5ad7ff', 'active'],
    ['#39ff9c', 'finalized'],
  ]
  return (
    <div className="hidden gap-3 sm:flex">
      {items.map(([color, label]) => (
        <span key={label} className="flex items-center gap-1 text-[10px] text-muted">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          {label}
        </span>
      ))}
    </div>
  )
}
