# Machine State UI

A component library that shows people what a machine is doing, at a glance and under pressure. Robots, drones, and industrial systems all share this problem: an operator has seconds to read a machine's state and decide whether to act.

**Live docs and demo:** [machine-ui.vercel.app](#)
**Design rationale:** [DESIGN_SPEC.md](DESIGN_SPEC.md)

## What it is

Five states: **Operational, Warning, Degraded, Fault, and Offline.** Each one has a definition, a shape, a color, and an escalation rule that decides when the machine is allowed to interrupt a person. Every component uses the same model, so no screen invents its own.

The docs run against a simulated machine, UNIT-01, that drifts, degrades, faults, and drops offline. You see every component in the messy conditions it was built for, not just the happy path.

## Design principles

1. **Readable from a distance.** Three sizes for three viewing distances: on the machine, across the room, and on a dashboard.
2. **Never color alone.** Every state pairs a shape and a label with its color, so it stays readable for colorblind users.
3. **Motion means act.** Only Fault animates.
4. **Alarm fatigue is a design input.** Escalation rules live in the state model, not in individual screens.
5. **Honest about lost data.** Every component has a designed state for when its data goes stale.

The full reasoning is in [DESIGN_SPEC.md](DESIGN_SPEC.md).

## Run it

    npm install
    npm run dev

## Stack

React 18 and Vite. Plain CSS with design tokens and no component framework, so every visual choice is documented in the spec.
