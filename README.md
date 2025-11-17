# Longbottom Pricing Calculator

A Next.js web application that replicates the Longbottom pricing model from Excel with exact parity. All calculations are performed server-side with password-protected access.

## Features

- **Server-side calculations** - All pricing formulas execute on the server, never exposed to client
- **Password protection** - Single fixed password for access control
- **Multi-tier pricing** - Calculate pricing across 4 configurable tiers
- **Excel parity** - Matches Excel workbook calculations to $0.01 and 0.01%
- **Print/PDF export** - Professional print view with branding
- **Parity testing** - Built-in fixture testing harness to verify Excel parity

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create `.env.local` file with required variables:
\`\`\`env
APP_PASSWORD=your_secure_password

# Optional branding
NEXT_PUBLIC_BRAND_NAME=Your Company Name
NEXT_PUBLIC_BRAND_LOGO_URL=https://example.com/logo.png
NEXT_PUBLIC_COMPANY_INFO=Your Company\n123 Main St
NEXT_PUBLIC_TERMS_TEXT=All prices subject to change.
\`\`\`

3. Run development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000)

## Usage

### Calculator

1. Navigate to `/login` and enter the password
2. Fill in SKU details (product name, temperature class, weights, prices)
3. Adjust settings (tier labels, volume fees, freight rates, accruals)
4. Click **Calculate** to see results
5. Click **Print / Save PDF** to export

### Excel Field Mapping

**SKU Inputs:**
- `Product Name` → Product description
- `Temperature Class` → {shelf, refrigerated, frozen}
- `Lbs per Unit` → Weight of single unit
- `Units per Case` → Number of units in a case
- `Base Price per Case` → "Base Price/Case" from P&L (pre-freight net sell)
- `COGS per Lb` → Cost of goods sold per pound

**Settings:**
- `Tier Labels` → Display names for 4 tiers (e.g., "Full Truck", "10 Pallets")
- `Volume Fee %` → Percentage fees per tier (as decimals: 0.02 = 2%)
- `Freight $/lb` → Freight cost per pound by temperature class and tier
- `Accrual %` → Distributor, Operator, Marketing, Billback percentages (as decimals)

**Calculations (per tier):**
1. Volume Fee = Base Price × Volume Fee %
2. Net Sell (w/o Delivery) = Base Price + Volume Fee
3. Freight = Freight $/lb × Lbs per Case
4. Delivered Price = Net Sell + Freight
5. Accruals = Net Sell × Accrual % (for each category)
6. GP Before Trade = Delivered - (COGS + Freight) - Deviated Billback
7. GP After Trade = GP Before - Total Accruals + Deviated Billback

### Parity Testing

1. Navigate to `/parity` (after login)
2. Paste JSON fixtures from Excel (see format below)
3. Click **Run Parity Tests**
4. Review mismatches (if any)
5. Export CSV of mismatches for debugging

**Fixture JSON Format:**
\`\`\`json
[
  {
    "name": "Test SKU A",
    "temperatureClass": "shelf",
    "lbsPerUnit": 2.5,
    "unitsPerCase": 12,
    "basePricePerCase": 85.00,
    "cogsPerLb": 1.90,
    "volumeFeePct": [0, 0, 0, 0],
    "freightPerLb": {
      "shelf": [0.10, 0.20, 0.25, 0.35],
      "refrigerated": [0.12, 0.22, 0.30, 0.45],
      "frozen": [0.15, 0.25, 0.35, 0.50]
    },
    "accrualPct": {
      "distributor": 0.03,
      "operator": 0.02,
      "baseMarketing": 0.01,
      "additionalMarketing": 0.00,
      "deviatedBillback": 0.05
    },
    "expected": {
      "tiers": [
        {
          "netSellWO": 85.00,
          "freight": 3.00,
          "delivered": 88.00,
          "gpBefore$": 27.75,
          "gpBeforePct": 0.3265,
          "totalAccruals$": 9.35,
          "gpAfter$": 18.40,
          "gpAfterPct": 0.2165
        }
        // ... 3 more tiers
      ]
    }
  }
]
\`\`\`

## Testing

Run unit tests:
\`\`\`bash
npm test
\`\`\`

## Project Structure

\`\`\`
app/
  actions.ts              # Server actions (login, calculate)
  calculator/page.tsx     # Main calculator interface
  login/page.tsx          # Password login
  print/page.tsx          # Print-optimized view
  parity/page.tsx         # Excel parity testing
components/
  CalculatorForm.tsx      # Main form component
  SettingsPanel.tsx       # Settings configuration
  ResultsTable.tsx        # Results display
lib/
  pricing-engine.ts       # Server-only calculation logic
  format.ts               # Money/percent formatting
  session.ts              # Cookie session management
  types.ts                # TypeScript types & Zod schemas
config/
  defaults.json           # Default tier labels, freight, accruals
middleware.ts             # Route protection
\`\`\`

## Security Notes

- All formulas are in `lib/pricing-engine.ts` marked with `'server-only'`
- Session uses httpOnly + Secure cookies (24hr expiration)
- No user accounts or database - single password only
- Middleware protects all calculator routes

## License

Proprietary - Internal use only
