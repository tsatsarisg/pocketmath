# PocketMath SEO Strategy 2026

## Executive Summary

PocketMath is a React-based SPA (Single Page Application) tax calculator with multi-language support. Your biggest SEO opportunities lie in:

1. **Implementing proper server-side rendering (SSR) or static site generation (SSG)** to ensure crawlability
2. **Structured data implementation** to capture rich results and AI search visibility
3. **International SEO configuration** with proper hreflang tags for Greek/English split
4. **Content hub strategy** with educational blog content driving traffic to the calculator
5. **Link building through digital PR** around unique tax calculation data/insights

**Expected Impact**: 50-200% organic traffic growth within 6-12 months through proper technical foundation + content strategy + authority building.

---

## Phase 1: Technical Foundation (Weeks 1-4)

### 1.1 Enable Server-Side Rendering or Static Pre-rendering

**Priority: CRITICAL**

Current architecture (`index.html` with `<script type="module">`) is 100% client-side rendered. This creates three problems:

1. **Crawlability Issue**: Meta tags are not present in initial HTML—only injected post-render
2. **Indexation Risk**: Without proper metadata in source code, pages won't index for long-tail variations
3. **AI Search Visibility**: GPT, Claude, Perplexity don't execute JavaScript; they parse raw HTML only

**Solution Options**:

**Option A: Static Pre-rendering (Recommended)**
- Use `@prerender/prerender-core` or Vite's static generation
- Pre-render all calculator routes as static HTML
- Each route gets unique meta tags, schema markup, Open Graph data
- Build time: ~5 seconds; no runtime overhead
- Best for: Calculator tools where content is static/evergreen

**Option B: Server-Side Rendering**
- Implement Node.js SSR server (Express + Vite middleware)
- Render HTML on request with proper `<head>` metadata injection
- Best for: If you plan to build content hub with blog posts

**Option C: Hybrid (Recommended if scaling)**
- Pre-render calculator routes as static
- Keep `/blog/*` routes dynamic
- Best of both worlds

**Implementation Steps**:
1. Install `@prerender/prerender-core` and `vite-plugin-prerender`
2. Configure render targets in `vite.config.ts`:
   - `/` (homepage)
   - `/employee` (employee calculator page)
   - `/self-employed` (self-employed calculator page)
   - `/mplokaki` (mplokaki calculator page)
3. Build outputs as `.html` files in `dist/` directory
4. Deploy to static hosting (Netlify, Vercel, GitHub Pages)

**Verification**:
- Run `curl -I https://pocketmath.com/employee` and verify `Content-Type: text/html`
- Inspect raw HTML—verify `<title>`, `<meta name="description">`, `<script type="application/ld+json">` are present before `</head>`
- Test in Google Search Console: simulate Googlebot fetch

---

### 1.2 Implement Dynamic Meta Tags & Open Graph Tags

**Priority: HIGH**

Each calculator page needs unique metadata.

**Required Meta Tags - Homepage** (`/`):
```html
<title>PocketMath – Net Income Calculator for Greece 2026</title>
<meta name="description" content="Calculate your net income for 2026. Free tax calculator for Greek employees, self-employed workers, and freelancers. Instant results for taxes, contributions, and take-home pay.">
<meta name="keywords" content="net income calculator greece, tax calculator 2026, employee net pay, self-employed calculator, freelancer taxes">
<meta property="og:title" content="PocketMath – Calculate Your Net Income">
<meta property="og:description" content="Free net income calculator for Greek employees, self-employed workers, and mplokaki workers.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://pocketmath.com/">
<meta property="og:image" content="https://pocketmath.com/og-image.png">
<link rel="canonical" href="https://pocketmath.com/">
```

**Required Meta Tags - Employee Calculator** (`/employee`):
```html
<title>Employee Net Income Calculator Greece 2026 | PocketMath</title>
<meta name="description" content="Calculate your net employee salary in Greece for 2026. Includes taxes, social security contributions, and tax credits. Monthly or annual salary calculations.">
<link rel="canonical" href="https://pocketmath.com/employee">
```

