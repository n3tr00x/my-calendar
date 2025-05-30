import { Box } from '@chakra-ui/react';
import { addMonths, subMonths } from 'date-fns';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as TSwiper } from 'swiper/types';

import { Sheet } from '@/components/Sheet';
import { useEvents } from '@/hooks/appwrite';
import { useSelectedDate, useUpdateSelectedDate } from '@/store/date';
import { getStartOfNextMonth, getStartOfPreviousMonth } from '@/utilities/date';

import 'swiper/css';

export function Calendar() {
	console.log('<Calendar /> render.');
	const selectedDate = useSelectedDate();
	const eventsQuery = useEvents(selectedDate);
	const updateSelectedDate = useUpdateSelectedDate();

	const visibleMonths = [subMonths(selectedDate, 1), selectedDate, addMonths(selectedDate, 1)];

	const slideChangeHandler = (swiper: TSwiper) => {
		const activeIndex = swiper.activeIndex;

		if (activeIndex === 0) {
			updateSelectedDate(getStartOfPreviousMonth(selectedDate));
		} else if (activeIndex === 2) {
			updateSelectedDate(getStartOfNextMonth(selectedDate));
		}

		swiper.slideTo(1, 0, false);
	};

	return (
		<Box as="section" id="calendar" height={{ lg: 'full' }}>
			<Swiper
				initialSlide={1}
				onSlideChange={slideChangeHandler}
				spaceBetween={24}
				style={{ height: 'inherit' }}
			>
				{visibleMonths.map(month => (
					<SwiperSlide key={month.getTime()}>
						<Sheet selectedDate={month} eventsQuery={eventsQuery} />
					</SwiperSlide>
				))}
			</Swiper>
		</Box>
	);
}
