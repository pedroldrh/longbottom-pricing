"use client"

import type { PricingResult } from "@/lib/types"
import { formatMoney } from "@/lib/format"

interface ClientPriceSheetProps {
  results: PricingResult[]
}

export default function ClientPriceSheet({ results }: ClientPriceSheetProps) {
  const tierLabels = results[0]?.tiers.map(t => t.tierLabel) || []
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden print:shadow-none">
      <div className="px-6 py-4 border-b border-gray-200 print:border-gray-400">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Price Sheet</h1>
            <p className="text-sm text-gray-600 mt-1">Delivered pricing per case</p>
          </div>
          {process.env.NEXT_PUBLIC_BRAND_LOGO_URL && (
            <img 
              src={process.env.NEXT_PUBLIC_BRAND_LOGO_URL || "/placeholder.svg"} 
              alt={process.env.NEXT_PUBLIC_BRAND_NAME || 'Logo'}
              className="h-12 object-contain"
            />
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 print:bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                Product Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                Temp
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                Lbs/Case
              </th>
              {tierLabels.map((label) => (
                <th
                  key={label}
                  className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result, idx) => (
              <tr key={idx} className="hover:bg-gray-50 print:hover:bg-white">
                <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                  {result.sku.productName}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 border-r border-gray-200 capitalize">
                  {result.sku.temperatureClass}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 text-right border-r border-gray-200 font-mono">
                  {result.lbsPerCase.toFixed(2)}
                </td>
                {result.tiers.map((tier, tIdx) => (
                  <td 
                    key={tIdx} 
                    className="px-4 py-4 text-sm font-semibold text-gray-900 text-right border-r border-gray-200 last:border-r-0 font-mono"
                  >
                    {formatMoney(tier.deliveredPrice)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 print:bg-white print:border-gray-400">
        <div className="text-xs text-gray-600 space-y-1">
          {process.env.NEXT_PUBLIC_COMPANY_INFO && (
            <p>{process.env.NEXT_PUBLIC_COMPANY_INFO}</p>
          )}
          {process.env.NEXT_PUBLIC_TERMS_TEXT && (
            <p className="text-gray-500">{process.env.NEXT_PUBLIC_TERMS_TEXT}</p>
          )}
        </div>
      </div>
    </div>
  )
}
