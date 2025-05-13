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
	trigger: ReactElement<ButtonProps & RefAttributes<HTMLButtonElement>>;
	title: string | JSX.Element;
	description: string | JSX.Element;
	action: () => void;
	actionButtonLabel: string;
};

export function AlertDialog({
	trigger,
	title,
	description,
	action,
	actionButtonLabel,
}: EventSearchPopoverProps) {
	return (
		<DialogRoot role="alertdialog" placement="bottom" closeOnInteractOutside>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent mx={{ base: 2, sm: 0 }}>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<DialogBody>{description}</DialogBody>
				<DialogFooter>
					<DialogActionTrigger asChild>
						<Button variant="outline">Cancel</Button>
					</DialogActionTrigger>
					<Button colorPalette="red" onClick={action}>
						{actionButtonLabel}
					</Button>
				</DialogFooter>
				<DialogCloseTrigger />
			</DialogContent>
		</DialogRoot>
	);
}
