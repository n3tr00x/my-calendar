import { Button, Flex, useDisclosure } from '@chakra-ui/react';
import { addMonths, format, startOfMonth, subMonths } from 'date-fns';

import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon';
import { YearPickerModal } from '@/components/YearPicker';
import { useDate } from '@/hooks/useDate';

export function MonthNavigator() {
	console.log('<MonthNavigator /> render');
	const { date, onDateChange } = useDate();
	const { open, onOpen, onClose } = useDisclosure();

	const setPreviousMonth = () => {
		const previousMonth = startOfMonth(subMonths(date, 1));
		onDateChange(previousMonth);
	};

	const setNextMonth = () => {
		const nextMonth = startOfMonth(addMonths(date, 1));
		onDateChange(nextMonth);
	};

	return (
		<>
			{open && <YearPickerModal isOpen={open} onClose={onClose} />}
			<Flex justifyContent="space-between">
				<Button onClick={setPreviousMonth} size="sm" variant="plain">
					<ChevronLeftIcon />
				</Button>
				<Button textAlign="center" size="sm" colorPalette="blue" variant="outline" onClick={onOpen}>
					{format(date, 'MMM').toUpperCase()} {date.getFullYear()}
				</Button>
				<Button onClick={setNextMonth} size="sm" variant="plain">
					<ChevronRightIcon />
				</Button>
			</Flex>
		</>
	);
}
