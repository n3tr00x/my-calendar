import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

import '@fontsource-variable/inter';

const config: ThemeConfig = {
	initialColorMode: 'system',
	useSystemColorMode: false,
};

export const chakraCustomTheme = extendTheme({
	config,
	fonts: {
		heading: `'Inter', sans-serif`,
		body: `'Inter', sans-serif`,
	},
});
