/*
 * @Author: wangqz
 * @Date: 2022-09-23
 * @LastEditTime: 2022-12-05
 * @Description: 拦截器
 */

import { API_BASE_URL } from "../config";
import Taro from "@tarojs/taro";
import { tokenStore } from "../store/token";
import { toastNone } from "../utils/tips";
import { stringifyUrl, parseUrl } from "query-string";

const interceptor = function (chain) {
	// 请求自动添加 token
	const token = tokenStore.getToken();
	const parse = parseUrl(chain.requestParams.url);
	if (!parse.query.session_token) {
		parse.query.session_token = token;
	}
	chain.requestParams.url = stringifyUrl(parse);
	// 请求参数处理
	if (chain.requestParams.header["Content-Type"] == "application/x-www-form-urlencoded") {
		for (let [key, value] of Object.entries(chain.requestParams.data)) {
			if (typeof value === "object") {
				chain.requestParams.data[key] = JSON.stringify(value);
			}
		}
	}
	// 请求拦截器
	return chain.proceed(chain.requestParams).then((res) => {
		// 响应拦截器
		switch (res.statusCode) {
			case 401:
				toastNone(res.statusCode + ":用户没有权限");
				break;
			case 403:
				toastNone(res.statusCode + ":用户得到授权，但是访问是被禁止的!");
				break;
			case 404:
				toastNone(res.statusCode + ":网络请求错误,未找到该资源!");
				break;
			case 405:
				toastNone(res.statusCode + ":网络请求错误,请求方法未允许!");
				break;
			case 408:
				toastNone(res.statusCode + ":网络请求超时!");
				break;
			case 500:
				toastNone(res.statusCode + ":服务器错误,请联系管理员!");
				break;
			case 501:
				toastNone(res.statusCode + ":网络未实现!");
				break;
			case 502:
				toastNone(res.statusCode + ":网络错误!");
				break;
			case 503:
				toastNone(res.statusCode + ":服务不可用，服务器暂时过载或维护!");
				break;
			case 504:
				toastNone(res.statusCode + ":网络超时!");
				break;
			case 505:
				toastNone(res.statusCode + ":http版本不支持该请求!");
				break;
			default:
		}

		// 默认错误处理 data:{"status": "failure",message:{"code":"xx","info":"xxx"}}
		console.log("res.data", res.data);
		if (res.data.status == "failure") {
			const { info, code } = res.data.message;
			// 会话令牌已过期!
			if (code == "12") {
				Taro.switchTab({ url: "/pages/bridge/index" });
			} else {
				toastNone(info);
			}
		}
		return res.data;
	});
};

Taro.addInterceptor(interceptor);

const header = {
	json: {
		header: { "Content-Type": "application/json" }, // 默认值
	},
	text: {
		header: { "Content-Type": "text/plain" },
	},
	urlencoded: {
		header: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	},
	formdata: {
		header: {
			"Content-Type": "multipart/form-data",
		},
	},
};
export const defHttp = {
	GET: (url, params) => {
		return Taro.request({ url: API_BASE_URL + url, data: params, ...header.text });
	},
	POST: (url, params) => {
		return Taro.request({ method: "POST", url: API_BASE_URL + url, data: params, ...header.urlencoded });
	},
	POSTFile: () => {},
};
