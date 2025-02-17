import { Dispatch, SetStateAction, useState } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import { addYears, setMonth, setYear, subYears } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DialogBackdrop,
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogHeader,
	DialogRoot,
} from '@/components/ui/dialog';
import { useDate } from '@/hooks/useDate';

type YearPickerModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

const MONTHS = [
	'january',
	'february',
	'march',
	'april',
	'may',
	'june',
	'july',
	'august',
	'september',
	'october',
	'november',
	'december',
];

const generateTwelveYears = (date: Date) => {
	return Array.from({ length: 12 }, (_, index) => date.getFullYear() + index);
};

export function YearPickerModal({ isOpen, onClose }: YearPickerModalProps) {
	console.log('<YearPickerModal /> render.');

	const { date: currentSelectedDate } = useDate();
	const [mode, setMode] = useState<'month' | 'year'>('month');
	const [date, setDate] = useState(currentSelectedDate);
	const years = generateTwelveYears(date);

	const setPreviousYear = () => {
		if (mode === 'year') {
			const previousYear = subYears(date, 12);
			setDate(previousYear);
		} else {
			const previousYear = subYears(date, 1);
			setDate(previousYear);
		}
	};

	const setNextYear = () => {
		if (mode === 'year') {
			const nextYear = addYears(date, 12);
			setDate(nextYear);
		} else {
			const nextYear = addYears(date, 1);
			setDate(nextYear);
		}
	};

	const closePickerModal = () => {
		setMode('month');
		setDate(currentSelectedDate);
		onClose();
	};

	return (
		<DialogRoot
			open={isOpen}
			onOpenChange={closePickerModal}
			size="sm"
			motionPreset="slide-in-bottom"
			placement="bottom"
		>
			<DialogBackdrop />
			<DialogContent mx={{ base: 2, sm: 0 }}>
				<DialogHeader textAlign="center">
					<Button variant="ghost" onClick={setPreviousYear}>
						<ChevronLeft />
					</Button>
					<Button
						variant="ghost"
						fontFamily="heading"
						onClick={() => setMode(mode === 'month' ? 'year' : 'month')}
					>
						{mode === 'month' ? date.getFullYear() : `${years[0]}-${years[years.length - 1]}`}
					</Button>
					<Button variant="ghost" onClick={setNextYear}>
						<ChevronRight />
					</Button>
				</DialogHeader>
				<DialogCloseTrigger />
				<DialogBody>
					<MonthPicker
						mode={mode}
						date={date}
						years={years}
						onSetMode={setMode}
						onSetDate={setDate}
						onClose={onClose}
					/>
				</DialogBody>
			</DialogContent>
		</DialogRoot>
	);
}

type MonthPickerProps = {
	mode: 'month' | 'year';
	years: number[];
	date: Date;
	onSetMode: Dispatch<SetStateAction<'month' | 'year'>>;
	onSetDate: Dispatch<SetStateAction<Date>>;
	onClose: () => void;
};

function MonthPicker({ mode, years, date, onSetMode, onSetDate, onClose }: MonthPickerProps) {
	const { date: selectedDate, onDateChange } = useDate();

	const setMonthHandler = (index: number) => {
		onDateChange(setMonth(date, index));
		onClose();
	};

	return (
		<Grid templateColumns="repeat(4, 1fr)" justifyItems="center" gapY={2}>
			{mode === 'month'
				? MONTHS.map((month, index) => (
						<GridItem key={month}>
							<Button
								variant="subtle"
								colorPalette={
									selectedDate.getMonth() === index &&
									selectedDate.getFullYear() === date.getFullYear()
										? 'blue'
										: undefined
								}
								minW={20}
								onClick={() => setMonthHandler(index)}
							>
								{month.toUpperCase().substring(0, 3)}
							</Button>
						</GridItem>
					))
				: years.map(year => (
						<GridItem key={year}>
							<Button
								variant="subtle"
								colorPalette={selectedDate.getFullYear() === year ? 'blue' : undefined}
								minW={20}
								onClick={() => {
									onSetDate(setYear(date, year));
									onSetMode('month');
								}}
							>
								{year}
							</Button>
						</GridItem>
					))}
		</Grid>
	);
}
