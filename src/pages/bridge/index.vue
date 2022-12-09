<template>
	<view class="main">
		<view class="searchbar">
			<view class="icon">
				<nut-icon size="30" color="#6D81FB" font-class-name="iconfont" class-prefix="icon" name="search" />
			</view>
			<input class="input" :value="state.queryParams.where" @change="search" type="text" placeholder="搜索... 桥梁，地区，航道" />
		</view>
		<view class="list">
			<view class="sortbar">
				<nut-button size="small" :color="state.queryType == 'All' ? '#0281FB' : ''" @click="query('All')">
					全部 <template v-if="state.queryType == 'All'">( {{ state.bridgeCount }} )</template>
				</nut-button>
				<nut-button size="small" :color="state.queryType == 'Follow' ? '#0281FB' : ''" icon="s-follow" @click="query('Follow')">
					已关注 <template v-if="state.queryType == 'Follow'">( {{ state.bridgeCount }} )</template>
				</nut-button>
				<nut-button size="small" :color="state.sort.active != '0' ? '#0281FB' : ''" icon="screen-little" @click="sortShow">
					<span v-if="state.sort.active == '-1'">{{ state.sort.name }} 降序</span>
					<span v-else-if="state.sort.active == '1'">{{ state.sort.name }} 升序</span>
					<span v-else="state.sort.active == '0'">{{ state.sort.name }} 排序</span>
				</nut-button>
			</view>
			<scroll-view class="scroll-view_H" :scroll-y="true" @scrolltolower="onScrollToLower">
				<view v-for="item in state.result.list" :id="item.deviceCode" @click="showDetail(item)" class="scroll-view-item">
					<view class="flex-between">
						<view>
							<view class="title">{{ item.screenName }}</view>
							<view class="subtitle">{{ item.groupName }}</view>
						</view>
						<view>
							<view class="number">{{ item.waterlevelStr }} m </view>
						</view>
						<view class="follow" @click="follow(item, $event)">
							<nut-icon v-if="item.follow == '0'" size="23" color="#d2d2d2" name="s-follow" />
							<nut-icon v-else size="23" color="#FA200C" name="heart-fill" />
						</view>
					</view>
					<view>
						<view class="foot">{{ item.waterlevelTime }}</view>
						<view class="foot">{{ item.address }}</view>
					</view>
				</view>
				<Empty v-if="state.result.list && !state.result.list.length" image="empty" description="无内容"> </Empty>
				<nut-divider dashed>{{ state.result.list.length == state.result.count ? "没有更多了" : "下拉加载更多" }}</nut-divider>
			</scroll-view>
		</view>

		<Popup v-model:visible="state.sortVisible" :duration="0" position="bottom" closeable round :style="{ height: '55%' }" safe-area-inset-bottom>
			<view class="popup-body p-sm">
				<view class="sortpop flex-between" v-for="item in menuItems">
					<view>
						{{ item.name }}
					</view>
					<view> <nut-button @click="sortChoose(item, '-1')" :type="item.active == '-1' ? 'primary' : 'default'" size="small" plain>降序</nut-button> <nut-button @click="sortChoose(item, '1')" plain size="small" :type="item.active == '1' ? 'primary' : 'default'">升序</nut-button> </view>
				</view>
				<view class="p-sm flex-center">
					<nut-button @click="sortChoose(item, '0')" block type="warning" size="small" plain>取消排序</nut-button>
				</view>
			</view>
		</Popup>
	</view>
</template>

<script setup>
import Taro, { useDidShow, useLoad, useShareAppMessage } from "@tarojs/taro";
import { onMounted, reactive } from "vue";
import { bridgeList, followBridge, getWxOpenid, wechatLogin } from "../../api/bridge-api";
import { tokenStore } from "../../store/token";
import { modalAlert, modalConfirm, showLoading } from "../../utils/tips";
import { check } from "../../utils/check";
import { money, debounce } from "../../utils";
import { Empty, Popup } from "@nutui/nutui-taro";
import { stringifyUrl } from "query-string";

definePageConfig({
	navigationBarTitleText: "首页",
	navigationBarBackgroundColor: "#6d81fb",
	navigationBarTextStyle: "white",
	enableShareAppMessage: true,
});

