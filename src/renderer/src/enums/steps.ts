export const Steps = {
	SelectPatient: 1,
	SelectLocation: 2,
	Record: 3,
	Complete: 4
} as const;

export const stepsTranslations = {
	[Steps.SelectPatient]: 'Select Patient',
	[Steps.SelectLocation]: 'Select Location',
	[Steps.Record]: 'Record',
	[Steps.Complete]: 'Complete'
};
