const HospitalUsers = {
  MONASH: "Monash",
  ADMIN: "Admin",
};

type HospitalUsers = (typeof HospitalUsers)[keyof typeof HospitalUsers];

export default HospitalUsers;
