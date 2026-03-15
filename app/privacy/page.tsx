import Link from "next/link"

const privacySections = [
  {
    heading: "Information Entered Into the Tool",
    body:
      "The calculator may process company details, facility information, SKU data, pricing inputs, and related commercial information entered by authorized users.",
  },
  {
    heading: "How Information Is Used",
    body:
      "Information is used to operate the pricing workflow, generate calculation outputs, support internal commercial review, and maintain system functionality.",
  },
  {
    heading: "Confidentiality",
    body:
      "Business information entered into the tool should be treated as confidential. Users should only input information they are authorized to share within the organization.",
  },
  {
    heading: "Retention and Access",
    body:
      "Locally entered data may be stored in browser storage to support workflow continuity. Access to the application may be restricted through authentication and other controls.",
  },
  {
    heading: "Third-Party Services",
    body:
      "If Elohi later enables hosting, analytics, email, or other integrations, those services may process limited technical or usage data as needed to operate the application.",
  },
]

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm">
        <div className="border-b border-gray-200 pb-6">
          <div className="flex justify-end">
            <Link
              href="/calculator"
              className="inline-flex items-center rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Back to Calculator
            </Link>
          </div>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-3 text-sm text-gray-600">
            This page describes the standard privacy treatment expected for Elohi Pricing Calculator.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          {privacySections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-semibold text-gray-900">{section.heading}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-700">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-lg p-4 text-sm" style={{ background: 'var(--elohi-pistachio)', color: '#1a4d3e', border: '1px solid #7dd4a8' }}>
          This page is a standard operating draft for website use and should be reviewed by Elohi before final legal adoption.
        </div>
      </div>
    </div>
  )
}
