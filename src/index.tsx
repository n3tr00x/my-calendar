import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { theme } from './theme';

const root = document.getElementById('root')!;
const queryClient = new QueryClient();

createRoot(root).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ChakraProvider theme={theme}>
				<AuthProvider>
					<App />
				</AuthProvider>
			</ChakraProvider>
		</QueryClientProvider>
	</StrictMode>,
);
