# Greek Tax & Insurance Formulas (2026)

> Based on **Law 5246/2025** effective 1/1/2026. Sources: taxheaven.gr, e-efka.gov.gr, forin.gr, Ministry of Finance.

---

## Income Tax Brackets (2026 — NEW 6-bracket system)

### Standard Scale (age > 30, no children)

| Bracket | Income Range (EUR) | Rate |
|---------|-------------------|------|
| 1       | 0 – 10,000        | 9%   |
| 2       | 10,001 – 20,000   | 20%  |
| 3       | 20,001 – 30,000   | 26%  |
| 4       | 30,001 – 40,000   | 34%  |
| 5       | 40,001 – 60,000   | 39%  |
| 6       | 60,001+            | 44%  |

Quick check: Tax on 60,000 = 900 + 2,000 + 2,600 + 3,400 + 7,800 = 16,700

### Family-Based Reductions on 2nd Bracket (10,001–20,000)

| Children | Rate (instead of 20%) |
|----------|-----------------------|
| 0        | 20%                   |
| 1        | 18%                   |
| 2        | 16%                   |
| 3        | 9%                    |
| 4+       | 0%                    |

### Family-Based Reductions on 3rd Bracket (20,001–30,000)

| Children | Rate (instead of 26%) |
|----------|-----------------------|
| 0        | 26%                   |
| 1        | 24%                   |
| 2        | 22%                   |
| 3        | 20%                   |
| 4        | 18%                   |
| 5+       | 16%                   |

### Youth Rates

**Age ≤ 25:**
- 0 – 20,000: **0%**
- 20,001+: standard rates apply

**Age 26–30:**
- 0 – 10,000: 9%
- 10,001 – 20,000: **9%** (instead of 20%)
- 20,001+: standard rates apply

### First-Year Entrepreneur Benefit
- First 3 years of operation: **50% reduction** on first bracket (9% → 4.5% on income up to 10,000)

---

## Tax Credit (Employees & Μπλοκάκι ONLY — NOT self-employed)

| Children | Credit (EUR) |
|----------|-------------|
| 0        | 777         |
| 1        | 810         |
| 2        | 900         |
| 3        | 1,120       |
| 4        | 1,340       |
| 5+       | +220 per additional |

Phase-out: For income > 12,000 EUR, credit reduces by 20 EUR per 1,000 EUR above 12,000 (2% of excess).

---

## EMPLOYEE MODE

### Social Security (EFKA) Rates — Private Sector

| Side     | Rate    |
|----------|---------|
| Employee | ~13.87% |
| Employer | ~21.79% |
| Total    | ~35.66% |

Contribution ceiling: 7,761.94 EUR/month (from 1/1/2026).

### 14-Month Salary System (unchanged)

- 12 regular monthly salaries
- Christmas bonus: 1x monthly gross
- Easter bonus: 0.5x monthly gross
- Summer leave: 0.5x monthly gross
- **Annual gross = monthly gross × 14**

### Solidarity Contribution

**Abolished** for private sector since 2023. Set to 0.
(Still applies to pensioners — not relevant for MVP.)

### Employee Formula

```
annualGross = monthlyGross × 14
annualEmployeeSS = annualGross × 0.1387
taxableIncome = annualGross − annualEmployeeSS
grossTax = calculateTax(taxableIncome, children, age)  // 2026 brackets with family reductions
credit = taxCredit(taxableIncome, children)
annualTax = max(0, grossTax − credit)
annualNet = annualGross − annualEmployeeSS − annualTax
monthlyNet = annualNet / 14
employerCost = annualGross × (1 + 0.2179)
```

---

## SELF-EMPLOYED (Ατομική Επιχείρηση) MODE

### EFKA Insurance Categories (2026, +2.5% from 2025)

| Category  | Pension  | Health  | Total/month | Note                    |
|-----------|----------|---------|-------------|-------------------------|
| Special   | 111.06   | 39.40   | **150.46**  | First 5 years only      |
| 1st       | 185.09   | 65.68   | **250.77**  | Default                 |
| 2nd       | 222.12   | 78.81   | **300.93**  |                         |
| 3rd       | 281.82   | 78.81   | **360.63**  |                         |
| 4th       | 354.66   | 78.81   | **433.47**  |                         |
| 5th       | 440.64   | 78.81   | **519.45**  |                         |
| 6th       | 597.06   | 78.81   | **675.87**  |                         |

Plus: OAED surcharge ~10 EUR/month + healthcare housing ~2 EUR/month.

Optional supplementary insurance: 46.57 / 56.13 / 66.88 EUR/month (3 tiers).

EFKA contributions are **tax-deductible**.

### Prepayment of Tax (Προκαταβολή Φόρου)

| Years in Business | Rate  |
|-------------------|-------|
| First year        | 27.5% (55% × 50% discount) |
| Years 2-3         | 55%   |
| 4th year onward   | 55%   |

### Telos Epitideumatos (Professional Chamber Fee)

**ABOLISHED** as of 2026. Set to 0 for all.

