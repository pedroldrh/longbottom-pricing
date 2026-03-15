"use client"

import { useState, useEffect } from "react"
import type { SKUInput, SKUPnLInputs, CompanyInfo, TermsConditions } from "@/lib/types"
import ProgressIndicator from "./wizard/ProgressIndicator"
import Step1CompanyInfo from "./wizard/Step1CompanyInfo"
import Step2ShippingTiers from "./wizard/Step2ShippingTiers"
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
      pallets: ["", "", "", "", ""],
      pounds: ["", "", "", "", ""],
      hasFreightStudy: "",
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
                productName: sku.productName ?? "",
                caseUPC: sku.caseUPC ?? "",
                temperatureClass: sku.temperatureClass ?? "shelf",
                shelfLife: sku.shelfLife ?? "",
                lbsPerUnit: sku.lbsPerUnit ?? 0,
                unitsPerCase: sku.unitsPerCase ?? 1,
                caseSize: sku.caseSize ?? "",
                palletSize: sku.palletSize ?? "",
                caseCube: sku.caseCube ?? 0,
                caseGrossWeight: sku.caseGrossWeight ?? 0,
                casesPerPallet: sku.casesPerPallet ?? 0,
                palletTI: sku.palletTI ?? 0,
                palletHI: sku.palletHI ?? 0,
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
    lotCodeFormat: "",
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
        pallets: ["", "", "", "", ""],
        pounds: ["", "", "", "", ""],
        hasFreightStudy: "",
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
    }
  }

  const handleSeeExample = () => {
    if (
      !confirm(
        "This will fill all fields with example data to demonstrate a complete pricing model. Any existing data will be overwritten. Continue?"
      )
    )
      return

    setCompanyInfo({
      effectiveDate: "04/01/2023",
      companyName: "Longbottom Foods",
      contactName: "John Smith",
      contactEmail: "john@longbottomfoods.com",
      contactPhone: "(555) 123-4567",
      plantsWarehouses: [
        {
          id: `${Date.now()}-0`,
          name: "Smart Warehousing",
          street: "16500 E. Truman Road",
          city: "Independence",
          state: "MO",
          zipCode: "64050",
          isThirdPartyWarehouse: "yes",
          notes: "",
        },
      ],
    })

    setSkus([
      {
        productName: "Virgin Mary 7.5 oz cans 4pk x 6",
        caseUPC: "1-08-60008-52962-6",
        temperatureClass: "shelf",
        shelfLife: "18 months",
        lbsPerUnit: 1.88,
        unitsPerCase: 6,
        caseSize: "10.0 x 15.0 x 4.5",
        palletSize: "48 x 40 x 50",
        caseCube: 0.39,
        caseGrossWeight: 10.95,
        casesPerPallet: 100,
        palletTI: 10,
        palletHI: 10,
      },
      {
        productName: "Virgin Mary 7.5 oz cans x 24",
        caseUPC: "1-08-60008-52963-3",
        temperatureClass: "shelf",
        shelfLife: "18 months",
        lbsPerUnit: 0.47,
        unitsPerCase: 24,
        caseSize: "10.0 x 15.0 x 4.5",
        palletSize: "48 x 40 x 50",
        caseCube: 0.39,
        caseGrossWeight: 10.95,
        casesPerPallet: 100,
        palletTI: 10,
        palletHI: 10,
      },
      {
        productName: "Virgin Mary 1L x 6",
        caseUPC: "1-08-60008-52964-0",
        temperatureClass: "shelf",
        shelfLife: "18 months",
        lbsPerUnit: 2.11,
        unitsPerCase: 6,
        caseSize: "10.0 x 15.0 x 4.5",
        palletSize: "48 x 40 x 50",
        caseCube: 0.39,
        caseGrossWeight: 10.95,
        casesPerPallet: 100,
        palletTI: 10,
        palletHI: 10,
      },
    ])

    setShippingData({
      tierLabels: [
        "Full truckload",
        "Half truckload",
        "Quarter truckload",
        "One pallet",
        "Dropship (less than a pallet)",
      ],
      volumeFeePerCase: [0, 2, 4, 8, 12],
      pallets: ["20", "10", "4", "1", ""],
      pounds: ["~38,000 lbs", "~19,000 lbs", "~7,500 lbs", "~1,900 lbs", "~600 lbs"],
      hasFreightStudy: "yes",
    })

    setTradeSpendData({
      distributorTradeAccrual: 10,
      operatorTradeAccrual: 5,
      distributorMarketingAccrual: 0,
      operatorMarketingAccrual: 0,
      deviatedBillback: 0,
    })

    setPnlInputs([
      {
        basePricePerCase: 28.73,
        cogsPerCase: 17.5,
        freightPerTier: [1.91, 2.25, 3.15, 5.63, 8.44],
        lumpersPerTier: [0, 0, 0, 0, 0],
        damagesPerTier: [0, 0, 0, 0, 0],
      },
      {
        basePricePerCase: 28.73,
        cogsPerCase: 15.5,
        freightPerTier: [1.91, 2.25, 3.15, 5.63, 8.44],
        lumpersPerTier: [0, 0, 0, 0, 0],
        damagesPerTier: [0, 0, 0, 0, 0],
      },
      {
        basePricePerCase: 30.4,
        cogsPerCase: 15.53,
        freightPerTier: [2.15, 2.53, 3.54, 6.33, 9.5],
        lumpersPerTier: [0, 0, 0, 0, 0],
        damagesPerTier: [0, 0, 0, 0, 0],
      },
    ])

    setTermsData({
      remitCompanyName: "Longbottom Foods",
      remitStreet: "27 Drydock 2nd Floor",
      remitCity: "Boston",
      remitState: "MA",
      remitZip: "02210",
      minimumOrder: "Any Order Size: See Price Tiers",
      transportation: "Product ships shelf stable",
      paymentTerms: "Net 30",
      leadTime: "3 weeks from receipt of PO to ship date",
      poEmail: "orders@longbottomfoods.com",
      customerPickupAllowances: "Contact for details",
      lotCodeFormat: "XXXXX-YYYY",
    })

    setCurrentStep(1)
  }

  // A step is "completed" only if the user has moved past it
  const completedSteps = STEPS.map((_, index) => index + 1 < currentStep)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <ProgressIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
          totalSteps={STEPS.length}
          steps={STEPS}
          onStepClick={setCurrentStep}
        />
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={handleSeeExample}
            className="px-5 py-2 border-2 text-sm rounded-md font-medium transition-colors"
            style={{
              borderColor: 'var(--lux-accent)',
              color: 'var(--lux-accent)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(184, 134, 11, 0.06)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            See Example Model
          </button>
          <button
            onClick={handleStartOver}
            className="px-5 py-2 text-white text-sm rounded-md font-medium transition-colors"
            style={{ background: '#9B2C2C' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#822727')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#9B2C2C')}
          >
            Start Over
          </button>
        </div>
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
        <Step6Results
          skus={skus}
          pnlInputs={pnlInputs}
          shippingData={shippingData}
          tradeSpendData={tradeSpendData}
          companyInfo={companyInfo}
          termsData={termsData}
        />
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

        <div className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-heading), Fraunces, serif' }}>
          Step {currentStep} of {STEPS.length}
        </div>

        <button
          onClick={nextStep}
          disabled={currentStep === STEPS.length}
          className="px-6 py-2 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
          style={{ background: currentStep === STEPS.length ? undefined : 'var(--lux-primary)' }}
          onMouseEnter={(e) => {
            if (currentStep !== STEPS.length) e.currentTarget.style.background = 'var(--primary-light)'
          }}
          onMouseLeave={(e) => {
            if (currentStep !== STEPS.length) e.currentTarget.style.background = 'var(--lux-primary)'
          }}
        >
          {currentStep === STEPS.length ? "Complete" : "Next"}
        </button>
      </div>
    </div>
  )
}
