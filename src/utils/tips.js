/*
 * @Author: wangqz
 * @Date: 2022-10-07
 * @LastEditTime: 2022-12-04
 * @Description: content
 */

import Taro from "@tarojs/taro";

const toast = (title, icon, option = {}) => {
	Taro.showToast({
		title,
		icon,
		...option,
	});
};

// 成功提示 success
export const toastOk = (title) => {
	toast(title, "success");
};

// 错误提示 error
export const toastErr = (title) => {
	toast(title, "error");
};

// 加载提示
export const toastLoading = (title) => {
	toast(title, "loading");
};

// 文字提示
export const toastNone = (title) => {
	toast(title, "none");
};

// 持续加载
let isloading = false;
export const showLoading = (show, title = "加载中") => {
	if (isloading && show) return;
	if (show) {
		Taro.showLoading({
			title,
			success: () => {
				isloading = true;
			},
		});
	} else {
		Taro.hideLoading({
			success: () => {
				isloading = false;
			},
		});
	}
};

// 错误提示
export const modalAlert = (content, successFn) => {
	Taro.showModal({
		title: "提示",
		content,
		showCancel: false,
		success: function (res) {
			res.confirm && successFn && successFn();
		},
	});
};

// 确认框
export const modalConfirm = (content, successFn, cancelFn) => {
	Taro.showModal({
		title: "请确认",
		content,
		showCancel: true,
		success: function (res) {
			console.log("res log==>", res);
			if (res.confirm) {
				successFn && successFn();
			} else {
				cancelFn && cancelFn();
			}
		},
	});
};
