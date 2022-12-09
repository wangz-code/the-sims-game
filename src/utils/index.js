/*
 * @Author: wangqz
 * @Date: 2022-09-23
 * @LastEditTime: 2022-12-04
 * @Description: 工具类
 */

import Taro from "@tarojs/taro";

// 比较版本
export const compareVersion = (v1, v2) => {
	v1 = v1.split(".");
	v2 = v2.split(".");
	const len = Math.max(v1.length, v2.length);

	while (v1.length < len) {
		v1.push("0");
	}
	while (v2.length < len) {
		v2.push("0");
	}

	for (let i = 0; i < len; i++) {
		const num1 = parseInt(v1[i]);
		const num2 = parseInt(v2[i]);

		if (num1 > num2) {
			return 1;
		} else if (num1 < num2) {
			return -1;
		}
	}

	return 0;
};

/**
 * @return {*}
 * @author: wangqz
 * @description: 检查程序更新
 */
export const updateMiniApp = () => {
	return new Promise((resolve) => {
		const updateManager = Taro.getUpdateManager();
		updateManager.onCheckForUpdate(function (res) {
			// 请求完新版本信息的回调
			resolve(res.hasUpdate);
		});
		updateManager.onUpdateReady(function () {
			Taro.showModal({
				title: "更新提示",
				content: "新版本已经准备好，是否重启应用？",
				success: function (res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate();
					}
				},
			});
		});
	});
};

/**
 * @param {*} value 值
 * @param {*} point 小数位
 * @return {*} 字符串
 * @author: wangqz
 * @description: 金额格式化
 */
export const money = (value, point = 2) => {
	if (isNaN(Number(value))) {
		return value || "0.00";
	} else {
		return Number(value).toFixed(point);
	}
};

/**
 * @description: 防抖
 */
export const debounce = (func, wait) => {
	let timer;
	return () => {
		clearTimeout(timer);
		timer = setTimeout(func, wait);
	};
};
