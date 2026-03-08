"use client"

import type { Settings } from "@/lib/types"

interface Step4Props {
  data: {
    tradeSpendPct: number
  }
  onChange: (data: Step4Props["data"]) => void
}

export default function Step4TradeSpend({ data, onChange }: Step4Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Trade Spend</h2>
        <p className="text-sm text-gray-600 mt-1">
          Configure the percentage of revenue set aside for marketing and sales activities.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="tradeSpend" className="block text-sm font-medium text-gray-700">
          Trade spend / marketing accrual (%)
        </label>
        <input
          type="number"
          id="tradeSpend"
          step="0.1"
          min="0"
          max="100"
          value={data.tradeSpendPct}
          onChange={(e) => onChange({ tradeSpendPct: Number.parseFloat(e.target.value) || 0 })}
          className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          This is the % of revenue set aside for marketing and sales activities. It is built into the pricing so it
          does not reduce the reported margin.
        </p>
      </div>
    </div>
  )
}
