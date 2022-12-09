/*
 * @Author: wangqz
 * @Date: 2022-10-07
 * @LastEditTime: 2022-12-05
 * @Description: content
 */

import Taro from "@tarojs/taro";
import { toastOk } from "./tips";

/**
 * @param {*} options
 * @return {*}
 * @author: wangqz
 * @description: 仅支持 result = {"status": "success"}
 * @eg check({ status: "success","okMsg":"操作成功!", okFnDely: [1000, okFnDely] });
 */
export const check = (options = {}) => {
	if (!options.status) {
		throw "options.status 必填!";
	}
	if (options.status == "success") {
		options.okMsg && toastOk(options.okMsg);
		options.backWait && setTimeout(Taro.navigateBack.bind(null, { delta: 1 }), options.backWait);
		options.okFnDely && setTimeout(options.okFnDely[1], options.okFnDely[0]);
		return {
			success: (call) => call && call(),
			fail: () => {},
			complete: (call) => call && call(),
		};
	} else {
		return {
			success: () => {},
			fail: (call) => call && call(),
			complete: (call) => call && call(),
		};
	}
};

