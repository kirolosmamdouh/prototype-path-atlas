# UpCreator 2.0 — phased marketplace upgrade

## Goal
Upgrade the existing prototype into a complete Egypt-first UGC marketplace, ready for later MENA expansion. Brands, agencies, and creators discover, negotiate, collaborate, deliver content, and manage transactions inside UpCreator.

Preserve Arabic/English switching, Cairo for Arabic, right-to-left layouts, existing campaign and profile flows, and the UpCreator name. Adopt the new premium editorial direction: deep purple, soft lavender, white/off-white, elegant borders, immersive photography, and video-first portfolios. Badgey and Youdji are inspiration, not interfaces to copy.

## What exists today
The app already has role-specific homes, local demo sign-in, campaigns and applications, profile editing/preview, badges, rule-based matching, and Arabic support. Data lives only in the current browser. Messaging is a read-only demo list; billing and earnings are placeholders. These are not yet secure shared marketplace features.

## Delivery approach
Deliver one phase at a time, with a usable preview and acceptance checks before starting the next. Approval of this plan starts **Phase 1**, not all phases simultaneously. No live charging or payouts will be enabled without separate confirmation.

Reference research supports focused phone/video storytelling and scannable creator details followed by clear collaboration stages. The current references’ live rendering and interactions were not visually verified; their layouts will not be copied.

### Phase 1 — real accounts and shared workspaces
- Enable Lovable Cloud for real user accounts, shared records, and uploaded files.
- Replace demo password storage with secure sign-in, account recovery, and session handling; do not import plaintext demo passwords.
- Add separate brand/agency and creator registration and onboarding, with role-appropriate home pages and settings.
- Introduce agency workspaces, multiple client brands, and workspace switching with enforced membership access.
- Move profiles, campaigns, applications, notifications, and saved items to durable shared storage while keeping the current screens usable.
- Retain sample data only in a clearly separated demonstration context, never mixed into real account history.

**Acceptance:** two real accounts can sign in independently, updates persist across browsers, and each account sees only records it is permitted to access.

### Phase 2 — premium public website and discovery
- Redesign the public website with the supplied headline, supporting copy, “Find Creators” and “Become a Creator” actions.
- Include immersive video, featured creators, discovery preview, featured campaigns, how it works, brand/creator benefits, AI matching, testimonials, and final CTA.
- Give distinct public content areas their own shareable pages while retaining in-page previews on the homepage.
- Make creator cards and discovery actions open real marketplace profiles rather than decorative registration links.
- Use owned/licensed creator media where available; clearly distinguish generated/demo media and avoid invented customer claims.

**Acceptance:** visitors can browse real published profiles, play portfolio previews, and enter the correct onboarding flow on desktop/mobile in both languages.

### Phase 3 — advanced creator marketplace, profiles, and packages
- Expand creator profiles with cover/photo, biography, country/city, languages, social accounts, categories, equipment, capabilities, availability, services, portfolio images/videos, collaboration history, completed orders, and genuine reviews.
- Add the requested search filters: location, gender, age range, languages, niche, platforms, follower range, engagement, creator type, equipment, production capabilities, individual/family/couple/baby/child shooting, price, availability, verification, and ratings.
- Preserve existing name, badge, score, rate, and follower sorting behavior where relevant.
- Add shortlist/collections, saved searches, profile sharing, message, and campaign invitation actions.
- Let creators publish configurable content packages with deliverables, duration, editing, revisions, price, deadline, and usage rights.
- Keep existing badges testable; distinguish verified evidence and actual completed work from demo achievements. Collect sensitive personal data only when necessary, with publication controls and safeguards for content involving minors.

**Acceptance:** a creator publishes a profile and package; a brand filters for it, watches its content, saves it, and sends an invitation.

### Phase 4 — campaigns, conversations, and custom offers
- Complete campaign draft editing, publishing, applications, invitations, selection, closing, and archive workflows.
- Build real-time conversations with message composition, attachments/images/links, read status, and notifications.
- Support project briefs, references, budget/deadline negotiation, deliverables, revisions, usage rights, custom offers, and accept/decline actions inside conversations.
- Convert an accepted package or custom offer into an order with a preserved snapshot of the agreed terms.

