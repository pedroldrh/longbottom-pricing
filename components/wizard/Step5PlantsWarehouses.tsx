"use client"

import { Plus, Trash2 } from "lucide-react"
import type { CompanyInfo, PlantWarehouse } from "@/lib/types"

interface Step5Props {
  data: CompanyInfo
  onChange: (data: CompanyInfo) => void
}

function createEmptyPlantWarehouse(): PlantWarehouse {
  return {
    id: Date.now().toString(),
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    isThirdPartyWarehouse: "",
    notes: "",
  }
}

export default function Step5PlantsWarehouses({ data, onChange }: Step5Props) {
  const addPlantWarehouse = () => {
    onChange({
      ...data,
      plantsWarehouses: [...data.plantsWarehouses, createEmptyPlantWarehouse()],
    })
  }

  const updatePlantWarehouse = <K extends keyof PlantWarehouse>(id: string, field: K, value: PlantWarehouse[K]) => {
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
        <h2 className="text-xl font-semibold text-gray-900">Plants/Warehouses</h2>
        <p className="text-sm text-gray-600 mt-1">Define storage and distribution facilities.</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-800">Facility List</h3>
            <p className="text-sm text-gray-600">Add each plant or warehouse used in the network.</p>
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
              <div key={plant.id} className="border rounded-lg p-4 bg-gray-50 space-y-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700">Facility Name</label>
                  <input
                    type="text"
                    value={plant.name}
                    onChange={(e) => updatePlantWarehouse(plant.id, "name", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
                    placeholder="e.g., Plant 1, Cold Storage A"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Street</label>
                    <input
                      type="text"
                      value={plant.street}
                      onChange={(e) => updatePlantWarehouse(plant.id, "street", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      value={plant.city}
                      onChange={(e) => updatePlantWarehouse(plant.id, "city", e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
                      placeholder="Chicago"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <input
                        type="text"
                        value={plant.state}
                        onChange={(e) => updatePlantWarehouse(plant.id, "state", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
                        placeholder="IL"
                        maxLength={2}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Zipcode</label>
                      <input
                        type="text"
                        value={plant.zipCode}
                        onChange={(e) => updatePlantWarehouse(plant.id, "zipCode", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
                        placeholder="60601"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="block text-sm font-medium text-gray-700">Is this a 3rd party warehouse?</p>
                  <div className="mt-2 flex gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name={`third-party-${plant.id}`}
                        checked={plant.isThirdPartyWarehouse === "yes"}
                        onChange={() => updatePlantWarehouse(plant.id, "isThirdPartyWarehouse", "yes")}
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name={`third-party-${plant.id}`}
                        checked={plant.isThirdPartyWarehouse === "no"}
                        onChange={() => updatePlantWarehouse(plant.id, "isThirdPartyWarehouse", "no")}
                      />
                      No
                    </label>
                  </div>
                </div>

                {plant.isThirdPartyWarehouse === "yes" && (
                  <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    This part will be changed in the future. The idea is to ask specific questions about the 3rd party warehouse.
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
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
