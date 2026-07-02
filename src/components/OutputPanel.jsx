import React, { useEffect, useRef } from 'react'

export default function OutputPanel({ log, info, summary, isFinished }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [log])

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-panel">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs uppercase tracking-widest text-muted">console</span>
        <span
          className={`h-2 w-2 rounded-full ${
            isFinished ? 'bg-signal shadow-glow' : 'bg-amber animate-blink'
          }`}
        />
      </div>

      <div ref={scrollRef} className="flex-1 space-y-1 overflow-y-auto px-4 py-3 text-xs leading-relaxed">
        {log.length === 0 && <p className="text-muted">Awaiting execution... select an algorithm and hit Run.</p>}
        {log.map((line, i) => (
          <p key={i} className="console-line text-text/90">
            {line}
          </p>
        ))}
      </div>

      {info && Object.keys(info).length > 0 && (
        <div className="border-t border-border px-4 py-2 text-[11px] text-ice">
          {Object.entries(info).map(([k, v]) => (
            <div key={k} className="flex gap-2 overflow-hidden">
              <span className="shrink-0 text-muted">{k}:</span>
              <span className="truncate">{Array.isArray(v) ? v.join(', ') : JSON.stringify(v)}</span>
            </div>
          ))}
        </div>
      )}

      {summary && isFinished && (
        <div className="border-t border-signal/40 bg-signal/10 px-4 py-3 text-sm font-semibold text-signal text-glow">
          {summary}
        </div>
      )}
    </div>
  )
}
