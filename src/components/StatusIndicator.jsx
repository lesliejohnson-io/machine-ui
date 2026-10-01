import React from 'react';
import { STATES } from '../states.js';
import './StatusIndicator.css';

/**
 * StatusIndicator
 *
 * The atomic unit of the kit: current machine state, readable at a glance.
 *
 * Design rules encoded here:
 *  1. SHAPE + COLOR + LABEL, always. No meaning is carried by color alone
 *     (colorblind-safe by construction).
 *  2. Three sizes for three viewing distances:
 *       sm — inline in text and table rows      (~40 cm, arm's length)
 *       md — cards and dashboards               (~1 m, seated operator)
 *       lg — wall displays and kiosks           (3 m+, across the room)
 *  3. FAULT pulses; nothing else animates. Motion is reserved for the one
 *     state that demands action, so motion always means "act".
 *
 * Props:
 *   state    one of: OPERATIONAL | WARNING | DEGRADED | FAULT | OFFLINE
 *   size     'sm' | 'md' | 'lg'                     (default 'md')
 *   showLabel  boolean                              (default true; lg ignores false)
 */
export function StatusIndicator({ state = 'OFFLINE', size = 'md', showLabel = true }) {
  const s = STATES[state] ?? STATES.OFFLINE;
  const labelVisible = showLabel || size === 'lg';

  return (
    <span
      className={`msi msi--${size} ${state === 'FAULT' ? 'msi--pulse' : ''}`}
      style={{ '--c': s.color, '--t': s.tint }}
      role="status"
      aria-label={`Machine state: ${s.label}`}
    >
      <Shape shape={s.shape} />
      {labelVisible && <span className="msi__label">{s.label}</span>}
    </span>
  );
}

/** Unique glyph per state — the colorblind-safety layer. */
function Shape({ shape }) {
  const common = { width: '1em', height: '1em', viewBox: '0 0 20 20', 'aria-hidden': true };
  switch (shape) {
    case 'circle':
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="7" fill="var(--c)" />
        </svg>
      );
    case 'triangle':
      return (
        <svg {...common}>
          <path d="M10 3 L18 17 L2 17 Z" fill="var(--c)" />
        </svg>
      );
    case 'diamond':
      return (
        <svg {...common}>
          <path d="M10 2 L18 10 L10 18 L2 10 Z" fill="var(--c)" />
        </svg>
      );
    case 'square':
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="13" height="13" fill="var(--c)" />
        </svg>
      );
    case 'slash': // hollow ring + slash: "no signal"
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="6.5" fill="none" stroke="var(--c)" strokeWidth="2.4" />
          <line x1="5.4" y1="14.6" x2="14.6" y2="5.4" stroke="var(--c)" strokeWidth="2.4" />
        </svg>
      );
    default:
      return null;
  }
}
