import Taro from "@tarojs/taro";

/*
 * @Author: wangqz
 * @Date: 2022-09-23
 * @LastEditTime: 2022-11-30
 * @Description: token 全局状态管理
 */
const Token_key = "token_key";
const Openid_key = "openid_key";
export const tokenStore = {
	state: {
		token: "",
		openid: "",
	},
	setToken(value) {
		this.state.token = value;
		try {
			Taro.setStorageSync(Token_key, value);
		} catch (error) {
			console.log("Token缓存设置失败 log==>", error);
		}
	},
	getToken() {
		if (this.state.token) {
			return this.state.token;
		} else {
			try {
				const token = Taro.getStorageSync(Token_key);
				if (token) {
					this.setToken(token);
					return token;
				} else {
					return "";
				}
			} catch (e) {
				console.log("token 缓存读取失败 log==>",e);
				return "";
			}
		}
	},
	setOpenid(value) {
		this.state.openid = value;
		try {
			Taro.setStorageSync(Openid_key, value);
		} catch (error) {
			console.log("openid缓存设置失败 log==>", error);
		}
	},
	getOpenid() {
		if (this.state.openid) {
			return this.state.openid;
		} else {
			try {
				const openid = Taro.getStorageSync(Openid_key);
				if (openid) {
					this.setOpenid(openid);
					return openid;
				} else {
					return "";
				}
			} catch (e) {
				console.log("token 缓存读取失败 log==>");
				return "";
			}
		}
	},
	initStore() {
		this.getOpenid();
		this.getToken();
	},
};
