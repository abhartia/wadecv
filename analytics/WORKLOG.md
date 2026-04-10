# WadeCV Analytics Work Log

This log tracks all changes made based on analytics insights. Daily agents should check this before starting work to avoid repeating tasks.

---

## 2026-04-11 — Session 9: Full ATS Content Overhaul + Rezi Comparison

### Data Pulled
- [x] GA4 analytics data → `ga4_data.json`
- [x] GSC data → `gsc_data.json` — **246 impressions (up from 230, +7%)**, 34 pages (up from 31), 50 queries
- [x] Trends data → `trends_data.json` — jobcopilot +39,450% breakout, rezi +160%, chatgpt resume UP at 57.8

### Key Findings
- **Impressions still growing:** 246 total (up 7% from 230). 34 pages with impressions (up from 31)
- **5 new pages entering at page 1 positions:** retail-to-corporate (pos 3), teacher-to-edtech (pos 5), cybersecurity-analyst resume-bullets (pos 7), why-mail-a-physical-cv (pos 8.5), customer-success-manager (pos 9)
- **Digital marketing cluster accelerating:** +36% to 15 impressions, position improving to 71.0 (was 72.5) — cluster completion validated
- **Customer service cluster still growing:** 58 impr (up from 54, +7%), position 84.1
- **Homepage getting clicks:** 2 clicks at position 2.8, 33% CTR
- **Apr 9 daily dip:** 16 impressions (from 39-54 range) — monitoring, only 1 data point
- **First organic SEO page landing in GA4:** `/ats/lever` got 1 pageview (100% bounce) — first evidence of organic traffic on SEO content
- **"jobcopilot" is a new massive breakout:** +39,450% for "ai job application"
- **Signup events still 0:** No new signups since instrumentation added Apr 7

### Changes Made

#### 1. ATS Content Overhaul — All 8 Non-Lever Entries (HIGH IMPACT — biggest content change yet)
**Why:** All 7 remaining ATS entries plus Workday had thin, generic content — ~200 char bodies, 4-5 identical tips, and 0-1 FAQ. After the Lever overhaul in Session 8, these were the lowest-quality pages in the entire site. With Google testing new pages at strong positions, improving existing thin content could unlock significant ranking improvements.

**Files changed:**
- `frontend/content/seo/ats.json` — All 8 non-Lever entries completely rewritten:
  - Each now has 6 platform-specific parsing rules (was 4-5 generic)
  - Each now has 6 platform-specific formatting notes (was 4-5 generic)
  - Body content: ~2,500-3,000 chars each (was ~200 chars)
  - 5 FAQs each (was 0-1), all with platform-specific answers
  - Names real companies that use each ATS (Airbnb, Amazon, Boeing, Siemens, Notion, etc.)
  - Covers unique features: Greenhouse scorecards, iCIMS qualification scoring, Taleo knockout questions, SuccessFactors competency matching, JazzHR collaborative hiring, BambooHR cultural fit, Ashby analytics-first approach
- `frontend/src/app/(resources)/ats/[slug]/page.tsx` — dateModified → 2026-04-11

**Total new content:** ~20,000 chars body + 40 FAQ entries + 48 platform-specific tips

**Waiting for:** Google reindex (check 2026-04-18+)

#### 2. "WadeCV vs Rezi" Comparison Page (HIGH IMPACT)
**Why:** "rezi ai resume builder" is +160% rising in Google Trends. Rezi is an established AI resume builder — genuinely different from WadeCV (builder vs tailoring tool). 6th comparison page in the series.

**Files created:**
- `frontend/src/app/(resources)/wadecv-vs-rezi/page.tsx` — 11-row feature comparison, 5-item FAQ, FAQPage + Article JSON-LD, CrossCategoryLinks, CTA

**Files changed:**
- `frontend/src/app/sitemap.ts` — added `/wadecv-vs-rezi` at priority 0.8

**Waiting for:** Google indexing (check 2026-04-18+)

#### 3. Build verified
- `next build` passes: 169 static pages (up from 168), 0 errors

