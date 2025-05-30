import { MouseEvent, RefAttributes } from 'react';
import { Box, Button, Flex, FlexProps, Highlight, Text } from '@chakra-ui/react';
import { AppwriteException } from 'appwrite';
import { CalendarRange, Edit, Trash } from 'lucide-react';

import { AlertDialog } from '@/components/AlertDialog';
import { toaster } from '@/components/ui/toaster';
import { useRemoveEvent } from '@/hooks/appwrite';
import { useModal } from '@/store/modal';
import { Event } from '@/types/appwrite';

type SavedEventProps = {
	event: Event;
	savedEventStyles?: FlexProps & RefAttributes<HTMLDivElement>;
};

export function SavedEvent({ event, savedEventStyles }: SavedEventProps) {
	console.log('<SavedEvent /> render.');
	const { onEventFormOpen } = useModal();
	const { mutateAsync: removeEvent } = useRemoveEvent();

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

	const editEventHandler = (e: MouseEvent) => {
		e.stopPropagation();

		onEventFormOpen(event);
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
				<Button
					aria-label="edit event button"
					variant="ghost"
					ml="auto"
					size="sm"
					onClick={editEventHandler}
				>
					<Edit />
				</Button>
				<AlertDialog
					trigger={
						<Button
							aria-label="remove event button"
							variant="ghost"
							ml="auto"
							size="sm"
							onClick={event => event.stopPropagation()}
						>
							<Trash />
						</Button>
					}
					title="Delete event"
					description={
						<Highlight query={event.title} styles={{ fontWeight: 'semibold' }}>
							{`Are you sure you want to delete ${event.title} event? This action cannot be undone.`}
						</Highlight>
					}
					actionButtonLabel="Delete"
					action={removeEventHandler}
				/>
			</Flex>
		</Flex>
	);
}
