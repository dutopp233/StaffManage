import { ControlType } from './controlTypes';
import { resolveRendererByControl } from './defaultRenderers';

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function normalizeEnumOptions(options, propName) {
  if (!Array.isArray(options) || options.length === 0) {
    throw new Error('Enum control "' + propName + '" must provide options.');
  }

  return options.map(function(option, index) {
    if (isPlainObject(option) && 'value' in option) {
      return {
        label: option.label || String(option.value),
        value: option.value
      };
    }

    if (typeof option === 'string' || typeof option === 'number') {
      return {
        label: String(option),
        value: option
      };
    }

    throw new Error(
      'Enum control "' +
        propName +
        '" has invalid option at index ' +
        index +
        '.'
    );
  });
}

function normalizeNestedControls(control, propName) {
  if (control.type !== ControlType.Array && control.type !== ControlType.Object) {
    return control;
  }

  if (!control.controls) {
    return control;
  }

  if (!isPlainObject(control.controls)) {
    throw new Error(
      'Control "' + propName + '" uses nested controls, but "controls" is not an object.'
    );
  }

  var normalizedChildren = {};
  Object.keys(control.controls).forEach(function(childName) {
    normalizedChildren[childName] = normalizeControl(
      childName,
      control.controls[childName]
    );
  });

  return Object.assign({}, control, { controls: normalizedChildren });
}

function normalizeDefaultValue(control, propName) {
  if (!('defaultValue' in control)) {
    return control;
  }

  var defaultValue = control.defaultValue;

  if (control.type === ControlType.Date && defaultValue instanceof Date) {
    return Object.assign({}, control, { defaultValue: defaultValue.toISOString() });
  }

  if (
    (control.type === ControlType.DateRange || control.type === ControlType.DataRange) &&
    Array.isArray(defaultValue)
  ) {
    return Object.assign({}, control, {
      defaultValue: defaultValue.map(function(item) {
        return item instanceof Date ? item.toISOString() : item;
      })
    });
  }

  if (control.type === ControlType.Style && defaultValue != null && !isPlainObject(defaultValue)) {
    throw new Error('Style control "' + propName + '" defaultValue must be an object.');
  }

  return control;
}

export function normalizeControl(propName, rawControl) {
  if (!isPlainObject(rawControl)) {
    throw new Error('Control "' + propName + '" must be an object.');
  }

  if (!rawControl.type) {
    throw new Error('Control "' + propName + '" must define a type.');
  }

  var normalizedControl = Object.assign(
    {
      title: propName,
      required: false
    },
    rawControl
  );

  // Keep compatibility with typo "titile".
  if (!rawControl.title && rawControl.titile) {
    normalizedControl.title = rawControl.titile;
  }

  if (normalizedControl.type === ControlType.Enum) {
    normalizedControl.options = normalizeEnumOptions(
      normalizedControl.options,
      propName
    );
  }

  normalizedControl = normalizeNestedControls(normalizedControl, propName);
  normalizedControl = normalizeDefaultValue(normalizedControl, propName);

  // Store renderer with normalized control for direct UI rendering.
  normalizedControl.renderer = resolveRendererByControl(normalizedControl);
  return normalizedControl;
}

export function normalizeControlMap(rawControlMap) {
  if (!isPlainObject(rawControlMap)) {
    throw new Error('addPropertyControls(...) expects an object map.');
  }

  var normalizedMap = {};
  Object.keys(rawControlMap).forEach(function(propName) {
    normalizedMap[propName] = normalizeControl(propName, rawControlMap[propName]);
  });
  return normalizedMap;
}
