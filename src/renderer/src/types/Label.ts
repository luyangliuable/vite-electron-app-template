const Label = {
  Unlabelled: "Unlabelled",
  Normal: "Normal",
  Abnormal: "Abnormal",
  Unknown: "Unknown",
} as const;

type Label = (typeof Label)[keyof typeof Label];

export default Label;
