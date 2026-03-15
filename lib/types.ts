import { z } from "zod"

export const TemperatureClassSchema = z.enum(["shelf", "refrigerated", "frozen"])
export type TemperatureClass = z.infer<typeof TemperatureClassSchema>

export interface FreightRateConfig {
  useDefaultRate: boolean
  ratePerLb: number
}

export const SKUInputSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  caseUPC: z.string().optional().default(""),
  temperatureClass: TemperatureClassSchema,
  shelfLife: z.string().optional().default(""),
  lbsPerUnit: z.number().positive("Must be greater than 0"),
  unitsPerCase: z.number().int().min(1, "Must be at least 1"),
  caseSize: z.string().optional().default(""),
  palletSize: z.string().optional().default(""),
  caseCube: z.number().min(0).optional().default(0),
  caseGrossWeight: z.number().min(0).optional().default(0),
  casesPerPallet: z.number().int().min(0).optional().default(0),
  palletTI: z.number().int().min(0).optional().default(0),
  palletHI: z.number().int().min(0).optional().default(0),
})

export type SKUInput = z.infer<typeof SKUInputSchema>

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
