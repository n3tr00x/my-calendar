import { ReactElement, RefAttributes } from 'react';
import { ButtonProps, Highlight } from '@chakra-ui/react';
import { AppwriteException } from 'appwrite';

import { AlertDialog } from '@/components/AlertDialog';
import { toaster } from '@/components/ui/toaster';
import { useRemoveEvent } from '@/hooks/appwrite';
import { Event } from '@/types/appwrite';

type DeleteEventAlertDialogProps = {
	trigger: ReactElement<ButtonProps & RefAttributes<HTMLButtonElement>>;
	event: Event;
};

export function DeleteEventAlertDialog({ trigger, event }: DeleteEventAlertDialogProps) {
	const { mutateAsync: removeEvent } = useRemoveEvent();

	const deleteEventHandler = () => {
		toaster.promise(removeEvent(event.$id), {
			success: { title: 'The event has been removed!' },
			error: error => ({
				title: 'Something went wrong',
				description: error instanceof AppwriteException ? error.message : 'An unexpected error',
			}),
			loading: { title: 'Removing event...' },
		});
	};

	return (
		<AlertDialog
			trigger={trigger}
			action={deleteEventHandler}
			actionButtonLabel="Delete"
			title="Delete event"
			description={
				<Highlight query={event.title} styles={{ fontWeight: 'semibold' }}>
					{`Are you sure you want to delete ${event.title} event? This action cannot be undone.`}
				</Highlight>
			}
		/>
	);
}