### Not Yet Done (For Future Sessions)
- [ ] Check `/best-ai-resume-builder-2026` indexed by 2026-04-12
- [ ] Check `/wadecv-vs-teal` indexed by 2026-04-13
- [ ] Check `/wadecv-vs-jobscan` indexed by 2026-04-15
- [ ] Check Session 6 jobs pages indexed by 2026-04-15
- [ ] Check `/wadecv-vs-wobo` indexed by 2026-04-17
- [ ] Check `/wadecv-vs-flowcv` indexed by 2026-04-17
- [ ] Check `/ats/lever` position/CTR after content overhaul (2026-04-17+)
- [ ] Check HR content cluster indexed (2026-04-17+)
- [ ] Check all ATS pages after content overhaul (2026-04-18+)
- [ ] Check `/wadecv-vs-rezi` indexed (2026-04-18+)
- [ ] Monitor daily impressions Apr 10-12 to determine if Apr 9 dip is trend or noise
- [ ] Monitor first `signup_start`/`signup_success` events in GA4
- [ ] Consider "WadeCV vs JobCopilot" comparison page (jobcopilot +39,450% breakout)
- [ ] Consider UK-specific content or landing page ("cv builder free uk" +300% rising)
- [ ] Create topic cluster hub pages (pillar content aggregating each category)
- [ ] Add author credentials/expert signals to content pages
- [ ] Investigate "Paid Search" 13-session anomaly (still persisting — likely bots)
- [ ] Monitor AI bot traffic in server logs

---

## 2026-04-10 — Session 8: Lever Overhaul + FlowCV Comparison + HR Cluster

### Data Pulled
- [x] GA4 analytics data → `ga4_data.json` — same as Session 7 (same day)
- [x] GSC data → `gsc_data.json` — same as Session 7 (same day)
- [x] Trends data → `trends_data.json` — partial (rate limited), core product terms stable

### Key Findings (new since Session 7)
- **`/ats/lever` still 0 clicks** at position 7.8 — content thinness identified as root cause (440 char body, no FAQ)
- **ALL 8 non-workday ATS pages** have no FAQ and very thin body content (200-440 chars)
- **Nursing content cluster already complete** (exists in jobs, skills, resume-bullets) — no gap to fill
- **HR/human-resources** identified as high-volume gap: jobs/hr-business-partner exists but no skills or resume-bullets pages
- Daily impressions sustained at 39-54/day (Apr 6-8)

### Changes Made

#### 1. `/ats/lever` Content Overhaul (HIGH IMPACT — fixing top page)
**Why:** 56 impressions at position 7.8 with 0 clicks for 5+ days. Meta change from Session 1 did not improve CTR. Root cause: content was thin and generic (identical advice to every other ATS page, only 440 chars body, no FAQ).

**Files changed:**
- `frontend/content/seo/ats.json` — `lever` entry rewritten:
  - Meta description: now mentions Lever parsing, scoring, and recruiter surfacing
  - Intro: mentions Employ Inc, specific companies (Spotify, Netflix), CRM+ATS combination, talent pool
  - Parsing rules: 5→6 items, all Lever-specific (integrated parsing engine, split-screen view, talent pool, no auto-rejection, real-time field pre-population)
  - Formatting notes: 5→6 items, Lever-specific (candidate card truncation, Skills section index weighting)
  - Body: 440→3,200 chars, covers full-text vs field-specific search, talent pool keyword strategy, formatting impact on parsed profile display
  - FAQ: 0→5 questions (auto-rejection, file format, keyword search, multi-application, data retention)

**Waiting for:** Google reindex (check 2026-04-17+)

#### 2. "WadeCV vs FlowCV" Comparison Page (HIGH IMPACT)
**Why:** FlowCV is #2 breakout competitor after Wobo AI (+19,750% rising). FlowCV is a design builder vs WadeCV's tailoring approach — genuinely different value props. Queued from Session 7.

**Files created:**
- `frontend/src/app/(resources)/wadecv-vs-flowcv/page.tsx` — 11-row feature comparison, 5-item FAQ, FAQPage + Article JSON-LD, CrossCategoryLinks, CTA

**Files changed:**
- `frontend/src/app/sitemap.ts` — added `/wadecv-vs-flowcv` at priority 0.8

**Waiting for:** Google indexing (check 2026-04-17+)

#### 3. HR Content Cluster (MEDIUM-HIGH IMPACT)
**Why:** `jobs/hr-business-partner` existed but the cluster had no skills or resume-bullets pages. "HR resume skills" and "human resources resume" are high-volume keyword spaces. Completing the cluster enables internal linking.

