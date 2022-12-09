<!--
 * @Author: wangqz
 * @Date: 2022-10-06
 * @LastEditTime: 2022-12-04
 * @Description: content
-->

<template>
	<view class="main">
		<nut-cell title="评价等级">
			<nut-radiogroup v-model="state.commentGrade" direction="horizontal">
				<nut-radio label="5">有用</nut-radio>
				<nut-radio label="3">一般</nut-radio>
				<!-- <nut-radio label="1">无数据</nut-radio> -->
			</nut-radiogroup>
		</nut-cell>
		<nut-cell>
			<TextArea placeholder="请输入反馈意见" v-model="state.commentExplain"></TextArea>
		</nut-cell>
		<nut-cell>
			<nut-button block type="primary" @click="submit"> 提交</nut-button>
		</nut-cell>
	</view>
</template>
<style>
.main {
	height: 100vh;
	width: 100wh;
}
</style>
<script setup>
import { TextArea } from "@nutui/nutui-taro";
import { reactive, toRaw } from "vue";
import { commentCommit } from "../../api/bridge-api";
import { check } from "../../utils/check";
import dayjs from "dayjs";

definePageConfig({
	navigationBarTitleText: "用户评价",
});

const state = reactive({
	commentGrade: "5",
	commentExplain: "",
	time: dayjs().format("YYYY-MM-DD"),
});

const submit = async () => {
	const postData = {
		...toRaw(state),
	};
	console.log("postData log==>", postData);
	const { status } = await commentCommit({ data: postData });
	check({ status, okMsg: "提交成功!", backWait: 1500 });
};
</script>
