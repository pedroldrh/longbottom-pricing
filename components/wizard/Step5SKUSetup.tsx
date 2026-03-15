"use client"

import { useState } from "react"
import type { SKUInput } from "@/lib/types"
import { Trash2, Check } from 'lucide-react'

interface Step5Props {
  skus: SKUInput[]
  onChange: (skus: SKUInput[]) => void
}

const emptySKU: SKUInput = {
  productName: "",
  caseUPC: "",
  temperatureClass: "shelf",
  shelfLife: "",
  lbsPerUnit: 0,
  unitsPerCase: 1,
  caseSize: "",
  palletSize: "",
  caseCube: 0,
  caseGrossWeight: 0,
  casesPerPallet: 0,
  palletTI: 0,
  palletHI: 0,
}

export default function Step5SKUSetup({ skus, onChange }: Step5Props) {
  const [savedIndex, setSavedIndex] = useState<number | null>(null)

  const handleSave = (index: number) => {
    // Data is already persisted via localStorage in CalculatorForm,
    // this triggers a visual confirmation for the user
    onChange([...skus])
    setSavedIndex(index)
    setTimeout(() => setSavedIndex(null), 2000)
  }

  const addSKU = () => {
    onChange([...skus, { ...emptySKU }])
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
            <h2 className="text-xl font-semibold text-gray-900">Product Set-Up</h2>
            <p className="text-sm text-gray-600">Enter your product information for each SKU.</p>
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
            <p>No SKUs added yet. Click &quot;Add SKU&quot; to get started.</p>
          </div>
        )}
      </div>

      {skus.map((sku, index) => {
        const caseNetWeight = sku.lbsPerUnit * sku.unitsPerCase

        return (
          <div key={index} className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {sku.productName || `SKU #${index + 1}`}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSave(index)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    savedIndex === index
                      ? "bg-green-600 text-white"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {savedIndex === index ? (
                    <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Saved</span>
                  ) : (
                    "Save"
                  )}
                </button>
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

            {/* Row 1: Product Name, Case UPC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name / Description</label>
                <input
                  type="text"
                  value={sku.productName}
                  onChange={(e) => updateSKU(index, { ...sku, productName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="e.g. BeefWorks Plant-Based Ground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Case UPC</label>
                <input
                  type="text"
                  value={sku.caseUPC || ""}
                  onChange={(e) => updateSKU(index, { ...sku, caseUPC: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="e.g. 1-08-60008-52962-6"
                />
              </div>
            </div>

            {/* Row 2: Unit Weight, Units/Case, Case Size, Pallet Size */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit Weight (lbs.)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={sku.lbsPerUnit || ""}
                  onChange={(e) => updateSKU(index, { ...sku, lbsPerUnit: Number.parseFloat(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="2.50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Units / Case</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={sku.unitsPerCase || ""}
                  onChange={(e) => updateSKU(index, { ...sku, unitsPerCase: Number.parseInt(e.target.value) || 1 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Case Size L x W x H (in.)</label>
                <input
                  type="text"
                  value={sku.caseSize || ""}
                  onChange={(e) => updateSKU(index, { ...sku, caseSize: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="10.0 x 15.0 x 4.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pallet Size L x W x H (in.)</label>
                <input
                  type="text"
                  value={sku.palletSize || ""}
                  onChange={(e) => updateSKU(index, { ...sku, palletSize: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="48 x 40 x 50"
                />
              </div>
            </div>

            {/* Row 3: Case Cube, Case Net Weight (computed), Case Gross Weight, Cases/Pallet */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Case Cube (Cu. ft.)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={sku.caseCube || ""}
                  onChange={(e) => updateSKU(index, { ...sku, caseCube: Number.parseFloat(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="0.39"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Case Net Weight (lbs.)</label>
                <input
                  type="text"
                  value={caseNetWeight.toFixed(2)}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm px-3 py-2 border text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Case Gross Weight (lbs.)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={sku.caseGrossWeight || ""}
                  onChange={(e) => updateSKU(index, { ...sku, caseGrossWeight: Number.parseFloat(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="10.95"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cases / Pallet</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={sku.casesPerPallet || ""}
                  onChange={(e) => updateSKU(index, { ...sku, casesPerPallet: Number.parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="100"
                />
              </div>
            </div>

            {/* Row 4: Pallet TI, HI, Temperature Class */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Pallet TI</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={sku.palletTI || ""}
                  onChange={(e) => updateSKU(index, { ...sku, palletTI: Number.parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pallet HI</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={sku.palletHI || ""}
                  onChange={(e) => updateSKU(index, { ...sku, palletHI: Number.parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Temperature Class</label>
                <select
                  value={sku.temperatureClass}
                  onChange={(e) => updateSKU(index, { ...sku, temperatureClass: e.target.value as any })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="shelf">Shelf</option>
                  <option value="refrigerated">Refrigerated</option>
                  <option value="frozen">Frozen</option>
                </select>
              </div>
            </div>

            {/* Row 5: Shelf Life */}
            <div className="flex justify-center">
              <div className="w-full max-w-xs">
                <label className="block text-sm font-medium text-gray-700 text-center">Shelf Life</label>
                <input
                  type="text"
                  value={sku.shelfLife || ""}
                  onChange={(e) => updateSKU(index, { ...sku, shelfLife: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
