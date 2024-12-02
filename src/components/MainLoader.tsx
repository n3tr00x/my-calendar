import { Container } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import logo from '@/assets/logo.png';

export function MainLoader() {
	return (
		<Container minH="100vh" centerContent justifyContent="center">
			<motion.img
				src={logo}
				alt="logo"
				animate={{
					scale: [1, 1.25, 1],
				}}
				transition={{
					duration: 2.5,
					repeat: Infinity,
					ease: 'linear',
				}}
			/>
		</Container>
	);
}