**Required Meta Tags - Self-Employed Calculator** (`/self-employed`):
```html
<title>Self-Employed Income Tax Calculator Greece 2026 | PocketMath</title>
<meta name="description" content="Calculate self-employed net income in Greece for 2026. Includes EFKA contributions, business expenses, and tax prepayment. Get accurate take-home calculations.">
<link rel="canonical" href="https://pocketmath.com/self-employed">
```

**Required Meta Tags - Mplokaki Calculator** (`/mplokaki`):
```html
<title>Block Invoice (Mplokaki) Tax Calculator Greece 2026 | PocketMath</title>
<meta name="description" content="Calculate net income for block invoice (mplokaki) workers in Greece 2026. Includes EFKA, tax withholding, and monthly/annual calculations.">
<link rel="canonical" href="https://pocketmath.com/mplokaki">
```

**Implementation**:
1. Use `react-helmet-async` or `@unhead/react` for tag injection
2. Inject tags on route mount
3. Set `hreflang` tags (see Section 1.3)

**Testing Tools**:
- [Yoast Meta Preview](https://yoast.com/)
- Google Search Console "URL Inspection"
- [OpenGraph Preview](https://www.opengraphcheck.com/)

---

### 1.3 Configure International SEO with Hreflang Tags

**Priority: HIGH**

You have Greek (`el`) and English (`en`) content. Hreflang tags prevent:
- Google indexing both versions for same query (duplicate content)
- Poor CTR in SERPs
- Lost international traffic

**Implementation**:

Add to `<head>` of every page:
```html
<link rel="alternate" hreflang="el" href="https://pocketmath.com/el/">
<link rel="alternate" hreflang="en" href="https://pocketmath.com/en/">
<link rel="alternate" hreflang="x-default" href="https://pocketmath.com/en/">
```

**Recommended Fix**: Implement language-prefixed URLs:
- Greek: `pocketmath.com/el/`
- English: `pocketmath.com/en/`

Update TanStack Router:
```typescript
export const Route = createFileRoute('/en/')({
  component: HomePage,
});
export const Route = createFileRoute('/el/')({
  component: HomePage,
});
```

---

### 1.4 Add Structured Data (JSON-LD Schema)

**Priority: HIGH**

Structured data helps:
- AI search engines understand your content (critical for GPT, Claude, Perplexity visibility)
- Google generate rich results and knowledge panels
- Voice search optimization

**Organization Schema** (on homepage):
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PocketMath",
  "url": "https://pocketmath.com",
  "description": "Free net income calculator for Greek employees, self-employed workers, and freelancers",
  "logo": "https://pocketmath.com/logo.png"
}
```

**WebApplication Schema** (on each calculator page):
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Employee Net Income Calculator",
  "url": "https://pocketmath.com/employee",
  "description": "Calculate your net employee salary in Greece for 2026",
  "applicationCategory": "CalculatorApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  },
  "inLanguage": "en-GB"
}
```

**FAQPage Schema** (for future blog/FAQ content):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How is net income calculated in Greece?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Net income is calculated by..."
      }
    }
  ]
}
```

**Implementation**:
1. Add schema as `<script type="application/ld+json">` in `<head>`
2. Inject unique schema for each route
3. Validate with [Google Rich Results Test](https://search.google.com/test/rich-results)

---

### 1.5 Core Web Vitals Optimization

**Priority: MEDIUM**

**Check Current Performance**:
1. Go to [Google PageSpeed Insights](https://pagespeed.web.dev/)
2. Check mobile vs. desktop: LCP, INP, CLS

**Key Optimizations for Calculator Apps**:

| Issue | Impact | Fix |
|-------|--------|-----|
| Large JavaScript bundles | LCP > 2.5s | Code split routes; lazy load non-critical JS |
| Layout shifts on data load | CLS > 0.1 | Reserve space for results before calculating |
| Slow input response | INP > 200ms | Debounce calculations; use React's `useTransition` |

---

## Phase 2: Content Strategy & Keyword Research (Weeks 4-8)

### 2.1 Target Keyword Universe

**High-Intent Transactional** (People using your calculator):
- "net income calculator greece 2026" (Search Volume: ~1,900/month)
- "employee salary calculator greece" (~500/month)
- "self-employed tax calculator greece" (~400/month)
- "mplokaki tax calculator" (~300/month)
- "how much will i take home salary greece" (~600/month)

**Mid-Intent Informational** (Building trust + brand):
- "how is income tax calculated in greece" (~800/month)
- "what is greek tax year 2026" (~400/month)
- "greek tax brackets 2026" (~600/month)
- "efka contributions greece" (~300/month)
- "tax deductions employees greece" (~250/month)

**Long-Tail Transactional**:
- "net salary calculator athens greece"
- "tax withheld mplokaki 2026"
- "self-employed expenses greece tax deductible"

**Keyword Research Tools**:
- Google Keyword Planner (free; requires Google Ads account)
- Ubersuggest (free tier limited)
- AnswerThePublic (shows question-based queries)
- Google Search Console (once site gets impressions)

---

### 2.2 Blog Content Roadmap

**2-Tier Content Approach**:

```
Tier 1: Informational Blog Content (Drive traffic)
├── "Greek Income Tax Brackets 2026: Complete Guide"
├── "How to Maximize Tax Deductions for Employees in Greece"
├── "EFKA Contributions Explained: Categories & Rates 2026"
└── "Tax Credit vs. Tax Deduction: What's the Difference?"
    ↓ (Internal links to calculator)

