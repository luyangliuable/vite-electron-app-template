import type Device from "./Device";
import type Trial from "./Trial";

export default interface TrialDevice {
  name: string;
  trial: Trial;
  device: Device;
  is_admin: boolean;
}
