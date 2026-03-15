"use client"

interface Step2Props {
  data: {
    tierLabels: string[]
    volumeFeePerCase: number[]
  }
  onChange: (data: Step2Props["data"]) => void
}

const TIERS = [
  { label: "Full Truck Load", pallets: "20 pallets", size: "" },
  { label: "1/2 Truck Load", pallets: "10 pallets", size: "" },
  { label: "~4,000 lbs", pallets: "4 pallets", size: "" },
  { label: "~1,000 lbs", pallets: "1 pallet", size: "" },
  { label: "1-case Min", pallets: "", size: "" },
]

export default function Step2ShippingTiers({ data, onChange }: Step2Props) {
  const updateVolumeFee = (index: number, value: number) => {
    const newFees = [...data.volumeFeePerCase]
    newFees[index] = value
    onChange({ ...data, volumeFeePerCase: newFees })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Shipping Tiers & Volume Fee</h2>
        <p className="text-sm text-gray-600 mt-1">
          Define the volume fee per case for each shipping tier. These fees represent efficiency adjustments for
          handling different shipment sizes.
        </p>
      </div>

      <div className="space-y-4">
        {TIERS.map((tier, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Tier {i + 1}</p>
              {tier.pallets && <p className="text-sm text-gray-600">{tier.pallets}</p>}
              <p className="text-sm text-gray-600">{tier.label}</p>
            </div>
            <div className="w-36">
              <label className="block text-xs text-gray-600 mb-1">Volume fee per case ($)</label>
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
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> Volume fees are applied per case and reflect the handling efficiency of different
          shipment sizes. Full truckloads typically have lower fees, while smaller shipments (dropship) have higher
          fees.
        </p>
      </div>
    </div>
  )
}
