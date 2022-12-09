<template>
	<view class="main">
		<view class="title">模拟人生</view>
		<view class="body">
			<view class="bg"></view>
		</view>
		<view class="foot">
			<nut-button type="success" @click="gameOver">开始游戏</nut-button>
		</view>
	</view>
</template>

<script setup>
import Taro, { useDidShow, useLoad, useShareAppMessage } from "@tarojs/taro";
import { onMounted, reactive } from "vue";
import { bridgeList, followBridge, getWxOpenid, wechatLogin } from "../../api/bridge-api";
import { tokenStore } from "../../store/token";
import { modalAlert, modalConfirm, showLoading, toastOk } from "../../utils/tips";
import { check } from "../../utils/check";
import { money, debounce } from "../../utils";
import { Empty, Popup } from "@nutui/nutui-taro";
import { stringifyUrl } from "query-string";

definePageConfig({
	navigationBarTitleText: "welcome",
	navigationBarBackgroundColor: "#6d81fb",
	navigationBarTextStyle: "white",
	enableShareAppMessage: true,
});

useShareAppMessage(() => {
	return {
		title: "模拟人生",
		path: "/pages/welcome/index",
	};
});

const state = reactive({
	result: { list: [], count: 0 },
	bridgeCount: 0,
	sortVisible: false,
	sort: {
		active: "0",
	},
	queryType: "All",
	queryParams: {
		where: "",
		pagesize: 20,
		sorts: {
			screenName: 0, // 1.升序;-1.降序; 0.不排序
			groupName: 0,
			waterlevel: 0,
		},
	},
});

const gameOver = () => {
	modalAlert("over! 你点了个按钮把自己累死了!");
};
</script>

<style lang="scss">
$mainHeight: 97vh;
$mainWidth: 100wh;
$searchBarHeight: 50px;
.main {
	height: $mainHeight;
	width: $mainWidth;
	background-color: #6d81fb;
	padding-top: 3vh;
	.title {
		color: white;
		font-size: 70px;
		text-align: center;
		width: 100%;
	}
	.body {
		display: flex;
		justify-content: center;
		.bg {
			height: 50vh;
			width: 50vh;
			border-radius: 50%;
			background-image: url(https://djgo.cc/static/imgs/min-app/cat.gif);
			background-size: cover;
		}
	}
	.foot {
		margin-top: 20px;
		display: flex;
		justify-content: center;
		font-size: large;
	}
}
</style>
