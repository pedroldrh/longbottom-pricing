"use server"

import { redirect } from "next/navigation"
import { setSession } from "@/lib/session"
import { calculatePricing as calculatePricingEngine } from "@/lib/pricing-engine"
import { CalculationInputSchema, type PricingResult } from "@/lib/types"

export async function login(formData: FormData) {
  const password = formData.get("password") as string

  if (password === process.env.APP_PASSWORD) {
    await setSession()
    redirect("/calculator")
  }

  return { error: "Invalid password" }
}

export async function calculatePricing(data: unknown): Promise<PricingResult> {
  const validated = CalculationInputSchema.parse(data)
  return calculatePricingEngine(validated)
}
