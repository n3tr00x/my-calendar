import { FormEvent, useEffect, useRef } from 'react';
import { Controller, useForm, UseFormGetValues } from 'react-hook-form';
import {
	CloseButton,
	createListCollection,
	Dialog,
	Flex,
	Input,
	Portal,
	Textarea,
	VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppwriteException } from 'appwrite';
import { CaseSensitive, MapPin, MoveRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { InputGroup } from '@/components/ui/input-group';
import {
	SelectContent,
	SelectItem,
	SelectRoot,
	SelectTrigger,
	SelectValueText,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toaster } from '@/components/ui/toaster';
import { useAddNewEvent, useEditEvent } from '@/hooks/appwrite';
import { NewEventSchema } from '@/schemas/new-event.schema';
import { useSelectedDate } from '@/store/date';
import { useModal } from '@/store/modal';
import { NewEventFormData } from '@/types/appwrite';
import { addHoursAndResetMinutes, formatDateToYearMonthDay } from '@/utilities/date';

export type DirtyField = {
	[K in keyof NewEventFormData]: K extends 'repeat' ? boolean[] : boolean;
};

export type DirtyFields = Partial<DirtyField>;

export type NewEventFieldNames = keyof NewEventFormData;

const repeatFrequencyCollection = createListCollection({
	items: [
		{ label: "Don't repeat", value: 'no-repeat' },
		{ label: 'Everyday', value: 'daily' },
		{ label: 'Every week', value: 'weekly' },
		{ label: 'Every monthly', value: 'monthly' },
	],
});

const calculateEndTime = (time: string) => {
	const [hours, minutes] = time.split(':').map(Number);
	const newHours = (hours + 1) % 24;
	return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const getEditedFields = (
	dirtyFields: DirtyFields,
	getValuesFn: UseFormGetValues<NewEventFormData>,
) => {
	return Object.keys(dirtyFields).reduce((acc, currentValue) => {
		const field = currentValue as keyof NewEventFormData;
		return { ...acc, [currentValue]: getValuesFn(field) };
	}, {} as Partial<NewEventFormData>);
};

export function NewEventModal() {
	console.log('<NewEventModal /> render.');
	const selectedDate = useSelectedDate();
	const { open, editedEvent, onEventFormClose, onSetEventFormState } = useModal();
	const { mutateAsync: addNewEvent } = useAddNewEvent();
	const { mutateAsync: editEvent } = useEditEvent();
	const contentRef = useRef<HTMLDivElement>(null);

	const {
		register,
		control,
		watch,
		handleSubmit,
		getValues,
		setValue,
		reset,
		formState: { errors, dirtyFields, isSubmitting },
	} = useForm<NewEventFormData>({
		resolver: zodResolver(NewEventSchema),
		defaultValues: {
			title: editedEvent ? editedEvent.title : '',
			isAllDay: editedEvent ? editedEvent.isAllDay : false,
			startDate: editedEvent
				? formatDateToYearMonthDay(editedEvent.startDate)
				: formatDateToYearMonthDay(selectedDate),
			endDate: editedEvent
				? formatDateToYearMonthDay(editedEvent.endDate)
				: formatDateToYearMonthDay(selectedDate),
			startTime: editedEvent ? editedEvent.startTime : addHoursAndResetMinutes(selectedDate),
			endTime: editedEvent ? editedEvent.endTime : addHoursAndResetMinutes(selectedDate, 2),
			location: editedEvent ? editedEvent.location : null,
			description: editedEvent ? editedEvent.description : null,
			repeat: editedEvent ? [editedEvent.repeat] : ['no-repeat'],
		},
	});

	const [isAllDaySelected, startTime] = watch(['isAllDay', 'startTime']);
	const isEventModified = Object.keys(dirtyFields).length > 0;

	useEffect(() => {
		if (isAllDaySelected) {
			setValue('startTime', null);
			setValue('endTime', null);
		} else {
			setValue(
				'startTime',
				editedEvent ? editedEvent.startTime : addHoursAndResetMinutes(selectedDate),
			);
			setValue(
				'endTime',
				editedEvent ? editedEvent.endTime : addHoursAndResetMinutes(selectedDate, 2),
			);
		}
	}, [isAllDaySelected, setValue, selectedDate, editedEvent]);

	useEffect(() => {
		if (startTime) {
			const newEndTime = calculateEndTime(startTime);
			setValue('endTime', newEndTime);
		}
	}, [startTime, setValue]);

	useEffect(() => {
		if (editedEvent) {
			reset({
				title: editedEvent.title,
				isAllDay: editedEvent.isAllDay,
				startDate: formatDateToYearMonthDay(editedEvent.startDate),
				endDate: formatDateToYearMonthDay(editedEvent.endDate),
				startTime: editedEvent.startTime,
				endTime: editedEvent.endTime,
				location: editedEvent.location,
				description: editedEvent.description,
				repeat: [editedEvent.repeat],
			});
		} else {
			reset({
				title: '',
				isAllDay: false,
				startDate: formatDateToYearMonthDay(selectedDate),
				endDate: formatDateToYearMonthDay(selectedDate),
				startTime: addHoursAndResetMinutes(selectedDate),
				endTime: addHoursAndResetMinutes(selectedDate, 2),
				location: null,
				description: null,
				repeat: ['no-repeat'],
			});
		}
	}, [editedEvent, selectedDate, reset]);

	const editEventHandler = async () => {
		onEventFormClose();

		const modifiedFields = getEditedFields(dirtyFields, getValues);

		if (editedEvent) {
			toaster.promise(
				editEvent.bind(null, { eventId: editedEvent.$id, editedEvent: modifiedFields }),
				{
					success: {
						title: 'The event has been edited correctly!',
					},
					error: error => ({
						title: 'An edit event problem',
						description: error instanceof AppwriteException ? error.message : 'An unexpected error',
					}),
					loading: {
						title: 'Editing event...',
					},
				},
			);
		}

		reset();
	};

	const addEventHandler = async (event: NewEventFormData) => {
		onEventFormClose();

		toaster.promise(addNewEvent.bind(null, event), {
			success: {
				title: 'The event has been added!',
			},
			error: error => ({
				title: 'New event problem',
				description: error instanceof AppwriteException ? error.message : 'An unexpected error',
			}),
			loading: {
				title: 'Processing new event...',
			},
		});

		reset();
	};

	const submitFormHandler = (event: FormEvent) => {
		event.preventDefault();

		if (editedEvent) {
			handleSubmit(editEventHandler)(event);
		} else {
			handleSubmit(addEventHandler)(event);
		}
	};

	return (
		<Dialog.Root size="xs" open={open} onOpenChange={({ open }) => onSetEventFormState(open)}>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content onClick={event => event.stopPropagation()} ref={contentRef} zIndex={999}>
						<form onSubmit={submitFormHandler}>
							<Dialog.Header>
								<Dialog.Title textAlign="center" fontFamily="heading">
									{editedEvent ? 'Edit your event' : 'Add new event'}
								</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<VStack gap={4}>
									<Field invalid={!!errors.title} errorText={errors.title?.message}>
										<InputGroup startElement={<CaseSensitive />} w="full">
											<Input {...register('title')} ps={12} placeholder="Title" />
										</InputGroup>
									</Field>
									<Field>
										<Controller
											name="isAllDay"
											control={control}
											render={({ field: { name, onChange, value } }) => (
												<Switch
													name={name}
													checked={value}
													onChange={onChange}
													w="full"
													colorPalette="blue"
													justifyContent="space-between"
													flexDirection="row-reverse"
												>
													All day
												</Switch>
											)}
										/>
									</Field>
									<Field invalid={!!errors.endDate} errorText={errors.endDate?.message}>
										<Flex flexDirection="row" alignItems="center" gap={8} maxW="full">
											<Input {...register('startDate')} type="date" />
											<MoveRight width={80} />
											<Input {...register('endDate')} type="date" />
										</Flex>
									</Field>
									{!isAllDaySelected && (
										<Field invalid={!!errors.endTime} errorText={errors.endTime?.message}>
											<Flex flexDirection="row" alignItems="center" gap={8} w="full">
												<Input {...register('startTime')} type="time" />
												<MoveRight width={80} />
												<Input {...register('endTime')} type="time" />
											</Flex>
										</Field>
									)}
									<Field>
										<Textarea minH={10} placeholder="Description" {...register('description')} />
									</Field>
									<Field>
										<InputGroup startElement={<MapPin />} w="full">
											<Input {...register('location')} ps={12} placeholder="Location" />
										</InputGroup>
									</Field>
									<Field>
										<Controller
											name="repeat"
											control={control}
											render={({ field: { name, onChange, value } }) => (
												<SelectRoot
													name={name}
													value={value}
													onValueChange={({ value }) => onChange(value)}
													collection={repeatFrequencyCollection}
												>
													<SelectTrigger>
														<SelectValueText />
													</SelectTrigger>
													<SelectContent portalRef={contentRef}>
														{repeatFrequencyCollection.items.map(item => (
															<SelectItem item={item} key={item.value}>
																{item.label}
															</SelectItem>
														))}
													</SelectContent>
												</SelectRoot>
											)}
										/>
									</Field>
								</VStack>
							</Dialog.Body>
							<Dialog.Footer>
								<Dialog.ActionTrigger asChild>
									<Button
										type="button"
										variant="outline"
										onClick={event => event.stopPropagation()}
									>
										Cancel
									</Button>
								</Dialog.ActionTrigger>
								<Button
									type="submit"
									colorPalette="blue"
									minWidth={16}
									disabled={isSubmitting || !isEventModified}
									onClick={event => event.stopPropagation()}
								>
									{editedEvent ? 'Edit' : 'Add'}
								</Button>
							</Dialog.Footer>
							<Dialog.CloseTrigger asChild>
								<CloseButton size="sm" />
							</Dialog.CloseTrigger>
						</form>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}
