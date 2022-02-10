import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'index',
		component: () => import('../page/index.vue'),
		redirect: '/config',
		children: [
			{
				path: '/config',
				name: 'config',
				component: () => import('../page/Config/Config.vue'),
			},
			{
				path: '/work',
				name: 'work',
				component: () => import('../page/Work/Work.vue'),
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
