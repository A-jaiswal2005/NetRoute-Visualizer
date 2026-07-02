import React from 'react'

export default function RunPanel({
  algoMeta,
  nodes,
  source,
  target,
  onSourceChange,
  onTargetChange,
  onRun,
  player,
}) {
  const { isPlaying, isFinished, total, index, play, pause, reset, stepForward, stepBack, speed, setSpeed } =
    player

  return (
    <div className="flex flex-col gap-3 border-b border-border bg-panel-raised px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs uppercase tracking-widest text-muted">
          {algoMeta ? algoMeta.fullName : 'Select an algorithm'}
        </span>

        {algoMeta?.needsSource && (
          <label className="flex items-center gap-2 text-xs text-muted">
            source
            <select
              value={source}
              onChange={(e) => onSourceChange(e.target.value)}
              className="rounded border border-border bg-void px-2 py-1 text-text outline-none focus:border-signal"
            >
              {nodes.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}

        {algoMeta?.needsTarget && (
          <label className="flex items-center gap-2 text-xs text-muted">
            target
            <select
              value={target}
              onChange={(e) => onTargetChange(e.target.value)}
              className="rounded border border-border bg-void px-2 py-1 text-text outline-none focus:border-signal"
            >
              {nodes.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}

        <button
          onClick={onRun}
          disabled={!algoMeta}
          className="rounded-md bg-signal px-4 py-1.5 text-sm font-semibold text-void transition enabled:hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-40"
        >
          ▶ Run
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={stepBack}
          disabled={total === 0}
          className="rounded border border-border px-2 py-1 text-sm text-muted transition hover:border-wire hover:text-text disabled:opacity-30"
          title="Step back"
        >
          ⏮
        </button>
        <button
          onClick={isPlaying ? pause : play}
          disabled={total === 0}
          className="rounded border border-border px-3 py-1 text-sm font-semibold text-signal transition hover:border-signal disabled:opacity-30"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          onClick={stepForward}
          disabled={total === 0}
          className="rounded border border-border px-2 py-1 text-sm text-muted transition hover:border-wire hover:text-text disabled:opacity-30"
          title="Step forward"
        >
          ⏭
        </button>
        <button
          onClick={reset}
          disabled={total === 0}
          className="rounded border border-border px-2 py-1 text-sm text-muted transition hover:border-wire hover:text-text disabled:opacity-30"
          title="Restart"
        >
          ⟲
        </button>

        <label className="ml-2 flex items-center gap-2 text-xs text-muted">
          speed
          <input
            type="range"
            min="150"
            max="1500"
            step="50"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="accent-signal"
          />
        </label>

        <span className="w-16 shrink-0 text-right text-xs text-muted">
          {total > 0 ? `${index + 1}/${total}` : '0/0'}
          {isFinished ? ' ✓' : ''}
        </span>
      </div>
    </div>
  )
}
