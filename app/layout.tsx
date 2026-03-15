import type React from "react"
import type { Metadata } from "next"
import SiteFooter from "@/components/SiteFooter"
import "./globals.css"

export const metadata: Metadata = {
  title: "Elohi Pricing Calculator",
  description: "Server-side pricing calculator with Excel parity",
  generator: "v0.app",
  icons: {
    icon: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
