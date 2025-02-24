export const generateEventsQueryKey = (date: Date) => {
	const monthIndex = date?.getMonth();
	const year = date?.getFullYear();

	return `${monthIndex}:${year}`;
};
