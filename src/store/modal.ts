import { create } from 'zustand';

import { Event } from '@/types/appwrite';

type EventModalStore = {
	open: boolean;
	editedEvent: Event | null;
	onEventFormOpen: (event?: Event) => void;
	onEventFormClose: () => void;
	onSetEventFormState: (open: boolean) => void;
};

export const useModal = create<EventModalStore>(set => ({
	open: false,
	editedEvent: null,
	onEventFormOpen: event => set({ open: true, editedEvent: event ?? null }),
	onEventFormClose: () => set({ open: false, editedEvent: null }),
	onSetEventFormState: (open: boolean) => set({ open }),
}));
