"use client"

import type { CompanyInfo, SKUInput, TermsConditions } from "@/lib/types"

interface Step7Props {
  companyInfo: CompanyInfo
  skus: SKUInput[]
  termsData: TermsConditions
  onChange: (data: TermsConditions) => void
}

export default function Step7TermsConditions({ companyInfo, skus, termsData, onChange }: Step7Props) {
  const update = (field: keyof TermsConditions, value: string) => {
    onChange({ ...termsData, [field]: value })
  }

  // Collect unique shelf life values from SKUs
  const shelfLives = [...new Set(skus.map((s) => s.shelfLife).filter(Boolean))]

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Terms and Conditions</h2>
        <p className="text-sm text-gray-600 mt-1">
          Review warehouse, invoicing, shelf life, and sale terms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Warehouse (read-only from Plants/Warehouses step) */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 underline mb-2">WAREHOUSE:</h3>
            {companyInfo.plantsWarehouses.length > 0 ? (
              <div className="space-y-3">
                {companyInfo.plantsWarehouses.map((plant, i) => (
                  <div key={plant.id} className="text-sm text-gray-700 bg-gray-50 rounded-md p-3">
                    <p className="font-medium">{plant.name}</p>
                    <p>{plant.street}</p>
                    <p>{plant.city}, {plant.state}  {plant.zipCode}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No warehouses added yet (go to Plants/Warehouses step).</p>
            )}
          </div>

          {/* Remit Invoice To */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 underline mb-2">Remit Invoice To:</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500">Company Name</label>
                <input
                  type="text"
                  value={termsData.remitCompanyName}
                  onChange={(e) => update("remitCompanyName", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="e.g. Motif FoodWorks"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Street</label>
                <input
                  type="text"
                  value={termsData.remitStreet}
                  onChange={(e) => update("remitStreet", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="27 Drydock 2nd Floor"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500">City</label>
                  <input
                    type="text"
                    value={termsData.remitCity}
                    onChange={(e) => update("remitCity", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                    placeholder="Boston"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">State</label>
                  <input
                    type="text"
                    value={termsData.remitState}
                    onChange={(e) => update("remitState", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                    placeholder="MA"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Zip</label>
                  <input
                    type="text"
                    value={termsData.remitZip}
                    onChange={(e) => update("remitZip", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                    placeholder="02210"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shelf Life (read-only from SKU data) */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 underline mb-2">Shelf Life:</h3>
            {shelfLives.length > 0 ? (
              <div className="text-sm text-gray-700 bg-gray-50 rounded-md p-3 space-y-1">
                {shelfLives.map((sl, i) => (
                  <p key={i}>Product Shelf Life is {sl} from Manufacture</p>
                ))}
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span>Lot Codes Printed on Each Case: reading</span>
                  <input
                    type="text"
                    value={termsData.lotCodeFormat}
                    onChange={(e) => update("lotCodeFormat", e.target.value)}
                    className="inline-block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-2 py-1 border"
                    placeholder="e.g. XXXXX-YYYY"
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No shelf life info (add it in Product Set-Up).</p>
            )}
          </div>
        </div>

        {/* Right Column: Terms and Conditions of Sale */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 underline mb-3">Terms and Conditions of Sale:</h3>
          <div className="space-y-4">
            {/* 1. Minimum Order */}
            <div className="flex items-start gap-3">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap mt-2">1. Minimum Order:</span>
              <input
                type="text"
                value={termsData.minimumOrder}
                onChange={(e) => update("minimumOrder", e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                placeholder="Any Order Size: See Price Tiers"
              />
            </div>

            {/* 2. Pricing (fixed) */}
            <div className="flex items-start gap-3">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap mt-2">2. Pricing:</span>
              <div className="block w-full rounded-md bg-gray-100 sm:text-sm px-3 py-2 text-gray-700">
                Pricing is Delivered Pricing
              </div>
            </div>

            {/* 3. Transportation */}
            <div className="flex items-start gap-3">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap mt-2">3. Transportation:</span>
              <input
                type="text"
                value={termsData.transportation}
                onChange={(e) => update("transportation", e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                placeholder="Product ships frozen"
              />
            </div>

            {/* 4. Payment Terms */}
            <div className="flex items-start gap-3">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap mt-2">4. Payment Terms:</span>
              <input
                type="text"
                value={termsData.paymentTerms}
                onChange={(e) => update("paymentTerms", e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                placeholder="Net 30"
              />
            </div>

            {/* 5. Lead Time */}
            <div className="flex items-start gap-3">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap mt-2">5. Lead Time:</span>
              <input
                type="text"
                value={termsData.leadTime}
                onChange={(e) => update("leadTime", e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                placeholder="3 weeks from receipt of PO to ship date"
              />
            </div>

            {/* 6. PO's should be sent to */}
            <div className="flex items-start gap-3">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap mt-2">6. PO&apos;s should be sent to:</span>
              <input
                type="email"
                value={termsData.poEmail}
                onChange={(e) => update("poEmail", e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                placeholder="orders@company.com"
              />
            </div>

            {/* 7. Customer Pickup Allowances */}
            <div className="flex items-start gap-3">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap mt-2">7. Customer Pickup Allowances:</span>
              <input
                type="text"
                value={termsData.customerPickupAllowances}
                onChange={(e) => update("customerPickupAllowances", e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                placeholder="Enter pickup allowances"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
