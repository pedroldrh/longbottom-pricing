import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"

export default async function HomePage() {
  const isLoggedIn = await getSession()

  if (isLoggedIn) {
    redirect("/calculator")
  } else {
    redirect("/login")
  }
}
