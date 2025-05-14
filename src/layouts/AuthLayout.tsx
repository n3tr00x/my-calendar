import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Container, Flex, Heading, Highlight, HStack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import firstSliderImage from '@/assets/slider/slider-1.jpg';
import secondSliderImage from '@/assets/slider/slider-2.jpg';
import thirdSliderImage from '@/assets/slider/slider-3.jpg';
import { Carousel } from '@/components/Carousel';
import { MainLoader } from '@/components/MainLoader';
import { useAuth } from '@/hooks/useAuth';

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
		keywords: ['simple app.', 'manage'],
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
	const navigate = useNavigate();
	const { user, isAuthenticated, isLoading } = useAuth();

	useEffect(() => {
		if (!isLoading && user && isAuthenticated) {
			navigate('/', { replace: true });
		}
	}, [user, isAuthenticated, isLoading, navigate]);

	if (isLoading || (user && isAuthenticated)) {
		return <MainLoader />;
	}

	return (
		<Container maxW="5xl" minH="100vh" centerContent justifyContent="center">
			<HStack w="100%" p={6} h="inherit" shadow="xl" gap={8} minH="524px">
				<Box
					w="50%"
					alignSelf="stretch"
					rounded="lg"
					overflow="hidden"
					display={{ base: 'none', md: 'block' }}
				>
					<Carousel intervalTime={6000}>
						{CAROUSEL_ITEMS.map((item, index) => (
							<Box key={index} h="full">
								<Box h="268px" overflow="hidden">
									<motion.img
										src={item.image}
										animate={{ scale: [1, 1.2, 1] }}
										transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse' }}
									/>
								</Box>
								<Box p={4}>
									<Heading fontWeight={700} textAlign="center" my={2} size="2xl">
										<Highlight
											query={item.keywordTitle}
											styles={{ color: 'blue.solid', fontWeight: 600 }}
										>
											{item.title}
										</Highlight>
									</Heading>
									<Text lineHeight="taller" fontSize="xl">
										<Highlight
											query={item.keywords}
											styles={{
												px: 2,
												bg: 'blue.solid',
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
				<Flex w={{ base: 'full', md: '50%' }} direction="column" justify="center">
					<Outlet />
				</Flex>
			</HStack>
		</Container>
	);
}
