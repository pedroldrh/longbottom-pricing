"use client"

import { useState, useRef, useEffect } from "react"

interface InfoTipProps {
  text: string
}

export default function InfoTip({ text }: InfoTipProps) {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!show) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [show])

  return (
    <span ref={ref} className="relative inline-flex ml-1.5">
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold leading-none transition-colors"
        style={{
          background: show ? "var(--lux-primary)" : "#c4bdd4",
          color: "#fff",
        }}
        aria-label="More info"
      >
        i
      </button>
      {show && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 w-64 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg leading-relaxed">
          {text}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
        </div>
      )}
    </span>
  )
}
