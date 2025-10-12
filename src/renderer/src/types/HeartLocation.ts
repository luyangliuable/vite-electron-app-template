const HeartLocation = {
  Aortic: "aortic",
  Pulmonary: "pulmonary",
  Tricuspid: "tricuspid",
  Mitral: "mitral",
} as const;

type HeartLocation = (typeof HeartLocation)[keyof typeof HeartLocation];

export default HeartLocation;
