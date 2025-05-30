import { RefAttributes } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { PlusIcon } from 'lucide-react';

export function AddEventMobileButton(props: ButtonProps & RefAttributes<HTMLButtonElement>) {
	return (
		<Button
			aria-label="add event button"
			variant="subtle"
			colorPalette="blue"
			alignSelf="end"
			rounded="full"
			size="xl"
			aspectRatio="square"
			{...props}
		>
			<PlusIcon />
		</Button>
	);
}
