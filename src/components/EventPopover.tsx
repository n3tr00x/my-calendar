import { MouseEvent } from 'react';
import {
	Box,
	Button,
	CloseButton,
	Grid,
	GridItem,
	Popover,
	Portal,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { getDay } from 'date-fns';
import { Edit, ListMinus, MapPin, Trash } from 'lucide-react';

import { CalendarEventBadge } from '@/components/CalendarEventBadge';
import { DeleteEventAlertDialog } from '@/components/DeleteEventAlertDialog';
import { useModal } from '@/store/modal';
import { Event } from '@/types/appwrite';
import { formatLongDate } from '@/utilities/date';

type EventPopoverProps = { event: Event; date: Date };

export function EventPopover({ event: editedEvent, date }: EventPopoverProps) {
	const day = getDay(date);

	const { onEventFormOpen } = useModal();
	const { open, setOpen, onClose } = useDisclosure();

	const getPopoverPlacement = () => {
		// Monday to Wednesday → show right
		if (day <= 2) {
			return 'right-start';
		}
		// Friday to Sunday → show left
		if (day >= 5) {
			return 'left-start';
		}
		// Mid-week safe fallback
		return 'top';
	};

	const editEventHandler = (event: MouseEvent) => {
		event.stopPropagation();

		onClose();
		onEventFormOpen(editedEvent);
	};

	const closePopoverHandler = (event: MouseEvent) => {
		event.stopPropagation();
		onClose();
	};

	return (
		<Popover.Root
			modal
			lazyMount
			open={open}
			onOpenChange={({ open }) => setOpen(open)}
			positioning={{ placement: getPopoverPlacement() }}
		>
			<Popover.Trigger onClick={event => event.stopPropagation()}>
				<CalendarEventBadge title={editedEvent.title} />
			</Popover.Trigger>

			<Portal>
				<Popover.Positioner>
					<Popover.Content>
						<Popover.Header ml="auto" display="flex" gap={1}>
							<Button variant="ghost" size="md" px="0" ml="auto" onClick={editEventHandler}>
								<Edit />
							</Button>
							<DeleteEventAlertDialog
								trigger={
									<Button variant="ghost" size="md" px="0" ml="auto" onClick={closePopoverHandler}>
										<Trash />
									</Button>
								}
								event={editedEvent}
							/>
							<CloseButton size="md" onClick={closePopoverHandler} />
						</Popover.Header>
						<Popover.Body display="flex" flexDirection="column" gap={1}>
							<Grid templateColumns="36px 1fr" gapY={2}>
								<GridItem>
									<Box w={5} bg="blue.500" aspectRatio="square" />
								</GridItem>
								<GridItem>
									<Popover.Title fontSize="2xl" fontFamily="heading">
										{editedEvent.title}
									</Popover.Title>
									<Text color="gray.500" mt={2}>
										{formatLongDate(date)}{' '}
										{!editedEvent.isAllDay && `⋅ ${editedEvent.startTime} - ${editedEvent.endTime}`}
									</Text>
									{editedEvent.repeat !== 'no-repeat' && (
										<Text color="gray.500" mt={2}>
											{editedEvent.repeat}
										</Text>
									)}
								</GridItem>
								{editedEvent.description && (
									<GridItem>
										<ListMinus />
									</GridItem>
								)}
								{editedEvent.description && (
									<GridItem>
										<Text
											color="gray.500"
											lineClamp={2}
											whiteSpace="normal"
											overflow="hidden"
											wordBreak="break-word"
										>
											{editedEvent.description}
										</Text>
									</GridItem>
								)}
								{editedEvent.location && (
									<GridItem>
										<MapPin />
									</GridItem>
								)}
								{editedEvent.location && (
									<GridItem>
										<Text color="gray.500">{editedEvent.location}</Text>
									</GridItem>
								)}
							</Grid>
						</Popover.Body>
						<Popover.CloseTrigger />
					</Popover.Content>
				</Popover.Positioner>
			</Portal>
		</Popover.Root>
	);
}
