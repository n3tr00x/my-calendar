import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { createListCollection, Input, VStack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaseSensitive, MapPin, MoveRight, Plus } from 'lucide-react';
import { z } from 'zod';

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
import { useDate } from '@/hooks/useDate';
import { addHoursAndResetMinutes, formatToISODate } from '@/utilities/date';

const NewEventSchema = z.object({
	title: z.string().min(1, 'Title is required').trim(),
	allDay: z.boolean(),
	startDate: z.string(),
	endDate: z.string(),
	startTime: z.string().nullable(),
	endTime: z.string().nullable(),
	location: z.string().nullable(),
	repeat: z.string().array(),
});

const repeatFrequencyCollection = createListCollection({
	items: [
		{ label: "Don't repeat", value: 'default' },
		{ label: 'Everyday', value: 'daily' },
		{ label: 'Every week', value: 'weekly' },
		{ label: 'Every monthly', value: 'monthly' },
	],
});

export function NewEventModal() {
	const { date } = useDate();
	const contentRef = useRef<HTMLDivElement>(null);

	const {
		register,
		control,
		watch,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<z.infer<typeof NewEventSchema>>({
		resolver: zodResolver(NewEventSchema),
		defaultValues: {
			title: '',
			allDay: false,
			startDate: formatToISODate(date),
			endDate: formatToISODate(date),
			startTime: addHoursAndResetMinutes(date),
			endTime: addHoursAndResetMinutes(date, 2),
			location: null,
			repeat: ['default'],
		},
	});

	const isAllDaySelected = watch('allDay');

	if (isAllDaySelected) {
		setValue('startTime', null);
		setValue('endTime', null);
	} else {
		setValue('startTime', addHoursAndResetMinutes(date, 1));
		setValue('endTime', addHoursAndResetMinutes(date, 2));
	}

	const onSubmit = (data: z.infer<typeof NewEventSchema>) => {
		console.log(data);
	};

	return (
		<DialogRoot size="xs">
			<DialogTrigger asChild>
				<Button variant="outline" colorPalette="blue" w="full" justifyContent="flex-start">
					<Plus /> Add event
				</Button>
			</DialogTrigger>
			<DialogContent ref={contentRef}>
				<form onSubmit={handleSubmit(onSubmit)}>
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
									name="allDay"
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
							<Field display="flex" flexDirection="row" alignItems="center" gap={8}>
								<Input {...register('startDate')} type="date" />
								<MoveRight width={80} />
								<Input {...register('endDate')} type="date" />
							</Field>
							{!isAllDaySelected && (
								<Field display="flex" flexDirection="row" alignItems="center" gap={8}>
									<Input {...register('startTime')} type="time" />
									<MoveRight width={80} />
									<Input {...register('endTime')} type="time" />
								</Field>
							)}
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
						<Button type="submit" colorPalette="blue">
							Save
						</Button>
					</DialogFooter>
					<DialogCloseTrigger />
				</form>
			</DialogContent>
		</DialogRoot>
	);
}
