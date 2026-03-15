"use client"

import { useState, useEffect } from "react"
import { calculatePricing } from "@/app/actions"
import type { PricingResult, SKUInput, SKUPnLInputs, Settings, CompanyInfo, TermsConditions } from "@/lib/types"
import SettingsPanel from "./SettingsPanel"
import ResultsTable from "./ResultsTable"
import defaults from "@/config/defaults.json"
import ProgressIndicator from "./wizard/ProgressIndicator"
import Step1CompanyInfo from "./wizard/Step1CompanyInfo"
import Step2ShippingTiers from "./wizard/Step2ShippingTiers"
import Step3FreightRates from "./wizard/Step3FreightRates"
import Step4TradeSpend, { type TradeSpendData } from "./wizard/Step4TradeSpend"
import Step5PlantsWarehouses from "./wizard/Step5PlantsWarehouses"
import Step5SKUSetup from "./wizard/Step5SKUSetup"
import Step7TermsConditions from "./wizard/Step7TermsConditions"
import Step6SKUPnL, { emptyPnlInputs } from "./wizard/Step6SKUPnL"
import Step6Results from "./wizard/Step6Results"

const STEPS = [
  "Company Info",
  "Product Set-Up",
  "Trade Spend",
  "Shipping Tiers & Volume Fee",
  "Plants/Warehouses",
  "Gross Profit after Trade Calculation",
  "Terms and Conditions",
  "Final Price Output",
]

