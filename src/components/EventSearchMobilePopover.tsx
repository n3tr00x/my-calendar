import { useState } from 'react';
import { Box, Input, Spinner, Stack, Text } from '@chakra-ui/react';
import { isSameDay } from 'date-fns';
import { Search } from 'lucide-react';

import { SavedEvent } from '@/components/SavedEvent';
import { Button } from '@/components/ui/button';
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
import { useUpdateSelectedDate } from '@/store/date';
import { formatDateToYearMonthDay } from '@/utilities/date';

export function EventSearchMobilePopover() {
	const updateSelectedDate = useUpdateSelectedDate();
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedEventTitleValue = useDebounce(searchTerm, 500);
	const { data: events, isLoading } = useSearchedEvents(debouncedEventTitleValue);

	return (
		<PopoverRoot unmountOnExit lazyMount>
			<PopoverTrigger display={{ lg: 'none' }} asChild>
				<Button
					aria-label="search events button"
					variant="ghost"
					display={{ lg: 'none' }}
					size={{ base: 'xs' }}
					aspectRatio="square"
				>
					<Search />
				</Button>
			</PopoverTrigger>
			<PopoverContent zIndex={99}>
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
						<Box display="flex" justifyContent="center" flexDirection="column" gap={4}>
							{isLoading && (
								<Spinner size="lg" colorPalette="blue" color="blue.500" alignSelf="center" />
							)}
							{searchTerm && !isLoading && events?.length === 0 && (
								<Text fontSize="sm" color="gray.500" textAlign="center">
									No events found
								</Text>
							)}
							{searchTerm &&
								events?.map(event => (
									<Box
										key={event.$id}
										cursor="pointer"
										// _hover={{ opacity: '0.8', transition: 'ease-out .3s' }}
										onClick={e => {
											e.stopPropagation();
											updateSelectedDate(new Date(event.startDate));
										}}
									>
										<Text color="gray.500">
											{isSameDay(event.startDate, event.endDate)
												? formatDateToYearMonthDay(event.startDate)
												: `${formatDateToYearMonthDay(event.startDate)} - ${formatDateToYearMonthDay(
														event.endDate,
													)}`}
										</Text>
										<SavedEvent event={event} savedEventStyles={{ p: 2, bg: 'transparent' }} />
									</Box>
								))}
						</Box>
					</Stack>
				</PopoverBody>
			</PopoverContent>
		</PopoverRoot>
	);
}
