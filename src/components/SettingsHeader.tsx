import { Link } from 'react-router-dom';
import { Flex, Heading } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function SettingsHeader() {
	return (
		<Flex
			as="header"
			p={2}
			gap={4}
			alignItems="center"
			borderBottom="1px solid"
			borderColor="gray.muted"
		>
			<Button variant="ghost" asChild>
				<Link to="/">
					<ArrowLeft />
				</Link>
			</Button>
			<Heading size="xl" textTransform="uppercase">
				Settings
			</Heading>
		</Flex>
	);
}
