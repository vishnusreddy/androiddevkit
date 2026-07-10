---
title: Senior interview execution and leadership signals
description: Communicate scope, tradeoffs, incidents, migrations, disagreement, mentoring, and impact with the specificity expected in senior and staff interviews.
level: senior
order: 7
duration: 80 min
quizHref: /tests/
quizLabel: Take a full mock test
---

Senior interviews evaluate how you reduce ambiguity and move a system and team toward a better outcome. Technical knowledge is necessary, but the signal comes from decisions: what you noticed, which constraints mattered, what you changed, how you handled disagreement, and what measurable result followed.

## Learning goals

- Structure project, incident, migration, and conflict stories around decisions.
- Separate personal contribution from team outcome.
- Demonstrate technical depth without drowning the answer in chronology.
- Discuss failures with ownership and evidence.
- Ask senior-level questions that reveal engineering context.

## Build a story bank before the interview

Prepare at least eight stories with little overlap:

1. A difficult technical decision.
2. A production incident.
3. A migration or modernization effort.
4. A performance or reliability improvement.
5. A disagreement with engineering or product.
6. A project with unclear requirements.
7. A mistake or failed approach.
8. Mentoring, delegation, or raising team quality.

For each, record:

- Scale and user impact.
- Team size and your actual role.
- Initial state and constraint.
- Options considered.
- Decision and why.
- How you executed and de-risked it.
- Quantitative or observable result.
- What you would change now.

One strong project can support several questions, but do not force every answer into the same story.

## Use a decision-centered structure

STAR is useful, but senior answers need explicit reasoning:

### Situation

Give only the context needed to understand stakes.

> Our checkout screen had a 2.3 percent duplicate-order support rate on poor networks. The client retried POST after timeout with a new request ID.

### Task

Name your ownership and success condition.

> I owned the Android and API remediation plan. We needed zero duplicate charges while preserving retry and supporting two older app versions.

### Actions and decisions

Spend most time here:

- Evidence gathered.
- Options rejected and why.
- People aligned.
- Rollout and rollback.
- Exact Android and backend mechanisms.

### Result

Use a baseline, final value, time range, and guardrail when available.

> Over six weeks, duplicate-order contacts fell from 2.3 percent to 0.08 percent. Checkout completion stayed within 0.2 percentage points, and p95 confirmation latency improved by 180 ms.

### Learning

Name a real adjustment, not a generic virtue.

> I would add operation identity during initial API design. Client retry policy cannot repair an endpoint that offers no deduplication contract.

## Establish scope without inflating it

Say "I" for your decisions and work. Say "we" for team execution and shared outcomes.

Weak:

> I migrated the whole app and improved performance.

Specific:

> I wrote the migration RFC, built the navigation compatibility layer with one other engineer, and led the first two feature migrations. Six engineers then migrated their owned features using that pattern.

This shows leverage without taking credit for other people's work.

## Technical depth should follow the risk

For a migration story, cover:

- Existing and target architecture.
- Dependency direction and compatibility boundary.
- State and data migration.
- Release sequencing.
- Metrics and rollback.
- Organizational ownership.

For an incident, cover:

- Detection signal.
- User impact and severity.
- Triage and mitigation.
- Root cause and contributing conditions.
- Why existing controls missed it.
- Corrective and preventive actions.

Do not spend five minutes listing classes if the hard problem was rollout coordination.

## Incident answers need a causal chain

Separate trigger, root cause, contributing control gaps, mitigation, and prevention:

![Production incident causal chain and prevention loop](/diagrams/incident-causal-chain.svg)

Avoid blaming the person who deployed the trigger. Ask why the system allowed one change to reach users without containment.

## Migration answers need coexistence

"We rewrote it" is usually a warning sign. Explain how old and new behavior coexisted:

- Strangler boundary around a feature or data source.
- Compatibility adapter.
- Dual-read or dual-write period with reconciliation.
- Feature flag and staged rollout.
- Per-module ownership and migration playbook.
- Removal criteria for the old path.

State the cost. Temporary dual paths increase testing and cognitive load, so keep an owner and deletion date.

## Disagreement without theater

A strong conflict story is about evidence and decision quality, not winning.

1. State the shared goal.
2. Explain the disagreement precisely.
3. Identify reversible vs irreversible parts.
4. Gather evidence proportional to decision cost.
5. Decide using an agreed owner or mechanism.
6. Commit after decision and revisit when evidence changes.

Example:

> Product wanted automatic video prefetch on cellular to improve play start. I was concerned about user data cost and cache pressure. We shipped a 10 percent experiment limited to short clips, with bytes-per-session and play-start p95 as paired metrics. Start improved 90 ms but cellular transfer grew 18 percent, so we kept prefetch on Wi-Fi and tested a smaller first segment on cellular.

