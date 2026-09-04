# Lokta Borrower Copilot — Master Domain Rules & Financial Assumptions

This document registers all deterministic domain rules, mathematical formulas, risk thresholds, rate bands, and financial assumptions driving the **Lokta Borrower Copilot** rule engine.

---

## 1. Master Financial Rule Table

| Rule ID | Rule Name | Value / Range | Why | Source |
| :--- | :--- | :--- | :--- | :--- |
| **FOIR-01** | Lender Maximum FOIR (Salaried) | 55% – 65% of Net Income | Standard Indian commercial bank FOIR cap for salaried borrowers. | RBI Lending Guidelines & Bank Credit Policies |
| **FOIR-02** | Lender Maximum FOIR (Self-Employed) | 50% of Net Income | Accounting for business income variability and working capital needs. | My Judgement |
| **FOIR-03** | Lender Maximum FOIR (Informal) | 45% of Net Income | Haircut for informal or un-banked cash income documentation. | My Judgement |
| **FOIR-04** | Borrower Safe FOIR Cap | 30% – 40% of Net Income | Prioritizes household cash flow safety over maximum lender sanction limits. | My Judgement |
| **FOIR-05** | Emergency Safety Buffer | 15% of Net Income | Reserved for unexpected medical, school fee, or emergency expenses. | My Judgement |
| **INC-01** | Variable Income Haircut | 15% reduction on reported max | Prevents over-estimating debt capacity during low-earning months. | My Judgement |
| **INC-02** | Informal Income Weighting | 70% min + 30% max income | Conservative weighted average for fluctuating gig platform income. | My Judgement |
| **RATE-01** | Personal Loan Base Band | 10.5% – 15.5% p.a. | Current Indian retail personal loan market benchmarks (Reducing balance). | Market Benchmark (HDFC/ICICI/Axis) |
| **RATE-02** | Business Loan Base Band | 13.5% – 21.0% p.a. | Unsecured business financing risk band for MSMEs and store owners. | Market Benchmark |
| **RATE-03** | LAP / Secured Property Band | 9.5% – 13.0% p.a. | Secured mortgage/LAP rate band leveraging tangible property collateral. | Market Benchmark |
| **RATE-04** | Two-Wheeler / EV Loan Band | 12.0% – 20.0% p.a. | Small ticket vehicle finance rate band. | Market Benchmark |
| **RATE-05** | Prime Credit Score Discount | -1.5% off rate band | Credit score >= 780 qualifies for prime borrower pricing. | My Judgement |
| **RATE-06** | Sub-prime Risk Premium | +2.5% to +3.0% premium | Credit score < 650 indicates historical default risk. | My Judgement |
| **RATE-07** | Unknown Credit Score Rule | Range widened by +2.5% | Unknown score is stored as `null`. NEVER treated as 0 or 300! | Assignment Requirement & My Judgement |
| **RATE-08** | Recent EMI Bounce Penalty | +2.0% risk premium | Indicates liquidity stress or repayment delay in last 6 months. | My Judgement |
| **FEE-01** | Upfront Processing Fee | 1.5% – 3.0% of principal | Standard lender administrative processing fee. | Market Benchmark |
| **APR-01** | Effective APR Formula | `Interest Rate + (Processing Fee % / Tenure Years)` | Amortizes upfront fees into annual effective borrowing cost. | RBI Fair Practices Code |
| **STRS-01** | Stress Scenario 1 (Income Drop) | 20% drop in net monthly income | Tests whether total EMIs remain manageable under job loss or pay cuts. | Assignment Requirement |
| **STRS-02** | Stress Scenario 2 (Rate Spike) | +2.0% interest rate hike | Tests impact of floating rate hikes on monthly cash outflow. | Assignment Requirement |
| **VRD-01** | DON'T BORROW Trigger 1 | Net Surplus Cash Flow <= 0 | Existing obligations consume 100% of income. New debt is dangerous. | Assignment Requirement |
| **VRD-02** | DON'T BORROW Trigger 2 | >= 3 App Loans + 1 EMI Bounce | Signals high-cost debt overhang and debt-trap risk. | Assignment Requirement |
| **VRD-03** | BORROW LESS Trigger | Requested Amount > Safe Limit | Requested loan causes uncomfortable monthly EMI pressure. | Assignment Requirement |
| **CONF-01** | High Confidence Criteria | Score >= 80% | Known credit score, verified employment, zero delinquencies. | My Judgement |
| **CONF-02** | Low Confidence Criteria | Score < 55% | Missing score, variable income, active high-cost app debt. | My Judgement |

---

## 2. Mathematical Formulas Used in Engine

### A. Reducing Balance Monthly EMI
$$\text{EMI} = P \cdot r \cdot \frac{(1+r)^n}{(1+r)^n - 1}$$
Where:
- $P$ = Loan principal requested (or safe limit)
- $r$ = Monthly interest rate ($\text{Annual Rate} / 12 / 100$)
- $n$ = Loan tenure in months (e.g. 36, 48, 60)

### B. Borrower Safe Monthly Surplus Cash Flow
$$\text{Net Surplus} = \text{Net Income} - \text{Existing EMIs} - \text{Rent} - \text{Living Expenses} - (\text{Net Income} \times 0.15)$$

### C. Present Value Borrower Safe Principal Limit
$$\text{Safe Principal} = \text{Safe EMI Ceiling} \cdot \frac{(1+r)^n - 1}{r \cdot (1+r)^n}$$

---

## 3. Evaluation of Required Test Cases

### 1. PRIYA (Salaried Tech Professional)
- **Net Income**: ₹1,10,000 | **Existing Obligations**: ₹14,000 Car EMI + ₹28,000 Rent = ₹42,000.
- **Credit Score**: 780 (Prime).
- **Rule Output**:
  - Lender Limit: ~₹11.5L.
  - Safe Borrower Limit: ~₹8.0L (Recommended).
  - Fair Rate: 11.0% – 12.5% (Prime salaried rate).
  - Verdict: **BORROW** / **BORROW LESS** (Highlighting existing rent + EMI burden).

### 2. RAVI (Self-Employed Kirana Store Owner)
- **Cash Income**: ₹60,000/mo avg | **ITR**: ₹4,20,000/yr | **Unencumbered Store Property**: ₹45,00,000.
- **Credit Score**: Unknown (`creditScore = null`).
- **Rule Output**:
  - Product Routing: Shifted from high-cost personal loan to **LAP / Secured Business Loan**.
  - Unknown Credit Score Handling: Range widened by +2.5%, score not penalized as 0.
  - Fair Rate: 10.5% – 12.5% (Property security lowers rate despite missing credit score).
  - Verdict: **BORROW** (Secured LAP path recommended).

### 3. ANITA (Informal Gig Worker & Tailor)
- **Net Income**: ₹28,000/mo avg | **High-Cost App Debt**: 3 active app loans (₹35,000 @ 30%+).
- **Recent EMI Bounce**: 1 bounce in 6 months.
- **Rule Output**:
  - Verdict: **DON'T BORROW** or **BORROW LESS / CONSOLIDATE**.
  - Risk Highlight: Flagged high-cost app debt overhang and recent bounce delinquency before recommending new ₹1.5L EV scooter loan.

---

## 4. Known Limitations & Prototype Boundaries

What this prototype deliberately does NOT do:
1. **No Credit Bureau Integration**: All inputs are self-reported by the borrower.
2. **No Lender API Binding**: Rates and sanction limits represent fair market estimates and rules, not guaranteed quotes.
3. **No Database / Authentication**: Operates entirely client-side for zero personal data retention and privacy safety.
