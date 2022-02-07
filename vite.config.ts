import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import styleImport from 'vite-plugin-style-import';
import Components from 'unplugin-vue-components/vite'; // 自动化组件引入
import configs from './src/configs';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), Components({})],
	server: {
		host: '0.0.0.0',
		proxy: {
			'/api': {
				target: configs.proxyUrl,
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, ''),
			},
		},
	},
	resolve: {
		// 配置路径别名
		alias: {
			'@': path.resolve(__dirname, './src'),
			comps: path.resolve(__dirname, './src/components'),
			pages: path.resolve(__dirname, './src/pages'),
			utils: path.resolve(__dirname, './src/utils'),
			configs: path.resolve(__dirname, './src/configs'),
			store: path.resolve(__dirname, './src/store'),
		},
		extensions: ['.js', '.json', '.ts'], // 使用路径别名时想要省略的后缀名，可以自己 增减
	},
	build: {
		terserOptions: {
			compress: {
				//生产环境时移除console
				drop_console: true,
				drop_debugger: true,
			},
		},
		// 取消计算文件大小，加快打包速度
		brotliSize: false,
		sourcemap: true,
		// assetsDir: 'static/img',
		rollupOptions: {
			output: {
				chunkFileNames: 'js/[name]-[hash].js',
				entryFileNames: 'js/[name]-[hash].js',
				assetFileNames: '[ext]/[name]-[hash].[ext]',
			},
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@import "@/assets/styles/main.scss";',
			},
			less: {
				javascriptEnabled: true,
			},
		},
	},
});
