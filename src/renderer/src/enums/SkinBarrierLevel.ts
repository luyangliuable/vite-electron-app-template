const SkinBarrierLevel = {
	Mild: 'mild',
	Moderate: 'moderate',
	Severe: 'severe'
};

type SkinBarrierLevel = (typeof SkinBarrierLevel)[keyof typeof SkinBarrierLevel];

export default SkinBarrierLevel;
