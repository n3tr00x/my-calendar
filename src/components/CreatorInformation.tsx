import { LuGithub, LuLinkedin } from 'react-icons/lu';
import { Box, Grid, Heading, Text } from '@chakra-ui/react';

import { Button } from '@/components/ui/button';

export function CreatorInformation() {
	const socials = [
		{
			icon: <LuGithub />,
			label: 'GitHub',
			href: 'https://github.com/n3tr00x',
			bg: '#333',
			hoverBg: '#444',
		},
		{
			icon: <LuLinkedin />,
			label: 'LinkedIn',
			href: 'https://linkedin.com/in/hubert-warchol',
			bg: '#0077B5',
			hoverBg: '#005f94',
		},
	];

	return (
		<Box as="section" my={4}>
			<Heading as="h2" mb={4} size="lg">
				About the Creator
			</Heading>
			<Text mb={4} fontSize="sm" color="gray.500">
				Built with ❤️ by Hubert Warchoł — a frontend developer who enjoys building clean UIs and
				intuitive UX.
			</Text>
			<Grid templateColumns="repeat(2, 1fr)" gap={4}>
				{socials.map(item => (
					<Button
						key={item.label}
						asChild
						bg={item.bg}
						_hover={{ bg: item.hoverBg }}
						color="white"
						size={{ base: 'xs', sm: 'sm' }}
						width="full"
					>
						<a href={item.href} target="_blank" rel="noopener noreferrer">
							{item.icon} {item.label}
						</a>
					</Button>
				))}
			</Grid>
		</Box>
	);
}
