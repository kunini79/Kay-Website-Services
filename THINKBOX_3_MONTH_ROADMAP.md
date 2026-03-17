# ThinkBox 3-Month Roadmap

**Timeline:** March–May 2026  
**Product Stage:** V1 Beta → Pilot-ready release

## North Star (90 Days)

Move ThinkBox from early beta into a stable, measurable, and scalable pilot product for schools, parents, and independent learners aged 6–14.

## Current Baseline (as of March 2026)

- Beta access funnel exists (`/products/thinkbox`) with demo request + admin approval flow.
- Core learner app exists (`/system`) with article exploration, backpack, XP/levels, streaks, profile, and achievements.
- Cloud progress sync exists (Mongo-backed user progress endpoint).
- Feedback channel exists (`/api/feedback`) and offline content infrastructure is in place (`public/offline`, topic/image scripts).

---

## Month 1 (March): Stabilize Core Experience

### Goal
Improve reliability, trust, and operational visibility so the existing beta performs consistently.

### Key Initiatives
1. **Platform hardening**
   - Lock down progress updates to authenticated user identity (avoid trusting only client-supplied IDs).
   - Add stricter validation on feedback/progress payloads.
   - Review and tighten rate limits for ThinkBox-specific endpoints.

2. **Quality & bug reduction**
   - Triage top learner-facing issues in `/system` (loading, article fetch fallbacks, state restore edge cases).
   - Improve empty/error states for article generation and cloud sync failures.

3. **Instrumentation & operations**
   - Define event tracking for activation funnel:
     - Demo request submitted
     - Demo approved
     - First login
     - First article read
     - Day-2 retention
   - Set weekly review of feedback inbox and support SLA.

### End-of-Month Deliverables
- Secure progress persistence path with validation + auth checks.
- Bug backlog reduced and top recurring issues closed.
- Basic product dashboard (even if manual/CSV-backed) with activation metrics.

### Success Metrics
- Crash-free sessions: **≥ 99.5%**
- Progress sync success rate: **≥ 98%**
- Demo request to approval SLA: **≤ 24 hours** (median)

---

## Month 2 (April): Deepen Learning Engagement

### Goal
Increase repeated usage and learning depth with stronger motivation loops.

### Key Initiatives
1. **Learning loop upgrades**
   - Launch **Topic of the Day / Daily Challenge** tied to XP and achievements.
   - Improve quiz consistency per article (coverage + quality checks).
   - Add “continue reading” and smarter recommendations from history/backpack.

2. **Personalization & accessibility**
   - Expand profile progression UX (clear next milestone, unlock previews, progress nudges).
   - Refine reading settings (font size, dyslexic mode, readability defaults).

3. **Offline value expansion**
   - Grow offline topic/image coverage by priority categories.
   - Standardize content refresh cadence (monthly offline pack update process).

### End-of-Month Deliverables
- Daily Challenge shipped and measured.
- Improved recommendations and progression cues in profile/home.
- Offline content pack expanded with documented refresh routine.

### Success Metrics
- Weekly active users / monthly active users (WAU/MAU): **≥ 35%**
- Average articles read per active user per week: **+25%** vs Month 1
- Quiz completion rate among article readers: **≥ 40%**

---

## Month 3 (May): Pilot Scale & Launch Readiness

### Goal
Prepare ThinkBox for broader pilot rollout with stronger admin workflows and launch confidence.

### Key Initiatives
1. **Pilot operations**
   - Improve admin tools for demo approvals and user lifecycle management.
   - Add pilot reporting pack (engagement, retention, top categories, support trends).

2. **Content & growth readiness**
   - Publish a curated “starter journeys” set (e.g., space, history, science tracks).
   - Create onboarding emails/in-app checklist to improve first-week activation.

3. **Release readiness**
   - Run full QA pass (auth, onboarding, sync, article generation, offline behavior).
   - Prepare go/no-go checklist and incident playbook for pilot expansion.

### End-of-Month Deliverables
- Pilot-ready admin and reporting workflow.
- Starter learning journeys + onboarding sequence live.
- Launch readiness checklist completed with named owners.

### Success Metrics
- 7-day retention: **+20%** vs Month 1 baseline
- First-week activation (read ≥3 articles): **≥ 60%** of new users
- Critical issue escape rate after release: **< 2 per month**

---

## Execution Cadence (Recommended)

- **Week 1:** Scope + design + technical breakdown
- **Week 2–3:** Build + internal QA + telemetry checks
- **Week 4:** Beta release + feedback review + KPI checkpoint

## Ownership Structure (Lean)

- **Product/Founder:** Prioritization, KPI review, pilot partnerships
- **Engineering:** Feature delivery, reliability, performance, security
- **Content/Ops:** Topic curation, feedback triage, communication cadence

## Top Risks & Mitigations

1. **AI/content inconsistency**
   - Mitigation: stronger fallbacks, content QA checklist, quality scoring.

2. **Early user churn after first login**
   - Mitigation: daily challenge, guided starter journeys, better first-session onboarding.

3. **Operational bottlenecks (manual approvals/support)**
   - Mitigation: admin workflow improvements + weekly support triage rhythm.
