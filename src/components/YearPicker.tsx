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
	// currentDate: Date;
	// onDateChange: Dispatch<SetStateAction<Date>>;
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
	console.log('<YearPickerModal />');

	const { date: currentDate } = useDate();
	const [mode, setMode] = useState<'month' | 'year'>('month');
	const [date, setDate] = useState(currentDate);
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
		setDate(currentDate);
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
			<DialogContent>
				<DialogHeader textAlign="center">
					<Button variant="ghost" onClick={setPreviousYear}>
						<ChevronLeft />
					</Button>
					<Button
						variant="ghost"
						fontFamily="heading"
						onClick={() => setMode(mode === 'month' ? 'year' : 'month')}
					>
						{mode === 'month'
							? currentDate.getFullYear()
							: `${years[0]}-${years[years.length - 1]}`}
					</Button>
					<Button variant="ghost" onClick={setNextYear}>
						<ChevronRight />
					</Button>
				</DialogHeader>
				<DialogCloseTrigger />
				<DialogBody>
					<MonthPicker mode={mode} years={years} onSetMode={setMode} onClose={onClose} />
				</DialogBody>
			</DialogContent>
		</DialogRoot>
	);
}

type MonthPickerProps = {
	mode: 'month' | 'year';
	years: number[];
	onSetMode: Dispatch<SetStateAction<'month' | 'year'>>;
	onClose: () => void;
};

function MonthPicker({ mode, years, onSetMode, onClose }: MonthPickerProps) {
	const { date, onDateChange } = useDate();

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
								colorPalette={date.getMonth() === index ? 'blue' : undefined}
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
								colorPalette={date.getFullYear() === year ? 'blue' : undefined}
								minW={20}
								onClick={() => {
									onDateChange(setYear(date, year));
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
