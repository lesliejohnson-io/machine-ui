/**
 * THE STATE MODEL — single source of truth.
 *
 * Every component in this kit consumes machine state from this map.
 * Each state carries: definition, color token, a unique SHAPE
 * (so no meaning is ever carried by color alone), and an
 * escalation rule (when it should interrupt the operator).
 *
 * Escalation levels:
 *   ambient  — visible on the surface it lives on; never interrupts
 *   notify   — surfaces in dashboards/summaries; no acknowledgement needed
 *   interrupt— requires operator awareness; may raise an AlertBanner
 */

export const STATES = {
  OPERATIONAL: {
    key: 'OPERATIONAL',
    label: 'Operational',
    definition: 'The machine is performing within all expected thresholds.',
    color: 'var(--state-operational)',
    tint: 'var(--tint-operational)',
    shape: 'circle',
    escalation: 'ambient',
    escalationRule:
      'Never alert on OPERATIONAL. Silence is the reward for a healthy system.',
  },
  WARNING: {
    key: 'WARNING',
    label: 'Warning',
    definition:
      'One or more readings are trending toward a threshold. No capability is lost yet.',
    color: 'var(--state-warning)',
    tint: 'var(--tint-warning)',
    shape: 'triangle',
    escalation: 'notify',
    escalationRule:
      'Show on cards and summaries. Do not raise a banner — warnings that interrupt train operators to ignore banners.',
  },
  DEGRADED: {
    key: 'DEGRADED',
    label: 'Degraded',
    definition:
      'The machine is still running but with reduced capability, accuracy, or speed.',
    color: 'var(--state-degraded)',
    tint: 'var(--tint-degraded)',
    shape: 'diamond',
    escalation: 'notify',
    escalationRule:
      'Belongs on the card and the fleet view, not in an alert — unless degradation affects an active task the operator owns.',
  },
  FAULT: {
    key: 'FAULT',
    label: 'Fault',
    definition:
      'The machine has stopped performing its function and requires operator action.',
    color: 'var(--state-fault)',
    tint: 'var(--tint-fault)',
    shape: 'square',
    escalation: 'interrupt',
    escalationRule:
      'Always raise an AlertBanner. FAULT is the only state that demands acknowledgement.',
  },
  OFFLINE: {
    key: 'OFFLINE',
    label: 'Offline',
    definition:
      'No telemetry is being received. The true state of the machine is unknown.',
    color: 'var(--state-offline)',
    tint: 'var(--tint-offline)',
    shape: 'slash',
    escalation: 'notify',
    escalationRule:
      'OFFLINE is uncertainty, not failure. Interrupt only if the machine went offline during an active task.',
  },
};

export const STATE_ORDER = [
  'OPERATIONAL',
  'WARNING',
  'DEGRADED',
  'FAULT',
  'OFFLINE',
];
