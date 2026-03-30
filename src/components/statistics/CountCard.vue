<template>
	<div class="count-card">
		<div class="header">
			<span>{{ props.title }}</span>
			<el-tooltip :content="props.tips" placement="top" effect="dark">
				<el-icon color="#409EFC"> <Warning /> </el-icon>
			</el-tooltip>
		</div>

		<div class="content">
			<span> ￥</span>
			<span ref="count1Ref" class="count">{{ props.number1 }}</span>
		</div>

		<div class="footer">
			<span>{{ props.subtitle }}</span>
			<span>￥</span>
			<span ref="count2Ref">{{ props.number2 }}</span>
		</div>
	</div>
</template>

<script setup>
import { defineProps, ref, onMounted } from "vue";
import { Warning } from "@element-plus/icons";
import { CountUp } from "countup.js";

const props = defineProps({
	title: {
		type: String,
		default: "本月物流总收入",
	},
	tips: {
		type: String,
		default: "本月物流总收入",
	},
	number1: {
		type: Number,
		default: 509989,
	},
	number2: {
		type: Number,
		default: 509989,
	},
});

const count1Ref = ref();
const count2Ref = ref();

const countOption = {
	prefix: props.amount === "saleroom" ? "¥" : "",
};
onMounted(() => {
	const countup1 = new CountUp(count1Ref.value, props.number1, countOption);
	const countup2 = new CountUp(count2Ref.value, props.number2, countOption);

	countup1.start();
	countup2.start();
});
</script>

<style lang="less" scoped>
.count-card {
	display: flex;
	flex-direction: column;
	padding: 0 20px;
	height: 130px;
	background: white;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	.header {
		display: flex;
		height: 38px;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.45);
		justify-content: space-between;
		align-items: flex-end; //y轴靠下
	}
	.content {
		display: flex;
		margin-left: 0px;
		font-size: 26px;
		color: rgba(0, 0, 0, 0.85);
		flex: 1;
		align-items: center;
	}
	.footer {
		display: flex;
		height: 38px;
		line-height: 38px;
		font-size: 14px;
		letter-spacing: 1px;
		color: rgba(0, 0, 0, 0.85);
		border-top: 1px solid #f0f0f0;
	}
}
</style>
