"use client"

import type { SKUInput } from "@/lib/types"
import { Trash2 } from 'lucide-react'

interface Step5Props {
  skus: SKUInput[]
  onChange: (skus: SKUInput[]) => void
}

export default function Step5SKUSetup({ skus, onChange }: Step5Props) {
  const addSKU = () => {
    onChange([
      ...skus,
      {
        productName: "",
        temperatureClass: "shelf",
        shelfLife: "",
        lbsPerUnit: 0,
        unitsPerCase: 1,
        basePricePerCase: 0,
        cogsPerLb: 0,
      },
    ])
  }

  const updateSKU = (index: number, updatedSKU: SKUInput) => {
    const newSKUs = [...skus]
    newSKUs[index] = updatedSKU
    onChange(newSKUs)
  }

  const removeSKU = (index: number) => {
    onChange(skus.filter((_, i) => i !== index))
  }

  const cloneSKU = (index: number) => {
    const sourceSku = skus[index]
    const clonedSku: SKUInput = {
      ...sourceSku,
      productName: sourceSku.productName ? `${sourceSku.productName} Copy` : "",
    }

    const updated = [...skus]
    updated.splice(index + 1, 0, clonedSku)
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">SKU Setup</h2>
            <p className="text-sm text-gray-600">Add and configure multiple SKUs with required fields.</p>
          </div>
          <button
            onClick={addSKU}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm"
          >
            + Add SKU
          </button>
        </div>

        {skus.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No SKUs added yet. Click "Add SKU" to get started.</p>
          </div>
        )}
      </div>

      {skus.map((sku, index) => {
        const lbsPerCase = sku.lbsPerUnit * sku.unitsPerCase
        const pricePerLb = lbsPerCase > 0 ? sku.basePricePerCase / lbsPerCase : 0

        return (
          <div key={index} className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">SKU #{index + 1}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => cloneSKU(index)}
                  className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md"
                >
                  Clone SKU
                </button>
                <button
                  onClick={() => removeSKU(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  title="Remove SKU"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name / Description</label>
              <input
                type="text"
                value={sku.productName}
                onChange={(e) => updateSKU(index, { ...sku, productName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Temperature Class</label>
              <select
                value={sku.temperatureClass}
                onChange={(e) => updateSKU(index, { ...sku, temperatureClass: e.target.value as any })}
                className="mt-1 block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              >
                <option value="shelf">Shelf</option>
                <option value="refrigerated">Refrigerated</option>
                <option value="frozen">Frozen</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Shelf Life</label>
                <input
                  type="text"
                  value={sku.shelfLife || ""}
                  onChange={(e) => updateSKU(index, { ...sku, shelfLife: e.target.value })}
                  className="mt-1 block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Unit Weight</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={sku.lbsPerUnit || ""}
                  onChange={(e) => updateSKU(index, { ...sku, lbsPerUnit: Number.parseFloat(e.target.value) || 0 })}
                  className="mt-1 block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Units per Case</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={sku.unitsPerCase || ""}
                  onChange={(e) => updateSKU(index, { ...sku, unitsPerCase: Number.parseInt(e.target.value) || 1 })}
                  className="mt-1 block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">Lbs/Case</label>
                <input
                  type="text"
                  value={lbsPerCase.toFixed(2)}
                  readOnly
                  className="mt-1 block w-full max-w-xs rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm px-3 py-2 border text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">$/Case</label>
                <input
                  type="text"
                  value={sku.basePricePerCase.toFixed(2)}
                  readOnly
                  className="mt-1 block w-full max-w-xs rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm px-3 py-2 border text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">$/Lb</label>
                <input
                  type="text"
                  value={pricePerLb.toFixed(2)}
                  readOnly
                  className="mt-1 block w-full max-w-xs rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm px-3 py-2 border text-gray-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Base Price per Case ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={sku.basePricePerCase || ""}
                  onChange={(e) =>
                    updateSKU(index, { ...sku, basePricePerCase: Number.parseFloat(e.target.value) || 0 })
                  }
                  className="mt-1 block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">COGS per Lb ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={sku.cogsPerLb || ""}
                  onChange={(e) => updateSKU(index, { ...sku, cogsPerLb: Number.parseFloat(e.target.value) || 0 })}
                  className="mt-1 block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
