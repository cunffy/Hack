import { r as reactExports, W as We, j as jsxRuntimeExports, A as AnimatePresence, C as ContextMenu } from "./index-DQeT4wwp.js";
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _defineProperty$1(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _iterableToArrayLimit(r, l2) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e, n, i, u, a = [], f = true, o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l2) ;
      else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l2); f = true) ;
    } catch (r2) {
      o = true, n = r2;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys$1(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2$1(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$1(Object(t), true).forEach(function(r2) {
      _defineProperty$1(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function compose$1() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }
  return function(x) {
    return fns.reduceRight(function(y, f) {
      return f(y);
    }, x);
  };
}
function curry$1(fn) {
  return function curried() {
    var _this = this;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return args.length >= fn.length ? fn.apply(this, args) : function() {
      for (var _len3 = arguments.length, nextArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        nextArgs[_key3] = arguments[_key3];
      }
      return curried.apply(_this, [].concat(args, nextArgs));
    };
  };
}
function isObject$1(value) {
  return {}.toString.call(value).includes("Object");
}
function isEmpty(obj) {
  return !Object.keys(obj).length;
}
function isFunction(value) {
  return typeof value === "function";
}
function hasOwnProperty(object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
}
function validateChanges(initial, changes) {
  if (!isObject$1(changes)) errorHandler$1("changeType");
  if (Object.keys(changes).some(function(field) {
    return !hasOwnProperty(initial, field);
  })) errorHandler$1("changeField");
  return changes;
}
function validateSelector(selector) {
  if (!isFunction(selector)) errorHandler$1("selectorType");
}
function validateHandler(handler) {
  if (!(isFunction(handler) || isObject$1(handler))) errorHandler$1("handlerType");
  if (isObject$1(handler) && Object.values(handler).some(function(_handler) {
    return !isFunction(_handler);
  })) errorHandler$1("handlersType");
}
function validateInitial(initial) {
  if (!initial) errorHandler$1("initialIsRequired");
  if (!isObject$1(initial)) errorHandler$1("initialType");
  if (isEmpty(initial)) errorHandler$1("initialContent");
}
function throwError$1(errorMessages2, type) {
  throw new Error(errorMessages2[type] || errorMessages2["default"]);
}
var errorMessages$1 = {
  initialIsRequired: "initial state is required",
  initialType: "initial state should be an object",
  initialContent: "initial state shouldn't be an empty object",
  handlerType: "handler should be an object or a function",
  handlersType: "all handlers should be a functions",
  selectorType: "selector should be a function",
  changeType: "provided value of changes should be an object",
  changeField: 'it seams you want to change a field in the state which is not specified in the "initial" state',
  "default": "an unknown error accured in `state-local` package"
};
var errorHandler$1 = curry$1(throwError$1)(errorMessages$1);
var validators$1 = {
  changes: validateChanges,
  selector: validateSelector,
  handler: validateHandler,
  initial: validateInitial
};
function create(initial) {
  var handler = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  validators$1.initial(initial);
  validators$1.handler(handler);
  var state = {
    current: initial
  };
  var didUpdate = curry$1(didStateUpdate)(state, handler);
  var update = curry$1(updateState)(state);
  var validate = curry$1(validators$1.changes)(initial);
  var getChanges = curry$1(extractChanges)(state);
  function getState2() {
    var selector = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function(state2) {
      return state2;
    };
    validators$1.selector(selector);
    return selector(state.current);
  }
  function setState2(causedChanges) {
    compose$1(didUpdate, update, validate, getChanges)(causedChanges);
  }
  return [getState2, setState2];
}
function extractChanges(state, causedChanges) {
  return isFunction(causedChanges) ? causedChanges(state.current) : causedChanges;
}
function updateState(state, changes) {
  state.current = _objectSpread2(_objectSpread2({}, state.current), changes);
  return changes;
}
function didStateUpdate(state, handler, changes) {
  isFunction(handler) ? handler(state.current) : Object.keys(changes).forEach(function(field) {
    var _handler$field;
    return (_handler$field = handler[field]) === null || _handler$field === void 0 ? void 0 : _handler$field.call(handler, state.current[field]);
  });
  return changes;
}
var index = {
  create
};
var config$1 = {
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs"
  }
};
function curry(fn) {
  return function curried() {
    var _this = this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return args.length >= fn.length ? fn.apply(this, args) : function() {
      for (var _len2 = arguments.length, nextArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        nextArgs[_key2] = arguments[_key2];
      }
      return curried.apply(_this, [].concat(args, nextArgs));
    };
  };
}
function isObject(value) {
  return {}.toString.call(value).includes("Object");
}
function validateConfig(config2) {
  if (!config2) errorHandler("configIsRequired");
  if (!isObject(config2)) errorHandler("configType");
  if (config2.urls) {
    informAboutDeprecation();
    return {
      paths: {
        vs: config2.urls.monacoBase
      }
    };
  }
  return config2;
}
function informAboutDeprecation() {
  console.warn(errorMessages.deprecation);
}
function throwError(errorMessages2, type) {
  throw new Error(errorMessages2[type] || errorMessages2["default"]);
}
var errorMessages = {
  configIsRequired: "the configuration object is required",
  configType: "the configuration object should be an object",
  "default": "an unknown error accured in `@monaco-editor/loader` package",
  deprecation: "Deprecation warning!\n    You are using deprecated way of configuration.\n\n    Instead of using\n      monaco.config({ urls: { monacoBase: '...' } })\n    use\n      monaco.config({ paths: { vs: '...' } })\n\n    For more please check the link https://github.com/suren-atoyan/monaco-loader#config\n  "
};
var errorHandler = curry(throwError)(errorMessages);
var validators = {
  config: validateConfig
};
var compose = function compose2() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }
  return function(x) {
    return fns.reduceRight(function(y, f) {
      return f(y);
    }, x);
  };
};
function merge(target, source) {
  Object.keys(source).forEach(function(key) {
    if (source[key] instanceof Object) {
      if (target[key]) {
        Object.assign(source[key], merge(target[key], source[key]));
      }
    }
  });
  return _objectSpread2$1(_objectSpread2$1({}, target), source);
}
var CANCELATION_MESSAGE = {
  type: "cancelation",
  msg: "operation is manually canceled"
};
function makeCancelable(promise) {
  var hasCanceled_ = false;
  var wrappedPromise = new Promise(function(resolve, reject) {
    promise.then(function(val) {
      return hasCanceled_ ? reject(CANCELATION_MESSAGE) : resolve(val);
    });
    promise["catch"](reject);
  });
  return wrappedPromise.cancel = function() {
    return hasCanceled_ = true;
  }, wrappedPromise;
}
var _excluded = ["monaco"];
var _state$create = index.create({
  config: config$1,
  isInitialized: false,
  resolve: null,
  reject: null,
  monaco: null
}), _state$create2 = _slicedToArray(_state$create, 2), getState = _state$create2[0], setState = _state$create2[1];
function config(globalConfig) {
  var _validators$config = validators.config(globalConfig), monaco = _validators$config.monaco, config2 = _objectWithoutProperties(_validators$config, _excluded);
  setState(function(state) {
    return {
      config: merge(state.config, config2),
      monaco
    };
  });
}
function init() {
  var state = getState(function(_ref) {
    var monaco = _ref.monaco, isInitialized = _ref.isInitialized, resolve = _ref.resolve;
    return {
      monaco,
      isInitialized,
      resolve
    };
  });
  if (!state.isInitialized) {
    setState({
      isInitialized: true
    });
    if (state.monaco) {
      state.resolve(state.monaco);
      return makeCancelable(wrapperPromise);
    }
    if (window.monaco && window.monaco.editor) {
      storeMonacoInstance(window.monaco);
      state.resolve(window.monaco);
      return makeCancelable(wrapperPromise);
    }
    compose(injectScripts, getMonacoLoaderScript)(configureLoader);
  }
  return makeCancelable(wrapperPromise);
}
function injectScripts(script) {
  return document.body.appendChild(script);
}
function createScript(src) {
  var script = document.createElement("script");
  return src && (script.src = src), script;
}
function getMonacoLoaderScript(configureLoader2) {
  var state = getState(function(_ref2) {
    var config2 = _ref2.config, reject = _ref2.reject;
    return {
      config: config2,
      reject
    };
  });
  var loaderScript = createScript("".concat(state.config.paths.vs, "/loader.js"));
  loaderScript.onload = function() {
    return configureLoader2();
  };
  loaderScript.onerror = state.reject;
  return loaderScript;
}
function configureLoader() {
  var state = getState(function(_ref3) {
    var config2 = _ref3.config, resolve = _ref3.resolve, reject = _ref3.reject;
    return {
      config: config2,
      resolve,
      reject
    };
  });
  var require2 = window.require;
  require2.config(state.config);
  require2(["vs/editor/editor.main"], function(loaded) {
    var monaco = loaded.m || loaded;
    storeMonacoInstance(monaco);
    state.resolve(monaco);
  }, function(error) {
    state.reject(error);
  });
}
function storeMonacoInstance(monaco) {
  if (!getState().monaco) {
    setState({
      monaco
    });
  }
}
function __getMonacoInstance() {
  return getState(function(_ref4) {
    var monaco = _ref4.monaco;
    return monaco;
  });
}
var wrapperPromise = new Promise(function(resolve, reject) {
  return setState({
    resolve,
    reject
  });
});
var loader = {
  config,
  init,
  __getMonacoInstance
};
var le = { wrapper: { display: "flex", position: "relative", textAlign: "initial" }, fullWidth: { width: "100%" }, hide: { display: "none" } }, v = le;
var ae = { container: { display: "flex", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" } }, Y = ae;
function Me({ children: e }) {
  return We.createElement("div", { style: Y.container }, e);
}
var Z = Me;
var $ = Z;
function Ee({ width: e, height: r, isEditorReady: n, loading: t, _ref: a, className: m, wrapperProps: E }) {
  return We.createElement("section", { style: { ...v.wrapper, width: e, height: r }, ...E }, !n && We.createElement($, null, t), We.createElement("div", { ref: a, style: { ...v.fullWidth, ...!n && v.hide }, className: m }));
}
var ee = Ee;
var H = reactExports.memo(ee);
function Ce(e) {
  reactExports.useEffect(e, []);
}
var k = Ce;
function he(e, r, n = true) {
  let t = reactExports.useRef(true);
  reactExports.useEffect(t.current || !n ? () => {
    t.current = false;
  } : e, r);
}
var l = he;
function D() {
}
function h(e, r, n, t) {
  return De(e, t) || be(e, r, n, t);
}
function De(e, r) {
  return e.editor.getModel(te(e, r));
}
function be(e, r, n, t) {
  return e.editor.createModel(r, n, t ? te(e, t) : void 0);
}
function te(e, r) {
  return e.Uri.parse(r);
}
function Oe({ original: e, modified: r, language: n, originalLanguage: t, modifiedLanguage: a, originalModelPath: m, modifiedModelPath: E, keepCurrentOriginalModel: g = false, keepCurrentModifiedModel: N = false, theme: x = "light", loading: P = "Loading...", options: y = {}, height: V = "100%", width: z = "100%", className: F, wrapperProps: j = {}, beforeMount: A = D, onMount: q = D }) {
  let [M, O] = reactExports.useState(false), [T, s] = reactExports.useState(true), u = reactExports.useRef(null), c = reactExports.useRef(null), w = reactExports.useRef(null), d = reactExports.useRef(q), o = reactExports.useRef(A), b = reactExports.useRef(false);
  k(() => {
    let i = loader.init();
    return i.then((f) => (c.current = f) && s(false)).catch((f) => f?.type !== "cancelation" && console.error("Monaco initialization: error:", f)), () => u.current ? I() : i.cancel();
  }), l(() => {
    if (u.current && c.current) {
      let i = u.current.getOriginalEditor(), f = h(c.current, e || "", t || n || "text", m || "");
      f !== i.getModel() && i.setModel(f);
    }
  }, [m], M), l(() => {
    if (u.current && c.current) {
      let i = u.current.getModifiedEditor(), f = h(c.current, r || "", a || n || "text", E || "");
      f !== i.getModel() && i.setModel(f);
    }
  }, [E], M), l(() => {
    let i = u.current.getModifiedEditor();
    i.getOption(c.current.editor.EditorOption.readOnly) ? i.setValue(r || "") : r !== i.getValue() && (i.executeEdits("", [{ range: i.getModel().getFullModelRange(), text: r || "", forceMoveMarkers: true }]), i.pushUndoStop());
  }, [r], M), l(() => {
    u.current?.getModel()?.original.setValue(e || "");
  }, [e], M), l(() => {
    let { original: i, modified: f } = u.current.getModel();
    c.current.editor.setModelLanguage(i, t || n || "text"), c.current.editor.setModelLanguage(f, a || n || "text");
  }, [n, t, a], M), l(() => {
    c.current?.editor.setTheme(x);
  }, [x], M), l(() => {
    u.current?.updateOptions(y);
  }, [y], M);
  let L = reactExports.useCallback(() => {
    if (!c.current) return;
    o.current(c.current);
    let i = h(c.current, e || "", t || n || "text", m || ""), f = h(c.current, r || "", a || n || "text", E || "");
    u.current?.setModel({ original: i, modified: f });
  }, [n, r, a, e, t, m, E]), U = reactExports.useCallback(() => {
    !b.current && w.current && (u.current = c.current.editor.createDiffEditor(w.current, { automaticLayout: true, ...y }), L(), c.current?.editor.setTheme(x), O(true), b.current = true);
  }, [y, x, L]);
  reactExports.useEffect(() => {
    M && d.current(u.current, c.current);
  }, [M]), reactExports.useEffect(() => {
    !T && !M && U();
  }, [T, M, U]);
  function I() {
    let i = u.current?.getModel();
    g || i?.original?.dispose(), N || i?.modified?.dispose(), u.current?.dispose();
  }
  return We.createElement(H, { width: z, height: V, isEditorReady: M, loading: P, _ref: w, className: F, wrapperProps: j });
}
var ie = Oe;
reactExports.memo(ie);
function He(e) {
  let r = reactExports.useRef();
  return reactExports.useEffect(() => {
    r.current = e;
  }, [e]), r.current;
}
var se = He;
var _ = /* @__PURE__ */ new Map();
function Ve({ defaultValue: e, defaultLanguage: r, defaultPath: n, value: t, language: a, path: m, theme: E = "light", line: g, loading: N = "Loading...", options: x = {}, overrideServices: P = {}, saveViewState: y = true, keepCurrentModel: V = false, width: z = "100%", height: F = "100%", className: j, wrapperProps: A = {}, beforeMount: q = D, onMount: M = D, onChange: O, onValidate: T = D }) {
  let [s, u] = reactExports.useState(false), [c, w] = reactExports.useState(true), d = reactExports.useRef(null), o = reactExports.useRef(null), b = reactExports.useRef(null), L = reactExports.useRef(M), U = reactExports.useRef(q), I = reactExports.useRef(), i = reactExports.useRef(t), f = se(m), Q = reactExports.useRef(false), B = reactExports.useRef(false);
  k(() => {
    let p = loader.init();
    return p.then((R) => (d.current = R) && w(false)).catch((R) => R?.type !== "cancelation" && console.error("Monaco initialization: error:", R)), () => o.current ? pe() : p.cancel();
  }), l(() => {
    let p = h(d.current, e || t || "", r || a || "", m || n || "");
    p !== o.current?.getModel() && (y && _.set(f, o.current?.saveViewState()), o.current?.setModel(p), y && o.current?.restoreViewState(_.get(m)));
  }, [m], s), l(() => {
    o.current?.updateOptions(x);
  }, [x], s), l(() => {
    !o.current || t === void 0 || (o.current.getOption(d.current.editor.EditorOption.readOnly) ? o.current.setValue(t) : t !== o.current.getValue() && (B.current = true, o.current.executeEdits("", [{ range: o.current.getModel().getFullModelRange(), text: t, forceMoveMarkers: true }]), o.current.pushUndoStop(), B.current = false));
  }, [t], s), l(() => {
    let p = o.current?.getModel();
    p && a && d.current?.editor.setModelLanguage(p, a);
  }, [a], s), l(() => {
    g !== void 0 && o.current?.revealLine(g);
  }, [g], s), l(() => {
    d.current?.editor.setTheme(E);
  }, [E], s);
  let X = reactExports.useCallback(() => {
    if (!(!b.current || !d.current) && !Q.current) {
      U.current(d.current);
      let p = m || n, R = h(d.current, t || e || "", r || a || "", p || "");
      o.current = d.current?.editor.create(b.current, { model: R, automaticLayout: true, ...x }, P), y && o.current.restoreViewState(_.get(p)), d.current.editor.setTheme(E), g !== void 0 && o.current.revealLine(g), u(true), Q.current = true;
    }
  }, [e, r, n, t, a, m, x, P, y, E, g]);
  reactExports.useEffect(() => {
    s && L.current(o.current, d.current);
  }, [s]), reactExports.useEffect(() => {
    !c && !s && X();
  }, [c, s, X]), i.current = t, reactExports.useEffect(() => {
    s && O && (I.current?.dispose(), I.current = o.current?.onDidChangeModelContent((p) => {
      B.current || O(o.current.getValue(), p);
    }));
  }, [s, O]), reactExports.useEffect(() => {
    if (s) {
      let p = d.current.editor.onDidChangeMarkers((R) => {
        let G = o.current.getModel()?.uri;
        if (G && R.find((J) => J.path === G.path)) {
          let J = d.current.editor.getModelMarkers({ resource: G });
          T?.(J);
        }
      });
      return () => {
        p?.dispose();
      };
    }
    return () => {
    };
  }, [s, T]);
  function pe() {
    I.current?.dispose(), V ? y && _.set(m, o.current.saveViewState()) : o.current.getModel()?.dispose(), o.current.dispose();
  }
  return We.createElement(H, { width: z, height: F, isEditorReady: s, loading: N, _ref: b, className: j, wrapperProps: A });
}
var fe = Ve;
var de = reactExports.memo(fe);
var Ft = de;
const FILE_ICONS = {
  py: { icon: "🐍", color: "#ffcc00" },
  js: { icon: "JS", color: "#f7df1e" },
  ts: { icon: "TS", color: "#3178c6" },
  tsx: { icon: "TSX", color: "#61dafb" },
  jsx: { icon: "JSX", color: "#61dafb" },
  rs: { icon: "🦀", color: "#f74c00" },
  go: { icon: "Go", color: "#00add8" },
  c: { icon: "C", color: "#00d4ff" },
  cpp: { icon: "C++", color: "#00d4ff" },
  sh: { icon: "$", color: "#00ff88" },
  json: { icon: "{}", color: "#bb88ff" },
  md: { icon: "MD", color: "#c9d1d9" }
};
function TreeNode({
  entry,
  depth,
  onOpenFile,
  onContextMenu
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [children, setChildren] = reactExports.useState([]);
  const toggle = async () => {
    if (!entry.isDir) {
      onOpenFile(entry.path, entry.name);
      return;
    }
    if (!open) {
      const entries = await window.cryogram.fs.readDir(entry.path);
      setChildren(entries);
    }
    setOpen(!open);
  };
  const icon = entry.isDir ? open ? "📂" : "📁" : FILE_ICONS[entry.ext] || { icon: "📄", color: "#6e7681" };
  const iconEl = typeof icon === "string" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: icon }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: icon.color, fontSize: 10, fontWeight: "bold" }, children: icon.icon });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-1.5 px-2 py-0.5 cursor-pointer hover:bg-cryo-border/40 text-cryo-text text-xs rounded transition-colors",
        style: { paddingLeft: `${8 + depth * 12}px` },
        onClick: toggle,
        onContextMenu: (e) => {
          e.preventDefault();
          onContextMenu(e, entry);
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 w-4 text-center", children: iconEl }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: entry.name })
        ]
      }
    ),
    open && children.map((child) => /* @__PURE__ */ jsxRuntimeExports.jsx(TreeNode, { entry: child, depth: depth + 1, onOpenFile, onContextMenu }, child.path))
  ] });
}
function FileTree({ workspace, onOpenFile }) {
  const [entries, setEntries] = reactExports.useState([]);
  const [ctx, setCtx] = reactExports.useState(null);
  const reload = () => {
    window.cryogram.fs.readDir("__workspace__").then(setEntries).catch(() => setEntries([]));
  };
  reactExports.useEffect(() => {
    reload();
  }, [workspace]);
  const ctxItems = () => {
    if (!ctx) return [];
    const { entry } = ctx;
    const items = [];
    if (!entry.isDir) {
      items.push({ label: "Open File", action: () => onOpenFile(entry.path, entry.name) });
    }
    items.push({
      label: "Copy Path",
      action: () => navigator.clipboard.writeText(entry.path).catch(() => {
      })
    });
    if (entry.isDir) {
      items.push({ sep: true });
      items.push({
        label: "New File Here",
        action: async () => {
          const name = prompt("File name:");
          if (!name) return;
          const sep = entry.path.endsWith("/") ? "" : "/";
          await window.cryogram.fs.writeFile(`${entry.path}${sep}${name}`, "").catch(() => {
          });
          reload();
        }
      });
    }
    return items;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 pb-1 text-xs text-cryo-muted font-bold uppercase tracking-wider", children: "Explorer" }),
    entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 text-xs text-cryo-muted", children: "Empty workspace" }) : entries.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(TreeNode, { entry: e, depth: 0, onOpenFile, onContextMenu: (ev, entry) => setCtx({ x: ev.clientX, y: ev.clientY, entry }) }, e.path)),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: ctx && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ContextMenu,
      {
        x: ctx.x,
        y: ctx.y,
        onClose: () => setCtx(null),
        items: ctxItems()
      }
    ) })
  ] });
}
const LANG_MAP = {
  js: "javascript",
  ts: "typescript",
  jsx: "javascript",
  tsx: "typescript",
  py: "python",
  c: "c",
  cpp: "cpp",
  h: "c",
  hpp: "cpp",
  rs: "rust",
  go: "go",
  json: "json",
  md: "markdown",
  sh: "shell",
  bash: "shell",
  yaml: "yaml",
  yml: "yaml",
  toml: "toml",
  css: "css",
  html: "html",
  sql: "sql"
};
const RUN_COMMANDS = {
  python: 'python3 "{file}"',
  javascript: 'node "{file}"',
  typescript: 'npx ts-node "{file}"',
  c: 'gcc "{file}" -o /tmp/cryogram_c_out && /tmp/cryogram_c_out',
  cpp: 'g++ "{file}" -o /tmp/cryogram_cpp_out && /tmp/cryogram_cpp_out',
  rust: 'rustc "{file}" -o /tmp/cryogram_rs_out && /tmp/cryogram_rs_out',
  go: 'go run "{file}"',
  shell: 'bash "{file}"'
};
function Editor() {
  const [workspace, setWorkspace] = reactExports.useState(null);
  const [files, setFiles] = reactExports.useState([]);
  const [activeIdx, setActiveIdx] = reactExports.useState(0);
  const [output, setOutput] = reactExports.useState(null);
  const [running, setRunning] = reactExports.useState(false);
  reactExports.useEffect(() => {
    window.cryogram.fs.getWorkspace().then(setWorkspace);
  }, []);
  const openFile = reactExports.useCallback(async (filePath, fileName) => {
    const existing = files.findIndex((f) => f.path === filePath);
    if (existing >= 0) {
      setActiveIdx(existing);
      return;
    }
    try {
      const content = await window.cryogram.fs.readFile(filePath);
      const ext = fileName.split(".").pop() || "";
      const lang = LANG_MAP[ext] || "plaintext";
      setFiles((prev) => {
        const next = [...prev, { path: filePath, name: fileName, content, lang, dirty: false }];
        setActiveIdx(next.length - 1);
        return next;
      });
    } catch (err) {
      console.error("Failed to open file", err);
    }
  }, []);
  const saveFile = reactExports.useCallback(async () => {
    const file = files[activeIdx];
    if (!file) return;
    await window.cryogram.fs.writeFile(file.path, file.content);
    setFiles((prev) => prev.map((f, i) => i === activeIdx ? { ...f, dirty: false } : f));
  }, [files, activeIdx]);
  const closeTab = reactExports.useCallback((idx) => {
    setFiles((prev) => prev.filter((_2, i) => i !== idx));
    setActiveIdx((prev) => Math.max(0, prev > idx ? prev - 1 : prev));
  }, []);
  const runFile = reactExports.useCallback(async () => {
    const file = files[activeIdx];
    if (!file) return;
    setRunning(true);
    setOutput("Running...\n");
    await window.cryogram.fs.writeFile(file.path, file.content);
    const cmd = RUN_COMMANDS[file.lang];
    if (!cmd) {
      setOutput(`No runner configured for ${file.lang}`);
      setRunning(false);
      return;
    }
    setOutput(`$ ${cmd.replace("{file}", file.path)}

Open the Terminal app and run the command above to execute this file.`);
    setRunning(false);
  }, [files, activeIdx]);
  const activeFile = files[activeIdx];
  if (!workspace) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center gap-4 p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cryo-muted text-sm", children: "No workspace selected" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "btn btn-primary",
          onClick: async () => {
            const path = await window.cryogram.fs.openDialog();
            if (path) setWorkspace(path);
          },
          children: "Open Workspace Folder"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-48 shrink-0 border-r border-cryo-border overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileTree, { workspace, onOpenFile: openFile }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center border-b border-cryo-border bg-cryo-surface overflow-x-auto shrink-0", children: files.map((f, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: () => setActiveIdx(idx),
          className: `flex items-center gap-1.5 px-3 py-1.5 border-r border-cryo-border cursor-pointer shrink-0 text-xs transition-colors ${idx === activeIdx ? "bg-cryo-bg text-cryo-text" : "text-cryo-muted hover:text-cryo-text"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "max-w-28 truncate", children: [
              f.name,
              f.dirty ? " •" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  closeTab(idx);
                },
                className: "text-cryo-muted hover:text-cryo-red w-3.5 h-3.5 flex items-center justify-center rounded",
                children: "×"
              }
            )
          ]
        },
        f.path
      )) }),
      activeFile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 border-b border-cryo-border bg-cryo-surface shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cryo-muted flex-1 truncate", children: activeFile.path }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge text-cryo-muted", style: { background: "#1e2d40" }, children: activeFile.lang }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn text-xs py-1 px-2", onClick: saveFile, children: "Save" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "btn btn-success text-xs py-1 px-2",
              onClick: runFile,
              disabled: running,
              children: "Run"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Ft,
          {
            height: output ? "65%" : "100%",
            language: activeFile.lang,
            value: activeFile.content,
            theme: "vs-dark",
            options: {
              fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
              fontSize: 13,
              lineHeight: 1.6,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              renderLineHighlight: "gutter",
              padding: { top: 8, bottom: 8 }
            },
            onChange: (val) => {
              if (val === void 0) return;
              setFiles(
                (prev) => prev.map((f, i) => i === activeIdx ? { ...f, content: val, dirty: true } : f)
              );
            }
          }
        ),
        output && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-cryo-border bg-cryo-bg p-3 overflow-auto font-mono text-xs text-cryo-green whitespace-pre", style: { height: "35%" }, children: [
          output,
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn text-xs mt-2", onClick: () => setOutput(null), children: "Clear" })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center text-cryo-muted text-sm", children: "Double-click a file to open it" })
    ] })
  ] });
}
export {
  Editor as default
};