**New entries:**
- `frontend/content/seo/skills.json` — `human-resources` with 5 skill clusters, 3 bullet examples, 3 FAQ (28 total)
- `frontend/content/seo/resume-bullets.json` — `human-resources` with 7 bullet examples, 5 impact formulas (29 total)

**Waiting for:** Google indexing (check 2026-04-17+)

#### 4. Build verified
- `next build` passes: 168 static pages (up from 165), 0 errors

### Not Yet Done (For Future Sessions)
- [ ] Check `/best-ai-resume-builder-2026` indexed by 2026-04-12
- [ ] Check `/wadecv-vs-teal` indexed by 2026-04-13
- [ ] Check `/wadecv-vs-jobscan` indexed by 2026-04-15
- [ ] Check Session 6 jobs pages indexed by 2026-04-15
- [ ] Check `/wadecv-vs-wobo` indexed by 2026-04-17
- [ ] Check `/wadecv-vs-flowcv` indexed by 2026-04-17
- [ ] Check `/ats/lever` position/CTR after content overhaul (2026-04-17+)
- [ ] Check HR content cluster indexed (2026-04-17+)
- [ ] Check digital-marketing cluster pages indexed by 2026-04-17
- [ ] Monitor first `signup_start`/`signup_success` events in GA4
- [ ] Overhaul remaining 7 ATS entries with FAQs and richer content (greenhouse, icims, taleo, sap-successfactors, jazzhr, bamboohr, ashby all have thin content)
- [ ] Consider UK-specific content or landing page ("cv builder free uk" +155,650% breakout)
- [ ] Create topic cluster hub pages (pillar content aggregating each category)
- [ ] Investigate "Paid Search" 13-session anomaly (still persisting — likely bots)
- [ ] Add author credentials/expert signals to content pages
- [ ] Monitor AI bot traffic in server logs

---

## 2026-04-10 — Session 7: Wobo AI Comparison + Digital Marketing Cluster

### Data Pulled
- [x] GA4 analytics data → `ga4_data.json`
- [x] GSC data → `gsc_data.json` — **230 impressions (up from 135, +70%)**, 50 unique queries (up from 37), 31 pages with impressions (up from 18)
- [x] Trends data → `trends_data.json` — Wobo AI breakout (+89,350%), FlowCV rising (+19,750%), Teal UP (39, was 30), Jobscan UP (72.5, was 64)

### Key Findings
- **Impressions nearly doubled again:** 230 total (was 135). Daily impressions sustaining 39-54/day (was 0-12/day before Apr 5)
- **Customer service cluster EXPLODING:** `/skills/customer-service` at 54 impressions (+145% from 22), positions 71-88
- **Digital marketing emerging:** `/skills/digital-marketing` at 11 impressions (new in top pages), position 72.5, but had NO supporting content
- **UK at 30% of total:** 69 impressions from UK (was 38) — "cv" terminology driving British traffic
- **`/ats/lever` stuck:** 56 impressions, position 7.8 (degraded from 6.9), still 0 clicks after meta change
- **Wobo AI is #1 breakout competitor:** +89,350% rising in Google Trends for "ai resume builder"
- **Physical mail pages growing:** 5 pages now with impressions, `/physical-mail/how-to-mail-your-resume` at 6 impr
- **Stripe referral decreasing:** 32 sessions (was 48) — gtag fix working
- **Signup events still 0:** No new signups since instrumentation added Apr 7

### Changes Made

#### 1. "WadeCV vs Wobo AI" Comparison Page (HIGH IMPACT)
**Why:** Wobo AI is the #1 breakout query in Google Trends (+89,350% for "ai resume builder"). First-mover advantage on this comparison before anyone else creates similar content.

**Files created:**
- `frontend/src/app/(resources)/wadecv-vs-wobo/page.tsx` — 11-row feature comparison, 5-item FAQ with FAQPage + Article JSON-LD, CrossCategoryLinks, CTA

**Files changed:**
- `frontend/src/app/sitemap.ts` — added `/wadecv-vs-wobo` at priority 0.8

**Waiting for:** Google indexing (check 2026-04-17+)

#### 2. Digital Marketing Content Cluster Completion (HIGH IMPACT)
**Why:** `/skills/digital-marketing` has 11 impressions and growing, but had ZERO supporting content. Adding jobs + resume-bullets pages completes the cluster and strengthens internal linking.

**New entries:**
- `frontend/content/seo/jobs.json` — `digital-marketing-manager` (37 total)
- `frontend/content/seo/resume-bullets.json` — `digital-marketing` (28 total)

