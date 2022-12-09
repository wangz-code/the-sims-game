<!--
 * @Author: wangqz
 * @Date: 2022-10-06
 * @LastEditTime: 2022-12-05
 * @Description: content
-->

<template>
	<view class="detail" :style="{ height: state.map.mainHeight }">
		<view class="body">
			<view class="title flex-between">
				<view> {{ state.query.screenName }} </view>
				<view>
					<nut-button @click="navTo" type="primary" size="small" icon-font-class-name="iconfont" icon-class-prefix="icon" icon="daohang"> 导航去这里 </nut-button>
				</view>
			</view>
			<view class="water">
				<view class="flex-between">
					<view>历史水位</view>
					<view class="querybar">
						<nut-radiogroup v-model="state.dateRange" @change="queryWaterHistor" direction="horizontal">
							<nut-radio shape="button" label="0">昨天</nut-radio>
							<nut-radio shape="button" label="1">近七天</nut-radio>
							<nut-radio shape="button" label="2">近一个月</nut-radio>
						</nut-radiogroup>
					</view>
				</view>
				<view class="w-canvas">
					<EChart @register="regChart" />
				</view>
			</view>
			<view class="map" :style="{ height: state.map.height }">
				<view @click="expandMap" class="expand"> </view>
				<map v-if="state.map.latitude" id="map" :style="{ width: '100%', height: state.map.height }" :rotate="15" :longitude="state.map.longitude" :latitude="state.map.latitude" scale="16" :markers="state.map.markers" :onUpdated="mapOnUpdated">
					<cover-view slot="callout">
						<cover-view marker-id="0" class="callout flex-between">
							<cover-view class="">
								<cover-view class="label"> {{ state.query.screenName }} </cover-view>
								<cover-view class="label"> {{ state.query.waterlevelTime }} </cover-view>
							</cover-view>
							<cover-view class="round"> {{ state.query.waterlevelStr }}m </cover-view>
						</cover-view>
					</cover-view>
				</map>
				<Empty v-else description="暂无经纬度数据"></Empty>
			</view>
		</view>
	</view>
</template>

<script setup>
import Taro from "@tarojs/taro";
import { reactive } from "vue";
import { EChart } from "../../components/ec-canvas";
import { useEcharts } from "../../components/ec-canvas/echart/hooks";
import { compareVersion, money } from "../../utils";
import { handleLineOpt } from "./data";
import { parseUrl } from "query-string";
import { Empty } from "@nutui/nutui-taro";
import dayjs from "dayjs";
import { waterLevelList } from "../../api/bridge-api";
import QQMapWX from "../../utils/qqmap-wx-jssdk";
import { modalAlert, showLoading } from "../../utils/tips";
definePageConfig({
	navigationBarTitleText: "查看",
});
// 实例化API核心类
const qqmapsdk = new QQMapWX({
	key: "LXABZ-M2T3U-XUIVJ-4W6EP-N2OL6-NFBPQ", // 必填
});
const instance = Taro.getCurrentInstance();
const params = parseUrl(instance.router.$taroPath);

const state = reactive({
	query: params.query,
	dateRange: "1",
	map: {
		mainHeight: "100vh",
		expand: false,
		height: "34vh",
		longitude: params.query.longitude,
		latitude: params.query.latitude,
		markers: [],
	},
});

// 导航
const navTo = () => {
	const version = Taro.getSystemInfoSync().SDKVersion;
	if (compareVersion(version, "2.14.0") < 0) {
		// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
		Taro.showToast({
			title: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
			icon: "none",
		});
		return;
	}
	if (!state.map.latitude || !state.map.longitude) {
		Taro.showToast({
			title: "无法获取桥梁经纬度!",
			icon: "none",
		});
		return;
	}
	showLoading(true);
	const mapCtx = Taro.createMapContext("map", this);
	mapCtx.openMapApp({
		latitude: state.map.latitude,
		longitude: state.map.longitude,
		destination: state.query.screenName,
		fail: (e) => {
			modalAlert("拉起APP失败, 请检查手机定位是否开启");
			console.error("拉起失败log==>", e);
		},
		complete: showLoading.bind(null, false),
	});
};

// 地图展开
const expandMap = () => {
	state.expand = !state.expand;
	if (state.expand) {
		state.map.height = "80vh";
		state.map.mainHeight = "150vh";
	} else {
		state.map.height = "32vh";
		state.map.mainHeight = "100vh";
	}
};

