import "server-only"
import type { CalculationInput, PricingResult, TierResult } from "./types"

export function calculatePricing(input: CalculationInput): PricingResult {
  const { sku, settings } = input

  // Derived constants
  const lbsPerCase = sku.lbsPerUnit * sku.unitsPerCase
  const cogsPerCase = sku.cogsPerLb * lbsPerCase
  const pricePerLb = sku.basePricePerCase / lbsPerCase

  // Calculate each tier
  const tiers: TierResult[] = settings.tierLabels.map((tierLabel, tierIndex) => {
    // 1. Volume fee
    const volumeFee = sku.basePricePerCase * settings.volumeFeePct[tierIndex]

    // 2. Net Sell (w/o Delivery)
    const netSellWODelivery = sku.basePricePerCase + volumeFee

    // 3. Freight
    const freightPerLbForTier = settings.freightPerLb[sku.temperatureClass][tierIndex]
    const freight = freightPerLbForTier * lbsPerCase

    // 4. Delivered Price
    const deliveredPrice = netSellWODelivery + freight

    // 5. Accruals (apply to netSellWODelivery)
    const distributorAccrual = netSellWODelivery * settings.accrualPct.distributor
    const operatorAccrual = netSellWODelivery * settings.accrualPct.operator
    const baseMarketingAccrual = netSellWODelivery * settings.accrualPct.baseMarketing
    const additionalMarketingAccrual = netSellWODelivery * settings.accrualPct.additionalMarketing
    const deviatedBillbackAccrual = netSellWODelivery * settings.accrualPct.deviatedBillback

    const totalAccruals =
      distributorAccrual + operatorAccrual + baseMarketingAccrual + additionalMarketingAccrual + deviatedBillbackAccrual

    // 6. GP Before Trade
    const gpBeforeTrade = deliveredPrice - (cogsPerCase + freight) - deviatedBillbackAccrual
    const gpBeforeTradePct = netSellWODelivery !== 0 ? gpBeforeTrade / netSellWODelivery : 0

    // 7. GP After Trade
    const gpAfterTrade = gpBeforeTrade - totalAccruals + deviatedBillbackAccrual
    const gpAfterTradePct = netSellWODelivery !== 0 ? gpAfterTrade / netSellWODelivery : 0

    return {
      tierLabel,
      volumeFee,
      netSellWODelivery,
      freight,
      deliveredPrice,
      cogsPerCase,
      accruals: {
        distributor: distributorAccrual,
        operator: operatorAccrual,
        baseMarketing: baseMarketingAccrual,
        additionalMarketing: additionalMarketingAccrual,
        deviatedBillback: deviatedBillbackAccrual,
        total: totalAccruals,
      },
      gpBeforeTrade,
      gpBeforeTradePct,
      gpAfterTrade,
      gpAfterTradePct,
    }
  })

  return {
    sku,
    lbsPerCase,
    pricePerLb,
    tiers,
  }
}
