# taro-bridge

基于 Taro 3.x 框架 使用 vue3.x + echarts5.x 构建的微信小程序 `仅支持微信小程序`

如果使用 nutui 组件时 , 按需导入需要重命名 比如 Cell as NutCell , 
```
// Cell.name = "nut-cell" 未重命名直接使用Cell也可以但是Radio就不能, 为了规范, 按需引入全部重命名 NutXXX
import { Cell as NutCell, Radio as NutRadio, RadioGroup as NutRadiogroup, } from "@nutui/nutui-taro";
<template>
    <nut-cell title="评价等级">
    <nut-radiogroup v-model="form.commentGrade" direction="horizontal">
				<nut-radio label="5">有用</nut-radio>
				<nut-radio label="3">一般</nut-radio>
				<nut-radio label="1">无用</nut-radio>
		</nut-radiogroup>
</template>

```

## 基本环境

```
nodejs v16.17.0
Taro v3.5.6
yarn 1.22.17  // mac : brew install yarn
```

## 项目升级

```
// 升级项目依赖
taro update project

// 升级taro 最新版
taro update self
```

## 运行环境

小程序基础库 > 2.9.0

```bash
 👽 Taro v3.5.6


  Taro CLI 3.5.6 environment info:
    System:
      OS: macOS 12.5
      Shell: 5.8.1 - /bin/zsh
    Binaries:
      Node: 16.17.0 - ~/.nvm/versions/node/v16.17.0/bin/node
      Yarn: 1.22.17 - /opt/homebrew/bin/yarn
      npm: 8.15.0 - ~/.nvm/versions/node/v16.17.0/bin/npm
    npmPackages:
      @tarojs/components: 3.5.6 => 3.5.6
      @tarojs/mini-runner: 3.5.6 => 3.5.6
      @tarojs/plugin-framework-vue3: 3.5.6 => 3.5.6
      @tarojs/plugin-html: 3.5.6 => 3.5.6
      @tarojs/runtime: 3.5.6 => 3.5.6
      @tarojs/taro: 3.5.6 => 3.5.6
      @tarojs/webpack-runner: 3.5.6 => 3.5.6
      babel-preset-taro: 3.5.6 => 3.5.6
```

## 快速开始

```
yarn  // npm install

yarn dev  // npm run dev
```

## 注意事项

对于网页加载速度或者微信小程序包体积大小有要求的，可以做如下调整：

1、因为 echarts 图表库本身体积相对较大，所以开发者可以根据业务需要在 echarts [官网定制](https://echarts.apache.org/zh/builder.html) `echarts.js`，只需替换 ec-canvas 组件目录中 `echarts.js` 文件即可正常使用。

2、在微信小程序中对于应用体积有严格的限制要求，开发者可以通过[分包](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/basic.html)技术对应用进行拆分。

## 参考资料

-   [在微信小程序中使用 Apache ECharts](https://github.com/ecomfe/echarts-for-weixin)
-   [echarts 官网](https://echarts.apache.org/zh/index.html)
