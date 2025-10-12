import type HeartLocation from "./HeartLocation";
import Label from "./Label";

export default interface Recording {
  id: number;
  recording_batch_id: number;
  device_id: number;
  location: HeartLocation;
  audio: Blob;
  start_time: string;
}
