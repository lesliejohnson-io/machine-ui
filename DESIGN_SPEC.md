# Machine State UI — Design Specification

*A component library for communicating machine state to human operators.*
*Designed by Leslie Johnson · lesliejohnson.io*

---

## Why this exists

Robots, drones, and industrial systems generate continuous machine state
that a human must trust and act on instantly. The design problem is not
displaying data — it is **compressing complex system state into instant
legibility** without training operators to ignore it.

<!-- TODO Leslie: 2–3 sentences in your voice. This is the "clarity under
pressure" thesis applied to physical AI. Connect to your body of work. -->

## The state model

Five states answer the operator's five real questions:

| State | The operator's question | Shape | Escalation |
|---|---|---|---|
| OPERATIONAL | Is it working? | ● circle | ambient — never alerts |
| WARNING | Is it about to stop working? | ▲ triangle | notify — card/summary only |
| DEGRADED | Is it working worse? | ◆ diamond | notify — card, not banner |
| FAULT | Has it stopped? | ■ square | interrupt — always banners |
| OFFLINE | Can I even tell? | ⊘ slashed ring | notify — uncertainty ≠ failure |

**Rules of the model:**

1. States are exhaustive and mutually exclusive. A machine is always in
   exactly one.
2. OFFLINE means *unknown*, not *broken*. Conflating them destroys operator
   trust in both.
3. Escalation is a property of the state, not the component. Components
   inherit it; screens never override it ad hoc.

<!-- TODO Leslie: add your escalation transition rules — e.g. does
WARNING → FAULT skip DEGRADED? What debounce prevents state flapping? -->

## Design principles

### 1. Glanceable at distance
Three sizes map to three viewing distances: inline (~40 cm), dashboard
(~1 m), wall display (3 m+). At wall distance, labels are mandatory.

### 2. Never color alone
Every state owns a unique shape and a text label. The kit is
colorblind-safe by construction, not by an accessibility pass at the end.

### 3. Motion means act
Exactly one thing animates: FAULT. Because motion is reserved, motion is
information. An interface where everything pulses is an interface where
nothing does.

### 4. Alarm fatigue is a design input
The escalation column exists because the most common failure of operator
interfaces is not missing information — it is alerting so often that
operators learn to dismiss without reading. Silence is the reward for a
healthy system.

### 5. Honest about data loss
Every component has a designed stale-data state. When telemetry stops,
the interface says so and shows the age of the last reading. Pretending
the last value is current is the most dangerous lie a dashboard can tell.

<!-- TODO Leslie: add a 6th principle if one emerges from building —
principles discovered in the work are the most credible kind. -->

## Components

| Component | Status | One-line purpose |
|---|---|---|
| StatusIndicator | ✅ built | Current state, readable in <1 second, at three distances |
| TelemetryCard | ☐ | One metric: value, trend, thresholds, stale state |
| AlertBanner | ☐ | Interrupt-level events; acknowledge/dismiss semantics |
| StateTimeline | ☐ | State history as a horizontal strip — "what happened while I was away?" |
| FleetGrid | ☐ | Many machines at a glance; the wall-display composition |

## Out of scope (v0.1)

Theming/brand overrides of state colors (deliberately unsupported — see
principle: the palette is the operator's learned vocabulary). Sound.
Multi-operator acknowledgement workflows.

---

*Built with React + Vite. No component framework — every pixel here is a
decision, and the decisions are documented above.*
