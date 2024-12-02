import { Outlet } from 'react-router-dom';
import { Box, Container, Heading, Highlight, HStack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import firstSliderImage from '@/assets/slider/slider-1.jpg';
import secondSliderImage from '@/assets/slider/slider-2.jpg';
import thirdSliderImage from '@/assets/slider/slider-3.jpg';
import { Carousel } from '@/components/Carousel';

const CAROUSEL_ITEMS = [
	{
		image: firstSliderImage,
		title: 'Stay On Track!',
		keywordTitle: 'on track!',
		description: 'Stay organized and never miss an event with our easy-to-use calendar.',
		keywords: ['Stay organized', 'easy-to-use'],
	},
	{
		image: secondSliderImage,
		title: 'Balance Life!',
		keywordTitle: 'balance',
		description: 'Manage your work, personal life, and more in one simple app.',
		keywords: ['simple app', 'manage'],
	},
	{
		image: thirdSliderImage,
		title: 'Plan with Ease!',
		keywordTitle: 'ease!',
		description: 'Plan your day, week, or month with just a few taps.',
		keywords: ['plan', 'a few taps.'],
	},
];

export function AuthLayout() {
	console.log('<AuthLayout /> render');

	return (
		<Container maxW="container.lg" minH="100vh" centerContent justifyContent="center">
			<HStack w="100%" p={6} h="inherit" shadow="xl" gap={8} minH="536px">
				<Box
					w="50%"
					bg="gray.100"
					alignSelf="stretch"
					rounded="lg"
					overflow="hidden"
					display={{ base: 'none', md: 'block' }}
				>
					<Carousel intervalTime={6000}>
						{CAROUSEL_ITEMS.map((item, index) => (
							<Box key={index} h="full">
								<Box h="220px" overflow="hidden">
									<motion.img
										src={item.image}
										animate={{ scale: [1, 1.2, 1] }}
										transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse' }}
									/>
								</Box>
								<Box p={4}>
									<Heading fontWeight={500} textAlign="center" my={2}>
										<Highlight
											query={item.keywordTitle}
											styles={{ color: 'primary.500', fontWeight: 600 }}
										>
											{item.title}
										</Highlight>
									</Heading>
									<Text lineHeight="taller" fontSize="xl">
										<Highlight
											query={item.keywords}
											styles={{
												px: '2',
												py: '1',
												rounded: 'full',
												bg: 'primary.500',
												color: 'white',
											}}
										>
											{item.description}
										</Highlight>
									</Text>
								</Box>
							</Box>
						))}
					</Carousel>
				</Box>
				<Box w={{ base: 'full', md: '50%' }}>
					<Outlet />
				</Box>
			</HStack>
		</Container>
	);
}