**Acceptance:** a brand posts a campaign, a creator applies, both negotiate in a private conversation, and acceptance creates the same order in both workspaces.

### Phase 5 — orders, delivery, and workspace dashboards
- Introduce order stages for agreed work, production, submitted delivery, requested revisions, approval, completion, and cancellation; funding requirements follow the payment model confirmed in Phase 6.
- Add private delivery uploads, version history, deadlines, revision requests, approval, and downloadable final assets.
- Record accepted contract/usage-rights terms; integrate legally appropriate e-signing only after requirements and service eligibility are confirmed.
- Complete brand metrics: active campaigns, collaborations, pending applications, unread messages, awaiting approvals, spending, transactions, recommendations, and available performance data.
- Complete creator workspace: opportunities, invitations, offers, packages, active orders, deadlines, submitted work, earnings, profile, and settings.
- Make availability settings real; do not represent paid boosting as active until a genuine promotion policy exists.

**Acceptance:** an agreed order moves through delivery, revision, and approval; both participants see the same history and accurate dashboard totals.

### Phase 6 — payments, earnings, and trust
- Verify payment and marketplace-payout eligibility for the business’s registered country and Egypt/MENA creators before selecting or promising a provider.
- Confirm commission, currency, payment timing, cancellation/refund policy, payout schedule, tax obligations, and dispute handling before encoding those rules.
- Add test checkout, payment confirmation, receipts, transaction history, earnings, and provider-supported payout onboarding.
- Keep checkout, creator payouts, and any held-funds/escrow model separate: ordinary checkout support does not establish payout or escrow capability.
- Add reviews after completed orders, reporting, verification review, moderation, and dispute records.

**Acceptance:** test payments and supported payout flows reconcile with order history; failed/duplicate payment events do not duplicate orders or earnings. Live activation requires business verification and your confirmation.

### Phase 7 — conversational AI, video discovery, and launch checks
- Upgrade rule-based matching with conversational search that converts a request into editable structured filters, applies them to real profiles, and explains matches using actual profile evidence.
- Add creator comparison, saved AI searches, and collections; never invent creators or unsupported qualifications to satisfy a requested count.
- Build a dedicated video discovery view filtering published portfolio content by keywords, niche, format, industry, language, location, visual style, and product category, with save/contact/profile actions.
- Start video search with creator-provided metadata; automatic video understanding/indexing is a separately validated enhancement, not an implied capability.
- Validate performance, accessibility, media loading, privacy, security, Arabic/RTL, and mobile layouts; add operational monitoring and release checks.

**Acceptance:** a natural-language request produces inspectable filters and evidence-based recommendations; brands discover creators through published videos; the full collaboration flow passes end-to-end tests.

## Technical approach
- Retain TanStack Start/React/TypeScript and the existing shared localization/design components.
- Replace the local demo store behind a shared data-access layer rather than rebuilding every screen independently.
- Use Lovable Cloud for durable records, authenticated access, private collaboration files, and real-time updates; enforce ownership and workspace membership on the server and through row-level access controls.
- Keep business rules for matching, badges, pricing, permissions, and order transitions in focused testable modules.
- Use authenticated server functions for internal actions and verified server callbacks for external services; keep credentials and privileged operations out of browser code.
- Preserve existing public URLs when reorganizing guarded screens. Every new content page gets its own meaningful title, description, and sharing metadata.
- Test each new business rule and cross-account authorization; verify each phase’s primary flow with real persisted records, not only demo state.

## Inputs and limits
- The uploaded brief ends at **“Standard Package: 2”**. Remaining package specifications are unknown; do not invent fixed tiers or pricing.
- Contracts, detailed order rules, payments, and payouts are requested in the product vision, but their policies are not specified in the available file. The phases above propose workflows, not final legal or financial rules.
- Actual creator media, testimonials, performance data, and verification evidence must come from real records or approved assets.
- Lovable Cloud/AI usage and payment-provider services may incur costs. Provider eligibility, live payments, payout support, and legally compliant contracting remain to be verified when those phases begin.