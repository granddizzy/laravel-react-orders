import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    server: {
        host: '0.0.0.0',  // Оставляем 0.0.0.0, чтобы он слушал на всех интерфейсах.
        port: 5173,
        hmr: {
            host: 'localhost',  // Подключение для hot reload.
        },
    },
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
            ],
            refresh: true,
        }),
    ],
});
