import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { Input, Tag } from '@chakra-ui/react';
import { AppwriteException } from 'appwrite';

import { InputGroup } from '@/components/ui/input-group';
import { toaster } from '@/components/ui/toaster';
import { useAddNewEvent } from '@/hooks/appwrite';
import { useAuth } from '@/hooks/useAuth';
import { useSelectedDate } from '@/store/date';
import { NewEvent } from '@/types/appwrite';
import { formatDateToYearMonthDay, formatShortDate } from '@/utilities/date';

function isValidTimeFormat(time: string) {
	const regex = /^([01]\d|2[0-3]):[0-5]\d$/;
	return regex.test(time);
}

function addOneHour(time: string) {
	const [hour, minute] = time.split(':');
	const addedHour = +hour + 1;
	return `${addedHour}:${minute}`;
}

export function AddEventMobileInput() {
	const { user } = useAuth();
	const selectedDate = useSelectedDate();
	const [eventName, setEventName] = useState('');
	const [enteredHour, setEnteredHour] = useState('');
	const { mutateAsync: addNewEvent } = useAddNewEvent(selectedDate);

	const addEventInputSubmitHandler = async () => {
		const newEvent: NewEvent = {
			accountId: user?.accountId,
			user: user?.$id,
			title: eventName,
			description: null,
			isAllDay: enteredHour ? false : true,
			startDate: formatDateToYearMonthDay(selectedDate),
			endDate: formatDateToYearMonthDay(selectedDate),
			startTime: enteredHour ? enteredHour : null,
			endTime: enteredHour ? addOneHour(enteredHour) : null,
			location: null,
			repeat: ['no-repeat'],
		};

		toaster.promise(addNewEvent(newEvent), {
			success: { title: 'The event has been added!' },
			error: error => ({
				title: 'Something went wrong',
				description: error instanceof AppwriteException ? error.message : 'An unexpected error',
			}),
			loading: { title: 'Processing new event...' },
		});

		setEventName('');
		setEnteredHour('');
	};

	const addEventInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;

		if (isValidTimeFormat(inputValue.slice(0, 5))) {
			setEnteredHour(inputValue.slice(0, 5));
			setEventName(inputValue.slice(5));
		} else {
			setEventName(inputValue);
		}
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Backspace' && enteredHour && eventName.length === 0) {
			setEnteredHour('');
		}

		if (event.key === 'Enter') {
			addEventInputSubmitHandler();
		}
	};

	return (
		<InputGroup
			flex="1"
			startElement={
				enteredHour && (
					<Tag.Root size="lg">
						<Tag.Label>{enteredHour}</Tag.Label>
					</Tag.Root>
				)
			}
		>
			<Input
				ps={enteredHour ? 20 : 6}
				value={eventName}
				onChange={addEventInputChangeHandler}
				onKeyDown={handleKeyDown}
				placeholder={`Add event on ${formatShortDate(selectedDate)}`}
				rounded="full"
			/>
		</InputGroup>
	);
}
