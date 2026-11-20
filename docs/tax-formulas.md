# Greek tax and insurance calculations — tax year 2026

Baseline reviewed September 2026. Single-member IKE rules reviewed 20 November 2026. This is a full-year scenario calculator, not a tax-return engine. Monthly business income assumes 12 equal months; employee salary assumes 14 equal salary units. Amounts exclude VAT. The sole proprietor and invoice scenarios treat the modelled contributions as deductible.

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
| -------- | -----------------------: | ------------------------: |
| Special  |                  €150.46 |                   €160.46 |
| 1st      |                  €250.77 |                   €260.77 |
| 2nd      |                  €300.93 |                   €310.93 |
| 3rd      |                  €360.63 |                   €370.63 |
| 4th      |                  €433.47 |                   €443.47 |
| 5th      |                  €519.45 |                   €529.45 |
| 6th      |                  €675.87 |                   €685.87 |

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

## Single-member IKE

The model covers one head office for a full tax year and a Greek-resident individual who is the only member and manages the IKE. The owner takes dividends without a management fee. The owner pays non-salaried EFKA personally, including unemployment and any applicable additional insurance. The company tax calculation excludes the owner's personal contributions. Special-category eligibility depends on the person's insurance history. [e-EFKA coverage](https://www.e-efka.gov.gr/el/sychnes-eroteseis/asphalisi-eisphores/asphalismenoi/genika/eleytheroi-epaggelmaties-aytoapascholoymenoi-kai-agrotes) · [e-EFKA 6/2026](https://www.e-efka.gov.gr/el/egkyklioi-kai-genika-eggrapha/egkyklios-62026)

```
profitBeforeTax = annualRevenue - annualDeductibleExpenses - 100
corporateTax = max(0, profitBeforeTax) * 22%
profitAfterTax = profitBeforeTax - corporateTax - headOfficeLevy
legalReserve = max(0, profitAfterTax) * 5%
grossDividend = (max(0, profitAfterTax) - legalReserve) * distributionPercent / 100
dividendTax = grossDividend * 5%
ownerNet = grossDividend - dividendTax - personalEFKA + min(0, profitAfterTax)
companyBalanceAfterAdvance = profitAfterTax - grossDividend - newCorporateAdvance
```

- The €100 annual GEMI fee is included in recurring deductible expenses. First-year GEMI fees may be prorated. Standard e-YMS incorporation costs €18 once. Accounting, banking, invoicing and premises costs depend on the business and can be entered as expenses where deductible. The company prepares and files annual financial statements. [GEMI fee table](https://gge.mindev.gov.gr/tomeas-emporiou/sixnes-erotiseis-gemh/) · [e-YMS procedure](https://eu-go.gov.gr/services/596897) · [IKE law](https://ependyseis.mindev.gov.gr/uploads/photos/fek-a-86-2012.pdf)
- Law 5355/2026 exempts head offices outside Attica and in Attica's Islands Regional Unit for tax year 2026. Where payable, the non-deductible head-office levy is €800 or €1,000 according to location and population. The selector also accommodates other exemptions. Branch levies and part-year fees require a separate estimate. [AADE O. 3055/2026, Articles 14 and 53](https://aade.gr/egkyklioi-kai-apofaseis/o-3055-19-11-2026)
- The model applies the minimum 5% legal reserve and lets the owner distribute part or all of the available current-year profit. The personal net excludes company reserves and assumes the owner funds any operating shortfall. The 5% dividend tax applies to the amount distributed. [Law 4072/2012, Article 100](https://ependyseis.mindev.gov.gr/uploads/photos/fek-a-86-2012.pdf) · [AADE 2026 tax handbook](https://www.aade.gr/sites/default/files/2026-05/egxeiridio_erotiseon_apantiseon_forologias_may_2026.pdf)
- The corporate income tax rate is 22%. The corporate advance is 80% of corporate tax, or 40% for the first three years of an eligible new company. The reduced rate excludes companies formed through conversion or merger. The advance affects the company balance before prior credits. The owner net and comparison exclude it. [AADE E. 2125/2021](https://www.aade.gr/sites/default/files/2021-06/e_2125_2021pro.pdf) · [Article 71, consolidated income tax code](https://gslegal.gov.gr/wp-content/uploads/2024/05/%CE%94%CE%99%CE%9F%CE%99%CE%9A%CE%97%CE%A4%CE%99%CE%9A%CE%97-%CE%9A%CE%A9%CE%94%CE%99%CE%9A%CE%9F%CE%A0%CE%9F%CE%99%CE%97%CE%A3%CE%97-%CE%9A%CE%A9%CE%94%CE%99%CE%9A%CE%91-%CE%A6%CE%9F%CE%A1%CE%9F%CE%9B%CE%9F%CE%93%CE%99%CE%91%CE%A3-%CE%95%CE%99%CE%A3%CE%9F%CE%94%CE%97%CE%9C%CE%91%CE%A4%CE%9F%CE%A3.pdf)

### Moving from a sole proprietorship

A newly incorporated IKE receives its own tax registration. Closing the sole proprietorship and contributing its assets or operations to a company are separate steps with case-specific treatment. Law 5162/2024, Article 52, provides for qualifying contributions of a sole proprietorship, including into an IKE. The scenario uses ordinary taxation before transition relief, transfer costs and any personal assessment under Article 28E. [AADE E. 2088/2025](https://www.aade.gr/egkyklioi-kai-apofaseis/e-2088-10-10-2025) · [AADE cessation procedure](https://www.aade.gr/egkyklioi-kai-apofaseis/1157-31-10-2024)

A qualifying contribution can trigger the Article 5 exemption under Law 4935/2022 for 30% of eligible pre-tax profit beginning in the next tax year. Conditions include at least three years since the sole proprietorship opened and double-entry accounting at the recipient, with additional rules for multiple contributing businesses. The exemption requires a qualifying contribution and is subject to statutory limits. [AADE Law 4935/2022 notification](https://www.aade.gr/egkyklioi-kai-apofaseis/o-deaf-1048263-ex-2022) · [AADE E. 2005/2026](https://www.aade.gr/sites/default/files/2026-03/%CE%95_2005_2026.pdf)

Management remuneration for services follows the rules for employment income, with specific treatment of the owner's contributions where both management remuneration and dividends are paid. This calculator uses a dividends-only scenario. [AADE E1 rules for managers and sole members](https://www.aade.gr/sites/default/files/2026-03/a1062_2026fek.pdf)

Article 28E can apply through tax year 2026 after an audit when the sole owner's largest-revenue activity matches the former sole proprietorship by second-level KAD and corporate tax plus hypothetical tax on full distribution falls below the tax on the applicable sole-proprietor minimum. The additional assessment is personal and based on the difference. A midyear move can bring the IKE period within scope. [Law 5073/2023, Article 19](https://www.aade.gr/sites/default/files/2025-01/arthro28_5073.pdf)

## Presentation and verification

Effective rates divide income tax and insurance by gross income, with the IKE rate also including dividend tax and any applicable business levy. Summary and comparison totals exclude the new advance. The comparison accepts separate sole-proprietor and IKE expenses, the IKE head-office levy, and the age, dependent children and sole-proprietor business years. It uses first-category insurance and assumes qualifying Article 12 treatment for invoice work. The sole-proprietor scenario requires the applicable business minimum after year three. Employee gross uses 14 salary units. Both businesses use 12 months, including in the dedicated sole proprietor and IKE comparison.

Regression tests cover statutory amount tables, family and age boundaries, proportional credit taper and liability cap, revenue eligibility limits, explicit minimum-income handling, worker-only insurance, actual withholding, first-declaration advances, UI validation and reconciliation of comparison totals.
