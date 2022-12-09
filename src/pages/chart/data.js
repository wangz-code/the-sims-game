/**
 * @return {*} options {xAxisData, seriesCount, seriesUser}
 * @author: wangqz
 * @description: 处理折线图
 */
export const handleLineOpt = (opt) => {
	const { xAxisData, seriesCount, seriesUser } = opt;
	return {
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
			},
		},
		legend: {
			top: "bottom",
		},
		xAxis: {
			type: "category",
			data: xAxisData,
		},
		yAxis: {
			type: "value",
		},
		series: [
			{
				name: "访问次数",
				data: seriesCount,
				type: "line",
				smooth: true,
			},
			{
				name: "访问人数",
				data: seriesUser,
				type: "line",
				smooth: true,
			},
		],
	};
};

/**
 * @return {options}
 * @author: wangqz
 * @description: 处理饼图
 */
export const handlePieOpt = (data) => {
	return {
		tooltip: {},
		legend: {
			top: "bottom",
		},
		series: [
			{
				name: "评价统计",
				type: 'pie',
				radius: '65%',
				itemStyle: {
					borderRadius: 3,
				},
				data,
			},
		],
	};
};
