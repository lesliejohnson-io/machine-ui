# Machine State UI

**A component library for communicating machine state to human operators** —
the shared design problem across robotics, drones, and industrial systems.

🔗 Live docs & demo: *(Vercel URL after deploy)*
📐 Design rationale: [DESIGN_SPEC.md](./DESIGN_SPEC.md)

## What this is

Five machine states (OPERATIONAL, WARNING, DEGRADED, FAULT, OFFLINE), each
with a definition, a unique shape, a color, and an **escalation rule** —
an explicit decision about when a machine may interrupt a human. Components
inherit the model; screens never improvise it.

The docs site runs against a live simulated machine (UNIT-01) that drifts,
degrades, faults, and drops offline — so every component is demonstrated
under the imperfect conditions it was designed for.

## Design principles (short version)

1. **Glanceable at distance** — three sizes for three viewing distances
2. **Never color alone** — shape + label always; colorblind-safe by construction
3. **Motion means act** — only FAULT animates
4. **Alarm fatigue is a design input** — escalation rules live in the state model
5. **Honest about data loss** — every component has a designed stale state

Full rationale in [DESIGN_SPEC.md](./DESIGN_SPEC.md).

## Run it

```bash
npm install
npm run dev
```

## Stack

React 18 + Vite. Plain CSS with design tokens. No component framework —
every pixel is a documented decision.

## Author

Leslie Johnson — senior AI product designer, Pittsburgh PA
[lesliejohnson.io](https://lesliejohnson.io)
