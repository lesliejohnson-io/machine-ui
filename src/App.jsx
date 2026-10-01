import React from 'react';
import { STATES, STATE_ORDER } from './states.js';
import { useMachineSim } from './sim/useMachineSim.js';
import { StatusIndicator } from './components/StatusIndicator.jsx';
import { TelemetryCard } from './components/TelemetryCard.jsx';
import './docs/docs.css';

/**
 * The docs site itself. Signature element: UNIT-01, a live simulated
 * machine in the header. Every example below is fed by it — the docs
 * are demonstrated against live, imperfect data, not screenshots.
 */
export default function App() {
  const live = useMachineSim();

  return (
    <div className="docs">
      {/* ---------- Live header: the signature ---------- */}
      <header className="docs__hero">
        <div className="docs__kicker">MACHINE STATE UI · v0.1</div>
        <h1>Components for human–machine trust</h1>
        <p className="docs__lede">
          A component library for communicating machine state to human
          operators — the shared design problem across robotics, drones, and
          industrial systems. Everything below is running against a live
          simulated machine. Watch it misbehave.
        </p>

        <div className="hero-machine" aria-live="polite">
          <div className="hero-machine__id">
            <span className="hero-machine__name">UNIT-01</span>
            <span className="hero-machine__meta">simulated · tick 1.2s</span>
          </div>
          <StatusIndicator state={live.state} size="lg" />
          <div className="hero-machine__vitals">
            <Vital label="TEMP" value={`${live.temperature}°C`} />
            <Vital label="THROUGHPUT" value={`${live.throughput}%`} />
            <Vital label="BATTERY" value={`${live.battery}%`} />
            <Vital
              label="LINK"
              value={live.staleness > 0 ? `stale ${(live.staleness / 1000).toFixed(1)}s` : 'live'}
              dim={live.staleness > 0}
            />
          </div>
        </div>
      </header>

      {/* ---------- The state model ---------- */}
      <section className="docs__section">
        <h2>The state model</h2>
        <p>
          Five states cover the operator's real questions: is it working, is
          it about to stop working, is it working worse, has it stopped, and
          can I even tell? Each state owns a color, a <em>unique shape</em>{' '}
          (no meaning is ever carried by color alone), and an escalation rule
          — a decision about when it may interrupt a human.
        </p>
        <div className="state-table" role="table">
          {STATE_ORDER.map((k) => {
            const s = STATES[k];
            return (
              <div className="state-row" role="row" key={k}>
                <div className="state-row__badge">
                  <StatusIndicator state={k} size="md" />
                </div>
                <div className="state-row__def">{s.definition}</div>
                <div className="state-row__rule">
                  <span className="state-row__esc">{s.escalation}</span>
                  {s.escalationRule}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- StatusIndicator docs: the pattern page ---------- */}
      <section className="docs__section">
        <h2>StatusIndicator</h2>
        <p className="docs__usage">
          The atomic unit of the kit. Use it anywhere a human needs the answer
          to “what state is this machine in?” in under a second. Three sizes
          map to three viewing distances — inline, dashboard, wall display.
          Motion is reserved for <code>FAULT</code> alone, so motion always
          means “act.”
        </p>

        <h3>Live</h3>
        <div className="demo-row">
          <StatusIndicator state={live.state} size="sm" />
          <StatusIndicator state={live.state} size="md" />
          <StatusIndicator state={live.state} size="lg" />
        </div>

        <h3>All states · md</h3>
        <div className="demo-row">
          {STATE_ORDER.map((k) => (
            <StatusIndicator key={k} state={k} size="md" />
          ))}
        </div>

        <h3>Props</h3>
        <div className="props-table">
          <PropRow name="state" type="'OPERATIONAL' | 'WARNING' | 'DEGRADED' | 'FAULT' | 'OFFLINE'" def="'OFFLINE'" desc="Current machine state. Defaults to OFFLINE — the honest default when nothing is known." />
          <PropRow name="size" type="'sm' | 'md' | 'lg'" def="'md'" desc="Viewing distance: inline (~40cm), dashboard (~1m), wall display (3m+)." />
          <PropRow name="showLabel" type="boolean" def="true" desc="Hide the text label. Ignored at lg — at wall distance, the label is mandatory." />
        </div>

        <h3>Usage guidance</h3>
        <ul className="guidance">
          <li>
            Never place two indicators of different sizes in the same visual
            group — size differences read as importance differences.
          </li>
          <li>
            <code>showLabel=false</code> is acceptable only in dense tables
            where the column header already says “Status.”
          </li>
          <li>
            Do not recolor states per brand. The palette is part of the
            operator's learned vocabulary; changing it resets their training.
          </li>
        </ul>
      </section>

      {/* ---------- TelemetryCard docs ---------- */}
      <section className="docs__section">
        <h2>TelemetryCard</h2>
        <p className="docs__usage">
          One metric a human can trust. Its defining feature is honesty about
          data loss: after <code>staleAfterMs</code> of silence (default 2s —
          a per-domain judgment, so it's a prop) the value dims, an age
          counter appears, and the sparkline freezes. After{' '}
          <code>lostAfterMs</code>, staleness escalates from a component
          concern to a system state: <code>SIGNAL LOST</code>, as the machine
          transitions to OFFLINE. A stale value never wears threat colors it
          can no longer vouch for.
        </p>

        <h3>Live — wait for UNIT-01 to drop offline</h3>
        <div className="demo-row">
          <TelemetryCard
            label="TEMP"
            value={live.temperature}
            unit="°C"
            staleness={live.staleness}
            warnAt={68}
            critAt={78}
            lostAfterMs={5000}
          />
          <TelemetryCard
            label="THROUGHPUT"
            value={live.throughput}
            unit="%"
            staleness={live.staleness}
            lostAfterMs={5000}
          />
          <TelemetryCard
            label="BATTERY"
            value={live.battery}
            unit="%"
            staleness={live.staleness}
            lostAfterMs={5000}
          />
        </div>
      </section>

      {/* ---------- Roadmap stubs ---------- */}
      <section className="docs__section docs__section--stub">
        <h2>In progress</h2>
        <p>
          <strong>AlertBanner</strong> ·{' '}
          <strong>StateTimeline</strong> · <strong>FleetGrid</strong> — built
          on the same state model, documented on this page as they land.
        </p>
      </section>

      <footer className="docs__footer">
        Designed and built by Leslie Johnson ·{' '}
        <a href="https://lesliejohnson.io">lesliejohnson.io</a>
      </footer>
    </div>
  );
}

function Vital({ label, value, dim = false }) {
  return (
    <div className={`vital ${dim ? 'vital--dim' : ''}`}>
      <span className="vital__label">{label}</span>
      <span className="vital__value">{value}</span>
    </div>
  );
}

function PropRow({ name, type, def, desc }) {
  return (
    <div className="props-row">
      <code className="props-row__name">{name}</code>
      <code className="props-row__type">{type}</code>
      <code className="props-row__def">{def}</code>
      <span className="props-row__desc">{desc}</span>
    </div>
  );
}
