"use client"

import { useState, useEffect } from "react"
import { calculatePricing } from "@/app/actions"
import type { PricingResult, SKUInput, Settings, CompanyInfo } from "@/lib/types"
import SettingsPanel from "./SettingsPanel"
import ResultsTable from "./ResultsTable"
import defaults from "@/config/defaults.json"
import ProgressIndicator from "./wizard/ProgressIndicator"
import Step1CompanyInfo from "./wizard/Step1CompanyInfo"
import Step2ShippingTiers from "./wizard/Step2ShippingTiers"
import Step3FreightRates from "./wizard/Step3FreightRates"
import Step4TradeSpend from "./wizard/Step4TradeSpend"
import Step5SKUSetup from "./wizard/Step5SKUSetup"
import Step6Results from "./wizard/Step6Results"

const STEPS = [
  "Company Info",
  "Product Set-Up",
  "Trade Spend",
  "Shipping Tiers & Volume Fee",
  "Freight by Temperature Class",
  "Final Price Output",
]

const STORAGE_KEYS = {
  CURRENT_STEP: "pricing_calculator_current_step",
  COMPANY_INFO: "pricing_calculator_company_info",
  SHIPPING_DATA: "pricing_calculator_shipping_data",
  FREIGHT_DATA: "pricing_calculator_freight_data",
  TRADE_SPEND_DATA: "pricing_calculator_trade_spend_data",
  SKUS: "pricing_calculator_skus",
}

export default function CalculatorForm() {
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP)
      return saved ? parseInt(saved, 10) : 1
    }
    return 1
  })
  
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPANY_INFO)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error("Failed to parse company info from localStorage", e)
        }
      }
    }
    return {
      effectiveDate: "",
      companyName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      plantsWarehouses: [],
    }
  })

  const [shippingData, setShippingData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.SHIPPING_DATA)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error("Failed to parse shipping data from localStorage", e)
        }
      }
    }
    return {
      tierLabels: [
        "Full truckload",
        "Half truckload",
        "Quarter truckload",
        "One pallet",
        "Dropship (less than a pallet)",
      ],
      volumeFeePerCase: [0, 2, 4, 8, 12],
    }
  })

  const [freightData, setFreightData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.FREIGHT_DATA)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error("Failed to parse freight data from localStorage", e)
        }
      }
    }
    return {
      freightPerLb: {
        shelf: { useDefaultRate: true, ratePerLb: 0.25 },
        refrigerated: { useDefaultRate: true, ratePerLb: 0.35 },
        frozen: { useDefaultRate: true, ratePerLb: 0.45 },
      },
    }
  })

  const [tradeSpendData, setTradeSpendData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.TRADE_SPEND_DATA)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error("Failed to parse trade spend data from localStorage", e)
        }
      }
    }
    return {
      tradeSpendPct: 25,
    }
  })

  const [skus, setSkus] = useState<SKUInput[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.SKUS)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error("Failed to parse SKUs from localStorage", e)
        }
      }
    }
    return []
  })

  const [results, setResults] = useState<PricingResult[]>([])
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, currentStep.toString())
  }, [currentStep])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPANY_INFO, JSON.stringify(companyInfo))
  }, [companyInfo])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHIPPING_DATA, JSON.stringify(shippingData))
  }, [shippingData])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FREIGHT_DATA, JSON.stringify(freightData))
  }, [freightData])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRADE_SPEND_DATA, JSON.stringify(tradeSpendData))
  }, [tradeSpendData])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SKUS, JSON.stringify(skus))
  }, [skus])

  const handleCalculate = async () => {
    setIsCalculating(true)

    try {
      const settings: Settings = {
        tierLabels: shippingData.tierLabels,
        volumeFeePct: shippingData.volumeFeePerCase,
        freightPerLb: freightData.freightPerLb,
        tradeSpendPct: tradeSpendData.tradeSpendPct,
      }

      const calculationResults = await Promise.all(
        skus.map((sku) => calculatePricing({ sku, settings }))
      )
      setResults(calculationResults)
    } catch (error) {
      console.error("Calculation error:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStartOver = () => {
    if (confirm("Are you sure you want to start over? All data will be cleared.")) {
      // Clear all localStorage
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })

      // Reset all state to defaults
      setCurrentStep(1)
      setCompanyInfo({
        effectiveDate: "",
        companyName: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        plantsWarehouses: [],
      })
      setShippingData({
        tierLabels: [
          "Full truckload",
          "Half truckload",
          "Quarter truckload",
          "One pallet",
          "Dropship (less than a pallet)",
        ],
        volumeFeePerCase: [0, 2, 4, 8, 12],
      })
      setFreightData({
        freightPerLb: {
          shelf: { useDefaultRate: true, ratePerLb: 0.25 },
          refrigerated: { useDefaultRate: true, ratePerLb: 0.35 },
          frozen: { useDefaultRate: true, ratePerLb: 0.45 },
        },
      })
      setTradeSpendData({
        tradeSpendPct: 25,
      })
      setSkus([])
      setResults([])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ProgressIndicator currentStep={currentStep} totalSteps={STEPS.length} steps={STEPS} />
        <button
          onClick={handleStartOver}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 font-medium"
        >
          Start Over
        </button>
      </div>

      {currentStep === 1 && <Step1CompanyInfo data={companyInfo} onChange={setCompanyInfo} />}
      {currentStep === 2 && <Step5SKUSetup skus={skus} onChange={setSkus} />}
      {currentStep === 3 && <Step4TradeSpend data={tradeSpendData} onChange={setTradeSpendData} />}
      {currentStep === 4 && <Step2ShippingTiers data={shippingData} onChange={setShippingData} />}
      {currentStep === 5 && (
        <Step3FreightRates data={freightData} tierLabels={shippingData.tierLabels} onChange={setFreightData} />
      )}
      {currentStep === 6 && (
        <Step6Results skus={skus} results={results} onCalculate={handleCalculate} isCalculating={isCalculating} />
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow p-6">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
        >
          Previous
        </button>

        <div className="text-sm text-gray-600">
          Step {currentStep} of {STEPS.length}
        </div>

        <button
          onClick={nextStep}
          disabled={currentStep === STEPS.length}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
        >
          {currentStep === STEPS.length ? "Complete" : "Next"}
        </button>
      </div>
    </div>
  )
}
