"use client"

import type { SKUInput } from "@/lib/types"

interface Step6Props {
  skus: SKUInput[]
}

export default function Step6Results({ skus }: Step6Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Final Price Output</h2>
        <p className="text-sm text-gray-600 mb-6">
          Review the completed pricing calculator. All pricing details are available in the
          Gross Profit after Trade Calculation step (Step 6).
        </p>

        {skus.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">SKUs configured:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {skus.map((sku, idx) => (
                <li key={idx}>{sku.productName || `SKU #${idx + 1}`}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No SKUs have been added yet.</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-blue-900">
          Use the <strong>Print / Save PDF</strong> functionality from your browser to export this pricing sheet.
        </p>
      </div>
    </div>
  )
}
