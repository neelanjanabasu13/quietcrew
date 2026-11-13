# Quietcrew

The work gets done in the background.

Quietcrew is a UK firm that builds simple AI tools that help agencies and local businesses win more work. We also provide 1:1 custom audits and bespoke fixes depending on user needs.


- **Primary website:** [quietcrew.ai](https://quietcrew.ai)
- **Support and enquiries:** hello@quietcrew.ai
- **Company registration:** QUIETCREW LTD (Company number 17444773, registered in England and Wales)

---

## Core Products

### 1. Goldmine by Quietcrew (`/goldmine`)
Prospect discovery and artificial intelligence recommendation audits for SEO and digital marketing agencies.

- **Target audience:** Marketing, search, and digital agencies prospecting local business clients.
- **What it does:** Scans local businesses across chosen localities and trade categories, inspecting real recommendation evidence across Google Gemini, OpenAI, and Anthropic Claude.
- **Output:** Identifies businesses with strong local reputation but weak artificial intelligence visibility, providing structured evidence and ready-to-use outreach drafts.
- **Pricing:** Free two-business preview, £49 per full unlocked scan.

### 2. Outshine by Quietcrew (`/outshine`)
Google Business Profile audits and Done-for-You Fix Packs for UK service and trade businesses.

- **Target audience:** UK local service businesses, trades, and independent firms looking to protect and improve local search visibility.
- **Free Scan:** Inspects ten public signals including profile completeness, business category accuracy, map pinning, website connection, opening hours, and review foundations.
- **Done-for-You Fix Pack (£9.99):** Provides copy-paste review request templates, pre-written business descriptions, photo checklists, click-by-click standard operating procedures, and one same-business verification scan.
- **Scan allowance:** One free guest scan, three free scans total for signed-in accounts, and £2.99 per additional pay-as-you-go scan.

---

## Advisory and Hands-On Services

For businesses that require personal guidance on their internal systems, Quietcrew offers targeted advisory sessions:

- **Workflow Audit (£99):** A structured review of one repetitive operational process, mapping people, tools, handoffs, and estimated annual cost, with an honest recommendation on the simplest fix.
- **1:1 Consultation (£100 per hour):** Direct consultation covering tool selection, integration planning, or automation architecture.
- **Lightweight Builds:** Scoped implementation for automation setups and no-code tool configuration, available on request via hello@quietcrew.ai.

---

## Technology Stack

- **Framework:** TanStack Start v1 (Full-stack React 19 framework with server functions and SSR/SSG support)
- **Build tool:** Vite 7
- **Styling:** Tailwind CSS v4 using semantic design tokens defined in `src/styles.css`
- **Typography:** Plus Jakarta Sans
- **Backend & Database:** Lovable Cloud (database, authentication, durable scan reservations, and owner-scoped purchase snapshots)
- **Payments:** Stripe embedded checkout with server-verified webhooks and session validation
- **Third-Party APIs:** Google Places API (server-side, cached, and field-masked for cost safety)
- **Testing:** Vitest for unit and integration test suites, with Playwright for browser validation

---

## Local Development

### Prerequisites

- Node.js (version 20 or later recommended)
- npm or bun

### Setup

```sh
# Clone the repository
git clone https://github.com/neelanjanabasu13/quietcrew.git
cd quietcrew

# Install dependencies
npm install

# Start the local development server
npm run dev
```

The application will be available at `http://localhost:8080`.

### Running Tests

```bash
# Run the test suite
npm test

# Run tests in watch mode
npm run test:watch
```

---

## Contributing and Deployment

This repository is synced with Lovable. Commits pushed to the `main` branch automatically sync into the Lovable workspace and rebuild the preview environment.
