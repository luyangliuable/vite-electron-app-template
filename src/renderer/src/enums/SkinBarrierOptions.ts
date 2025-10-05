const SkinBarrierOptions = {
	fat: 'fat',
	hair: 'hair',
	stickers: 'stickers',
	scars: 'scars'
};

type SkinBarrierOptions = (typeof SkinBarrierOptions)[keyof typeof SkinBarrierOptions];

export default SkinBarrierOptions;
