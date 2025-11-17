"use client"

import type { Settings } from "@/lib/types"

interface SettingsPanelProps {
  settings: Settings
  onChange: (settings: Settings) => void
}

export default function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const updateTierLabel = (index: number, value: string) => {
    const newLabels = [...settings.tierLabels]
    newLabels[index] = value
    onChange({ ...settings, tierLabels: newLabels })
  }

  const updateVolumeFee = (index: number, value: number) => {
    const newFees = [...settings.volumeFeePct]
    newFees[index] = value
    onChange({ ...settings, volumeFeePct: newFees })
  }

  const updateFreight = (tempClass: keyof Settings["freightPerLb"], index: number, value: number) => {
    const newFreight = { ...settings.freightPerLb }
    newFreight[tempClass] = [...newFreight[tempClass]]
    newFreight[tempClass][index] = value
    onChange({ ...settings, freightPerLb: newFreight })
  }

  const updateAccrual = (key: keyof Settings["accrualPct"], value: number) => {
    onChange({
      ...settings,
      accrualPct: { ...settings.accrualPct, [key]: value },
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Settings (Current Run)</h2>

      {/* Tier Labels */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Tier Labels</h3>
        <div className="grid grid-cols-2 gap-2">
          {settings.tierLabels.map((label, i) => (
            <input
              key={i}
              type="text"
              value={label}
              onChange={(e) => updateTierLabel(i, e.target.value)}
              placeholder={`Tier ${i + 1}`}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
          ))}
        </div>
      </div>

      {/* Volume Fee % */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Volume Fee % (as decimal)</h3>
        <div className="grid grid-cols-4 gap-2">
          {settings.volumeFeePct.map((fee, i) => (
            <input
              key={i}
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={fee}
              onChange={(e) => updateVolumeFee(i, Number.parseFloat(e.target.value) || 0)}
              placeholder={`T${i + 1}`}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
          ))}
        </div>
      </div>

      {/* Freight $/lb */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Freight ($/lb) by Temperature Class</h3>
        <div className="space-y-2">
          {(["shelf", "refrigerated", "frozen"] as const).map((tempClass) => (
            <div key={tempClass} className="flex items-center gap-2">
              <span className="w-24 text-sm text-gray-600 capitalize">{tempClass}</span>
              <div className="grid grid-cols-4 gap-2 flex-1">
                {settings.freightPerLb[tempClass].map((freight, i) => (
                  <input
                    key={i}
                    type="number"
                    step="0.01"
                    min="0"
                    value={freight}
                    onChange={(e) => updateFreight(tempClass, i, Number.parseFloat(e.target.value) || 0)}
                    placeholder={`T${i + 1}`}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accrual % */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Accrual % (as decimal)</h3>
        <div className="space-y-2">
          {Object.entries(settings.accrualPct).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <label className="w-40 text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={value}
                onChange={(e) =>
                  updateAccrual(key as keyof Settings["accrualPct"], Number.parseFloat(e.target.value) || 0)
                }
                className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
