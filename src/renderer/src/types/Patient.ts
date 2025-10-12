import type PatientDetails from "./PatientDetails";

export default interface Patient {
  id: number;
  name: string;
  dob: string;
  patient_uid: string;
  patient_details: PatientDetails;
}
