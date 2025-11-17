import "server-only"
import { cookies } from "next/headers"

const SESSION_COOKIE_NAME = "session"
const SESSION_DURATION = 24 * 60 * 60 // 24 hours in seconds

export async function setSession() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  })
}

export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.has(SESSION_COOKIE_NAME)
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
