import { z } from "zod"

export const TemperatureClassSchema = z.enum(["shelf", "refrigerated", "frozen"])
export type TemperatureClass = z.infer<typeof TemperatureClassSchema>

export interface FreightRateConfig {
  useDefaultRate: boolean
  ratePerLb: number
}

export const SKUInputSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  temperatureClass: TemperatureClassSchema,
  lbsPerUnit: z.number().positive("Must be greater than 0"),
  unitsPerCase: z.number().int().min(1, "Must be at least 1"),
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

export interface PlantWarehouse {
  id: string
  name: string
  location: string
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
