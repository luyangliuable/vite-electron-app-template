export default interface PatientDetails {
  id: number;
  height: number;
  weight: number;
  medications: string[];
  conditions: string[];
  notes: string[];
}
