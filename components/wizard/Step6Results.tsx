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
    // Helper to escape HTML entities
    const esc = (v: string | number) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

    // Column count for product info table
    const prodCols = 13
    // Column count for tier-based tables
    const tierCols = 6

    let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Price Sheet</x:Name><x:WorksheetOptions><x:FitToPage/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
<style>
  td, th { font-family: Calibri, sans-serif; font-size: 11pt; padding: 4px 8px; vertical-align: middle; border: 1px solid #E0C5AC; }
  .header { background: #393089; color: #FFFFFF; font-weight: bold; font-size: 14pt; text-align: center; border: none; }
  .header-sub { background: #393089; color: #FFFFFF; font-weight: bold; font-size: 11pt; text-align: center; border: none; }
  .header-sm { background: #393089; color: #FFFFFF; font-size: 10pt; text-align: center; border: none; }
  .section { background: #6FB7F2; color: #FFFFFF; font-weight: bold; font-size: 11pt; }
  .subsection { background: #d6e8fa; font-weight: bold; font-size: 10pt; color: #393089; }
  .colheader { background: #E0C5AC; font-weight: bold; color: #1A1A1A; font-size: 10pt; }
  .colheader-c { background: #E0C5AC; font-weight: bold; color: #1A1A1A; font-size: 10pt; text-align: center; }
  .alt { background: #FFFAF5; }
  .money { text-align: right; mso-number-format: "\\$\\#\\,\\#\\#0\\.00"; }
  .pct { text-align: right; }
  .pos { color: #00BC70; font-weight: bold; }
  .neg { color: #E41C50; font-weight: bold; }
  .bold { font-weight: bold; }
  .label { font-weight: bold; color: #393089; }
  .empty { border: none; }
  .input { background: #FFF8E1; }
  .divider { border-bottom: 2px solid #393089; }
  .right { text-align: right; }
  .center { text-align: center; }
  .wrap { mso-text-control: shrinktofit; }
</style>
</head><body>
<table>`

    // ═══════════════════════════════════════════
    // ROW 1-3: COMPANY HEADER
    // ═══════════════════════════════════════════
    html += `<tr><td colspan="${prodCols}" class="header" style="font-size:16pt;">${esc(companyInfo.companyName || 'Elohi')}</td></tr>`
    html += `<tr><td colspan="${prodCols}" class="header-sub">National Distributor Price Sheet</td></tr>`
    let headerLine3 = `EFFECTIVE DATE: ${esc(companyInfo.effectiveDate || 'N/A')}`
    if (companyInfo.contactName) {
      headerLine3 += `&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;${esc(companyInfo.contactName)}`
      if (companyInfo.contactEmail) headerLine3 += `&nbsp;&nbsp;${esc(companyInfo.contactEmail)}`
      if (companyInfo.contactPhone) headerLine3 += `&nbsp;&nbsp;${esc(companyInfo.contactPhone)}`
    }
    html += `<tr><td colspan="${prodCols}" class="header-sm">${headerLine3}</td></tr>`

    // Blank row
    html += `<tr><td colspan="${prodCols}" class="empty">&nbsp;</td></tr>`

    // ═══════════════════════════════════════════
    // PRODUCT INFORMATION
    // ═══════════════════════════════════════════
    html += `<tr><td colspan="${prodCols}" class="section">PRODUCT INFORMATION</td></tr>`
    const prodHeaders = [
      'Product Name / Description', 'Case UPC', 'Unit Wt. (lbs)', 'Units / Case',
      'Lbs / Case', 'Case Size (L x W x H)', 'Pallet Size (L x W x H)',
      'Case Cube (cu ft)', 'Case Net Wt. (lbs)', 'Case Gross Wt. (lbs)',
      'Cases / Pallet', 'Pallet TI', 'Pallet HI',
    ]
    html += '<tr>' + prodHeaders.map((h) => `<td class="colheader-c">${esc(h)}</td>`).join('') + '</tr>'
    skus.forEach((sku, idx) => {
      const lbsPerCase = sku.lbsPerUnit * sku.unitsPerCase
      const altClass = idx % 2 === 1 ? ' class="alt"' : ''
      const altClassC = idx % 2 === 1 ? ' class="alt center"' : ' class="center"'
      html += `<tr>`
      html += `<td${altClass}>${esc(sku.productName)}</td>`
      html += `<td${altClassC}>${esc(sku.caseUPC || '')}</td>`
      html += `<td${altClassC}>${sku.lbsPerUnit.toFixed(2)}</td>`
      html += `<td${altClassC}>${sku.unitsPerCase}</td>`
      html += `<td${altClassC}>${lbsPerCase.toFixed(2)}</td>`
      html += `<td${altClassC}>${esc(sku.caseSize || '')}</td>`
      html += `<td${altClassC}>${esc(sku.palletSize || '')}</td>`
      html += `<td${altClassC}>${fmt(sku.caseCube)}</td>`
      html += `<td${altClassC}>${lbsPerCase.toFixed(2)}</td>`
      html += `<td${altClassC}>${fmt(sku.caseGrossWeight)}</td>`
      html += `<td${altClassC}>${sku.casesPerPallet}</td>`
      html += `<td${altClassC}>${sku.palletTI}</td>`
      html += `<td${altClassC}>${sku.palletHI}</td>`
      html += `</tr>`
    })

    // Blank row
    html += `<tr><td colspan="${prodCols}" class="empty">&nbsp;</td></tr>`

    // ═══════════════════════════════════════════
    // BRACKETED DELIVERED PRICING
    // ═══════════════════════════════════════════
    html += `<tr><td colspan="${tierCols}" class="section">BRACKETED DELIVERED PRICING</td></tr>`
    // Tier name header
    html += `<tr><td class="colheader">&nbsp;</td>`
    for (let i = 0; i < 5; i++) html += `<td class="colheader-c">Tier ${i + 1}</td>`
    html += `</tr>`
    // Tier description sub-header
    html += `<tr><td class="colheader">&nbsp;</td>`
    for (let i = 0; i < 5; i++) html += `<td class="colheader-c" style="font-size:8pt; font-weight:normal;">${esc(TIER_DESCRIPTIONS[i])}</td>`
    html += `</tr>`
    // Product rows
    skus.forEach((sku, skuIdx) => {
      const altClass = skuIdx % 2 === 1 ? ' alt' : ''
      html += `<tr>`
      html += `<td class="bold${altClass}">${esc(sku.productName)}</td>`
      for (let t = 0; t < 5; t++) {
        html += `<td class="money${altClass}">$${getDeliveredPrice(skuIdx, t).toFixed(2)}</td>`
      }
      html += `</tr>`
    })

    // Blank row
    html += `<tr><td colspan="${tierCols}" class="empty">&nbsp;</td></tr>`

    // ═══════════════════════════════════════════
    // PER-SKU P&L SECTIONS
    // ═══════════════════════════════════════════
    skus.forEach((sku, skuIdx) => {
      const pnl = pnlInputs[skuIdx]
      if (!pnl) return

      const basePrice = pnl.basePricePerCase || 0
      const volFees = shippingData.volumeFeePerCase
      const netSells = volFees.map((v) => basePrice + basePrice * v / 100)
      const ts = tradeSpendData
      const netTradePct = ts.distributorTradeAccrual + ts.operatorTradeAccrual + ts.distributorMarketingAccrual + ts.operatorMarketingAccrual + ts.deviatedBillback

      // SKU Header
      html += `<tr><td colspan="${tierCols}" class="header-sub" style="text-align:left;">SKU P&amp;L: ${esc(sku.productName)}</td></tr>`
      // Tier headers
      html += `<tr><td class="colheader">&nbsp;</td>`
      for (let i = 0; i < 5; i++) html += `<td class="colheader-c">Tier ${i + 1}</td>`
      html += `</tr>`
      html += `<tr><td class="colheader">&nbsp;</td>`
      for (let i = 0; i < 5; i++) html += `<td class="colheader-c" style="font-size:8pt; font-weight:normal;">${esc(TIER_DESCRIPTIONS[i])}</td>`
      html += `</tr>`

      // Helper for data rows
      const dataRow = (label: string, values: string[], cls?: string) => {
        html += `<tr><td class="bold">${esc(label)}</td>`
        values.forEach((v) => {
          const extraCls = cls ? ` ${cls}` : ''
          html += `<td class="right${extraCls}">${esc(v)}</td>`
        })
        html += `</tr>`
      }
      const moneyRow = (label: string, values: number[], cls?: string) => {
        html += `<tr><td class="bold">${esc(label)}</td>`
        values.forEach((v) => {
          const extraCls = cls ? ` ${cls}` : ''
          html += `<td class="money${extraCls}">$${v.toFixed(2)}</td>`
        })
        html += `</tr>`
      }
      const pctRow = (label: string, values: number[], bases: number[], cls?: string) => {
        html += `<tr><td class="bold">${esc(label)}</td>`
        values.forEach((v, i) => {
          const pctVal = bases[i] !== 0 ? (v / bases[i] * 100).toFixed(1) : '0.0'
          const extraCls = cls ? ` ${cls}` : ''
          html += `<td class="pct${extraCls}">${pctVal}%</td>`
        })
        html += `</tr>`
      }
      const gpClass = (values: number[]) => values.map((v) => v >= 0 ? 'pos' : 'neg')
      const moneyRowGP = (label: string, values: number[]) => {
        html += `<tr><td class="bold">${esc(label)}</td>`
        values.forEach((v) => {
          const cls = v >= 0 ? 'pos' : 'neg'
          html += `<td class="money ${cls}">$${v.toFixed(2)}</td>`
        })
        html += `</tr>`
      }
      const pctRowGP = (label: string, values: number[], bases: number[]) => {
        html += `<tr><td class="bold">${esc(label)}</td>`
        values.forEach((v, i) => {
          const pctVal = bases[i] !== 0 ? (v / bases[i] * 100).toFixed(1) : '0.0'
          const cls = v >= 0 ? 'pos' : 'neg'
          html += `<td class="pct ${cls}">${pctVal}%</td>`
        })
        html += `</tr>`
      }

      // PRICING sub-section
      html += `<tr><td colspan="${tierCols}" class="subsection">PRICING</td></tr>`
      moneyRow('Base Price / Case', volFees.map(() => basePrice), 'input')
      dataRow('Volume Based Fee (%)', volFees.map((v) => `${v}%`))
      moneyRow('Volume Based Fee ($)', volFees.map((v) => basePrice * v / 100))
      moneyRow('Net Sell Price (w/o Delivery)', netSells)

      // FREIGHT sub-section
      html += `<tr><td colspan="${tierCols}" class="subsection">FREIGHT &amp; DELIVERY</td></tr>`
      moneyRow('Freight Charge', pnl.freightPerTier.map((f) => f), 'input')
      moneyRow('Lumpers Fee', pnl.lumpersPerTier.map((l) => l), 'input')
      moneyRow('Damages Fee', pnl.damagesPerTier.map((d) => d), 'input')
      const delivered = netSells.map((n, t) => n + pnl.freightPerTier[t] + pnl.lumpersPerTier[t] + pnl.damagesPerTier[t])
      html += `<tr><td class="bold divider">Delivered Sell Price</td>`
      delivered.forEach((d) => { html += `<td class="money bold divider">$${d.toFixed(2)}</td>` })
      html += `</tr>`

      // COST sub-section
      html += `<tr><td colspan="${tierCols}" class="subsection">COST &amp; GROSS PROFIT</td></tr>`
      moneyRow('COGS ($/case)', volFees.map(() => pnl.cogsPerCase), 'input')
      const cogsTotal = netSells.map((_, t) => pnl.cogsPerCase + pnl.freightPerTier[t] + pnl.lumpersPerTier[t] + pnl.damagesPerTier[t])
      moneyRow('COGS Total (incl. freight)', cogsTotal)
      const gpBefore = delivered.map((d, t) => d - cogsTotal[t])
      moneyRowGP('Manufacturer GP ($) Before Trade', gpBefore)
      pctRowGP('Manufacturer GP (%) Before Trade', gpBefore, netSells)

      // TRADE SPEND sub-section
      html += `<tr><td colspan="${tierCols}" class="subsection">TRADE SPEND</td></tr>`
      moneyRow(`Distributor Trade Accrual (${ts.distributorTradeAccrual}%)`, netSells.map((n) => n * ts.distributorTradeAccrual / 100))
      moneyRow(`Operator Trade Accrual (${ts.operatorTradeAccrual}%)`, netSells.map((n) => n * ts.operatorTradeAccrual / 100))
      moneyRow(`Distributor Marketing Accrual (${ts.distributorMarketingAccrual}%)`, netSells.map((n) => n * ts.distributorMarketingAccrual / 100))
      moneyRow(`Operator Marketing Accrual (${ts.operatorMarketingAccrual}%)`, netSells.map((n) => n * ts.operatorMarketingAccrual / 100))
      moneyRow(`Deviated Billback (${ts.deviatedBillback}%)`, netSells.map((n) => n * ts.deviatedBillback / 100))
      html += `<tr><td class="bold divider">Net Trade Total (${netTradePct.toFixed(1)}%)</td>`
      netSells.forEach((n) => { html += `<td class="money bold divider">$${(n * netTradePct / 100).toFixed(2)}</td>` })
      html += `</tr>`

      // FINAL MARGIN sub-section
      html += `<tr><td colspan="${tierCols}" class="subsection">FINAL MARGIN</td></tr>`
      const gpAfter = gpBefore.map((g, t) => g - netSells[t] * netTradePct / 100)
      moneyRowGP('Manufacturer GP ($) After Trade', gpAfter)
      pctRowGP('Manufacturer GP (%) After Trade', gpAfter, netSells)

      // Blank row separator between SKUs
      html += `<tr><td colspan="${tierCols}" class="empty">&nbsp;</td></tr>`
    })

    // ═══════════════════════════════════════════
    // TERMS & CONDITIONS
    // ═══════════════════════════════════════════
    html += `<tr><td colspan="${tierCols}" class="section">TERMS &amp; CONDITIONS</td></tr>`

    const termsRow = (label: string, value: string) => {
      html += `<tr><td class="label" style="width:200px;">${esc(label)}</td><td colspan="${tierCols - 1}">${esc(value)}</td></tr>`
    }

    // Warehouses
    companyInfo.plantsWarehouses?.forEach((w) => {
      html += `<tr><td colspan="${tierCols}" class="colheader">WAREHOUSE</td></tr>`
      termsRow('Name', w.name || '')
      termsRow('Address', `${w.street || ''}, ${w.city || ''}, ${w.state || ''} ${w.zipCode || ''}`)
      termsRow('Third-Party Warehouse', w.isThirdPartyWarehouse === 'yes' ? 'Yes' : 'No')
    })

    // Remit Invoice To
    if (termsData.remitCompanyName) {
      html += `<tr><td colspan="${tierCols}" class="colheader">REMIT INVOICE TO</td></tr>`
      termsRow('Company', termsData.remitCompanyName)
      termsRow('Address', `${termsData.remitStreet || ''}, ${termsData.remitCity || ''}, ${termsData.remitState || ''} ${termsData.remitZip || ''}`)
    }

    // Shelf Life
    const shelfLives = [...new Set(skus.map((s) => s.shelfLife).filter(Boolean))]
    if (shelfLives.length > 0) {
      html += `<tr><td colspan="${tierCols}" class="colheader">SHELF LIFE</td></tr>`
      shelfLives.forEach((sl) => termsRow('Duration', `${sl} from Manufacture`))
      if (termsData.lotCodeFormat) termsRow('Lot Code Format', termsData.lotCodeFormat)
    }

    // Terms of Sale
    html += `<tr><td colspan="${tierCols}" class="colheader">TERMS OF SALE</td></tr>`
    termsRow('1. Minimum Order', termsData.minimumOrder || 'N/A')
    termsRow('2. Pricing', 'Delivered Pricing')
    termsRow('3. Transportation', termsData.transportation || 'N/A')
    termsRow('4. Payment Terms', termsData.paymentTerms || 'N/A')
    termsRow('5. Lead Time', termsData.leadTime || 'N/A')
    termsRow('6. POs should be sent to', termsData.poEmail || 'N/A')
    if (termsData.hasCustomerPickup === 'yes') {
      termsRow('7. Customer Pickup Allowances', termsData.customerPickupAllowances || 'N/A')
    }

    // Blank row
    html += `<tr><td colspan="${tierCols}" class="empty">&nbsp;</td></tr>`

    // Footer
    html += `<tr><td colspan="${tierCols}" style="text-align:center; font-size:9pt; color:#666; border:none; font-style:italic;">Confidential and proprietary. Internal business use only unless otherwise authorized by Elohi.</td></tr>`

    html += `</table></body></html>`

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${companyInfo.companyName || 'Elohi'}_Price_Sheet.xls`
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
          Download Excel
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
