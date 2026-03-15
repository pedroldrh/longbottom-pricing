"use client"

import { useState, useRef, useEffect } from "react"

interface Option {
  value: string
  label: string
}

interface CustomSelectProps {
  value: string
  options: Option[]
  onChange: (value: string) => void
  className?: string
}

export default function CustomSelect({ value, options, onChange, className }: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div ref={ref} className={`relative ${className || ""}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mt-1 w-full flex items-center justify-between sm:text-sm px-3 py-2 text-left"
        style={{
          background: "var(--input-bg)",
          border: "1px solid var(--lux-border)",
          borderRadius: "8px",
          color: "var(--text-primary)",
          cursor: "pointer",
          transition: "border-color 0.2s, box-shadow 0.2s",
          ...(open ? {
            borderColor: "var(--lux-accent)",
            boxShadow: "0 0 0 3px rgba(111, 183, 242, 0.2)",
          } : {}),
        }}
      >
        <span>{selected?.label || "Select..."}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="var(--lux-primary)"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-20 mt-1 w-full overflow-hidden"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--lux-border)",
            borderRadius: "8px",
            boxShadow: "0 8px 24px rgba(57, 48, 137, 0.12)",
          }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className="px-3 py-2 text-sm cursor-pointer transition-colors duration-100"
              style={{
                color: opt.value === value ? "var(--lux-primary)" : "var(--text-primary)",
                fontWeight: opt.value === value ? 600 : 400,
                background: opt.value === value ? "rgba(111, 183, 242, 0.1)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (opt.value !== value) {
                  e.currentTarget.style.background = "var(--bg-cream)"
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = opt.value === value ? "rgba(111, 183, 242, 0.1)" : "transparent"
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
