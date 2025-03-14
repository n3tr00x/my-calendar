export const removeDuplicates = <T, K extends keyof T>(items: T[], key: K): T[] => {
	const map = new Map(items.map(item => [item[key], item]));
	return Array.from(map.values());
};
