"use client"

import type { PricingResult } from "@/lib/types"
import { formatMoney, formatPercent } from "@/lib/format"

interface ResultsTableProps {
  result: PricingResult
}

export default function ResultsTable({ result }: ResultsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Pricing Results</h2>
        <p className="text-sm text-gray-600 mt-1">
          {result.sku.productName} • {result.lbsPerCase.toFixed(2)} lbs/case • {formatMoney(result.pricePerLb)}/lb
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
              {result.tiers.map((tier) => (
                <th
                  key={tier.tierLabel}
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {tier.tierLabel}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Pricing Section */}
            <tr className="bg-blue-50">
              <td colSpan={5} className="px-6 py-2 text-sm font-semibold text-gray-900">
                Pricing
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Net Sell (w/o Delivery)</td>
              {result.tiers.map((tier, i) => (
                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                  {formatMoney(tier.netSellWODelivery)}
                </td>
              ))}
            </tr>
            <tr className="bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Freight</td>
              {result.tiers.map((tier, i) => (
                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatMoney(tier.freight)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">Delivered Price</td>
              {result.tiers.map((tier, i) => (
                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                  {formatMoney(tier.deliveredPrice)}
                </td>
              ))}
            </tr>

            {/* Cost & GP Before Trade */}
            <tr className="bg-blue-50">
              <td colSpan={5} className="px-6 py-2 text-sm font-semibold text-gray-900">
                Cost & GP (Before Trade)
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">COGS per Case</td>
              {result.tiers.map((tier, i) => (
                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatMoney(tier.cogsPerCase)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">GP Before Trade</td>
              {result.tiers.map((tier, i) => (
                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                  {formatMoney(tier.gpBeforeTrade)} ({formatPercent(tier.gpBeforeTradePct)})
                </td>
              ))}
            </tr>

            {/* Trade & Accruals */}
            <tr className="bg-blue-50">
              <td colSpan={5} className="px-6 py-2 text-sm font-semibold text-gray-900">
                Trade & Accruals
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Distributor</td>
              {result.tiers.map((tier, i) => (
                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatMoney(tier.accruals.distributor)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Operator</td>
              {result.tiers.map((tier, i) => (
                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatMoney(tier.accruals.operator)}
                </td>
              ))}
            </tr>
            <tr className="bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Base Marketing</td>
              {result.tiers.map((tier, i) => (
                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatMoney(tier.accruals.baseMarketing)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Additional Marketing</td>
              {result.tiers.map((tier, i) => (
                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatMoney(tier.accruals.additionalMarketing)}
                </td>
              ))}
            </tr>
            <tr className="bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Deviated Billback</td>
              {result.tiers.map((tier, i) => (
                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatMoney(tier.accruals.deviatedBillback)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">Total Accruals</td>
              {result.tiers.map((tier, i) => (
                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                  {formatMoney(tier.accruals.total)}
                </td>
              ))}
            </tr>

            {/* GP After Trade */}
            <tr className="bg-blue-50">
              <td colSpan={5} className="px-6 py-2 text-sm font-semibold text-gray-900">
                GP (After Trade)
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">GP After Trade</td>
              {result.tiers.map((tier, i) => (
                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                  {formatMoney(tier.gpAfterTrade)} ({formatPercent(tier.gpAfterTradePct)})
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
