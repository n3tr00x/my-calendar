import { RefAttributes } from 'react';
import { Box, Button, Flex, FlexProps, Highlight, Text } from '@chakra-ui/react';
import { AppwriteException } from 'appwrite';
import { CalendarRange, Edit, Trash } from 'lucide-react';

import { AlertDialog } from '@/components/AlertDialog';
import { NewEventModal } from '@/components/NewEvent';
import { toaster } from '@/components/ui/toaster';
import { useRemoveEvent } from '@/hooks/appwrite';
import { useSelectedDate } from '@/store/date';
import { Event } from '@/types/appwrite';

type SavedEventProps = {
	event: Event;
	savedEventStyles?: FlexProps & RefAttributes<HTMLDivElement>;
};

export function SavedEvent({ event, savedEventStyles }: SavedEventProps) {
	console.log('<SavedEvent /> render.');
	const selectedDate = useSelectedDate();
	const { mutateAsync: removeEvent } = useRemoveEvent(selectedDate);

	const removeEventHandler = () => {
		toaster.promise(removeEvent(event.$id), {
			success: { title: 'The event has been removed!' },
			error: error => ({
				title: 'Something went wrong',
				description: error instanceof AppwriteException ? error.message : 'An unexpected error',
			}),
			loading: { title: 'Removing event...' },
		});
	};

	return (
		<Flex gap={2} {...savedEventStyles}>
			<Box w={10} alignSelf={event.isAllDay ? 'center' : 'flex-start'}>
				{event.isAllDay ? (
					<CalendarRange />
				) : (
					<Text fontSize="sm" fontWeight="bold">
						{event.startTime}
					</Text>
				)}
			</Box>
			<Box width={1.5} rounded="xl" backgroundColor="blue.500" />
			<Box>
				<Text fontFamily="heading" fontSize="sm">
					{event.title}
				</Text>
				<Text fontSize="xs" color="gray.500">
					{event.isAllDay ? 'All day' : `${event.startTime} - ${event.endTime}`}
				</Text>
			</Box>
			<Flex ml="auto">
				<NewEventModal
					editedEvent={event}
					dialogTriggerComponent={
						<Button variant="ghost" ml="auto" size="sm" onClick={event => event.stopPropagation()}>
							<Edit />
						</Button>
					}
				/>
				<AlertDialog
					alertTriggerComponent={
						<Button variant="ghost" ml="auto" size="sm" onClick={event => event.stopPropagation()}>
							<Trash />
						</Button>
					}
					description={
						<Highlight query={event.title} styles={{ fontWeight: 'semibold' }}>
							{`You are going to remove ${event.title} event.`}
						</Highlight>
					}
					action={removeEventHandler}
				/>
			</Flex>
		</Flex>
	);
}