**Waiting for:** Google indexing (check 2026-04-17+)

#### 3. Financial Analyst Resume-Bullets (MEDIUM IMPACT)
**Why:** Had skills + jobs pages but was missing resume-bullets. Completes the cluster trio.

**New entry:**
- `frontend/content/seo/resume-bullets.json` — `financial-analyst`

#### 4. Build verified
- `next build` passes: 165 static pages (up from 161), 0 errors

### Not Yet Done (For Future Sessions)
- [ ] Check `/best-ai-resume-builder-2026` indexed by 2026-04-12
- [ ] Check `/wadecv-vs-teal` indexed by 2026-04-13
- [ ] Check `/wadecv-vs-jobscan` indexed by 2026-04-15
- [ ] Check Session 6 jobs pages (accountant, customer-service, admin-assistant, executive-assistant) indexed by 2026-04-15
- [ ] Check `/wadecv-vs-wobo` indexed by 2026-04-17
- [ ] Check digital-marketing cluster pages indexed by 2026-04-17
- [ ] Monitor first `signup_start`/`signup_success` events in GA4
- [ ] Consider `/ats/lever` content overhaul — meta change hasn't improved CTR, position degrading
- [ ] Create "WadeCV vs FlowCV" comparison page (next breakout competitor after Wobo AI)
- [ ] Consider UK-specific content or landing page ("cv builder free uk" +155,650% breakout)
- [ ] Create topic cluster hub pages (pillar content aggregating each category)
- [ ] Investigate "Paid Search" 13-session anomaly (still persisting — likely bots)
- [ ] Add author credentials/expert signals to content pages
- [ ] Monitor AI bot traffic in server logs

---

## 2026-04-08 — Session 6: Jobscan Comparison + Content Cluster Completion

### Data Pulled
- [x] GA4 analytics data → `ga4_data.json`
- [x] GSC data → `gsc_data.json` — **135 impressions (up from 83, +63%)**, 37 unique queries (up from 8!), 18 pages indexed
- [x] Trends data → `trends_data.json` — "chatgpt resume" stable at 69; most others slightly down

### Key Findings
- **Impressions exploded:** 135 total (was 83). Apr 6 had 53 impressions in ONE day (prev high: 12)
- **Accountant cluster taking off:** `/skills/accountant` now has 23 impressions from 12 query variants (positions 53-88)
- **Customer service cluster taking off:** `/skills/customer-service` has 22 impressions from 10 query variants (positions 37-99)
- **UK market emerging:** UK impressions jumped from 9 to 38 — "cv" terminology driving British search traffic
- **New page appearing:** `/career-change/admin-to-product-manager` at position 5.5 (4 impressions) — excellent entry
- **`/ats/lever`:** 47 impressions, position 6.9, still 0 clicks — meta change from Session 1 should be reindexed now, watching
- Facebook referral: 2 sessions (new traffic source)

### Changes Made

#### 1. "WadeCV vs Jobscan" Comparison Page (HIGH IMPACT)
**Why:** Jobscan is the most well-known ATS resume tool. Queued from Session 4. Decision-stage, high-conversion-intent traffic.

**Files created:**
- `frontend/src/app/(resources)/wadecv-vs-jobscan/page.tsx` — 11-row feature comparison, 5-item FAQ, FAQPage + Article JSON-LD, CrossCategoryLinks, CTA

**Files changed:**
- `frontend/src/app/sitemap.ts` — added `/wadecv-vs-jobscan` at priority 0.8

**Waiting for:** Google indexing (check 2026-04-15+)

#### 2. Jobs Content: +4 entries (36 total, was 32) (HIGH IMPACT)
**Why:** Accountant and customer service keyword clusters are exploding in GSC but both missing jobs pages. Adding these completes the content clusters (jobs + skills + resume-bullets).

**New slugs added to `frontend/content/seo/jobs.json`:**
- `accountant` — completes accountant cluster
- `customer-service-representative` — completes customer service cluster
- `administrative-assistant` — completes admin cluster
- `executive-assistant` — completes EA cluster

**Waiting for:** Google indexing (check 2026-04-15+)

#### 3. Build verified
- `next build` passes: 161 static pages (up from 156), 0 errors

