"use client"

import InfoTip from "@/components/InfoTip"

export interface TradeSpendData {
  distributorTradeAccrual: number
  operatorTradeAccrual: number
  distributorMarketingAccrual: number
  operatorMarketingAccrual: number
  deviatedBillback: number
}

interface Step4Props {
  data: TradeSpendData
  onChange: (data: TradeSpendData) => void
}

const ROWS = [
  { key: "distributorTradeAccrual" as const, label: "Distributor Trade Accrual", range: "7% - 12%**", tip: "Percentage of net sell price paid to distributors for promotional activities, slotting fees, and sales incentives." },
  { key: "operatorTradeAccrual" as const, label: "Operator Trade Accrual", range: "5% - 8%", tip: "Percentage paid to foodservice operators (restaurants, cafeterias, hotels) as purchasing incentives or rebates." },
  { key: "distributorMarketingAccrual" as const, label: "Distributor Marketing Accrual", range: "4% - 8%", tip: "Percentage allocated for distributor-facing marketing programs such as catalogs, trade shows, and co-op advertising." },
  { key: "operatorMarketingAccrual" as const, label: "Operator Marketing Accrual", range: "2% - 4%", tip: "Percentage allocated for operator-facing marketing like menu placement, sampling programs, and promotional materials." },
  { key: "deviatedBillback" as const, label: "Deviated Billback", range: "As Negotiated", tip: "A pricing arrangement where the manufacturer agrees to a lower 'deviated' price for a specific operator through a distributor, then reimburses the distributor for the price difference." },
]

const BACKGROUND_HINTS: Record<(typeof ROWS)[number]["key"], string> = {
  distributorTradeAccrual: "10.0",
  operatorTradeAccrual: "6.0",
  distributorMarketingAccrual: "4.0",
  operatorMarketingAccrual: "2.0",
  deviatedBillback: "0.0",
}

export default function Step4TradeSpend({ data, onChange }: Step4Props) {
  const sum =
    data.distributorTradeAccrual +
    data.operatorTradeAccrual +
    data.distributorMarketingAccrual +
    data.operatorMarketingAccrual +
    data.deviatedBillback

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Trade Spend</h2>
        <p className="text-sm text-gray-600 mt-1">
          Enter your company's trade spend percentages. Industry ranges are provided as a guide.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          What is your company's total trade spend as a percentage?
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={sum === 0 ? "" : sum.toFixed(1)}
            readOnly
            className="block w-32 rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm px-3 py-2 border text-gray-600"
          />
          <span className="text-sm text-gray-500">%</span>
        </div>
        <p className="text-xs text-gray-500">
          This is the % of revenue set aside for marketing and sales activities. It is built into the pricing so it does not reduce the reported margin.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-sm font-semibold text-gray-900 pb-2 pr-4">Industry Range</th>
              <th className="text-right text-sm font-semibold text-gray-900 pb-2 px-4">Your %</th>
              <th className="text-left text-sm font-semibold text-gray-900 pb-2 pl-4">Category</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.key} className="border-t border-gray-200">
                <td className="py-3 pr-4 text-sm text-gray-700 text-right whitespace-nowrap">
                  {row.range}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end">
                    <div className="relative">
                      {data[row.key] === 0 && (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 flex items-center justify-end px-3 py-2 text-sm text-gray-400"
                        >
                          {BACKGROUND_HINTS[row.key]}
                        </div>
                      )}
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={data[row.key] === 0 ? "" : data[row.key]}
                        onChange={(e) =>
                          onChange({ ...data, [row.key]: Number.parseFloat(e.target.value) || 0 })
                        }
                        className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border text-right bg-yellow-100"
                      />
                    </div>
                    <span className="ml-1 text-sm text-gray-500">%</span>
                  </div>
                </td>
                <td className="py-3 pl-4 text-sm text-gray-900 font-medium">
                  <span className="flex items-center">{row.label}<InfoTip text={row.tip} /></span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-900">
              <td className="py-3 pr-4 text-sm font-bold text-gray-900 text-right">18% - 25%</td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end">
                  <span className="w-24 text-right text-sm font-bold text-gray-900 px-3 py-2">
                    {sum === 0 ? "" : sum.toFixed(1)}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">%</span>
                </div>
              </td>
              <td className="py-3 pl-4 text-sm font-bold text-gray-900">Sum of Trade Spend</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="text-xs text-gray-500">
        ** Distributor Trade Accrual is the % of revenue set aside for distributor trade activities. All percentages are built into the pricing so they do not reduce the reported margin.
      </p>
    </div>
  )
}
