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
				backgroundColor: '#1c1d21',
				color: '#e5e5e5',
				setTime: 10,
				timeRest: 10,
				disabled: false,
				mutex: false,
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