### Not Yet Done (For Future Sessions)
- [ ] Check `/ats/lever` CTR starting 2026-04-10 — did Session 1 meta change work?
- [ ] Check `/best-ai-resume-builder-2026` indexed by 2026-04-12
- [ ] Check `/wadecv-vs-teal` indexed by 2026-04-13
- [ ] Check `/wadecv-vs-jobscan` indexed by 2026-04-15
- [ ] Check new jobs pages (accountant, customer-service, admin-assistant, executive-assistant) indexed by 2026-04-15
- [ ] Check new resume-bullets pages (Session 5) indexed by 2026-04-14
- [ ] Monitor first `signup_start`/`signup_success` events in GA4
- [ ] Create topic cluster hub pages (pillar content aggregating each category)
- [ ] Investigate "Paid Search" 13-session anomaly (no ads running)
- [ ] Investigate Facebook referral source (2 sessions from m.facebook.com)
- [ ] Monitor AI bot traffic in server logs
- [ ] Consider adding executive-assistant resume-bullets page (only missing piece in EA cluster)
- [ ] Add author credentials/expert signals to content pages

---

## 2026-04-05 — Initial Analysis + Full SEO Overhaul

### Data Pulled
- [x] GA4 analytics data → `ga4_data.json` (script: `pull_ga4.py`)
- [x] Google Search Console data → `gsc_data.json` (script: `pull_gsc.py`)
- [x] Google Trends data → `trends_data.json` (script: `pull_trends.py`)
- [x] Insights report → `INSIGHTS.md`

### Changes Made

#### 1. Meta titles and descriptions — ALL SEO pages (HIGH IMPACT)
**Why:** GSC showed 44 impressions on `/ats/lever` with 0% CTR. Generic titles like "Resume for Lever ATS | WadeCV" don't compel clicks.

**Files changed:**
- `frontend/content/seo/ats.json` — All 9 ATS entries: rewrote metaDescription to be action-oriented with year marker and specific promises
- `frontend/content/seo/career-change.json` — All 15 career-change entries: rewrote metaDescription with specific skill translations
- `frontend/content/seo/companies.json` — All 13 company entries: rewrote metaDescription with recruiter-focus and hiring-bar language
- `frontend/src/app/(resources)/ats/[slug]/page.tsx` — Title pattern changed to "How to Pass {name} ATS Screening (2026 Guide)"
- `frontend/src/app/(resources)/career-change/[slug]/page.tsx` — Title pattern changed to "{title} (Step-by-Step Guide)"
- `frontend/src/app/(resources)/company-resume/[company]/page.tsx` — Title pattern changed to "{name} Resume Guide: What Recruiters Look For (2026)"
- All 7 index pages (`ats`, `career-change`, `company-resume`, `jobs`, `skills`, `resume-bullets`, `physical-mail`) — titles updated with year marker and CTR-optimized descriptions

#### 2. HowTo structured data on ATS pages (MEDIUM IMPACT)
**Why:** HowTo schema enables rich snippets in Google results, improving CTR further.

**Files changed:**
- `frontend/src/app/(resources)/ats/[slug]/page.tsx` — Added HowTo JSON-LD using formattingNotes as steps

#### 3. HTTP→HTTPS redirect + HSTS header (MEDIUM IMPACT)
**Why:** GSC showed both `http://wadecv.com` and `https://wadecv.com` — splitting crawl authority.

**Files changed:**
- `frontend/next.config.ts` — Added redirect rule for `x-forwarded-proto: http` → HTTPS, added HSTS header (max-age 2 years)

#### 4. Cross-category internal linking (MEDIUM IMPACT)
**Why:** 190+ pages were isolated within their own category. No cross-linking meant Google couldn't discover related content.

**Files created:**
- `frontend/src/components/seo/cross-category-links.tsx` — New component showing 4 links to other category index pages

**Files changed (added CrossCategoryLinks):**
- `frontend/src/app/(resources)/ats/[slug]/page.tsx`
- `frontend/src/app/(resources)/career-change/[slug]/page.tsx`
- `frontend/src/app/(resources)/company-resume/[company]/page.tsx`
- `frontend/src/app/(resources)/jobs/[slug]/page.tsx`
- `frontend/src/app/(resources)/skills/[slug]/page.tsx`
- `frontend/src/app/(resources)/resume-bullets/[slug]/page.tsx`

#### 5. "WadeCV vs ChatGPT" comparison page (MEDIUM IMPACT)
**Why:** "chatgpt resume" has trend score 62 (stable, high volume). Comparison pages capture decision-stage traffic.

