import { Box, HStack, Skeleton } from '@chakra-ui/react';

export function EventListSkeleton() {
	const count = Math.floor(Math.random() * 3) + 1;

	return (
		<Box py={4}>
			{Array.from({ length: count }).map((_, index) => (
				<HStack key={index} gap={4} py={2}>
					<Skeleton w={12} h={12} />
					<Skeleton w={12} h={12} flex={1} />
				</HStack>
			))}
		</Box>
	);
}
