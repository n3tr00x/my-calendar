import { ReactElement, RefAttributes } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

import {
	DialogActionTrigger,
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

type EventSearchPopoverProps = {
	alertTriggerComponent: ReactElement<ButtonProps & RefAttributes<HTMLButtonElement>>;
	description: string | JSX.Element;
	action: () => void;
};

export function AlertDialog({
	alertTriggerComponent,
	description,
	action,
}: EventSearchPopoverProps) {
	return (
		<DialogRoot role="alertdialog" placement="bottom" closeOnInteractOutside>
			<DialogTrigger asChild>{alertTriggerComponent}</DialogTrigger>
			<DialogContent mx={{ base: 2, sm: 0 }}>
				<DialogHeader>
					<DialogTitle>Are you sure?</DialogTitle>
				</DialogHeader>
				<DialogBody>{description}</DialogBody>
				<DialogFooter>
					<DialogActionTrigger asChild>
						<Button variant="outline">Cancel</Button>
					</DialogActionTrigger>
					<Button colorPalette="red" onClick={action}>
						Delete
					</Button>
				</DialogFooter>
				<DialogCloseTrigger />
			</DialogContent>
		</DialogRoot>
	);
}
