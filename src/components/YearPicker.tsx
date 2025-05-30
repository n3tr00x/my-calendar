import { Dispatch, ReactElement, RefAttributes, SetStateAction, useState } from 'react';
import { ButtonProps, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
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
	DialogTrigger,
} from '@/components/ui/dialog';
import { MONTHS } from '@/constants/date';
import { useSelectedDate, useUpdateSelectedDate } from '@/store/date';

type YearPickerModalProps = {
	trigger: ReactElement<ButtonProps & RefAttributes<HTMLButtonElement>>;
};

const generateTwelveYears = (date: Date) => {
	return Array.from({ length: 12 }, (_, index) => date.getFullYear() + index);
};

export function YearPickerModal({ trigger }: YearPickerModalProps) {
	console.log('<YearPickerModal /> render.');

	const currentSelectedDate = useSelectedDate();
	const { open, setOpen, onClose } = useDisclosure();
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

	const closePickerHandler = () => {
		setMode('month');
		setDate(currentSelectedDate);
	};

	return (
		<DialogRoot
			open={open}
			onOpenChange={({ open }) => setOpen(open)}
			onExitComplete={closePickerHandler}
			size="sm"
			motionPreset="slide-in-bottom"
			placement="bottom"
		>
			<DialogBackdrop />
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent mx={{ base: 2, sm: 0 }}>
				<DialogHeader justifyContent="center">
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
	const selectedDate = useSelectedDate();
	const updateSelectedDate = useUpdateSelectedDate();

	const setMonthHandler = (index: number) => {
		updateSelectedDate(setMonth(date, index));
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