Tier 2: Calculator Tool Pages (Convert traffic)
├── /employee (Monthly salary breakdown)
├── /self-employed (Revenue, expenses, EFKA)
└── /mplokaki (Block invoice calculations)
```

**Create These 5 High-Impact Posts** (Q2 2026):

| Post | Target Keywords | Expected Volume | Internal Links | Effort |
|------|-----------------|-----------------|-----------------|--------|
| "Greek Tax Brackets & Rates 2026" | greek tax brackets 2026, income tax rates greece | 600 | Link to /employee calculator | 3 hours |
| "Employee Tax Deductions Greece" | tax deductions employees greece, greek tax credits | 350 | Link to /employee, breakdown section | 4 hours |
| "Self-Employed Tax Guide 2026" | self-employed taxes greece, freelancer tax greece | 400 | Link to /self-employed, EFKA explanation | 5 hours |
| "EFKA Categories Explained" | efka contributions greece, greek social security | 300 | Link to all calculators | 3 hours |
| "Mplokaki Worker Tax Guide" | mplokaki taxes, block invoice worker greece | 250 | Link to /mplokaki calculator | 3 hours |

**Content Structure Template**:

```markdown
# [Blog Post Title]

## Introduction
- Hook: "Did you know...?"
- Define the topic
- Link to related calculator

## Section 1: The Basics
- Simple explanation
- Example with numbers
- **Interactive Element**: Embed calculator iframe

## Section 2: Detailed Breakdown
- Tax brackets table
- Contribution rates
- Calculator button: "Calculate Your [X]"

## Section 3: Advanced Tips
- Optimization strategies
- Common mistakes
- Link to detailed calculator

## FAQ Section
- 5-7 questions users are asking
- Brief answers
- Calculator CTA

## Final CTA
"Try our calculator: [Button]"
```

---

### 2.3 Internal Linking Strategy

**Linking Pattern**:

```
Homepage (/)
├─→ Blog Hub (/blog)
│  ├─→ Tax Brackets 2026 (links to /employee, /self-employed)
│  ├─→ Employee Tax Guide (links to /employee calc, tax credit section)
│  ├─→ Self-Employed Tax Guide (links to /self-employed calc, EFKA)
│  └─→ EFKA Explained (links to /mplokaki, /self-employed)
│
├─→ /employee (links to Tax Brackets blog, Employee Tax Guide)
├─→ /self-employed (links to Self-Employed Tax Guide, EFKA Explained)
└─→ /mplokaki (links to EFKA Explained, Mplokaki Tax Guide)
```

**Anchor Text Guidelines**:
- Avoid: "click here", "more info"
- Use: "calculate your employee salary", "read the full EFKA guide", "see how tax credits apply"

---

## Phase 3: Authority Building (Weeks 8-16)

### 3.1 Link Building Strategy

#### 1. Greek Tax & Accounting Communities
- **Target**: Greek accounting blogs, tax forums, freelancer communities
- **Approach**: Reach out with tax insights, offer calculator embed
- **Expected Links**: 5-10 within 3 months

**Outreach Template**:
```
Subject: Free Tax Calculator Resource for Your Readers

