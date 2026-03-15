"use client"

import { useState } from "react"
// Old pricing engine (calculatePricing) has been removed.
// This parity testing page is no longer functional.

interface Fixture {
  name: string
  temperatureClass: "shelf" | "refrigerated" | "frozen"
  lbsPerUnit: number
  unitsPerCase: number
  basePricePerCase: number
  cogsPerLb: number
  volumeFeePct: number[]
  freightPerLb: {
    shelf: number[]
    refrigerated: number[]
    frozen: number[]
  }
  accrualPct: {
    distributor: number
    operator: number
    baseMarketing: number
    additionalMarketing: number
    deviatedBillback: number
  }
  expected: {
    tiers: Array<{
      netSellWO: number
      freight: number
      delivered: number
      gpBefore$: number
      gpBeforePct: number
      totalAccruals$: number
      gpAfter$: number
      gpAfterPct: number
    }>
  }
}

export default function ParityPage() {
  const [fixturesJson, setFixturesJson] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState("")

  const handleTest = async () => {
    setError("Parity testing is disabled. The old pricing engine has been removed. All calculations now live in Step6SKUPnL.")
    setResults([])
  }

  const exportMismatches = () => {
    const mismatches = results.flatMap((r) =>
      r.mismatches.map((m: any) => ({
        fixture: r.name,
        tier: m.tier,
        metric: m.metric,
        expected: m.expected,
        calculated: m.calculated,
        diff: m.diff,
      })),
    )

    const csv = [
      "Fixture,Tier,Metric,Expected,Calculated,Difference",
      ...mismatches.map((m) => `"${m.fixture}",${m.tier},"${m.metric}",${m.expected},${m.calculated},${m.diff}`),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "parity-mismatches.csv"
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Excel Parity Testing</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Paste Fixtures JSON</h2>
          <textarea
            value={fixturesJson}
            onChange={(e) => setFixturesJson(e.target.value)}
            placeholder="Paste JSON array of fixtures here..."
            className="w-full h-64 font-mono text-sm border border-gray-300 rounded-md p-4 focus:ring-blue-500 focus:border-blue-500"
          />

          {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

          <div className="mt-4 flex gap-4">
            <button
              onClick={handleTest}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Run Parity Tests
            </button>

            {results.length > 0 && results.some((r) => r.mismatches.length > 0) && (
              <button
                onClick={exportMismatches}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                Export Mismatches CSV
              </button>
            )}
          </div>
        </div>

        {results.length > 0 && (
          <div className="space-y-6">
            {results.map((result, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{result.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {result.passed ? "✓ Passed" : `✗ ${result.mismatches.length} Mismatches`}
                  </span>
                </div>

                {result.mismatches.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Tier</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Metric</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Expected</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Calculated</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Difference</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {result.mismatches.map((m: any, j: number) => (
                          <tr key={j}>
                            <td className="px-4 py-2 text-sm text-gray-900">T{m.tier}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{m.metric}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right">{m.expected.toFixed(4)}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right">{m.calculated.toFixed(4)}</td>
                            <td className="px-4 py-2 text-sm text-red-600 text-right font-medium">
                              {m.diff.toFixed(4)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