const STORAGE_KEYS = {
  CURRENT_STEP: "pricing_calculator_current_step",
  COMPANY_INFO: "pricing_calculator_company_info",
  SHIPPING_DATA: "pricing_calculator_shipping_data",
  FREIGHT_DATA: "pricing_calculator_freight_data",
  TRADE_SPEND_DATA: "pricing_calculator_trade_spend_data",
  SKUS: "pricing_calculator_skus",
  TERMS_DATA: "pricing_calculator_terms_data",
  PNL_INPUTS: "pricing_calculator_pnl_inputs",
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
          const parsed = JSON.parse(saved)
          return {
            effectiveDate: parsed.effectiveDate ?? "",
            companyName: parsed.companyName ?? "",
            contactName: parsed.contactName ?? "",
            contactEmail: parsed.contactEmail ?? "",
            contactPhone: parsed.contactPhone ?? "",
            plantsWarehouses: Array.isArray(parsed.plantsWarehouses)
              ? parsed.plantsWarehouses.map((plant: any, index: number) => ({
                  id: plant.id ?? `${Date.now()}-${index}`,
                  name: plant.name ?? "",
                  street: plant.street ?? "",
                  city: plant.city ?? "",
                  state: plant.state ?? "",
                  zipCode: plant.zipCode ?? "",
                  isThirdPartyWarehouse: plant.isThirdPartyWarehouse ?? "",
                  notes: plant.notes ?? "",
                }))
              : [],
          }
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

  const [tradeSpendData, setTradeSpendData] = useState<TradeSpendData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.TRADE_SPEND_DATA)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          // Migrate from old single-value format
          if ("tradeSpendPct" in parsed && !("distributorTradeAccrual" in parsed)) {
            return {
              distributorTradeAccrual: 10,
              operatorTradeAccrual: 6,
              distributorMarketingAccrual: 4,
              operatorMarketingAccrual: 2,
              deviatedBillback: 0,
            }
          }
          return parsed
        } catch (e) {
          console.error("Failed to parse trade spend data from localStorage", e)
        }
      }
    }
    return {
      distributorTradeAccrual: 10,
      operatorTradeAccrual: 6,
      distributorMarketingAccrual: 4,
      operatorMarketingAccrual: 2,
      deviatedBillback: 0,
    }
  })

  const [skus, setSkus] = useState<SKUInput[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.SKUS)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          return Array.isArray(parsed)
            ? parsed.map((sku: any) => ({
                vendorItemNumber: sku.vendorItemNumber ?? "",
                productName: sku.productName ?? "",
                caseUPC: sku.caseUPC ?? "",
                temperatureClass: sku.temperatureClass ?? "shelf",
                shelfLife: sku.shelfLife ?? "",
                transportation: sku.transportation ?? "",
                lbsPerUnit: sku.lbsPerUnit ?? 0,
                unitsPerCase: sku.unitsPerCase ?? 1,
                caseSize: sku.caseSize ?? "",
                palletSize: sku.palletSize ?? "",
                caseCube: sku.caseCube ?? 0,
                caseGrossWeight: sku.caseGrossWeight ?? 0,
                casesPerPallet: sku.casesPerPallet ?? 0,
                palletTI: sku.palletTI ?? 0,
                palletHI: sku.palletHI ?? 0,
                basePricePerCase: sku.basePricePerCase ?? 0,
                cogsPerLb: sku.cogsPerLb ?? 0,
              }))
            : []
        } catch (e) {
          console.error("Failed to parse SKUs from localStorage", e)
        }
      }
    }
    return []
  })

  const [pnlInputs, setPnlInputs] = useState<SKUPnLInputs[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.PNL_INPUTS)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          return Array.isArray(parsed) ? parsed : []
        } catch (e) {
          console.error("Failed to parse P&L inputs from localStorage", e)
        }
      }
    }
    return []
  })

  const emptyTerms: TermsConditions = {
    remitCompanyName: "",
    remitStreet: "",
    remitCity: "",
    remitState: "",
    remitZip: "",
    minimumOrder: "",
    transportation: "",
    paymentTerms: "",
    leadTime: "",
    poEmail: "",
    customerPickupAllowances: "",
  }

  const [termsData, setTermsData] = useState<TermsConditions>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.TERMS_DATA)
      if (saved) {
        try {
          return { ...emptyTerms, ...JSON.parse(saved) }
        } catch (e) {
          console.error("Failed to parse terms data from localStorage", e)
        }
      }
    }
    return emptyTerms
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TERMS_DATA, JSON.stringify(termsData))
  }, [termsData])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PNL_INPUTS, JSON.stringify(pnlInputs))
  }, [pnlInputs])

  // Keep pnlInputs array in sync with skus length
  useEffect(() => {
    setPnlInputs((prev) => {
      if (prev.length === skus.length) return prev
      if (prev.length < skus.length) {
        return [...prev, ...Array.from({ length: skus.length - prev.length }, () => emptyPnlInputs())]
      }
      return prev.slice(0, skus.length)
    })
  }, [skus.length])

  const handleCalculate = async () => {
    setIsCalculating(true)

    try {
      const tradeSpendPct =
        tradeSpendData.distributorTradeAccrual +
        tradeSpendData.operatorTradeAccrual +
        tradeSpendData.distributorMarketingAccrual +
        tradeSpendData.operatorMarketingAccrual +
        tradeSpendData.deviatedBillback

      const settings: Settings = {
        tierLabels: shippingData.tierLabels,
        volumeFeePct: shippingData.volumeFeePerCase,
        freightPerLb: freightData.freightPerLb,
        tradeSpendPct,
        accrualPct: {
          distributor: tradeSpendData.distributorTradeAccrual / 100,
          operator: tradeSpendData.operatorTradeAccrual / 100,
          baseMarketing: tradeSpendData.distributorMarketingAccrual / 100,
          additionalMarketing: tradeSpendData.operatorMarketingAccrual / 100,
          deviatedBillback: tradeSpendData.deviatedBillback / 100,
        },
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
        distributorTradeAccrual: 10,
        operatorTradeAccrual: 6,
        distributorMarketingAccrual: 4,
        operatorMarketingAccrual: 2,
        deviatedBillback: 0,
      })
      setSkus([])
      setPnlInputs([])
      setTermsData(emptyTerms)
      setResults([])
    }
  }

  const isValidDate = (value: string) => /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(value.trim())

  const isCompanyInfoComplete = isValidDate(companyInfo.effectiveDate) && companyInfo.companyName.trim().length > 0

  const isSkuComplete = (sku: SKUInput) =>
    sku.productName.trim().length > 0 &&
    sku.shelfLife.trim().length > 0 &&
    sku.transportation.trim().length > 0 &&
    sku.lbsPerUnit > 0 &&
    sku.unitsPerCase > 0 &&
    sku.basePricePerCase > 0 &&
    sku.cogsPerLb > 0

  const isProductSetupComplete = skus.length > 0 && skus.every(isSkuComplete)
  const isTradeSpendComplete =
    tradeSpendData.distributorTradeAccrual +
    tradeSpendData.operatorTradeAccrual +
    tradeSpendData.distributorMarketingAccrual +
    tradeSpendData.operatorMarketingAccrual +
    tradeSpendData.deviatedBillback > 0
  const isShippingTiersComplete =
    shippingData.volumeFeePerCase.length === 5 &&
    shippingData.volumeFeePerCase.every((fee) => Number.isFinite(fee) && fee >= 0)
  const isPlantsWarehousesComplete =
    companyInfo.plantsWarehouses.length > 0 &&
    companyInfo.plantsWarehouses.every(
      (plant) =>
        plant.name.trim().length > 0 &&
        plant.street.trim().length > 0 &&
        plant.city.trim().length > 0 &&
        plant.state.trim().length > 0 &&
        plant.zipCode.trim().length > 0 &&
        plant.isThirdPartyWarehouse !== ""
    )
  const isFreightComplete = Object.values(freightData.freightPerLb).every(
    (config) => Number.isFinite(config.ratePerLb) && config.ratePerLb >= 0
  )
  const isTermsComplete = currentStep > 7
  const isFinalOutputComplete = results.length > 0

  const completedSteps = [
    isCompanyInfoComplete,
    isProductSetupComplete,
    isTradeSpendComplete,
    isShippingTiersComplete,
    isPlantsWarehousesComplete,
    isFreightComplete,
    isTermsComplete,
    isFinalOutputComplete,
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ProgressIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
          totalSteps={STEPS.length}
          steps={STEPS}
          onStepClick={setCurrentStep}
        />
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
      {currentStep === 5 && <Step5PlantsWarehouses data={companyInfo} onChange={setCompanyInfo} />}
      {currentStep === 6 && (
        <Step6SKUPnL
          skus={skus}
          shippingData={shippingData}
          tradeSpendData={tradeSpendData}
          pnlInputs={pnlInputs}
          onChange={setPnlInputs}
        />
      )}
      {currentStep === 7 && (
        <Step7TermsConditions
          companyInfo={companyInfo}
          skus={skus}
          termsData={termsData}
          onChange={setTermsData}
        />
      )}
      {currentStep === 8 && (
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
