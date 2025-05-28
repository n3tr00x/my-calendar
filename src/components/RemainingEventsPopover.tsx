import { Box, Popover, Portal, useDisclosure } from '@chakra-ui/react';

import { CalendarEventBadge } from '@/components/CalendarEventBadge';
import { RemainingEventsBadge } from '@/components/RemainingEventsBadge';
import { useModal } from '@/store/modal';
import { Event } from '@/types/appwrite';

type RemainingEventsPopoverProps = { remainingEvents: Event[]; remainingCount: number };

export function RemainingEventsPopover({
	remainingEvents,
	remainingCount,
}: RemainingEventsPopoverProps) {
	const { open, setOpen, onClose } = useDisclosure();
	const { onEventFormOpen } = useModal();

	return (
		<Popover.Root modal open={open} onOpenChange={({ open }) => setOpen(open)} lazyMount>
			<Popover.Trigger onClick={event => event.stopPropagation()}>
				<RemainingEventsBadge count={remainingCount} />
			</Popover.Trigger>
			<Portal>
				<Popover.Positioner>
					<Popover.Content>
						<Popover.Body display="flex" flexDirection="column" gap={0.5}>
							{remainingEvents.map(event => (
								<Box
									key={event.$id}
									onClick={e => {
										e.stopPropagation();
										onClose();
										onEventFormOpen(event);
									}}
								>
									<CalendarEventBadge title={event.title} />
								</Box>
							))}
						</Popover.Body>
					</Popover.Content>
				</Popover.Positioner>
			</Portal>
		</Popover.Root>
	);
}
