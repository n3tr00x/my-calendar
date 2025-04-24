export const removeDuplicates = <T, K extends keyof T>(items: T[], key: K): T[] => {
	const map = new Map(items.map(item => [item[key], item]));
	return Array.from(map.values());
};

export const isCookieFallbackInvalid = () => {
	const cookieFallback = localStorage.getItem('cookieFallback');
	return cookieFallback === null || cookieFallback === '[]';
};

export const isAuthPage = () => {
	const pathname = window.location.pathname;
	return pathname === '/sign-up' || pathname === '/sign-in';
};
