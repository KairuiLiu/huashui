<template>
	<div ref="updateWapper" class="updateWapper" onselectstart="return false" @click.right.prevent="toggleCursor" @dragstart.prevent="() => false" @select.prevent="() => false">
		<div ref="updateContent" class="updateContent">
			<div class="rotate">
				<div class="item"></div>
				<div class="item"></div>
				<div class="item"></div>
				<div class="item"></div>
				<div class="item"></div>
			</div>
			<div class="text" v-html="stat.updateText"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { IConfig } from '@/types/config';

const router = useRouter();
const config = ref();
const stat = reactive({
	process: 0,
	userScale: 1,
	updateText: null,
});
const updateWapper = ref(null);
const updateContent = ref(null);
function updateConf(v: IConfig) {
	if (sessionStorage.getItem('config')) sessionStorage.setItem('config', JSON.stringify(v));
	localStorage.setItem('config', JSON.stringify(v));
}
function toggleCursor() {
	updateWapper.value.classList.toggle('no-cursor');
}
window.onresize = () => {
	updateContent.value.style.transform = `scale(${(1 / (window.devicePixelRatio || 1)) * stat.userScale})`;
	return false;
};
onMounted(() => {
	config.value = sessionStorage.getItem('config') ? JSON.parse(sessionStorage.getItem('config') as string) : (JSON.parse(localStorage.getItem('config') as string) as IConfig);
	updateWapper.value.style.backgroundColor = config.value.backgroundColor;
	updateWapper.value.style.color = config.value.color;
	stat.userScale = config.value.scale / (window.devicePixelRatio || 1);
	updateContent.value.style.transform = `scale(${1 / config.value.scale})`;
	stat.updateText = computed(() => {
		if (config.value.working) return `更新正在进行中。<br/>你已完成${stat.process}%。<br/>请保持计算机打开状态。`;
		return `正在重新启动`;
	});
	if (!config.value?.working) router.replace('config');
	const intervalId = setInterval(() => {
		if (config.value.mutex) {
			config.value.timeRest = Math.max(0, config.value.timeRest - 0.5);
			config.value.lastPost = Date.now();
			stat.process = 100 - Number.parseInt(((config.value.timeRest / config.value.setTime) * 100) / 5, 10) * 5;
			if (config.value.timeRest <= 0) {
				clearInterval(intervalId);
				config.value.working = false;
				config.value.mutex = 0;
			}
			updateConf(config.value);
		} else {
			config.value = JSON.parse(localStorage.getItem('config') as string) as IConfig;
			stat.process = 100 - Number.parseInt(((config.value.timeRest / config.value.setTime) * 100) / 5, 10) * 5;
			if (config.value.timeRest <= 0 || config.value.working === false) {
				clearInterval(intervalId);
			}
			if (Date.now() - config.value.lastPost > 1500) {
				config.value.mutex = 1;
				sessionStorage.removeItem('config');
				updateConf(config.value);
			}
		}
	}, 500);
});
</script>

<script lang="ts">
export default defineComponent({
	name: 'Work',
});
</script>

<style lang="less" scoped>
.updateWapper {
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.updateContent {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	font-size: 30px;
	gap: 30px;
	font-family: 'Microsoft Yahei UI', 'Microsoft Yahei', 'SimHei', sans-serif;
	overflow: visible;
}

.no-cursor {
	cursor: none;
}

.rotate {
	position: relative;
	width: 90px;
	height: 90px;
	.item {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		animation: rotateItem 4s linear infinite;
		&::after {
			content: '';
			display: block;
			width: 8px;
			height: 8px;
			background-color: #fff;
			border-radius: 50%;
		}
		&:nth-child(1) {
			animation-delay: 0.15s;
		}
		&:nth-child(2) {
			animation-delay: 0.3s;
		}
		&:nth-child(3) {
			animation-delay: 0.45s;
		}
		&:nth-child(4) {
			animation-delay: 0.6s;
		}
		&:nth-child(5) {
			animation-delay: 0.75s;
		}
	}
}

@keyframes rotateItem {
	75% {
		transform: rotate(600deg);
	}
	79% {
		transform: rotate(720deg);
		opacity: 1;
	}
	80% {
		transform: rotate(720deg);
		opacity: 0;
	}
	100% {
		transform: rotate(810deg);
		opacity: 0;
	}
}

.text {
	width: 100%;
	white-space: nowrap;
	line-height: 1.2;
}
</style>
