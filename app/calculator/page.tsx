import CalculatorForm from "@/components/CalculatorForm"

export default function CalculatorPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-cream)' }}>
      <header style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--lux-border)',
        boxShadow: '0 1px 8px rgba(57, 48, 137, 0.04)',
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-5">
          <img src="/elohi-logo.png" alt="Elohi" className="h-24 w-24" />
          <div>
            <h1 className="text-2xl font-bold" style={{
              fontFamily: 'Frank New, var(--font-heading), sans-serif',
              color: 'var(--text-primary)',
              fontWeight: 700,
              letterSpacing: '-0.01em',
            }}>
              Elohi Pricing Calculator
            </h1>
            <div style={{
              marginTop: '6px',
              height: '2px',
              width: '100%',
              background: 'linear-gradient(90deg, var(--lux-primary), var(--lux-accent))',
              borderRadius: '2px',
            }} />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CalculatorForm />
      </main>
    </div>
  )
}
