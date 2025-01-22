import { Button, Flex, Input } from '@chakra-ui/react';
import { Plus } from 'lucide-react';

export function AddEvent() {
	const today = new Date();
	const day = today.getDate();
	const month = today.toLocaleString('en-US', { month: 'short' });

	return (
		<Flex as="form" m={2} justifyContent="space-between" onSubmit={event => event.preventDefault()}>
			<Input placeholder={`Add event at ${day} ${month}`} maxW="240px" flex="1" />
			<Button colorPalette="blue">
				<Plus />
			</Button>
		</Flex>
	);
}
