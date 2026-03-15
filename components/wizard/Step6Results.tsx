"use client"

import type { SKUInput, SKUPnLInputs, CompanyInfo, TermsConditions } from "@/lib/types"
import type { TradeSpendData } from "./Step4TradeSpend"

interface Step6Props {
  skus: SKUInput[]
  pnlInputs: SKUPnLInputs[]
  shippingData: {
    tierLabels: string[]
    volumeFeePerCase: number[]
  }
  tradeSpendData: TradeSpendData
  companyInfo: CompanyInfo
  termsData: TermsConditions
}

const TIER_DESCRIPTIONS = [
  "20 pallets, Full Truck Load",
  "10 pallets, 1/2 Truck Load",
  "4 pallets, ~4,000 lbs",
  "1 pallet, ~1,000 lbs",
  "1-case Min",
]

function fmt(n: number): string {
  return n.toFixed(2)
}

export default function Step6Results({
  skus,
  pnlInputs,
  shippingData,
  tradeSpendData,
  companyInfo,
  termsData,
}: Step6Props) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownloadCSV = () => {
    const rows: string[][] = []
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`
    const blank = () => rows.push([])
    const divider = (cols: number) => rows.push(Array(cols).fill("---"))

    // ═══════════════════════════════════════════
    // SECTION 1: COMPANY HEADER
    // ═══════════════════════════════════════════
    rows.push(["", "", "", companyInfo.companyName || ""])
    rows.push(["", "", "", "National Distributor Price Sheet"])
    rows.push(["", "", "", `EFFECTIVE DATE: ${companyInfo.effectiveDate || "N/A"}`])
    if (companyInfo.contactName) {
      rows.push(["", "", "", `Contact: ${companyInfo.contactName}  |  ${companyInfo.contactEmail || ""}  |  ${companyInfo.contactPhone || ""}`])
    }
    blank()
    blank()

    // ═══════════════════════════════════════════
    // SECTION 2: PRODUCT INFORMATION
    // ═══════════════════════════════════════════
    rows.push(["PRODUCT INFORMATION"])
    blank()
    rows.push([
      "Product Name / Description",
      "Case UPC",
      "Unit Weight (lbs.)",
      "Units / Case",
      "Lbs / Case",
      "Case Size (L x W x H in.)",
      "Pallet Size (L x W x H in.)",
      "Case Cube (Cu. ft.)",
      "Case Net Weight (lbs.)",
      "Case Gross Weight (lbs.)",
      "Cases / Pallet",
      "Pallet TI",
      "Pallet HI",
    ])
    skus.forEach((sku) => {
      const lbsPerCase = sku.lbsPerUnit * sku.unitsPerCase
      rows.push([
        sku.productName,
        sku.caseUPC || "",
        sku.lbsPerUnit.toFixed(2),
        String(sku.unitsPerCase),
        lbsPerCase.toFixed(2),
        sku.caseSize || "",
        sku.palletSize || "",
        String(sku.caseCube || 0),
        lbsPerCase.toFixed(2),
        String(sku.caseGrossWeight || 0),
        String(sku.casesPerPallet || 0),
        String(sku.palletTI || 0),
        String(sku.palletHI || 0),
      ])
    })
    blank()
    blank()

    // ═══════════════════════════════════════════
    // SECTION 3: BRACKETED DELIVERED PRICING
    // ═══════════════════════════════════════════
    rows.push(["BRACKETED DELIVERED PRICING"])
    blank()
    rows.push([
      "",
      "Tier 1",
      "Tier 2",
      "Tier 3",
      "Tier 4",
      "Tier 5",
    ])
    rows.push([
      "",
      TIER_DESCRIPTIONS[0],
      TIER_DESCRIPTIONS[1],
      TIER_DESCRIPTIONS[2],
      TIER_DESCRIPTIONS[3],
      TIER_DESCRIPTIONS[4],
    ])
    blank()
    skus.forEach((sku, i) => {
      rows.push([
        sku.productName,
        ...Array.from({ length: 5 }, (_, t) => `$${getDeliveredPrice(i, t).toFixed(2)}`),
      ])
    })
    blank()
    blank()

    // ═══════════════════════════════════════════
    // SECTION 4: SKU-LEVEL P&L (one per SKU)
    // ═══════════════════════════════════════════
    skus.forEach((sku, skuIdx) => {
      const pnl = pnlInputs[skuIdx]
      if (!pnl) return

      const basePrice = pnl.basePricePerCase || 0
      const volFees = shippingData.volumeFeePerCase
      const netSells = volFees.map((v) => basePrice + basePrice * v / 100)
      const ts = tradeSpendData
      const netTradePct = ts.distributorTradeAccrual + ts.operatorTradeAccrual + ts.distributorMarketingAccrual + ts.operatorMarketingAccrual + ts.deviatedBillback

      rows.push([`SKU P&L:  ${sku.productName}`])
      blank()
      rows.push(["", "Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5"])
      rows.push(["", TIER_DESCRIPTIONS[0], TIER_DESCRIPTIONS[1], TIER_DESCRIPTIONS[2], TIER_DESCRIPTIONS[3], TIER_DESCRIPTIONS[4]])
      divider(6)

      // Pricing section
      rows.push(["PRICING"])
      rows.push(["  Base Price / Case", ...volFees.map(() => `$${basePrice.toFixed(2)}`)])
      blank()
      rows.push(["  Volume Based Fee (%)", ...volFees.map((v) => `${v}%`)])
      rows.push(["  Volume Based Fee ($)", ...volFees.map((v) => `$${(basePrice * v / 100).toFixed(2)}`)])
      blank()
      rows.push(["  Net Sell Price (w/o Delivery)", ...netSells.map((n) => `$${n.toFixed(2)}`)])
      divider(6)

      // Freight section
      rows.push(["FREIGHT & DELIVERY"])
      rows.push(["  Freight Charge", ...pnl.freightPerTier.map((f) => `$${f.toFixed(2)}`)])
      rows.push(["  Lumpers Fee", ...pnl.lumpersPerTier.map((l) => `$${l.toFixed(2)}`)])
      rows.push(["  Damages Fee", ...pnl.damagesPerTier.map((d) => `$${d.toFixed(2)}`)])
      blank()
      const delivered = netSells.map((n, t) => n + pnl.freightPerTier[t] + pnl.lumpersPerTier[t] + pnl.damagesPerTier[t])
      rows.push(["  Delivered Sell Price", ...delivered.map((d) => `$${d.toFixed(2)}`)])
      divider(6)

      // Cost & Margin section
      rows.push(["COST & GROSS PROFIT"])
      rows.push(["  COGS ($/case)", ...volFees.map(() => `$${pnl.cogsPerCase.toFixed(2)}`)])
      const cogsTotal = netSells.map((_, t) => pnl.cogsPerCase + pnl.freightPerTier[t] + pnl.lumpersPerTier[t] + pnl.damagesPerTier[t])
      rows.push(["  COGS Total (incl. freight)", ...cogsTotal.map((c) => `$${c.toFixed(2)}`)])
      blank()
      const gpBefore = delivered.map((d, t) => d - cogsTotal[t])
      rows.push(["  Manufacturer GP ($) Before Trade", ...gpBefore.map((g) => `$${g.toFixed(2)}`)])
      rows.push(["  Manufacturer GP (%) Before Trade", ...gpBefore.map((g, t) => netSells[t] !== 0 ? `${(g / netSells[t] * 100).toFixed(1)}%` : "0.0%")])
      divider(6)

      // Trade spend section
      rows.push(["TRADE SPEND"])
      rows.push(["  Distributor Trade Accrual (" + ts.distributorTradeAccrual + "%)", ...netSells.map((n) => `$${(n * ts.distributorTradeAccrual / 100).toFixed(2)}`)])
      rows.push(["  Operator Trade Accrual (" + ts.operatorTradeAccrual + "%)", ...netSells.map((n) => `$${(n * ts.operatorTradeAccrual / 100).toFixed(2)}`)])
      rows.push(["  Distributor Marketing Accrual (" + ts.distributorMarketingAccrual + "%)", ...netSells.map((n) => `$${(n * ts.distributorMarketingAccrual / 100).toFixed(2)}`)])
      rows.push(["  Operator Marketing Accrual (" + ts.operatorMarketingAccrual + "%)", ...netSells.map((n) => `$${(n * ts.operatorMarketingAccrual / 100).toFixed(2)}`)])
      rows.push(["  Deviated Billback (" + ts.deviatedBillback + "%)", ...netSells.map((n) => `$${(n * ts.deviatedBillback / 100).toFixed(2)}`)])
      blank()
      rows.push(["  Net Trade Total (" + netTradePct.toFixed(1) + "%)", ...netSells.map((n) => `$${(n * netTradePct / 100).toFixed(2)}`)])
      divider(6)

      // Final GP
      rows.push(["FINAL MARGIN"])
      const gpAfter = gpBefore.map((g, t) => g - netSells[t] * netTradePct / 100)
      rows.push(["  Manufacturer GP ($) After Trade", ...gpAfter.map((g) => `$${g.toFixed(2)}`)])
      rows.push(["  Manufacturer GP (%) After Trade", ...gpAfter.map((g, t) => netSells[t] !== 0 ? `${(g / netSells[t] * 100).toFixed(1)}%` : "0.0%")])

      blank()
      blank()
      blank()
    })

    // ═══════════════════════════════════════════
    // SECTION 5: TERMS & CONDITIONS
    // ═══════════════════════════════════════════
    rows.push(["TERMS & CONDITIONS"])
    blank()

    // Warehouse
    rows.push(["WAREHOUSE:"])
    companyInfo.plantsWarehouses?.forEach((w) => {
      rows.push(["  Name:", w.name])
      rows.push(["  Address:", `${w.street}, ${w.city}, ${w.state} ${w.zipCode}`])
      rows.push(["  Third-Party Warehouse:", w.isThirdPartyWarehouse === "yes" ? "Yes" : "No"])
      blank()
    })

    // Remit Invoice To
    rows.push(["REMIT INVOICE TO:"])
    rows.push(["  Company:", termsData.remitCompanyName])
    rows.push(["  Address:", `${termsData.remitStreet}, ${termsData.remitCity}, ${termsData.remitState} ${termsData.remitZip}`])
    blank()

    // Shelf Life
    const shelfLives = [...new Set(skus.map((s) => s.shelfLife).filter(Boolean))]
    if (shelfLives.length > 0) {
      rows.push(["SHELF LIFE:"])
      shelfLives.forEach((sl) => rows.push(["  " + sl + " from Manufacture"]))
      if (termsData.lotCodeFormat) rows.push(["  Lot Code Format:", termsData.lotCodeFormat])
      blank()
    }

    // Terms of Sale
    rows.push(["TERMS OF SALE:"])
    rows.push(["  1. Minimum Order:", termsData.minimumOrder || "N/A"])
    rows.push(["  2. Pricing:", "Pricing is Delivered Pricing"])
    rows.push(["  3. Transportation:", termsData.transportation || "N/A"])
    rows.push(["  4. Payment Terms:", termsData.paymentTerms || "N/A"])
    rows.push(["  5. Lead Time:", termsData.leadTime || "N/A"])
    rows.push(["  6. POs should be sent to:", termsData.poEmail || "N/A"])
    if (termsData.hasCustomerPickup === "yes") {
      rows.push(["  7. Customer Pickup Allowances:", termsData.customerPickupAllowances || "N/A"])
    }
    blank()
    blank()
    rows.push(["Confidential and proprietary. Internal business use only unless otherwise authorized by Elohi."])

    const csvContent = rows.map((row) => row.map(esc).join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${companyInfo.companyName || "Elohi"}_Price_Sheet.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Calculate delivered sell price: Base Price + Volume Fee + Freight + Lumpers + Damages
  const getDeliveredPrice = (skuIdx: number, tierIdx: number): number => {
    const pnl = pnlInputs[skuIdx]
    if (!pnl) return 0
    const basePrice = pnl.basePricePerCase || 0
    const volumeFee = shippingData.volumeFeePerCase[tierIdx] || 0
    const freight = pnl.freightPerTier[tierIdx] || 0
    const lumpers = pnl.lumpersPerTier[tierIdx] || 0
    const damages = pnl.damagesPerTier[tierIdx] || 0
    return basePrice + volumeFee + freight + lumpers + damages
  }

  if (skus.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Final Price Output</h2>
        <p className="text-sm text-gray-500 italic">
          No SKUs have been added yet. Please go back and add products to generate a price sheet.
        </p>
      </div>
    )
  }

  // Find first warehouse for display
  const warehouse = companyInfo.plantsWarehouses?.[0]

  return (
    <div>
      {/* Print button - hidden when printing */}
      <div className="print:hidden mb-4 flex justify-end gap-3">
        <button
          onClick={handleDownloadCSV}
          className="px-6 py-2.5 rounded-md font-medium transition-colors flex items-center gap-2 border-2"
          style={{ borderColor: 'var(--elohi-mint)', color: 'var(--elohi-mint)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download CSV
        </button>
        <button
          onClick={handlePrint}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
          </svg>
          Print / Save PDF
        </button>
      </div>

      {/* Price Sheet Document */}
      <div className="bg-white rounded-lg shadow print:shadow-none print:rounded-none">
        <div className="p-8 print:p-6 space-y-8 print:space-y-6">

          {/* Section 1: Header */}
          <div className="text-center border-b-2 border-gray-800 pb-6">
            <h1 className="text-2xl font-bold text-gray-900 tracking-wide uppercase">
              {companyInfo.companyName || "Company Name"}
            </h1>
            <h2 className="text-lg font-semibold text-gray-700 mt-2">
              National Distributor Price Sheet
            </h2>
            {companyInfo.effectiveDate && (
              <p className="text-sm font-medium text-gray-600 mt-2">
                EFFECTIVE DATE: {companyInfo.effectiveDate}
              </p>
            )}
          </div>

          {/* Section 2: Product Information Table */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
              Product Information
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="px-2 py-2 text-left font-semibold">Product Name / Description</th>
                    <th className="px-2 py-2 text-center font-semibold">Case UPC</th>
                    <th className="px-2 py-2 text-center font-semibold">Unit Wt. (lbs)</th>
                    <th className="px-2 py-2 text-center font-semibold">Units / Case</th>
                    <th className="px-2 py-2 text-center font-semibold">Lbs / Case</th>
                    <th className="px-2 py-2 text-center font-semibold">Case Size</th>
                    <th className="px-2 py-2 text-center font-semibold">Pallet Size</th>
                    <th className="px-2 py-2 text-center font-semibold">Case Cube</th>
                    <th className="px-2 py-2 text-center font-semibold">Case Net Wt.</th>
                    <th className="px-2 py-2 text-center font-semibold">Case Gross Wt.</th>
                    <th className="px-2 py-2 text-center font-semibold">Cases / Pallet</th>
                    <th className="px-2 py-2 text-center font-semibold">TI</th>
                    <th className="px-2 py-2 text-center font-semibold">HI</th>
                  </tr>
                </thead>
                <tbody>
                  {skus.map((sku, idx) => {
                    const lbsPerCase = sku.lbsPerUnit * sku.unitsPerCase
                    const caseNetWeight = lbsPerCase
                    return (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-2 py-2 font-medium text-gray-900 border-b border-gray-200">
                          {sku.productName}
                        </td>
                        <td className="px-2 py-2 text-center text-gray-700 border-b border-gray-200 whitespace-nowrap">
                          {sku.caseUPC}
                        </td>
                        <td className="px-2 py-2 text-center text-gray-700 border-b border-gray-200">
                          {fmt(sku.lbsPerUnit)}
                        </td>
                        <td className="px-2 py-2 text-center text-gray-700 border-b border-gray-200">
                          {sku.unitsPerCase}
                        </td>
                        <td className="px-2 py-2 text-center text-gray-700 border-b border-gray-200">
                          {fmt(lbsPerCase)}
                        </td>
                        <td className="px-2 py-2 text-center text-gray-700 border-b border-gray-200 whitespace-nowrap">
                          {sku.caseSize}
                        </td>
                        <td className="px-2 py-2 text-center text-gray-700 border-b border-gray-200 whitespace-nowrap">
                          {sku.palletSize}
                        </td>
                        <td className="px-2 py-2 text-center text-gray-700 border-b border-gray-200">
                          {fmt(sku.caseCube)}
                        </td>
                        <td className="px-2 py-2 text-center text-gray-700 border-b border-gray-200">
                          {fmt(caseNetWeight)}
                        </td>
                        <td className="px-2 py-2 text-center text-gray-700 border-b border-gray-200">
                          {fmt(sku.caseGrossWeight)}
                        </td>
                        <td className="px-2 py-2 text-center text-gray-700 border-b border-gray-200">
                          {sku.casesPerPallet}
                        </td>
                        <td className="px-2 py-2 text-center text-gray-700 border-b border-gray-200">
                          {sku.palletTI}
                        </td>
                        <td className="px-2 py-2 text-center text-gray-700 border-b border-gray-200">
                          {sku.palletHI}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Bracketed Delivered Pricing */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
              Bracketed Delivered Pricing
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="px-3 py-2 text-left font-semibold">Product</th>
                    {TIER_DESCRIPTIONS.map((desc, i) => (
                      <th key={i} className="px-3 py-2 text-center font-semibold">
                        <div>Tier {i + 1}</div>
                        <div className="font-normal text-gray-300 text-[10px] mt-0.5">{desc}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {skus.map((sku, skuIdx) => (
                    <tr key={skuIdx} className={skuIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-3 py-2.5 font-medium text-gray-900 border-b border-gray-200">
                        {sku.productName}
                      </td>
                      {[0, 1, 2, 3, 4].map((tierIdx) => (
                        <td
                          key={tierIdx}
                          className="px-3 py-2.5 text-center text-gray-700 border-b border-gray-200 font-mono"
                        >
                          ${fmt(getDeliveredPrice(skuIdx, tierIdx))}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 italic">
              Delivered prices include base price, volume fees, freight, lumpers, and damages per tier.
            </p>
          </div>

          {/* Section 4: Terms and Conditions */}
          <div className="print:break-before-auto">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
              Terms &amp; Conditions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Left Column: Warehouse & Remit Info */}
              <div className="space-y-4">
                {/* Warehouse Info */}
                {warehouse && (
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 text-[11px] uppercase">
                      Ship From Warehouse
                    </h4>
                    <div className="text-gray-700 leading-relaxed">
                      <p className="font-medium">{warehouse.name}</p>
                      <p>{warehouse.street}</p>
                      <p>
                        {warehouse.city}, {warehouse.state} {warehouse.zipCode}
                      </p>
                      {warehouse.isThirdPartyWarehouse === "yes" && (
                        <p className="text-gray-500 italic mt-1">Third-party warehouse</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Remit Invoice To */}
                {termsData.remitCompanyName && (
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 text-[11px] uppercase">
                      Remit Invoice To
                    </h4>
                    <div className="text-gray-700 leading-relaxed">
                      <p className="font-medium">{termsData.remitCompanyName}</p>
                      <p>{termsData.remitStreet}</p>
                      <p>
                        {termsData.remitCity}, {termsData.remitState} {termsData.remitZip}
                      </p>
                    </div>
                  </div>
                )}

                {/* Shelf Life */}
                {skus.some((s) => s.shelfLife) && (
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 text-[11px] uppercase">Shelf Life</h4>
                    <div className="text-gray-700 leading-relaxed">
                      {skus.map((sku, idx) => (
                        <p key={idx}>
                          <span className="font-medium">{sku.productName}:</span> {sku.shelfLife || "N/A"}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Terms and Conditions of Sale */}
              <div>
                <h4 className="font-bold text-gray-800 mb-2 text-[11px] uppercase">
                  Terms and Conditions of Sale
                </h4>
                <div className="space-y-2 text-gray-700">
                  <div className="flex">
                    <span className="font-semibold w-2 shrink-0">1.</span>
                    <div className="ml-1">
                      <span className="font-semibold">Minimum Order:</span>{" "}
                      {termsData.minimumOrder || "N/A"}
                    </div>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-2 shrink-0">2.</span>
                    <div className="ml-1">
                      <span className="font-semibold">Transportation:</span>{" "}
                      {termsData.transportation || "N/A"}
                    </div>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-2 shrink-0">3.</span>
                    <div className="ml-1">
                      <span className="font-semibold">Payment Terms:</span>{" "}
                      {termsData.paymentTerms || "N/A"}
                    </div>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-2 shrink-0">4.</span>
                    <div className="ml-1">
                      <span className="font-semibold">Lead Time:</span>{" "}
                      {termsData.leadTime || "N/A"}
                    </div>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-2 shrink-0">5.</span>
                    <div className="ml-1">
                      <span className="font-semibold">PO Email:</span>{" "}
                      {termsData.poEmail || "N/A"}
                    </div>
                  </div>
                  {termsData.hasCustomerPickup === "yes" && (
                    <div className="flex">
                      <span className="font-semibold w-2 shrink-0">6.</span>
                      <div className="ml-1">
                        <span className="font-semibold">Customer Pickup Allowances:</span>{" "}
                        {termsData.customerPickupAllowances || "N/A"}
                      </div>
                    </div>
                  )}
                  <div className="flex">
                    <span className="font-semibold w-2 shrink-0">{termsData.hasCustomerPickup === "yes" ? "7." : "6."}</span>
                    <div className="ml-1">
                      <span className="font-semibold">Temperature Class:</span>{" "}
                      {skus.length > 0
                        ? skus[0].temperatureClass.charAt(0).toUpperCase() +
                          skus[0].temperatureClass.slice(1) +
                          " stable"
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Footer */}
          <div className="border-t-2 border-gray-800 pt-4 mt-8">
            <div className="text-center text-xs text-gray-600 space-y-1">
              <p className="font-bold text-gray-800 text-sm">
                {companyInfo.companyName || "Company Name"}
              </p>
              {companyInfo.contactName && <p>{companyInfo.contactName}</p>}
              <div className="flex justify-center gap-4 flex-wrap">
                {companyInfo.contactEmail && <p>{companyInfo.contactEmail}</p>}
                {companyInfo.contactPhone && <p>{companyInfo.contactPhone}</p>}
              </div>
              {termsData.remitStreet && (
                <p>
                  {termsData.remitStreet}, {termsData.remitCity}, {termsData.remitState}{" "}
                  {termsData.remitZip}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
