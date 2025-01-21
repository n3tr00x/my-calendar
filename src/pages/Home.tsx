import { Flex } from '@chakra-ui/react';

import { Calendar } from '@/components/Calendar';

export function Home() {
	return (
		<Flex as="main" h="100vh" flexDirection="column" justifyContent="space-between">
			<Calendar />
			{/* <AddEvent /> */}
		</Flex>
	);
}
