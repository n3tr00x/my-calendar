import { RefAttributes } from 'react';
import { Button, ButtonProps, Flex, Separator } from '@chakra-ui/react';
import { PlusIcon } from 'lucide-react';

import { AddEventMobileInput } from '@/components/AddEventMobileInput';
import { Calendar } from '@/components/Calendar';
import { Events } from '@/components/Events';
import { NewEventModal } from '@/components/NewEvent';

export function AddEventMobileButton(props: ButtonProps & RefAttributes<HTMLButtonElement>) {
	return (
		<Button
			variant="subtle"
			colorPalette="blue"
			alignSelf="end"
			rounded="full"
			size="xl"
			aspectRatio="square"
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
			<Flex marginTop="auto" justifyContent="space-between" gap={12} py={2} px={4}>
				<AddEventMobileInput />
				<NewEventModal dialogTriggerComponent={<AddEventMobileButton />} />
			</Flex>
		</Flex>
	);
}
