import Link from "next/link"

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-gray-600 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="font-medium text-gray-800">Elohi Pricing Calculator</p>
            <p>Confidential and proprietary. Internal business use only unless otherwise authorized by Elohi.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/terms" className="hover:text-gray-900">
              Terms of Use
            </Link>
            <Link href="/privacy" className="hover:text-gray-900">
              Privacy Policy
            </Link>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          Copyright {year} Elohi. Elohi Pricing Calculator is a trademark designation used for this proprietary pricing tool.
        </p>
      </div>
    </footer>
  )
}
