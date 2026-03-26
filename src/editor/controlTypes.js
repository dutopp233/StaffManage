export const ControlType = Object.freeze({
  String: 'String',
  Boolean: 'Boolean',
  Number: 'Number',
  Text: 'Text',
  Date: 'Date',
  DateRange: 'DateRange',
  // Keep compatibility with "DataRange" typo in old docs.
  DataRange: 'DataRange',
  Array: 'Array',
  Time: 'Time',
  Enum: 'Enum',
  Color: 'Color',
  GradientColor: 'GradientColor',
  Image: 'Image',
  Action: 'Action',
  Object: 'Object',
  Style: 'Style'
});

export const EnumDisplayType = Object.freeze({
  Radio: 'radio',
  Button: 'button',
  Select: 'select',
  TreeSelect: 'treeSelect'
});
