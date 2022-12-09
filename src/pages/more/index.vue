<!--
 * @Author: wangqz
 * @Date: 2022-09-29
 * @LastEditTime: 2022-12-04
 * @Description: 更多
-->

<template>
	<view class="me-main">
		<view class="bg"></view>
		<view class="actionlist">
			<view>
				<Cell title="用户评价" is-link @click="comment">
					<template v-slot:icon>
						<nut-icon class="icon" name="star-n"></nut-icon>
					</template>
				</Cell>
				<Cell title="检查更新" is-link @click="checkUpdate">
					<template v-slot:icon>
						<nut-icon class="icon" font-class-name="iconfont" class-prefix="icon" name="zidongqingli" />
					</template>
				</Cell>
				<Cell title="分享好友" is-link open-type="share">
					<template v-slot:title>
						<button class="cust-btn" open-type="share">分享好友</button>
					</template>
					<template v-slot:icon>
						<nut-icon class="icon" font-class-name="iconfont" class-prefix="icon" name="fenxiangxiao" />
					</template>
				</Cell>
				<Cell title="问题反馈" is-link>
					<template v-slot:title>
						<button class="cust-btn" open-type="feedback">问题反馈</button>
					</template>
					<template v-slot:icon>
						<nut-icon class="icon" font-class-name="iconfont" class-prefix="icon" name="fankui" />
					</template>
				</Cell>

				<view class="text"></view>
				<view class="text"></view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { Cell } from "@nutui/nutui-taro";
import Taro from "@tarojs/taro";
import { updateMiniApp } from "../../utils";
import { modalAlert, showLoading } from "../../utils/tips";
definePageConfig({
	navigationBarTitleText: "更多",
	enableShareAppMessage: true,
});

Taro.useShareAppMessage(() => {
	return {
		title: "航道桥梁通",
		path: "/pages/bridge/index",
	};
});

// 检查更新
const checkUpdate = async () => {
	showLoading(true);
	const hasUpdate = await updateMiniApp();
	showLoading(false);
	!hasUpdate && modalAlert("恭喜! 当前版本已经是最新版");
};

// 用户评价
const comment = () => {
	Taro.navigateTo({
		url: "/pages/more/comment",
	});
};
</script>

<style lang="scss">
.me-main {
	width: 100wh;
	height: 100vh;
	background-color: #f4f1f1;
	.bg {
		height: 50vh;
		width: 100%;
		background-image: url("//njzz.rongtuyun.com/static/images/bridge-webapp/more-bg.gif");
		background-repeat: no-repeat;
		background-size: cover;
	}
	.actionlist {
		background-color: white;
	}
	.icon {
		width: 22px;
		height: 22px;
	}
	.cust-btn {
		width: 100%;
		height: 20px;
		display: inline;
		background-color: transparent;
		border: 0px;
		text-align: left;
		margin: 0px;
		padding: 0px;
		font-size: 14px;
		line-height: inherit;
	}
	.cust-btn::after {
		border: 0px !important;
	}
}
</style>
