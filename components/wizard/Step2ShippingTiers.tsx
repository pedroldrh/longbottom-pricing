"use client"

import InfoTip from "@/components/InfoTip"

export interface ShippingData {
  tierLabels: string[]
  volumeFeePerCase: number[]
  pallets: string[]
  pounds: string[]
  hasFreightStudy: "yes" | "no" | ""
}

interface Step2Props {
  data: ShippingData
  onChange: (data: ShippingData) => void
}

const TIER_NAMES = ["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5"]

export default function Step2ShippingTiers({ data, onChange }: Step2Props) {
  const pallets = data.pallets || ["", "", "", "", ""]
  const pounds = data.pounds || ["", "", "", "", ""]
  const hasFreightStudy = data.hasFreightStudy || ""

  const updateVolumeFee = (index: number, value: number) => {
    const newFees = [...data.volumeFeePerCase]
    newFees[index] = value
    onChange({ ...data, volumeFeePerCase: newFees })
  }

  const updatePallets = (index: number, value: string) => {
    const newPallets = [...pallets]
    newPallets[index] = value
    onChange({ ...data, pallets: newPallets })
  }

  const updatePounds = (index: number, value: string) => {
    const newPounds = [...pounds]
    newPounds[index] = value
    onChange({ ...data, pounds: newPounds })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Shipping Tiers & Volume Fee</h2>
        <p className="text-sm text-gray-600 mt-1">
          Define shipping tiers with pallet counts, weights, and volume fees.
        </p>
      </div>

      {/* Freight Study Question */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="flex items-center text-sm font-medium text-gray-700">Has your company completed a freight study?<InfoTip text="A freight study analyzes your shipping costs across different routes, carriers, and volume levels to establish accurate per-unit freight rates for each tier." /></p>
        <div className="mt-2 flex gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="freightStudy"
              checked={hasFreightStudy === "yes"}
              onChange={() => onChange({ ...data, hasFreightStudy: "yes" })}
              className="text-blue-600"
            />
            Yes
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="freightStudy"
              checked={hasFreightStudy === "no"}
              onChange={() => onChange({ ...data, hasFreightStudy: "no" })}
              className="text-blue-600"
            />
            No
          </label>
        </div>
        {hasFreightStudy === "no" && (
          <p className="mt-2 text-xs rounded p-2" style={{ background: 'var(--elohi-pistachio)', color: '#1a4d3e' }}>
            Elohi can help you complete a freight study to determine accurate shipping costs per tier.
          </p>
        )}
      </div>

      {/* Tier Cards */}
      <div className="space-y-3">
        {TIER_NAMES.map((name, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-bold text-gray-900 mb-3">{name}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Pallets</label>
                <input
                  type="text"
                  value={pallets[i]}
                  onChange={(e) => updatePallets(i, e.target.value)}
                  placeholder={i === 4 ? "N/A" : "e.g. 20"}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Approx. Pounds</label>
                <input
                  type="text"
                  value={pounds[i]}
                  onChange={(e) => updatePounds(i, e.target.value)}
                  placeholder={i === 4 ? "e.g. 1-case Min" : "e.g. ~38,000 lbs"}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>
              <div>
                <label className="flex items-center text-xs text-gray-600 mb-1">Volume fee (%)<InfoTip text="A percentage markup on the base case price based on order size. Smaller orders have higher fees to offset handling and logistics inefficiency." /></label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={data.volumeFeePerCase[i] || 0}
                  onChange={(e) => updateVolumeFee(i, Number.parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-md p-4" style={{ background: '#f0ebfa', border: '1px solid var(--elohi-lilac)' }}>
        <p className="text-xs" style={{ color: '#330E69' }}>
          <strong>Note:</strong> Volume fees are applied per case and reflect the handling efficiency of different
          shipment sizes. Full truckloads typically have lower fees, while smaller shipments (dropship) have higher
          fees.
        </p>
      </div>
    </div>
  )
}
