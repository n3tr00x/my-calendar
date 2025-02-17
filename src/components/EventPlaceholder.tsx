import { useMemo } from 'react';
import { Skeleton } from '@chakra-ui/react';

export function EventPlaceholder() {
	const count = useMemo(() => Math.floor(Math.random() * 4), []);

	return Array.from({ length: count }).map((_, index) => (
		<Skeleton key={index} height={1} my={1} />
	));
}
