<template>
	{{ config }}
	<div class="config">
		<el-form ref="ruleFormRef" label-width="120px" :rules="rules" :model="config">
			<el-form-item label="划水时间" prop="setTime">
				<el-input v-model.number="config.setTime" type="number"></el-input>
			</el-form-item>
			<el-form-item label="背景色">
				<el-color-picker v-model="config.backgroundColor" show-alpha :predefine="predefineColors" />
			</el-form-item>
			<el-form-item label="前景色">
				<el-color-picker v-model="config.color" show-alpha :predefine="predefineColors" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleSubmit(ruleFormRef)">开始摸鱼</el-button>
			</el-form-item>
		</el-form>
	</div>
	<el-dialog v-model="stat.mutexDialogVisible" title="同步数据到另一个划水页面" width="30%">
		<span>检测到当前已存在划水页面, 是否与其同步显示数据, 这可以帮助您解决双屏更新进度不同步问题<br />(选择"否"则创建一个仅对当前页面有效的划水页面)</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="stat.mutexDialogVisible = false">否</el-button>
				<el-button type="primary" @click="toNext">好的</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { ElForm } from 'element-plus';
import { IConfig } from '../../types/config';

type FormInstance = InstanceType<typeof ElForm>;
const ruleFormRef = ref<FormInstance>();
const config = ref(JSON.parse(localStorage.getItem('config') as string) as IConfig);
const predefineColors = ref(['#ffffff', '#000000', '#e5e5e5']);
const router = useRouter();
const stat = reactive({
	mutexDialogVisible: false,
	isRetinue: true,
});
const rules = reactive({
	setTime: [
		{
			validator: (rule: any, value: any, callback: any) => {
				if (value <= 0) {
					callback(new Error('摸鱼时间设置错误'));
				} else callback();
			},
			trigger: 'blur',
		},
	],
});
function handleSubmit(formEl: FormInstance | undefined) {
	if (!formEl) return;
	formEl.validate(valid => {
		if (valid) {
			stat.isRetinue = false;
			toNext();
		} else {
			return false;
		}
		return true;
	});
}
function toNext() {
	config.value.working = true;
	config.value.timeRest = config.value.setTime;
	if (config.value.mutex) {
		config.value.mutex = !stat.isRetinue;
		sessionStorage.setItem('config', JSON.stringify(config.value));
	} else {
		config.value.mutex = true;
		localStorage.setItem('config', JSON.stringify(config.value));
	}
	router.push('work');
}
onMounted(() => {
	sessionStorage.removeItem('config');
	if (config.value.mutex) {
		stat.mutexDialogVisible = true;
	}
});
</script>

<script lang="ts">
export default defineComponent({
	name: 'Config',
});
</script>

<style lang="less" scoped>
.config {
	width: 50vw;
	min-width: 380px;
}
</style>
