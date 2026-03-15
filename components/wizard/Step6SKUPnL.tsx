"use client"

import type { SKUInput, SKUPnLInputs } from "@/lib/types"
import type { TradeSpendData } from "./Step4TradeSpend"

const TIER_HEADERS = [
  { label: "Tier 1", sub: "20 pallets, Full Truck Load" },
  { label: "Tier 2", sub: "10 pallets, 1/2 Truck Load" },
  { label: "Tier 3", sub: "4 pallets, ~4,000 lbs" },
  { label: "Tier 4", sub: "1 pallet, ~1,000 lbs" },
  { label: "Tier 5", sub: "1-case Min" },
]

interface Step6Props {
  skus: SKUInput[]
  shippingData: {
    tierLabels: string[]
    volumeFeePerCase: number[]
  }
  tradeSpendData: TradeSpendData
  pnlInputs: SKUPnLInputs[]
  onChange: (inputs: SKUPnLInputs[]) => void
}

function emptyPnlInputs(): SKUPnLInputs {
  return {
    cogsPerCase: 0,
    freightPerTier: [0, 0, 0, 0, 0],
    lumpersPerTier: [0, 0, 0, 0, 0],
    damagesPerTier: [0, 0, 0, 0, 0],
  }
}

function fmt$(v: number): string {
  return `$${v.toFixed(2)}`
}

function fmtPct(v: number): string {
  return `${v.toFixed(1)}%`
}

