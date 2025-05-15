import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ColorModeProvider } from '@/components/ui/color-mode';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';

import App from './App';
import { system } from './theme';

const root = document.getElementById('root')!;
const queryClient = new QueryClient({
	defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

createRoot(root).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={true} />
			<ChakraProvider value={system}>
				<ColorModeProvider enableSystem>
					<AuthProvider>
						<App />
						<Toaster />
					</AuthProvider>
				</ColorModeProvider>
			</ChakraProvider>
		</QueryClientProvider>
	</StrictMode>,
);
