import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/tests/setupTests.js",
		include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}", "tests/**/*.{test,spec}.{js,jsx,ts,tsx}"],
		coverage: {
			reporter: ["text", "html"], // shows % in terminal and generates HTML report
			reportsDirectory: "./coverage", // optional, where HTML report will go
		},
	},
});