export default function Step6SKUPnL({ skus, shippingData, tradeSpendData, pnlInputs, onChange }: Step6Props) {
  if (skus.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">SKU P&L Calculator</h2>
        <p className="text-sm text-gray-600">
          No SKUs have been added yet. Please go back to <strong>Step 2 (Product Set-Up)</strong> to add SKUs before using this page.
        </p>
      </div>
    )
  }

  const updateSKU = (skuIndex: number, field: keyof SKUPnLInputs, value: number, tierIndex?: number) => {
    const updated = pnlInputs.map((inp, i) => {
      if (i !== skuIndex) return inp
      const copy = { ...inp }
      if (field === "cogsPerCase") {
        copy.cogsPerCase = value
      } else {
        const arr = [...(copy[field] as number[])]
        arr[tierIndex!] = value
        ;(copy as any)[field] = arr
      }
      return copy
    })
    onChange(updated)
  }

  const volFeePcts = shippingData.volumeFeePerCase // whole numbers like 0, 2, 4, 8, 12

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900">SKU P&L Calculator</h2>
        <p className="text-sm text-gray-600 mt-1">
          Review the per-SKU profitability waterfall across all 5 shipping tiers.
          Yellow cells are editable inputs. Gray cells are calculated automatically.
        </p>
      </div>

      {skus.map((sku, skuIdx) => {
        const inputs = pnlInputs[skuIdx] || emptyPnlInputs()
        const basePrice = sku.basePricePerCase

        // Pre-compute per-tier values
        const tiers = Array.from({ length: 5 }, (_, t) => {
          const volFeePct = volFeePcts[t] / 100
          const volFee$ = basePrice * volFeePct
          const netSell = basePrice + volFee$

          const freight = inputs.freightPerTier[t]
          const lumpers = inputs.lumpersPerTier[t]
          const damages = inputs.damagesPerTier[t]

          const deliveredSell = netSell + freight + lumpers + damages
          const cogsTotal = inputs.cogsPerCase + freight + lumpers + damages

          const gpBeforeTrade = netSell - inputs.cogsPerCase
          const gpBeforeTradePct = netSell !== 0 ? (gpBeforeTrade / netSell) * 100 : 0

          // Trade spend calculations
          const distTrade$ = netSell * (tradeSpendData.distributorTradeAccrual / 100)
          const opTrade$ = netSell * (tradeSpendData.operatorTradeAccrual / 100)
          const distMktg$ = netSell * (tradeSpendData.distributorMarketingAccrual / 100)
          const opMktg$ = netSell * (tradeSpendData.operatorMarketingAccrual / 100)
          const devBillback$ = netSell * (tradeSpendData.deviatedBillback / 100)

          const netTradePct =
            tradeSpendData.distributorTradeAccrual +
            tradeSpendData.operatorTradeAccrual +
            tradeSpendData.distributorMarketingAccrual +
            tradeSpendData.operatorMarketingAccrual +
            tradeSpendData.deviatedBillback
          const netTrade$ = distTrade$ + opTrade$ + distMktg$ + opMktg$ + devBillback$

          const gpAfterTrade = gpBeforeTrade - netTrade$
          const gpAfterTradePct = netSell !== 0 ? (gpAfterTrade / netSell) * 100 : 0

          return {
            volFeePct: volFeePcts[t],
            volFee$,
            netSell,
            freight,
            lumpers,
            damages,
            deliveredSell,
            cogsTotal,
            gpBeforeTrade,
            gpBeforeTradePct,
            distTrade$,
            opTrade$,
            distMktg$,
            opMktg$,
            devBillback$,
            netTradePct,
            netTrade$,
            gpAfterTrade,
            gpAfterTradePct,
          }
        })

        return (
          <div key={skuIdx} className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {sku.productName || `SKU ${skuIdx + 1}`}
              {sku.vendorItemNumber && (
                <span className="text-sm font-normal text-gray-500 ml-2">({sku.vendorItemNumber})</span>
              )}
            </h3>

            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full border-collapse text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2 pr-3 font-semibold text-gray-900 w-56 whitespace-nowrap">
                      Line Item
                    </th>
                    {TIER_HEADERS.map((tier, t) => (
                      <th key={t} className="text-right py-2 px-2 font-semibold text-gray-900 whitespace-nowrap">
                        <div>{tier.label}</div>
                        <div className="font-normal text-xs text-gray-500">{tier.sub}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Base Price */}
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-3 font-medium text-gray-700">Base Price / Case</td>
                    {tiers.map((_, t) => (
                      <td key={t} className="py-2 px-2 text-right bg-gray-50 text-gray-700">{fmt$(basePrice)}</td>
                    ))}
                  </tr>

                  {/* Volume Based Fees % */}
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-3 text-gray-600">Volume Based Fees (%)</td>
                    {tiers.map((tier, t) => (
                      <td key={t} className="py-2 px-2 text-right bg-gray-50 text-gray-600">{fmtPct(tier.volFeePct)}</td>
                    ))}
                  </tr>

                  {/* Volume Based Fees $ */}
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-3 text-gray-600">Volume Based Fees ($)</td>
                    {tiers.map((tier, t) => (
                      <td key={t} className="py-2 px-2 text-right bg-gray-50 text-gray-600">{fmt$(tier.volFee$)}</td>
                    ))}
                  </tr>

                  {/* Net Sell Price */}
                  <tr className="border-b-2 border-gray-300">
                    <td className="py-2 pr-3 font-medium text-gray-900">Net Sell Price (w/o Delivery)</td>
                    {tiers.map((tier, t) => (
                      <td key={t} className="py-2 px-2 text-right bg-gray-50 font-medium text-gray-900">{fmt$(tier.netSell)}</td>
                    ))}
                  </tr>

                  {/* COGS input - same across tiers */}
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-3 font-medium text-gray-700">COGS ($/cs.)</td>
                    {tiers.map((_, t) => (
                      <td key={t} className="py-1 px-1">
                        {t === 0 ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={inputs.cogsPerCase || ""}
                            onChange={(e) => updateSKU(skuIdx, "cogsPerCase", parseFloat(e.target.value) || 0)}
                            className="w-full rounded border border-gray-300 bg-yellow-100 text-right px-2 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="0.00"
                          />
                        ) : (
                          <div className="text-right px-2 py-1 bg-gray-50 text-gray-600 rounded">{fmt$(inputs.cogsPerCase)}</div>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Freight Charge */}
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-3 text-gray-700">Freight Charge</td>
                    {tiers.map((_, t) => (
                      <td key={t} className="py-1 px-1">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={inputs.freightPerTier[t] || ""}
                          onChange={(e) => updateSKU(skuIdx, "freightPerTier", parseFloat(e.target.value) || 0, t)}
                          className="w-full rounded border border-gray-300 bg-yellow-100 text-right px-2 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </td>
                    ))}
                  </tr>

                  {/* Lumpers Fee */}
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-3 text-gray-700">Lumpers Fee</td>
                    {tiers.map((_, t) => (
                      <td key={t} className="py-1 px-1">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={inputs.lumpersPerTier[t] || ""}
                          onChange={(e) => updateSKU(skuIdx, "lumpersPerTier", parseFloat(e.target.value) || 0, t)}
                          className="w-full rounded border border-gray-300 bg-yellow-100 text-right px-2 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </td>
                    ))}
                  </tr>

                  {/* Damages Fee */}
                  <tr className="border-b-2 border-gray-300">
                    <td className="py-2 pr-3 text-gray-700">Damages Fee</td>
                    {tiers.map((_, t) => (
                      <td key={t} className="py-1 px-1">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={inputs.damagesPerTier[t] || ""}
                          onChange={(e) => updateSKU(skuIdx, "damagesPerTier", parseFloat(e.target.value) || 0, t)}
                          className="w-full rounded border border-gray-300 bg-yellow-100 text-right px-2 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </td>
                    ))}
                  </tr>

                  {/* Delivered Sell Price */}
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-3 font-medium text-gray-900">Delivered Sell Price</td>
                    {tiers.map((tier, t) => (
                      <td key={t} className="py-2 px-2 text-right bg-gray-50 font-medium text-gray-900">{fmt$(tier.deliveredSell)}</td>
                    ))}
                  </tr>

                  {/* COGS (total) */}
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-3 text-gray-700">COGS (total)</td>
                    {tiers.map((tier, t) => (
                      <td key={t} className="py-2 px-2 text-right bg-gray-50 text-gray-700">{fmt$(tier.cogsTotal)}</td>
                    ))}
                  </tr>

                  {/* GP Before Trade $ */}
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-3 font-medium text-gray-900">Manufacturer GP ($) Before Trade</td>
                    {tiers.map((tier, t) => (
                      <td key={t} className={`py-2 px-2 text-right bg-gray-50 font-medium ${tier.gpBeforeTrade >= 0 ? "text-green-700" : "text-red-600"}`}>
                        {fmt$(tier.gpBeforeTrade)}
                      </td>
                    ))}
                  </tr>

                  {/* GP Before Trade % */}
                  <tr className="border-b-2 border-gray-300">
                    <td className="py-2 pr-3 font-medium text-gray-900">Manufacturer GP (%) Before Trade</td>
                    {tiers.map((tier, t) => (
                      <td key={t} className={`py-2 px-2 text-right bg-gray-50 font-medium ${tier.gpBeforeTradePct >= 0 ? "text-green-700" : "text-red-600"}`}>
                        {fmtPct(tier.gpBeforeTradePct)}
                      </td>
                    ))}
                  </tr>

                  {/* Trade Spend Section Header */}
                  <tr className="bg-gray-100">
                    <td colSpan={6} className="py-2 px-3 font-semibold text-gray-800 text-xs uppercase tracking-wide">
                      Trade Spend
                    </td>
                  </tr>

                  {/* Distributor Trade Accrual */}
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-3 text-gray-600 pl-3">
                      Distributor Trade Accrual ({fmtPct(tradeSpendData.distributorTradeAccrual)})
                    </td>
                    {tiers.map((tier, t) => (
                      <td key={t} className="py-2 px-2 text-right bg-gray-50 text-gray-600">{fmt$(tier.distTrade$)}</td>
                    ))}
                  </tr>

                  {/* Operator Trade Accrual */}
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-3 text-gray-600 pl-3">
                      Operator Trade Accrual ({fmtPct(tradeSpendData.operatorTradeAccrual)})
                    </td>
                    {tiers.map((tier, t) => (
                      <td key={t} className="py-2 px-2 text-right bg-gray-50 text-gray-600">{fmt$(tier.opTrade$)}</td>
                    ))}
                  </tr>

                  {/* Distributor Marketing Accrual */}
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-3 text-gray-600 pl-3">
                      Distributor Marketing Accrual ({fmtPct(tradeSpendData.distributorMarketingAccrual)})
                    </td>
                    {tiers.map((tier, t) => (
                      <td key={t} className="py-2 px-2 text-right bg-gray-50 text-gray-600">{fmt$(tier.distMktg$)}</td>
                    ))}
                  </tr>

                  {/* Operator Marketing Accrual */}
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-3 text-gray-600 pl-3">
                      Operator Marketing Accrual ({fmtPct(tradeSpendData.operatorMarketingAccrual)})
                    </td>
                    {tiers.map((tier, t) => (
                      <td key={t} className="py-2 px-2 text-right bg-gray-50 text-gray-600">{fmt$(tier.opMktg$)}</td>
                    ))}
                  </tr>

                  {/* Deviated Billback */}
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-3 text-gray-600 pl-3">
                      Deviated Billback ({fmtPct(tradeSpendData.deviatedBillback)})
                    </td>
                    {tiers.map((tier, t) => (
                      <td key={t} className="py-2 px-2 text-right bg-gray-50 text-gray-600">{fmt$(tier.devBillback$)}</td>
                    ))}
                  </tr>

                  {/* Net Trade Total */}
                  <tr className="border-b-2 border-gray-300">
                    <td className="py-2 pr-3 font-medium text-gray-900 pl-3">
                      Net Trade Total ({fmtPct(tiers[0].netTradePct)})
                    </td>
                    {tiers.map((tier, t) => (
                      <td key={t} className="py-2 px-2 text-right bg-gray-50 font-medium text-gray-900">{fmt$(tier.netTrade$)}</td>
                    ))}
                  </tr>

                  {/* GP After Trade $ */}
                  <tr className="border-b border-gray-100 bg-blue-50">
                    <td className="py-2 pr-3 font-bold text-gray-900">Manufacturer GP ($) After Trade</td>
                    {tiers.map((tier, t) => (
                      <td key={t} className={`py-2 px-2 text-right font-bold ${tier.gpAfterTrade >= 0 ? "text-green-700" : "text-red-600"}`}>
                        {fmt$(tier.gpAfterTrade)}
                      </td>
                    ))}
                  </tr>

                  {/* GP After Trade % */}
                  <tr className="bg-blue-50">
                    <td className="py-2 pr-3 font-bold text-gray-900">Manufacturer GP (%) After Trade</td>
                    {tiers.map((tier, t) => (
                      <td key={t} className={`py-2 px-2 text-right font-bold ${tier.gpAfterTradePct >= 0 ? "text-green-700" : "text-red-600"}`}>
                        {fmtPct(tier.gpAfterTradePct)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { emptyPnlInputs }