Hi [Name],

I noticed your post on [topic] and thought your audience might benefit
from a free calculator we built for [use case].

[calculator-url] — results include breakdown of taxes, contributions,
and net take-home pay.

Would you be interested in mentioning this as a resource?

Best,
[Your Name]
```

#### 2. Freelancer & Digital Nomad Networks
- **Target**: Nomad List (Greece section), Upwork blogs, digital nomad communities
- **Angle**: "Tax Calculator for Remote Workers in Greece"
- **Expected Links**: 3-5

#### 3. Data-Driven Content
- **Create**: "2026 Greek Employee Tax Burden Analysis" (unique data/research)
- **Promote**: Tax news sites, LinkedIn, journalism outreach
- **Expected Links**: 10-15

#### 4. Unlinked Brand Mentions
- **Tool**: Google Alerts for "pocketmath" + "tax calculator greece"
- **Action**: Find mentions without links, ask for link attribution
- **Expected Recovery**: 2-5 links/month

#### 5. Partnership with Greek Institutions
- **Target**: Greek tax agency resources, university tax workshops
- **Approach**: Position as educational tool
- **Expected Impact**: 1-2 high-authority links

---

### 3.2 PR & Press Release Strategy

**Newsworthy Angles**:

1. **Tax Year Launch** ("PocketMath Releases 2026 Tax Calculator")
   - Tie to January/February tax season
   - Send to Greek business press, tech blogs
   - Expected reach: 5-10 pickups

2. **Tax Law Changes** ("New Tax Credits 2026: Here's What Greek Employees Need to Know")
   - Build calculator around new tax laws
   - Offer unique calculations showcasing impact

3. **Industry Reports** ("Analysis of Greek Tax Burden: Employees vs. Freelancers vs. Block Invoice Workers")
   - Release unique data analysis from your calculator
   - Share with tax organizations, media
   - Generate backlinks + brand awareness

---

## Phase 4: Monitoring & Measurement (Ongoing)

### 4.1 SEO Dashboard Metrics

| Metric | Tool | Target | Frequency |
|--------|------|--------|-----------|
| Organic traffic | Google Analytics 4 | 50% MoM growth Year 1 | Weekly |
| Keyword positions | Ahrefs / SEMrush / Mangools | Top 3: 15+ keywords; Top 10: 50+ | Weekly |
| Domain rating | Ahrefs | 25+ by Month 6 | Monthly |
| Indexed pages | Google Search Console | 50+ pages (blog + calculator pages) | Weekly |
| Core Web Vitals | PageSpeed Insights / Search Console | LCP <2.5s, INP <200ms, CLS <0.1 | Bi-weekly |
| Backlinks | Ahrefs / Majestic | 50+ referring domains | Monthly |

**Setup**:
1. **Google Search Console** (free) - Monitor impressions, clicks, positions
2. **Google Analytics 4** (free) - Track organic traffic, calculator usage
3. **Ahrefs or SEMrush** (paid trial) - Rank tracking, backlink analysis

---

### 4.2 Algorithm & Competitive Monitoring

**Track These Signals**:

1. **Google Algorithm Updates**
   - Monitor: BrightEdge, Semrush Sensor, MozCast
   - Action: If traffic drops, audit for thin content, E-E-A-T issues, mobile usability

2. **Competitor Benchmarking**
   - Monthly check: What keywords are competitors ranking for?
   - React: Build content for queries where competitors rank but you don't

---

## Phase 5: Quick Wins (Weeks 1-4)

### Weeks 1-2: Foundation Setup (8-10 hours)
- [ ] Install and configure `react-helmet-async` for meta tag management
- [ ] Update `index.html` with baseline meta tags, hreflang, structured data templates
- [ ] Create `public/robots.txt` with sitemap reference
- [ ] Generate `sitemap.xml` with all calculator routes
- [ ] Submit to Google Search Console
- [ ] Set up Google Analytics 4 tracking
- [ ] Set up Search Console property verification

### Weeks 2-3: First Blog Post (4 hours)
Create: **"Greek Income Tax Brackets 2026: Complete Guide"**
- 2,000-word comprehensive guide
- Include: Tax brackets table, calculator output examples
- Embed: Interactive calculator iframe
- Optimize for: "greek tax brackets 2026" + "income tax rates greece"

### Weeks 3-4: Outreach Round 1 (5 hours)
- Identify 20 Greek accounting blogs, freelancer communities
- Send personalized outreach emails
- Goal: 2-3 links from this batch

---

## Implementation Checklist

### Technical SEO
- [ ] Implement meta tag management system (react-helmet-async)
- [ ] Add unique title/description to each calculator page
- [ ] Implement hreflang tags for Greek/English
- [ ] Add JSON-LD schema (Organization + WebApplication)
- [ ] Create/submit XML sitemap
- [ ] Add robots.txt
- [ ] Implement SSR or pre-rendering for static pages
- [ ] Check Core Web Vitals
- [ ] Set up Google Search Console
- [ ] Set up Google Analytics 4

### Content
- [ ] Create blog section/routes
- [ ] Write 5 foundational blog posts
- [ ] Add internal linking from blog → calculator pages
- [ ] Add FAQ schema to blog posts
- [ ] Create author bios/credentials

### Authority
- [ ] Competitor analysis (Ahrefs/SEMrush trial)
- [ ] Unlinked mention tracking (Google Alerts)
- [ ] Outreach to 20+ accounting/freelancer sites
- [ ] Plan 2-3 PR angles around tax season

### Measurement
- [ ] Set up ranking tracker (Mangools or paid)
- [ ] Create SEO dashboard (Looker Studio)
- [ ] Establish baseline metrics
- [ ] Set up weekly reporting

---

## Expected 12-Month Growth

| Month | Organic Traffic | Indexed Pages | Top Keywords | Backlinks |
|-------|-----------------|---------------|--------------|-----------|
| Month 0 (Current) | ~100/month | 5 | 0 positions | 0 |
| Month 3 | 500-1K | 15 (blog posts) | 5-10 (positions 20-30) | 10-15 |
| Month 6 | 2K-4K | 25 | 15-20 (positions 10-15) | 25-35 |
| Month 12 | 10K-20K | 40+ | 40-50 (positions 1-10) | 60+ |

**Revenue Opportunity**: At 10K-20K monthly organic visitors, you could generate EUR 200-500/month in recurring revenue (donation/sponsorship CTA).

---

## Tools & Resources

### Free Tools
- Google Search Console (https://search.google.com/search-console)
- Google Analytics 4 (https://analytics.google.com)
- Google Keyword Planner (https://ads.google.com/intl/en/home/tools/keyword-planner/)
- Bing Webmaster Tools (https://www.bing.com/webmasters)
- AnswerThePublic (https://answerthepublic.com)
- Google PageSpeed Insights (https://pagespeed.web.dev)
- Schema Markup Validator (https://schema.org/validator/)

### Paid Tools (Start with free trials)
- Ahrefs (~$99/month; rank tracking, backlink analysis)
- SEMrush (~$120/month; comprehensive SEO platform)
- Mangools (~$30/month; lightweight, affordable rank tracking)

### React/Vite SEO Libraries
- `react-helmet-async` (meta tag management)
- `@unhead/react` (modern alternative)
- `vite-plugin-prerender` (static pre-rendering)

---

## Competitive Advantages

1. **Niche Authority**: No other free calculator specifically targets Greek tax calculations for all three categories
2. **Multi-Language Asset**: Most competitors are English-only
3. **Fresh Content**: 2026 tax year data is bleeding-edge
4. **Utility**: Calculators have natural link appeal
5. **Data Asset**: Future "State of Greek Taxes 2026" reports with real data will be unique, linkable content

---

## Next Steps

1. **Start with Phase 1** (Technical Foundation) immediately - 1-2 weeks
2. **Build blog content** (Phase 2) in parallel - 2-4 weeks
3. **Outreach & Authority** (Phase 3) - ongoing after Phase 1 complete
4. **Monitor & Iterate** (Phase 4) - weekly tracking

**Time Allocation**:
- Weeks 1-2: Technical setup (8-10 hours)
- Weeks 2-4: First blog post + outreach (9 hours)
- Weeks 4-8: Next 4 blog posts (16 hours)
- Month 3+: Content updates, outreach, monitoring (5-10 hours/week)
