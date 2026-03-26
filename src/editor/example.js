import { createEditor, ControlType, EnumDisplayType } from './index';

/**
 * Example:
 * Register editable properties for a visual-editor component.
 * This file only demonstrates data schema registration.
 */
export const CalendarBlockEditor = createEditor('CalendarBlock', function(params) {
  params.addPropertyControls({
    startTime: {
      type: ControlType.Date,
      required: true,
      title: '起始日',
      defaultValue: new Date().toISOString()
    },
    bgColor: {
      type: ControlType.GradientColor,
      title: '区块颜色',
      defaultValue: '#ffffff'
    },
    title: {
      type: ControlType.String,
      title: '标题',
      defaultValue: '活动日历'
    },
    showHeader: {
      type: ControlType.Boolean,
      title: '显示头部',
      defaultValue: true
    },
    maxCount: {
      type: ControlType.Number,
      title: '最大展示数量',
      defaultValue: 10
    },
    description: {
      type: ControlType.Text,
      title: '描述',
      defaultValue: ''
    },
    range: {
      type: ControlType.DateRange,
      title: '活动区间',
      defaultValue: []
    },
    eventTime: {
      type: ControlType.Time,
      title: '提醒时间',
      defaultValue: '09:00:00'
    },
    cover: {
      type: ControlType.Image,
      title: '封面图',
      defaultValue: ''
    },
    status: {
      type: ControlType.Enum,
      title: '状态',
      display: EnumDisplayType.Radio,
      options: [
        { label: '草稿', value: 'draft' },
        { label: '发布', value: 'published' }
      ],
      defaultValue: 'draft'
    },
    tags: {
      type: ControlType.Array,
      title: '标签',
      controls: {
        name: {
          type: ControlType.String,
          title: '标签名'
        },
        color: {
          type: ControlType.Color,
          title: '标签颜色'
        }
      },
      defaultValue: []
    },
    style: {
      type: ControlType.Style,
      title: '样式',
      defaultValue: {
        padding: 12,
        borderRadius: 8
      }
    },
    onClick: {
      type: ControlType.Action,
      title: '点击事件'
    },
    ext: {
      type: ControlType.Object,
      title: '扩展配置',
      controls: {
        analyticsKey: {
          type: ControlType.String,
          title: '埋点 Key'
        },
        enableTrack: {
          type: ControlType.Boolean,
          title: '开启埋点'
        }
      },
      defaultValue: {}
    }
  });
});

