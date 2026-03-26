import { ControlType, EnumDisplayType } from './controlTypes';

export const ControlRenderer = Object.freeze({
  Input: 'Input',
  Switch: 'Switch',
  InputNumber: 'InputNumber',
  TextArea: 'TextArea',
  DatePicker: 'DatePicker',
  RangePicker: 'RangePicker',
  ArrayEditor: 'ArrayEditor',
  TimePicker: 'TimePicker',
  Radio: 'Radio',
  ButtonGroup: 'ButtonGroup',
  Select: 'Select',
  TreeSelect: 'TreeSelect',
  ColorPicker: 'ColorPicker',
  GradientColorPicker: 'GradientColorPicker',
  ImagePicker: 'ImagePicker',
  ActionEditor: 'ActionEditor',
  ObjectEditor: 'ObjectEditor',
  StyleEditor: 'StyleEditor'
});

const enumRendererMap = Object.freeze({
  [EnumDisplayType.Radio]: ControlRenderer.Radio,
  [EnumDisplayType.Button]: ControlRenderer.ButtonGroup,
  [EnumDisplayType.Select]: ControlRenderer.Select,
  [EnumDisplayType.TreeSelect]: ControlRenderer.TreeSelect
});

const fixedRendererMap = Object.freeze({
  [ControlType.String]: ControlRenderer.Input,
  [ControlType.Boolean]: ControlRenderer.Switch,
  [ControlType.Number]: ControlRenderer.InputNumber,
  [ControlType.Text]: ControlRenderer.TextArea,
  [ControlType.Date]: ControlRenderer.DatePicker,
  [ControlType.DateRange]: ControlRenderer.RangePicker,
  [ControlType.DataRange]: ControlRenderer.RangePicker,
  [ControlType.Array]: ControlRenderer.ArrayEditor,
  [ControlType.Time]: ControlRenderer.TimePicker,
  [ControlType.Color]: ControlRenderer.ColorPicker,
  [ControlType.GradientColor]: ControlRenderer.GradientColorPicker,
  [ControlType.Image]: ControlRenderer.ImagePicker,
  [ControlType.Action]: ControlRenderer.ActionEditor,
  [ControlType.Object]: ControlRenderer.ObjectEditor,
  [ControlType.Style]: ControlRenderer.StyleEditor
});

export const ControlTypeToDefaultRenderer = Object.freeze(Object.assign({}, fixedRendererMap));

function resolveEnumRenderer(control) {
  if (control.display && enumRendererMap[control.display]) {
    return enumRendererMap[control.display];
  }

  // Short options are usually better for direct click UI.
  if (Array.isArray(control.options) && control.options.length > 0 && control.options.length <= 3) {
    return ControlRenderer.Radio;
  }

  return ControlRenderer.Select;
}

export function resolveRendererByControl(control) {
  if (!control || !control.type) {
    throw new Error('Invalid control config: missing type.');
  }

  if (control.type === ControlType.Enum) {
    return resolveEnumRenderer(control);
  }

  if (!fixedRendererMap[control.type]) {
    throw new Error('Unknown ControlType: ' + control.type);
  }

  return fixedRendererMap[control.type];
}
