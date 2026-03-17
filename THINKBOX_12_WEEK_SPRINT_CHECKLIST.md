# ThinkBox 12-Week Sprint Checklist

**Window:** March 9, 2026 → May 31, 2026  
**Cadence:** Weekly sprints (Mon–Sun)  
**Objective:** Execute the 3-month roadmap with measurable weekly outcomes.

---

## Weekly Sprint Board (Overview)

| Week | Dates | Focus | Must-Ship Outcome | KPI Checkpoint | Status |
|---|---|---|---|---|---|
| W01 | Mar 9–Mar 15 | Baseline + planning | Baseline metrics + prioritized bug/security backlog | Baseline set for sync success, crash-free sessions, activation funnel | ⬜ |
| W02 | Mar 16–Mar 22 | Security hardening | Progress API auth + payload validation + endpoint rate-limit review | Unauthorized progress writes blocked in testing | ⬜ |
| W03 | Mar 23–Mar 29 | Reliability + UX hardening | Improved error/empty states for article fetch + cloud sync fallback behavior | Support tickets on loading/sync issues trending down | ⬜ |
| W04 | Mar 30–Apr 5 | Stabilization release | March reliability release + bug burn-down report | Crash-free sessions ≥ 99.5%; sync success ≥ 98% | ⬜ |
| W05 | Apr 6–Apr 12 | Engagement design | Daily Challenge spec + event tracking + XP/achievement rules finalized | Instrumentation validates challenge entry/completion events | ⬜ |
| W06 | Apr 13–Apr 19 | Daily Challenge build | Daily Challenge shipped in app + profile indicators | Challenge completion rate baseline captured | ⬜ |
| W07 | Apr 20–Apr 26 | Reading loop depth | Continue Reading + smarter recommendations + quiz consistency improvements | Articles/user/week up vs March average | ⬜ |
| W08 | Apr 27–May 3 | Offline expansion + release | Offline content/image pack expansion + April release notes | Quiz completion rate among readers ≥ 40% (or baseline trend up) | ⬜ |
| W09 | May 4–May 10 | Pilot operations | Admin flow improvements for approvals/user lifecycle + pilot report draft | Median approval SLA remains ≤ 24h | ⬜ |
| W10 | May 11–May 17 | Onboarding activation | Starter journeys + first-week onboarding checklist/email flow | First-week activation baseline (read ≥3 articles) captured | ⬜ |
| W11 | May 18–May 24 | Launch readiness QA | End-to-end QA pass + incident/runbook + go/no-go checklist draft | Critical pre-launch issues all triaged/owned | ⬜ |
| W12 | May 25–May 31 | Pilot release prep | Final launch readiness sign-off + pilot communication pack | 7-day retention trend up vs Month 1 baseline | ⬜ |

---

## Week-by-Week Execution Checklist

## W01 (Mar 9–Mar 15) — Baseline + Planning
- [ ] Confirm KPI definitions and data sources (activation, retention, sync success, crash-free sessions).
- [ ] Build prioritized backlog from current issues (P0/P1/P2).
- [ ] Freeze sprint scope for W02–W04 with owners and acceptance criteria.

**Definition of done:** Baseline dashboard/report exists and March stabilization scope is approved.

## W02 (Mar 16–Mar 22) — Security Hardening
- [ ] Enforce secure identity checks for progress read/write paths.
- [ ] Add stricter schema validation for feedback and progress payloads.
- [ ] Review/adjust rate limits for ThinkBox-critical endpoints.

**Definition of done:** Security hardening merged, tested, and documented.

## W03 (Mar 23–Mar 29) — Reliability + UX Hardening
- [ ] Improve loading/error states in article and sync flows.
- [ ] Patch top reliability issues from beta feedback.
- [ ] Add retry/fallback visibility where failures occur.

**Definition of done:** Top recurring reliability issues resolved and verified.

## W04 (Mar 30–Apr 5) — Stabilization Release
- [ ] Ship March stabilization release.
- [ ] Run regression checks on auth, sync, article load, and profile progression.
- [ ] Publish month-end reliability report with KPI movement.

**Definition of done:** March targets reached or gap plan created with owners.

## W05 (Apr 6–Apr 12) — Engagement Design
- [ ] Finalize Daily Challenge mechanics (eligibility, XP, achievement ties).
- [ ] Define event taxonomy for challenge + recommendation interactions.
- [ ] Design UI touchpoints for challenge and progression visibility.

