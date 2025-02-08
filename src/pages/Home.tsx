import { RefAttributes } from 'react';
import { Button, ButtonProps, Flex, Separator } from '@chakra-ui/react';
import { PlusIcon } from 'lucide-react';

import { Calendar } from '@/components/Calendar';
import { Events } from '@/components/Events';
import { NewEventModal } from '@/components/NewEvent';

export function AddEventMobileButton(props: ButtonProps & RefAttributes<HTMLButtonElement>) {
	return (
		<Button
			variant="subtle"
			colorPalette="blue"
			alignSelf="end"
			marginTop="auto"
			rounded="full"
			size="xl"
			aspectRatio="square"
			mb={4}
			mr={4}
			{...props}
		>
			<PlusIcon />
		</Button>
	);
}

export function Home() {
	return (
		<Flex as="main" h="100vh" flexDirection="column" mx={2}>
			<Calendar />
			<Separator />
			<Events />
			<NewEventModal dialogTriggerComponent={<AddEventMobileButton />} />
		</Flex>
	);
}