The signal is the balanced experiment and outcome, not that engineering blocked product.

## Failure stories need ownership

Choose a real decision you influenced. Explain:

- What you believed and why.
- Which signal you missed.
- When you recognized the problem.
- How you reduced harm.
- Which mechanism changed afterward.

Avoid disguised strengths such as caring too much. Also avoid failures so catastrophic that your role shows reckless judgment with no learning.

## Mentoring is a system, not advice

Useful mentoring stories show changed capability:

- Pair on the first instance, observe the second, delegate the third.
- Turn repeated review comments into an example and checklist.
- Give ownership with clear decision boundaries.
- Ask questions that expose reasoning instead of prescribing every line.
- Measure independence, review latency, defects, or ownership expansion.

Do not describe taking difficult tasks away from junior engineers as mentoring.

## Architecture interview communication

During a technical design:

- State assumptions aloud.
- Name the user-visible guarantee.
- Draw one source of truth and arrows with direction.
- Label sync, process, and server boundaries.
- Deep dive on the highest-risk path.
- Acknowledge alternatives and rejection reasons.
- Summarize tradeoffs before time ends.

If corrected, update the model visibly:

> You're right that the upload may have committed before timeout. I need an operation ID and reconciliation endpoint. I will change the pending state from failed to outcome unknown until that check completes.

That response is stronger than defending an incorrect first design.

## Coding interview behavior for Android roles

Clarify:

- Input size and constraints.
- Thread-safety and cancellation expectations.
- Whether Android types are allowed.
- Error behavior and mutability.

Then:

1. State brute force and complexity.
2. Choose data structures.
3. Write readable Kotlin.
4. Test empty, single, duplicate, boundary, and failure cases.
5. Discuss Android integration separately when relevant.

Avoid clever Kotlin chains that allocate excessively or hide correctness. Interview code should be easy to verify.

## Kotlin details that improve signal

- Use nullability instead of sentinel values when absence is valid.
- Prefer immutable inputs and outputs.
- Use sealed types for exclusive outcomes.
- Name dispatcher and ownership when launching coroutines.
- Avoid `!!` unless the invariant is proved immediately next to it.
- State time and space complexity, including hidden sorting or copying.

## Questions to ask interviewers

Choose questions that help both sides evaluate the role:

- Which mobile decisions does this team own vs inherit from platform teams?
- How are API and Android compatibility changes coordinated?
- What are the current crash, ANR, startup, or build-time priorities?
- How does the team validate releases and roll back risky behavior?
- What distinguishes senior from staff impact here?
- How are architecture decisions recorded and revisited?
- What is one technical decision the team changed its mind about recently?

Avoid asking only questions whose answers are on the public careers page.

## Red flags to remove from answers

1. "We followed clean architecture" without a problem it solved.
2. "It was more scalable" without naming the limiting dimension.
3. "I convinced everyone" without evidence or shared goal.
4. "There were no tradeoffs."
5. Metrics without baseline or time range.
6. Blaming another team for an incident.
7. Claiming team work entirely as personal work.
8. A migration with no compatibility or rollback plan.
9. A failure with no changed mechanism.

## A one-page preparation sheet

For each story, keep:

```text
Title:
Prompt types:
Scale and stakes:
My ownership:
Hard constraint:
Options:
Decision:
Technical mechanism:
Rollout and rollback:
Result and guardrails:
What I learned:
Two likely follow-ups:
```

Practice in two lengths: a 90-second version and a five-minute version with technical follow-ups.

## Mock interview rubric

Score 1 to 4 on:

- Scope and requirements.
- Technical correctness.
- Ownership clarity.
- Alternatives and tradeoffs.
- Failure and rollout thinking.
- Evidence and metrics.
- Communication structure.
- Reflection.

Any answer scoring below 3 on correctness or ownership needs another story or deeper preparation.

## Practice checklist

1. Write eight distinct stories using the one-page sheet.
2. Record one incident answer and remove unnecessary chronology.
3. Add an old/new coexistence plan to every migration story.
4. Replace vague metrics with baseline, result, time range, and guardrail.
5. Run one architecture answer with a deliberate mid-answer requirement change.
6. Practice admitting and repairing one incorrect assumption without losing structure.

## What you should be able to explain

- Your exact role, decision, mechanism, and impact in major projects.
- Incidents as causal systems, not individual mistakes.
- Migrations with compatibility, rollout, and deletion plans.
- Disagreement through evidence and decision ownership.
- How you raise team capability beyond your own code.

You have completed the guided curriculum. Return to the question bank and mock tests now, but use them differently: every missed answer should point back to a mechanism, boundary, or failure condition you can explain precisely.
