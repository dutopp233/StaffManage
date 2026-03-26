import React from 'react';
import { ControlType } from './createEditor';

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map(function (item) {
      return cloneValue(item);
    });
  }
  if (isObject(value)) {
    const output = {};
    Object.keys(value).forEach(function (key) {
      output[key] = cloneValue(value[key]);
    });
    return output;
  }
  return value;
}

function leftPad2(num) {
  const str = String(num);
  return str.length > 1 ? str : '0' + str;
}

function safeParseJSON(value, fallbackValue) {
  if (typeof value !== 'string') {
    return fallbackValue;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallbackValue;
  }
}

function normalizeDateValue(value) {
  if (!value) {
    return '';
  }
  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = leftPad2(value.getMonth() + 1);
    const day = leftPad2(value.getDate());
    return year + '-' + month + '-' + day;
  }
  return String(value);
}

function normalizeRangeValue(value) {
  if (!Array.isArray(value)) {
    return ['', ''];
  }
  const start = normalizeDateValue(value[0]);
  const end = normalizeDateValue(value[1]);
  return [start, end];
}

function normalizeEnumOptions(options) {
  return (options || []).map(function (item) {
    if (isObject(item)) {
      return item;
    }
    return {
      label: String(item),
      value: item
    };
  });
}

function EnumSelector(props) {
  const options = normalizeEnumOptions(props.options);
  const mode = (props.enumMode || 'select').toLowerCase();
  const value = props.value;
  const selectedIndex = options.findIndex(function (option) {
    return option.value === value;
  });
  const selectedKey = selectedIndex > -1 ? String(selectedIndex) : '';

  function getValueByIndex(indexValue) {
    const option = options[Number(indexValue)];
    if (!option) {
      return value;
    }
    return cloneValue(option.value);
  }

  if (mode === 'radio') {
    return (
      <div className="editor-enum-radio-group">
        {options.map(function (option) {
          const checked = value === option.value;
          return (
            <label key={String(option.value)} className="editor-enum-radio-item">
              <input
                type="radio"
                name={props.name}
                checked={checked}
                onChange={function () {
                  props.onChange(option.value);
                }}
              />
              {option.label}
            </label>
          );
        })}
      </div>
    );
  }

  if (mode === 'button') {
    return (
      <div className="editor-enum-button-group">
        {options.map(function (option) {
          const active = value === option.value;
          return (
            <button
              key={String(option.value)}
              type="button"
              className={active ? 'editor-enum-button active' : 'editor-enum-button'}
              onClick={function () {
                props.onChange(option.value);
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (mode === 'treeselect') {
    // 这里先用普通 Select 模拟 TreeSelect，保持数据结构兼容。
    return (
      <select
        value={selectedKey}
        onChange={function (event) {
          props.onChange(getValueByIndex(event.target.value));
        }}
      >
        {options.map(function (option, index) {
          return (
            <option key={String(index)} value={String(index)}>
              {option.label}
            </option>
          );
        })}
      </select>
    );
  }

  return (
    <select
      value={selectedKey}
      onChange={function (event) {
        props.onChange(getValueByIndex(event.target.value));
      }}
    >
      {options.map(function (option, index) {
        return (
          <option key={String(index)} value={String(index)}>
            {option.label}
          </option>
        );
      })}
    </select>
  );
}

function FieldByType(props) {
  const control = props.control;
  const value = props.value;
  const onChange = props.onChange;
  const controlName = props.controlName;
  const widgetRenderers = props.widgetRenderers || props.renderers || {};
  const customRenderer =
    widgetRenderers[control.widget] ||
    widgetRenderers[control.type] ||
    widgetRenderers[controlName];

  if (typeof customRenderer === 'function') {
    return customRenderer({
      controlName: controlName,
      control: control,
      value: value,
      onChange: onChange
    });
  }

  switch (control.type) {
    case ControlType.Boolean:
      return (
        <input
          type="checkbox"
          checked={!!value}
          onChange={function (event) {
            onChange(event.target.checked);
          }}
        />
      );
    case ControlType.Number:
      return (
        <input
          type="number"
          value={value}
          onChange={function (event) {
            onChange(Number(event.target.value || 0));
          }}
        />
      );
    case ControlType.Text:
      return (
        <textarea
          rows="4"
          value={value}
          onChange={function (event) {
            onChange(event.target.value);
          }}
        />
      );
    case ControlType.Date:
      return (
        <input
          type="date"
          value={normalizeDateValue(value)}
          onChange={function (event) {
            onChange(event.target.value);
          }}
        />
      );
    case ControlType.DateRange: {
      const rangeValue = normalizeRangeValue(value);
      return (
        <div className="editor-range-picker">
          <input
            type="date"
            value={rangeValue[0]}
            onChange={function (event) {
              onChange([event.target.value, rangeValue[1]]);
            }}
          />
          <span className="editor-range-separator">~</span>
          <input
            type="date"
            value={rangeValue[1]}
            onChange={function (event) {
              onChange([rangeValue[0], event.target.value]);
            }}
          />
        </div>
      );
    }
    case ControlType.Array:
      return (
        <textarea
          rows="4"
          value={JSON.stringify(Array.isArray(value) ? value : [], null, 2)}
          onChange={function (event) {
            onChange(safeParseJSON(event.target.value, []));
          }}
        />
      );
    case ControlType.Time:
      return (
        <input
          type="time"
          value={value}
          onChange={function (event) {
            onChange(event.target.value);
          }}
        />
      );
    case ControlType.Enum:
      return (
        <EnumSelector
          name={controlName}
          value={value}
          options={control.options}
          enumMode={control.enumMode}
          onChange={onChange}
        />
      );
    case ControlType.Color:
      return (
        <input
          type="color"
          value={value}
          onChange={function (event) {
            onChange(event.target.value);
          }}
        />
      );
    case ControlType.GradientColor:
      return (
        <input
          type="text"
          value={value}
          placeholder="linear-gradient(...)"
          onChange={function (event) {
            onChange(event.target.value);
          }}
        />
      );
    case ControlType.Image:
      return (
        <input
          type="text"
          value={value}
          placeholder="请输入图片 URL"
          onChange={function (event) {
            onChange(event.target.value);
          }}
        />
      );
    case ControlType.Action:
      return (
        <input
          type="text"
          value={value}
          placeholder="例如: ds.userInfo.name"
          onChange={function (event) {
            onChange(event.target.value);
          }}
        />
      );
    case ControlType.Object:
    case ControlType.Style:
      return (
        <textarea
          rows="4"
          value={JSON.stringify(isObject(value) ? value : {}, null, 2)}
          onChange={function (event) {
            onChange(safeParseJSON(event.target.value, {}));
          }}
        />
      );
    case ControlType.String:
    default:
      return (
        <input
          type="text"
          value={value}
          onChange={function (event) {
            onChange(event.target.value);
          }}
        />
      );
  }
}

class PropertyPanel extends React.Component {
  constructor(props) {
    super(props);
    this.handleSingleValueChange = this.handleSingleValueChange.bind(this);
  }

  handleSingleValueChange(propertyName, nextValue) {
    const prev = this.props.value || {};
    const merged = {};
    Object.keys(prev).forEach(function (key) {
      merged[key] = prev[key];
    });
    merged[propertyName] = nextValue;
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(merged, propertyName, nextValue);
    }
  }

  render() {
    const controls = this.props.controls || {};
    const value = this.props.value || {};
    const entries = Object.keys(controls);

    return (
      <div className="editor-property-panel">
        {entries.map(
          function (propertyName) {
            const control = controls[propertyName];
            const propertyValue =
              typeof value[propertyName] === 'undefined'
                ? cloneValue(control.defaultValue)
                : value[propertyName];
            return (
              <div className="editor-property-item" key={propertyName}>
                <div className="editor-property-label">
                  {control.title || propertyName}
                  {control.required ? <span className="editor-required">*</span> : null}
                </div>
                <div className="editor-property-field">
                  <FieldByType
                    controlName={propertyName}
                    control={control}
                    value={propertyValue}
                    widgetRenderers={this.props.widgetRenderers}
                    renderers={this.props.renderers}
                    onChange={this.handleSingleValueChange.bind(this, propertyName)}
                  />
                </div>
                {control.description ? (
                  <div className="editor-property-description">{control.description}</div>
                ) : null}
              </div>
            );
          }.bind(this)
        )}
      </div>
    );
  }
}

export default PropertyPanel;
