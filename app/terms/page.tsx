import Link from "next/link"

const sections = [
  {
    heading: "Use of the Tool",
    body:
      "Elohi Pricing Calculator (TM) is provided for authorized business use. Access may be restricted, monitored, suspended, or revoked at any time.",
  },
  {
    heading: "Proprietary Information",
    body:
      "The calculator, its workflows, pricing logic, output formats, and related materials are confidential and proprietary. Users may not copy, distribute, reverse engineer, or disclose the tool or its outputs except as authorized.",
  },
  {
    heading: "Output and Business Reliance",
    body:
      "Pricing outputs are provided for internal planning and commercial review. Users are responsible for confirming business inputs, assumptions, approvals, and downstream contract terms before external use.",
  },
  {
    heading: "Security and Access",
    body:
      "Users must protect access credentials and may not attempt to bypass security, interfere with system availability, or use the site in a way that could harm Elohi or other users.",
  },
  {
    heading: "No Legal or Financial Advice",
    body:
      "This tool is an operational resource and does not constitute legal, regulatory, accounting, or tax advice. Any formal legal terms should be reviewed separately.",
  },
]

export default function TermsPage() {
  return (
    <div className="bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm">
        <div className="border-b border-gray-200 pb-6">
          <Link
            href="/calculator"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Back to Calculator
          </Link>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Legal</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Terms of Use</h1>
          <p className="mt-3 text-sm text-gray-600">
            These terms apply to access to and use of Elohi Pricing Calculator (TM).
          </p>
        </div>

        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-semibold text-gray-900">{section.heading}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-700">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          This page is a standard operating draft for website use and should be reviewed by Elohi before final legal adoption.
        </div>
      </div>
    </div>
  )
}
