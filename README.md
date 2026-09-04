# Lokta — Borrower Copilot 🛡️

A production-quality, mobile-first **Borrower Copilot** web prototype built for the **Lokta Borrower Copilot Build Challenge**.

Lokta Borrower Copilot empowers Indian borrowers to answer four essential questions before negotiating with a lender:
1. **Should I borrow at all?** (`BORROW`, `BORROW LESS`, `DON'T BORROW`)
2. **How much am I really eligible for?** (Lender Sanction Limit vs Safe Borrower Amount)
3. **What is a fair interest rate for me?** (Fair rate range + All-in APR including processing fees)
4. **What EMI should I agree to?** (Recommended safe EMI ceiling & stress test under income drop or rate hike)

Finally, the application generates a single-screen, printable **Negotiation Card** that the borrower can take directly to a bank branch or lender discussion.

---

## ⚡ Key Highlights & Design Principles

- **No Backend / No Login Required**: Runs 100% client-side with zero data retention or credit bureau pull.
- **Deterministic Domain Engine**: All financial logic lives strictly in `src/rules/`—completely decoupled from React UI components.
- **Unknown Credit Score Support**: If a borrower selects *"I don't know my credit score"*, `creditScore` is stored as `null`. It is **NEVER** treated as `0` or `300`. Instead, rate ranges widen transparently and confidence is adjusted.
- **Explainability First ("Why did I get this number?")**: Every primary output includes an interactive accordion detailing the key calculation drivers and underlying financial assumptions.
- **Pre-Loaded Test Personas**: One-click demo toolbar to test **Priya** (Salaried Tech), **Ravi** (Self-Employed Kirana Store), and **Anita** (Informal Gig Worker).
- **Master Rule Registry**: Complete documentation of formulas, FOIR caps, rate bands, and stress multipliers in [`RULES.md`](file:///d:/Educase%20India/Borrower%20Copilot%20Build/RULES.md).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Local Run
```bash
# Install dependencies
npm install

# Run Vite local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build Verification & Type Checking
```bash
# TypeScript strict check & production bundle build
npm run build
```

---

## 📂 Architecture & Directory Structure

```text
Borrower Copilot Build/
├── RULES.md                        # Master domain rules & financial assumptions table
├── README.md                       # Product documentation & setup guide
├── index.html                      # HTML template with Google Fonts
├── vite.config.ts                  # Vite + Tailwind CSS configuration
├── package.json
└── src/
    ├── types/                      # TypeScript domain definitions
    ├── data/                       # Loan products config, questions, and test personas
    ├── rules/                      # Pure financial engine logic (No UI/JSX!)
    │   ├── foir.ts                 # FOIR & surplus cash flow analysis
    │   ├── eligibility.ts          # Lender limit vs Safe borrower limit
    │   ├── rates.ts                # Base rate bands, risk modifiers, fees & APR
    │   ├── emi.ts                  # EMI calculation, tenure trade-offs & stress test
    │   ├── confidence.ts           # Data completeness & uncertainty rating
    │   ├── verdict.ts              # BORROW / BORROW LESS / DONT BORROW logic
    │   ├── negotiation.ts          # Negotiation Card data generator
    │   └── index.ts                # Master aggregator function
    ├── hooks/
    │   └── useBorrowerCopilot.ts   # Main state machine hook
    ├── components/
    │   ├── common/                 # Header, Footer, ConfidenceBadge, ExplainabilityModal
    │   ├── persona/                # PersonaSwitcher quick demo bar
    │   ├── questionnaire/          # Interactive adaptive questionnaire form
    │   ├── analysis/               # Deterministic rule evaluation loading state
    │   ├── results/                # Verdict, Amount, Rate Range, and EMI Cards
    │   └── negotiation/            # Printable/Shareable Negotiation Card
    ├── pages/
    │   └── LandingPage.tsx         # Hero landing page
    ├── App.tsx                     # Main application layout & router
    └── main.tsx                    # Entry point
```

---

## 🧪 Test Case Behaviors

### 1. PRIYA (Salaried Software Engineer, Bengaluru)
- **Income**: ₹1,10,000 | **Existing Obligations**: ₹14,000 Car EMI + ₹28,000 Rent | **CIBIL**: 780 | **Requested**: ₹8,00,000
- **Outcome**: Recognizes high income and prime credit score, but factors in rent & existing car EMI to set safe borrower amount at ₹8,00,000 (Fair Rate: 11.0%–12.5%).

### 2. RAVI (Self-Employed Kirana Store Owner, Mysuru)
- **Income**: ₹60,000 cash avg | **ITR**: ₹4,20,000/yr | **Unencumbered Shop**: ₹45,00,000 | **CIBIL**: Unknown (`null`)
- **Outcome**: Routes away from high-cost personal loans to LAP (Loan Against Property) leveraging shop collateral to secure a low 10.5%–12.5% rate despite missing credit score.

### 3. ANITA (Informal Gig Worker & Tailor, Hubballi)
- **Income**: ₹28,000 avg | **App Loans**: 3 active loans (₹35,000 @ 30%+) | **EMI Bounce**: 1 bounce
- **Outcome**: Identifies severe high-cost debt overhang and delinquency risk, issuing a **DON'T BORROW / CONSOLIDATE FIRST** recommendation to protect household cash flow.

---

## 📄 License & Attribution

Built for the **Lokta Borrower Copilot Build Challenge**.