useShareAppMessage(() => {
	return {
		title: "航道桥梁通",
		path: "/pages/bridge/index",
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

// active  1.升序;-1.降序; 0.不排序
const menuItems = reactive([
	{
		name: "桥梁名称",
		field: "screenName",
		active: "0",
	},
	{
		name: "净空高度",
		field: "waterlevel",
		active: "0",
	},
	{
		name: "航道",
		field: "groupName",
		active: "0",
	},
]);

// 查询
const query = async (type) => {
	if (type) state.queryType = type;
	const { where, sorts, pagesize } = state.queryParams;
	const params = {
		session_token: tokenStore.getToken(),
		begin: 0,
		pagesize,
		where,
		sorts,
		filters: {},
	};
	const result = await bridgeList(params, state.queryType);
	result.data.list.map((item) => {
		item.waterlevelStr = money(item.waterlevel / 1000);
		return item;
	});
	state.result = result.data;
	state.bridgeCount = result.data.count;
	showLoading(false);
};

// 搜索
const search = debounce((e) => {
	state.queryParams.where = e.target.value;
	query();
}, 800);

// 显示排序
const sortShow = () => {
	state.sortVisible = !state.sortVisible;
};

// 排序选中
const sortChoose = (record, active) => {
	if (active == "0") {
		state.sort = {
			active: "0",
		};
	}
	menuItems.forEach((item) => {
		if (active != "0" && record.field == item.field) {
			item.active = active;
			state.sort = item;
		} else {
			item.active = "0";
		}
	});
	state.sortVisible = false;
	state.queryParams.sorts = {
		[state.sort.field]: state.sort.active,
	};
	query();
};

// token 检查
const tokenCheck = () => {
	return new Promise(async (resolve) => {
		const openid = tokenStore.getOpenid();
		if (openid) {
			const { data } = await wechatLogin({ openid });
			tokenStore.setToken(data.authcode);
			resolve(data.authcode);
		} else {
			Taro.login({
				success: async (res) => {
					if (res.code) {
						const result = await getWxOpenid({ code: res.code });
						const { data } = await wechatLogin({ openid: result.data.openid });
						tokenStore.setOpenid(result.data.openid);
						tokenStore.setToken(data.authcode);
						resolve(data.authcode);
					} else {
						console.log("登录失败！" + res.errMsg);
					}
				},
				fail: () => {
					modalAlert("微信登录失败请重新打开小程序!");
				},
			});
		}
	});
};

// 桥梁详情
const showDetail = (record) => {
	Taro.navigateTo({
		url: stringifyUrl({ url: "/pages/bridge/detail", query: record }),
	});
};

// 收藏桥梁
const follow = async (record, e) => {
	e.stopPropagation();
	const postData = {
		deviceCode: [record.deviceCode], // 设备号
	};
	if (record.follow == "0") {
		const { status } = await followBridge({ data: postData }, "add");
		check({ status, okMsg: "收藏成功!", okFnDely: [800, query] });
	} else {
		modalConfirm("确认要取消收藏吗?", async () => {
			const { status } = await followBridge({ data: postData }, "cancel");
			check({ status, okMsg: " 取消成功!", okFnDely: [800, query] });
		});
	}
};

// 滚动到底部
const onScrollToLower = (e) => {
	console.log("到底了 log==>", e);
	showLoading(true);
	state.queryParams.pagesize += 20;
	query();
};

useDidShow(async () => {
	await tokenCheck();
	query();
});
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
	.searchbar {
		margin: 0% 5%;
		background-color: white;
		border-radius: 10px;
		width: 90%;
		height: $searchBarHeight;
		display: flex;
		align-items: center;
		.icon {
			padding: 0px 10px;
		}
		.input {
			width: inherit;
			height: 50px;
		}
	}
	.list {
		background-color: #fbfbfb;
		border-radius: 30px 30px 0px 0px;
		width: 100%;
		position: absolute;
		bottom: 0px;
		height: calc($mainHeight - $searchBarHeight - 20px);
		.sortbar {
			width: 100%;
			height: 60px;
			border-bottom: 1px rgb(244, 244, 244) solid;
			display: flex;
			justify-content: space-around;
			align-items: center;
		}
		.scroll-view_H {
			display: inline-block;
			width: 100%;
			height: calc($mainHeight - $searchBarHeight - 100px);
			.scroll-view-item {
				background-color: white;
				border-radius: 18rpx;
				height: 180rpx;
				margin: 10px 30rpx;
				box-shadow: 1px 3px 4px #c1c0c0;
				padding: 8px;
				color: #727272;

				.title {
					font-size: 18px;
					font-weight: bold;
					color: black;
					width: 8em;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
				}
				.subtitle {
					width: 11em;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					margin-bottom: 5px;
				}
				.number {
					font-size: 20px;
					font-weight: bold;
					color: black;
				}

				.detail {
					color: #6d81fb;
				}
				.foot {
					position: relative;
					bottom: 0px;
					width: 20em;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
	.sortpop {
		border-bottom: 1px rgb(201, 201, 201) dashed;
		margin: 5px;
		padding: 10px 0px;
	}
	.p-sm {
		padding: 20px;
	}

	.flex-center {
		display: flex;
		justify-content: center;
	}
	.flex-between {
		display: flex;
		justify-content: space-between;
	}
	.popup-body {
		margin-top: 10px;
	}
}
</style>
