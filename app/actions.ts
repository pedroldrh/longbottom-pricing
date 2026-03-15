"use server"

import { redirect } from "next/navigation"
import { setSession } from "@/lib/session"

export async function login(formData: FormData) {
  const password = (formData.get("password") as string | null)?.trim() ?? ""
  const appPassword = process.env.APP_PASSWORD?.trim()

  if (appPassword && password === appPassword) {
    await setSession()
    redirect("/calculator")
  }

  return { error: "Invalid password" }
}
