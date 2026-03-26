import { normalizeControlMap } from './validators';
import { ControlType, EnumDisplayType } from './controlTypes';
import { resolveRendererByControl } from './defaultRenderers';

var editorRegistry = {};

function ensureComponentName(componentName) {
  if (!componentName || typeof componentName !== 'string') {
    throw new Error('createEditor(componentName, plugin) requires a valid componentName.');
  }
}

export function addPropertyControls(componentName, controlMap) {
  ensureComponentName(componentName);
  var normalizedControls = normalizeControlMap(controlMap);
  var current = editorRegistry[componentName] || {};
  editorRegistry[componentName] = Object.assign({}, current, normalizedControls);
  return editorRegistry[componentName];
}

export function createEditor(componentName, plugin) {
  ensureComponentName(componentName);
  if (typeof plugin !== 'function') {
    throw new Error('createEditor(componentName, plugin) requires plugin to be a function.');
  }

  var registerControls = function(controlMap) {
    return addPropertyControls(componentName, controlMap);
  };

  var pluginResult = plugin({
    ControlType: ControlType,
    EnumDisplayType: EnumDisplayType,
    resolveRendererByControl: resolveRendererByControl,
    addPropertyControls: registerControls,
    // Keep compatibility with a typo used in early drafts.
    addaddPropertyControls: registerControls
  });

  return {
    componentName: componentName,
    controls: editorRegistry[componentName] || {},
    pluginResult: pluginResult
  };
}

export function getPropertyControls(componentName) {
  ensureComponentName(componentName);
  return editorRegistry[componentName] || {};
}

export function getEditorRegistry() {
  return Object.assign({}, editorRegistry);
}

export function clearEditorRegistry() {
  editorRegistry = {};
}
