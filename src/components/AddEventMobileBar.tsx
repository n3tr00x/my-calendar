import { Flex } from '@chakra-ui/react';

import { AddEventMobileInput } from '@/components/AddEventMobileInput';
import { NewEventModal } from '@/components/NewEvent';
import { AddEventMobileButton } from '@/components/ui/add-event-mobile-button';

export function AddEventMobileBar() {
	return (
		<Flex
			display={{ base: 'flex', lg: 'none' }}
			justifyContent="space-between"
			gap={12}
			py={2}
			px={4}
			marginTop="auto"
		>
			<AddEventMobileInput />
			<NewEventModal trigger={<AddEventMobileButton />} />
		</Flex>
	);
}
