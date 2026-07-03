import React from 'react'
import { ALGORITHMS } from '../algorithms/index.js'

export default function Navbar({ activeId, onSelect, onNewGraph }) {
  return (
    <nav className="border-b border-border bg-panel/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl animate-pulse-slow">🌐</span>
          <h1 className="font-bold tracking-tight text-text">
          NetRoute<span className="text-signal">-</span>Visualizer
        </h1>
        </div>

        <div className="flex flex-1 flex-wrap gap-2 sm:justify-center">
          {ALGORITHMS.map(({ meta }) => {
            const isActive = activeId === meta.id
            return (
              <button
                key={meta.id}
                onClick={() => onSelect(meta.id)}
                title={meta.fullName}
                className={`rounded-md border px-3 py-2 text-xs sm:text-sm font-semibold transition ${
                  isActive
                    ? 'border-signal bg-signal/10 text-signal shadow-glow'
                    : 'border-border text-muted hover:border-wire hover:text-text'
                }`}
              >
                {meta.label}
              </button>
            )
          })}
        </div>

        <button
          onClick={onNewGraph}
          className="rounded-md border border-border px-3 py-2 text-xs sm:text-sm font-semibold text-muted transition hover:border-amber hover:text-amber"
        >
          ⟲ New Graph
        </button>
      </div>
    </nav>
  )
}