**Files created:**
- `frontend/src/app/(resources)/ai-resume-builder-comparison/page.tsx` — Full comparison with feature table, Article JSON-LD, and CTA

**Files changed:**
- `frontend/src/app/sitemap.ts` — Added `/ai-resume-builder-comparison` to sitemap

#### 6. Fix Stripe referral misattribution (HIGH IMPACT)
**Why:** `checkout.stripe.com` was being classified as "Organic Shopping" in GA4 — 45 sessions from 1 user returning from Stripe checkout. Polluting traffic source data.

**Files changed:**
- `frontend/src/components/analytics/ga-provider.tsx` — When `document.referrer` contains `stripe.com`, `page_referrer` is cleared in the gtag config so GA4 doesn't create a new referral-attributed session

**Note:** The GA4 Admin API does not expose referral exclusion settings. Event edit rules can't filter by referrer value. The gtag.js approach is the correct code-based solution.

#### 7. Build verified
- `next build` passes with no errors

### Not Yet Done (For Future Sessions)
- [x] Create "Best AI Resume Builder 2026" comparison/listicle page → DONE in Session 2
- [x] Add more `relatedSlugs` cross-references within JSON data files → DONE in Session 2 (33 entries updated)
- [ ] Create topic cluster pillar/hub pages that aggregate each category with richer content
- [ ] Monitor GSC for CTR improvement on `/ats/lever` and `/career-change/military-to-project-manager` after reindex (expect 2026-04-08+)
- [ ] Investigate Instagram/social as an acquisition channel (2 sessions, 0% bounce in GA4)
- [ ] Add geo-targeting to any future ad campaigns (top states: Kansas, DC, Louisiana, Maryland, Utah)
- [ ] Add `signup_start` / `signup_success` event instrumentation to registration flow (not showing in GA4)
- [ ] Monitor Teal as rising competitor — consider a "WadeCV vs Teal" dedicated comparison page when GSC shows queries

---

## 2026-04-05 — Session 2: Listicle + relatedSlugs fixes

### Data Pulled
- [x] Fresh GA4 data (same session-day data as Session 1, no new acquisitions)
- [x] Fresh GSC data (8 indexed pages; `/ats/lever` still best at 44 impressions, 0 clicks)
- [x] Fresh Trends data (confirmed "best ai resume builder" +130% rising, Teal trending UP)

### Changes Made

#### 1. "Best AI Resume Builder 2026" listicle page (HIGH IMPACT)
**Why:** "best ai resume builder" is a +130% rising query. "Teal ai resume builder" at +90%. Decision-stage traffic with high conversion intent. The page covers 7 tools (WadeCV, Teal, Jobscan, Kickresume, Novoresume, Wobo AI, ChatGPT) with comparison table, reviews, star ratings, FAQ JSON-LD, and two CTAs.

**Files created:**
- `frontend/src/app/(resources)/best-ai-resume-builder-2026/page.tsx`

**Files changed:**
- `frontend/src/app/sitemap.ts` — Added at priority 0.9

**Waiting for:** Google indexing (expect 3-7 days)

#### 2. relatedSlugs — full coverage (MEDIUM IMPACT)
**Why:** 33 entries across 3 categories had no or partial relatedSlugs, breaking the internal link graph. Cross-links help PageRank flow between related pages.

**Files changed:**
- `frontend/content/seo/companies.json` — 12/13 entries updated (google was already set)
- `frontend/content/seo/career-change.json` — 12/15 entries updated (3 had partial links)
- `frontend/content/seo/ats.json` — All 9 entries now complete

#### 3. Build verified
- `next build` passes with no errors; `/best-ai-resume-builder-2026` renders as static page

### Not Yet Done (For Future Sessions)
- [ ] "WadeCV vs Teal" dedicated comparison page (when GSC shows "wadecv vs teal" or "teal alternative" queries)
- [ ] Topic cluster hub pages for each category (aggregate all entries with richer topical content)
- [ ] Monitor CTR on `/ats/lever` and `/career-change/military-to-project-manager` starting 2026-04-08
- [ ] Check if `/best-ai-resume-builder-2026` appears in GSC by 2026-04-12
- [x] Instrument `signup_start` / `signup_success` GA4 events on registration form → DONE in Session 5

---

## 2026-04-05 — Session 3: AI Bot Discovery Optimization (GEO)

