const ControlType = {
  String: 'String',
  Boolean: 'Boolean',
  Number: 'Number',
  Text: 'Text',
  Date: 'Date',
  // 兼容示例里 Data 的写法
  Data: 'Date',
  DateRange: 'DateRange',
  DataRange: 'DateRange',
  Array: 'Array',
  Time: 'Time',
  Enum: 'Enum',
  Color: 'Color',
  GradientColor: 'GradientColor',
  Image: 'Image',
  Action: 'Action',
  Object: 'Object',
  Style: 'Style'
};

const EnumWidget = {
  Radio: 'Radio',
  Button: 'Button',
  Select: 'Select',
  TreeSelect: 'TreeSelect'
};

const DEFAULT_WIDGET_MAP = {};
DEFAULT_WIDGET_MAP[ControlType.String] = 'Input';
DEFAULT_WIDGET_MAP[ControlType.Boolean] = 'Switch';
DEFAULT_WIDGET_MAP[ControlType.Number] = 'InputNumber';
DEFAULT_WIDGET_MAP[ControlType.Text] = 'TextArea';
DEFAULT_WIDGET_MAP[ControlType.Date] = 'DatePicker';
DEFAULT_WIDGET_MAP[ControlType.DateRange] = 'RangePicker';
DEFAULT_WIDGET_MAP[ControlType.Array] = 'ArrayEditor';
DEFAULT_WIDGET_MAP[ControlType.Time] = 'TimePicker';
DEFAULT_WIDGET_MAP[ControlType.Enum] = 'EnumSelector';
DEFAULT_WIDGET_MAP[ControlType.Color] = 'ColorPicker';
DEFAULT_WIDGET_MAP[ControlType.GradientColor] = 'GradientColorPicker';
DEFAULT_WIDGET_MAP[ControlType.Image] = 'ImageUploader';
DEFAULT_WIDGET_MAP[ControlType.Action] = 'ActionBinding';
DEFAULT_WIDGET_MAP[ControlType.Object] = 'ObjectEditor';
DEFAULT_WIDGET_MAP[ControlType.Style] = 'StyleEditor';

const editorRegistry = {};

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function cloneValue(value) {
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (Array.isArray(value)) {
    return value.map(function (item) {
      return cloneValue(item);
    });
  }

  if (isPlainObject(value)) {
    const cloned = {};
    Object.keys(value).forEach(function (key) {
      cloned[key] = cloneValue(value[key]);
    });
    return cloned;
  }

  return value;
}

function formatDate(date) {
  const d = date || new Date();
  const yyyy = d.getFullYear();
  const mm = leftPad2(d.getMonth() + 1);
  const dd = leftPad2(d.getDate());
  return yyyy + '-' + mm + '-' + dd;
}

function formatTime(date) {
  const d = date || new Date();
  const hh = leftPad2(d.getHours());
  const mm = leftPad2(d.getMinutes());
  const ss = leftPad2(d.getSeconds());
  return hh + ':' + mm + ':' + ss;
}

function leftPad2(num) {
  const value = String(num);
  return value.length > 1 ? value : '0' + value;
}

function normalizeControlType(type) {
  if (type === ControlType.Data || type === 'Data') {
    return ControlType.Date;
  }
  if (type === ControlType.DataRange || type === 'DataRange') {
    return ControlType.DateRange;
  }
  if (type && DEFAULT_WIDGET_MAP[type]) {
    return type;
  }
  return ControlType.String;
}

function getDefaultEnumValue(control) {
  const options = control.options || [];
  if (!options.length) {
    return '';
  }

  const first = options[0];
  if (isPlainObject(first) && hasOwn(first, 'value')) {
    return cloneValue(first.value);
  }

  return cloneValue(first);
}

function normalizeEnumOptions(options) {
  const source = options || [];
  return source.map(function (item) {
    if (isPlainObject(item)) {
      const normalized = {};
      Object.keys(item).forEach(function (key) {
        normalized[key] = cloneValue(item[key]);
      });
      if (!hasOwn(normalized, 'label') && hasOwn(normalized, 'name')) {
        normalized.label = normalized.name;
      }
      if (!hasOwn(normalized, 'label') && hasOwn(normalized, 'value')) {
        normalized.label = String(normalized.value);
      }
      if (!hasOwn(normalized, 'value') && hasOwn(normalized, 'label')) {
        normalized.value = normalized.label;
      }
      return normalized;
    }

    return {
      label: String(item),
      value: cloneValue(item)
    };
  });
}

function normalizeDefaultByType(type, value) {
  if (value instanceof Date) {
    if (type === ControlType.Date) {
      return formatDate(value);
    }
    if (type === ControlType.Time) {
      return formatTime(value);
    }
  }
  return cloneValue(value);
}

