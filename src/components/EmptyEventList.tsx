import { EmptyState, VStack } from '@chakra-ui/react';
import { CalendarDays } from 'lucide-react';

export function EmptyEventList() {
	return (
		<EmptyState.Root>
			<EmptyState.Content>
				<EmptyState.Indicator>
					<CalendarDays />
				</EmptyState.Indicator>
				<VStack textAlign="center">
					<EmptyState.Title>No events on this day</EmptyState.Title>
					<EmptyState.Description>
						No events planned for the selected day. Add a new event to stay organized.
					</EmptyState.Description>
				</VStack>
			</EmptyState.Content>
		</EmptyState.Root>
	);
}
