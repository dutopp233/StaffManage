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

# 2.可视化编辑器属性配置（新增）

在 `src/editor` 中新增了一套属性配置注册能力，包含：

- `createEditor(componentName, plugin)`
- `addPropertyControls(componentName, controlMap)`
- `ControlType`（配置项类型枚举）
- `EnumDisplayType`（枚举类展示方式）

## 2.1 快速示例

```js
import { createEditor, ControlType } from './src/editor';

createEditor('CalendarBlock', ({ ControlType, addPropertyControls }) => {
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
});
```

> 兼容说明：
>
> - `titile`（拼写错误）会被自动兼容为 `title`
> - `DataRange`（旧拼写）等价于 `DateRange`
> - `addaddPropertyControls`（旧拼写）也可调用

## 2.2 字段说明

- `title`：属性项显示名称
- `required`：是否必填
- `defaultValue`：默认值
- `startTime`、`bgColor` 等字段名：为组件实际存储的属性 key

## 2.3 ControlType 与默认编辑器映射

| ControlType | 值类型 | 默认编辑器（renderer） |
| --- | --- | --- |
| String | string | Input |
| Boolean | boolean | Switch |
| Number | number | InputNumber |
| Text | string | TextArea |
| Date | string（ISO 日期字符串） | DatePicker |
| DateRange / DataRange | string[]（ISO 日期字符串数组） | RangePicker |
| Array | array | ArrayEditor（自定义） |
| Time | string | TimePicker |
| Enum | string / number | Radio / ButtonGroup / Select / TreeSelect |
| Color | string | ColorPicker |
| GradientColor | string | GradientColorPicker |
| Image | string（图片地址） | ImagePicker |
| Action | function / action schema | ActionEditor |
| Object | object | ObjectEditor（自定义） |
| Style | React.CSSProperties object | StyleEditor（自定义） |

### Enum 的展示方式

`Enum` 支持 `display` 指定展示组件：

- `EnumDisplayType.Radio`
- `EnumDisplayType.Button`
- `EnumDisplayType.Select`
- `EnumDisplayType.TreeSelect`

若不指定 `display`，会自动推断：

- 选项数 `<= 3`：`Radio`
- 其余：`Select`

## 2.4 目录

- `src/editor/controlTypes.js`：类型枚举
- `src/editor/defaultRenderers.js`：类型到默认组件映射
- `src/editor/validators.js`：配置归一化与校验
- `src/editor/createEditor.js`：注册器与查询 API
- `src/editor/example.js`：完整配置示例
- `src/editor/index.js`：统一导出入口

# 2.相关资料

在线预览：[人员管理](http://wyuhao.com/demo/staff)

代码解析：[十分详细的React实例](http://blog.csdn.net/a153375250/article/details/52667739)

# 3.致谢

如果对你有帮助，就奉献一颗Star吧！
