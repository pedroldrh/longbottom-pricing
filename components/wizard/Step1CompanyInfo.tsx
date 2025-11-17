"use client"

import { Plus, Trash2 } from 'lucide-react'
import type { CompanyInfo, PlantWarehouse } from "@/lib/types"

interface Step1Props {
  data: CompanyInfo
  onChange: (data: CompanyInfo) => void
}

export default function Step1CompanyInfo({ data, onChange }: Step1Props) {
  const addPlantWarehouse = () => {
    const newPlant: PlantWarehouse = {
      id: Date.now().toString(),
      name: "",
      location: "",
      notes: "",
    }
    onChange({
      ...data,
      plantsWarehouses: [...data.plantsWarehouses, newPlant],
    })
  }

  const updatePlantWarehouse = (id: string, field: keyof PlantWarehouse, value: string) => {
    onChange({
      ...data,
      plantsWarehouses: data.plantsWarehouses.map((plant) =>
        plant.id === id ? { ...plant, [field]: value } : plant
      ),
    })
  }

  const removePlantWarehouse = (id: string) => {
    onChange({
      ...data,
      plantsWarehouses: data.plantsWarehouses.filter((plant) => plant.id !== id),
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Company & Logistics Info</h2>
        <p className="text-sm text-gray-600 mt-1">
          Enter general company profile and warehouse/plant information.
        </p>
      </div>

      {/* Company Information */}
      <div className="space-y-4 border-b pb-6">
        <h3 className="text-lg font-medium text-gray-800">Company Information</h3>
        
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="companyName"
            value={data.companyName}
            onChange={(e) => onChange({ ...data, companyName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            placeholder="Your Company Name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
              Contact Name
            </label>
            <input
              type="text"
              id="contactName"
              value={data.contactName}
              onChange={(e) => onChange({ ...data, contactName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              value={data.contactEmail}
              onChange={(e) => onChange({ ...data, contactEmail: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              placeholder="john@company.com"
            />
          </div>

          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
              Contact Phone
            </label>
            <input
              type="tel"
              id="contactPhone"
              value={data.contactPhone}
              onChange={(e) => onChange({ ...data, contactPhone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
      </div>

      {/* Shipping Origin */}
      <div className="space-y-4 border-b pb-6">
        <h3 className="text-lg font-medium text-gray-800">Shipping Origin</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="shippingOriginCity" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="shippingOriginCity"
              value={data.shippingOriginCity}
              onChange={(e) => onChange({ ...data, shippingOriginCity: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              placeholder="Chicago"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="shippingOriginState" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                id="shippingOriginState"
                value={data.shippingOriginState}
                onChange={(e) => onChange({ ...data, shippingOriginState: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                placeholder="IL"
                maxLength={2}
              />
            </div>

            <div>
              <label htmlFor="shippingOriginZip" className="block text-sm font-medium text-gray-700">
                ZIP
              </label>
              <input
                type="text"
                id="shippingOriginZip"
                value={data.shippingOriginZip}
                onChange={(e) => onChange({ ...data, shippingOriginZip: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                placeholder="60601"
                maxLength={10}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Plants / Warehouses */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-800">Plants / Warehouses</h3>
            <p className="text-sm text-gray-600">Define storage and distribution facilities</p>
          </div>
          <button
            type="button"
            onClick={addPlantWarehouse}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Facility
          </button>
        </div>

        {data.plantsWarehouses.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-sm">No facilities added yet. Click "Add Facility" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.plantsWarehouses.map((plant, index) => (
              <div key={plant.id} className="border rounded-lg p-4 bg-gray-50 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-gray-700">Facility {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removePlantWarehouse(plant.id)}
                    className="text-red-600 hover:text-red-700"
                    aria-label="Remove facility"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Facility Name
                    </label>
                    <input
                      type="text"
                      value={plant.name}
                      onChange={(e) => updatePlantWarehouse(plant.id, "name", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
                      placeholder="e.g., Plant 1, Cold Storage A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      value={plant.location}
                      onChange={(e) => updatePlantWarehouse(plant.id, "location", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
                      placeholder="e.g., Chicago, IL"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={plant.notes}
                    onChange={(e) => updatePlantWarehouse(plant.id, "notes", e.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
                    placeholder="Additional information about this facility..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