### Tekmapto Eisodima (Presumptive Income)

- Still exists but with exemptions
- Minimum presumptive income based on minimum wage: ~12,320 EUR/year (880 EUR/month × 14)
- Minimum tax: ~1,410 EUR
- **Exempt:** first 3 years of operation, new mothers, disability 80%+, μπλοκάκι workers
- Applies from 4th year onward
- For MVP: show as informational note, not a calculation input

### Self-Employed Formula

```
annualEFKA = selectedCategory.monthly × 12
taxableIncome = max(0, annualRevenue − annualExpenses − annualEFKA)
annualTax = calculateTax(taxableIncome, 0, age)  // NO tax credit, NO family reductions
// First 3 years: 50% reduction on first bracket (9% → 4.5% on first 10k)
prepay = annualTax × prepaymentRate
annualNet = annualRevenue − annualExpenses − annualEFKA − annualTax
// First year cash outlay includes prepayment
```

---

## ΜΠΛΟΚΑΚΙ MODE

### 5 Conditions for Employee-Style Tax Treatment

ALL must be met:
1. Written contracts with **max 3 employers** (or 75%+ income from one if more)
2. At least **75% of gross income** from a single employer
3. Professional address = **their home** (no separate office)
4. **No parallel salaried employment**
5. Activities involve **scientific, artistic, or intellectual work**

### Tax Treatment (if qualifying)

- Taxed on **employee scale** (with family-based reductions)
- Gets **tax credit** (777+ EUR)
- **Exempt from presumptive income**
- **No prepayment of tax**
- **No telos epitideumatos** (abolished for all anyway)
- Youth under 25: **0% tax up to 20,000**
- Ages 26-30: **9% on 10,001-20,000** bracket

### 20% Withholding at Source

Client withholds 20% of gross invoice → credited against final tax liability.

### EFKA: Same as self-employed (self-paid, choose category)

### Μπλοκάκι Formula

```
annualEFKA = selectedCategory.monthly × 12
taxableIncome = annualGrossInvoiced − annualEFKA
grossTax = calculateTax(taxableIncome, children, age)  // WITH family reductions
credit = taxCredit(taxableIncome, children)
annualTax = max(0, grossTax − credit)
totalWithheld = annualGrossInvoiced × 0.20
balanceDue = annualTax − totalWithheld  // negative = refund
annualNet = annualGrossInvoiced − annualEFKA − annualTax
```

### Key Differences Table (2026)

| Aspect              | Μπλοκάκι (conditions met) | Regular Self-Employed |
|---------------------|---------------------------|-----------------------|
| Tax scale           | Employee (with family reductions) | Standard (no family reductions) |
| Tax credit (777+)   | YES                       | NO                    |
| Prepayment          | NO                        | YES (27.5%/55%)       |
| Telos epitideumatos | ABOLISHED                 | ABOLISHED             |
| Presumptive income  | EXEMPT                    | From 4th year         |
| 20% withholding     | YES (by client)           | NO                    |
| Expense deductions  | Limited (mainly EFKA)     | Full business expenses|
| First 3yr benefit   | N/A                       | 50% off first bracket |

---

## Implementation Notes

### calculateTax(income, children, age) pseudocode

```javascript
function calculateTax(income, children = 0, age = 35, isEmployee = true) {
  // Define bracket rates based on children and age
  let brackets = [
    { limit: 10000, rate: 0.09 },
    { limit: 20000, rate: 0.20 },
    { limit: 30000, rate: 0.26 },
    { limit: 40000, rate: 0.34 },
    { limit: 60000, rate: 0.39 },
    { limit: Infinity, rate: 0.44 }
  ];

  // Youth: age <= 25 → first two brackets at 0%
  if (age <= 25) {
    brackets[0].rate = 0;
    brackets[1].rate = 0;
  }
  // Youth: age 26-30 → second bracket at 9%
  else if (age <= 30) {
    brackets[1].rate = 0.09;
  }

  // Family reductions on 2nd bracket (employees/mplokaki only)
  if (isEmployee && age > 30) {
    if (children === 1) brackets[1].rate = 0.18;
    else if (children === 2) brackets[1].rate = 0.16;
    else if (children === 3) brackets[1].rate = 0.09;
    else if (children >= 4) brackets[1].rate = 0;
  }

  // Family reductions on 3rd bracket (employees/mplokaki only)
  if (isEmployee && age > 30) {
    if (children === 1) brackets[2].rate = 0.24;
    else if (children === 2) brackets[2].rate = 0.22;
    else if (children === 3) brackets[2].rate = 0.20;
    else if (children === 4) brackets[2].rate = 0.18;
    else if (children >= 5) brackets[2].rate = 0.16;
  }

  let tax = 0;
  let prev = 0;
  for (const bracket of brackets) {
    const taxable = Math.min(income, bracket.limit) - prev;
    if (taxable <= 0) break;
    tax += taxable * bracket.rate;
    prev = bracket.limit;
  }

  return tax;
}
```
