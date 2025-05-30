import { ChangeEvent, useState } from 'react';
import { Box, Input, Spinner, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { isSameDay } from 'date-fns';
import { Search } from 'lucide-react';

import { SavedEvent } from '@/components/SavedEvent';
import { InputGroup } from '@/components/ui/input-group';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '@/components/ui/popover';
import { useSearchedEvents } from '@/hooks/appwrite';
import useDebounce from '@/hooks/useDebounce';
import { useUpdateSelectedDate } from '@/store/date';
import { formatDateToYearMonthDay } from '@/utilities/date';

export function EventSearchDesktopPopover() {
	const updateSelectedDate = useUpdateSelectedDate();
	const { open, setOpen } = useDisclosure();
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedEventTitleValue = useDebounce(searchTerm, 500);
	const { data: events, isLoading } = useSearchedEvents(debouncedEventTitleValue);

	const openPopoverChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const searchTermValue = event.target.value;
		setSearchTerm(searchTermValue);

		if (searchTermValue.length === 0) {
			return setOpen(false);
		}

		setOpen(true);
	};

	const blurSearchInputHandler = () => {
		if (searchTerm.length === 0) return;

		setOpen(true);
	};

	return (
		<PopoverRoot open={open} positioning={{ sameWidth: true }} autoFocus={false} lazyMount>
			<PopoverTrigger display={{ base: 'none', lg: 'block' }} asChild>
				<InputGroup flex="1" startElement={<Search size="1em" />} role="button">
					<Input
						w={96}
						placeholder="Search events"
						value={searchTerm}
						onChange={openPopoverChangeHandler}
						onFocus={blurSearchInputHandler}
						onBlur={() => setOpen(false)}
					/>
				</InputGroup>
			</PopoverTrigger>
			<PopoverContent zIndex={99} width="auto">
				<PopoverBody>
					<Stack gap="4">
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
										onClick={() => {
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
