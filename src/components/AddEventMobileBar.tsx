import { Flex } from '@chakra-ui/react';

import { AddEventMobileInput } from '@/components/AddEventMobileInput';
import { AddEventMobileButton } from '@/components/ui/add-event-mobile-button';
import { useModal } from '@/store/modal';

export function AddEventMobileBar() {
	const { onEventFormOpen } = useModal();

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
			<AddEventMobileButton onClick={() => onEventFormOpen()} />
		</Flex>
	);
}
