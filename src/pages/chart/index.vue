<!--
 * @Author: wangqz
 * @Date: 2022-10-07
 * @LastEditTime: 2022-12-05
 * @Description: 数据页面
-->
<template>
	<view class="detail">
		<view class="body">
			<view class="comment">
				<view class="flex-between">
					<view>评价统计</view>
				</view>
				<view class="w-canvas">
					<EChart @register="regPieChart" />
				</view>
			</view>
			<view class="access">
				<view class="flex-between">
					<view>访问分析</view>
					<view>
						<nut-radiogroup v-model="state.dateRange" @change="getVisitAnalysis" direction="horizontal">
							<nut-radio shape="button" label="2">近一年</nut-radio>
							<nut-radio shape="button" label="1">近七天</nut-radio>
							<nut-radio shape="button" label="0">昨天</nut-radio>
						</nut-radiogroup>
					</view>
				</view>
				<view class="w-canvas">
					<EChart @register="regLineChart" />
				</view>
			</view>
		</view>
	</view>
</template>
<style lang="scss">
.w-canvas {
	position: relative;
	top: 0px;
	width: 100%;
	height: 40vh;
}
.detail {
	width: 100%;
	height: 130vh;
	background-color: #fbfbfb;
	background-color: #fbfbfb;
	display: flex;
	justify-content: center;
	.body {
		width: 92%;
		height: fit-content;
	}

	.comment {
		padding: 10px;
		margin-top: 10px;
		height: 50vh;
		border-radius: 6px;
		background-color: white;
		box-shadow: 1px 2px 3px #d0d0d0;
	}
	.access {
		padding: 10px;
		margin-top: 10px;
		height: 50vh;
		border-radius: 6px;
		background-color: white;
		box-shadow: 1px 2px 3px #d0d0d0;
	}
}
</style>
<script setup>
import { reactive } from "vue";
import { EChart } from "../../components/ec-canvas";
import { useDidShow } from "@tarojs/taro";
import dayjs from "dayjs";
import { commentStatistics, visitStatistics } from "../../api/bridge-api";
import { useEcharts } from "../../components/ec-canvas/echart/hooks";
import { check } from "../../utils/check";
import { handleLineOpt, handlePieOpt } from "./data";

definePageConfig({
	navigationBarTitleText: "数据",
});

const [regLineChart, { setOption: setLineOpt }] = useEcharts();
const [regPieChart, { setOption: setPieOpt }] = useEcharts();

const state = reactive({
	dateRange: "1", // 0:昨天, 1:近一周,  2:近一年
});

// 查询访问范围
const getVisitAnalysis = async () => {
	const condition = {
		begindate: "", // 开始日期
		enddate: dayjs().format("YYYY-MM-DD"), // 结束日期
	};
	if (state.dateRange == "0") condition.begindate = dayjs().subtract(1, "day").format("YYYY-MM-DD");
	if (state.dateRange == "1") condition.begindate = dayjs().subtract(7, "day").format("YYYY-MM-DD");
	if (state.dateRange == "2") condition.begindate = dayjs().subtract(1, "year").format("YYYY-MM-DD");
	const { status, data } = await visitStatistics({ condition });
	check({ status }).success(() => {
		const opt = {
			xAxisData: [],
			seriesCount: [],
			seriesUser: [],
		};
		for (let i = 0; i < data.list.length; i++) {
			const item = data.list[i];
			opt.xAxisData.push(dayjs(item.visitDate).format("MM-DD"));
			opt.seriesCount.push(item.visitCount);
			opt.seriesUser.push(item.visitUsers);
		}
		setLineOpt(handleLineOpt(opt));
	});
};

// 获取评价统计
const getComment = async () => {
	const { status, data } = await commentStatistics();
	check({ status }).success(() => {
		const lib = {
			1: "无数据",
			3: "一般",
			5: "有用",
		};
		const seriesData = data.list.map(({ commentGrade, count }) => ({ name: lib[commentGrade], value: count }));
		setPieOpt(handlePieOpt(seriesData));
	});
};

useDidShow(() => {
	getComment();
	getVisitAnalysis();
});
</script>
