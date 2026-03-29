"use client"

import { useState } from "react"
import type { SKUInput, SKUPnLInputs } from "@/lib/types"
import type { TradeSpendData } from "./Step4TradeSpend"
import InfoTip from "@/components/InfoTip"

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
    basePricePerCase: 0,
    cogsPerCase: 0,
    freightPerTier: [0, 0, 0, 0, 0],
    lumpersPerTier: [0, 0, 0, 0, 0],
    damagesPerTier: [0, 0, 0, 0, 0],
  }
}

function fmt$(v: number): string {
  if (v < 0) return `($${Math.abs(v).toFixed(2)})`
  return `$${v.toFixed(2)}`
}

function fmtPct(v: number): string {
  return `${v.toFixed(1)}%`
}

export default function Step6SKUPnL({ skus, shippingData, tradeSpendData, pnlInputs, onChange }: Step6Props) {
  const [selectedSkus, setSelectedSkus] = useState<Set<number>>(() => {
    // Default: select first SKU if any
    return new Set(skus.length > 0 ? [0] : [])
  })
  const [dropdownOpen, setDropdownOpen] = useState(false)

  if (skus.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Gross Profit after Trade Calculation</h2>
        <p className="text-sm text-gray-600">
          No SKUs have been added yet. Please go back to <strong>Step 2 (Product Set-Up)</strong> to add SKUs.
        </p>
      </div>
    )
  }

  const toggleSku = (idx: number) => {
    setSelectedSkus((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) {
        next.delete(idx)
      } else {
        next.add(idx)
      }
      return next
    })
  }

  const selectAll = () => {
    setSelectedSkus(new Set(skus.map((_, i) => i)))
  }

  const selectNone = () => {
    setSelectedSkus(new Set())
  }

  const updateSKU = (skuIndex: number, field: keyof SKUPnLInputs, value: number, tierIndex?: number) => {
    const updated = pnlInputs.map((inp, i) => {
      if (i !== skuIndex) return inp
      const copy = { ...inp }
      if (field === "cogsPerCase" || field === "basePricePerCase") {
        ;(copy as any)[field] = value
      } else {
        const arr = [...(copy[field] as number[])]
        arr[tierIndex!] = value
        ;(copy as any)[field] = arr
      }
      return copy
    })
    onChange(updated)
  }

  // Format currency fields on blur to 2 decimal places, clamp negatives to 0
  const formatCurrencyOnBlur = (skuIndex: number, field: keyof SKUPnLInputs, tierIndex?: number) => (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value
    if (raw === "") return
    let num = Math.round(Number(raw) * 100) / 100
    if (num < 0) num = 0
    const inputs = pnlInputs[skuIndex]
    if (field === "basePricePerCase" || field === "cogsPerCase") {
      if (num !== inputs[field]) updateSKU(skuIndex, field, num)
    } else {
      if (num !== (inputs[field] as number[])[tierIndex!]) updateSKU(skuIndex, field, num, tierIndex)
    }
  }

  const volFeePcts = shippingData.volumeFeePerCase

  const selectedCount = selectedSkus.size
  const selectedLabel =
    selectedCount === 0
      ? "Select SKUs..."
      : selectedCount === skus.length
        ? `All SKUs (${selectedCount})`
        : `${selectedCount} SKU${selectedCount > 1 ? "s" : ""} selected`

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900">Gross Profit after Trade Calculation</h2>
        <p className="text-sm text-gray-600 mt-1">
          Select which SKUs to view. Yellow cells are editable inputs. Gray cells are calculated.
        </p>

        {/* SKU Selector Dropdown */}
        <div className="relative mt-4 max-w-md">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span>{selectedLabel}</span>
            <svg className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div className="flex gap-2 px-3 py-2 border-b border-gray-200">
                <button type="button" onClick={selectAll} className="text-xs text-blue-600 hover:underline">Select All</button>
                <button type="button" onClick={selectNone} className="text-xs text-blue-600 hover:underline">Clear All</button>
              </div>
              {skus.map((sku, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSkus.has(idx)}
                    onChange={() => toggleSku(idx)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 truncate">
                    {sku.productName || `SKU #${idx + 1}`}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {Array.from(selectedSkus)
        .sort((a, b) => a - b)
        .map((skuIdx) => {
          const sku = skus[skuIdx]
          const inputs = pnlInputs[skuIdx] || emptyPnlInputs()
          const basePrice = inputs.basePricePerCase || 0

          const tiers = Array.from({ length: 5 }, (_, t) => {
            const volFeePct = volFeePcts[t] / 100
            const volFee$ = basePrice * volFeePct
            const netSell = basePrice + volFee$

            const freight = inputs.freightPerTier[t]
            const lumpers = inputs.lumpersPerTier[t]
            const damages = inputs.damagesPerTier[t]

            const deliveredSell = netSell + freight + lumpers + damages
            const cogsTotal = inputs.cogsPerCase + freight + lumpers + damages

            const gpBeforeTrade = deliveredSell - cogsTotal
            const gpBeforeTradePct = netSell !== 0 ? (gpBeforeTrade / netSell) * 100 : 0

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

          const lbsPerCase = sku.lbsPerUnit * sku.unitsPerCase
          const pricePerLb = lbsPerCase > 0 ? basePrice / lbsPerCase : 0

          return (
            <div key={skuIdx} className="bg-white rounded-lg shadow p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {sku.productName || `SKU #${skuIdx + 1}`}
                </h3>
                <div className="text-sm text-gray-500">
                  {lbsPerCase > 0 && <span>Lbs/Case: {lbsPerCase.toFixed(2)}</span>}
                  {pricePerLb > 0 && <span className="ml-4">Price/lb: {fmt$(pricePerLb)}</span>}
                </div>
              </div>

              {/* Key Inputs Section */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Key Pricing / Manufacturer Inputs</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Base Price / Case</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={inputs.basePricePerCase || ""}
                      onChange={(e) => updateSKU(skuIdx, "basePricePerCase", parseFloat(e.target.value) || 0)}
                      onBlur={formatCurrencyOnBlur(skuIdx, "basePricePerCase")}
                      className="mt-1 block w-full rounded-md border-gray-300 bg-yellow-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="flex items-center text-xs font-medium text-gray-600">COGS ($/cs.)<InfoTip text="Cost of Goods Sold per case — the direct manufacturing or procurement cost to produce one case of this product, excluding freight and trade spend." /></label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={inputs.cogsPerCase || ""}
                      onChange={(e) => updateSKU(skuIdx, "cogsPerCase", parseFloat(e.target.value) || 0)}
                      onBlur={formatCurrencyOnBlur(skuIdx, "cogsPerCase")}
                      className="mt-1 block w-full rounded-md border-gray-300 bg-yellow-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Price / lb</label>
                    <div className="mt-1 block w-full rounded-md bg-gray-100 sm:text-sm px-3 py-2 text-gray-600">
                      {pricePerLb > 0 ? fmt$(pricePerLb) : "—"}
                    </div>
                  </div>
                </div>
              </div>

              {/* P&L Waterfall Table */}
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full border-collapse text-sm min-w-[700px]">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 pr-3 font-semibold text-gray-900 w-56 whitespace-nowrap">
                        Bracketed / Volume Pricing
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

                    {/* Blank separator */}
                    <tr><td colSpan={6} className="py-1"></td></tr>

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

                    {/* Blank separator */}
                    <tr><td colSpan={6} className="py-1"></td></tr>

                    {/* Net Sell Price */}
                    <tr className="border-b-2 border-gray-300">
                      <td className="py-2 pr-3 font-medium text-gray-900">Net Sell Price (w/o Delivery)</td>
                      {tiers.map((tier, t) => (
                        <td key={t} className="py-2 px-2 text-right bg-gray-50 font-medium text-gray-900">{fmt$(tier.netSell)}</td>
                      ))}
                    </tr>

                    {/* Blank separator */}
                    <tr><td colSpan={6} className="py-1"></td></tr>

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
                            onBlur={formatCurrencyOnBlur(skuIdx, "freightPerTier", t)}
                            className="w-full rounded border border-gray-300 bg-yellow-100 text-right px-2 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="0.00"
                          />
                        </td>
                      ))}
                    </tr>

                    {/* Lumpers Fee */}
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-3 text-gray-700"><span className="flex items-center">Lumpers Fee<InfoTip text="Fee charged by third-party workers to unload freight at a warehouse or distribution center. Common in foodservice distribution." /></span></td>
                      {tiers.map((_, t) => (
                        <td key={t} className="py-1 px-1">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={inputs.lumpersPerTier[t] || ""}
                            onChange={(e) => updateSKU(skuIdx, "lumpersPerTier", parseFloat(e.target.value) || 0, t)}
                            onBlur={formatCurrencyOnBlur(skuIdx, "lumpersPerTier", t)}
                            className="w-full rounded border border-gray-300 bg-yellow-100 text-right px-2 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="0.00"
                          />
                        </td>
                      ))}
                    </tr>

                    {/* Damages Fee */}
                    <tr className="border-b-2 border-gray-300">
                      <td className="py-2 pr-3 text-gray-700"><span className="flex items-center">Damages Fee<InfoTip text="An allowance built into pricing to cover product damage during shipping and handling. Typically expressed as a per-case charge." /></span></td>
                      {tiers.map((_, t) => (
                        <td key={t} className="py-1 px-1">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={inputs.damagesPerTier[t] || ""}
                            onChange={(e) => updateSKU(skuIdx, "damagesPerTier", parseFloat(e.target.value) || 0, t)}
                            onBlur={formatCurrencyOnBlur(skuIdx, "damagesPerTier", t)}
                            className="w-full rounded border border-gray-300 bg-yellow-100 text-right px-2 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="0.00"
                          />
                        </td>
                      ))}
                    </tr>

                    {/* Blank separator */}
                    <tr><td colSpan={6} className="py-1"></td></tr>

                    {/* Delivered Sell Price */}
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-3 font-medium text-gray-900">Delivered Sell Price</td>
                      {tiers.map((tier, t) => (
                        <td key={t} className="py-2 px-2 text-right bg-gray-50 font-medium text-gray-900">{fmt$(tier.deliveredSell)}</td>
                      ))}
                    </tr>

                    {/* COGS (total) */}
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-3 text-gray-700">COGS</td>
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

                    {/* Trade Spend Header */}
                    <tr className="bg-gray-100">
                      <td colSpan={6} className="py-2 px-3 font-semibold text-gray-800 text-xs uppercase tracking-wide">
                        Trade Spend
                      </td>
                    </tr>

                    {/* Distributor Trade Accrual */}
                    <tr className="border-b border-gray-100">
                      <td className="py-1 pr-3 text-gray-600 pl-3">Distributor Trade Accrual ({fmtPct(tradeSpendData.distributorTradeAccrual)})</td>
                      {tiers.map((tier, t) => (
                        <td key={t} className="py-1 px-2 text-right bg-gray-50 text-gray-600">{fmt$(tier.distTrade$)}</td>
                      ))}
                    </tr>

                    {/* Operator Trade Accrual */}
                    <tr className="border-b border-gray-100">
                      <td className="py-1 pr-3 text-gray-600 pl-3">Operator Trade Accrual ({fmtPct(tradeSpendData.operatorTradeAccrual)})</td>
                      {tiers.map((tier, t) => (
                        <td key={t} className="py-1 px-2 text-right bg-gray-50 text-gray-600">{fmt$(tier.opTrade$)}</td>
                      ))}
                    </tr>

                    {/* Distributor Marketing Accrual */}
                    <tr className="border-b border-gray-100">
                      <td className="py-1 pr-3 text-gray-600 pl-3">Distributor Marketing Accrual ({fmtPct(tradeSpendData.distributorMarketingAccrual)})</td>
                      {tiers.map((tier, t) => (
                        <td key={t} className="py-1 px-2 text-right bg-gray-50 text-gray-600">{fmt$(tier.distMktg$)}</td>
                      ))}
                    </tr>

                    {/* Operator Marketing Accrual */}
                    <tr className="border-b border-gray-100">
                      <td className="py-1 pr-3 text-gray-600 pl-3">Operator Marketing Accrual ({fmtPct(tradeSpendData.operatorMarketingAccrual)})</td>
                      {tiers.map((tier, t) => (
                        <td key={t} className="py-1 px-2 text-right bg-gray-50 text-gray-600">{fmt$(tier.opMktg$)}</td>
                      ))}
                    </tr>

                    {/* Deviated Billback */}
                    <tr className="border-b border-gray-100">
                      <td className="py-1 pr-3 text-gray-600 pl-3">Deviated Billback ({fmtPct(tradeSpendData.deviatedBillback)})</td>
                      {tiers.map((tier, t) => (
                        <td key={t} className="py-1 px-2 text-right bg-gray-50 text-gray-600">{fmt$(tier.devBillback$)}</td>
                      ))}
                    </tr>

                    {/* Net Trade Total */}
                    <tr className="border-b-2 border-gray-300">
                      <td className="py-2 pr-3 font-medium text-gray-900 pl-3">Net Trade Total ({fmtPct(tiers[0].netTradePct)})</td>
                      {tiers.map((tier, t) => (
                        <td key={t} className="py-2 px-2 text-right bg-gray-50 font-medium text-gray-900">{fmt$(tier.netTrade$)}</td>
                      ))}
                    </tr>

                    {/* Blank separator */}
                    <tr><td colSpan={6} className="py-1"></td></tr>

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

      {selectedSkus.size === 0 && (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          <p>Select one or more SKUs from the dropdown above to view their P&L.</p>
        </div>
      )}
    </div>
  )
}

export { emptyPnlInputs }
