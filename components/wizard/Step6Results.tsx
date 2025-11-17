"use client"

import ClientPriceSheet from "../ClientPriceSheet"
import type { PricingResult, SKUInput } from "@/lib/types"

interface Step6Props {
  skus: SKUInput[]
  results: PricingResult[]
  onCalculate: () => void
  isCalculating: boolean
}

export default function Step6Results({ skus, results, onCalculate, isCalculating }: Step6Props) {
  const isValid = skus.length > 0 && skus.every((sku) => sku.productName && sku.lbsPerUnit > 0 && sku.basePricePerCase >= 0)

  const handlePrint = () => {
    if (results.length > 0) {
      window.print()
    }
  }

  const handleExport = () => {
    if (results.length === 0) return
    
    // Create CSV content
    const headers = [
      'Product Name',
      'Temperature',
      'Lbs/Case',
      'Full Truckload',
      'Half Truckload',
      'Quarter Truckload',
      'One Pallet',
      'Dropship'
    ]
    
    const rows = results.map(result => [
      result.sku.productName,
      result.sku.temperatureClass,
      result.lbsPerCase.toFixed(2),
      ...result.tiers.map(tier => tier.deliveredPrice.toFixed(2))
    ])
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'price-sheet.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Final Price Output</h2>
        <p className="text-sm text-gray-600 mb-6">
          Client-ready pricing sheet showing delivered prices per case across all shipping tiers.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onCalculate}
            disabled={!isValid || isCalculating}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            {isCalculating ? "Calculating..." : results.length > 0 ? "Recalculate" : "Calculate"}
          </button>
          {results.length > 0 && (
            <>
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                Print / Save PDF
              </button>
              <button
                onClick={handleExport}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium"
              >
                Export CSV
              </button>
            </>
          )}
        </div>
      </div>

      {results.length > 0 && (
        <ClientPriceSheet results={results} />
      )}

      {results.length === 0 && !isCalculating && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-900">Click "Calculate" to generate pricing results for your SKUs.</p>
        </div>
      )}
    </div>
  )
}
