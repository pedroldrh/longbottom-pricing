"use client"

import { useState, useRef, useCallback } from "react"
import type { SKUInput } from "@/lib/types"
import { Trash2, Check } from 'lucide-react'
import CustomSelect from "@/components/CustomSelect"
import InfoTip from "@/components/InfoTip"

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
  unitsPerCase: 0,
  caseSize: "",
  palletSize: "",
  caseCube: 0,
  caseGrossWeight: 0,
  casesPerPallet: 0,
  palletTI: 0,
  palletHI: 0,
}

export default function Step5SKUSetup({ skus, onChange }: Step5Props) {
  // Track which SKUs have been saved (persistent until edited)
  const [savedSet, setSavedSet] = useState<Set<number>>(new Set())
  // Snapshot of each SKU at the time it was saved, to detect edits
  const savedSnapshots = useRef<Map<number, string>>(new Map())

  const readOnlyValueClassName =
    "mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm px-3 py-2 border text-gray-600"

  // Format numeric fields on blur to proper precision
  const formatOnBlur = (index: number, field: keyof SKUInput, decimals: number) => (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value
    if (raw === "") return
    const num = decimals === 0 ? Math.round(Number(raw)) : Math.round(Number(raw) * 10 ** decimals) / 10 ** decimals
    if (num < 0) {
      updateSKU(index, { ...skus[index], [field]: 0 })
      return
    }
    if (num !== skus[index][field]) {
      updateSKU(index, { ...skus[index], [field]: num })
    }
  }

  const handleSave = (index: number) => {
    // Data is already persisted via localStorage in CalculatorForm,
    // this triggers a visual confirmation for the user
    onChange([...skus])
    setSavedSet((prev) => new Set(prev).add(index))
    savedSnapshots.current.set(index, JSON.stringify(skus[index]))
  }

  // Check if a SKU has been edited since last save
  const isSaved = useCallback((index: number) => {
    if (!savedSet.has(index)) return false
    const snapshot = savedSnapshots.current.get(index)
    return snapshot === JSON.stringify(skus[index])
  }, [savedSet, skus])

  const addSKU = () => {
    // Append to bottom for consistency with facility add
    onChange([...skus, { ...emptySKU }])
  }

  const updateSKU = (index: number, updatedSKU: SKUInput) => {
    const newSKUs = [...skus]
    newSKUs[index] = updatedSKU
    onChange(newSKUs)
  }

  const removeSKU = (index: number) => {
    if (skus.length <= 1) return // Always keep at least 1 SKU
    onChange(skus.filter((_, i) => i !== index))
    // Clean up saved state for removed index
    setSavedSet((prev) => {
      const next = new Set<number>()
      prev.forEach((i) => {
        if (i < index) next.add(i)
        else if (i > index) next.add(i - 1)
      })
      return next
    })
    savedSnapshots.current.delete(index)
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
        const hasCaseNetWeight = sku.lbsPerUnit > 0 && sku.unitsPerCase > 0

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
                    isSaved(index)
                      ? "bg-green-600 text-white"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {isSaved(index) ? (
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
                  disabled={skus.length <= 1}
                  className={`p-2 rounded-md ${
                    skus.length <= 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-red-600 hover:bg-red-50"
                  }`}
                  title={skus.length <= 1 ? "At least one SKU is required" : "Remove SKU"}
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
                  onBlur={formatOnBlur(index, "lbsPerUnit", 2)}
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
                  onChange={(e) => updateSKU(index, { ...sku, unitsPerCase: Number.parseInt(e.target.value) || 0 })}
                  onBlur={formatOnBlur(index, "unitsPerCase", 0)}
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
                <label className="flex items-center text-sm font-medium text-gray-700">Case Cube (Cu. ft.)<InfoTip text="The volume of one case in cubic feet. Used to calculate how many cases fit on a truck or pallet for freight planning." /></label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={sku.caseCube || ""}
                  onChange={(e) => updateSKU(index, { ...sku, caseCube: Number.parseFloat(e.target.value) || 0 })}
                  onBlur={formatOnBlur(index, "caseCube", 2)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="0.39"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Case Net Weight (lbs.)</label>
                <div className="relative">
                  {!hasCaseNetWeight && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 flex items-center px-3 py-2 text-sm text-gray-400"
                    >
                      10.00
                    </div>
                  )}
                  <input
                    type="text"
                    value={hasCaseNetWeight ? caseNetWeight.toFixed(2) : ""}
                    readOnly
                    className={readOnlyValueClassName}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Case Gross Weight (lbs.)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={sku.caseGrossWeight || ""}
                  onChange={(e) => updateSKU(index, { ...sku, caseGrossWeight: Number.parseFloat(e.target.value) || 0 })}
                  onBlur={formatOnBlur(index, "caseGrossWeight", 2)}
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
                  onBlur={formatOnBlur(index, "casesPerPallet", 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="100"
                />
              </div>
            </div>

            {/* Row 4: Pallet TI, HI, Temperature Class, Shelf Life */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700">Pallet TI<InfoTip text="Tie — the number of cases that fit in one layer on a pallet. Multiply TI × HI to get total cases per pallet." /></label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={sku.palletTI || ""}
                  onChange={(e) => updateSKU(index, { ...sku, palletTI: Number.parseInt(e.target.value) || 0 })}
                  onBlur={formatOnBlur(index, "palletTI", 0)}
                  className="mt-1 block w-full sm:text-sm px-3 py-2 border"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700">Pallet HI<InfoTip text="High — the number of layers stacked on a pallet. Multiply TI × HI to get total cases per pallet." /></label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={sku.palletHI || ""}
                  onChange={(e) => updateSKU(index, { ...sku, palletHI: Number.parseInt(e.target.value) || 0 })}
                  onBlur={formatOnBlur(index, "palletHI", 0)}
                  className="mt-1 block w-full sm:text-sm px-3 py-2 border"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Temperature Class</label>
                <CustomSelect
                  value={sku.temperatureClass}
                  onChange={(val) => updateSKU(index, { ...sku, temperatureClass: val as any })}
                  options={[
                    { value: "shelf", label: "Shelf" },
                    { value: "refrigerated", label: "Refrigerated" },
                    { value: "frozen", label: "Frozen" },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Shelf Life</label>
                <input
                  type="text"
                  value={sku.shelfLife || ""}
                  onChange={(e) => updateSKU(index, { ...sku, shelfLife: e.target.value })}
                  className="mt-1 block w-full sm:text-sm px-3 py-2 border"
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
