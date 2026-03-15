"use client"

import { useEffect, useRef } from "react"

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "info"
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "info",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, onCancel])

  if (!open) return null

  const isDanger = variant === "danger"

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onCancel()
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl p-0 overflow-hidden"
        style={{
          background: "var(--bg-card)",
          boxShadow: "0 20px 60px rgba(57, 48, 137, 0.15), 0 4px 16px rgba(0,0,0,0.08)",
          border: "1px solid var(--lux-border)",
          animation: "modal-in 0.2s ease-out",
        }}
      >
        {/* Top accent bar */}
        <div
          className="h-1.5"
          style={{
            background: isDanger
              ? "linear-gradient(90deg, var(--elohi-fuchsia), var(--elohi-blush))"
              : "linear-gradient(90deg, var(--elohi-pistachio), var(--elohi-mint))",
          }}
        />

        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: isDanger ? "#fde8ec" : "var(--elohi-pistachio)",
              }}
            >
              {isDanger ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#E41C50" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#00BC70" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              )}
            </div>
          </div>

          {/* Title */}
          <h3
            className="text-lg font-bold text-center mb-2"
            style={{
              fontFamily: "Frank New, var(--font-heading), sans-serif",
              color: "var(--text-primary)",
            }}
          >
            {title}
          </h3>

          {/* Message */}
          <p
            className="text-sm text-center mb-6"
            style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
          >
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors"
              style={{
                background: "var(--bg-cream)",
                color: "var(--text-secondary)",
                border: "1px solid var(--lux-border)",
              }}
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg text-white transition-colors"
              style={{
                background: isDanger ? "var(--elohi-fuchsia)" : "var(--elohi-mint)",
                color: isDanger ? "#fff" : "#fff",
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
