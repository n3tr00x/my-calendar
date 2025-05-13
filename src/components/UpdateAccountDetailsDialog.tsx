import { ReactElement, ReactNode, RefAttributes, useRef } from 'react';
import { ButtonProps, Dialog, Portal } from '@chakra-ui/react';

import { Button } from '@/components/ui/button';

type UpdateAccountDetailsDialogProps = {
	children: ReactNode;
	title: string;
	trigger: ReactElement<ButtonProps & RefAttributes<HTMLButtonElement>>;
};

export function UpdateAccountDetailsDialog({
	children,
	title,
	trigger,
}: UpdateAccountDetailsDialogProps) {
	const ref = useRef<HTMLInputElement>(null);

	return (
		<Dialog.Root initialFocusEl={() => ref.current}>
			<Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>{title}</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body pb="4">{children}</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button variant="outline">Cancel</Button>
							</Dialog.ActionTrigger>
							<Button type="submit" form="update-account-details-form" colorPalette="blue">
								{title}
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}
