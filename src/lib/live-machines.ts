// Build-time accessor for the recorded demo run that /product's "Live Machines"
// panel replays. Separate from metrics.ts and ci.ts because it's a different
// kind of source: not a live API fetch refreshed by CI, but a fixture recorded
// on demand by scripts/record-live-machines.py and committed.
//
// Everything in the fixture is real — the ML repo's own sensor generator and
// the @production models produced it. It is a *recording*, not live data, and
// the panel says so on screen.
import recording from '../data/live-machines.json';

export interface RecordingMeta {
  source: string;
  note: string;
  recorded_at: string;
  binary_model_version: string;
  multiclass_model_version: string;
  step_seconds: number;
  started_at: string;
  seed: number;
  /** Column order for each frame — the client reads this rather than
      hardcoding indices, so adding a field can't silently shift meaning. */
  fields: string[];
}

export interface RecordedMachine {
  id: string;
  type: string;
  frames: (number | string | null)[][];
}

export interface Recording {
  _meta: RecordingMeta;
  machines: RecordedMachine[];
}

const data = recording as unknown as Recording;

export function liveMachines(): Recording {
  return data;
}

/** Frames per machine — every machine is recorded for the same number of steps. */
export function stepCount(): number {
  return data.machines[0]?.frames.length ?? 0;
}

/** "v36 / v32" — which models actually produced these probabilities. */
export function recordedModelVersions(): string {
  return `v${data._meta.binary_model_version} / v${data._meta.multiclass_model_version}`;
}

/** How long the recorded run covers, in minutes of simulated factory time. */
export function recordedSpanMinutes(): number {
  return Math.round((stepCount() * data._meta.step_seconds) / 60);
}
