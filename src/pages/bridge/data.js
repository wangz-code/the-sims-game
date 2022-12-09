/*
 * @Author: wangqz
 * @Date: 2022-10-06
 * @LastEditTime: 2022-12-04
 * @Description: content
 */

export const handleLineOpt = ({ xAxisData = [], seriesData = [], y = { max: 0, min: 0 } }) => {
	return {
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
			},
		},
		xAxis: {
			type: "category",
			data: xAxisData,
			name: "时间",
		},
		yAxis: {
			name: "水位(m)",
			type: "value",
			max: y.max,
			min: y.min,
		},
		series: [
			{
				data: seriesData,
				type: "line",
				smooth: true,
			},
		],
	};
};
