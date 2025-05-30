import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import removeConsole from 'vite-plugin-remove-console';

import pkg from './package.json';

export default defineConfig({
	plugins: [react(), removeConsole()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	define: {
		__APP_NAME__: JSON.stringify(pkg.name),
		__APP_VERSION__: JSON.stringify(pkg.version),
		__APP_AUTHOR__: JSON.stringify(pkg.author),
	},
});
