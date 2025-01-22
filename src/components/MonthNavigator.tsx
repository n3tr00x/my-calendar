import { Button, Flex, useDisclosure } from '@chakra-ui/react';
import { addMonths, format, subMonths } from 'date-fns';

import { YearPickerModal } from '@/components/YearPicker';
import { useDate } from '@/hooks/useDate';

import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

export function MonthNavigator() {
	console.log('<MonthNavigator /> render');
	const { date, onDateChange } = useDate();
	const { open, onOpen, onClose } = useDisclosure();

	const setPreviousMonth = () => {
		const previousMonth = subMonths(date, 1);
		onDateChange(previousMonth);
	};

	const setNextMonth = () => {
		const nextMonth = addMonths(date, 1);
		onDateChange(nextMonth);
	};

	return (
		<>
			{open && <YearPickerModal isOpen={open} onClose={onClose} />}
			<Flex justifyContent="space-between">
				<Button onClick={setPreviousMonth} variant="plain">
					<ChevronLeftIcon />
				</Button>
				<Button textAlign="center" py={2} colorPalette="blue" variant="outline" onClick={onOpen}>
					{format(date, 'MMM').toUpperCase()} {date.getFullYear()}
				</Button>
				<Button onClick={setNextMonth} variant="plain">
					<ChevronRightIcon />
				</Button>
			</Flex>
		</>
	);
}
