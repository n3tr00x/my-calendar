import { Box } from '@chakra-ui/react';
import { addMonths, subMonths } from 'date-fns';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as TSwiper } from 'swiper/types';

import { Sheet } from '@/components/Sheet';
import { useDate } from '@/hooks/useDate';
import { getStartOfNextMonth, getStartOfPreviousMonth } from '@/utilities/date';

import 'swiper/css';

export function Calendar() {
	console.log('<Calendar /> render.');
	const { date: selectedDate, onDateChange } = useDate();

	const slideChangeHandler = (swiper: TSwiper) => {
		const activeIndex = swiper.activeIndex;

		if (activeIndex === 0) {
			onDateChange(prevDate => getStartOfPreviousMonth(prevDate));
		} else if (activeIndex === 2) {
			onDateChange(prevDate => getStartOfNextMonth(prevDate));
		}

		swiper.slideTo(1);
	};

	return (
		<Box id="calendar" mx={2}>
			<Swiper speed={0} initialSlide={1} onSlideChange={slideChangeHandler}>
				<SwiperSlide>
					<Sheet selectedDate={subMonths(selectedDate, 1)} />
				</SwiperSlide>
				<SwiperSlide>
					<Sheet selectedDate={selectedDate} />
				</SwiperSlide>
				<SwiperSlide>
					<Sheet selectedDate={addMonths(selectedDate, 1)} />
				</SwiperSlide>
			</Swiper>
		</Box>
	);
}
