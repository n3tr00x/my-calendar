import { Button, Flex, useDisclosure } from '@chakra-ui/react';
import { addMonths, format, startOfMonth, subMonths } from 'date-fns';

import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon';
import { YearPickerModal } from '@/components/YearPicker';
import { useSelectedDate, useUpdateSelectedDate } from '@/store/date';

export function MonthNavigator() {
	console.log('<MonthNavigator /> render');
	const selectedDate = useSelectedDate();
	const updateSelectedDate = useUpdateSelectedDate();
	const { open, onOpen, onClose } = useDisclosure();

	const setPreviousMonth = () => {
		const previousMonth = startOfMonth(subMonths(selectedDate, 1));
		updateSelectedDate(previousMonth);
	};

	const setNextMonth = () => {
		const nextMonth = startOfMonth(addMonths(selectedDate, 1));
		updateSelectedDate(nextMonth);
	};

	return (
		<>
			{open && <YearPickerModal isOpen={open} onClose={onClose} />}
			<Flex justifyContent="space-between">
				<Button onClick={setPreviousMonth} size="xs" variant="plain">
					<ChevronLeftIcon />
				</Button>
				<Button textAlign="center" size="xs" colorPalette="blue" variant="outline" onClick={onOpen}>
					{format(selectedDate, 'MMM').toUpperCase()} {selectedDate.getFullYear()}
				</Button>
				<Button onClick={setNextMonth} size="xs" variant="plain">
					<ChevronRightIcon />
				</Button>
			</Flex>
		</>
	);
}
