# 1.使用方法

### 1.1安装依赖项

```
    npm install
```

### 1.2生成bundle.js

```
    npm start
```

### 1.3在浏览器运行index.html即可

源代码中包含生成好的bundle.js，可以直接点击运行。

# 2.相关资料

在线预览：[人员管理](http://wyuhao.com/demo/staff)

代码解析：[十分详细的React实例](http://blog.csdn.net/a153375250/article/details/52667739)

# 3.致谢

如果对你有帮助，就奉献一颗Star吧！

# 4.可视化编辑器属性配置（新增）

新增目录：`src/editor`

- `createEditor.js`：组件属性配置注册能力
- `PropertyPanel.js`：配置项面板渲染器（可注入自定义控件）
- `demoConfig.js`：示例配置
- `index.js`：统一导出

## 4.1 createEditor 基本用法

```js
import { createEditor, ControlType } from './src/editor';

createEditor('HeroBanner', function (ControlType, addPropertyControls) {
  addPropertyControls({
    startTime: {
      type: ControlType.Date,
      required: true,
      title: '起始日',
      defaultValue: new Date()
    },
    bgColor: {
      type: ControlType.GradientColor,
      title: '区块颜色',
      defaultValue: '#ffffff'
    }
  });

  return {
    canBindDataSource: true
  };
});
```

> 兼容写法：`ControlType.Data` 会自动归一为 `ControlType.Date`；`ControlType.DataRange` 会自动归一为 `ControlType.DateRange`。

## 4.2 支持的 ControlType

- `String`：字符串，默认 Input
- `Boolean`：布尔值，默认 Switch（示例中用 checkbox 表达）
- `Number`：数字，默认 InputNumber（示例中用 number input）
- `Text`：字符串，TextArea
- `Date`：日期字符串，DatePicker
- `DateRange`：日期字符串数组，RangePicker
- `Array`：数组，自定义编辑（示例中用 JSON 文本）
- `Time`：时间字符串，TimePicker
- `Enum`：字符串/数字，支持 `Radio` / `Button` / `Select` / `TreeSelect`
- `Color`：颜色字符串
- `GradientColor`：渐变字符串
- `Image`：图片地址字符串
- `Action`：动作绑定字段
- `Object`：对象结构
- `Style`：`React.CSSProperties` 对象

## 4.3 与 React Vant / react-color 集成建议

`PropertyPanel` 支持 `renderers`（也兼容 `widgetRenderers`）注入：

```js
import { PropertyPanel, ControlType } from './src/editor';
// 例如使用 react-vant DatePicker/Field、react-color SketchPicker 等
const renderers = {};
renderers[ControlType.Date] = function DateRenderer(props) {
  return <input type="date" value={props.value} onChange={function (e) { props.onChange(e.target.value); }} />;
};

<PropertyPanel
  controls={controls}
  value={values}
  onChange={setValues}
  renderers={renderers}
/>;
```

这样可以在不改 `createEditor` 协议的情况下，替换成你们平台内部统一的 React Vant 控件实现。
