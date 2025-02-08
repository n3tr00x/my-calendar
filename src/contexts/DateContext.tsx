import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from 'react';
import { setHours } from 'date-fns';

type IDateContext = {
	date: Date;
	onDateChange: Dispatch<SetStateAction<Date>>;
};

const INITIAL_DATE_CONTEXT_STATE = {
	date: new Date(),
	onDateChange: () => {},
};

export const DateContext = createContext<IDateContext>(INITIAL_DATE_CONTEXT_STATE);

export function DateContextProvider({ children }: PropsWithChildren) {
	const today = new Date();
	const [date, setDate] = useState(setHours(today, new Date().getHours()));

	return (
		<DateContext.Provider
			value={{
				date,
				onDateChange: setDate,
			}}
		>
			{children}
		</DateContext.Provider>
	);
}
