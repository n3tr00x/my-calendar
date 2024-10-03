import { Outlet } from 'react-router-dom';
import { Box, Container, Heading, Highlight, HStack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import firstSliderImage from '@/assets/slider/slider-1.jpg';
import secondSliderImage from '@/assets/slider/slider-2.jpg';
import thirdSliderImage from '@/assets/slider/slider-3.jpg';
import { Carousel } from '@/components/Carousel';

export function AuthLayout() {
	console.log('<SignUpPage /> render.');

	return (
		<Container maxW="container.lg" minH="100vh" centerContent justifyContent="center">
			<HStack w="100%" p={6} h="inherit" shadow="lg" gap={8} minH="536px">
				<Box
					w="50%"
					bg="gray.100"
					alignSelf="stretch"
					rounded="lg"
					overflow="hidden"
					display={{ base: 'none', md: 'block' }}
				>
					<Carousel intervalTime={6000}>
						<Box h="full">
							<Box h="220px" overflow="hidden">
								<motion.img
									src={firstSliderImage}
									animate={{ scale: [1, 1.2, 1] }}
									transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse' }}
								/>
							</Box>
							<Box p={4}>
								<Heading fontWeight={500} textAlign="center" my={2}>
									<Highlight query="on track!" styles={{ color: 'cyan.400', fontWeight: 600 }}>
										Stay On Track!
									</Highlight>
								</Heading>
								<Text lineHeight="taller" fontSize="xl">
									<Highlight
										query={['Stay organized', 'easy-to-use']}
										styles={{ px: '2', py: '1', rounded: 'full', bg: 'cyan.400', color: 'white' }}
									>
										Stay organized and never miss an event with our easy-to-use calendar.
									</Highlight>
								</Text>
							</Box>
						</Box>
						<Box h="full">
							<Box h="220px" overflow="hidden">
								<motion.img
									src={secondSliderImage}
									animate={{ scale: [1, 1.2, 1] }}
									transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse' }}
								/>
							</Box>
							<Box p={4}>
								<Heading fontWeight={500} textAlign="center" my={2}>
									<Highlight query="balance" styles={{ color: 'cyan.400', fontWeight: 600 }}>
										Balance Life!
									</Highlight>
								</Heading>
								<Text lineHeight="taller" fontSize="xl">
									<Highlight
										query={['simple app', 'manage']}
										styles={{ px: '2', py: '1', rounded: 'full', bg: 'cyan.400', color: 'white' }}
									>
										Manage your work, personal life, and more in one simple app.
									</Highlight>
								</Text>
							</Box>
						</Box>
						<Box height="full">
							<Box h="220px" overflow="hidden">
								<motion.img
									src={thirdSliderImage}
									animate={{ scale: [1, 1.2, 1] }}
									transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse' }}
								/>
							</Box>
							<Box p={4}>
								<Heading fontWeight={500} textAlign="center" my={2}>
									<Highlight query="ease!" styles={{ color: 'cyan.400', fontWeight: 600 }}>
										Plan with Ease!
									</Highlight>
								</Heading>
								<Text lineHeight="taller" fontSize="xl">
									<Highlight
										query={['plan', 'a few taps.']}
										styles={{ px: '2', py: '1', rounded: 'full', bg: 'cyan.400', color: 'white' }}
									>
										Plan your day, week, or month with just a few taps.
									</Highlight>
								</Text>
							</Box>
						</Box>
					</Carousel>
				</Box>
				<Box w={{ base: 'full', md: '50%' }}>
					<Outlet />
				</Box>
			</HStack>
		</Container>
	);
}