### Changes Made

#### 1. llms.txt + llms-full.txt (HIGH IMPACT for AI discovery)
**Why:** AI chatbots (ChatGPT, Claude, Gemini, Perplexity) are becoming a discovery channel. `llms.txt` is an emerging standard that acts as a curated content guide for AI systems — like a sitemap for LLMs.

**Files created:**
- `frontend/public/llms.txt` — Summary of WadeCV with links to key pages and pointer to llms-full.txt
- `frontend/public/llms-full.txt` — Complete product description, features, pricing, content library, and comparisons. Structured for easy LLM extraction.

**Accessible at:** `wadecv.com/llms.txt` and `wadecv.com/llms-full.txt`

#### 2. Explicit AI crawler allow-rules in robots.ts (MEDIUM IMPACT)
**Why:** Cloudflare and other CDNs have started blocking AI bots by default. Explicitly allowing them future-proofs against this. Named crawlers: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended, Applebot-Extended, cohere-ai.

**Files changed:**
- `frontend/src/app/robots.ts` — Added explicit allow rules for 9 AI crawler user-agents

#### 3. Organization + SoftwareApplication schema on homepage (MEDIUM IMPACT)
**Why:** LLMs weight structured entity data heavily for brand recognition and product citations. The homepage had no JSON-LD.

**Files changed:**
- `frontend/src/app/page.tsx` — Added Organization schema (name, logo, contact, description) and SoftwareApplication schema (features list, pricing, category)

#### 4. Build verified
- `next build` passes with no errors

### Not Yet Done (For Future Sessions)
- [ ] Monitor AI bot traffic in server logs (look for GPTBot, ClaudeBot, PerplexityBot user-agents)
- [x] Add publication dates to Article schema on SEO pages → DONE in Session 5
- [ ] Consider adding author credentials/expert signals to content pages

---

## 2026-04-07 — Session 5: Signup Instrumentation + Resume-Bullets Expansion + Schema Dates

### Data Pulled
- [x] GA4 analytics data → `ga4_data.json`
- [x] GSC data → `gsc_data.json` — 83 impressions (up from 72), 16 pages indexed (up from ~8), 8 unique queries
- [x] Trends data → `trends_data.json` — geo interest: Kansas, Louisiana, Nevada top states for "ai resume builder"

### Key Findings
- Impressions growing: 10-12/day in early April (was 0-1/day in March)
- 16 pages now indexed in GSC (doubled from ~8)
- **Customer service queries clustering:** 3 query variants, 4 impressions on `/skills/customer-service`
- **New pages appearing:** `/resume-bullets/data-analyst`, `/resume-bullets/administrative-assistant`, `/skills/accountant`, `/jobs/recruiter`, `/resume-bullets/achievement-examples`
- "Paid Search" anomaly: 13 bounced sessions from 13 users, no ads running — needs investigation
- `/ats/lever` still 45 impressions, pos 6.9, 0 clicks — meta changes from Session 1 need until Apr 10+ to take effect

### Changes Made

#### 1. Signup GA4 Event Instrumentation (HIGH IMPACT — funnel visibility)
**Why:** Missing for 3 sessions. Zero funnel visibility into registration conversion. Event functions existed in events.ts but were never called.

**Files changed:**
- `frontend/src/app/auth/register/page.tsx` — Added `trackSignupStart`, `trackSignupSuccess`, `trackSignupFailure` for both password and magic link methods

**Expect first data:** 2026-04-08+ in GA4

#### 2. Resume-Bullets Content: +8 entries (26 total, was 18) (HIGH IMPACT)
**Why:** GSC showing resume-bullets pages getting indexed. New entries create complete content clusters with jobs/skills pages from Session 4.

**New slugs:** `accountant`, `business-analyst`, `operations-manager`, `cybersecurity-analyst`, `cloud-engineer`, `social-media-manager`, `supply-chain-analyst`, `content-writer`

**Files changed:**
- `frontend/content/seo/resume-bullets.json`

**Waiting for:** Google indexing (expect 3-7 days, check 2026-04-14+)

#### 3. Article Schema Dates on All SEO Pages (MEDIUM IMPACT)
**Why:** 6 of 7 page templates missing datePublished/dateModified. Jobs had stale "2024-01-01". Freshness signal for Google and AI models.

