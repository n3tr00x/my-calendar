import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

import '@fontsource-variable/inter';
import '@fontsource-variable/raleway';

const config = defineConfig({
	theme: {
		tokens: {
			colors: {
				blue: {
					50: { value: '#e3f2fd' },
					100: { value: '#bbdefb' },
					200: { value: '#90caf9' },
					300: { value: '#64b5f6' },
					400: { value: '#42a5f5' },
					500: { value: '#4A90E2' }, // main primary color
					600: { value: '#1e88e5' },
					700: { value: '#1976d2' },
					800: { value: '#1565c0' },
					900: { value: '#0d47a1' },
				},
			},
			fonts: {
				heading: { value: `'Raleway', sans-serif` },
				body: { value: `'Inter', sans-serif` },
			},
		},
	},
});

export const system = createSystem(defaultConfig, config);