function buildDefaultValue(control) {
  if (hasOwn(control, 'defaultValue')) {
    return cloneValue(control.defaultValue);
  }

  switch (control.type) {
    case ControlType.String:
    case ControlType.Text:
    case ControlType.Image:
      return '';
    case ControlType.Boolean:
      return false;
    case ControlType.Number:
      return 0;
    case ControlType.Date:
      return formatDate(new Date());
    case ControlType.DateRange:
      return [formatDate(new Date()), formatDate(new Date())];
    case ControlType.Time:
      return formatTime(new Date());
    case ControlType.Enum:
      return getDefaultEnumValue(control);
    case ControlType.Color:
      return '#1677ff';
    case ControlType.GradientColor:
      return 'linear-gradient(180deg, #1677ff 0%, #87d068 100%)';
    case ControlType.Array:
      return [];
    case ControlType.Object:
    case ControlType.Style:
      return {};
    case ControlType.Action:
      return '';
    default:
      return '';
  }
}

function normalizeSingleControl(propertyName, control) {
  const safeControl = control || {};
  const normalizedType = normalizeControlType(safeControl.type);
  const normalized = {
    type: normalizedType,
    title: safeControl.title || safeControl.titile || propertyName,
    required: !!safeControl.required,
    description: safeControl.description || '',
    widget: safeControl.widget || DEFAULT_WIDGET_MAP[normalizedType]
  };

  if (normalizedType === ControlType.Enum) {
    normalized.enumWidget = safeControl.enumWidget || safeControl.optionType || EnumWidget.Select;
    normalized.options = normalizeEnumOptions(safeControl.options);
  }

  Object.keys(safeControl).forEach(function (key) {
    if (!hasOwn(normalized, key)) {
      normalized[key] = safeControl[key];
    }
  });

  if (!hasOwn(normalized, 'defaultValue')) {
    normalized.defaultValue = buildDefaultValue(normalized);
  } else {
    normalized.defaultValue = normalizeDefaultByType(
      normalized.type,
      normalized.defaultValue
    );
  }

  return normalized;
}

function buildDefaultProps(controls) {
  const defaults = {};
  Object.keys(controls).forEach(function (name) {
    defaults[name] = cloneValue(controls[name].defaultValue);
  });
  return defaults;
}

function safeMerge(target, source) {
  const output = {};
  Object.keys(target || {}).forEach(function (key) {
    output[key] = target[key];
  });
  Object.keys(source || {}).forEach(function (key) {
    output[key] = source[key];
  });
  return output;
}

function ensureComponentRecord(componentName) {
  if (!editorRegistry[componentName]) {
    editorRegistry[componentName] = {
      componentName: componentName,
      controls: {},
      pluginParams: {}
    };
  }
  return editorRegistry[componentName];
}

function addPropertyControlsFor(componentName, controls) {
  const record = ensureComponentRecord(componentName);
  const incoming = controls || {};
  const nextControls = safeMerge(record.controls, {});

  Object.keys(incoming).forEach(function (propertyName) {
    nextControls[propertyName] = normalizeSingleControl(propertyName, incoming[propertyName]);
  });

  record.controls = nextControls;
  return nextControls;
}

function getEditorRecord(componentName) {
  const record = editorRegistry[componentName];
  if (!record) {
    return null;
  }

  return {
    componentName: record.componentName,
    controls: cloneValue(record.controls),
    pluginParams: cloneValue(record.pluginParams),
    defaultProps: buildDefaultProps(record.controls)
  };
}

function createEditor(componentName, pluginFactory) {
  if (!componentName || typeof componentName !== 'string') {
    throw new Error('createEditor: componentName must be a non-empty string.');
  }

  if (typeof pluginFactory !== 'function') {
    throw new Error('createEditor: pluginFactory must be a function.');
  }

  const record = ensureComponentRecord(componentName);

  function addPropertyControls(controls) {
    return addPropertyControlsFor(componentName, controls);
  }

  const pluginParams = pluginFactory(ControlType, addPropertyControls) || {};
  record.pluginParams = pluginParams;

  return getEditorRecord(componentName);
}

function getPropertyControls(componentName) {
  const record = getEditorRecord(componentName);
  return record ? record.controls : null;
}

function getDefaultPropertyValues(componentName) {
  const record = getEditorRecord(componentName);
  return record ? record.defaultProps : null;
}

function getPluginParams(componentName) {
  const record = getEditorRecord(componentName);
  return record ? record.pluginParams : null;
}

function listEditors() {
  return Object.keys(editorRegistry).map(function (name) {
    return getEditorRecord(name);
  });
}

function clearEditors() {
  Object.keys(editorRegistry).forEach(function (name) {
    delete editorRegistry[name];
  });
}

export {
  ControlType,
  EnumWidget,
  DEFAULT_WIDGET_MAP,
  createEditor,
  addPropertyControlsFor as addPropertyControls,
  getEditorRecord as getEditor,
  getPropertyControls,
  getDefaultPropertyValues,
  getPluginParams,
  listEditors,
  clearEditors
};
