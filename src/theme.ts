import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

import '@fontsource-variable/inter';
import '@fontsource-variable/raleway';

const config: ThemeConfig = {
	initialColorMode: 'system',
	useSystemColorMode: false,
};

export const theme = extendTheme({
	config,
	colors: {
		primary: {
			50: '#e3f2fd',
			100: '#bbdefb',
			200: '#90caf9',
			300: '#64b5f6',
			400: '#42a5f5',
			500: '#4A90E2', // main primary color
			600: '#1e88e5',
			700: '#1976d2',
			800: '#1565c0',
			900: '#0d47a1',
		},
		secondary: {
			50: '#e0f7fa',
			100: '#b2ebf2',
			200: '#80deea',
			300: '#4dd0e1',
			400: '#26c6da',
			500: '#50E3C2', // main secondary color
			600: '#00acc1',
			700: '#0097a7',
			800: '#00838f',
			900: '#006064',
		},
		accent: {
			500: '#F5A623',
		},
		neutral: {
			500: '#2E3A59', // main dark gray for text
			100: '#F7FAFC', // light background
		},
		success: {
			500: '#38A169',
		},
		warning: {
			500: '#D69E2E',
		},
		error: {
			500: '#E53E3E',
		},
		background: {
			light: '#F7FAFC',
			dark: '#1A202C',
		},
	},
	fonts: {
		heading: `'Raleway', sans-serif`,
		body: `'Inter', sans-serif`,
	},
	styles: {
		global: (props: { colorMode: string }) => ({
			body: {
				bg: props.colorMode === 'dark' ? 'background.dark' : 'background.light',
				color: props.colorMode === 'dark' ? 'neutral.100' : 'neutral.500',
			},
		}),
	},
});
