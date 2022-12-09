/*
 * @Author: wangqz
 * @Date: 2022-10-07
 * @LastEditTime: 2022-11-30
 * @Description: content
 */

import dayjs from "dayjs";

// 桥梁列表
export const bridgeData = () => {
	const data = {
		list: [],
		count: 0,
	};
	for (let index = 0; index < 100; index++) {
		const item = {
			deviceCode: index /*设备码*/,
			screenCode: index /*屏幕条码*/,
			screenName: "测试名称" + index /*屏幕名称*/,
			department: "测试部门" + index /*部门*/,
			groupName: "测试分组" + index /*分组*/,
			status: index /*状态 0：未初始化 1：在线 2：离线*/,
			serviceStatus: index /*服务套餐状态（iLEDSys 不返回） 0：未购买套餐 1：套餐有效 2：套餐过期*/,
			model: "A" + index /*型号*/,
			width: "100" /*宽度*/,
			height: "200" /*高度*/,
			longitude: "122" /*经度*/,
			latitude: "123" /*纬度*/,
			waterway: "航道" /*航道*/,
			region: "江苏省镇江市" /*所在区域*/,
			lastTime: dayjs().format("yyyy-MM-dd") /*最后一次更新时间*/,
			waterlevel: (Math.random() * 100).toFixed(2) /*水位*/,
			waterlevelTime: dayjs().format("yyyy-MM-dd") /*最后一次获取的水位时间*/,
			follow: index % 2 == "0" ? "0" : "1" /*是否被当前用户关注*/,
		};
		data.list.push(item);
	}
	data.count = data.list.length;

	return { data };
};

// 历史水位记录

export const waterLevelData = () => {
	const data = {
		count: "", // 总记录数
		list: [],
	};
	const month = new Date().getMonth().toString().padStart(2, "0");
	const day = new Date().getDate().toString().padStart(2, "0");
	for (let i = 0; i < 100; i++) {
		const item = {
			deviceCode: "" /*设备码*/,
			screenCode: "" /*屏幕条码*/,
			dataType: "12" /*数据类别,12表示是水位计传感器*/,
			value: parseInt(Math.random() * 100) /*数值*/,
			time: month + "/" + day /*时间*/,
		};
		data.list.push(item);
	}

	data.count = data.list.length;
	return { data };
};
