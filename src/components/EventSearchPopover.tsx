import { ReactElement, RefAttributes, useState } from 'react';
import {
	Box,
	ButtonProps,
	Input,
	PopoverRootProvider,
	Spinner,
	Stack,
	Text,
	usePopover,
} from '@chakra-ui/react';
import { Search } from 'lucide-react';

import { SavedEvent } from '@/components/SavedEvent';
import { InputGroup } from '@/components/ui/input-group';
import {
	PopoverArrow,
	PopoverBody,
	PopoverContent,
	PopoverRoot,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useSearchedEvents } from '@/hooks/appwrite';
import useDebounce from '@/hooks/useDebounce';

type EventSearchPopoverProps = {
	popoverTriggerComponent: ReactElement<ButtonProps & RefAttributes<HTMLButtonElement>>;
};

export function EventSearchPopover({ popoverTriggerComponent }: EventSearchPopoverProps) {
	const popover = usePopover();
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedEventTitleValue = useDebounce(searchTerm, 500);
	const { data: events, isLoading } = useSearchedEvents(debouncedEventTitleValue);

	return (
		<PopoverRootProvider value={popover}>
			<PopoverRoot>
				<PopoverTrigger asChild>{popoverTriggerComponent}</PopoverTrigger>
				<PopoverContent>
					<PopoverArrow />
					<PopoverBody>
						<Stack gap="4">
							<InputGroup flex="1" startElement={<Search size="1em" />}>
								<Input
									placeholder="Search events"
									value={searchTerm}
									onChange={event => setSearchTerm(event.target.value)}
								/>
							</InputGroup>
							<Box display="flex" justifyContent="center" flexDirection="column">
								{isLoading && (
									<Spinner size="lg" colorPalette="blue" color="blue.500" alignSelf="center" />
								)}
								{searchTerm && !isLoading && events?.length === 0 && (
									<Text fontSize="sm" color="gray.500" textAlign="center">
										No events found
									</Text>
								)}
								{searchTerm && events?.map(event => <SavedEvent key={event.$id} event={event} />)}
							</Box>
						</Stack>
					</PopoverBody>
				</PopoverContent>
			</PopoverRoot>
		</PopoverRootProvider>
	);
}
