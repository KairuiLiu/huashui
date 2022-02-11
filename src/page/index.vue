<template>
	<router-view class="routerview"></router-view>
</template>

<script setup lang="ts">
import { defineComponent, onBeforeMount } from 'vue';

onBeforeMount(() => {
	if (localStorage.getItem('config') === null)
		localStorage.setItem(
			'config',
			JSON.stringify({
				working: false,
				backgroundColor: 'rgba(81, 92, 107, 1)',
				color: '#e5e5e5',
				setTime: 180,
				timeRest: 180,
				disabled: false,
				mutex: false,
				scale: window.devicePixelRatio || 1,
			})
		);
});
</script>

<script lang="ts">
export default defineComponent({
	name: 'Index',
});
</script>

<style lang="less" scoped>
.routerview {
	height: 100%;
}
</style>
