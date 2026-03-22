# PostHog Analytics Optimization — Selaras Waitlist

## Context

Selaras adalah landing page waitlist untuk pasangan Indonesia. PostHog sudah terpasang tapi implementasinya masih minimal — semua tracking code ada di `+page.svelte`, hanya track 4 event dasar (pageview + 3 waitlist events), dan belum ada section visibility tracking, CTA click tracking, atau form interaction tracking. Ini perlu dirapikan supaya bisa bikin funnel analysis yang proper di PostHog dashboard.

**Goal:** Buat analytics module yang clean & modular, dengan event schema yang konsisten, untuk mengukur complete user journey: Landing → Scroll/Read → CTA Click → Form Interaction → Submit → Success/Fail.

---

## Event Taxonomy

Naming convention: `object_action` (lowercase, underscore)

### Custom Events

| Event | Kapan Fired | Properties |
|-------|------------|------------|
| `$pageview` | Page load | `path`, `search`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign` |
| `section_viewed` | Section masuk viewport (50%+, sekali per section) | `section_id` ("masalah"/"cara-kerja"/"topik"/"waitlist"), `section_index` (0-3), `time_since_load_ms` |
| `cta_clicked` | User klik CTA | `cta_id` ("hero_primary"/"hero_secondary"/"header_cta"), `cta_text`, `cta_destination` |
| `form_started` | User focus field pertama kali | `first_field` ("name"/"email"), `time_since_load_ms` |
| `form_field_focused` | User focus name/email field | `field_name` ("name"/"email") |
| `waitlist_submitted` | User klik submit | `source`, `has_name` |
| `waitlist_succeeded` | Server return success | `source`, `has_name` |
| `waitlist_failed` | Validation/server error | `source`, `has_name`, `reason` |

### Super Properties (auto-attached ke semua events via `posthog.register`)

| Property | Source |
|----------|--------|
| `utm_source` | URL query / localStorage |
| `utm_medium` | URL query |
| `utm_campaign` | URL query |
| `referrer` | `document.referrer` |
| `device_type` | viewport width → "mobile"/"tablet"/"desktop" |

### User Properties (set on successful signup via `posthog.identify`)

| Property | Method |
|----------|--------|
| `email` | `$set` |
| `name` | `$set` |
| `signup_source` | `$set_once` |
| `signup_date` | `$set_once` |

---

## File Structure

```
src/lib/analytics/
├── index.ts              — Barrel export (public API)
├── client.ts             — PostHog init, readiness state, capture wrapper
├── events.ts             — Typed event functions (1 per event)
├── properties.ts         — UTM extraction, device type, super property registration
├── types.ts              — TypeScript interfaces for all event properties
└── actions/
    ├── trackSection.ts   — Svelte action: IntersectionObserver section tracking
    ├── trackCta.ts       — Svelte action: CTA click tracking
    └── trackForm.ts      — Svelte action: form field focus/interaction tracking
