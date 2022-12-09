/*
 * @Author: wangqz
 * @Date: 2022-09-23
 * @LastEditTime: 2022-12-04
 * @Description: API
 */

import { defHttp } from "./interceptor";

// code 换取openid
export const getWxOpenid = (params) => {
	return defHttp.GET("/zz/pub/public/getBwlWxOpenid", params);
};

// openid登录
export const wechatLogin = (params) => {
	return defHttp.GET("/zz/pub/public/wechatLogin", params);
};

// 获取桥梁列表 || 获取关注桥梁列表
export const bridgeList = (params, type) => {
	if (type == "All") {
		return defHttp.GET("/zz/bwl/waterlevel/getScreenList", params);
	} else {
		return defHttp.GET("/zz/bwl/waterlevel/getFollowScreenList", params);
	}
};

// 历史水位
export const waterLevelList = (params) => {
	return defHttp.GET("/zz/bwl/waterlevel/getScreenWaterLevelList", params);
};

// 提交评价
export const commentCommit = (params) => {
	return defHttp.POST("/zz/pub/public/userComment", params);
};

// 获取评价
export const commentList = () => {
	return defHttp.GET("/zz/pub/public/getUserComment", params);
};

//  评价统计
export const commentStatistics = () => {
	return defHttp.GET("/zz/pub/public/userCommentStatistics");
};

// 访问统计
export const visitStatistics = (params) => {
	return defHttp.GET("/zz/pub/public/visitStatistics", params);
};

// 添加关注 type ='add':添加 , cancel:取消
export const followBridge = (params, type) => {
	return defHttp.POST(`/zz/bwl/waterlevel/${type == "add" ? "addUserFollow" : "cancelUserFollow"}`, params);
};