**Files changed (7 templates):**
- All `[slug]/page.tsx` files under `ats`, `career-change`, `company-resume`, `jobs`, `skills`, `resume-bullets`, `physical-mail`
- All now have `datePublished: "2026-04-01"`, `dateModified: "2026-04-07"`

#### 4. Build verified
- `next build` passes: 156+ static pages, 0 errors

### Not Yet Done (For Future Sessions)
- [ ] Check `/ats/lever` CTR starting 2026-04-10 — did Session 1 meta change work?
- [ ] Check `/best-ai-resume-builder-2026` indexed by 2026-04-12
- [ ] Check `/wadecv-vs-teal` indexed by 2026-04-13
- [ ] Check new resume-bullets pages indexed by 2026-04-14
- [ ] Monitor first `signup_start`/`signup_success` events in GA4 from 2026-04-08
- [ ] Investigate "Paid Search" 13-session anomaly (no ads running)
- [ ] Create topic cluster hub pages (pillar content aggregating each category)
- [ ] Consider "WadeCV vs Jobscan" comparison page
- [ ] Monitor AI bot traffic in server logs
- [ ] Investigate Instagram/social as acquisition channel
- [ ] Add author credentials/expert signals to content pages

---

## 2026-04-06 — Session 4: Teal Comparison + Jobs/Skills Expansion

### Data Pulled
- [x] GA4 analytics data — 18 active users, 66 sessions (+200%/+288% vs prior period)
- [x] GSC data — 72 total impressions; `/ats/lever` still top page at 45 impr, pos 6.9, 0 clicks
- [x] Trends data — Teal trending up; "chatgpt resume" stable at 64

### Key Findings
- `/ats/lever`: 45 impressions, pos 6.9, 0 clicks — meta changes from Session 1 not yet indexed, check 2026-04-10+
- Stripe referral still polluting GA4 (48 sessions) — gtag.js fix deployed 2026-04-05, will clear over time
- True organic traffic: 14 Google sessions in 30 days — still very early
- Product is being used: 62 tailor events, 64 downloads from 1 active user
- `signup_start`/`signup_success` still missing from GA4 — registration form not yet instrumented

### Changes Made

#### 1. "WadeCV vs Teal" Comparison Page (HIGH IMPACT)
**Why:** Teal explicitly trending up in Trends data. Decision-stage traffic, high conversion intent. Queued from Session 2.

**Files created:**
- `frontend/src/app/(resources)/wadecv-vs-teal/page.tsx` — 11-row feature comparison, 5-item FAQ with FAQPage JSON-LD, Article schema, CrossCategoryLinks, CTA

**Files changed:**
- `frontend/src/app/sitemap.ts` — added `/wadecv-vs-teal` at priority 0.8

**Waiting for:** Google indexing (expect 3-7 days, check 2026-04-13+)

#### 2. Jobs Content: +10 entries (32 total, was 22) (HIGH IMPACT)
**Why:** Long-tail job resume queries are high-volume, low-competition. +45% more job page coverage.

**New slugs added:**
`project-manager`, `business-analyst`, `operations-manager`, `cybersecurity-analyst`, `machine-learning-engineer`, `cloud-engineer`, `content-writer`, `social-media-manager`, `supply-chain-analyst`, `product-designer`

#### 3. Skills Content: +8 entries (27 total, was 19) (MEDIUM IMPACT)
**Why:** "Skills for X resume" queries are high intent, low competition. +42% more skills page coverage.

**New slugs added:**
`project-manager`, `business-analyst`, `operations-manager`, `cybersecurity`, `digital-marketing`, `machine-learning`, `cloud-computing`, `python-developer`

#### 4. Build verified
- `next build` passes: 148 static pages, 0 errors

### Not Yet Done (For Future Sessions)
- [x] Instrument `signup_start`/`signup_success` GA4 events on registration form → DONE in Session 5
- [ ] Check `/ats/lever` CTR starting 2026-04-10 — did Session 1 meta change work?
- [ ] Check if `/best-ai-resume-builder-2026` indexed in GSC by 2026-04-12
- [ ] Check if `/wadecv-vs-teal` indexed in GSC by 2026-04-13
- [ ] Create topic cluster hub pages (pillar content aggregating each category)
- [x] Add publication dates to Article schema on SEO pages → DONE in Session 5
- [ ] Investigate "WadeCV vs Jobscan" comparison page (Jobscan is explicit Teal competitor)
- [ ] Monitor AI bot traffic in server logs
