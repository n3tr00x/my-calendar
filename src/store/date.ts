import { setHours } from 'date-fns';
import { create } from 'zustand';

type CalendarStore = {
	selectedDate: Date;
	updateSelectedDate: (date: Date) => void;
};

const useCalendarStore = create<CalendarStore>(set => ({
	selectedDate: setHours(new Date(), new Date().getHours()),
	updateSelectedDate: date => set({ selectedDate: date }),
}));

export const useSelectedDate = () => useCalendarStore(state => state.selectedDate);
export const useUpdateSelectedDate = () => useCalendarStore(state => state.updateSelectedDate);