```

---

## Implementation Steps

### Step 1: Create `src/lib/analytics/types.ts`
- Union types: `SectionId`, `CtaId`, `FailReason`, `DeviceType`
- Interfaces per event: `SectionViewedProps`, `CtaClickedProps`, `FormStartedProps`, `FormFieldFocusedProps`, `WaitlistSubmittedProps`, `WaitlistSucceededProps`, `WaitlistFailedProps`

### Step 2: Create `src/lib/analytics/properties.ts`
- `registerGlobalProperties()` — extract UTM params from URL + localStorage, compute device type, call `posthog.register_once()` / `posthog.register()`
- `getUtmSource(): string` — return current source (replaces manual localStorage logic in +page.svelte)

### Step 3: Create `src/lib/analytics/client.ts`
- `initAnalytics(apiKey, apiHost)` — call `posthog.init()` with config, set `isReady`, call `registerGlobalProperties()`, record `pageLoadTime`
- `capture(eventName, properties)` — guarded wrapper
- `identify(distinctId, userProps, setOnceProps)` — user identification
- `capturePageView()` — fire `$pageview` with path & search
- `getPageLoadTime()` — for `time_since_load_ms` calculations

PostHog config changes:
- Keep: `capture_pageview: false`, `capture_pageleave: true`, `autocapture: true`
- Add: `persistence: 'localStorage+cookie'`
- Remove: `afterNavigate` pageview (dead code — single-page static site)

### Step 4: Create `src/lib/analytics/events.ts`
- `trackSectionViewed(props)`, `trackCtaClicked(props)`, `trackFormStarted(props)`, `trackFormFieldFocused(props)`, `trackWaitlistSubmitted(props)`, `trackWaitlistSucceeded(props)`, `trackWaitlistFailed(props)`
- Each calls `capture()` from client.ts with typed properties

### Step 5: Create Svelte actions in `src/lib/analytics/actions/`

**trackSection.ts:**
- `use:trackSection={{ sectionId, sectionIndex }}`
- IntersectionObserver (threshold 0.5), fires once, auto-disconnects
- Pattern follows existing `src/lib/actions/reveal.ts`

**trackCta.ts:**
- `use:trackCta={{ ctaId }}`
- Click listener, reads textContent + href from element

**trackForm.ts:**
- `use:trackForm` on `<form>` element
- Event delegation on `focusin` — fires `form_started` once, `form_field_focused` once per field

### Step 6: Create `src/lib/analytics/index.ts`
- Barrel export semua public API

### Step 7: Refactor `src/routes/+page.svelte`
- **Remove:** `import posthog`, `import { afterNavigate }`, `isPosthogReady`, `trackEvent()`, PostHog init block, UTM parsing block
- **Add:** imports from `$lib/analytics`
- **Replace:** `trackEvent()` calls → typed event functions
- **Add:** `identify()` call on successful signup
- `onMount` jadi jauh lebih clean

### Step 8: Update components (add `use:` actions)

| Component | Changes |
|-----------|---------|
| `HeroSection.svelte` | Add `use:trackCta={{ ctaId: 'hero_primary' }}` ke CTA button, `use:trackCta={{ ctaId: 'hero_secondary' }}` ke "Lihat Cara Kerja" link |
| `SiteHeader.svelte` | Add `use:trackCta={{ ctaId: 'header_cta' }}` ke "Amankan Akses Awal" button |
| `ProblemSection.svelte` | Add `use:trackSection={{ sectionId: 'masalah', sectionIndex: 0 }}` ke `<section>` |
| `HowItWorks.svelte` | Add `use:trackSection={{ sectionId: 'cara-kerja', sectionIndex: 1 }}` ke `<section>` |
| `TopicsSection.svelte` | Add `use:trackSection={{ sectionId: 'topik', sectionIndex: 2 }}` ke `<section>` |
| `WaitlistSection.svelte` | Add `use:trackSection={{ sectionId: 'waitlist', sectionIndex: 3 }}` ke `<section>`, `use:trackForm` ke `<form>` |

---

## PostHog Funnel Setup (setelah implementasi)

### Primary Funnel: "Waitlist Conversion"
1. `$pageview` → 2. `section_viewed` (waitlist) → 3. `form_started` → 4. `waitlist_submitted` → 5. `waitlist_succeeded`
- Breakdown by: `utm_source`, `device_type`

### Content Engagement Funnel
1. `$pageview` → 2. `section_viewed` (masalah) → 3. `section_viewed` (cara-kerja) → 4. `section_viewed` (topik) → 5. `section_viewed` (waitlist)
- Shows scroll-through rate & where users drop off

### Key Insights
- **CTA effectiveness:** `cta_clicked` breakdown by `cta_id`
- **Form abandonment:** `form_started` vs `waitlist_submitted`
- **Failure reasons:** `waitlist_failed` breakdown by `reason`
- **Source performance:** Primary funnel breakdown by `utm_source`

---

## Verification

1. `bun run build` — pastikan static build berhasil tanpa error
2. `bun run dev` — buka di browser, inspect PostHog events via browser console atau PostHog debug mode (`posthog.debug()`)
3. Cek di PostHog dashboard: Live Events → verify semua events muncul dengan properties yang benar
4. Test funnel: scroll page dari atas ke bawah, cek `section_viewed` events fire in order
5. Test CTA: klik setiap CTA, verify `cta_clicked` events dengan correct `cta_id`
6. Test form: focus fields → submit → verify `form_started`, `waitlist_submitted`, `waitlist_succeeded`/`waitlist_failed`