const [regChart, { setOption }] = useEcharts();

const queryWaterHistor = async () => {
	const params = {
		deviceCode: state.query.deviceCode, //    桥梁编号
		begin: 0, //     起始页
		pagesize: 1000, //每页记录数
		filters: {
			rangetype: state.dateRange,
		},
	};
	const result = await waterLevelList(params);
	const opt = {
		xAxisData: [],
		seriesData: [],
		y: {
			max: money(result.data.max / 1000 + 1),
			min: money(result.data.min / 1000 - 1),
		},
	};

	// 近一个月过滤整点数据
	if (state.dateRange == "2") {
		const hourData = {};
		for (let i = 0; i < result.data.list.length; i++) {
			const item = result.data.list[i];
			const hour = dayjs(item.time).format("DD-HH");
			if (!hourData[hour]) {
				hourData[hour] = true;
				opt.xAxisData.push(dayjs(item.time).format("MM-DD HH:00"));
				opt.seriesData.push(money(item.value / 1000));
			}
		}
	} else {
		for (let i = 0; i < result.data.list.length; i++) {
			const item = result.data.list[i];
			opt.xAxisData.push(dayjs(item.time).format("MM-DD HH:mm"));
			opt.seriesData.push(money(item.value / 1000));
		}
	}
	setOption(handleLineOpt(opt));
};

// 地址 => 经纬度坐标
const addressToLatLng = () => {
	qqmapsdk.geocoder({
		address: state.query.address,
		success: function (res) {
			var res = res.result;
			state.map.latitude = res.location.lat;
			state.map.longitude = res.location.lng;
		},
		fail: function (error) {
			console.error(error);
			modalAlert("经纬度解析失败:" + error.message);
		},
	});
};

// 地图渲染
const mapOnUpdated = () => {
	if (!state.map.markers.length) {
		setTimeout(() => {
			state.map.markers = [
				{
					iconPath: "https://njzz.rongtuyun.com/static/images/bridge-webapp/Marker3_Activated@3x.png",
					id: 0,
					latitude: state.map.latitude,
					longitude: state.map.longitude,
					width: "34px",
					height: "34px",
					rotate: 0,
					alpha: 1,
					customCallout: {
						display: "ALWAYS",
						anchorX: 0,
						anchorY: 0,
					},
				},
			];
		}, 100);
	}
};

queryWaterHistor();
!state.map.latitude && state.query.address && addressToLatLng();
</script>

<style lang="scss">
.w-canvas {
	width: 100%;
	height: 230px;
}
.expand {
	position: relative;
	top: 20px;
	right: -93%;
	margin-top: -28px;
	width: 30px;
	height: 30px;
	z-index: 1;
	background-image: url("https://njzz.rongtuyun.com/static/images/bridge-webapp/expand.png");
	background-size: cover;
}
.detail {
	width: 100%;
	height: 105vh;
	background-color: #fbfbfb;
	display: flex;
	justify-content: center;
	.body {
		width: 92%;
		height: fit-content;
	}
	.title {
		background-color: white;
		box-shadow: 1px 2px 3px #d0d0d0;
		border-radius: 6px;
		font-size: large;
		font-weight: bold;
		padding: 10px;
		margin-top: 10px;
		align-items: center;
	}
	.water {
		padding: 10px;
		margin-top: 10px;
		height: 38vh;
		border-radius: 6px;
		background-color: white;
		box-shadow: 1px 2px 3px #d0d0d0;
		.querybar {
			display: flex;
			justify-content: center;
		}
	}
	.map {
		padding: 10px;
		margin-top: 10px;
		height: 34vh;
		border-radius: 6px;
		background-color: white;
		box-shadow: 1px 2px 3px #d0d0d0;
	}
	.flex-between {
		display: flex;
		justify-content: space-between;
	}
}
.callout {
	background-color: white;
	border-radius: 6px;
	padding: 5px;
	.label {
		color: #5b5b5b;
		margin-bottom: 5px;
		width: 10em;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.round {
		margin-left: 10px;
		background-color: #1a95fa;
		color: white;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		text-align: center;
		line-height: 50px;
		box-shadow: 1px 2px 3px #d0d0d0;
	}
}
</style>
