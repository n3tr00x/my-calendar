import { ReactElement, RefAttributes, useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
	ButtonProps,
	createListCollection,
	Flex,
	Input,
	Spinner,
	Textarea,
	VStack,
} from '@chakra-ui/react';
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
import { useAddNewEvent } from '@/hooks/appwrite';
import { useAuth } from '@/hooks/useAuth';
import { useDate } from '@/hooks/useDate';
import { NewEventSchema } from '@/schemas/NewEventSchema';
import { NewEventForm } from '@/types/appwrite';
import { addHoursAndResetMinutes, formatDateToYearMonthDay } from '@/utilities/date';

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

type NewEventModalProps = {
	dialogTriggerComponent: ReactElement<ButtonProps & RefAttributes<HTMLButtonElement>>;
};

export function NewEventModal({ dialogTriggerComponent }: NewEventModalProps) {
	console.log('<NewEventModal /> render.');
	const { date } = useDate();
	const { user } = useAuth();
	const { mutateAsync: addNewEvent } = useAddNewEvent();
	const contentRef = useRef<HTMLDivElement>(null);

	const {
		register,
		control,
		watch,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<NewEventForm>({
		resolver: zodResolver(NewEventSchema),
		defaultValues: {
			title: '',
			isAllDay: false,
			startDate: formatDateToYearMonthDay(date),
			endDate: formatDateToYearMonthDay(date),
			startTime: addHoursAndResetMinutes(date),
			endTime: addHoursAndResetMinutes(date, 2),
			location: null,
			description: null,
			repeat: ['no-repeat'],
		},
	});

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
			setValue('startTime', addHoursAndResetMinutes(date, 1));
			setValue('endTime', addHoursAndResetMinutes(date, 2));
		}
	}, [isAllDaySelected, setValue, date]);

	useEffect(() => {
		if (startTime) {
			const newEndTime = calculateEndTime(startTime);
			setValue('endTime', newEndTime);
		}
	}, [startTime, setValue]);

	const submitHandler = async (event: NewEventForm) => {
		try {
			const newEvent = {
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
		<DialogRoot size="xs">
			<DialogTrigger asChild>{dialogTriggerComponent}</DialogTrigger>
			<DialogContent ref={contentRef}>
				<form onSubmit={handleSubmit(submitHandler)}>
					<DialogHeader>
						<DialogTitle textAlign="center" fontFamily="heading">
							Add new event
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
							<Button variant="outline">Cancel</Button>
						</DialogActionTrigger>
						<Button type="submit" colorPalette="blue" minWidth={16}>
							{isSubmitting ? <Spinner colorPalette="blue" size="sm" /> : 'Add'}
						</Button>
					</DialogFooter>
					<DialogCloseTrigger />
				</form>
			</DialogContent>
		</DialogRoot>
	);
}