**Definition of done:** Build-ready spec with no open blockers.

## W06 (Apr 13–Apr 19) — Daily Challenge Build
- [ ] Implement and release Daily Challenge MVP.
- [ ] Wire profile/home indicators for challenge progress.
- [ ] Validate analytics pipeline for challenge events.

**Definition of done:** Daily Challenge is live and measurable.

## W07 (Apr 20–Apr 26) — Reading Loop Depth
- [ ] Ship Continue Reading surface from history.
- [ ] Improve related/recommended topics logic.
- [ ] Raise quiz consistency and completion prompts.

**Definition of done:** Engagement loop improvements released with early KPI readout.

## W08 (Apr 27–May 3) — Offline Expansion + Release
- [ ] Expand offline topics/images for highest-demand categories.
- [ ] Run content QA pass on refreshed offline pack.
- [ ] Publish April release notes and KPI review.

**Definition of done:** Offline pack update is complete and regression-tested.

## W09 (May 4–May 10) — Pilot Operations
- [ ] Improve admin processing flow for approvals and user state handling.
- [ ] Define pilot reporting format (engagement, retention, support trends).
- [ ] Set weekly operational review cadence.

**Definition of done:** Pilot operations workflow runs end-to-end without manual bottlenecks.

## W10 (May 11–May 17) — Onboarding Activation
- [ ] Launch starter learning journeys (e.g., Space, History, Science).
- [ ] Ship first-week onboarding checklist/email nudges.
- [ ] Validate first-session to first-3-articles activation path.

**Definition of done:** New-user onboarding sequence is live and tracked.

## W11 (May 18–May 24) — Launch Readiness QA
- [ ] Execute full QA suite (auth, onboarding, sync, article generation, offline behavior).
- [ ] Complete incident response runbook + rollback plan.
- [ ] Close/assign all launch-critical defects.

**Definition of done:** Go/no-go checklist is complete with owners and due dates.

## W12 (May 25–May 31) — Pilot Release Prep
- [ ] Finalize launch readiness sign-off.
- [ ] Prepare pilot communication pack (internal + partner-facing).
- [ ] Publish 90-day summary with KPI outcomes and next-quarter bets.

**Definition of done:** Pilot-ready release approved and rollout plan scheduled.

---

## GitHub Projects Tracking Template

Use one item per deliverable/task with these custom fields:

- **Title**: `[W##][Pillar] Short task name`
- **Sprint Week**: `W01 ... W12`
- **Pillar**: `Stability`, `Engagement`, `Pilot Scale`
- **Owner**: person responsible
- **Priority**: `P0`, `P1`, `P2`
- **Status**: `Backlog`, `In Progress`, `In Review`, `Done`, `Blocked`
- **Due Date**: target completion date
- **KPI Impact**: `Crash-free`, `Sync success`, `Activation`, `Retention`, `WAU/MAU`
- **Acceptance Criteria**: concise definition of done

Recommended views:
- **This Week (Board):** grouped by `Status`, filtered by current `Sprint Week`
- **Roadmap (Table):** sorted by `Sprint Week` then `Priority`
- **Risk View:** filtered where `Status = Blocked` or `Priority = P0`

---

## Notion Tracking Template

Create a Notion database with these properties:

- **Task** (Title)
- **Week** (Select: W01...W12)
- **Pillar** (Select: Stability, Engagement, Pilot Scale)
- **Owner** (Person)
- **Status** (Status)
- **Priority** (Select)
- **KPI Impact** (Multi-select)
- **Due Date** (Date)
- **Done Criteria** (Text)

Recommended Notion views:
- **Weekly Sprint Board** (Board by Status, filter Week = current)
- **90-Day Timeline** (Timeline by Due Date)
- **KPI Impact List** (Group by KPI Impact)

---

## Monthly KPI Targets (Quick Reference)

- **End of March:** crash-free sessions ≥ 99.5%, sync success ≥ 98%, approval SLA median ≤ 24h
- **End of April:** WAU/MAU ≥ 35%, articles per active user/week +25% vs March, quiz completion ≥ 40%
- **End of May:** 7-day retention +20% vs March baseline, first-week activation (≥3 reads) ≥ 60%, critical issue escape rate < 2/month
