"use client"

import type { Settings } from "@/lib/types"

interface Step3Props {
  data: {
    freightPerLb: Settings["freightPerLb"]
  }
  onChange: (data: Step3Props["data"]) => void
}

export default function Step3FreightRates({ data, onChange }: Step3Props) {
  const tempClasses = [
    { key: "shelf" as const, label: "Ambient", defaultRate: 0.25 },
    { key: "refrigerated" as const, label: "Refrigerated", defaultRate: 0.35 },
    { key: "frozen" as const, label: "Frozen", defaultRate: 0.45 },
  ]

  const updateTempClass = (
    tempClass: keyof Settings["freightPerLb"],
    updates: Partial<Settings["freightPerLb"][typeof tempClass]>
  ) => {
    onChange({
      ...data,
      freightPerLb: {
        ...data.freightPerLb,
        [tempClass]: {
          ...data.freightPerLb[tempClass],
          ...updates,
        },
      },
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Freight by Temperature Class</h2>
        <p className="text-sm text-gray-600 mt-1">
          Configure freight rates for each temperature class. SKUs will use the rate corresponding to their temperature
          class.
        </p>
      </div>

      <div className="space-y-6">
        {tempClasses.map(({ key, label, defaultRate }) => {
          const config = data.freightPerLb[key]
          return (
            <div key={key} className="border border-gray-200 rounded-lg p-5 space-y-4">
              <h3 className="text-base font-semibold text-gray-900">{label}</h3>

              {/* Rate Source Selection */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`${key}-rate-source`}
                    checked={config.useDefaultRate}
                    onChange={() => updateTempClass(key, { useDefaultRate: true, ratePerLb: defaultRate })}
                    className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">Use Elohi default directional rate</div>
                    <div className="text-xs text-gray-500">Pre-configured industry standard rate</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`${key}-rate-source`}
                    checked={!config.useDefaultRate}
                    onChange={() => updateTempClass(key, { useDefaultRate: false })}
                    className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">Enter my own freight study rate</div>
                    <div className="text-xs text-gray-500">Use custom rate based on your freight analysis</div>
                  </div>
                </label>
              </div>

              {/* Rate Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Freight rate per lb ($)
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={config.ratePerLb}
                      onChange={(e) => updateTempClass(key, { ratePerLb: Number.parseFloat(e.target.value) || 0 })}
                      disabled={config.useDefaultRate}
                      placeholder="0.00"
                      className="block w-full pl-7 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 sm:text-sm border"
                    />
                  </div>
                  {config.useDefaultRate && (
                    <span className="text-xs text-gray-500 italic">Default rate applied</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium">Multiple temperature classes supported</p>
            <p className="mt-1">
              You can use multiple temperature classes across different SKUs. Each SKU will use the freight rate
              corresponding to its selected temperature class.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
