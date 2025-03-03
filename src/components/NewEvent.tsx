import { ReactElement, RefAttributes, useEffect, useRef } from 'react';
import { Controller, useForm, UseFormGetValues } from 'react-hook-form';
import {
	ButtonProps,
	createListCollection,
	DialogRootProvider,
	Flex,
	Input,
	Textarea,
	useDialog,
	useDisclosure,
	VStack,
} from '@chakra-ui/react';
import { MenuOpenChangeDetails } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppwriteException } from 'appwrite';
import { CaseSensitive, MapPin, MoveRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DialogActionTrigger,
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
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
import { useAuth } from '@/hooks/useAuth';
import { useDate } from '@/hooks/useDate';
import { NewEventSchema } from '@/schemas/NewEventSchema';
import { Event, NewEvent, NewEventForm } from '@/types/appwrite';
import { addHoursAndResetMinutes, formatDateToYearMonthDay } from '@/utilities/date';

// const dirtyFields: Partial<Readonly<{
//   title?: boolean | undefined;
//   isAllDay?: boolean | undefined;
//   startDate?: boolean | undefined;
//   endDate?: boolean | undefined;
//   startTime?: boolean | undefined;
//   endTime?: boolean | undefined;
//   description?: boolean | undefined;
//   location?: boolean | undefined;
//   repeat?: boolean[] | undefined;
// }>>

export type DirtyField = {
	[K in keyof NewEventForm]: K extends 'repeat' ? boolean[] : boolean;
};

export type DirtyFields = Partial<DirtyField>;

export type NewEventFieldNames = keyof NewEventForm;

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

const getEditedFields = (dirtyFields: DirtyFields, getValuesFn: UseFormGetValues<NewEventForm>) => {
	return Object.keys(dirtyFields).reduce((acc, currentValue) => {
		const field = currentValue as keyof NewEventForm;
		return { ...acc, [currentValue]: getValuesFn(field) };
	}, {} as Partial<NewEventForm>);
};

type NewEventModalProps = {
	editedEvent?: Event;
	dialogTriggerComponent: ReactElement<ButtonProps & RefAttributes<HTMLButtonElement>>;
};

export function NewEventModal({ dialogTriggerComponent, editedEvent }: NewEventModalProps) {
	console.log('<NewEventModal /> render.');
	const { date } = useDate();
	const { user } = useAuth();
	const { open, onOpen, onClose, setOpen } = useDisclosure();
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
		formState: { errors, dirtyFields },
	} = useForm<NewEventForm>({
		resolver: zodResolver(NewEventSchema),
		defaultValues: {
			title: editedEvent ? editedEvent.title : '',
			isAllDay: editedEvent ? editedEvent.isAllDay : false,
			startDate: editedEvent ? editedEvent.startDate : formatDateToYearMonthDay(date),
			endDate: editedEvent ? editedEvent.endDate : formatDateToYearMonthDay(date),
			startTime: editedEvent ? editedEvent.startTime : addHoursAndResetMinutes(date),
			endTime: editedEvent ? editedEvent.endTime : addHoursAndResetMinutes(date, 2),
			location: editedEvent ? editedEvent.location : null,
			description: editedEvent ? editedEvent.description : null,
			repeat: editedEvent ? [editedEvent.repeat] : ['no-repeat'],
		},
	});

	const toggleEventFormHandler = ({ open }: MenuOpenChangeDetails) => {
		setOpen(open);
		if (open && editedEvent) {
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
		}
	};

	const isAllDaySelected = watch('isAllDay');
	const startTime = watch('startTime');

	useEffect(() => {
		setValue('startDate', formatDateToYearMonthDay(date));
		setValue('endDate', formatDateToYearMonthDay(date));
	}, [date, setValue]);

	useEffect(() => {
		if (isAllDaySelected) {
			setValue('startTime', null);
			setValue('endTime', null);
		} else {
			setValue('startTime', editedEvent ? editedEvent.startTime : addHoursAndResetMinutes(date));
			setValue('endTime', editedEvent ? editedEvent.endTime : addHoursAndResetMinutes(date, 2));
		}
	}, [isAllDaySelected, setValue, date, editedEvent]);

	useEffect(() => {
		if (startTime) {
			const newEndTime = calculateEndTime(startTime);
			setValue('endTime', newEndTime);
		}
	}, [startTime, setValue]);

	const editEventHandler = async () => {
		onClose();
		const modifiedFields = getEditedFields(dirtyFields, getValues);
		try {
			if (editedEvent) {
				await editEvent({ eventId: editedEvent.$id, editedEvent: modifiedFields });

				return toaster.create({
					title: 'The event has been edited correctly!',
					type: 'success',
					placement: 'bottom-end',
					duration: 4000,
				});
			}
		} catch (error) {
			if (error instanceof AppwriteException) {
				return toaster.create({
					title: 'An edit event problem',
					type: 'error',
					description: error?.message,
					placement: 'bottom-end',
					duration: 4000,
				});
			}
		} finally {
			reset();
		}
	};

	const submitHandler = async (event: NewEventForm) => {
		onClose();
		try {
			const newEvent: NewEvent = {
				...event,
				user: user?.$id,
				accountId: user?.accountId,
			};

			await addNewEvent(newEvent);

			return toaster.create({
				title: 'The event has been added!',
				type: 'success',
				placement: 'bottom-end',
				duration: 4000,
			});
		} catch (error) {
			if (error instanceof AppwriteException) {
				return toaster.create({
					title: 'New event problem',
					type: 'error',
					description: error?.message,
					placement: 'bottom-end',
					duration: 4000,
				});
			}
		} finally {
			reset();
		}
	};

	return (
		<DialogRoot size="xs" open={open} onOpenChange={toggleEventFormHandler}>
			<DialogTrigger asChild onClick={onOpen}>
				{dialogTriggerComponent}
			</DialogTrigger>
			<DialogContent ref={contentRef} zIndex={999}>
				<form onSubmit={editedEvent ? handleSubmit(editEventHandler) : handleSubmit(submitHandler)}>
					<DialogHeader>
						<DialogTitle textAlign="center" fontFamily="heading">
							{editedEvent ? 'Edit your event' : 'Add new event'}
						</DialogTitle>
					</DialogHeader>
					<DialogBody>
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
					</DialogBody>
					<DialogFooter>
						<DialogActionTrigger asChild>
							<Button variant="outline" onClick={event => event.stopPropagation()}>
								Cancel
							</Button>
						</DialogActionTrigger>
						<Button
							type="submit"
							colorPalette="blue"
							minWidth={16}
							onClick={event => event.stopPropagation()}
						>
							{editedEvent ? 'Edit' : 'Add'}
						</Button>
					</DialogFooter>
					<DialogCloseTrigger />
				</form>
			</DialogContent>
		</DialogRoot>
	);
}
