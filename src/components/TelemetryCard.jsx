import React, { useRef } from 'react';
import './TelemetryCard.css';

/**
 * TelemetryCard
 *
 * One metric a human can trust: value, trend, thresholds — and an honest
 * answer when the data stops arriving.
 *
 * Stale-data model (design decisions by Leslie Johnson):
 *   Tier 0  live      — fresh value, sparkline appending
 *   Tier 1  stale     — after `staleAfterMs` of silence: value dims,
 *                       "last reading Xs ago" counts up, sparkline
 *                       freezes and dims. Threshold is a prop because
 *                       staleness is a per-domain judgment (a drone is
 *                       stale at 2s; a warehouse scanner might be 10s).
 *   Tier 2  SIGNAL LOST — staleness escalates from a component concern
 *                       to a system state: the machine transitions to
 *                       OFFLINE and this card shows SIGNAL LOST at the
 *                       moment of handoff (`lostAfterMs`).
 *
 * Props:
 *   label        e.g. "TEMP"
 *   value        current number (last known value while stale)
 *   unit         e.g. "°C"
 *   staleness    ms since last reading (0 = live) — from telemetry source
 *   staleAfterMs tier-1 threshold (default 2000)
 *   lostAfterMs  tier-2 threshold (default 8000)
 *   warnAt / critAt   optional thresholds that color the live value
 */
export function TelemetryCard({
  label,
  value,
  unit = '',
  staleness = 0,
  staleAfterMs = 2000,
  lostAfterMs = 8000,
  warnAt,
  critAt,
}) {
  // --- Leslie's Call 1: grace period. Under staleAfterMs, treat as live. ---
  const tier =
    staleness >= lostAfterMs ? 'lost' : staleness >= staleAfterMs ? 'stale' : 'live';

  // --- Leslie's Call 3: sparkline freezes — we only append while live. ---
  const buffer = useRef([]);
  if (tier === 'live') {
    buffer.current = [...buffer.current.slice(-29), value];
  }

  // Threshold coloring applies to LIVE data only — a stale value must never
  // shout in threat colors it can no longer vouch for.
  const level =
    tier !== 'live'
      ? 'none'
      : critAt != null && value >= critAt
        ? 'crit'
        : warnAt != null && value >= warnAt
          ? 'warn'
          : 'ok';

  return (
    <div className={`tc tc--${tier}`} role="group" aria-label={`${label} telemetry`}>
      <div className="tc__head">
        <span className="tc__label">{label}</span>
        {tier === 'stale' && (
          <span className="tc__age" aria-live="polite">
            last reading {(staleness / 1000).toFixed(1)}s ago
          </span>
        )}
        {tier === 'lost' && <span className="tc__lost">SIGNAL LOST</span>}
      </div>

      <div className={`tc__value tc__value--${level}`}>
        {value}
        <span className="tc__unit">{unit}</span>
      </div>

      <Sparkline points={buffer.current} frozen={tier !== 'live'} />
    </div>
  );
}

/** Minimal SVG sparkline. Freezes (stops appending) and dims when stale. */
function Sparkline({ points, frozen }) {
  if (points.length < 2) return <div className="tc__spark tc__spark--empty" />;

  const w = 120;
  const h = 28;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = w / (points.length - 1);
  const d = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${(h - ((v - min) / span) * h).toFixed(1)}`)
    .join(' ');

  return (
    <svg
      className={`tc__spark ${frozen ? 'tc__spark--frozen' : ''}`}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
