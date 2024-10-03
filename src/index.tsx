import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import { chakraCustomTheme as theme } from '@/theme.ts';

import App from './App';

const root = document.getElementById('root')!;

createRoot(root).render(
	<StrictMode>
		<ChakraProvider theme={theme}>
			<App />
		</ChakraProvider>
	</StrictMode>,
);
