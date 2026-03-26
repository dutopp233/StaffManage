import { createEditor, ControlType, EnumWidget } from './createEditor';

/**
 * 示例：给一个可视化组件注册属性配置项
 * 你在业务里可以把 "BannerBlock" 换成实际组件名
 */
const bannerEditor = createEditor('BannerBlock', function (ControlTypeRef, addPropertyControls) {
  addPropertyControls({
    startTime: {
      type: ControlTypeRef.Date,
      required: true,
      title: '起始日',
      defaultValue: new Date()
    },
    bgColor: {
      type: ControlTypeRef.GradientColor,
      title: '区块颜色',
      defaultValue: 'linear-gradient(180deg, #1677ff 0%, #87d068 100%)'
    },
    title: {
      type: ControlTypeRef.String,
      title: '标题',
      defaultValue: '我是默认标题'
    },
    visible: {
      type: ControlTypeRef.Boolean,
      title: '是否显示',
      defaultValue: true
    },
    paddingTop: {
      type: ControlTypeRef.Number,
      title: '顶部边距',
      defaultValue: 12
    },
    description: {
      type: ControlTypeRef.Text,
      title: '描述文案',
      defaultValue: '这里是多行文本'
    },
    activeTimeRange: {
      type: ControlTypeRef.DateRange,
      title: '活动日期',
      defaultValue: ['2026-03-01', '2026-03-31']
    },
    layout: {
      type: ControlTypeRef.Enum,
      title: '布局样式',
      enumWidget: EnumWidget.Radio,
      options: [
        { label: '纵向', value: 'vertical' },
        { label: '横向', value: 'horizontal' }
      ],
      defaultValue: 'vertical'
    },
    cover: {
      type: ControlTypeRef.Image,
      title: '封面图'
    },
    onClickAction: {
      type: ControlTypeRef.Action,
      title: '点击动作',
      defaultValue: 'action://update/banner.visible'
    },
    tags: {
      type: ControlTypeRef.Array,
      title: '标签数组',
      defaultValue: ['新品', '热卖']
    },
    style: {
      type: ControlTypeRef.Style,
      title: '样式',
      defaultValue: {
        borderRadius: '12px',
        padding: '8px 12px'
      }
    }
  });

  return {
    supportChildren: true
  };
});

export { bannerEditor, ControlType, EnumWidget };
