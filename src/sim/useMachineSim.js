import { useEffect, useRef, useState } from 'react';
import { STATE_ORDER } from '../states.js';

/**
 * useMachineSim — a simulated machine emitting telemetry.
 *
 * Emits a reading every `tickMs`:
 *   { state, temperature, throughput, battery, history, staleness }
 *
 * The simulator injects realistic misbehavior:
 *   - values drift with noise
 *   - occasional threshold breaches (WARNING / DEGRADED)
 *   - rare hard faults (FAULT)
 *   - telemetry dropouts (OFFLINE + rising staleness)
 *
 * This exists so every component in the docs is demonstrated
 * against live, imperfect data — the condition it was designed for.
 */
export function useMachineSim({ tickMs = 1200, seedState = 'OPERATIONAL' } = {}) {
  const [reading, setReading] = useState(() => initialReading(seedState));
  const box = useRef({
    state: seedState,
    stateAge: 0,
    temp: 42,
    tput: 96,
    batt: 88,
    dropout: 0,
    history: [],
  });

  useEffect(() => {
    const id = setInterval(() => {
      const m = box.current;
      m.stateAge += 1;

      // --- telemetry drift ---
      m.temp = clamp(m.temp + rand(-0.8, 1.1), 20, 95);
      m.tput = clamp(m.tput + rand(-3, 3), 0, 100);
      m.batt = clamp(m.batt - rand(0, 0.4), 0, 100);

      // --- dropout handling (OFFLINE) ---
      if (m.dropout > 0) {
        m.dropout -= 1;
        m.state = 'OFFLINE';
        if (m.dropout === 0) m.state = 'OPERATIONAL';
      } else if (chance(0.02)) {
        m.dropout = irand(3, 6); // lose telemetry for a few ticks
      } else {
        // --- state machine driven by the values themselves ---
        if (m.state === 'FAULT') {
          if (m.stateAge > 6 && chance(0.35)) transition(m, 'OPERATIONAL');
        } else if (m.temp > 78 || m.tput < 35) {
          transition(m, chance(0.25) ? 'FAULT' : 'DEGRADED');
        } else if (m.temp > 68 || m.tput < 60 || m.batt < 20) {
          transition(m, 'WARNING');
        } else if (m.state !== 'OPERATIONAL' && m.stateAge > 4) {
          transition(m, 'OPERATIONAL');
        }
        if (m.state === 'OPERATIONAL' && chance(0.015)) transition(m, 'FAULT'); // rare hard fault
      }

      // --- history for StateTimeline (keep last 60 ticks) ---
      m.history = [...m.history.slice(-59), m.state];

      setReading({
        state: m.state,
        temperature: round1(m.temp),
        throughput: Math.round(m.tput),
        battery: Math.round(m.batt),
        staleness: m.dropout > 0 ? (irand(3, 6) - m.dropout + 1) * tickMs : 0,
        history: m.history,
        timestamp: Date.now(),
      });
    }, tickMs);
    return () => clearInterval(id);
  }, [tickMs]);

  return reading;
}

/* ---------- helpers ---------- */
function transition(m, next) {
  if (m.state !== next) {
    m.state = next;
    m.stateAge = 0;
  }
}
function initialReading(state) {
  return {
    state,
    temperature: 42,
    throughput: 96,
    battery: 88,
    staleness: 0,
    history: STATE_ORDER.slice(0, 1),
    timestamp: Date.now(),
  };
}
const rand = (a, b) => a + Math.random() * (b - a);
const irand = (a, b) => Math.floor(rand(a, b + 1));
const chance = (p) => Math.random() < p;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const round1 = (v) => Math.round(v * 10) / 10;
