import React, { useMemo, useState, useCallback } from 'react'
import WelcomeModal from './components/WelcomeModal.jsx'
import Navbar from './components/Navbar.jsx'
import RunPanel from './components/RunPanel.jsx'
import GraphCanvas from './components/GraphCanvas.jsx'
import OutputPanel from './components/OutputPanel.jsx'
import { DEMO_GRAPH } from './utils/graphUtils.js'
import { getAlgorithm } from './algorithms/index.js'
import { useAlgorithmPlayer } from './hooks/useAlgorithmPlayer.js'

// Finds the node in `nodes` that matches a raw value coming out of a
// <select>, coercing string vs number so "3" matches the number 3.
function coerceNode(nodes, raw) {
  return nodes.find((n) => String(n) === String(raw)) ?? nodes[0]
}

export default function App() {
  const [graph, setGraph] = useState(null)
  const [activeAlgoId, setActiveAlgoId] = useState('bfs')
  const [source, setSource] = useState(null)
  const [target, setTarget] = useState(null)
  const [runError, setRunError] = useState('')
  const [steps, setSteps] = useState([])
  const [summary, setSummary] = useState('')

  const player = useAlgorithmPlayer(steps, { intervalMs: 500 })
  const algoMeta = useMemo(() => getAlgorithm(activeAlgoId)?.meta, [activeAlgoId])

  const startGraph = useCallback((g) => {
    setGraph(g)
    setSteps([])
    setSummary('')
    setRunError('')
    setActiveAlgoId('bfs')
    setSource(g.nodes[0] ?? null)
    setTarget(g.nodes[1] ?? g.nodes[0] ?? null)
  }, [])

  function handleSelectAlgo(id) {
    setActiveAlgoId(id)
    setSteps([])
    setSummary('')
    setRunError('')
  }

  function handleRun() {
    const algo = getAlgorithm(activeAlgoId)
    if (!algo || !graph) return
    try {
      const { steps: newSteps, summary: newSummary } = algo.run(graph, { source, target })
      setSteps(newSteps)
      setSummary(newSummary)
      setRunError('')
    } catch (err) {
      setRunError(err.message || 'Algorithm failed to run.')
      setSteps([])
      setSummary('')
    }
  }

  return (
    <div className="min-h-screen bg-void text-text">
      {!graph && (
        <WelcomeModal
          onLoadDemo={() => startGraph(DEMO_GRAPH)}
          onLoadCustom={(g) => startGraph(g)}
        />
      )}

      {graph && (
        <div className="flex min-h-screen flex-col">
          <Navbar activeId={activeAlgoId} onSelect={handleSelectAlgo} onNewGraph={() => setGraph(null)} />
          <RunPanel
            algoMeta={algoMeta}
            nodes={graph.nodes}
            source={source}
            target={target}
            onSourceChange={(v) => setSource(coerceNode(graph.nodes, v))}
            onTargetChange={(v) => setTarget(coerceNode(graph.nodes, v))}
            onRun={handleRun}
            player={player}
          />

          <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <GraphCanvas graph={graph} frame={player.frame} />
              {runError && (
                <p className="mt-3 rounded border border-alert/40 bg-alert/10 px-3 py-2 text-sm text-alert">
                  {runError}
                </p>
              )}
            </div>
            <div className="h-[360px] lg:h-auto">
              <OutputPanel
                log={player.log}
                info={player.frame?.info}
                summary={summary}
                isFinished={player.isFinished}
              />
            </div>
          </main>

          <footer className="border-t border-border px-4 py-3 text-center text-[11px] text-muted">
            Modular execution engine — algorithms emit steps, the player animates them. Add new
            algorithms in <code className="text-signal-dim">src/algorithms/</code> without touching the UI.
          </footer>
        </div>
      )}
    </div>
  )
}
