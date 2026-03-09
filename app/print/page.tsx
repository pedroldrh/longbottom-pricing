"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { PricingResult } from "@/lib/types"
import { formatMoney, formatPercent } from "@/lib/format"

export default function PrintPage() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<PricingResult | null>(null)

  useEffect(() => {
    const data = searchParams.get("data")
    if (data) {
      try {
        setResult(JSON.parse(decodeURIComponent(data)))
      } catch (e) {
        console.error("Failed to parse print data", e)
      }
    }
  }, [searchParams])

  const handlePrint = () => {
    window.print()
  }

  if (!result) {
    return <div className="p-8">Loading...</div>
  }

  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "Elohi Pricing Calculator"
  const brandLogo = process.env.NEXT_PUBLIC_BRAND_LOGO_URL
  const companyInfo = process.env.NEXT_PUBLIC_COMPANY_INFO
  const termsText = process.env.NEXT_PUBLIC_TERMS_TEXT

  return (
    <div className="min-h-screen bg-white">
      <div className="print:hidden fixed top-4 right-4 z-10">
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-lg"
        >
          Print / Save PDF
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <header className="border-b-2 border-gray-300 pb-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              {brandLogo && <img src={brandLogo || "/placeholder.svg"} alt={brandName} className="h-12 mb-4" />}
              <h1 className="text-3xl font-bold text-gray-900">{brandName}</h1>
              {companyInfo && <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{companyInfo}</p>}
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>Generated: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Product:</span> {result.sku.productName}
            </div>
            <div>
              <span className="font-medium">Temperature Class:</span> {result.sku.temperatureClass}
            </div>
            <div>
              <span className="font-medium">Lbs per Case:</span> {result.lbsPerCase.toFixed(2)}
            </div>
            <div>
              <span className="font-medium">Price per Lb:</span> {formatMoney(result.pricePerLb)}
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing by Tier</h2>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 border-b border-gray-300">
                  Metric
                </th>
                {result.tiers.map((tier) => (
                  <th
                    key={tier.tierLabel}
                    className="px-4 py-2 text-right text-xs font-medium text-gray-700 border-b border-gray-300"
                  >
                    {tier.tierLabel}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50">
                <td colSpan={5} className="px-4 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300">
                  Pricing
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-xs text-gray-900 border-b border-gray-200">Net Sell (w/o Delivery)</td>
                {result.tiers.map((tier, i) => (
                  <td
                    key={i}
                    className="px-4 py-2 text-xs text-gray-900 text-right border-b border-gray-200 font-medium"
                  >
                    {formatMoney(tier.netSellWODelivery)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-2 text-xs text-gray-900 border-b border-gray-200">Freight</td>
                {result.tiers.map((tier, i) => (
                  <td key={i} className="px-4 py-2 text-xs text-gray-900 text-right border-b border-gray-200">
                    {formatMoney(tier.freight)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-2 text-xs text-gray-900 border-b border-gray-300 font-medium">
                  Delivered Price
                </td>
                {result.tiers.map((tier, i) => (
                  <td
                    key={i}
                    className="px-4 py-2 text-xs text-gray-900 text-right border-b border-gray-300 font-medium"
                  >
                    {formatMoney(tier.deliveredPrice)}
                  </td>
                ))}
              </tr>

              <tr className="bg-gray-50">
                <td colSpan={5} className="px-4 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300">
                  Cost & GP (Before Trade)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-xs text-gray-900 border-b border-gray-200">COGS per Case</td>
                {result.tiers.map((tier, i) => (
                  <td key={i} className="px-4 py-2 text-xs text-gray-900 text-right border-b border-gray-200">
                    {formatMoney(tier.cogsPerCase)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-2 text-xs text-gray-900 border-b border-gray-300 font-medium">
                  GP Before Trade
                </td>
                {result.tiers.map((tier, i) => (
                  <td
                    key={i}
                    className="px-4 py-2 text-xs text-gray-900 text-right border-b border-gray-300 font-medium"
                  >
                    {formatMoney(tier.gpBeforeTrade)} ({formatPercent(tier.gpBeforeTradePct)})
                  </td>
                ))}
              </tr>

              <tr className="bg-gray-50">
                <td colSpan={5} className="px-4 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300">
                  Trade & Accruals
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-xs text-gray-900 border-b border-gray-200">Total Accruals</td>
                {result.tiers.map((tier, i) => (
                  <td
                    key={i}
                    className="px-4 py-2 text-xs text-gray-900 text-right border-b border-gray-300 font-medium"
                  >
                    {formatMoney(tier.accruals.total)}
                  </td>
                ))}
              </tr>

              <tr className="bg-gray-50">
                <td colSpan={5} className="px-4 py-2 text-xs font-semibold text-gray-900 border-b border-gray-300">
                  GP (After Trade)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-xs text-gray-900 font-medium">GP After Trade</td>
                {result.tiers.map((tier, i) => (
                  <td key={i} className="px-4 py-2 text-xs text-gray-900 text-right font-medium">
                    {formatMoney(tier.gpAfterTrade)} ({formatPercent(tier.gpAfterTradePct)})
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>

        <footer className="border-t-2 border-gray-300 pt-6 mt-12 text-xs text-gray-500">
          {termsText && <p className="mb-4 whitespace-pre-line">{termsText}</p>}
          <p className="mb-2">Confidential and proprietary. Internal business use only unless otherwise authorized by Elohi.</p>
          <p>Page 1 - Generated {new Date().toLocaleString()}</p>
        </footer>
      </div>
    </div>
  )
}
