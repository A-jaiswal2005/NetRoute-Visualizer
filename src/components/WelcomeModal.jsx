import React, { useState } from 'react'
import { parseGraphInput } from '../utils/graphUtils.js'

export default function WelcomeModal({ onLoadDemo, onLoadCustom }) {
  const [mode, setMode] = useState('choose') // 'choose' | 'input'
  const [text, setText] = useState('1 2 5\n2 3 3\n1 3 8\n3 4 2')
  const [error, setError] = useState('')

  function handleSubmit() {
    try {
      const graph = parseGraphInput(text)
      setError('')
      onLoadCustom(graph)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-lg border border-border bg-panel shadow-glow">
        <div className="border-b border-border px-6 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-signal-dim">system // boot</p>
          <h1 className="mt-1 text-xl sm:text-2xl font-bold text-signal text-glow">
            Welcome to the world of the graph
          </h1>
          <p className="mt-2 text-sm text-muted">
            Load a network, then watch BFS, DFS, Dijkstra, Kruskal, and Prim traverse it live.
          </p>
        </div>

        {mode === 'choose' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
            <button
              onClick={onLoadDemo}
              className="group rounded-md border border-border bg-panel-raised px-4 py-6 text-left transition hover:border-signal hover:shadow-glow"
            >
              <span className="block text-2xl">▣</span>
              <span className="mt-3 block font-semibold text-text group-hover:text-signal">
                Run Demo Graph
              </span>
              <span className="mt-1 block text-xs text-muted">
                Instantly load a hardcoded 6-node weighted network.
              </span>
            </button>
            <button
              onClick={() => setMode('input')}
              className="group rounded-md border border-border bg-panel-raised px-4 py-6 text-left transition hover:border-ice hover:shadow-glow-ice"
            >
              <span className="block text-2xl">✎</span>
              <span className="mt-3 block font-semibold text-text group-hover:text-ice">
                Give Input Graph
              </span>
              <span className="mt-1 block text-xs text-muted">
                Type your own edges as "u v weight", one per line.
              </span>
            </button>
          </div>
        )}

        {mode === 'input' && (
          <div className="p-6 space-y-3">
            <label className="block text-xs uppercase tracking-widest text-muted">
              Edge list — one per line: <span className="text-ice">u v weight</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              spellCheck={false}
              className="w-full resize-none rounded-md border border-border bg-void px-3 py-2 font-mono text-sm text-text outline-none focus:border-ice"
              placeholder={'1 2 5\n2 3 3\n1 3 8'}
            />
            {error && (
              <p className="rounded border border-alert/40 bg-alert/10 px-3 py-2 text-sm text-alert">
                {error}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={handleSubmit}
                className="flex-1 rounded-md bg-signal px-4 py-2 font-semibold text-void transition hover:shadow-glow"
              >
                Load Graph
              </button>
              <button
                onClick={() => setMode('choose')}
                className="flex-1 rounded-md border border-border px-4 py-2 font-semibold text-muted transition hover:border-wire hover:text-text"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
