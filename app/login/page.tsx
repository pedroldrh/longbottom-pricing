'use client'

import { login } from "@/app/actions"
import { useState } from "react"
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-cream)' }}>
      <div className="max-w-md w-full space-y-8 p-10" style={{
        background: 'var(--bg-card)',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(57, 48, 137, 0.08), 0 1px 4px rgba(57, 48, 137, 0.04)',
        borderTop: '4px solid var(--lux-accent)',
        border: '1px solid var(--lux-border)',
        borderTopColor: 'var(--lux-primary)',
        borderTopWidth: '4px',
      }}>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/elohi-logo.png" alt="Elohi" className="h-20 w-20" />
          </div>
          <h2 className="text-3xl font-bold" style={{
            fontFamily: 'var(--font-heading), Fraunces, serif',
            color: 'var(--text-primary)',
            fontWeight: 700,
          }}>
            Elohi Pricing Calculator
          </h2>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div style={{ height: '1px', width: '60px', background: 'var(--lux-primary)' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--lux-primary)' }} />
            <div style={{ height: '1px', width: '60px', background: 'var(--lux-primary)' }} />
          </div>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body), DM Sans, sans-serif' }}>
            Enter password to access calculator
          </p>
          <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            Confidential and proprietary. Authorized business use only.
          </p>
        </div>
        <form action={login} className="mt-8 space-y-6">
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="appearance-none relative block w-full px-4 py-3 pr-10 text-sm"
              placeholder="Password"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--lux-border)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              style={{ color: 'var(--text-muted)' }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white transition-colors duration-200"
            style={{
              background: 'var(--lux-primary)',
              borderRadius: '8px',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-light)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--lux-primary)')}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
