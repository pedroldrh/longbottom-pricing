import { z } from "zod"

export const TemperatureClassSchema = z.enum(["shelf", "refrigerated", "frozen"])
export type TemperatureClass = z.infer<typeof TemperatureClassSchema>

export interface FreightRateConfig {
  useDefaultRate: boolean
  ratePerLb: number
}

export const SKUInputSchema = z.object({
  vendorItemNumber: z.string().optional().default(""),
  productName: z.string().min(1, "Product name is required"),
  caseUPC: z.string().optional().default(""),
  temperatureClass: TemperatureClassSchema,
  shelfLife: z.string().optional().default(""),
  transportation: z.string().optional().default(""),
  lbsPerUnit: z.number().positive("Must be greater than 0"),
  unitsPerCase: z.number().int().min(1, "Must be at least 1"),
  caseSize: z.string().optional().default(""),
  palletSize: z.string().optional().default(""),
  caseCube: z.number().min(0).optional().default(0),
  caseGrossWeight: z.number().min(0).optional().default(0),
  casesPerPallet: z.number().int().min(0).optional().default(0),
  palletTI: z.number().int().min(0).optional().default(0),
  palletHI: z.number().int().min(0).optional().default(0),
  basePricePerCase: z.number().min(0, "Must be non-negative"),
  cogsPerLb: z.number().min(0, "Must be non-negative"),
})

export const SettingsSchema = z.object({
  tierLabels: z.array(z.string()).length(5),
  volumeFeePct: z.array(z.number().min(0)).length(5),
  freightPerLb: z.object({
    shelf: z.object({
      useDefaultRate: z.boolean(),
      ratePerLb: z.number().min(0),
    }),
    refrigerated: z.object({
      useDefaultRate: z.boolean(),
      ratePerLb: z.number().min(0),
    }),
    frozen: z.object({
      useDefaultRate: z.boolean(),
      ratePerLb: z.number().min(0),
    }),
  }),
  tradeSpendPct: z.number().min(0).max(100),
  accrualPct: z.object({
    distributor: z.number().min(0),
    operator: z.number().min(0),
    baseMarketing: z.number().min(0),
    additionalMarketing: z.number().min(0),
    deviatedBillback: z.number().min(0),
  }),
})

export const CalculationInputSchema = z.object({
  sku: SKUInputSchema,
  settings: SettingsSchema,
})

export type SKUInput = z.infer<typeof SKUInputSchema>
export type Settings = z.infer<typeof SettingsSchema>
export type CalculationInput = z.infer<typeof CalculationInputSchema>

export interface TierResult {
  tierLabel: string
  volumeFee: number
  netSellWODelivery: number
  freight: number
  deliveredPrice: number
  cogsPerCase: number
  accruals: {
    distributor: number
    operator: number
    baseMarketing: number
    additionalMarketing: number
    deviatedBillback: number
    total: number
  }
  gpBeforeTrade: number
  gpBeforeTradePct: number
  gpAfterTrade: number
  gpAfterTradePct: number
}

export interface PricingResult {
  sku: SKUInput
  lbsPerCase: number
  pricePerLb: number
  tiers: TierResult[]
}

export interface SKUPnLInputs {
  basePricePerCase: number
  cogsPerCase: number
  freightPerTier: number[]  // 5 values
  lumpersPerTier: number[]  // 5 values
  damagesPerTier: number[]  // 5 values
}

export interface PlantWarehouse {
  id: string
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  isThirdPartyWarehouse: "yes" | "no" | ""
  notes: string
}

export interface CompanyInfo {
  effectiveDate: string
  companyName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  plantsWarehouses: PlantWarehouse[]
}

export interface TermsConditions {
  remitCompanyName: string
  remitStreet: string
  remitCity: string
  remitState: string
  remitZip: string
  minimumOrder: string
  transportation: string
  paymentTerms: string
  leadTime: string
  poEmail: string
  customerPickupAllowances: string
}
