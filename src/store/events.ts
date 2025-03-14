import { create } from 'zustand';

import { Event } from '@/types/appwrite';

type RepeatedEventsStore = {
	repeatedEvents: Event[];
	updateRepeatedEvents: (event: Event[]) => void;
};

const useRepeatedEventsStore = create<RepeatedEventsStore>(set => ({
	repeatedEvents: [],
	updateRepeatedEvents: events =>
		set(state => {
			console.log('useRepeatedEventsStore');
			const eventMap = new Map(
				state.repeatedEvents
					.filter(event => event.repeat !== 'no-repeat')
					.map(event => [event.$id, event]),
			);
			events.forEach(event => {
				if (event.repeat !== 'no-repeat') {
					eventMap.set(event.$id, event);
				} else {
					eventMap.delete(event.$id);
				}
			});
			return { repeatedEvents: Array.from(eventMap.values()) };
		}),
}));

export const useRepeatedEvents = () => useRepeatedEventsStore(state => state.repeatedEvents);
export const useUpdateRepeatedEvents = () =>
	useRepeatedEventsStore(state => state.updateRepeatedEvents);
