# Greek tax and insurance calculations — tax year 2026

Parameters reviewed September 2026. This is a full-year scenario calculator, not a tax-return engine. Monthly business income assumes 12 equal months; employee salary assumes 14 equal salary units. Amounts exclude VAT. Insurance inputs represent deductible contributions paid for the scenario.

## Income tax

The progressive bands end at €10,000, €20,000, €30,000, €40,000, €60,000 and infinity, at 9%, 20%, 26%, 34%, 39%, 44% respectively. Each rate applies only to income within its band.

Family rates apply to business income too. For zero through four children, second-band rates are 20/18/16/9/0%; third-band rates are 26/24/22/20/18%. Four or more children also zero the first band. Each additional child reduces the third band by two percentage points. Under-26s have zero first and second bands; ages 26–30 receive the lower of 9% and their family rate in the second band.

Article 16 credits apply only to employees and qualifying Article 12 invoices: €777/900/1,120/1,340/1,580/1,780 for zero through five children, then €220 per additional child. The credit tapers proportionally by 2% of taxable income above €12,000, except for five or more children; it cannot exceed tax owed or fall below zero.

Sources: [Ministry income-tax guide](https://minfin.gov.gr/forologiki-politiki/forologikos-odigos/forologia-eisodimatos/), [AADE Law 5246/2025 notification](https://www.aade.gr/egkyklioi-kai-apofaseis/o-3068-18-11-2025), [AADE tax handbook, Article 16 taper exemption](https://www.aade.gr/sites/default/files/2024-07/forol_egxeiridio_erotiseon_apantisewn2024_1.pdf). The older handbook is not the source for current credit amounts.

## Insurance

Standard private-sector employee coverage (KPK 101): employee 13.37%, employer 21.79%, monthly contribution ceiling €7,761.94. Both contribution calculations respect the ceiling. Other coverage packages are outside this scenario.

```
annualGross = monthlyGross * 14
annualEmployeeSS = round(min(monthlyGross, 7761.94) * 14 * 0.1337)
taxableIncome = annualGross - annualEmployeeSS
annualTax = grossTax - appliedCredit
annualNet = taxableIncome - annualTax
monthlyNet = annualNet / 14
employerCost = annualGross + round(min(monthlyGross, 7761.94) * 14 * 0.2179)
```

Source: [e-EFKA Circular 38/2024](https://www.e-efka.gov.gr/sites/default/files/2024-12/%CE%95%CE%93%CE%9A.%2038_2024_%CE%9C%CE%95%CE%99%CE%A9%CE%A3%CE%97%20%CE%91%CE%A3%CE%A6.%20%CE%95%CE%99%CE%A3%CE%A6%CE%9F%CE%A1%CE%A9%CE%9D%20%CE%99%CE%94%CE%99%CE%A9%CE%A4.%20%CE%94%CE%99%CE%9A%CE%91%CE%99%CE%9F%CE%A5%202025%20%28971%CE%A546%CE%9C%CE%91%CE%A0%CE%A3-348%29.pdf).

Non-salaried insurance categories:

| Category | Pension + health / month | With unemployment / month |
| --- | ---: | ---: |
| Special | €150.46 | €160.46 |
| 1st | €250.77 | €260.77 |
| 2nd | €300.93 | €310.93 |
| 3rd | €360.63 | €370.63 |
| 4th | €433.47 | €443.47 |
| 5th | €519.45 | €529.45 |
| 6th | €675.87 | €685.87 |

`EFKA_CATEGORIES.monthly` holds pension and health only. All calculations and category labels use the helpers, which add €10 unemployment. Additional monthly insurance is entered separately, including applicable supplementary, lump-sum and other mandatory contributions. Special-category selection requires first-five-year eligibility; the business calculator rejects it after year five. The invoice calculator labels this eligibility condition explicitly.

Source: [e-EFKA non-salaried categories and additional levies](https://www.e-efka.gov.gr/el/asphalismenoi/me-misthotoi/neo-systhma-asfalistikon-eisforon/eleftheroi-epaggelmaties-aftoapasxoloumenoi).

## Self-employed

```
annualEFKA = categoryTotal * 12 + additionalMonthlyInsurance * 12
actualProfit = revenue - deductibleExpenses - annualEFKA
taxableIncome = max(0, actualProfit, applicableMinimum)
annualTax = progressiveTax - eligibleNewBusinessRelief
annualNet = actualProfit - annualTax
newAdvance = annualTax * (firstIncomeDeclaration ? 0.275 : 0.55)
netAfterPrepayment = annualNet - newAdvance
```

Expenses must exclude insurance already entered separately. New-business relief halves the actual first-band tax only in the first three years and only when annual gross revenue is at most €10,000. Zero-rate age/family relief cannot produce a second deduction. Business income receives family bracket reductions but no Article 16 credit.

Sources: [AADE new-business relief](https://www.aade.gr/exypiretisi-enimerosi/hristikoi-odigoi/enarxi-epiheirimatikis-drastiriotitas/forologikes-apallages-elafrynseis), [AADE income-tax guide](https://www.aade.gr/omogeneis-katoikoi-exoterikoy/eisodima/katigories-eisodimatos-kai-forologia-eisodimatos-stin-ellada).

The applicable Articles 28A–28C minimum is **required after year three**. Supply the final annual amount after reductions, exemptions and offsets; zero means an applicable exemption. The app does not derive this from minimum wage, payroll, turnover, residence, disability, family circumstances or other income. It never treats presumed income as cash earned. First-three-year scenarios use zero minimum.

The new tax advance is separate from economic net income. `netAfterPrepayment` is before previous advance credits and withholding; it is not a final assessment. First-declaration relief is an explicit fact, independent of the business-year input. VAT, combined income sources, loss carryforwards, personal living-expense presumptions, electronic-spending penalties and special deductions are outside the model.

## Qualifying invoice work (μπλοκάκι)

Employee-style taxation requires explicit confirmation of Article 12(2)(f) eligibility. The client-count rule is up to three clients **or**, if more, at least 75% of income from one. Written contracts, no commercial status, no separate premises from home and no disqualifying concurrent salary are also relevant. Unconfirmed cases must use the regular business scenario.

Article 12 tax eligibility does not establish Article 39(9) insurance eligibility. For category insurance use the category total plus any extras. For Article 39 enter actual annual **worker** contributions, including extras; do not add the client/employer share or category fees again. This branch does not calculate contribution rates or determine insurance eligibility.

Source: [e-EFKA Article 39(9) service](https://www.efka.gov.gr/el/elektronikes-yperesies/yperesia-apodoches-symbaseon-par-9-arthroy-39-n-43872016-dpy).

```
taxableIncome = max(0, invoiced - workerInsurance)
annualTax = progressiveTax - appliedCredit
withheld = suppliedAnnualWithholding ?? invoiced * 0.20
balanceDue = annualTax - withheld
annualNet = invoiced - workerInsurance - annualTax
```

The 20% withholding default is an explicit scenario assumption, not a universal rule. Actual withholding, including zero, overrides it and affects settlement only. The qualifying invoice scenario does not charge a business tax advance.

## Presentation and verification

Effective rates consistently include income tax and worker insurance, divided by gross income. Summary and comparison totals exclude the new advance, matching economic net income. Comparison assumes age 35, no children, first-category insurance, no extras or expenses, fourth business year and qualifying Article 12 tax treatment. It requires a supplied business minimum. Employee gross uses 14 salary units; business gross uses 12 months, so annual gross amounts differ at the same monthly input.

Regression tests cover statutory amount tables, family and age boundaries, proportional credit taper and liability cap, revenue eligibility limits, explicit minimum-income handling, worker-only insurance, actual withholding, first-declaration advances, UI validation and reconciliation of comparison totals.
