import { ReactNode, useCallback, useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

type CarouselProps = {
	children: ReactNode[];
	intervalTime?: number;
};

export function Carousel({ children, intervalTime = 7000 }: CarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [direction, setDirection] = useState<'LEFT' | 'RIGHT'>('RIGHT');

	const previousButtonHandler = () => {
		setDirection('LEFT');
		const prevIndex = (currentIndex === 0 ? children.length : currentIndex) - 1;
		setCurrentIndex(prevIndex);
	};

	const nextButtonHandler = useCallback(() => {
		setDirection('RIGHT');
		const nextIndex = (currentIndex + 1) % children.length;
		setCurrentIndex(nextIndex);
	}, [children.length, currentIndex]);

	useEffect(() => {
		const interval = setInterval(() => {
			nextButtonHandler();
		}, intervalTime);

		return () => clearInterval(interval);
	}, [intervalTime, nextButtonHandler]);

	return (
		<Box pos="relative" h="full">
			<Box h="full">
				<AnimatePresence mode="wait">
					<motion.div
						key={currentIndex}
						initial={{ x: direction === 'RIGHT' ? 300 : -300, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: direction === 'RIGHT' ? -300 : 300, opacity: 0 }}
						transition={{ duration: 0.1 }}
						style={{ height: 'inherit' }}
					>
						{children[currentIndex]}
					</motion.div>
				</AnimatePresence>
			</Box>
			<Flex
				pos="absolute"
				bottom={0}
				left={0}
				right={0}
				justify="center"
				align="center"
				gap={2}
				m={1}
			>
				<IconButton aria-label="previous element" onClick={previousButtonHandler}>
					<ChevronLeftIcon />
				</IconButton>
				{Array.from(children, (_, index) => (
					<Box
						key={index}
						rounded="full"
						w={2}
						aspectRatio={1}
						bgColor={currentIndex === index ? 'primary.500' : 'gray.400'}
					></Box>
				))}
				<IconButton aria-label="next element" onClick={nextButtonHandler}>
					<ChevronRightIcon />
				</IconButton>
			</Flex>
		</Box>
	);
}
