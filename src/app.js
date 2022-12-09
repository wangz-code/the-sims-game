import { createApp } from "vue";
import { Button, Toast, Icon, Cell, RadioGroup, Radio, OverLay,Divider } from "@nutui/nutui-taro";

import "./app.scss";
import "./resource/font/iconfont.css";
import { tokenStore } from "./store/token";
import { updateMiniApp } from "./utils";

tokenStore.initStore();
const App = createApp({
	onLaunch(){
		updateMiniApp()
	}
	// 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
});

App.use(Button).use(Toast).use(Icon).use(Cell).use(RadioGroup).use(Radio).use(OverLay).use(Divider);

export default App;
