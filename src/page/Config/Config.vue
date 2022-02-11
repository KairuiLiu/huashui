<template>
	<div class="common-layout">
		<el-container>
			<el-header class="header">
				<div class="left">划水 - 将您的电脑伪装为系统更新</div>
				<div class="right"><a href="https://github.com/KairuiLiu/huashui">去GitHub了解更多</a></div>
			</el-header>
			<el-main>
				<div class="config">
					<el-form ref="ruleFormRef" label-width="120px" :rules="rules" :model="config">
						<el-form-item label="划水时间(秒)" prop="setTime">
							<el-input v-model.number="config.setTime" type="number"></el-input>
						</el-form-item>
						<el-form-item label="背景色">
							<el-color-picker v-model="config.backgroundColor" show-alpha :predefine="predefineColors" />
						</el-form-item>
						<el-form-item label="前景色">
							<el-color-picker v-model="config.color" show-alpha :predefine="predefineColors" />
						</el-form-item>
						<el-form-item>
							<el-button @click="clearMutexProcess">清空主进程</el-button>
							<el-button type="primary" @click="handleSubmit(ruleFormRef)">🏄🏼开始划水</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div id="write" class="useage">
					<h4 id="使用指南"><span>使用指南</span></h4>
					<ol>
						<li>打开页面后配置划水时间, 需要显示的前景色与背景色(提供windows预设的主题色表)</li>
						<li>点击开始划水就可以进入划水页面了</li>
						<li>按下F11将网页全屏, 右键即可切换鼠标是否显示</li>
						<li>
							如果您需要多屏显示: 在已有的划水页面(称之为主应用)后再打开一个新的划水页面(我们称之为从应用). 在从应用配置时, 若是检测到存在主应用则会提示您是否跟随显示
							<ul>
								<li><span>选择&quot;是&quot;, 从应用将直接开始划水, 并与主应用页面同步显示</span></li>
								<li><span>选择&quot;否&quot;, 您可以创建一个仅对该会话有效的划水页面, 该页面不会跟随主应用状态, 不会被其他摸鱼页面检测到</span></li>
							</ul>
						</li>
						<li>
							关于主应用与从应用
							<ul>
								<li><span>只能有一个主应用</span></li>
								<li><span>在配置页面中, 网页会自动判断是否有主应用存在, 如果没有则自动设为主应用</span></li>
								<li><span>在主应用结束计时并退出之前, 主应用将一直占用主应用名额(即使意外关闭)</span></li>
								<li><span>当主从应用都在工作且从应用设置为跟随模式时, 如果从应用检测到主应用被意外关闭, 从应用会自动切换为主应用为其他从应用服务</span></li>
								<li>
									<span
										>当主应用被意外退出, 且没有从应用接管时, 主应用工作状态将会被保存, 当您下次打开划水页面时, 您仍可以恢复执行(先根据提示进入从应用跟随模式, 然后从应用会自动切换为主应用).
										您也可以设置不恢复执行, 这需要您在配置中点击清空主进程来清除主应用执行状态.</span
									>
								</li>
							</ul>
						</li>
					</ol>
				</div>
			</el-main>
		</el-container>
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
import { ColorOps } from './colors';

type FormInstance = InstanceType<typeof ElForm>;
const ruleFormRef = ref<FormInstance>();
const config = ref(JSON.parse(localStorage.getItem('config') as string) as IConfig);
const predefineColors = ref(ColorOps);
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
					callback(new Error('划水时间设置错误'));
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
	router.replace('work');
}
function clearMutexProcess() {
	localStorage.removeItem('config');
	router.go(0);
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
	width: 10vw;
	min-width: 380px;
}

.common-layout .el-header,
.common-layout .el-footer {
	background-color: #b3c0d1;
	color: var(--el-text-color-primary);
	text-align: center;
	line-height: 60px;
}

.common-layout .el-main {
	background-color: #e9eef3;
	color: var(--el-text-color-primary);
	text-align: center;
	line-height: 160px;
}

.common-layout > .el-container {
	margin-bottom: 40px;
}

.header {
	display: flex;
	justify-content: space-between;
	.left {
		font-size: 20px;
	}
	.right a {
		color: #fff;
		text-decoration: none;
	}
}

.useage {
	text-align: left;
	line-height: 1.5;
}
</style>
