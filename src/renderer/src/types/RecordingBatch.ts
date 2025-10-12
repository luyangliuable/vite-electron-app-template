import { Steps } from "../enums/steps";
import type Patient from "./Patient";
import type Recording from "./Recording";
import type SkinBarrier from "./SkinBarrier";

export default interface RecordingBatch {
  id: number;
  patient: Patient;
  step_id: (typeof Steps)[keyof typeof Steps];
  skin_barriers: SkinBarrier[];
  start_time: string;
  is_complete: boolean;
  recordings: Recording[];
  selected_recordings: number[];
}
