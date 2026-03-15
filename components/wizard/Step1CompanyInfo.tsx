"use client"

import type { CompanyInfo } from "@/lib/types"

interface Step1Props {
  data: CompanyInfo
  onChange: (data: CompanyInfo) => void
}

export default function Step1CompanyInfo({ data, onChange }: Step1Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Company Info</h2>
        <p className="text-sm text-gray-600 mt-1">
          Enter general company profile information.
        </p>
      </div>

      {/* Company Information */}
      <div className="space-y-4 border-b pb-6">
        <h3 className="text-lg font-medium text-gray-800">Company Information</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
          <div>
            <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700">
              Effective Date
            </label>
            <input
              type="text"
              id="effectiveDate"
              value={data.effectiveDate}
              onChange={(e) => onChange({ ...data, effectiveDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              placeholder="MM/DD/YYYY"
              inputMode="numeric"
              pattern="^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>
    </div>
  )
}
