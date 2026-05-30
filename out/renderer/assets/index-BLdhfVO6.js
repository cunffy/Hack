const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./Terminal-Bw2WvJex.js","./Terminal-BXKNkDff.css"])))=>i.map(i=>d[i]);
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$1 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e;
  else if (1 < g) {
    for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$1(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$1:
        case n$1:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$1, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
    return a2;
  })) : null != c && (O$1(c) && (c = N$1(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g = 0; g < a.length; g++) {
    k2 = a[g];
    var f2 = d + Q$1(k2, g);
    h += R$1(k2, b, e, f2, c);
  }
  else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g++), h += R$1(k2, b, e, f2, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
function X$1() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$1;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f2 in b) J.call(b, f2) && !L$1.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d.children = e;
  else if (1 < f2) {
    g = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$1, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = X$1;
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$1.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$1.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$1.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const We$1 = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var client = {};
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g(C2, c)) n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports.unstable_now());
    }, b);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_scheduleCallback = function(a, b, c) {
    var d = exports.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e[g] !== f2[h]) {
              var k2 = "\n" + e[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p(189));
      }
    }
    if (c.alternate !== d) throw Error(p(190));
  }
  if (3 !== c.tag) throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id$2, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id$2, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id$2 = null;
function Yc(a, b, c, d) {
  id$2 = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id$2 = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g = Ke(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p(284));
    if (!c._owner) throw Error(p(290, a));
  }
  return a;
}
function Mg(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function Ng(a) {
  var b = a._init;
  return b(a._payload);
}
function Og(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = Pg(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
    d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = Lg(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
      Mg(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      Mg(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      Mg(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g2 = f2(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function t2(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g2 = f2(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = Lg(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = Sg(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t2(a2, d2, f3, h2);
      Mg(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a) {
  var b = Wg.current;
  E(Wg);
  a._currentValue = b;
}
function bh(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function ch(a, b) {
  Xg = a;
  Zg = Yg = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
}
function eh(a) {
  var b = a._currentValue;
  if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
    if (null === Xg) throw Error(p(308));
    Yg = a;
    Xg.dependencies = { lanes: 0, firstContext: a };
  } else Yg = Yg.next = a;
  return b;
}
var fh = null;
function gh(a) {
  null === fh ? fh = [a] : fh.push(a);
}
function hh(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return ih(a, d);
}
function ih(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var jh = false;
function kh(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function mh(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function nh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return ih(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return ih(a, c);
}
function oh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function ph(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function qh(a, b, c, d) {
  var e = a.updateQueue;
  jh = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    rh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function sh(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p(191, e));
      e.call(d);
    }
  }
}
var th = {}, uh = Uf(th), vh$1 = Uf(th), wh = Uf(th);
function xh(a) {
  if (a === th) throw Error(p(174));
  return a;
}
function yh(a, b) {
  G(wh, b);
  G(vh$1, a);
  G(uh, th);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(uh);
  G(uh, b);
}
function zh() {
  E(uh);
  E(vh$1);
  E(wh);
}
function Ah(a) {
  xh(wh.current);
  var b = xh(uh.current);
  var c = lb(b, a.type);
  b !== c && (G(vh$1, a), G(uh, c));
}
function Bh(a) {
  vh$1.current === a && (E(uh), E(vh$1));
}
var L = Uf(0);
function Ch(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p(321));
}
function Mh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Nh(a, b, c, d, e, f2) {
  Hh = f2;
  M = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
  a = c(d, e);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p(301));
      f2 += 1;
      O = N = null;
      b.updateQueue = null;
      Fh.current = Qh;
      a = c(d, e);
    } while (Jh);
  }
  Fh.current = Rh;
  b = null !== N && null !== N.next;
  Hh = 0;
  O = N = M = null;
  Ih = false;
  if (b) throw Error(p(300));
  return a;
}
function Sh() {
  var a = 0 !== Kh;
  Kh = 0;
  return a;
}
function Th() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O ? M.memoizedState = O = a : O = O.next = a;
  return O;
}
function Uh() {
  if (null === N) {
    var a = M.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = N.next;
  var b = null === O ? M.memoizedState : O.next;
  if (null !== b) O = b, N = a;
  else {
    if (null === a) throw Error(p(310));
    N = a;
    a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
  }
  return O;
}
function Vh(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Wh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = N, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        M.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (dh = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, M.lanes |= f2, rh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function Xh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He(f2, b.memoizedState) || (dh = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function Yh() {
}
function Zh(a, b) {
  var c = M, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, dh = true);
  d = d.queue;
  $h(ai.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== O && O.memoizedState.tag & 1) {
    c.flags |= 2048;
    bi(9, ci.bind(null, c, d, e, b), void 0, null);
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(c, b, e);
  }
  return e;
}
function di(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function ci(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  ei(b) && fi(a);
}
function ai(a, b, c) {
  return c(function() {
    ei(b) && fi(a);
  });
}
function ei(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function fi(a) {
  var b = ih(a, 1);
  null !== b && gi(b, a, 1, -1);
}
function hi(a) {
  var b = Th();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ii.bind(null, M, a);
  return [b.memoizedState, a];
}
function bi(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a, b, c, d) {
  var e = Th();
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
}
function li(a, b, c, d) {
  var e = Uh();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== N) {
    var g = N.memoizedState;
    f2 = g.destroy;
    if (null !== d && Mh(d, g.deps)) {
      e.memoizedState = bi(b, c, f2, d);
      return;
    }
  }
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, f2, d);
}
function mi(a, b) {
  return ki(8390656, 8, a, b);
}
function $h(a, b) {
  return li(2048, 8, a, b);
}
function ni(a, b) {
  return li(4, 2, a, b);
}
function oi(a, b) {
  return li(4, 4, a, b);
}
function pi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function qi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return li(4, 4, pi.bind(null, b, a), c);
}
function ri() {
}
function si(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function ti(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function ui(a, b, c) {
  if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
  He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
  return b;
}
function vi(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Gh.transition;
  Gh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Gh.transition = d;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a, b, c) {
  var d = yi(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, c);
  else if (c = hh(a, b, c, d), null !== c) {
    var e = R();
    gi(c, a, d, e);
    Bi(c, b, d);
  }
}
function ii(a, b, c) {
  var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g = b.lastRenderedState, h = f2(g, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = hh(a, b, e, d);
    null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
  }
}
function zi(a) {
  var b = a.alternate;
  return a === M || null !== b && b === M;
}
function Ai(a, b) {
  Jh = Ih = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Bi(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
  Th().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ki(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ki(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = Th();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = Th();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = xi.bind(null, M, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = Th();
  a = { current: a };
  return b.memoizedState = a;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
  return Th().memoizedState = a;
}, useTransition: function() {
  var a = hi(false), b = a[0];
  a = vi.bind(null, a[1]);
  Th().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = M, e = Th();
  if (I) {
    if (void 0 === c) throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  mi(ai.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  bi(9, ci.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = Th(), b = Q.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Kh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a) {
    var b = Uh();
    return ui(b, N.memoizedState, a);
  },
  useTransition: function() {
    var a = Wh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a) {
  var b = Uh();
  return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
}, useTransition: function() {
  var a = Xh(Vh)[0], b = Uh().memoizedState;
  return [a, b];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Di(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var Ei = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = R(), d = yi(a), e = mh(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = nh(a, e, d);
  null !== b && (gi(b, a, d, c), oh(b, a, d));
} };
function Fi(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function Gi(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Ei;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function Hi(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
}
function Ii(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = {};
  kh(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function Ji(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Ki(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Li(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Oi || (Oi = true, Pi = d);
    Li(a, b);
  };
  return c;
}
function Qi(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Li(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Li(a, b);
    "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Si(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Mi();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
}
function Ui(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Vi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a, b, c, d) {
  b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
}
function Yi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  ch(b, e);
  d = Nh(a, b, c, d, f2, e);
  c = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Xi(a, b, d, e);
  return b.child;
}
function $i(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
    a = Rg(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
  }
  b.flags |= 1;
  a = Pg(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function bj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
    else return b.lanes = a.lanes, Zi(a, b, e);
  }
  return cj(a, b, c, d, e);
}
function dj(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(ej, fj);
    fj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
  Xi(a, b, e, c);
  return b.child;
}
function gj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function cj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  ch(b, e);
  c = Nh(a, b, c, d, f2, e);
  d = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Xi(a, b, c, e);
  return b.child;
}
function hj(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  ch(b, e);
  if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
    jh = false;
    var r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    lh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Ci(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && Hi(b, g, d, k2);
    jh = false;
    r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b, c, y2, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return jj(a, b, c, d, f2, e);
}
function jj(a, b, c, d, e, f2) {
  gj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
  d = b.stateNode;
  Wi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function kj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  yh(a, b.containerInfo);
}
function lj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Xi(a, b, c, d);
  return b.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function oj(a, b, c) {
  var d = b.pendingProps, e = L.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(L, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = mj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = Pg(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function qj(a, b) {
  b = pj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function sj(a, b, c, d) {
  null !== d && Jg(d);
  Ug(b, a.child, null, c);
  a = qj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function rj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = pj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Tg(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Ug(b, a.child, null, g);
    b.child.memoizedState = nj(g);
    b.memoizedState = mj;
    return f2;
  }
  if (0 === (b.mode & 1)) return sj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p(419));
    d = Ki(f2, d, void 0);
    return sj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (dh || h) {
    d = Q;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
    }
    tj();
    d = Ki(Error(p(421)));
    return sj(a, b, g, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = qj(b, d.children);
  b.flags |= 4096;
  return b;
}
function vj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  bh(a.return, b, c);
}
function wj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function xj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Xi(a, b, d.children, c);
  d = L.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
      else if (19 === a.tag) vj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(L, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      wj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Ch(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      wj(b, true, c, null, f2);
      break;
    case "together":
      wj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function ij(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function Zi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  rh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = Pg(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function yj(a, b, c) {
  switch (b.tag) {
    case 3:
      kj(b);
      Ig();
      break;
    case 5:
      Ah(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      yh(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Wg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
        G(L, L.current & 1);
        a = Zi(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(L, L.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return xj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(L, L.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, dj(a, b, c);
  }
  return Zi(a, b, c);
}
var zj, Aj, Bj, Cj;
zj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Aj = function() {
};
Bj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Cj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Dj(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Ej(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      zh();
      E(Wf);
      E(H);
      Eh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a, b);
      S(b);
      return null;
    case 5:
      Bh(b);
      var e = xh(wh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p(166));
          S(b);
          return null;
        }
        a = xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D(lf[e], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2) if (f2.hasOwnProperty(g)) {
            var h = f2[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          zj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], a);
                e = d;
                break;
              case "source":
                D("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e = d;
                break;
              case "details":
                D("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
        c = xh(wh.current);
        xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(L);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return ah(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(L);
      f2 = b.memoizedState;
      if (null === f2) return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g) if (d) Dj(f2, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Ch(a);
          if (null !== g) {
            b.flags |= 128;
            Dj(f2, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(L, L.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Ch(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S(b), null;
        } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Ij(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Bh(b), null;
    case 13:
      E(L);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Mj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Nj = false;
function Oj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e && (h = g);
            r2 === f2 && ++m2 === d && (k2 = g);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Ci(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Mj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Qj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Rj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Sj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Sj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Tj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Uj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Tj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Vj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
var X = null, Xj = false;
function Yj(a, b, c) {
  for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
}
function Zj(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Lj(c, b);
    case 6:
      var d = X, e = Xj;
      X = null;
      Yj(a, b, c);
      X = d;
      Xj = e;
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
      break;
    case 18:
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
      break;
    case 4:
      d = X;
      e = Xj;
      X = c.stateNode.containerInfo;
      Xj = true;
      Yj(a, b, c);
      X = d;
      Xj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Yj(a, b, c);
      break;
    case 1:
      if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Yj(a, b, c);
      break;
    case 21:
      Yj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
      break;
    default:
      Yj(a, b, c);
  }
}
function ak(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Kj());
    b.forEach(function(b2) {
      var d = bk.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function ck(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X = h.stateNode;
            Xj = false;
            break a;
          case 3:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X) throw Error(p(160));
      Zj(f2, g, e);
      X = null;
      Xj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
}
function dk(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b, a);
      ek(a);
      if (d & 4) {
        try {
          Pj(3, a, a.return), Qj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Pj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      break;
    case 5:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g);
          var l2 = vb(h, f2);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r2 = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      ck(b, a);
      ek(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      ck(b, a);
      ek(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      ck(b, a);
      ek(a);
      break;
    case 13:
      ck(b, a);
      ek(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
      d & 4 && ak(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, ck(b, a), U = l2) : ck(b, a);
      ek(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r2, r2.return);
                break;
              case 1:
                Lj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Lj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b, a);
      ek(a);
      d & 4 && ak(a);
      break;
    case 21:
      break;
    default:
      ck(
        b,
        a
      ), ek(a);
  }
}
function ek(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Tj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Uj(a);
          Wj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Uj(a);
          Vj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function hk(a, b, c) {
  V = a;
  ik(a);
}
function ik(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Jj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Jj;
        var l2 = U;
        Jj = g;
        if ((U = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
        for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
        V = e;
        Jj = h;
        U = l2;
      }
      kk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Qj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && sh(b, f2, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              sh(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p(163));
        }
        U || b.flags & 512 && Rj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function gk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function jk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Qj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function gi(a, b, c, d) {
  if (50 < yk) throw yk = 0, zk = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Fk(c, Gk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Gk(a, b) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6)) throw Error(p(327));
  var c = a.callbackNode;
  if (Hk() && a.callbackNode !== c) return null;
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(a, h);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e;
    null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
    if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
    if (6 === b) Ck(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Pk(a, tk, uk);
          break;
        case 3:
          Ck(a, d);
          if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              R();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 4:
          Ck(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 5:
          Pk(a, tk, uk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Dk(a, B());
  return a.callbackNode === c ? Gk.bind(null, a) : null;
}
function Nk(a, b) {
  var c = sk;
  a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
  a = Ik(a, b);
  2 !== a && (b = tk, tk = c, null !== b && Fj(b));
  return a;
}
function Fj(a) {
  null === tk ? tk = a : tk.push.apply(tk, a);
}
function Ok(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Ck(a, b) {
  b &= ~rk;
  b &= ~qk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Ek(a) {
  if (0 !== (K & 6)) throw Error(p(327));
  Hk();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Dk(a, B()), null;
  var c = Ik(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Nk(a, d));
  }
  if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
  if (6 === c) throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Pk(a, tk, uk);
  Dk(a, B());
  return null;
}
function Qk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b = K;
  K |= 1;
  var c = ok.transition, d = C;
  try {
    if (ok.transition = null, C = 1, a) return a();
  } finally {
    C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        zh();
        E(Wf);
        E(H);
        Eh();
        break;
      case 5:
        Bh(d);
        break;
      case 4:
        zh();
        break;
      case 13:
        E(L);
        break;
      case 19:
        E(L);
        break;
      case 10:
        ah(d.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c = c.return;
  }
  Q = a;
  Y = a = Pg(a.current, null);
  Z = fj = b;
  T = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g = f2.next;
        f2.next = e;
        d.next = g;
      }
      c.pending = d;
    }
    fh = null;
  }
  return a;
}
function Mk(a, b) {
  do {
    var c = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d = M.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Ih = false;
      }
      Hh = 0;
      O = N = M = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c || null === c.return) {
        T = 1;
        pk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g, h, f2, b);
            y2.mode & 1 && Si(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Si(f2, l2, b);
              tj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Ui(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g, h, f2, b);
            Jg(Ji(k2, h));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h);
        4 !== T && (T = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Ni(f2, k2, b);
              ph(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Qi(f2, h, b);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a = mk.current;
  mk.current = Rh;
  return null === a ? Rh : a;
}
function tj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a, b) {
  var c = K;
  K |= 2;
  var d = Jk();
  if (Q !== a || Z !== b) uk = null, Kk(a, b);
  do
    try {
      Tk();
      break;
    } catch (e) {
      Mk(a, e);
    }
  while (1);
  $g();
  K = c;
  mk.current = d;
  if (null !== Y) throw Error(p(261));
  Q = null;
  Z = 0;
  return T;
}
function Tk() {
  for (; null !== Y; ) Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc(); ) Uk(Y);
}
function Uk(a) {
  var b = Vk(a.alternate, a, fj);
  a.memoizedProps = a.pendingProps;
  null === b ? Sk(a) : Y = b;
  nk.current = null;
}
function Sk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Ej(c, b, fj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Ij(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Pk(a, b, c) {
  var d = C, e = ok.transition;
  try {
    ok.transition = null, C = 1, Wk(a, b, c, d);
  } finally {
    ok.transition = e, C = d;
  }
  return null;
}
function Wk(a, b, c, d) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6)) throw Error(p(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === Q && (Y = Q = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g = C;
    C = 1;
    var h = K;
    K |= 4;
    nk.current = null;
    Oj(a, c);
    dk(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    hk(c);
    dc();
    K = h;
    C = g;
    ok.transition = f2;
  } else a.current = c;
  vk && (vk = false, wk = a, xk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c.stateNode);
  Dk(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Oi) throw Oi = false, a = Pi, Pi = null, a;
  0 !== (xk & 1) && 0 !== a.tag && Hk();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a = Dc(xk), b = ok.transition, c = C;
    try {
      ok.transition = null;
      C = 16 > a ? 16 : a;
      if (null === wk) var d = false;
      else {
        a = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6)) throw Error(p(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V = x2;
              break b;
            }
            V = f2.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
          else b: for (g = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, ok.transition = b;
    }
  }
  return false;
}
function Xk(a, b, c) {
  b = Ji(c, b);
  b = Ni(a, b, 1);
  a = nh(a, b, 1);
  b = R();
  null !== a && (Ac(a, 1, b), Dk(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Xk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Xk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
        a = Ji(c, a);
        a = Qi(b, a, 1);
        b = nh(b, a, 1);
        a = R();
        null !== b && (Ac(b, 1, a), Dk(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ti(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = R();
  a.pingedLanes |= a.suspendedLanes & c;
  Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
  Dk(a, b);
}
function Yk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = R();
  a = ih(a, b);
  null !== a && (Ac(a, b, c), Dk(a, c));
}
function uj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Yk(a, c);
}
function bk(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Yk(a, c);
}
var Vk;
Vk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
    dh = 0 !== (a.flags & 131072) ? true : false;
  }
  else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      ij(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      ch(b, c);
      e = Nh(null, b, d, a, e, c);
      var f2 = Sh();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        ij(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = Zk(d);
        a = Ci(d, a);
        switch (e) {
          case 0:
            b = cj(null, b, d, a, c);
            break a;
          case 1:
            b = hj(null, b, d, a, c);
            break a;
          case 11:
            b = Yi(null, b, d, a, c);
            break a;
          case 14:
            b = $i(null, b, d, Ci(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
    case 3:
      a: {
        kj(b);
        if (null === a) throw Error(p(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        lh(a, b);
        qh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ji(Error(p(423)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ji(Error(p(424)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = Zi(a, b, c);
            break a;
          }
          Xi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return oj(a, b, c);
    case 4:
      return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
    case 7:
      return Xi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G(Wg, d._currentValue);
        d._currentValue = g;
        if (null !== f2) if (He(f2.value, g)) {
          if (f2.children === e.children && !Wf.current) {
            b = Zi(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                bh(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g = f2.return;
            if (null === g) throw Error(p(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            bh(g, c, b);
            g = f2.sibling;
          } else g = f2.child;
          if (null !== g) g.return = f2;
          else for (g = f2; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f2 = g.sibling;
            if (null !== f2) {
              f2.return = g.return;
              g = f2;
              break;
            }
            g = g.return;
          }
          f2 = g;
        }
        Xi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
    case 15:
      return bj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
    case 19:
      return xj(a, b, c);
    case 22:
      return dj(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Fk(a, b) {
  return ac(a, b);
}
function $k(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new $k(a, b, c, d);
}
function aj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function Zk(a) {
  if ("function" === typeof a) return aj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function Pg(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function Rg(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a) aj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Tg(c.children, e, f2, b);
    case za:
      g = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return pj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Tg(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function pj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function Qg(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function Sg(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function al(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a, b, c, d, e, f2, g, h, k2) {
  a = new al(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a;
}
function cl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function dl(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function el(a, b, c, d, e, f2, g, h, k2) {
  a = bl(c, d, true, a, e, f2, g, h, k2);
  a.context = dl(null);
  c = a.current;
  d = R();
  e = yi(c);
  f2 = mh(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  nh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Dk(a, d);
  return a;
}
function fl(a, b, c, d) {
  var e = b.current, f2 = R(), g = yi(e);
  c = dl(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = mh(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = nh(e, b, g);
  null !== a && (gi(a, e, g, f2), oh(a, e, g));
  return g;
}
function gl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function hl(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function il(a, b) {
  hl(a, b);
  (a = a.alternate) && hl(a, b);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ll(a) {
  this._internalRoot = a;
}
ml.prototype.render = ll.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p(409));
  fl(a, b, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Rk(function() {
      fl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function ml(a) {
  this._internalRoot = a;
}
ml.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function nl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function pl() {
}
function ql(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = gl(g);
        f2.call(a2);
      };
    }
    var g = el(b, d, a, 0, null, false, false, "", pl);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk();
    return g;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = gl(k2);
      h.call(a2);
    };
  }
  var k2 = bl(a, 0, false, null, null, false, false, "", pl);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Rk(function() {
    fl(b, k2, c, d);
  });
  return k2;
}
function rl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = gl(g);
        h.call(a2);
      };
    }
    fl(b, g, a, e);
  } else g = ql(c, b, a, e, d);
  return gl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b2 = ih(a, 1);
        if (null !== b2) {
          var c2 = R();
          gi(b2, a, 1, c2);
        }
      }), il(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = ih(a, 134217728);
    if (null !== b) {
      var c = R();
      gi(b, a, 134217728, c);
    }
    il(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = yi(a), c = ih(a, b);
    if (null !== c) {
      var d = R();
      gi(c, a, b, d);
    }
    il(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b)) throw Error(p(200));
  return cl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!nl(a)) throw Error(p(299));
  var c = false, d = "", e = kl;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = bl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ll(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Rk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!nl(a)) throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new ml(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!ol(a)) throw Error(p(40));
  return a._reactRootContainer ? (Rk(function() {
    rl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!ol(c)) throw Error(p(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p(38));
  return rl(a, b, c, false, d);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}
const LayoutGroupContext = reactExports.createContext({});
function useConstant(init) {
  const ref = reactExports.useRef(null);
  if (ref.current === null) {
    ref.current = init();
  }
  return ref.current;
}
const isBrowser$1 = typeof window !== "undefined";
const useIsomorphicLayoutEffect = isBrowser$1 ? reactExports.useLayoutEffect : reactExports.useEffect;
const PresenceContext = /* @__PURE__ */ reactExports.createContext(null);
function addUniqueItem(arr, item) {
  if (arr.indexOf(item) === -1)
    arr.push(item);
}
function removeItem(arr, item) {
  const index = arr.indexOf(item);
  if (index > -1)
    arr.splice(index, 1);
}
function moveItem([...arr], fromIndex, toIndex) {
  const startIndex = fromIndex < 0 ? arr.length + fromIndex : fromIndex;
  if (startIndex >= 0 && startIndex < arr.length) {
    const endIndex = toIndex < 0 ? arr.length + toIndex : toIndex;
    const [item] = arr.splice(fromIndex, 1);
    arr.splice(endIndex, 0, item);
  }
  return arr;
}
const clamp = (min, max, v2) => {
  if (v2 > max)
    return max;
  if (v2 < min)
    return min;
  return v2;
};
let invariant = () => {
};
const MotionGlobalConfig = {};
const isNumericalString = (v2) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v2);
const isObject = (value) => typeof value === "object" && value !== null;
const isZeroValueString = (v2) => /^0[^.\s]+$/u.test(v2);
// @__NO_SIDE_EFFECTS__
function memo(callback) {
  let result;
  return () => {
    if (result === void 0)
      result = callback();
    return result;
  };
}
const noop = /* @__NO_SIDE_EFFECTS__ */ (any) => any;
const pipe = (...transformers) => transformers.reduce((a, b) => (v2) => b(a(v2)));
const progress = /* @__NO_SIDE_EFFECTS__ */ (from, to, value) => {
  const range = to - from;
  return range ? (value - from) / range : 1;
};
class SubscriptionManager {
  constructor() {
    this.subscriptions = [];
  }
  add(handler) {
    addUniqueItem(this.subscriptions, handler);
    return () => removeItem(this.subscriptions, handler);
  }
  notify(a, b, c) {
    const numSubscriptions = this.subscriptions.length;
    if (!numSubscriptions)
      return;
    if (numSubscriptions === 1) {
      this.subscriptions[0](a, b, c);
    } else {
      for (let i = 0; i < numSubscriptions; i++) {
        const handler = this.subscriptions[i];
        handler && handler(a, b, c);
      }
    }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const secondsToMilliseconds = /* @__NO_SIDE_EFFECTS__ */ (seconds) => seconds * 1e3;
const millisecondsToSeconds = /* @__NO_SIDE_EFFECTS__ */ (milliseconds) => milliseconds / 1e3;
const velocityPerSecond = /* @__NO_SIDE_EFFECTS__ */ (velocity, frameDuration) => frameDuration ? velocity * (1e3 / frameDuration) : 0;
const calcBezier = (t2, a1, a2) => (((1 - 3 * a2 + 3 * a1) * t2 + (3 * a2 - 6 * a1)) * t2 + 3 * a1) * t2;
const subdivisionPrecision = 1e-7;
const subdivisionMaxIterations = 12;
function binarySubdivide(x2, lowerBound, upperBound, mX1, mX2) {
  let currentX;
  let currentT;
  let i = 0;
  do {
    currentT = lowerBound + (upperBound - lowerBound) / 2;
    currentX = calcBezier(currentT, mX1, mX2) - x2;
    if (currentX > 0) {
      upperBound = currentT;
    } else {
      lowerBound = currentT;
    }
  } while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
  return currentT;
}
// @__NO_SIDE_EFFECTS__
function cubicBezier(mX1, mY1, mX2, mY2) {
  if (mX1 === mY1 && mX2 === mY2)
    return noop;
  const getTForX = (aX) => binarySubdivide(aX, 0, 1, mX1, mX2);
  return (t2) => t2 === 0 || t2 === 1 ? t2 : calcBezier(getTForX(t2), mY1, mY2);
}
const mirrorEasing = /* @__NO_SIDE_EFFECTS__ */ (easing) => (p2) => p2 <= 0.5 ? easing(2 * p2) / 2 : (2 - easing(2 * (1 - p2))) / 2;
const reverseEasing = /* @__NO_SIDE_EFFECTS__ */ (easing) => (p2) => 1 - easing(1 - p2);
const backOut = /* @__PURE__ */ cubicBezier(0.33, 1.53, 0.69, 0.99);
const backIn = /* @__PURE__ */ reverseEasing(backOut);
const backInOut = /* @__PURE__ */ mirrorEasing(backIn);
const anticipate = (p2) => p2 >= 1 ? 1 : (p2 *= 2) < 1 ? 0.5 * backIn(p2) : 0.5 * (2 - Math.pow(2, -10 * (p2 - 1)));
const circIn = (p2) => 1 - Math.sin(Math.acos(p2));
const circOut = /* @__PURE__ */ reverseEasing(circIn);
const circInOut = /* @__PURE__ */ mirrorEasing(circIn);
const easeIn = /* @__PURE__ */ cubicBezier(0.42, 0, 1, 1);
const easeOut = /* @__PURE__ */ cubicBezier(0, 0, 0.58, 1);
const easeInOut = /* @__PURE__ */ cubicBezier(0.42, 0, 0.58, 1);
const isEasingArray = /* @__NO_SIDE_EFFECTS__ */ (ease2) => {
  return Array.isArray(ease2) && typeof ease2[0] !== "number";
};
const isBezierDefinition = /* @__NO_SIDE_EFFECTS__ */ (easing) => Array.isArray(easing) && typeof easing[0] === "number";
const easingLookup = {
  linear: noop,
  easeIn,
  easeInOut,
  easeOut,
  circIn,
  circInOut,
  circOut,
  backIn,
  backInOut,
  backOut,
  anticipate
};
const isValidEasing = (easing) => {
  return typeof easing === "string";
};
const easingDefinitionToFunction = (definition) => {
  if (/* @__PURE__ */ isBezierDefinition(definition)) {
    invariant(definition.length === 4);
    const [x1, y1, x2, y2] = definition;
    return /* @__PURE__ */ cubicBezier(x1, y1, x2, y2);
  } else if (isValidEasing(definition)) {
    return easingLookup[definition];
  }
  return definition;
};
const stepsOrder = [
  "setup",
  // Compute
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "preUpdate",
  // Compute
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
function createRenderStep(runNextFrame, stepName) {
  let thisFrame = /* @__PURE__ */ new Set();
  let nextFrame = /* @__PURE__ */ new Set();
  let isProcessing = false;
  let flushNextFrame = false;
  const toKeepAlive = /* @__PURE__ */ new WeakSet();
  let latestFrameData = {
    delta: 0,
    timestamp: 0,
    isProcessing: false
  };
  function triggerCallback(callback) {
    if (toKeepAlive.has(callback)) {
      step.schedule(callback);
      runNextFrame();
    }
    callback(latestFrameData);
  }
  const step = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (callback, keepAlive = false, immediate = false) => {
      const addToCurrentFrame = immediate && isProcessing;
      const queue = addToCurrentFrame ? thisFrame : nextFrame;
      if (keepAlive)
        toKeepAlive.add(callback);
      queue.add(callback);
      return callback;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (callback) => {
      nextFrame.delete(callback);
      toKeepAlive.delete(callback);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (frameData2) => {
      latestFrameData = frameData2;
      if (isProcessing) {
        flushNextFrame = true;
        return;
      }
      isProcessing = true;
      const prevFrame = thisFrame;
      thisFrame = nextFrame;
      nextFrame = prevFrame;
      thisFrame.forEach(triggerCallback);
      thisFrame.clear();
      isProcessing = false;
      if (flushNextFrame) {
        flushNextFrame = false;
        step.process(frameData2);
      }
    }
  };
  return step;
}
const maxElapsed = 40;
function createRenderBatcher(scheduleNextBatch, allowKeepAlive) {
  let runNextFrame = false;
  let useDefaultElapsed = true;
  const state = {
    delta: 0,
    timestamp: 0,
    isProcessing: false
  };
  const flagRunNextFrame = () => runNextFrame = true;
  const steps = stepsOrder.reduce((acc, key) => {
    acc[key] = createRenderStep(flagRunNextFrame);
    return acc;
  }, {});
  const { setup, read, resolveKeyframes, preUpdate, update, preRender, render, postRender } = steps;
  const processBatch = () => {
    const useManualTiming = MotionGlobalConfig.useManualTiming;
    const timestamp = useManualTiming ? state.timestamp : performance.now();
    runNextFrame = false;
    if (!useManualTiming) {
      state.delta = useDefaultElapsed ? 1e3 / 60 : Math.max(Math.min(timestamp - state.timestamp, maxElapsed), 1);
    }
    state.timestamp = timestamp;
    state.isProcessing = true;
    setup.process(state);
    read.process(state);
    resolveKeyframes.process(state);
    preUpdate.process(state);
    update.process(state);
    preRender.process(state);
    render.process(state);
    postRender.process(state);
    state.isProcessing = false;
    if (runNextFrame && allowKeepAlive) {
      useDefaultElapsed = false;
      scheduleNextBatch(processBatch);
    }
  };
  const wake = () => {
    runNextFrame = true;
    useDefaultElapsed = true;
    if (!state.isProcessing) {
      scheduleNextBatch(processBatch);
    }
  };
  const schedule = stepsOrder.reduce((acc, key) => {
    const step = steps[key];
    acc[key] = (process, keepAlive = false, immediate = false) => {
      if (!runNextFrame)
        wake();
      return step.schedule(process, keepAlive, immediate);
    };
    return acc;
  }, {});
  const cancel = (process) => {
    for (let i = 0; i < stepsOrder.length; i++) {
      steps[stepsOrder[i]].cancel(process);
    }
  };
  return { schedule, cancel, state, steps };
}
const { schedule: frame, cancel: cancelFrame, state: frameData, steps: frameSteps } = /* @__PURE__ */ createRenderBatcher(typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : noop, true);
let now;
function clearTime() {
  now = void 0;
}
const time = {
  now: () => {
    if (now === void 0) {
      time.set(frameData.isProcessing || MotionGlobalConfig.useManualTiming ? frameData.timestamp : performance.now());
    }
    return now;
  },
  set: (newTime) => {
    now = newTime;
    queueMicrotask(clearTime);
  }
};
const checkStringStartsWith = (token) => (key) => typeof key === "string" && key.startsWith(token);
const isCSSVariableName = /* @__PURE__ */ checkStringStartsWith("--");
const startsAsVariableToken = /* @__PURE__ */ checkStringStartsWith("var(--");
const isCSSVariableToken = (value) => {
  const startsWithToken = startsAsVariableToken(value);
  if (!startsWithToken)
    return false;
  return singleCssVariableRegex.test(value.split("/*")[0].trim());
};
const singleCssVariableRegex = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function containsCSSVariable(value) {
  if (typeof value !== "string")
    return false;
  return value.split("/*")[0].includes("var(--");
}
const number = {
  test: (v2) => typeof v2 === "number",
  parse: parseFloat,
  transform: (v2) => v2
};
const alpha = {
  ...number,
  transform: (v2) => clamp(0, 1, v2)
};
const scale = {
  ...number,
  default: 1
};
const sanitize = (v2) => Math.round(v2 * 1e5) / 1e5;
const floatRegex = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function isNullish(v2) {
  return v2 == null;
}
const singleColorRegex = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
const isColorString = (type, testProp) => (v2) => {
  return Boolean(typeof v2 === "string" && singleColorRegex.test(v2) && v2.startsWith(type) || testProp && !isNullish(v2) && Object.prototype.hasOwnProperty.call(v2, testProp));
};
const splitColor = (aName, bName, cName) => (v2) => {
  if (typeof v2 !== "string")
    return v2;
  const [a, b, c, alpha2] = v2.match(floatRegex);
  return {
    [aName]: parseFloat(a),
    [bName]: parseFloat(b),
    [cName]: parseFloat(c),
    alpha: alpha2 !== void 0 ? parseFloat(alpha2) : 1
  };
};
const clampRgbUnit = (v2) => clamp(0, 255, v2);
const rgbUnit = {
  ...number,
  transform: (v2) => Math.round(clampRgbUnit(v2))
};
const rgba = {
  test: /* @__PURE__ */ isColorString("rgb", "red"),
  parse: /* @__PURE__ */ splitColor("red", "green", "blue"),
  transform: ({ red, green, blue, alpha: alpha$1 = 1 }) => "rgba(" + rgbUnit.transform(red) + ", " + rgbUnit.transform(green) + ", " + rgbUnit.transform(blue) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
};
function parseHex(v2) {
  let r2 = "";
  let g = "";
  let b = "";
  let a = "";
  if (v2.length > 5) {
    r2 = v2.substring(1, 3);
    g = v2.substring(3, 5);
    b = v2.substring(5, 7);
    a = v2.substring(7, 9);
  } else {
    r2 = v2.substring(1, 2);
    g = v2.substring(2, 3);
    b = v2.substring(3, 4);
    a = v2.substring(4, 5);
    r2 += r2;
    g += g;
    b += b;
    a += a;
  }
  return {
    red: parseInt(r2, 16),
    green: parseInt(g, 16),
    blue: parseInt(b, 16),
    alpha: a ? parseInt(a, 16) / 255 : 1
  };
}
const hex = {
  test: /* @__PURE__ */ isColorString("#"),
  parse: parseHex,
  transform: rgba.transform
};
const createUnitType = /* @__NO_SIDE_EFFECTS__ */ (unit) => ({
  test: (v2) => typeof v2 === "string" && v2.endsWith(unit) && v2.split(" ").length === 1,
  parse: parseFloat,
  transform: (v2) => `${v2}${unit}`
});
const degrees = /* @__PURE__ */ createUnitType("deg");
const percent = /* @__PURE__ */ createUnitType("%");
const px = /* @__PURE__ */ createUnitType("px");
const vh = /* @__PURE__ */ createUnitType("vh");
const vw = /* @__PURE__ */ createUnitType("vw");
const progressPercentage = /* @__PURE__ */ (() => ({
  ...percent,
  parse: (v2) => percent.parse(v2) / 100,
  transform: (v2) => percent.transform(v2 * 100)
}))();
const hsla = {
  test: /* @__PURE__ */ isColorString("hsl", "hue"),
  parse: /* @__PURE__ */ splitColor("hue", "saturation", "lightness"),
  transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
    return "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
  }
};
const color = {
  test: (v2) => rgba.test(v2) || hex.test(v2) || hsla.test(v2),
  parse: (v2) => {
    if (rgba.test(v2)) {
      return rgba.parse(v2);
    } else if (hsla.test(v2)) {
      return hsla.parse(v2);
    } else {
      return hex.parse(v2);
    }
  },
  transform: (v2) => {
    return typeof v2 === "string" ? v2 : v2.hasOwnProperty("red") ? rgba.transform(v2) : hsla.transform(v2);
  },
  getAnimatableNone: (v2) => {
    const parsed = color.parse(v2);
    parsed.alpha = 0;
    return color.transform(parsed);
  }
};
const colorRegex = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function test(v2) {
  return isNaN(v2) && typeof v2 === "string" && (v2.match(floatRegex)?.length || 0) + (v2.match(colorRegex)?.length || 0) > 0;
}
const NUMBER_TOKEN = "number";
const COLOR_TOKEN = "color";
const VAR_TOKEN = "var";
const VAR_FUNCTION_TOKEN = "var(";
const SPLIT_TOKEN = "${}";
const complexRegex = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function analyseComplexValue(value) {
  const originalValue = value.toString();
  const values = [];
  const indexes = {
    color: [],
    number: [],
    var: []
  };
  const types = [];
  let i = 0;
  const tokenised = originalValue.replace(complexRegex, (parsedValue) => {
    if (color.test(parsedValue)) {
      indexes.color.push(i);
      types.push(COLOR_TOKEN);
      values.push(color.parse(parsedValue));
    } else if (parsedValue.startsWith(VAR_FUNCTION_TOKEN)) {
      indexes.var.push(i);
      types.push(VAR_TOKEN);
      values.push(parsedValue);
    } else {
      indexes.number.push(i);
      types.push(NUMBER_TOKEN);
      values.push(parseFloat(parsedValue));
    }
    ++i;
    return SPLIT_TOKEN;
  });
  const split = tokenised.split(SPLIT_TOKEN);
  return { values, split, indexes, types };
}
function parseComplexValue(v2) {
  return analyseComplexValue(v2).values;
}
function buildTransformer({ split, types }) {
  const numSections = split.length;
  return (v2) => {
    let output = "";
    for (let i = 0; i < numSections; i++) {
      output += split[i];
      if (v2[i] !== void 0) {
        const type = types[i];
        if (type === NUMBER_TOKEN) {
          output += sanitize(v2[i]);
        } else if (type === COLOR_TOKEN) {
          output += color.transform(v2[i]);
        } else {
          output += v2[i];
        }
      }
    }
    return output;
  };
}
function createTransformer(source) {
  return buildTransformer(analyseComplexValue(source));
}
const convertNumbersToZero = (v2) => typeof v2 === "number" ? 0 : color.test(v2) ? color.getAnimatableNone(v2) : v2;
const convertToZero = (value, splitBefore) => {
  if (typeof value === "number") {
    return splitBefore?.trim().endsWith("/") ? value : 0;
  }
  return convertNumbersToZero(value);
};
function getAnimatableNone$1(v2) {
  const info = analyseComplexValue(v2);
  const transformer = buildTransformer(info);
  return transformer(info.values.map((value, i) => convertToZero(value, info.split[i])));
}
const complex = {
  test,
  parse: parseComplexValue,
  createTransformer,
  getAnimatableNone: getAnimatableNone$1
};
function hueToRgb(p2, q2, t2) {
  if (t2 < 0)
    t2 += 1;
  if (t2 > 1)
    t2 -= 1;
  if (t2 < 1 / 6)
    return p2 + (q2 - p2) * 6 * t2;
  if (t2 < 1 / 2)
    return q2;
  if (t2 < 2 / 3)
    return p2 + (q2 - p2) * (2 / 3 - t2) * 6;
  return p2;
}
function hslaToRgba({ hue, saturation, lightness, alpha: alpha2 }) {
  hue /= 360;
  saturation /= 100;
  lightness /= 100;
  let red = 0;
  let green = 0;
  let blue = 0;
  if (!saturation) {
    red = green = blue = lightness;
  } else {
    const q2 = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
    const p2 = 2 * lightness - q2;
    red = hueToRgb(p2, q2, hue + 1 / 3);
    green = hueToRgb(p2, q2, hue);
    blue = hueToRgb(p2, q2, hue - 1 / 3);
  }
  return {
    red: Math.round(red * 255),
    green: Math.round(green * 255),
    blue: Math.round(blue * 255),
    alpha: alpha2
  };
}
function mixImmediate(a, b) {
  return (p2) => p2 > 0 ? b : a;
}
const mixNumber$1 = (from, to, progress2) => {
  return from + (to - from) * progress2;
};
const mixLinearColor = (from, to, v2) => {
  const fromExpo = from * from;
  const expo = v2 * (to * to - fromExpo) + fromExpo;
  return expo < 0 ? 0 : Math.sqrt(expo);
};
const colorTypes = [hex, rgba, hsla];
const getColorType = (v2) => colorTypes.find((type) => type.test(v2));
function asRGBA(color2) {
  const type = getColorType(color2);
  if (!Boolean(type))
    return false;
  let model = type.parse(color2);
  if (type === hsla) {
    model = hslaToRgba(model);
  }
  return model;
}
const mixColor = (from, to) => {
  const fromRGBA = asRGBA(from);
  const toRGBA = asRGBA(to);
  if (!fromRGBA || !toRGBA) {
    return mixImmediate(from, to);
  }
  const blended = { ...fromRGBA };
  return (v2) => {
    blended.red = mixLinearColor(fromRGBA.red, toRGBA.red, v2);
    blended.green = mixLinearColor(fromRGBA.green, toRGBA.green, v2);
    blended.blue = mixLinearColor(fromRGBA.blue, toRGBA.blue, v2);
    blended.alpha = mixNumber$1(fromRGBA.alpha, toRGBA.alpha, v2);
    return rgba.transform(blended);
  };
};
const invisibleValues = /* @__PURE__ */ new Set(["none", "hidden"]);
function mixVisibility(origin, target) {
  if (invisibleValues.has(origin)) {
    return (p2) => p2 <= 0 ? origin : target;
  } else {
    return (p2) => p2 >= 1 ? target : origin;
  }
}
function mixNumber(a, b) {
  return (p2) => mixNumber$1(a, b, p2);
}
function getMixer(a) {
  if (typeof a === "number") {
    return mixNumber;
  } else if (typeof a === "string") {
    return isCSSVariableToken(a) ? mixImmediate : color.test(a) ? mixColor : mixComplex;
  } else if (Array.isArray(a)) {
    return mixArray;
  } else if (typeof a === "object") {
    return color.test(a) ? mixColor : mixObject;
  }
  return mixImmediate;
}
function mixArray(a, b) {
  const output = [...a];
  const numValues = output.length;
  const blendValue = a.map((v2, i) => getMixer(v2)(v2, b[i]));
  return (p2) => {
    for (let i = 0; i < numValues; i++) {
      output[i] = blendValue[i](p2);
    }
    return output;
  };
}
function mixObject(a, b) {
  const output = { ...a, ...b };
  const blendValue = {};
  for (const key in output) {
    if (a[key] !== void 0 && b[key] !== void 0) {
      blendValue[key] = getMixer(a[key])(a[key], b[key]);
    }
  }
  return (v2) => {
    for (const key in blendValue) {
      output[key] = blendValue[key](v2);
    }
    return output;
  };
}
function matchOrder(origin, target) {
  const orderedOrigin = [];
  const pointers = { color: 0, var: 0, number: 0 };
  for (let i = 0; i < target.values.length; i++) {
    const type = target.types[i];
    const originIndex = origin.indexes[type][pointers[type]];
    const originValue = origin.values[originIndex] ?? 0;
    orderedOrigin[i] = originValue;
    pointers[type]++;
  }
  return orderedOrigin;
}
const mixComplex = (origin, target) => {
  const template = complex.createTransformer(target);
  const originStats = analyseComplexValue(origin);
  const targetStats = analyseComplexValue(target);
  const canInterpolate = originStats.indexes.var.length === targetStats.indexes.var.length && originStats.indexes.color.length === targetStats.indexes.color.length && originStats.indexes.number.length >= targetStats.indexes.number.length;
  if (canInterpolate) {
    if (invisibleValues.has(origin) && !targetStats.values.length || invisibleValues.has(target) && !originStats.values.length) {
      return mixVisibility(origin, target);
    }
    return pipe(mixArray(matchOrder(originStats, targetStats), targetStats.values), template);
  } else {
    return mixImmediate(origin, target);
  }
};
function mix(from, to, p2) {
  if (typeof from === "number" && typeof to === "number" && typeof p2 === "number") {
    return mixNumber$1(from, to, p2);
  }
  const mixer = getMixer(from);
  return mixer(from, to);
}
const frameloopDriver = (update) => {
  const passTimestamp = ({ timestamp }) => update(timestamp);
  return {
    start: (keepAlive = true) => frame.update(passTimestamp, keepAlive),
    stop: () => cancelFrame(passTimestamp),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => frameData.isProcessing ? frameData.timestamp : time.now()
  };
};
const generateLinearEasing = (easing, duration, resolution = 10) => {
  let points = "";
  const numPoints = Math.max(Math.round(duration / resolution), 2);
  for (let i = 0; i < numPoints; i++) {
    points += Math.round(easing(i / (numPoints - 1)) * 1e4) / 1e4 + ", ";
  }
  return `linear(${points.substring(0, points.length - 2)})`;
};
const maxGeneratorDuration = 2e4;
function calcGeneratorDuration(generator) {
  let duration = 0;
  const timeStep = 50;
  let state = generator.next(duration);
  while (!state.done && duration < maxGeneratorDuration) {
    duration += timeStep;
    state = generator.next(duration);
  }
  return duration >= maxGeneratorDuration ? Infinity : duration;
}
function createGeneratorEasing(options, scale2 = 100, createGenerator) {
  const generator = createGenerator({ ...options, keyframes: [0, scale2] });
  const duration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
  return {
    type: "keyframes",
    ease: (progress2) => {
      return generator.next(duration * progress2).value / scale2;
    },
    duration: /* @__PURE__ */ millisecondsToSeconds(duration)
  };
}
const springDefaults = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
};
function calcAngularFreq(undampedFreq, dampingRatio) {
  return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
}
const rootIterations = 12;
function approximateRoot(envelope, derivative, initialGuess) {
  let result = initialGuess;
  for (let i = 1; i < rootIterations; i++) {
    result = result - envelope(result) / derivative(result);
  }
  return result;
}
const safeMin = 1e-3;
function findSpring({ duration = springDefaults.duration, bounce = springDefaults.bounce, velocity = springDefaults.velocity, mass = springDefaults.mass }) {
  let envelope;
  let derivative;
  let dampingRatio = 1 - bounce;
  dampingRatio = clamp(springDefaults.minDamping, springDefaults.maxDamping, dampingRatio);
  duration = clamp(springDefaults.minDuration, springDefaults.maxDuration, /* @__PURE__ */ millisecondsToSeconds(duration));
  if (dampingRatio < 1) {
    envelope = (undampedFreq2) => {
      const exponentialDecay = undampedFreq2 * dampingRatio;
      const delta = exponentialDecay * duration;
      const a = exponentialDecay - velocity;
      const b = calcAngularFreq(undampedFreq2, dampingRatio);
      const c = Math.exp(-delta);
      return safeMin - a / b * c;
    };
    derivative = (undampedFreq2) => {
      const exponentialDecay = undampedFreq2 * dampingRatio;
      const delta = exponentialDecay * duration;
      const d = delta * velocity + velocity;
      const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq2, 2) * duration;
      const f2 = Math.exp(-delta);
      const g = calcAngularFreq(Math.pow(undampedFreq2, 2), dampingRatio);
      const factor = -envelope(undampedFreq2) + safeMin > 0 ? -1 : 1;
      return factor * ((d - e) * f2) / g;
    };
  } else {
    envelope = (undampedFreq2) => {
      const a = Math.exp(-undampedFreq2 * duration);
      const b = (undampedFreq2 - velocity) * duration + 1;
      return -safeMin + a * b;
    };
    derivative = (undampedFreq2) => {
      const a = Math.exp(-undampedFreq2 * duration);
      const b = (velocity - undampedFreq2) * (duration * duration);
      return a * b;
    };
  }
  const initialGuess = 5 / duration;
  const undampedFreq = approximateRoot(envelope, derivative, initialGuess);
  duration = /* @__PURE__ */ secondsToMilliseconds(duration);
  if (isNaN(undampedFreq)) {
    return {
      stiffness: springDefaults.stiffness,
      damping: springDefaults.damping,
      duration
    };
  } else {
    const stiffness = Math.pow(undampedFreq, 2) * mass;
    return {
      stiffness,
      damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
      duration
    };
  }
}
const durationKeys = ["duration", "bounce"];
const physicsKeys = ["stiffness", "damping", "mass"];
function isSpringType(options, keys) {
  return keys.some((key) => options[key] !== void 0);
}
function getSpringOptions(options) {
  let springOptions = {
    velocity: springDefaults.velocity,
    stiffness: springDefaults.stiffness,
    damping: springDefaults.damping,
    mass: springDefaults.mass,
    isResolvedFromDuration: false,
    ...options
  };
  if (!isSpringType(options, physicsKeys) && isSpringType(options, durationKeys)) {
    springOptions.velocity = 0;
    if (options.visualDuration) {
      const visualDuration = options.visualDuration;
      const root = 2 * Math.PI / (visualDuration * 1.2);
      const stiffness = root * root;
      const damping = 2 * clamp(0.05, 1, 1 - (options.bounce || 0)) * Math.sqrt(stiffness);
      springOptions = {
        ...springOptions,
        mass: springDefaults.mass,
        stiffness,
        damping
      };
    } else {
      const derived = findSpring({ ...options, velocity: 0 });
      springOptions = {
        ...springOptions,
        ...derived,
        mass: springDefaults.mass
      };
      springOptions.isResolvedFromDuration = true;
    }
  }
  return springOptions;
}
function spring(optionsOrVisualDuration = springDefaults.visualDuration, bounce = springDefaults.bounce) {
  const options = typeof optionsOrVisualDuration !== "object" ? {
    visualDuration: optionsOrVisualDuration,
    keyframes: [0, 1],
    bounce
  } : optionsOrVisualDuration;
  let { restSpeed, restDelta } = options;
  const origin = options.keyframes[0];
  const target = options.keyframes[options.keyframes.length - 1];
  const state = { done: false, value: origin };
  const { stiffness, damping, mass, duration, velocity, isResolvedFromDuration } = getSpringOptions({
    ...options,
    velocity: -/* @__PURE__ */ millisecondsToSeconds(options.velocity || 0)
  });
  const initialVelocity = velocity || 0;
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
  const initialDelta = target - origin;
  const undampedAngularFreq = /* @__PURE__ */ millisecondsToSeconds(Math.sqrt(stiffness / mass));
  const isGranularScale = Math.abs(initialDelta) < 5;
  restSpeed || (restSpeed = isGranularScale ? springDefaults.restSpeed.granular : springDefaults.restSpeed.default);
  restDelta || (restDelta = isGranularScale ? springDefaults.restDelta.granular : springDefaults.restDelta.default);
  let resolveSpring;
  let resolveVelocity;
  let angularFreq;
  let A2;
  let sinCoeff;
  let cosCoeff;
  if (dampingRatio < 1) {
    angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
    A2 = (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq;
    resolveSpring = (t2) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t2);
      return target - envelope * (A2 * Math.sin(angularFreq * t2) + initialDelta * Math.cos(angularFreq * t2));
    };
    sinCoeff = dampingRatio * undampedAngularFreq * A2 + initialDelta * angularFreq;
    cosCoeff = dampingRatio * undampedAngularFreq * initialDelta - A2 * angularFreq;
    resolveVelocity = (t2) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t2);
      return envelope * (sinCoeff * Math.sin(angularFreq * t2) + cosCoeff * Math.cos(angularFreq * t2));
    };
  } else if (dampingRatio === 1) {
    resolveSpring = (t2) => target - Math.exp(-undampedAngularFreq * t2) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t2);
    const C2 = initialVelocity + undampedAngularFreq * initialDelta;
    resolveVelocity = (t2) => Math.exp(-undampedAngularFreq * t2) * (undampedAngularFreq * C2 * t2 - initialVelocity);
  } else {
    const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
    resolveSpring = (t2) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t2);
      const freqForT = Math.min(dampedAngularFreq * t2, 300);
      return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) + dampedAngularFreq * initialDelta * Math.cosh(freqForT)) / dampedAngularFreq;
    };
    const P2 = (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / dampedAngularFreq;
    const sinhCoeff = dampingRatio * undampedAngularFreq * P2 - initialDelta * dampedAngularFreq;
    const coshCoeff = dampingRatio * undampedAngularFreq * initialDelta - P2 * dampedAngularFreq;
    resolveVelocity = (t2) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t2);
      const freqForT = Math.min(dampedAngularFreq * t2, 300);
      return envelope * (sinhCoeff * Math.sinh(freqForT) + coshCoeff * Math.cosh(freqForT));
    };
  }
  const generator = {
    calculatedDuration: isResolvedFromDuration ? duration || null : null,
    velocity: (t2) => /* @__PURE__ */ secondsToMilliseconds(resolveVelocity(t2)),
    next: (t2) => {
      if (!isResolvedFromDuration && dampingRatio < 1) {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t2);
        const sin = Math.sin(angularFreq * t2);
        const cos = Math.cos(angularFreq * t2);
        const current2 = target - envelope * (A2 * sin + initialDelta * cos);
        const currentVelocity = /* @__PURE__ */ secondsToMilliseconds(envelope * (sinCoeff * sin + cosCoeff * cos));
        state.done = Math.abs(currentVelocity) <= restSpeed && Math.abs(target - current2) <= restDelta;
        state.value = state.done ? target : current2;
        return state;
      }
      const current = resolveSpring(t2);
      if (!isResolvedFromDuration) {
        const currentVelocity = /* @__PURE__ */ secondsToMilliseconds(resolveVelocity(t2));
        state.done = Math.abs(currentVelocity) <= restSpeed && Math.abs(target - current) <= restDelta;
      } else {
        state.done = t2 >= duration;
      }
      state.value = state.done ? target : current;
      return state;
    },
    toString: () => {
      const calculatedDuration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
      const easing = generateLinearEasing((progress2) => generator.next(calculatedDuration * progress2).value, calculatedDuration, 30);
      return calculatedDuration + "ms " + easing;
    },
    toTransition: () => {
    }
  };
  return generator;
}
spring.applyToOptions = (options) => {
  const generatorOptions = createGeneratorEasing(options, 100, spring);
  options.ease = generatorOptions.ease;
  options.duration = /* @__PURE__ */ secondsToMilliseconds(generatorOptions.duration);
  options.type = "keyframes";
  return options;
};
const velocitySampleDuration = 5;
function getGeneratorVelocity(resolveValue, t2, current) {
  const prevT = Math.max(t2 - velocitySampleDuration, 0);
  return /* @__PURE__ */ velocityPerSecond(current - resolveValue(prevT), t2 - prevT);
}
function inertia({ keyframes: keyframes2, velocity = 0, power = 0.8, timeConstant = 325, bounceDamping = 10, bounceStiffness = 500, modifyTarget, min, max, restDelta = 0.5, restSpeed }) {
  const origin = keyframes2[0];
  const state = {
    done: false,
    value: origin
  };
  const isOutOfBounds = (v2) => min !== void 0 && v2 < min || max !== void 0 && v2 > max;
  const nearestBoundary = (v2) => {
    if (min === void 0)
      return max;
    if (max === void 0)
      return min;
    return Math.abs(min - v2) < Math.abs(max - v2) ? min : max;
  };
  let amplitude = power * velocity;
  const ideal = origin + amplitude;
  const target = modifyTarget === void 0 ? ideal : modifyTarget(ideal);
  if (target !== ideal)
    amplitude = target - origin;
  const calcDelta = (t2) => -amplitude * Math.exp(-t2 / timeConstant);
  const calcLatest = (t2) => target + calcDelta(t2);
  const applyFriction = (t2) => {
    const delta = calcDelta(t2);
    const latest = calcLatest(t2);
    state.done = Math.abs(delta) <= restDelta;
    state.value = state.done ? target : latest;
  };
  let timeReachedBoundary;
  let spring$1;
  const checkCatchBoundary = (t2) => {
    if (!isOutOfBounds(state.value))
      return;
    timeReachedBoundary = t2;
    spring$1 = spring({
      keyframes: [state.value, nearestBoundary(state.value)],
      velocity: getGeneratorVelocity(calcLatest, t2, state.value),
      // TODO: This should be passing * 1000
      damping: bounceDamping,
      stiffness: bounceStiffness,
      restDelta,
      restSpeed
    });
  };
  checkCatchBoundary(0);
  return {
    calculatedDuration: null,
    next: (t2) => {
      let hasUpdatedFrame = false;
      if (!spring$1 && timeReachedBoundary === void 0) {
        hasUpdatedFrame = true;
        applyFriction(t2);
        checkCatchBoundary(t2);
      }
      if (timeReachedBoundary !== void 0 && t2 >= timeReachedBoundary) {
        return spring$1.next(t2 - timeReachedBoundary);
      } else {
        !hasUpdatedFrame && applyFriction(t2);
        return state;
      }
    }
  };
}
function createMixers(output, ease2, customMixer) {
  const mixers = [];
  const mixerFactory = customMixer || MotionGlobalConfig.mix || mix;
  const numMixers = output.length - 1;
  for (let i = 0; i < numMixers; i++) {
    let mixer = mixerFactory(output[i], output[i + 1]);
    if (ease2) {
      const easingFunction = Array.isArray(ease2) ? ease2[i] || noop : ease2;
      mixer = pipe(easingFunction, mixer);
    }
    mixers.push(mixer);
  }
  return mixers;
}
function interpolate(input, output, { clamp: isClamp = true, ease: ease2, mixer } = {}) {
  const inputLength = input.length;
  invariant(inputLength === output.length);
  if (inputLength === 1)
    return () => output[0];
  if (inputLength === 2 && output[0] === output[1])
    return () => output[1];
  const isZeroDeltaRange = input[0] === input[1];
  if (input[0] > input[inputLength - 1]) {
    input = [...input].reverse();
    output = [...output].reverse();
  }
  const mixers = createMixers(output, ease2, mixer);
  const numMixers = mixers.length;
  const interpolator = (v2) => {
    if (isZeroDeltaRange && v2 < input[0])
      return output[0];
    let i = 0;
    if (numMixers > 1) {
      for (; i < input.length - 2; i++) {
        if (v2 < input[i + 1])
          break;
      }
    }
    const progressInRange = /* @__PURE__ */ progress(input[i], input[i + 1], v2);
    return mixers[i](progressInRange);
  };
  return isClamp ? (v2) => interpolator(clamp(input[0], input[inputLength - 1], v2)) : interpolator;
}
function fillOffset(offset, remaining) {
  const min = offset[offset.length - 1];
  for (let i = 1; i <= remaining; i++) {
    const offsetProgress = /* @__PURE__ */ progress(0, remaining, i);
    offset.push(mixNumber$1(min, 1, offsetProgress));
  }
}
function defaultOffset(arr) {
  const offset = [0];
  fillOffset(offset, arr.length - 1);
  return offset;
}
function convertOffsetToTimes(offset, duration) {
  return offset.map((o) => o * duration);
}
function defaultEasing(values, easing) {
  return values.map(() => easing || easeInOut).splice(0, values.length - 1);
}
function keyframes({ duration = 300, keyframes: keyframeValues, times, ease: ease2 = "easeInOut" }) {
  const easingFunctions = /* @__PURE__ */ isEasingArray(ease2) ? ease2.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease2);
  const state = {
    done: false,
    value: keyframeValues[0]
  };
  const absoluteTimes = convertOffsetToTimes(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    times && times.length === keyframeValues.length ? times : defaultOffset(keyframeValues),
    duration
  );
  const mapTimeToKeyframe = interpolate(absoluteTimes, keyframeValues, {
    ease: Array.isArray(easingFunctions) ? easingFunctions : defaultEasing(keyframeValues, easingFunctions)
  });
  return {
    calculatedDuration: duration,
    next: (t2) => {
      state.value = mapTimeToKeyframe(t2);
      state.done = t2 >= duration;
      return state;
    }
  };
}
const isNotNull = (value) => value !== null;
function getFinalKeyframe(keyframes2, { repeat, repeatType = "loop" }, finalKeyframe, speed = 1) {
  const resolvedKeyframes = keyframes2.filter(isNotNull);
  const useFirstKeyframe = speed < 0 || repeat && repeatType !== "loop" && repeat % 2 === 1;
  const index = useFirstKeyframe ? 0 : resolvedKeyframes.length - 1;
  return !index || finalKeyframe === void 0 ? resolvedKeyframes[index] : finalKeyframe;
}
const transitionTypeMap = {
  decay: inertia,
  inertia,
  tween: keyframes,
  keyframes,
  spring
};
function replaceTransitionType(transition) {
  if (typeof transition.type === "string") {
    transition.type = transitionTypeMap[transition.type];
  }
}
class WithPromise {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  /**
   * Allows the animation to be awaited.
   *
   * @deprecated Use `finished` instead.
   */
  then(onResolve, onReject) {
    return this.finished.then(onResolve, onReject);
  }
}
const percentToProgress = (percent2) => percent2 / 100;
class JSAnimation extends WithPromise {
  constructor(options) {
    super();
    this.state = "idle";
    this.startTime = null;
    this.isStopped = false;
    this.currentTime = 0;
    this.holdTime = null;
    this.playbackSpeed = 1;
    this.delayState = {
      done: false,
      value: void 0
    };
    this.stop = () => {
      const { motionValue: motionValue2 } = this.options;
      if (motionValue2 && motionValue2.updatedAt !== time.now()) {
        this.tick(time.now());
      }
      this.isStopped = true;
      if (this.state === "idle")
        return;
      this.teardown();
      this.options.onStop?.();
    };
    this.options = options;
    this.initAnimation();
    this.play();
    if (options.autoplay === false)
      this.pause();
  }
  initAnimation() {
    const { options } = this;
    replaceTransitionType(options);
    const { type = keyframes, repeat = 0, repeatDelay = 0, repeatType, velocity = 0 } = options;
    let { keyframes: keyframes$1 } = options;
    const generatorFactory = type || keyframes;
    if (generatorFactory !== keyframes && typeof keyframes$1[0] !== "number") {
      this.mixKeyframes = pipe(percentToProgress, mix(keyframes$1[0], keyframes$1[1]));
      keyframes$1 = [0, 100];
    }
    const generator = generatorFactory({ ...options, keyframes: keyframes$1 });
    if (repeatType === "mirror") {
      this.mirroredGenerator = generatorFactory({
        ...options,
        keyframes: [...keyframes$1].reverse(),
        velocity: -velocity
      });
    }
    if (generator.calculatedDuration === null) {
      generator.calculatedDuration = calcGeneratorDuration(generator);
    }
    const { calculatedDuration } = generator;
    this.calculatedDuration = calculatedDuration;
    this.resolvedDuration = calculatedDuration + repeatDelay;
    this.totalDuration = this.resolvedDuration * (repeat + 1) - repeatDelay;
    this.generator = generator;
  }
  updateTime(timestamp) {
    const animationTime = Math.round(timestamp - this.startTime) * this.playbackSpeed;
    if (this.holdTime !== null) {
      this.currentTime = this.holdTime;
    } else {
      this.currentTime = animationTime;
    }
  }
  tick(timestamp, sample = false) {
    const { generator, totalDuration, mixKeyframes, mirroredGenerator, resolvedDuration, calculatedDuration } = this;
    if (this.startTime === null)
      return generator.next(0);
    const { delay: delay2 = 0, keyframes: keyframes2, repeat, repeatType, repeatDelay, type, onUpdate, finalKeyframe } = this.options;
    if (this.speed > 0) {
      this.startTime = Math.min(this.startTime, timestamp);
    } else if (this.speed < 0) {
      this.startTime = Math.min(timestamp - totalDuration / this.speed, this.startTime);
    }
    if (sample) {
      this.currentTime = timestamp;
    } else {
      this.updateTime(timestamp);
    }
    const timeWithoutDelay = this.currentTime - delay2 * (this.playbackSpeed >= 0 ? 1 : -1);
    const isInDelayPhase = this.playbackSpeed >= 0 ? timeWithoutDelay < 0 : timeWithoutDelay > totalDuration;
    this.currentTime = Math.max(timeWithoutDelay, 0);
    if (this.state === "finished" && this.holdTime === null) {
      this.currentTime = totalDuration;
    }
    let elapsed = this.currentTime;
    let frameGenerator = generator;
    if (repeat) {
      const progress2 = Math.min(this.currentTime, totalDuration) / resolvedDuration;
      let currentIteration = Math.floor(progress2);
      let iterationProgress = progress2 % 1;
      if (!iterationProgress && progress2 >= 1) {
        iterationProgress = 1;
      }
      iterationProgress === 1 && currentIteration--;
      currentIteration = Math.min(currentIteration, repeat + 1);
      const isOddIteration = Boolean(currentIteration % 2);
      if (isOddIteration) {
        if (repeatType === "reverse") {
          iterationProgress = 1 - iterationProgress;
          if (repeatDelay) {
            iterationProgress -= repeatDelay / resolvedDuration;
          }
        } else if (repeatType === "mirror") {
          frameGenerator = mirroredGenerator;
        }
      }
      elapsed = clamp(0, 1, iterationProgress) * resolvedDuration;
    }
    let state;
    if (isInDelayPhase) {
      this.delayState.value = keyframes2[0];
      state = this.delayState;
    } else {
      state = frameGenerator.next(elapsed);
    }
    if (mixKeyframes && !isInDelayPhase) {
      state.value = mixKeyframes(state.value);
    }
    let { done } = state;
    if (!isInDelayPhase && calculatedDuration !== null) {
      done = this.playbackSpeed >= 0 ? this.currentTime >= totalDuration : this.currentTime <= 0;
    }
    const isAnimationFinished = this.holdTime === null && (this.state === "finished" || this.state === "running" && done);
    if (isAnimationFinished && type !== inertia) {
      state.value = getFinalKeyframe(keyframes2, this.options, finalKeyframe, this.speed);
    }
    if (onUpdate) {
      onUpdate(state.value);
    }
    if (isAnimationFinished) {
      this.finish();
    }
    return state;
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(resolve, reject) {
    return this.finished.then(resolve, reject);
  }
  get duration() {
    return /* @__PURE__ */ millisecondsToSeconds(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: delay2 = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ millisecondsToSeconds(delay2);
  }
  get time() {
    return /* @__PURE__ */ millisecondsToSeconds(this.currentTime);
  }
  set time(newTime) {
    newTime = /* @__PURE__ */ secondsToMilliseconds(newTime);
    this.currentTime = newTime;
    if (this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0) {
      this.holdTime = newTime;
    } else if (this.driver) {
      this.startTime = this.driver.now() - newTime / this.playbackSpeed;
    }
    if (this.driver) {
      this.driver.start(false);
    } else {
      this.startTime = 0;
      this.state = "paused";
      this.holdTime = newTime;
      this.tick(newTime);
    }
  }
  /**
   * Returns the generator's velocity at the current time in units/second.
   * Uses the analytical derivative when available (springs), avoiding
   * the MotionValue's frame-dependent velocity estimation.
   */
  getGeneratorVelocity() {
    const t2 = this.currentTime;
    if (t2 <= 0)
      return this.options.velocity || 0;
    if (this.generator.velocity) {
      return this.generator.velocity(t2);
    }
    const current = this.generator.next(t2).value;
    return getGeneratorVelocity((s) => this.generator.next(s).value, t2, current);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(newSpeed) {
    const hasChanged = this.playbackSpeed !== newSpeed;
    if (hasChanged && this.driver) {
      this.updateTime(time.now());
    }
    this.playbackSpeed = newSpeed;
    if (hasChanged && this.driver) {
      this.time = /* @__PURE__ */ millisecondsToSeconds(this.currentTime);
    }
  }
  play() {
    if (this.isStopped)
      return;
    const { driver = frameloopDriver, startTime } = this.options;
    if (!this.driver) {
      this.driver = driver((timestamp) => this.tick(timestamp));
    }
    this.options.onPlay?.();
    const now2 = this.driver.now();
    if (this.state === "finished") {
      this.updateFinished();
      this.startTime = now2;
    } else if (this.holdTime !== null) {
      this.startTime = now2 - this.holdTime;
    } else if (!this.startTime) {
      this.startTime = startTime ?? now2;
    }
    if (this.state === "finished" && this.speed < 0) {
      this.startTime += this.calculatedDuration;
    }
    this.holdTime = null;
    this.state = "running";
    this.driver.start();
  }
  pause() {
    this.state = "paused";
    this.updateTime(time.now());
    this.holdTime = this.currentTime;
  }
  complete() {
    if (this.state !== "running") {
      this.play();
    }
    this.state = "finished";
    this.holdTime = null;
  }
  finish() {
    this.notifyFinished();
    this.teardown();
    this.state = "finished";
    this.options.onComplete?.();
  }
  cancel() {
    this.holdTime = null;
    this.startTime = 0;
    this.tick(0);
    this.teardown();
    this.options.onCancel?.();
  }
  teardown() {
    this.state = "idle";
    this.stopDriver();
    this.startTime = this.holdTime = null;
  }
  stopDriver() {
    if (!this.driver)
      return;
    this.driver.stop();
    this.driver = void 0;
  }
  sample(sampleTime) {
    this.startTime = 0;
    return this.tick(sampleTime, true);
  }
  attachTimeline(timeline) {
    if (this.options.allowFlatten) {
      this.options.type = "keyframes";
      this.options.ease = "linear";
      this.initAnimation();
    }
    this.driver?.stop();
    return timeline.observe(this);
  }
}
function fillWildcards(keyframes2) {
  for (let i = 1; i < keyframes2.length; i++) {
    keyframes2[i] ?? (keyframes2[i] = keyframes2[i - 1]);
  }
}
const radToDeg = (rad) => rad * 180 / Math.PI;
const rotate = (v2) => {
  const angle = radToDeg(Math.atan2(v2[1], v2[0]));
  return rebaseAngle(angle);
};
const matrix2dParsers = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (v2) => (Math.abs(v2[0]) + Math.abs(v2[3])) / 2,
  rotate,
  rotateZ: rotate,
  skewX: (v2) => radToDeg(Math.atan(v2[1])),
  skewY: (v2) => radToDeg(Math.atan(v2[2])),
  skew: (v2) => (Math.abs(v2[1]) + Math.abs(v2[2])) / 2
};
const rebaseAngle = (angle) => {
  angle = angle % 360;
  if (angle < 0)
    angle += 360;
  return angle;
};
const rotateZ = rotate;
const scaleX = (v2) => Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
const scaleY = (v2) => Math.sqrt(v2[4] * v2[4] + v2[5] * v2[5]);
const matrix3dParsers = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX,
  scaleY,
  scale: (v2) => (scaleX(v2) + scaleY(v2)) / 2,
  rotateX: (v2) => rebaseAngle(radToDeg(Math.atan2(v2[6], v2[5]))),
  rotateY: (v2) => rebaseAngle(radToDeg(Math.atan2(-v2[2], v2[0]))),
  rotateZ,
  rotate: rotateZ,
  skewX: (v2) => radToDeg(Math.atan(v2[4])),
  skewY: (v2) => radToDeg(Math.atan(v2[1])),
  skew: (v2) => (Math.abs(v2[1]) + Math.abs(v2[4])) / 2
};
function defaultTransformValue(name) {
  return name.includes("scale") ? 1 : 0;
}
function parseValueFromTransform(transform2, name) {
  if (!transform2 || transform2 === "none") {
    return defaultTransformValue(name);
  }
  const matrix3dMatch = transform2.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let parsers;
  let match;
  if (matrix3dMatch) {
    parsers = matrix3dParsers;
    match = matrix3dMatch;
  } else {
    const matrix2dMatch = transform2.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    parsers = matrix2dParsers;
    match = matrix2dMatch;
  }
  if (!match) {
    return defaultTransformValue(name);
  }
  const valueParser = parsers[name];
  const values = match[1].split(",").map(convertTransformToNumber);
  return typeof valueParser === "function" ? valueParser(values) : values[valueParser];
}
const readTransformValue = (instance, name) => {
  const { transform: transform2 = "none" } = getComputedStyle(instance);
  return parseValueFromTransform(transform2, name);
};
function convertTransformToNumber(value) {
  return parseFloat(value.trim());
}
const transformPropOrder = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
];
const transformProps = /* @__PURE__ */ (() => /* @__PURE__ */ new Set([...transformPropOrder, "pathRotation"]))();
const isNumOrPxType = (v2) => v2 === number || v2 === px;
const transformKeys = /* @__PURE__ */ new Set(["x", "y", "z"]);
const nonTranslationalTransformKeys = transformPropOrder.filter((key) => !transformKeys.has(key));
function removeNonTranslationalTransform(visualElement) {
  const removedTransforms = [];
  nonTranslationalTransformKeys.forEach((key) => {
    const value = visualElement.getValue(key);
    if (value !== void 0) {
      removedTransforms.push([key, value.get()]);
      value.set(key.startsWith("scale") ? 1 : 0);
    }
  });
  return removedTransforms;
}
const positionalValues = {
  // Dimensions
  width: ({ x: x2 }, { paddingLeft = "0", paddingRight = "0", boxSizing }) => {
    const width = x2.max - x2.min;
    return boxSizing === "border-box" ? width : width - parseFloat(paddingLeft) - parseFloat(paddingRight);
  },
  height: ({ y: y2 }, { paddingTop = "0", paddingBottom = "0", boxSizing }) => {
    const height = y2.max - y2.min;
    return boxSizing === "border-box" ? height : height - parseFloat(paddingTop) - parseFloat(paddingBottom);
  },
  top: (_bbox, { top }) => parseFloat(top),
  left: (_bbox, { left }) => parseFloat(left),
  bottom: ({ y: y2 }, { top }) => parseFloat(top) + (y2.max - y2.min),
  right: ({ x: x2 }, { left }) => parseFloat(left) + (x2.max - x2.min),
  // Transform
  x: (_bbox, { transform: transform2 }) => parseValueFromTransform(transform2, "x"),
  y: (_bbox, { transform: transform2 }) => parseValueFromTransform(transform2, "y")
};
positionalValues.translateX = positionalValues.x;
positionalValues.translateY = positionalValues.y;
const toResolve = /* @__PURE__ */ new Set();
let isScheduled = false;
let anyNeedsMeasurement = false;
let isForced = false;
function measureAllKeyframes() {
  if (anyNeedsMeasurement) {
    const resolversToMeasure = Array.from(toResolve).filter((resolver) => resolver.needsMeasurement);
    const elementsToMeasure = new Set(resolversToMeasure.map((resolver) => resolver.element));
    const transformsToRestore = /* @__PURE__ */ new Map();
    elementsToMeasure.forEach((element) => {
      const removedTransforms = removeNonTranslationalTransform(element);
      if (!removedTransforms.length)
        return;
      transformsToRestore.set(element, removedTransforms);
      element.render();
    });
    resolversToMeasure.forEach((resolver) => resolver.measureInitialState());
    elementsToMeasure.forEach((element) => {
      element.render();
      const restore = transformsToRestore.get(element);
      if (restore) {
        restore.forEach(([key, value]) => {
          element.getValue(key)?.set(value);
        });
      }
    });
    resolversToMeasure.forEach((resolver) => resolver.measureEndState());
    resolversToMeasure.forEach((resolver) => {
      if (resolver.suspendedScrollY !== void 0) {
        window.scrollTo(0, resolver.suspendedScrollY);
      }
    });
  }
  anyNeedsMeasurement = false;
  isScheduled = false;
  toResolve.forEach((resolver) => resolver.complete(isForced));
  toResolve.clear();
}
function readAllKeyframes() {
  toResolve.forEach((resolver) => {
    resolver.readKeyframes();
    if (resolver.needsMeasurement) {
      anyNeedsMeasurement = true;
    }
  });
}
function flushKeyframeResolvers() {
  isForced = true;
  readAllKeyframes();
  measureAllKeyframes();
  isForced = false;
}
class KeyframeResolver {
  constructor(unresolvedKeyframes, onComplete, name, motionValue2, element, isAsync = false) {
    this.state = "pending";
    this.isAsync = false;
    this.needsMeasurement = false;
    this.unresolvedKeyframes = [...unresolvedKeyframes];
    this.onComplete = onComplete;
    this.name = name;
    this.motionValue = motionValue2;
    this.element = element;
    this.isAsync = isAsync;
  }
  scheduleResolve() {
    this.state = "scheduled";
    if (this.isAsync) {
      toResolve.add(this);
      if (!isScheduled) {
        isScheduled = true;
        frame.read(readAllKeyframes);
        frame.resolveKeyframes(measureAllKeyframes);
      }
    } else {
      this.readKeyframes();
      this.complete();
    }
  }
  readKeyframes() {
    const { unresolvedKeyframes, name, element, motionValue: motionValue2 } = this;
    if (unresolvedKeyframes[0] === null) {
      const currentValue = motionValue2?.get();
      const finalKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
      if (currentValue !== void 0) {
        unresolvedKeyframes[0] = currentValue;
      } else if (element && name) {
        const valueAsRead = element.readValue(name, finalKeyframe);
        if (valueAsRead !== void 0 && valueAsRead !== null) {
          unresolvedKeyframes[0] = valueAsRead;
        }
      }
      if (unresolvedKeyframes[0] === void 0) {
        unresolvedKeyframes[0] = finalKeyframe;
      }
      if (motionValue2 && currentValue === void 0) {
        motionValue2.set(unresolvedKeyframes[0]);
      }
    }
    fillWildcards(unresolvedKeyframes);
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete(isForcedComplete = false) {
    this.state = "complete";
    this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, isForcedComplete);
    toResolve.delete(this);
  }
  cancel() {
    if (this.state === "scheduled") {
      toResolve.delete(this);
      this.state = "pending";
    }
  }
  resume() {
    if (this.state === "pending")
      this.scheduleResolve();
  }
}
const isCSSVar = (name) => name.startsWith("--");
function setStyle(element, name, value) {
  isCSSVar(name) ? element.style.setProperty(name, value) : element.style[name] = value;
}
const supportsFlags = {};
function memoSupports(callback, supportsFlag) {
  const memoized = /* @__PURE__ */ memo(callback);
  return () => supportsFlags[supportsFlag] ?? memoized();
}
const supportsScrollTimeline = /* @__PURE__ */ memoSupports(() => window.ScrollTimeline !== void 0, "scrollTimeline");
const supportsLinearEasing = /* @__PURE__ */ memoSupports(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch (e) {
    return false;
  }
  return true;
}, "linearEasing");
const cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
const supportedWaapiEasing = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ cubicBezierAsString([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ cubicBezierAsString([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ cubicBezierAsString([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ cubicBezierAsString([0.33, 1.53, 0.69, 0.99])
};
function mapEasingToNativeEasing(easing, duration) {
  if (!easing) {
    return void 0;
  } else if (typeof easing === "function") {
    return supportsLinearEasing() ? generateLinearEasing(easing, duration) : "ease-out";
  } else if (/* @__PURE__ */ isBezierDefinition(easing)) {
    return cubicBezierAsString(easing);
  } else if (Array.isArray(easing)) {
    return easing.map((segmentEasing) => mapEasingToNativeEasing(segmentEasing, duration) || supportedWaapiEasing.easeOut);
  } else {
    return supportedWaapiEasing[easing];
  }
}
function startWaapiAnimation(element, valueName, keyframes2, { delay: delay2 = 0, duration = 300, repeat = 0, repeatType = "loop", ease: ease2 = "easeOut", times } = {}, pseudoElement = void 0) {
  const keyframeOptions = {
    [valueName]: keyframes2
  };
  if (times)
    keyframeOptions.offset = times;
  const easing = mapEasingToNativeEasing(ease2, duration);
  if (Array.isArray(easing))
    keyframeOptions.easing = easing;
  const options = {
    delay: delay2,
    duration,
    easing: !Array.isArray(easing) ? easing : "linear",
    fill: "both",
    iterations: repeat + 1,
    direction: repeatType === "reverse" ? "alternate" : "normal"
  };
  if (pseudoElement)
    options.pseudoElement = pseudoElement;
  const animation = element.animate(keyframeOptions, options);
  return animation;
}
function isGenerator(type) {
  return typeof type === "function" && "applyToOptions" in type;
}
function applyGeneratorOptions({ type, ...options }) {
  if (isGenerator(type) && supportsLinearEasing()) {
    return type.applyToOptions(options);
  } else {
    options.duration ?? (options.duration = 300);
    options.ease ?? (options.ease = "easeOut");
  }
  return options;
}
class NativeAnimation extends WithPromise {
  constructor(options) {
    super();
    this.finishedTime = null;
    this.isStopped = false;
    this.manualStartTime = null;
    if (!options)
      return;
    const { element, name, keyframes: keyframes2, pseudoElement, allowFlatten = false, finalKeyframe, onComplete } = options;
    this.isPseudoElement = Boolean(pseudoElement);
    this.allowFlatten = allowFlatten;
    this.options = options;
    invariant(typeof options.type !== "string");
    const transition = applyGeneratorOptions(options);
    this.animation = startWaapiAnimation(element, name, keyframes2, transition, pseudoElement);
    if (transition.autoplay === false) {
      this.animation.pause();
    }
    this.animation.onfinish = () => {
      this.finishedTime = this.time;
      if (!pseudoElement) {
        const keyframe = getFinalKeyframe(keyframes2, this.options, finalKeyframe, this.speed);
        if (this.updateMotionValue) {
          this.updateMotionValue(keyframe);
        }
        setStyle(element, name, keyframe);
        this.animation.cancel();
      }
      onComplete?.();
      this.notifyFinished();
    };
  }
  play() {
    if (this.isStopped)
      return;
    this.manualStartTime = null;
    this.animation.play();
    if (this.state === "finished") {
      this.updateFinished();
    }
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.finish?.();
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch (e) {
    }
  }
  stop() {
    if (this.isStopped)
      return;
    this.isStopped = true;
    const { state } = this;
    if (state === "idle" || state === "finished") {
      return;
    }
    if (this.updateMotionValue) {
      this.updateMotionValue();
    } else {
      this.commitStyles();
    }
    if (!this.isPseudoElement)
      this.cancel();
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * In this method, we commit styles back to the DOM before cancelling
   * the animation.
   *
   * This is designed to be overridden by NativeAnimationExtended, which
   * will create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to also correctly calculate velocity for any subsequent animation
   * while deferring the commit until the next animation frame.
   */
  commitStyles() {
    const element = this.options?.element;
    if (!this.isPseudoElement && element?.isConnected) {
      this.animation.commitStyles?.();
    }
  }
  get duration() {
    const duration = this.animation.effect?.getComputedTiming?.().duration || 0;
    return /* @__PURE__ */ millisecondsToSeconds(Number(duration));
  }
  get iterationDuration() {
    const { delay: delay2 = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ millisecondsToSeconds(delay2);
  }
  get time() {
    return /* @__PURE__ */ millisecondsToSeconds(Number(this.animation.currentTime) || 0);
  }
  set time(newTime) {
    const wasFinished = this.finishedTime !== null;
    this.manualStartTime = null;
    this.finishedTime = null;
    this.animation.currentTime = /* @__PURE__ */ secondsToMilliseconds(newTime);
    if (wasFinished) {
      this.animation.pause();
    }
  }
  /**
   * The playback speed of the animation.
   * 1 = normal speed, 2 = double speed, 0.5 = half speed.
   */
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(newSpeed) {
    if (newSpeed < 0)
      this.finishedTime = null;
    this.animation.playbackRate = newSpeed;
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return this.manualStartTime ?? Number(this.animation.startTime);
  }
  set startTime(newStartTime) {
    this.manualStartTime = this.animation.startTime = newStartTime;
  }
  /**
   * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
   */
  attachTimeline({ timeline, rangeStart, rangeEnd, observe }) {
    if (this.allowFlatten) {
      this.animation.effect?.updateTiming({ easing: "linear" });
    }
    this.animation.onfinish = null;
    if (timeline && supportsScrollTimeline()) {
      this.animation.timeline = timeline;
      if (rangeStart)
        this.animation.rangeStart = rangeStart;
      if (rangeEnd)
        this.animation.rangeEnd = rangeEnd;
      return noop;
    } else {
      return observe(this);
    }
  }
}
const unsupportedEasingFunctions = {
  anticipate,
  backInOut,
  circInOut
};
function isUnsupportedEase(key) {
  return key in unsupportedEasingFunctions;
}
function replaceStringEasing(transition) {
  if (typeof transition.ease === "string" && isUnsupportedEase(transition.ease)) {
    transition.ease = unsupportedEasingFunctions[transition.ease];
  }
}
const sampleDelta = 10;
class NativeAnimationExtended extends NativeAnimation {
  constructor(options) {
    replaceStringEasing(options);
    replaceTransitionType(options);
    super(options);
    if (options.startTime !== void 0 && options.autoplay !== false) {
      this.startTime = options.startTime;
    }
    this.options = options;
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * Rather than read committed styles back out of the DOM, we can
   * create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to calculate velocity for any subsequent animation.
   */
  updateMotionValue(value) {
    const { motionValue: motionValue2, onUpdate, onComplete, element, ...options } = this.options;
    if (!motionValue2)
      return;
    if (value !== void 0) {
      motionValue2.set(value);
      return;
    }
    const sampleAnimation = new JSAnimation({
      ...options,
      autoplay: false
    });
    const sampleTime = Math.max(sampleDelta, time.now() - this.startTime);
    const delta = clamp(0, sampleDelta, sampleTime - sampleDelta);
    const current = sampleAnimation.sample(sampleTime).value;
    const { name } = this.options;
    if (element && name)
      setStyle(element, name, current);
    motionValue2.setWithVelocity(sampleAnimation.sample(Math.max(0, sampleTime - delta)).value, current, delta);
    sampleAnimation.stop();
  }
}
const isAnimatable = (value, name) => {
  if (name === "zIndex")
    return false;
  if (typeof value === "number" || Array.isArray(value))
    return true;
  if (typeof value === "string" && // It's animatable if we have a string
  (complex.test(value) || value === "0") && // And it contains numbers and/or colors
  !value.startsWith("url(")) {
    return true;
  }
  return false;
};
function hasKeyframesChanged(keyframes2) {
  const current = keyframes2[0];
  if (keyframes2.length === 1)
    return true;
  for (let i = 0; i < keyframes2.length; i++) {
    if (keyframes2[i] !== current)
      return true;
  }
}
function canAnimate(keyframes2, name, type, velocity) {
  const originKeyframe = keyframes2[0];
  if (originKeyframe === null) {
    return false;
  }
  if (name === "display" || name === "visibility")
    return true;
  const targetKeyframe = keyframes2[keyframes2.length - 1];
  const isOriginAnimatable = isAnimatable(originKeyframe, name);
  const isTargetAnimatable = isAnimatable(targetKeyframe, name);
  if (!isOriginAnimatable || !isTargetAnimatable) {
    return false;
  }
  return hasKeyframesChanged(keyframes2) || (type === "spring" || isGenerator(type)) && velocity;
}
function makeAnimationInstant(options) {
  options.duration = 0;
  options.type = "keyframes";
}
const acceleratedValues = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Can be accelerated but currently disabled until https://issues.chromium.org/issues/41491098 is resolved
  // or until we implement support for linear() easing.
  // "background-color"
]);
const browserColorFunctions = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function hasBrowserOnlyColors(keyframes2) {
  for (let i = 0; i < keyframes2.length; i++) {
    if (typeof keyframes2[i] === "string" && browserColorFunctions.test(keyframes2[i])) {
      return true;
    }
  }
  return false;
}
const colorProperties = /* @__PURE__ */ new Set([
  "color",
  "backgroundColor",
  "outlineColor",
  "fill",
  "stroke",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor"
]);
const supportsWaapi = /* @__PURE__ */ memo(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function supportsBrowserAnimation(options) {
  const { motionValue: motionValue2, name, repeatDelay, repeatType, damping, type, keyframes: keyframes2 } = options;
  const subject = motionValue2?.owner?.current;
  if (!(subject instanceof HTMLElement)) {
    return false;
  }
  const { onUpdate, transformTemplate } = motionValue2.owner.getProps();
  return supportsWaapi() && name && /**
   * Force WAAPI for color properties with browser-only color formats
   * (oklch, oklab, lab, lch, etc.) that the JS animation path can't parse.
   */
  (acceleratedValues.has(name) || colorProperties.has(name) && hasBrowserOnlyColors(keyframes2)) && (name !== "transform" || !transformTemplate) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !onUpdate && !repeatDelay && repeatType !== "mirror" && damping !== 0 && type !== "inertia";
}
const MAX_RESOLVE_DELAY = 40;
class AsyncMotionValueAnimation extends WithPromise {
  constructor({ autoplay = true, delay: delay2 = 0, type = "keyframes", repeat = 0, repeatDelay = 0, repeatType = "loop", keyframes: keyframes2, name, motionValue: motionValue2, element, ...options }) {
    super();
    this.stop = () => {
      if (this._animation) {
        this._animation.stop();
        this.stopTimeline?.();
      }
      this.keyframeResolver?.cancel();
    };
    this.createdAt = time.now();
    const optionsWithDefaults = {
      autoplay,
      delay: delay2,
      type,
      repeat,
      repeatDelay,
      repeatType,
      name,
      motionValue: motionValue2,
      element,
      ...options
    };
    const KeyframeResolver$1 = element?.KeyframeResolver || KeyframeResolver;
    this.keyframeResolver = new KeyframeResolver$1(keyframes2, (resolvedKeyframes, finalKeyframe, forced) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe, optionsWithDefaults, !forced), name, motionValue2, element);
    this.keyframeResolver?.scheduleResolve();
  }
  onKeyframesResolved(keyframes2, finalKeyframe, options, sync) {
    this.keyframeResolver = void 0;
    const { name, type, velocity, delay: delay2, isHandoff, onUpdate } = options;
    this.resolvedAt = time.now();
    let canAnimateValue = true;
    if (!canAnimate(keyframes2, name, type, velocity)) {
      canAnimateValue = false;
      if (MotionGlobalConfig.instantAnimations || !delay2) {
        onUpdate?.(getFinalKeyframe(keyframes2, options, finalKeyframe));
      }
      keyframes2[0] = keyframes2[keyframes2.length - 1];
      makeAnimationInstant(options);
      options.repeat = 0;
    }
    const startTime = sync ? !this.resolvedAt ? this.createdAt : this.resolvedAt - this.createdAt > MAX_RESOLVE_DELAY ? this.resolvedAt : this.createdAt : void 0;
    const resolvedOptions = {
      startTime,
      finalKeyframe,
      ...options,
      keyframes: keyframes2
    };
    const useWaapi = canAnimateValue && !isHandoff && supportsBrowserAnimation(resolvedOptions);
    const element = resolvedOptions.motionValue?.owner?.current;
    let animation;
    if (useWaapi) {
      try {
        animation = new NativeAnimationExtended({
          ...resolvedOptions,
          element
        });
      } catch {
        animation = new JSAnimation(resolvedOptions);
      }
    } else {
      animation = new JSAnimation(resolvedOptions);
    }
    animation.finished.then(() => {
      this.notifyFinished();
    }).catch(noop);
    if (this.pendingTimeline) {
      this.stopTimeline = animation.attachTimeline(this.pendingTimeline);
      this.pendingTimeline = void 0;
    }
    this._animation = animation;
  }
  get finished() {
    if (!this._animation) {
      return this._finished;
    } else {
      return this.animation.finished;
    }
  }
  then(onResolve, _onReject) {
    return this.finished.finally(onResolve).then(() => {
    });
  }
  get animation() {
    if (!this._animation) {
      this.keyframeResolver?.resume();
      flushKeyframeResolvers();
    }
    return this._animation;
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(newTime) {
    this.animation.time = newTime;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(newSpeed) {
    this.animation.speed = newSpeed;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(timeline) {
    if (this._animation) {
      this.stopTimeline = this.animation.attachTimeline(timeline);
    } else {
      this.pendingTimeline = timeline;
    }
    return () => this.stop();
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    if (this._animation) {
      this.animation.cancel();
    }
    this.keyframeResolver?.cancel();
  }
}
function calcChildStagger(children, child, delayChildren, staggerChildren = 0, staggerDirection = 1) {
  const index = Array.from(children).sort((a, b) => a.sortNodePosition(b)).indexOf(child);
  const numChildren = children.size;
  const maxStaggerDuration = (numChildren - 1) * staggerChildren;
  const delayIsFunction = typeof delayChildren === "function";
  return delayIsFunction ? delayChildren(index, numChildren) : staggerDirection === 1 ? index * staggerChildren : maxStaggerDuration - index * staggerChildren;
}
const MAX_VELOCITY_DELTA = 30;
const isFloat = (value) => {
  return !isNaN(parseFloat(value));
};
const collectMotionValues = {
  current: void 0
};
class MotionValue {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(init, options = {}) {
    this.canTrackVelocity = null;
    this.events = {};
    this.updateAndNotify = (v2) => {
      const currentTime = time.now();
      if (this.updatedAt !== currentTime) {
        this.setPrevFrameValue();
      }
      this.prev = this.current;
      this.setCurrent(v2);
      if (this.current !== this.prev) {
        this.events.change?.notify(this.current);
        if (this.dependents) {
          for (const dependent of this.dependents) {
            dependent.dirty();
          }
        }
      }
    };
    this.hasAnimated = false;
    this.setCurrent(init);
    this.owner = options.owner;
  }
  setCurrent(current) {
    this.current = current;
    this.updatedAt = time.now();
    if (this.canTrackVelocity === null && current !== void 0) {
      this.canTrackVelocity = isFloat(this.current);
    }
  }
  setPrevFrameValue(prevFrameValue = this.current) {
    this.prevFrameValue = prevFrameValue;
    this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(subscription) {
    return this.on("change", subscription);
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = new SubscriptionManager();
    }
    const unsubscribe = this.events[eventName].add(callback);
    if (eventName === "change") {
      return () => {
        unsubscribe();
        frame.read(() => {
          if (!this.events.change.getSize()) {
            this.stop();
          }
        });
      };
    }
    return unsubscribe;
  }
  clearListeners() {
    for (const eventManagers in this.events) {
      this.events[eventManagers].clear();
    }
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(passiveEffect, stopPassiveEffect) {
    this.passiveEffect = passiveEffect;
    this.stopPassiveEffect = stopPassiveEffect;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(v2) {
    if (!this.passiveEffect) {
      this.updateAndNotify(v2);
    } else {
      this.passiveEffect(v2, this.updateAndNotify);
    }
  }
  setWithVelocity(prev, current, delta) {
    this.set(current);
    this.prev = void 0;
    this.prevFrameValue = prev;
    this.prevUpdatedAt = this.updatedAt - delta;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(v2, endAnimation = true) {
    this.updateAndNotify(v2);
    this.prev = v2;
    this.prevUpdatedAt = this.prevFrameValue = void 0;
    endAnimation && this.stop();
    if (this.stopPassiveEffect)
      this.stopPassiveEffect();
  }
  dirty() {
    this.events.change?.notify(this.current);
  }
  addDependent(dependent) {
    if (!this.dependents) {
      this.dependents = /* @__PURE__ */ new Set();
    }
    this.dependents.add(dependent);
  }
  removeDependent(dependent) {
    if (this.dependents) {
      this.dependents.delete(dependent);
    }
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    if (collectMotionValues.current) {
      collectMotionValues.current.push(this);
    }
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const currentTime = time.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || currentTime - this.updatedAt > MAX_VELOCITY_DELTA) {
      return 0;
    }
    const delta = Math.min(this.updatedAt - this.prevUpdatedAt, MAX_VELOCITY_DELTA);
    return /* @__PURE__ */ velocityPerSecond(parseFloat(this.current) - parseFloat(this.prevFrameValue), delta);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   */
  start(startAnimation) {
    this.stop();
    return new Promise((resolve) => {
      this.hasAnimated = true;
      this.animation = startAnimation(resolve);
      if (this.events.animationStart) {
        this.events.animationStart.notify();
      }
    }).then(() => {
      if (this.events.animationComplete) {
        this.events.animationComplete.notify();
      }
      this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    if (this.animation) {
      this.animation.stop();
      if (this.events.animationCancel) {
        this.events.animationCancel.notify();
      }
    }
    this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    this.dependents?.clear();
    this.events.destroy?.notify();
    this.clearListeners();
    this.stop();
    if (this.stopPassiveEffect) {
      this.stopPassiveEffect();
    }
  }
}
function motionValue(init, options) {
  return new MotionValue(init, options);
}
function resolveTransition(transition, parentTransition) {
  if (transition?.inherit && parentTransition) {
    const { inherit: _, ...rest } = transition;
    return { ...parentTransition, ...rest };
  }
  return transition;
}
function getValueTransition(transition, key) {
  const valueTransition = transition?.[key] ?? transition?.["default"] ?? transition;
  if (valueTransition !== transition) {
    return resolveTransition(valueTransition, transition);
  }
  return valueTransition;
}
const underDampedSpring = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
};
const criticallyDampedSpring = (target) => ({
  type: "spring",
  stiffness: 550,
  damping: target === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
});
const keyframesTransition = {
  type: "keyframes",
  duration: 0.8
};
const ease = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
};
const getDefaultTransition = (valueKey, { keyframes: keyframes2 }) => {
  if (keyframes2.length > 2) {
    return keyframesTransition;
  } else if (transformProps.has(valueKey)) {
    return valueKey.startsWith("scale") ? criticallyDampedSpring(keyframes2[1]) : underDampedSpring;
  }
  return ease;
};
const orchestrationKeys = /* @__PURE__ */ new Set([
  "when",
  "delay",
  "delayChildren",
  "staggerChildren",
  "staggerDirection",
  "repeat",
  "repeatType",
  "repeatDelay",
  "from",
  "elapsed"
]);
function isTransitionDefined(transition) {
  for (const key in transition) {
    if (!orchestrationKeys.has(key))
      return true;
  }
  return false;
}
const animateMotionValue = (name, value, target, transition = {}, element, isHandoff) => (onComplete) => {
  const valueTransition = getValueTransition(transition, name) || {};
  const delay2 = valueTransition.delay || transition.delay || 0;
  let { elapsed = 0 } = transition;
  elapsed = elapsed - /* @__PURE__ */ secondsToMilliseconds(delay2);
  const options = {
    keyframes: Array.isArray(target) ? target : [null, target],
    ease: "easeOut",
    velocity: value.getVelocity(),
    ...valueTransition,
    delay: -elapsed,
    onUpdate: (v2) => {
      value.set(v2);
      valueTransition.onUpdate && valueTransition.onUpdate(v2);
    },
    onComplete: () => {
      onComplete();
      valueTransition.onComplete && valueTransition.onComplete();
    },
    name,
    motionValue: value,
    element: isHandoff ? void 0 : element
  };
  if (!isTransitionDefined(valueTransition)) {
    Object.assign(options, getDefaultTransition(name, options));
  }
  options.duration && (options.duration = /* @__PURE__ */ secondsToMilliseconds(options.duration));
  options.repeatDelay && (options.repeatDelay = /* @__PURE__ */ secondsToMilliseconds(options.repeatDelay));
  if (options.from !== void 0) {
    options.keyframes[0] = options.from;
  }
  let shouldSkip = false;
  if (options.type === false || options.duration === 0 && !options.repeatDelay) {
    makeAnimationInstant(options);
    if (options.delay === 0) {
      shouldSkip = true;
    }
  }
  if (MotionGlobalConfig.instantAnimations || MotionGlobalConfig.skipAnimations || element?.shouldSkipAnimations || valueTransition.skipAnimations) {
    shouldSkip = true;
    makeAnimationInstant(options);
    options.delay = 0;
  }
  options.allowFlatten = !valueTransition.type && !valueTransition.ease;
  if (shouldSkip && !isHandoff && value.get() !== void 0) {
    const finalKeyframe = getFinalKeyframe(options.keyframes, valueTransition);
    if (finalKeyframe !== void 0) {
      frame.update(() => {
        options.onUpdate(finalKeyframe);
        options.onComplete();
      });
      return;
    }
  }
  return valueTransition.isSync ? new JSAnimation(options) : new AsyncMotionValueAnimation(options);
};
const splitCSSVariableRegex = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function parseCSSVariable(current) {
  const match = splitCSSVariableRegex.exec(current);
  if (!match)
    return [,];
  const [, token1, token2, fallback] = match;
  return [`--${token1 ?? token2}`, fallback];
}
function getVariableValue(current, element, depth = 1) {
  const [token, fallback] = parseCSSVariable(current);
  if (!token)
    return;
  const resolved = window.getComputedStyle(element).getPropertyValue(token);
  if (resolved) {
    const trimmed = resolved.trim();
    return isNumericalString(trimmed) ? parseFloat(trimmed) : trimmed;
  }
  return isCSSVariableToken(fallback) ? getVariableValue(fallback, element, depth + 1) : fallback;
}
function getValueState(visualElement) {
  const state = [{}, {}];
  visualElement?.values.forEach((value, key) => {
    state[0][key] = value.get();
    state[1][key] = value.getVelocity();
  });
  return state;
}
function resolveVariantFromProps(props, definition, custom, visualElement) {
  if (typeof definition === "function") {
    const [current, velocity] = getValueState(visualElement);
    definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
  }
  if (typeof definition === "string") {
    definition = props.variants && props.variants[definition];
  }
  if (typeof definition === "function") {
    const [current, velocity] = getValueState(visualElement);
    definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
  }
  return definition;
}
function resolveVariant(visualElement, definition, custom) {
  const props = visualElement.getProps();
  return resolveVariantFromProps(props, definition, custom !== void 0 ? custom : props.custom, visualElement);
}
const positionalKeys = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...transformPropOrder
]);
const isKeyframesTarget = (v2) => {
  return Array.isArray(v2);
};
function setMotionValue(visualElement, key, value) {
  if (visualElement.hasValue(key)) {
    visualElement.getValue(key).set(value);
  } else {
    visualElement.addValue(key, motionValue(value));
  }
}
function resolveFinalValueInKeyframes(v2) {
  return isKeyframesTarget(v2) ? v2[v2.length - 1] || 0 : v2;
}
function setTarget(visualElement, definition) {
  const resolved = resolveVariant(visualElement, definition);
  let { transitionEnd = {}, transition = {}, ...target } = resolved || {};
  target = { ...target, ...transitionEnd };
  for (const key in target) {
    const value = resolveFinalValueInKeyframes(target[key]);
    setMotionValue(visualElement, key, value);
  }
}
const isMotionValue = (value) => Boolean(value && value.getVelocity);
function isWillChangeMotionValue(value) {
  return Boolean(isMotionValue(value) && value.add);
}
function addValueToWillChange(visualElement, key) {
  const willChange = visualElement.getValue("willChange");
  if (isWillChangeMotionValue(willChange)) {
    return willChange.add(key);
  } else if (!willChange && MotionGlobalConfig.WillChange) {
    const newWillChange = new MotionGlobalConfig.WillChange("auto");
    visualElement.addValue("willChange", newWillChange);
    newWillChange.add(key);
  }
}
function camelToDash(str) {
  return str.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
}
const optimizedAppearDataId = "framerAppearId";
const optimizedAppearDataAttribute = "data-" + camelToDash(optimizedAppearDataId);
function getOptimisedAppearId(visualElement) {
  return visualElement.props[optimizedAppearDataAttribute];
}
function shouldBlockAnimation({ protectedKeys, needsAnimating }, key) {
  const shouldBlock = protectedKeys.hasOwnProperty(key) && needsAnimating[key] !== true;
  needsAnimating[key] = false;
  return shouldBlock;
}
function animateTarget(visualElement, targetAndTransition, { delay: delay2 = 0, transitionOverride, type } = {}) {
  let { transition, transitionEnd, ...target } = targetAndTransition;
  const defaultTransition = visualElement.getDefaultTransition();
  transition = transition ? resolveTransition(transition, defaultTransition) : defaultTransition;
  const reduceMotion = transition?.reduceMotion;
  const skipAnimations = transition?.skipAnimations;
  if (transitionOverride)
    transition = transitionOverride;
  const animations2 = [];
  const animationTypeState = type && visualElement.animationState && visualElement.animationState.getState()[type];
  const path = transition?.path;
  if (path) {
    path.animateVisualElement(visualElement, target, transition, delay2, animations2);
  }
  for (const key in target) {
    const value = visualElement.getValue(key, visualElement.latestValues[key] ?? null);
    const valueTarget = target[key];
    if (valueTarget === void 0 || animationTypeState && shouldBlockAnimation(animationTypeState, key)) {
      continue;
    }
    const valueTransition = {
      delay: delay2,
      ...getValueTransition(transition || {}, key)
    };
    if (skipAnimations)
      valueTransition.skipAnimations = true;
    const currentValue = value.get();
    if (currentValue !== void 0 && !value.isAnimating() && !Array.isArray(valueTarget) && valueTarget === currentValue && !valueTransition.velocity) {
      frame.update(() => value.set(valueTarget));
      continue;
    }
    let isHandoff = false;
    if (window.MotionHandoffAnimation) {
      const appearId = getOptimisedAppearId(visualElement);
      if (appearId) {
        const startTime = window.MotionHandoffAnimation(appearId, key, frame);
        if (startTime !== null) {
          valueTransition.startTime = startTime;
          isHandoff = true;
        }
      }
    }
    addValueToWillChange(visualElement, key);
    const shouldReduceMotion = reduceMotion ?? visualElement.shouldReduceMotion;
    value.start(animateMotionValue(key, value, valueTarget, shouldReduceMotion && positionalKeys.has(key) ? { type: false } : valueTransition, visualElement, isHandoff));
    const animation = value.animation;
    if (animation) {
      animations2.push(animation);
    }
  }
  if (transitionEnd) {
    const applyTransitionEnd = () => frame.update(() => {
      transitionEnd && setTarget(visualElement, transitionEnd);
    });
    if (animations2.length) {
      Promise.all(animations2).then(applyTransitionEnd);
    } else {
      applyTransitionEnd();
    }
  }
  return animations2;
}
function animateVariant(visualElement, variant, options = {}) {
  const resolved = resolveVariant(visualElement, variant, options.type === "exit" ? visualElement.presenceContext?.custom : void 0);
  let { transition = visualElement.getDefaultTransition() || {} } = resolved || {};
  if (options.transitionOverride) {
    transition = options.transitionOverride;
  }
  const getAnimation = resolved ? () => Promise.all(animateTarget(visualElement, resolved, options)) : () => Promise.resolve();
  const getChildAnimations = visualElement.variantChildren && visualElement.variantChildren.size ? (forwardDelay = 0) => {
    const { delayChildren = 0, staggerChildren, staggerDirection } = transition;
    return animateChildren(visualElement, variant, forwardDelay, delayChildren, staggerChildren, staggerDirection, options);
  } : () => Promise.resolve();
  const { when } = transition;
  if (when) {
    const [first, last] = when === "beforeChildren" ? [getAnimation, getChildAnimations] : [getChildAnimations, getAnimation];
    return first().then(() => last());
  } else {
    return Promise.all([getAnimation(), getChildAnimations(options.delay)]);
  }
}
function animateChildren(visualElement, variant, delay2 = 0, delayChildren = 0, staggerChildren = 0, staggerDirection = 1, options) {
  const animations2 = [];
  for (const child of visualElement.variantChildren) {
    child.notify("AnimationStart", variant);
    animations2.push(animateVariant(child, variant, {
      ...options,
      delay: delay2 + (typeof delayChildren === "function" ? 0 : delayChildren) + calcChildStagger(visualElement.variantChildren, child, delayChildren, staggerChildren, staggerDirection)
    }).then(() => child.notify("AnimationComplete", variant)));
  }
  return Promise.all(animations2);
}
function animateVisualElement(visualElement, definition, options = {}) {
  visualElement.notify("AnimationStart", definition);
  let animation;
  if (Array.isArray(definition)) {
    const animations2 = definition.map((variant) => animateVariant(visualElement, variant, options));
    animation = Promise.all(animations2);
  } else if (typeof definition === "string") {
    animation = animateVariant(visualElement, definition, options);
  } else {
    const resolvedDefinition = typeof definition === "function" ? resolveVariant(visualElement, definition, options.custom) : definition;
    animation = Promise.all(animateTarget(visualElement, resolvedDefinition, options));
  }
  return animation.then(() => {
    visualElement.notify("AnimationComplete", definition);
  });
}
const auto = {
  test: (v2) => v2 === "auto",
  parse: (v2) => v2
};
const testValueType = (v2) => (type) => type.test(v2);
const dimensionValueTypes = [number, px, percent, degrees, vw, vh, auto];
const findDimensionValueType = (v2) => dimensionValueTypes.find(testValueType(v2));
function isNone(value) {
  if (typeof value === "number") {
    return value === 0;
  } else if (value !== null) {
    return value === "none" || value === "0" || isZeroValueString(value);
  } else {
    return true;
  }
}
const maxDefaults = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function applyDefaultFilter(v2) {
  const [name, value] = v2.slice(0, -1).split("(");
  if (name === "drop-shadow")
    return v2;
  const [number2] = value.match(floatRegex) || [];
  if (!number2)
    return v2;
  const unit = value.replace(number2, "");
  let defaultValue = maxDefaults.has(name) ? 1 : 0;
  if (number2 !== value)
    defaultValue *= 100;
  return name + "(" + defaultValue + unit + ")";
}
const functionRegex = /\b([a-z-]*)\(.*?\)/gu;
const filter = {
  ...complex,
  getAnimatableNone: (v2) => {
    const functions = v2.match(functionRegex);
    return functions ? functions.map(applyDefaultFilter).join(" ") : v2;
  }
};
const mask = {
  ...complex,
  getAnimatableNone: (v2) => {
    const parsed = complex.parse(v2);
    const transformer = complex.createTransformer(v2);
    return transformer(parsed.map((v3) => typeof v3 === "number" ? 0 : typeof v3 === "object" ? { ...v3, alpha: 1 } : v3));
  }
};
const int = {
  ...number,
  transform: Math.round
};
const transformValueTypes = {
  rotate: degrees,
  /**
   * Internal channel for `transition.path` orientToPath. Composed onto
   * `rotate` at the transform-build sites so the user's `rotate` is
   * never read or overwritten. Not part of `transformPropOrder`.
   */
  pathRotation: degrees,
  rotateX: degrees,
  rotateY: degrees,
  rotateZ: degrees,
  scale,
  scaleX: scale,
  scaleY: scale,
  scaleZ: scale,
  skew: degrees,
  skewX: degrees,
  skewY: degrees,
  distance: px,
  translateX: px,
  translateY: px,
  translateZ: px,
  x: px,
  y: px,
  z: px,
  perspective: px,
  transformPerspective: px,
  opacity: alpha,
  originX: progressPercentage,
  originY: progressPercentage,
  originZ: px
};
const numberValueTypes = {
  // Border props
  borderWidth: px,
  borderTopWidth: px,
  borderRightWidth: px,
  borderBottomWidth: px,
  borderLeftWidth: px,
  borderRadius: px,
  borderTopLeftRadius: px,
  borderTopRightRadius: px,
  borderBottomRightRadius: px,
  borderBottomLeftRadius: px,
  // Positioning props
  width: px,
  maxWidth: px,
  height: px,
  maxHeight: px,
  top: px,
  right: px,
  bottom: px,
  left: px,
  inset: px,
  insetBlock: px,
  insetBlockStart: px,
  insetBlockEnd: px,
  insetInline: px,
  insetInlineStart: px,
  insetInlineEnd: px,
  // Spacing props
  padding: px,
  paddingTop: px,
  paddingRight: px,
  paddingBottom: px,
  paddingLeft: px,
  paddingBlock: px,
  paddingBlockStart: px,
  paddingBlockEnd: px,
  paddingInline: px,
  paddingInlineStart: px,
  paddingInlineEnd: px,
  margin: px,
  marginTop: px,
  marginRight: px,
  marginBottom: px,
  marginLeft: px,
  marginBlock: px,
  marginBlockStart: px,
  marginBlockEnd: px,
  marginInline: px,
  marginInlineStart: px,
  marginInlineEnd: px,
  // Typography
  fontSize: px,
  // Misc
  backgroundPositionX: px,
  backgroundPositionY: px,
  ...transformValueTypes,
  zIndex: int,
  // SVG
  fillOpacity: alpha,
  strokeOpacity: alpha,
  numOctaves: int
};
const defaultValueTypes = {
  ...numberValueTypes,
  // Color props
  color,
  backgroundColor: color,
  outlineColor: color,
  fill: color,
  stroke: color,
  // Border props
  borderColor: color,
  borderTopColor: color,
  borderRightColor: color,
  borderBottomColor: color,
  borderLeftColor: color,
  filter,
  WebkitFilter: filter,
  mask,
  WebkitMask: mask
};
const getDefaultValueType = (key) => defaultValueTypes[key];
const customTypes = /* @__PURE__ */ new Set([filter, mask]);
function getAnimatableNone(key, value) {
  let defaultValueType = getDefaultValueType(key);
  if (!customTypes.has(defaultValueType))
    defaultValueType = complex;
  return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : void 0;
}
const invalidTemplates = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name) {
  let i = 0;
  let animatableTemplate = void 0;
  while (i < unresolvedKeyframes.length && !animatableTemplate) {
    const keyframe = unresolvedKeyframes[i];
    if (typeof keyframe === "string" && !invalidTemplates.has(keyframe) && analyseComplexValue(keyframe).values.length) {
      animatableTemplate = unresolvedKeyframes[i];
    }
    i++;
  }
  if (animatableTemplate && name) {
    for (const noneIndex of noneKeyframeIndexes) {
      unresolvedKeyframes[noneIndex] = getAnimatableNone(name, animatableTemplate);
    }
  }
}
class DOMKeyframesResolver extends KeyframeResolver {
  constructor(unresolvedKeyframes, onComplete, name, motionValue2, element) {
    super(unresolvedKeyframes, onComplete, name, motionValue2, element, true);
  }
  readKeyframes() {
    const { unresolvedKeyframes, element, name } = this;
    if (!element || !element.current)
      return;
    super.readKeyframes();
    for (let i = 0; i < unresolvedKeyframes.length; i++) {
      let keyframe = unresolvedKeyframes[i];
      if (typeof keyframe === "string") {
        keyframe = keyframe.trim();
        if (isCSSVariableToken(keyframe)) {
          const resolved = getVariableValue(keyframe, element.current);
          if (resolved !== void 0) {
            unresolvedKeyframes[i] = resolved;
          }
          if (i === unresolvedKeyframes.length - 1) {
            this.finalKeyframe = keyframe;
          }
        }
      }
    }
    this.resolveNoneKeyframes();
    if (!positionalKeys.has(name) || unresolvedKeyframes.length !== 2) {
      return;
    }
    const [origin, target] = unresolvedKeyframes;
    const originType = findDimensionValueType(origin);
    const targetType = findDimensionValueType(target);
    const originHasVar = containsCSSVariable(origin);
    const targetHasVar = containsCSSVariable(target);
    if (originHasVar !== targetHasVar && positionalValues[name]) {
      this.needsMeasurement = true;
      return;
    }
    if (originType === targetType)
      return;
    if (isNumOrPxType(originType) && isNumOrPxType(targetType)) {
      for (let i = 0; i < unresolvedKeyframes.length; i++) {
        const value = unresolvedKeyframes[i];
        if (typeof value === "string") {
          unresolvedKeyframes[i] = parseFloat(value);
        }
      }
    } else if (positionalValues[name]) {
      this.needsMeasurement = true;
    }
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes, name } = this;
    const noneKeyframeIndexes = [];
    for (let i = 0; i < unresolvedKeyframes.length; i++) {
      if (unresolvedKeyframes[i] === null || isNone(unresolvedKeyframes[i])) {
        noneKeyframeIndexes.push(i);
      }
    }
    if (noneKeyframeIndexes.length) {
      makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name);
    }
  }
  measureInitialState() {
    const { element, unresolvedKeyframes, name } = this;
    if (!element || !element.current)
      return;
    if (name === "height") {
      this.suspendedScrollY = window.pageYOffset;
    }
    this.measuredOrigin = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
    unresolvedKeyframes[0] = this.measuredOrigin;
    const measureKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
    if (measureKeyframe !== void 0) {
      element.getValue(name, measureKeyframe).jump(measureKeyframe, false);
    }
  }
  measureEndState() {
    const { element, name, unresolvedKeyframes } = this;
    if (!element || !element.current)
      return;
    const value = element.getValue(name);
    value && value.jump(this.measuredOrigin, false);
    const finalKeyframeIndex = unresolvedKeyframes.length - 1;
    const finalKeyframe = unresolvedKeyframes[finalKeyframeIndex];
    unresolvedKeyframes[finalKeyframeIndex] = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
    if (finalKeyframe !== null && this.finalKeyframe === void 0) {
      this.finalKeyframe = finalKeyframe;
    }
    if (this.removedTransforms?.length) {
      this.removedTransforms.forEach(([unsetTransformName, unsetTransformValue]) => {
        element.getValue(unsetTransformName).set(unsetTransformValue);
      });
    }
    this.resolveNoneKeyframes();
  }
}
function resolveElements(elementOrSelector, scope, selectorCache) {
  if (elementOrSelector == null) {
    return [];
  }
  if (elementOrSelector instanceof EventTarget) {
    return [elementOrSelector];
  } else if (typeof elementOrSelector === "string") {
    let root = document;
    const elements = selectorCache?.[elementOrSelector] ?? root.querySelectorAll(elementOrSelector);
    return elements ? Array.from(elements) : [];
  }
  return Array.from(elementOrSelector).filter((element) => element != null);
}
const getValueAsType = (value, type) => {
  return type && typeof value === "number" ? type.transform(value) : value;
};
function isHTMLElement(element) {
  return isObject(element) && "offsetHeight" in element && !("ownerSVGElement" in element);
}
const { schedule: microtask } = /* @__PURE__ */ createRenderBatcher(queueMicrotask, false);
const isDragging = {
  x: false,
  y: false
};
function isDragActive() {
  return isDragging.x || isDragging.y;
}
function setDragLock(axis) {
  if (axis === "x" || axis === "y") {
    if (isDragging[axis]) {
      return null;
    } else {
      isDragging[axis] = true;
      return () => {
        isDragging[axis] = false;
      };
    }
  } else {
    if (isDragging.x || isDragging.y) {
      return null;
    } else {
      isDragging.x = isDragging.y = true;
      return () => {
        isDragging.x = isDragging.y = false;
      };
    }
  }
}
function setupGesture(elementOrSelector, options) {
  const elements = resolveElements(elementOrSelector);
  const gestureAbortController = new AbortController();
  const eventOptions = {
    passive: true,
    ...options,
    signal: gestureAbortController.signal
  };
  const cancel = () => gestureAbortController.abort();
  return [elements, eventOptions, cancel];
}
function isValidHover(event) {
  return !(event.pointerType === "touch" || isDragActive());
}
function hover(elementOrSelector, onHoverStart, options = {}) {
  const [elements, eventOptions, cancel] = setupGesture(elementOrSelector, options);
  elements.forEach((element) => {
    let isPressed = false;
    let deferredHoverEnd = false;
    let hoverEndCallback;
    const removePointerLeave = () => {
      element.removeEventListener("pointerleave", onPointerLeave);
    };
    const endHover = (event) => {
      if (hoverEndCallback) {
        hoverEndCallback(event);
        hoverEndCallback = void 0;
      }
      removePointerLeave();
    };
    const onPointerUp = (event) => {
      isPressed = false;
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      if (deferredHoverEnd) {
        deferredHoverEnd = false;
        endHover(event);
      }
    };
    const onPointerDown = () => {
      isPressed = true;
      window.addEventListener("pointerup", onPointerUp, eventOptions);
      window.addEventListener("pointercancel", onPointerUp, eventOptions);
    };
    const onPointerLeave = (leaveEvent) => {
      if (leaveEvent.pointerType === "touch")
        return;
      if (isPressed) {
        deferredHoverEnd = true;
        return;
      }
      endHover(leaveEvent);
    };
    const onPointerEnter = (enterEvent) => {
      if (!isValidHover(enterEvent))
        return;
      deferredHoverEnd = false;
      const onHoverEnd = onHoverStart(element, enterEvent);
      if (typeof onHoverEnd !== "function")
        return;
      hoverEndCallback = onHoverEnd;
      element.addEventListener("pointerleave", onPointerLeave, eventOptions);
    };
    element.addEventListener("pointerenter", onPointerEnter, eventOptions);
    element.addEventListener("pointerdown", onPointerDown, eventOptions);
  });
  return cancel;
}
const isNodeOrChild = (parent, child) => {
  if (!child) {
    return false;
  } else if (parent === child) {
    return true;
  } else {
    return isNodeOrChild(parent, child.parentElement);
  }
};
const isPrimaryPointer = (event) => {
  if (event.pointerType === "mouse") {
    return typeof event.button !== "number" || event.button <= 0;
  } else {
    return event.isPrimary !== false;
  }
};
const keyboardAccessibleElements = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function isElementKeyboardAccessible(element) {
  return keyboardAccessibleElements.has(element.tagName) || element.isContentEditable === true;
}
const textInputElements = /* @__PURE__ */ new Set(["INPUT", "SELECT", "TEXTAREA"]);
function isElementTextInput(element) {
  return textInputElements.has(element.tagName) || element.isContentEditable === true;
}
const isPressing = /* @__PURE__ */ new WeakSet();
function filterEvents(callback) {
  return (event) => {
    if (event.key !== "Enter")
      return;
    callback(event);
  };
}
function firePointerEvent(target, type) {
  target.dispatchEvent(new PointerEvent("pointer" + type, { isPrimary: true, bubbles: true }));
}
const enableKeyboardPress = (focusEvent, eventOptions) => {
  const element = focusEvent.currentTarget;
  if (!element)
    return;
  const handleKeydown = filterEvents(() => {
    if (isPressing.has(element))
      return;
    firePointerEvent(element, "down");
    const handleKeyup = filterEvents(() => {
      firePointerEvent(element, "up");
    });
    const handleBlur = () => firePointerEvent(element, "cancel");
    element.addEventListener("keyup", handleKeyup, eventOptions);
    element.addEventListener("blur", handleBlur, eventOptions);
  });
  element.addEventListener("keydown", handleKeydown, eventOptions);
  element.addEventListener("blur", () => element.removeEventListener("keydown", handleKeydown), eventOptions);
};
function isValidPressEvent(event) {
  return isPrimaryPointer(event) && !isDragActive();
}
const claimedPointerDownEvents = /* @__PURE__ */ new WeakSet();
function press(targetOrSelector, onPressStart, options = {}) {
  const [targets, eventOptions, cancelEvents] = setupGesture(targetOrSelector, options);
  const startPress = (startEvent) => {
    const target = startEvent.currentTarget;
    if (!isValidPressEvent(startEvent))
      return;
    if (claimedPointerDownEvents.has(startEvent))
      return;
    isPressing.add(target);
    if (options.stopPropagation) {
      claimedPointerDownEvents.add(startEvent);
    }
    const onPressEnd = onPressStart(target, startEvent);
    const onPointerEnd = (endEvent, success) => {
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      if (isPressing.has(target)) {
        isPressing.delete(target);
      }
      if (!isValidPressEvent(endEvent)) {
        return;
      }
      if (typeof onPressEnd === "function") {
        onPressEnd(endEvent, { success });
      }
    };
    const onPointerUp = (upEvent) => {
      onPointerEnd(upEvent, target === window || target === document || options.useGlobalTarget || isNodeOrChild(target, upEvent.target));
    };
    const onPointerCancel = (cancelEvent) => {
      onPointerEnd(cancelEvent, false);
    };
    window.addEventListener("pointerup", onPointerUp, eventOptions);
    window.addEventListener("pointercancel", onPointerCancel, eventOptions);
  };
  targets.forEach((target) => {
    const pointerDownTarget = options.useGlobalTarget ? window : target;
    pointerDownTarget.addEventListener("pointerdown", startPress, eventOptions);
    if (isHTMLElement(target)) {
      target.addEventListener("focus", (event) => enableKeyboardPress(event, eventOptions));
      if (!isElementKeyboardAccessible(target) && !target.hasAttribute("tabindex")) {
        target.tabIndex = 0;
      }
    }
  });
  return cancelEvents;
}
function isSVGElement(element) {
  return isObject(element) && "ownerSVGElement" in element;
}
const resizeHandlers = /* @__PURE__ */ new WeakMap();
let observer;
const getSize = (borderBoxAxis, svgAxis, htmlAxis) => (target, borderBoxSize) => {
  if (borderBoxSize && borderBoxSize[0]) {
    return borderBoxSize[0][borderBoxAxis + "Size"];
  } else if (isSVGElement(target) && "getBBox" in target) {
    return target.getBBox()[svgAxis];
  } else {
    return target[htmlAxis];
  }
};
const getWidth = /* @__PURE__ */ getSize("inline", "width", "offsetWidth");
const getHeight = /* @__PURE__ */ getSize("block", "height", "offsetHeight");
function notifyTarget({ target, borderBoxSize }) {
  resizeHandlers.get(target)?.forEach((handler) => {
    handler(target, {
      get width() {
        return getWidth(target, borderBoxSize);
      },
      get height() {
        return getHeight(target, borderBoxSize);
      }
    });
  });
}
function notifyAll(entries) {
  entries.forEach(notifyTarget);
}
function createResizeObserver() {
  if (typeof ResizeObserver === "undefined")
    return;
  observer = new ResizeObserver(notifyAll);
}
function resizeElement(target, handler) {
  if (!observer)
    createResizeObserver();
  const elements = resolveElements(target);
  elements.forEach((element) => {
    let elementHandlers = resizeHandlers.get(element);
    if (!elementHandlers) {
      elementHandlers = /* @__PURE__ */ new Set();
      resizeHandlers.set(element, elementHandlers);
    }
    elementHandlers.add(handler);
    observer?.observe(element);
  });
  return () => {
    elements.forEach((element) => {
      const elementHandlers = resizeHandlers.get(element);
      elementHandlers?.delete(handler);
      if (!elementHandlers?.size) {
        observer?.unobserve(element);
      }
    });
  };
}
const windowCallbacks = /* @__PURE__ */ new Set();
let windowResizeHandler;
function createWindowResizeHandler() {
  windowResizeHandler = () => {
    const info = {
      get width() {
        return window.innerWidth;
      },
      get height() {
        return window.innerHeight;
      }
    };
    windowCallbacks.forEach((callback) => callback(info));
  };
  window.addEventListener("resize", windowResizeHandler);
}
function resizeWindow(callback) {
  windowCallbacks.add(callback);
  if (!windowResizeHandler)
    createWindowResizeHandler();
  return () => {
    windowCallbacks.delete(callback);
    if (!windowCallbacks.size && typeof windowResizeHandler === "function") {
      window.removeEventListener("resize", windowResizeHandler);
      windowResizeHandler = void 0;
    }
  };
}
function resize(a, b) {
  return typeof a === "function" ? resizeWindow(a) : resizeElement(a, b);
}
function isSVGSVGElement(element) {
  return isSVGElement(element) && element.tagName === "svg";
}
function transform(...args) {
  const useImmediate = !Array.isArray(args[0]);
  const argOffset = useImmediate ? 0 : -1;
  const inputValue = args[0 + argOffset];
  const inputRange = args[1 + argOffset];
  const outputRange = args[2 + argOffset];
  const options = args[3 + argOffset];
  const interpolator = interpolate(inputRange, outputRange, options);
  return useImmediate ? interpolator(inputValue) : interpolator;
}
const valueTypes = [...dimensionValueTypes, color, complex];
const findValueType = (v2) => valueTypes.find(testValueType(v2));
const createAxisDelta = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
});
const createDelta = () => ({
  x: createAxisDelta(),
  y: createAxisDelta()
});
const createAxis = () => ({ min: 0, max: 0 });
const createBox = () => ({
  x: createAxis(),
  y: createAxis()
});
const visualElementStore = /* @__PURE__ */ new WeakMap();
function isAnimationControls(v2) {
  return v2 !== null && typeof v2 === "object" && typeof v2.start === "function";
}
function isVariantLabel(v2) {
  return typeof v2 === "string" || Array.isArray(v2);
}
const variantPriorityOrder = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
];
const variantProps = ["initial", ...variantPriorityOrder];
function isControllingVariants(props) {
  return isAnimationControls(props.animate) || variantProps.some((name) => isVariantLabel(props[name]));
}
function isVariantNode(props) {
  return Boolean(isControllingVariants(props) || props.variants);
}
function updateMotionValuesFromProps(element, next, prev) {
  for (const key in next) {
    const nextValue = next[key];
    const prevValue = prev[key];
    if (isMotionValue(nextValue)) {
      element.addValue(key, nextValue);
    } else if (isMotionValue(prevValue)) {
      element.addValue(key, motionValue(nextValue, { owner: element }));
    } else if (prevValue !== nextValue) {
      if (element.hasValue(key)) {
        const existingValue = element.getValue(key);
        if (existingValue.liveStyle === true) {
          existingValue.jump(nextValue);
        } else if (!existingValue.hasAnimated) {
          existingValue.set(nextValue);
        }
      } else {
        const latestValue = element.getStaticValue(key);
        element.addValue(key, motionValue(latestValue !== void 0 ? latestValue : nextValue, { owner: element }));
      }
    }
  }
  for (const key in prev) {
    if (next[key] === void 0)
      element.removeValue(key);
  }
  return next;
}
const prefersReducedMotion = { current: null };
const hasReducedMotionListener = { current: false };
const isBrowser = typeof window !== "undefined";
function initPrefersReducedMotion() {
  hasReducedMotionListener.current = true;
  if (!isBrowser)
    return;
  if (window.matchMedia) {
    const motionMediaQuery = window.matchMedia("(prefers-reduced-motion)");
    const setReducedMotionPreferences = () => prefersReducedMotion.current = motionMediaQuery.matches;
    motionMediaQuery.addEventListener("change", setReducedMotionPreferences);
    setReducedMotionPreferences();
  } else {
    prefersReducedMotion.current = false;
  }
}
const propEventHandlers = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
let featureDefinitions = {};
function setFeatureDefinitions(definitions) {
  featureDefinitions = definitions;
}
function getFeatureDefinitions() {
  return featureDefinitions;
}
class VisualElement {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(_props, _prevProps, _visualElement) {
    return {};
  }
  constructor({ parent, props, presenceContext, reducedMotionConfig, skipAnimations, blockInitialAnimation, visualState }, options = {}) {
    this.current = null;
    this.children = /* @__PURE__ */ new Set();
    this.isVariantNode = false;
    this.isControllingVariants = false;
    this.shouldReduceMotion = null;
    this.shouldSkipAnimations = false;
    this.values = /* @__PURE__ */ new Map();
    this.KeyframeResolver = KeyframeResolver;
    this.features = {};
    this.valueSubscriptions = /* @__PURE__ */ new Map();
    this.prevMotionValues = {};
    this.hasBeenMounted = false;
    this.events = {};
    this.propEventSubscriptions = {};
    this.notifyUpdate = () => this.notify("Update", this.latestValues);
    this.render = () => {
      if (!this.current)
        return;
      this.triggerBuild();
      this.renderInstance(this.current, this.renderState, this.props.style, this.projection);
    };
    this.renderScheduledAt = 0;
    this.scheduleRender = () => {
      const now2 = time.now();
      if (this.renderScheduledAt < now2) {
        this.renderScheduledAt = now2;
        frame.render(this.render, false, true);
      }
    };
    const { latestValues, renderState } = visualState;
    this.latestValues = latestValues;
    this.baseTarget = { ...latestValues };
    this.initialValues = props.initial ? { ...latestValues } : {};
    this.renderState = renderState;
    this.parent = parent;
    this.props = props;
    this.presenceContext = presenceContext;
    this.depth = parent ? parent.depth + 1 : 0;
    this.reducedMotionConfig = reducedMotionConfig;
    this.skipAnimationsConfig = skipAnimations;
    this.options = options;
    this.blockInitialAnimation = Boolean(blockInitialAnimation);
    this.isControllingVariants = isControllingVariants(props);
    this.isVariantNode = isVariantNode(props);
    if (this.isVariantNode) {
      this.variantChildren = /* @__PURE__ */ new Set();
    }
    this.manuallyAnimateOnMount = Boolean(parent && parent.current);
    const { willChange, ...initialMotionValues } = this.scrapeMotionValuesFromProps(props, {}, this);
    for (const key in initialMotionValues) {
      const value = initialMotionValues[key];
      if (latestValues[key] !== void 0 && isMotionValue(value)) {
        value.set(latestValues[key]);
      }
    }
  }
  mount(instance) {
    if (this.hasBeenMounted) {
      for (const key in this.initialValues) {
        this.values.get(key)?.jump(this.initialValues[key]);
        this.latestValues[key] = this.initialValues[key];
      }
    }
    this.current = instance;
    visualElementStore.set(instance, this);
    if (this.projection && !this.projection.instance) {
      this.projection.mount(instance);
    }
    if (this.parent && this.isVariantNode && !this.isControllingVariants) {
      this.removeFromVariantTree = this.parent.addVariantChild(this);
    }
    this.values.forEach((value, key) => this.bindToMotionValue(key, value));
    if (this.reducedMotionConfig === "never") {
      this.shouldReduceMotion = false;
    } else if (this.reducedMotionConfig === "always") {
      this.shouldReduceMotion = true;
    } else {
      if (!hasReducedMotionListener.current) {
        initPrefersReducedMotion();
      }
      this.shouldReduceMotion = prefersReducedMotion.current;
    }
    this.shouldSkipAnimations = this.skipAnimationsConfig ?? false;
    this.parent?.addChild(this);
    this.update(this.props, this.presenceContext);
    this.hasBeenMounted = true;
  }
  unmount() {
    this.projection && this.projection.unmount();
    cancelFrame(this.notifyUpdate);
    cancelFrame(this.render);
    this.valueSubscriptions.forEach((remove) => remove());
    this.valueSubscriptions.clear();
    this.removeFromVariantTree && this.removeFromVariantTree();
    this.parent?.removeChild(this);
    for (const key in this.events) {
      this.events[key].clear();
    }
    for (const key in this.features) {
      const feature = this.features[key];
      if (feature) {
        feature.unmount();
        feature.isMounted = false;
      }
    }
    this.current = null;
  }
  addChild(child) {
    this.children.add(child);
    this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set());
    this.enteringChildren.add(child);
  }
  removeChild(child) {
    this.children.delete(child);
    this.enteringChildren && this.enteringChildren.delete(child);
  }
  bindToMotionValue(key, value) {
    if (this.valueSubscriptions.has(key)) {
      this.valueSubscriptions.get(key)();
    }
    if (value.accelerate && acceleratedValues.has(key) && this.current instanceof HTMLElement) {
      const { factory, keyframes: keyframes2, times, ease: ease2, duration } = value.accelerate;
      const animation = new NativeAnimation({
        element: this.current,
        name: key,
        keyframes: keyframes2,
        times,
        ease: ease2,
        duration: /* @__PURE__ */ secondsToMilliseconds(duration)
      });
      const cleanup = factory(animation);
      this.valueSubscriptions.set(key, () => {
        cleanup();
        animation.cancel();
      });
      return;
    }
    const valueIsTransform = transformProps.has(key);
    if (valueIsTransform && this.onBindTransform) {
      this.onBindTransform();
    }
    const removeOnChange = value.on("change", (latestValue) => {
      this.latestValues[key] = latestValue;
      this.props.onUpdate && frame.preRender(this.notifyUpdate);
      if (valueIsTransform && this.projection) {
        this.projection.isTransformDirty = true;
      }
      this.scheduleRender();
    });
    let removeSyncCheck;
    if (typeof window !== "undefined" && window.MotionCheckAppearSync) {
      removeSyncCheck = window.MotionCheckAppearSync(this, key, value);
    }
    this.valueSubscriptions.set(key, () => {
      removeOnChange();
      if (removeSyncCheck)
        removeSyncCheck();
    });
  }
  sortNodePosition(other) {
    if (!this.current || !this.sortInstanceNodePosition || this.type !== other.type) {
      return 0;
    }
    return this.sortInstanceNodePosition(this.current, other.current);
  }
  updateFeatures() {
    let key = "animation";
    for (key in featureDefinitions) {
      const featureDefinition = featureDefinitions[key];
      if (!featureDefinition)
        continue;
      const { isEnabled, Feature: FeatureConstructor } = featureDefinition;
      if (!this.features[key] && FeatureConstructor && isEnabled(this.props)) {
        this.features[key] = new FeatureConstructor(this);
      }
      if (this.features[key]) {
        const feature = this.features[key];
        if (feature.isMounted) {
          feature.update();
        } else {
          feature.mount();
          feature.isMounted = true;
        }
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : createBox();
  }
  getStaticValue(key) {
    return this.latestValues[key];
  }
  setStaticValue(key, value) {
    this.latestValues[key] = value;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(props, presenceContext) {
    if (props.transformTemplate || this.props.transformTemplate) {
      this.scheduleRender();
    }
    this.prevProps = this.props;
    this.props = props;
    this.prevPresenceContext = this.presenceContext;
    this.presenceContext = presenceContext;
    for (let i = 0; i < propEventHandlers.length; i++) {
      const key = propEventHandlers[i];
      if (this.propEventSubscriptions[key]) {
        this.propEventSubscriptions[key]();
        delete this.propEventSubscriptions[key];
      }
      const listenerName = "on" + key;
      const listener = props[listenerName];
      if (listener) {
        this.propEventSubscriptions[key] = this.on(key, listener);
      }
    }
    this.prevMotionValues = updateMotionValuesFromProps(this, this.scrapeMotionValuesFromProps(props, this.prevProps || {}, this), this.prevMotionValues);
    if (this.handleChildMotionValue) {
      this.handleChildMotionValue();
    }
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(name) {
    return this.props.variants ? this.props.variants[name] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(child) {
    const closestVariantNode = this.getClosestVariantNode();
    if (closestVariantNode) {
      closestVariantNode.variantChildren && closestVariantNode.variantChildren.add(child);
      return () => closestVariantNode.variantChildren.delete(child);
    }
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(key, value) {
    const existingValue = this.values.get(key);
    if (value !== existingValue) {
      if (existingValue)
        this.removeValue(key);
      this.bindToMotionValue(key, value);
      this.values.set(key, value);
      this.latestValues[key] = value.get();
    }
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(key) {
    this.values.delete(key);
    const unsubscribe = this.valueSubscriptions.get(key);
    if (unsubscribe) {
      unsubscribe();
      this.valueSubscriptions.delete(key);
    }
    delete this.latestValues[key];
    this.removeValueFromRenderState(key, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(key) {
    return this.values.has(key);
  }
  getValue(key, defaultValue) {
    if (this.props.values && this.props.values[key]) {
      return this.props.values[key];
    }
    let value = this.values.get(key);
    if (value === void 0 && defaultValue !== void 0) {
      value = motionValue(defaultValue === null ? void 0 : defaultValue, { owner: this });
      this.addValue(key, value);
    }
    return value;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(key, target) {
    let value = this.latestValues[key] !== void 0 || !this.current ? this.latestValues[key] : this.getBaseTargetFromProps(this.props, key) ?? this.readValueFromInstance(this.current, key, this.options);
    if (value !== void 0 && value !== null) {
      if (typeof value === "string" && (isNumericalString(value) || isZeroValueString(value))) {
        value = parseFloat(value);
      } else if (!findValueType(value) && complex.test(target)) {
        value = getAnimatableNone(key, target);
      }
      this.setBaseTarget(key, isMotionValue(value) ? value.get() : value);
    }
    return isMotionValue(value) ? value.get() : value;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(key, value) {
    this.baseTarget[key] = value;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(key) {
    const { initial } = this.props;
    let valueFromInitial;
    if (typeof initial === "string" || typeof initial === "object") {
      const variant = resolveVariantFromProps(this.props, initial, this.presenceContext?.custom);
      if (variant) {
        valueFromInitial = variant[key];
      }
    }
    if (initial && valueFromInitial !== void 0) {
      return valueFromInitial;
    }
    const target = this.getBaseTargetFromProps(this.props, key);
    if (target !== void 0 && !isMotionValue(target))
      return target;
    return this.initialValues[key] !== void 0 && valueFromInitial === void 0 ? void 0 : this.baseTarget[key];
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = new SubscriptionManager();
    }
    return this.events[eventName].add(callback);
  }
  notify(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].notify(...args);
    }
  }
  scheduleRenderMicrotask() {
    microtask.render(this.render);
  }
}
class DOMVisualElement extends VisualElement {
  constructor() {
    super(...arguments);
    this.KeyframeResolver = DOMKeyframesResolver;
  }
  sortInstanceNodePosition(a, b) {
    return a.compareDocumentPosition(b) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(props, key) {
    const style = props.style;
    return style ? style[key] : void 0;
  }
  removeValueFromRenderState(key, { vars, style }) {
    delete vars[key];
    delete style[key];
  }
  handleChildMotionValue() {
    if (this.childSubscription) {
      this.childSubscription();
      delete this.childSubscription;
    }
    const { children } = this.props;
    if (isMotionValue(children)) {
      this.childSubscription = children.on("change", (latest) => {
        if (this.current) {
          this.current.textContent = `${latest}`;
        }
      });
    }
  }
}
class Feature {
  constructor(node) {
    this.isMounted = false;
    this.node = node;
  }
  update() {
  }
}
function convertBoundingBoxToBox({ top, left, right, bottom }) {
  return {
    x: { min: left, max: right },
    y: { min: top, max: bottom }
  };
}
function convertBoxToBoundingBox({ x: x2, y: y2 }) {
  return { top: y2.min, right: x2.max, bottom: y2.max, left: x2.min };
}
function transformBoxPoints(point, transformPoint2) {
  if (!transformPoint2)
    return point;
  const topLeft = transformPoint2({ x: point.left, y: point.top });
  const bottomRight = transformPoint2({ x: point.right, y: point.bottom });
  return {
    top: topLeft.y,
    left: topLeft.x,
    bottom: bottomRight.y,
    right: bottomRight.x
  };
}
function isIdentityScale(scale2) {
  return scale2 === void 0 || scale2 === 1;
}
function hasScale({ scale: scale2, scaleX: scaleX2, scaleY: scaleY2 }) {
  return !isIdentityScale(scale2) || !isIdentityScale(scaleX2) || !isIdentityScale(scaleY2);
}
function hasTransform(values) {
  return hasScale(values) || has2DTranslate(values) || values.z || values.rotate || values.rotateX || values.rotateY || values.skewX || values.skewY;
}
function has2DTranslate(values) {
  return is2DTranslate(values.x) || is2DTranslate(values.y);
}
function is2DTranslate(value) {
  return value && value !== "0%";
}
function scalePoint(point, scale2, originPoint) {
  const distanceFromOrigin = point - originPoint;
  const scaled = scale2 * distanceFromOrigin;
  return originPoint + scaled;
}
function applyPointDelta(point, translate, scale2, originPoint, boxScale) {
  if (boxScale !== void 0) {
    point = scalePoint(point, boxScale, originPoint);
  }
  return scalePoint(point, scale2, originPoint) + translate;
}
function applyAxisDelta(axis, translate = 0, scale2 = 1, originPoint, boxScale) {
  axis.min = applyPointDelta(axis.min, translate, scale2, originPoint, boxScale);
  axis.max = applyPointDelta(axis.max, translate, scale2, originPoint, boxScale);
}
function applyBoxDelta(box, { x: x2, y: y2 }) {
  applyAxisDelta(box.x, x2.translate, x2.scale, x2.originPoint);
  applyAxisDelta(box.y, y2.translate, y2.scale, y2.originPoint);
}
const TREE_SCALE_SNAP_MIN = 0.999999999999;
const TREE_SCALE_SNAP_MAX = 1.0000000000001;
function applyTreeDeltas(box, treeScale, treePath, isSharedTransition = false) {
  const treeLength = treePath.length;
  if (!treeLength)
    return;
  treeScale.x = treeScale.y = 1;
  let node;
  let delta;
  for (let i = 0; i < treeLength; i++) {
    node = treePath[i];
    delta = node.projectionDelta;
    const { visualElement } = node.options;
    if (visualElement && visualElement.props.style && visualElement.props.style.display === "contents") {
      continue;
    }
    if (isSharedTransition && node.options.layoutScroll && node.scroll && node !== node.root) {
      translateAxis(box.x, -node.scroll.offset.x);
      translateAxis(box.y, -node.scroll.offset.y);
    }
    if (delta) {
      treeScale.x *= delta.x.scale;
      treeScale.y *= delta.y.scale;
      applyBoxDelta(box, delta);
    }
    if (isSharedTransition && hasTransform(node.latestValues)) {
      transformBox(box, node.latestValues, node.layout?.layoutBox);
    }
  }
  if (treeScale.x < TREE_SCALE_SNAP_MAX && treeScale.x > TREE_SCALE_SNAP_MIN) {
    treeScale.x = 1;
  }
  if (treeScale.y < TREE_SCALE_SNAP_MAX && treeScale.y > TREE_SCALE_SNAP_MIN) {
    treeScale.y = 1;
  }
}
function translateAxis(axis, distance2) {
  axis.min += distance2;
  axis.max += distance2;
}
function transformAxis(axis, axisTranslate, axisScale, boxScale, axisOrigin = 0.5) {
  const originPoint = mixNumber$1(axis.min, axis.max, axisOrigin);
  applyAxisDelta(axis, axisTranslate, axisScale, originPoint, boxScale);
}
function resolveAxisTranslate(value, axis) {
  if (typeof value === "string") {
    return parseFloat(value) / 100 * (axis.max - axis.min);
  }
  return value;
}
function transformBox(box, transform2, sourceBox) {
  const resolveBox = sourceBox ?? box;
  transformAxis(box.x, resolveAxisTranslate(transform2.x, resolveBox.x), transform2.scaleX, transform2.scale, transform2.originX);
  transformAxis(box.y, resolveAxisTranslate(transform2.y, resolveBox.y), transform2.scaleY, transform2.scale, transform2.originY);
}
function measureViewportBox(instance, transformPoint2) {
  return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint2));
}
function measurePageBox(element, rootProjectionNode2, transformPagePoint) {
  const viewportBox = measureViewportBox(element, transformPagePoint);
  const { scroll } = rootProjectionNode2;
  if (scroll) {
    translateAxis(viewportBox.x, scroll.offset.x);
    translateAxis(viewportBox.y, scroll.offset.y);
  }
  return viewportBox;
}
const translateAlias = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
};
const numTransforms = transformPropOrder.length;
function buildTransform(latestValues, transform2, transformTemplate) {
  let transformString = "";
  let transformIsDefault = true;
  for (let i = 0; i < numTransforms; i++) {
    const key = transformPropOrder[i];
    const value = latestValues[key];
    if (value === void 0)
      continue;
    let valueIsDefault = true;
    if (typeof value === "number") {
      valueIsDefault = value === (key.startsWith("scale") ? 1 : 0);
    } else {
      const parsed = parseFloat(value);
      valueIsDefault = key.startsWith("scale") ? parsed === 1 : parsed === 0;
    }
    if (!valueIsDefault || transformTemplate) {
      const valueAsType = getValueAsType(value, numberValueTypes[key]);
      if (!valueIsDefault) {
        transformIsDefault = false;
        const transformName = translateAlias[key] || key;
        transformString += `${transformName}(${valueAsType}) `;
      }
      if (transformTemplate) {
        transform2[key] = valueAsType;
      }
    }
  }
  const pathRotation = latestValues.pathRotation;
  if (pathRotation) {
    transformIsDefault = false;
    transformString += `rotate(${getValueAsType(pathRotation, numberValueTypes.pathRotation)}) `;
  }
  transformString = transformString.trim();
  if (transformTemplate) {
    transformString = transformTemplate(transform2, transformIsDefault ? "" : transformString);
  } else if (transformIsDefault) {
    transformString = "none";
  }
  return transformString;
}
function buildHTMLStyles(state, latestValues, transformTemplate) {
  const { style, vars, transformOrigin } = state;
  let hasTransform2 = false;
  let hasTransformOrigin = false;
  for (const key in latestValues) {
    const value = latestValues[key];
    if (transformProps.has(key)) {
      hasTransform2 = true;
      continue;
    } else if (isCSSVariableName(key)) {
      vars[key] = value;
      continue;
    } else {
      const valueAsType = getValueAsType(value, numberValueTypes[key]);
      if (key.startsWith("origin")) {
        hasTransformOrigin = true;
        transformOrigin[key] = valueAsType;
      } else {
        style[key] = valueAsType;
      }
    }
  }
  if (!latestValues.transform) {
    if (hasTransform2 || transformTemplate) {
      style.transform = buildTransform(latestValues, state.transform, transformTemplate);
    } else if (style.transform) {
      style.transform = "none";
    }
  }
  if (hasTransformOrigin) {
    const { originX = "50%", originY = "50%", originZ = 0 } = transformOrigin;
    style.transformOrigin = `${originX} ${originY} ${originZ}`;
  }
}
function renderHTML(element, { style, vars }, styleProp, projection) {
  const elementStyle = element.style;
  let key;
  for (key in style) {
    elementStyle[key] = style[key];
  }
  projection?.applyProjectionStyles(elementStyle, styleProp);
  for (key in vars) {
    elementStyle.setProperty(key, vars[key]);
  }
}
function pixelsToPercent(pixels, axis) {
  if (axis.max === axis.min)
    return 0;
  return pixels / (axis.max - axis.min) * 100;
}
const correctBorderRadius = {
  correct: (latest, node) => {
    if (!node.target)
      return latest;
    if (typeof latest === "string") {
      if (px.test(latest)) {
        latest = parseFloat(latest);
      } else {
        return latest;
      }
    }
    const x2 = pixelsToPercent(latest, node.target.x);
    const y2 = pixelsToPercent(latest, node.target.y);
    return `${x2}% ${y2}%`;
  }
};
const correctBoxShadow = {
  correct: (latest, { treeScale, projectionDelta }) => {
    const original = latest;
    const shadow = complex.parse(latest);
    if (shadow.length > 5)
      return original;
    const template = complex.createTransformer(latest);
    const offset = typeof shadow[0] !== "number" ? 1 : 0;
    const xScale = projectionDelta.x.scale * treeScale.x;
    const yScale = projectionDelta.y.scale * treeScale.y;
    shadow[0 + offset] /= xScale;
    shadow[1 + offset] /= yScale;
    const averageScale = mixNumber$1(xScale, yScale, 0.5);
    if (typeof shadow[2 + offset] === "number")
      shadow[2 + offset] /= averageScale;
    if (typeof shadow[3 + offset] === "number")
      shadow[3 + offset] /= averageScale;
    return template(shadow);
  }
};
const scaleCorrectors = {
  borderRadius: {
    ...correctBorderRadius,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: correctBorderRadius,
  borderTopRightRadius: correctBorderRadius,
  borderBottomLeftRadius: correctBorderRadius,
  borderBottomRightRadius: correctBorderRadius,
  boxShadow: correctBoxShadow
};
function isForcedMotionValue(key, { layout: layout2, layoutId }) {
  return transformProps.has(key) || key.startsWith("origin") || (layout2 || layoutId !== void 0) && (!!scaleCorrectors[key] || key === "opacity");
}
function scrapeMotionValuesFromProps$1(props, prevProps, visualElement) {
  const style = props.style;
  const prevStyle = prevProps?.style;
  const newValues = {};
  if (!style)
    return newValues;
  for (const key in style) {
    if (isMotionValue(style[key]) || prevStyle && isMotionValue(prevStyle[key]) || isForcedMotionValue(key, props) || visualElement?.getValue(key)?.liveStyle !== void 0) {
      newValues[key] = style[key];
    }
  }
  return newValues;
}
function getComputedStyle$1(element) {
  return window.getComputedStyle(element);
}
class HTMLVisualElement extends DOMVisualElement {
  constructor() {
    super(...arguments);
    this.type = "html";
    this.renderInstance = renderHTML;
  }
  readValueFromInstance(instance, key) {
    if (transformProps.has(key)) {
      return this.projection?.isProjecting ? defaultTransformValue(key) : readTransformValue(instance, key);
    } else {
      const computedStyle = getComputedStyle$1(instance);
      const value = (isCSSVariableName(key) ? computedStyle.getPropertyValue(key) : computedStyle[key]) || 0;
      return typeof value === "string" ? value.trim() : value;
    }
  }
  measureInstanceViewportBox(instance, { transformPagePoint }) {
    return measureViewportBox(instance, transformPagePoint);
  }
  build(renderState, latestValues, props) {
    buildHTMLStyles(renderState, latestValues, props.transformTemplate);
  }
  scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    return scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
  }
}
const dashKeys = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
};
const camelKeys = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function buildSVGPath(attrs, length, spacing = 1, offset = 0, useDashCase = true) {
  attrs.pathLength = 1;
  const keys = useDashCase ? dashKeys : camelKeys;
  attrs[keys.offset] = `${-offset}`;
  attrs[keys.array] = `${length} ${spacing}`;
}
const cssMotionPathProperties = [
  "offsetDistance",
  "offsetPath",
  "offsetRotate",
  "offsetAnchor"
];
function buildSVGAttrs(state, {
  attrX,
  attrY,
  attrScale,
  pathLength,
  pathSpacing = 1,
  pathOffset = 0,
  // This is object creation, which we try to avoid per-frame.
  ...latest
}, isSVGTag2, transformTemplate, styleProp) {
  buildHTMLStyles(state, latest, transformTemplate);
  if (isSVGTag2) {
    if (state.style.viewBox) {
      state.attrs.viewBox = state.style.viewBox;
    }
    return;
  }
  state.attrs = state.style;
  state.style = {};
  const { attrs, style } = state;
  if (attrs.transform) {
    style.transform = attrs.transform;
    delete attrs.transform;
  }
  if (style.transform || attrs.transformOrigin) {
    style.transformOrigin = attrs.transformOrigin ?? "50% 50%";
    delete attrs.transformOrigin;
  }
  if (style.transform) {
    style.transformBox = styleProp?.transformBox ?? "fill-box";
    delete attrs.transformBox;
  }
  for (const key of cssMotionPathProperties) {
    if (attrs[key] !== void 0) {
      style[key] = attrs[key];
      delete attrs[key];
    }
  }
  if (attrX !== void 0)
    attrs.x = attrX;
  if (attrY !== void 0)
    attrs.y = attrY;
  if (attrScale !== void 0)
    attrs.scale = attrScale;
  if (pathLength !== void 0) {
    buildSVGPath(attrs, pathLength, pathSpacing, pathOffset, false);
  }
}
const camelCaseAttributes = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]);
const isSVGTag = (tag) => typeof tag === "string" && tag.toLowerCase() === "svg";
function renderSVG(element, renderState, _styleProp, projection) {
  renderHTML(element, renderState, void 0, projection);
  for (const key in renderState.attrs) {
    element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key]);
  }
}
function scrapeMotionValuesFromProps(props, prevProps, visualElement) {
  const newValues = scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
  for (const key in props) {
    if (isMotionValue(props[key]) || isMotionValue(prevProps[key])) {
      const targetKey = transformPropOrder.indexOf(key) !== -1 ? "attr" + key.charAt(0).toUpperCase() + key.substring(1) : key;
      newValues[targetKey] = props[key];
    }
  }
  return newValues;
}
class SVGVisualElement extends DOMVisualElement {
  constructor() {
    super(...arguments);
    this.type = "svg";
    this.isSVGTag = false;
    this.measureInstanceViewportBox = createBox;
  }
  getBaseTargetFromProps(props, key) {
    return props[key];
  }
  readValueFromInstance(instance, key) {
    if (transformProps.has(key)) {
      const defaultType = getDefaultValueType(key);
      return defaultType ? defaultType.default || 0 : 0;
    }
    key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
    return instance.getAttribute(key);
  }
  scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    return scrapeMotionValuesFromProps(props, prevProps, visualElement);
  }
  build(renderState, latestValues, props) {
    buildSVGAttrs(renderState, latestValues, this.isSVGTag, props.transformTemplate, props.style);
  }
  renderInstance(instance, renderState, styleProp, projection) {
    renderSVG(instance, renderState, styleProp, projection);
  }
  mount(instance) {
    this.isSVGTag = isSVGTag(instance.tagName);
    super.mount(instance);
  }
}
const numVariantProps = variantProps.length;
function getVariantContext(visualElement) {
  if (!visualElement)
    return void 0;
  if (!visualElement.isControllingVariants) {
    const context2 = visualElement.parent ? getVariantContext(visualElement.parent) || {} : {};
    if (visualElement.props.initial !== void 0) {
      context2.initial = visualElement.props.initial;
    }
    return context2;
  }
  const context = {};
  for (let i = 0; i < numVariantProps; i++) {
    const name = variantProps[i];
    const prop = visualElement.props[name];
    if (isVariantLabel(prop) || prop === false) {
      context[name] = prop;
    }
  }
  return context;
}
function shallowCompare(next, prev) {
  if (!Array.isArray(prev))
    return false;
  const prevLength = prev.length;
  if (prevLength !== next.length)
    return false;
  for (let i = 0; i < prevLength; i++) {
    if (prev[i] !== next[i])
      return false;
  }
  return true;
}
const reversePriorityOrder = [...variantPriorityOrder].reverse();
const numAnimationTypes = variantPriorityOrder.length;
function createAnimateFunction(visualElement) {
  return (animations2) => {
    return Promise.all(animations2.map(({ animation, options }) => animateVisualElement(visualElement, animation, options)));
  };
}
function createAnimationState(visualElement) {
  let animate = createAnimateFunction(visualElement);
  let state = createState();
  let isInitialRender = true;
  let wasReset = false;
  const buildResolvedTypeValues = (type) => (acc, definition) => {
    const resolved = resolveVariant(visualElement, definition, type === "exit" ? visualElement.presenceContext?.custom : void 0);
    if (resolved) {
      const { transition, transitionEnd, ...target } = resolved;
      acc = { ...acc, ...target, ...transitionEnd };
    }
    return acc;
  };
  function setAnimateFunction(makeAnimator) {
    animate = makeAnimator(visualElement);
  }
  function animateChanges(changedActiveType) {
    const { props } = visualElement;
    const context = getVariantContext(visualElement.parent) || {};
    const animations2 = [];
    const removedKeys = /* @__PURE__ */ new Set();
    let encounteredKeys = {};
    let removedVariantIndex = Infinity;
    for (let i = 0; i < numAnimationTypes; i++) {
      const type = reversePriorityOrder[i];
      const typeState = state[type];
      const prop = props[type] !== void 0 ? props[type] : context[type];
      const propIsVariant = isVariantLabel(prop);
      const activeDelta = type === changedActiveType ? typeState.isActive : null;
      if (activeDelta === false)
        removedVariantIndex = i;
      let isInherited = prop === context[type] && prop !== props[type] && propIsVariant;
      if (isInherited && (isInitialRender || wasReset) && visualElement.manuallyAnimateOnMount) {
        isInherited = false;
      }
      typeState.protectedKeys = { ...encounteredKeys };
      if (
        // If it isn't active and hasn't *just* been set as inactive
        !typeState.isActive && activeDelta === null || // If we didn't and don't have any defined prop for this animation type
        !prop && !typeState.prevProp || // Or if the prop doesn't define an animation
        isAnimationControls(prop) || typeof prop === "boolean"
      ) {
        continue;
      }
      if (type === "exit" && typeState.isActive && activeDelta !== true) {
        if (typeState.prevResolvedValues) {
          encounteredKeys = {
            ...encounteredKeys,
            ...typeState.prevResolvedValues
          };
        }
        continue;
      }
      const variantDidChange = checkVariantsDidChange(typeState.prevProp, prop);
      let shouldAnimateType = variantDidChange || // If we're making this variant active, we want to always make it active
      type === changedActiveType && typeState.isActive && !isInherited && propIsVariant || // If we removed a higher-priority variant (i is in reverse order)
      i > removedVariantIndex && propIsVariant;
      let handledRemovedValues = false;
      const definitionList = Array.isArray(prop) ? prop : [prop];
      let resolvedValues = definitionList.reduce(buildResolvedTypeValues(type), {});
      if (activeDelta === false)
        resolvedValues = {};
      const { prevResolvedValues = {} } = typeState;
      const allKeys = {
        ...prevResolvedValues,
        ...resolvedValues
      };
      const markToAnimate = (key) => {
        shouldAnimateType = true;
        if (removedKeys.has(key)) {
          handledRemovedValues = true;
          removedKeys.delete(key);
        }
        typeState.needsAnimating[key] = true;
        const motionValue2 = visualElement.getValue(key);
        if (motionValue2)
          motionValue2.liveStyle = false;
      };
      for (const key in allKeys) {
        const next = resolvedValues[key];
        const prev = prevResolvedValues[key];
        if (encounteredKeys.hasOwnProperty(key))
          continue;
        let valueHasChanged = false;
        if (isKeyframesTarget(next) && isKeyframesTarget(prev)) {
          valueHasChanged = !shallowCompare(next, prev) || variantDidChange;
        } else {
          valueHasChanged = next !== prev;
        }
        if (valueHasChanged) {
          if (next !== void 0 && next !== null) {
            markToAnimate(key);
          } else {
            removedKeys.add(key);
          }
        } else if (next !== void 0 && removedKeys.has(key)) {
          markToAnimate(key);
        } else {
          typeState.protectedKeys[key] = true;
        }
      }
      typeState.prevProp = prop;
      typeState.prevResolvedValues = resolvedValues;
      if (typeState.isActive) {
        encounteredKeys = { ...encounteredKeys, ...resolvedValues };
      }
      if ((isInitialRender || wasReset) && visualElement.blockInitialAnimation) {
        shouldAnimateType = false;
      }
      const willAnimateViaParent = isInherited && variantDidChange;
      const needsAnimating = !willAnimateViaParent || handledRemovedValues;
      if (shouldAnimateType && needsAnimating) {
        animations2.push(...definitionList.map((animation) => {
          const options = { type };
          if (typeof animation === "string" && (isInitialRender || wasReset) && !willAnimateViaParent && visualElement.manuallyAnimateOnMount && visualElement.parent) {
            const { parent } = visualElement;
            const parentVariant = resolveVariant(parent, animation);
            if (parent.enteringChildren && parentVariant) {
              const { delayChildren } = parentVariant.transition || {};
              options.delay = calcChildStagger(parent.enteringChildren, visualElement, delayChildren);
            }
          }
          return {
            animation,
            options
          };
        }));
      }
    }
    if (removedKeys.size) {
      const fallbackAnimation = {};
      if (typeof props.initial !== "boolean") {
        const initialTransition = resolveVariant(visualElement, Array.isArray(props.initial) ? props.initial[0] : props.initial);
        if (initialTransition && initialTransition.transition) {
          fallbackAnimation.transition = initialTransition.transition;
        }
      }
      removedKeys.forEach((key) => {
        const fallbackTarget = visualElement.getBaseTarget(key);
        const motionValue2 = visualElement.getValue(key);
        if (motionValue2)
          motionValue2.liveStyle = true;
        fallbackAnimation[key] = fallbackTarget ?? null;
      });
      animations2.push({ animation: fallbackAnimation });
    }
    let shouldAnimate = Boolean(animations2.length);
    if (isInitialRender && (props.initial === false || props.initial === props.animate) && !visualElement.manuallyAnimateOnMount) {
      shouldAnimate = false;
    }
    isInitialRender = false;
    wasReset = false;
    return shouldAnimate ? animate(animations2) : Promise.resolve();
  }
  function setActive(type, isActive) {
    if (state[type].isActive === isActive)
      return Promise.resolve();
    visualElement.variantChildren?.forEach((child) => child.animationState?.setActive(type, isActive));
    state[type].isActive = isActive;
    const animations2 = animateChanges(type);
    for (const key in state) {
      state[key].protectedKeys = {};
    }
    return animations2;
  }
  return {
    animateChanges,
    setActive,
    setAnimateFunction,
    getState: () => state,
    reset: () => {
      state = createState();
      wasReset = true;
    }
  };
}
function checkVariantsDidChange(prev, next) {
  if (typeof next === "string") {
    return next !== prev;
  } else if (Array.isArray(next)) {
    return !shallowCompare(next, prev);
  }
  return false;
}
function createTypeState(isActive = false) {
  return {
    isActive,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function createState() {
  return {
    animate: createTypeState(true),
    whileInView: createTypeState(),
    whileHover: createTypeState(),
    whileTap: createTypeState(),
    whileDrag: createTypeState(),
    whileFocus: createTypeState(),
    exit: createTypeState()
  };
}
function copyAxisInto(axis, originAxis) {
  axis.min = originAxis.min;
  axis.max = originAxis.max;
}
function copyBoxInto(box, originBox) {
  copyAxisInto(box.x, originBox.x);
  copyAxisInto(box.y, originBox.y);
}
function copyAxisDeltaInto(delta, originDelta) {
  delta.translate = originDelta.translate;
  delta.scale = originDelta.scale;
  delta.originPoint = originDelta.originPoint;
  delta.origin = originDelta.origin;
}
const SCALE_PRECISION = 1e-4;
const SCALE_MIN = 1 - SCALE_PRECISION;
const SCALE_MAX = 1 + SCALE_PRECISION;
const TRANSLATE_PRECISION = 0.01;
const TRANSLATE_MIN = 0 - TRANSLATE_PRECISION;
const TRANSLATE_MAX = 0 + TRANSLATE_PRECISION;
function calcLength(axis) {
  return axis.max - axis.min;
}
function isNear(value, target, maxDistance) {
  return Math.abs(value - target) <= maxDistance;
}
function calcAxisDelta(delta, source, target, origin = 0.5) {
  delta.origin = origin;
  delta.originPoint = mixNumber$1(source.min, source.max, delta.origin);
  delta.scale = calcLength(target) / calcLength(source);
  delta.translate = mixNumber$1(target.min, target.max, delta.origin) - delta.originPoint;
  if (delta.scale >= SCALE_MIN && delta.scale <= SCALE_MAX || isNaN(delta.scale)) {
    delta.scale = 1;
  }
  if (delta.translate >= TRANSLATE_MIN && delta.translate <= TRANSLATE_MAX || isNaN(delta.translate)) {
    delta.translate = 0;
  }
}
function calcBoxDelta(delta, source, target, origin) {
  calcAxisDelta(delta.x, source.x, target.x, origin ? origin.originX : void 0);
  calcAxisDelta(delta.y, source.y, target.y, origin ? origin.originY : void 0);
}
function calcRelativeAxis(target, relative, parent, anchor = 0) {
  const anchorPoint = anchor ? mixNumber$1(parent.min, parent.max, anchor) : parent.min;
  target.min = anchorPoint + relative.min;
  target.max = target.min + calcLength(relative);
}
function calcRelativeBox(target, relative, parent, anchor) {
  calcRelativeAxis(target.x, relative.x, parent.x, anchor?.x);
  calcRelativeAxis(target.y, relative.y, parent.y, anchor?.y);
}
function calcRelativeAxisPosition(target, layout2, parent, anchor = 0) {
  const anchorPoint = anchor ? mixNumber$1(parent.min, parent.max, anchor) : parent.min;
  target.min = layout2.min - anchorPoint;
  target.max = target.min + calcLength(layout2);
}
function calcRelativePosition(target, layout2, parent, anchor) {
  calcRelativeAxisPosition(target.x, layout2.x, parent.x, anchor?.x);
  calcRelativeAxisPosition(target.y, layout2.y, parent.y, anchor?.y);
}
function removePointDelta(point, translate, scale2, originPoint, boxScale) {
  point -= translate;
  point = scalePoint(point, 1 / scale2, originPoint);
  if (boxScale !== void 0) {
    point = scalePoint(point, 1 / boxScale, originPoint);
  }
  return point;
}
function removeAxisDelta(axis, translate = 0, scale2 = 1, origin = 0.5, boxScale, originAxis = axis, sourceAxis = axis) {
  if (percent.test(translate)) {
    translate = parseFloat(translate);
    const relativeProgress = mixNumber$1(sourceAxis.min, sourceAxis.max, translate / 100);
    translate = relativeProgress - sourceAxis.min;
  }
  if (typeof translate !== "number")
    return;
  let originPoint = mixNumber$1(originAxis.min, originAxis.max, origin);
  if (axis === originAxis)
    originPoint -= translate;
  axis.min = removePointDelta(axis.min, translate, scale2, originPoint, boxScale);
  axis.max = removePointDelta(axis.max, translate, scale2, originPoint, boxScale);
}
function removeAxisTransforms(axis, transforms, [key, scaleKey, originKey], origin, sourceAxis) {
  removeAxisDelta(axis, transforms[key], transforms[scaleKey], transforms[originKey], transforms.scale, origin, sourceAxis);
}
const xKeys = ["x", "scaleX", "originX"];
const yKeys = ["y", "scaleY", "originY"];
function removeBoxTransforms(box, transforms, originBox, sourceBox) {
  removeAxisTransforms(box.x, transforms, xKeys, originBox ? originBox.x : void 0, sourceBox ? sourceBox.x : void 0);
  removeAxisTransforms(box.y, transforms, yKeys, originBox ? originBox.y : void 0, sourceBox ? sourceBox.y : void 0);
}
function isAxisDeltaZero(delta) {
  return delta.translate === 0 && delta.scale === 1;
}
function isDeltaZero(delta) {
  return isAxisDeltaZero(delta.x) && isAxisDeltaZero(delta.y);
}
function axisEquals(a, b) {
  return a.min === b.min && a.max === b.max;
}
function boxEquals(a, b) {
  return axisEquals(a.x, b.x) && axisEquals(a.y, b.y);
}
function axisEqualsRounded(a, b) {
  return Math.round(a.min) === Math.round(b.min) && Math.round(a.max) === Math.round(b.max);
}
function boxEqualsRounded(a, b) {
  return axisEqualsRounded(a.x, b.x) && axisEqualsRounded(a.y, b.y);
}
function aspectRatio(box) {
  return calcLength(box.x) / calcLength(box.y);
}
function axisDeltaEquals(a, b) {
  return a.translate === b.translate && a.scale === b.scale && a.originPoint === b.originPoint;
}
function eachAxis(callback) {
  return [callback("x"), callback("y")];
}
function buildProjectionTransform(delta, treeScale, latestTransform) {
  let transform2 = "";
  const xTranslate = delta.x.translate / treeScale.x;
  const yTranslate = delta.y.translate / treeScale.y;
  const zTranslate = latestTransform?.z || 0;
  if (xTranslate || yTranslate || zTranslate) {
    transform2 = `translate3d(${xTranslate}px, ${yTranslate}px, ${zTranslate}px) `;
  }
  if (treeScale.x !== 1 || treeScale.y !== 1) {
    transform2 += `scale(${1 / treeScale.x}, ${1 / treeScale.y}) `;
  }
  if (latestTransform) {
    const { transformPerspective, rotate: rotate2, pathRotation, rotateX, rotateY, skewX, skewY } = latestTransform;
    if (transformPerspective)
      transform2 = `perspective(${transformPerspective}px) ${transform2}`;
    if (rotate2)
      transform2 += `rotate(${rotate2}deg) `;
    if (pathRotation)
      transform2 += `rotate(${pathRotation}deg) `;
    if (rotateX)
      transform2 += `rotateX(${rotateX}deg) `;
    if (rotateY)
      transform2 += `rotateY(${rotateY}deg) `;
    if (skewX)
      transform2 += `skewX(${skewX}deg) `;
    if (skewY)
      transform2 += `skewY(${skewY}deg) `;
  }
  const elementScaleX = delta.x.scale * treeScale.x;
  const elementScaleY = delta.y.scale * treeScale.y;
  if (elementScaleX !== 1 || elementScaleY !== 1) {
    transform2 += `scale(${elementScaleX}, ${elementScaleY})`;
  }
  return transform2 || "none";
}
const borderLabels = [
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius"
];
const numBorders = borderLabels.length;
const asNumber = (value) => typeof value === "string" ? parseFloat(value) : value;
const isPx = (value) => typeof value === "number" || px.test(value);
function mixValues(target, follow, lead, progress2, shouldCrossfadeOpacity, isOnlyMember) {
  if (shouldCrossfadeOpacity) {
    target.opacity = mixNumber$1(0, lead.opacity ?? 1, easeCrossfadeIn(progress2));
    target.opacityExit = mixNumber$1(follow.opacity ?? 1, 0, easeCrossfadeOut(progress2));
  } else if (isOnlyMember) {
    target.opacity = mixNumber$1(follow.opacity ?? 1, lead.opacity ?? 1, progress2);
  }
  for (let i = 0; i < numBorders; i++) {
    const borderLabel = borderLabels[i];
    let followRadius = getRadius(follow, borderLabel);
    let leadRadius = getRadius(lead, borderLabel);
    if (followRadius === void 0 && leadRadius === void 0)
      continue;
    followRadius || (followRadius = 0);
    leadRadius || (leadRadius = 0);
    const canMix = followRadius === 0 || leadRadius === 0 || isPx(followRadius) === isPx(leadRadius);
    if (canMix) {
      target[borderLabel] = Math.max(mixNumber$1(asNumber(followRadius), asNumber(leadRadius), progress2), 0);
      if (percent.test(leadRadius) || percent.test(followRadius)) {
        target[borderLabel] += "%";
      }
    } else {
      target[borderLabel] = leadRadius;
    }
  }
  if (follow.rotate || lead.rotate) {
    target.rotate = mixNumber$1(follow.rotate || 0, lead.rotate || 0, progress2);
  }
}
function getRadius(values, radiusName) {
  return values[radiusName] !== void 0 ? values[radiusName] : values.borderRadius;
}
const easeCrossfadeIn = /* @__PURE__ */ compress(0, 0.5, circOut);
const easeCrossfadeOut = /* @__PURE__ */ compress(0.5, 0.95, noop);
function compress(min, max, easing) {
  return (p2) => {
    if (p2 < min)
      return 0;
    if (p2 > max)
      return 1;
    return easing(/* @__PURE__ */ progress(min, max, p2));
  };
}
function animateSingleValue(value, keyframes2, options) {
  const motionValue$1 = isMotionValue(value) ? value : motionValue(value);
  motionValue$1.start(animateMotionValue("", motionValue$1, keyframes2, options));
  return motionValue$1.animation;
}
function addDomEvent(target, eventName, handler, options = { passive: true }) {
  target.addEventListener(eventName, handler, options);
  return () => target.removeEventListener(eventName, handler);
}
const compareByDepth = (a, b) => a.depth - b.depth;
class FlatTree {
  constructor() {
    this.children = [];
    this.isDirty = false;
  }
  add(child) {
    addUniqueItem(this.children, child);
    this.isDirty = true;
  }
  remove(child) {
    removeItem(this.children, child);
    this.isDirty = true;
  }
  forEach(callback) {
    this.isDirty && this.children.sort(compareByDepth);
    this.isDirty = false;
    this.children.forEach(callback);
  }
}
function delay(callback, timeout) {
  const start = time.now();
  const checkElapsed = ({ timestamp }) => {
    const elapsed = timestamp - start;
    if (elapsed >= timeout) {
      cancelFrame(checkElapsed);
      callback(elapsed - timeout);
    }
  };
  frame.setup(checkElapsed, true);
  return () => cancelFrame(checkElapsed);
}
function resolveMotionValue(value) {
  return isMotionValue(value) ? value.get() : value;
}
class NodeStack {
  constructor() {
    this.members = [];
  }
  add(node) {
    addUniqueItem(this.members, node);
    for (let i = this.members.length - 1; i >= 0; i--) {
      const member = this.members[i];
      if (member === node || member === this.lead || member === this.prevLead)
        continue;
      const inst = member.instance;
      if ((!inst || inst.isConnected === false) && !member.snapshot) {
        removeItem(this.members, member);
        member.unmount();
      }
    }
    node.scheduleRender();
  }
  remove(node) {
    removeItem(this.members, node);
    if (node === this.prevLead)
      this.prevLead = void 0;
    if (node === this.lead) {
      const prevLead = this.members[this.members.length - 1];
      if (prevLead)
        this.promote(prevLead);
    }
  }
  relegate(node) {
    for (let i = this.members.indexOf(node) - 1; i >= 0; i--) {
      const member = this.members[i];
      if (member.isPresent !== false && member.instance?.isConnected !== false) {
        this.promote(member);
        return true;
      }
    }
    return false;
  }
  promote(node, preserveFollowOpacity) {
    const prevLead = this.lead;
    if (node === prevLead)
      return;
    this.prevLead = prevLead;
    this.lead = node;
    node.show();
    if (prevLead) {
      prevLead.updateSnapshot();
      node.scheduleRender();
      const { layoutDependency: prevDep } = prevLead.options;
      const { layoutDependency: nextDep } = node.options;
      if (prevDep === void 0 || prevDep !== nextDep) {
        node.resumeFrom = prevLead;
        if (preserveFollowOpacity)
          prevLead.preserveOpacity = true;
        if (prevLead.snapshot) {
          node.snapshot = prevLead.snapshot;
          node.snapshot.latestValues = prevLead.animationValues || prevLead.latestValues;
        }
        if (node.root?.isUpdating)
          node.isLayoutDirty = true;
      }
      if (node.options.crossfade === false)
        prevLead.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((member) => {
      member.options.onExitComplete?.();
      member.resumingFrom?.options.onExitComplete?.();
    });
  }
  scheduleRender() {
    this.members.forEach((member) => member.instance && member.scheduleRender(false));
  }
  removeLeadSnapshot() {
    if (this.lead?.snapshot)
      this.lead.snapshot = void 0;
  }
}
const globalProjectionState = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: true,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: false
};
const transformAxes = ["", "X", "Y", "Z"];
const animationTarget = 1e3;
let id$1 = 0;
function resetDistortingTransform(key, visualElement, values, sharedAnimationValues) {
  const { latestValues } = visualElement;
  if (latestValues[key]) {
    values[key] = latestValues[key];
    visualElement.setStaticValue(key, 0);
    if (sharedAnimationValues) {
      sharedAnimationValues[key] = 0;
    }
  }
}
function cancelTreeOptimisedTransformAnimations(projectionNode) {
  projectionNode.hasCheckedOptimisedAppear = true;
  if (projectionNode.root === projectionNode)
    return;
  const { visualElement } = projectionNode.options;
  if (!visualElement)
    return;
  const appearId = getOptimisedAppearId(visualElement);
  if (window.MotionHasOptimisedAnimation(appearId, "transform")) {
    const { layout: layout2, layoutId } = projectionNode.options;
    window.MotionCancelOptimisedAnimation(appearId, "transform", frame, !(layout2 || layoutId));
  }
  const { parent } = projectionNode;
  if (parent && !parent.hasCheckedOptimisedAppear) {
    cancelTreeOptimisedTransformAnimations(parent);
  }
}
function createProjectionNode$1({ attachResizeListener, defaultParent, measureScroll, checkIsScrollRoot, resetTransform }) {
  return class ProjectionNode {
    constructor(latestValues = {}, parent = defaultParent?.()) {
      this.id = id$1++;
      this.animationId = 0;
      this.animationCommitId = 0;
      this.children = /* @__PURE__ */ new Set();
      this.options = {};
      this.isTreeAnimating = false;
      this.isAnimationBlocked = false;
      this.isLayoutDirty = false;
      this.isProjectionDirty = false;
      this.isSharedProjectionDirty = false;
      this.isTransformDirty = false;
      this.updateManuallyBlocked = false;
      this.updateBlockedByResize = false;
      this.isUpdating = false;
      this.isSVG = false;
      this.needsReset = false;
      this.shouldResetTransform = false;
      this.hasCheckedOptimisedAppear = false;
      this.treeScale = { x: 1, y: 1 };
      this.eventHandlers = /* @__PURE__ */ new Map();
      this.hasTreeAnimated = false;
      this.layoutVersion = 0;
      this.updateScheduled = false;
      this.scheduleUpdate = () => this.update();
      this.projectionUpdateScheduled = false;
      this.checkUpdateFailed = () => {
        if (this.isUpdating) {
          this.isUpdating = false;
          this.clearAllSnapshots();
        }
      };
      this.updateProjection = () => {
        this.projectionUpdateScheduled = false;
        this.nodes.forEach(propagateDirtyNodes);
        this.nodes.forEach(resolveTargetDelta);
        this.nodes.forEach(calcProjection);
        this.nodes.forEach(cleanDirtyNodes);
      };
      this.resolvedRelativeTargetAt = 0;
      this.linkedParentVersion = 0;
      this.hasProjected = false;
      this.isVisible = true;
      this.animationProgress = 0;
      this.sharedNodes = /* @__PURE__ */ new Map();
      this.latestValues = latestValues;
      this.root = parent ? parent.root || parent : this;
      this.path = parent ? [...parent.path, parent] : [];
      this.parent = parent;
      this.depth = parent ? parent.depth + 1 : 0;
      for (let i = 0; i < this.path.length; i++) {
        this.path[i].shouldResetTransform = true;
      }
      if (this.root === this)
        this.nodes = new FlatTree();
    }
    addEventListener(name, handler) {
      if (!this.eventHandlers.has(name)) {
        this.eventHandlers.set(name, new SubscriptionManager());
      }
      return this.eventHandlers.get(name).add(handler);
    }
    notifyListeners(name, ...args) {
      const subscriptionManager = this.eventHandlers.get(name);
      subscriptionManager && subscriptionManager.notify(...args);
    }
    hasListeners(name) {
      return this.eventHandlers.has(name);
    }
    /**
     * Lifecycles
     */
    mount(instance) {
      if (this.instance)
        return;
      this.isSVG = isSVGElement(instance) && !isSVGSVGElement(instance);
      this.instance = instance;
      const { layoutId, layout: layout2, visualElement } = this.options;
      if (visualElement && !visualElement.current) {
        visualElement.mount(instance);
      }
      this.root.nodes.add(this);
      this.parent && this.parent.children.add(this);
      if (this.root.hasTreeAnimated && (layout2 || layoutId)) {
        this.isLayoutDirty = true;
      }
      if (attachResizeListener) {
        let cancelDelay;
        let innerWidth = 0;
        const resizeUnblockUpdate = () => this.root.updateBlockedByResize = false;
        frame.read(() => {
          innerWidth = window.innerWidth;
        });
        attachResizeListener(instance, () => {
          const newInnerWidth = window.innerWidth;
          if (newInnerWidth === innerWidth)
            return;
          innerWidth = newInnerWidth;
          this.root.updateBlockedByResize = true;
          cancelDelay && cancelDelay();
          cancelDelay = delay(resizeUnblockUpdate, 250);
          if (globalProjectionState.hasAnimatedSinceResize) {
            globalProjectionState.hasAnimatedSinceResize = false;
            this.nodes.forEach(finishAnimation);
          }
        });
      }
      if (layoutId) {
        this.root.registerSharedNode(layoutId, this);
      }
      if (this.options.animate !== false && visualElement && (layoutId || layout2)) {
        this.addEventListener("didUpdate", ({ delta, hasLayoutChanged, hasRelativeLayoutChanged, layout: newLayout }) => {
          if (this.isTreeAnimationBlocked()) {
            this.target = void 0;
            this.relativeTarget = void 0;
            return;
          }
          const layoutTransition = this.options.transition || visualElement.getDefaultTransition() || defaultLayoutTransition;
          const { onLayoutAnimationStart, onLayoutAnimationComplete } = visualElement.getProps();
          const hasTargetChanged = !this.targetLayout || !boxEqualsRounded(this.targetLayout, newLayout);
          const hasOnlyRelativeTargetChanged = !hasLayoutChanged && hasRelativeLayoutChanged;
          if (this.options.layoutRoot || this.resumeFrom || hasOnlyRelativeTargetChanged || hasLayoutChanged && (hasTargetChanged || !this.currentAnimation)) {
            if (this.resumeFrom) {
              this.resumingFrom = this.resumeFrom;
              this.resumingFrom.resumingFrom = void 0;
            }
            const animationOptions = {
              ...getValueTransition(layoutTransition, "layout"),
              onPlay: onLayoutAnimationStart,
              onComplete: onLayoutAnimationComplete
            };
            if (visualElement.shouldReduceMotion || this.options.layoutRoot) {
              animationOptions.delay = 0;
              animationOptions.type = false;
            }
            this.startAnimation(animationOptions);
            this.setAnimationOrigin(delta, hasOnlyRelativeTargetChanged, animationOptions.path);
          } else {
            if (!hasLayoutChanged) {
              finishAnimation(this);
            }
            if (this.isLead() && this.options.onExitComplete) {
              this.options.onExitComplete();
            }
          }
          this.targetLayout = newLayout;
        });
      }
    }
    unmount() {
      this.options.layoutId && this.willUpdate();
      this.root.nodes.remove(this);
      const stack = this.getStack();
      stack && stack.remove(this);
      this.parent && this.parent.children.delete(this);
      this.instance = void 0;
      this.eventHandlers.clear();
      cancelFrame(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = true;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = false;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || false;
    }
    // Note: currently only running on root node
    startUpdate() {
      if (this.isUpdateBlocked())
        return;
      this.isUpdating = true;
      this.nodes && this.nodes.forEach(resetSkewAndRotation);
      this.animationId++;
    }
    getTransformTemplate() {
      const { visualElement } = this.options;
      return visualElement && visualElement.getProps().transformTemplate;
    }
    willUpdate(shouldNotifyListeners = true) {
      this.root.hasTreeAnimated = true;
      if (this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear) {
        cancelTreeOptimisedTransformAnimations(this);
      }
      !this.root.isUpdating && this.root.startUpdate();
      if (this.isLayoutDirty)
        return;
      this.isLayoutDirty = true;
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        node.shouldResetTransform = true;
        if (typeof node.latestValues.x === "string" || typeof node.latestValues.y === "string") {
          node.isLayoutDirty = true;
        }
        node.updateScroll("snapshot");
        if (node.options.layoutRoot) {
          node.willUpdate(false);
        }
      }
      const { layoutId, layout: layout2 } = this.options;
      if (layoutId === void 0 && !layout2)
        return;
      const transformTemplate = this.getTransformTemplate();
      this.prevTransformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
      this.updateSnapshot();
      shouldNotifyListeners && this.notifyListeners("willUpdate");
    }
    update() {
      this.updateScheduled = false;
      const updateWasBlocked = this.isUpdateBlocked();
      if (updateWasBlocked) {
        const wasBlockedByResize = this.updateBlockedByResize;
        this.unblockUpdate();
        this.updateBlockedByResize = false;
        this.clearAllSnapshots();
        if (wasBlockedByResize) {
          this.nodes.forEach(forceLayoutMeasure);
        }
        this.nodes.forEach(clearMeasurements);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(clearIsLayoutDirty);
        return;
      }
      this.animationCommitId = this.animationId;
      if (!this.isUpdating) {
        this.nodes.forEach(clearIsLayoutDirty);
      } else {
        this.isUpdating = false;
        this.nodes.forEach(ensureDraggedNodesSnapshotted);
        this.nodes.forEach(resetTransformStyle);
        this.nodes.forEach(updateLayout);
        this.nodes.forEach(notifyLayoutUpdate);
      }
      this.clearAllSnapshots();
      const now2 = time.now();
      frameData.delta = clamp(0, 1e3 / 60, now2 - frameData.timestamp);
      frameData.timestamp = now2;
      frameData.isProcessing = true;
      frameSteps.update.process(frameData);
      frameSteps.preRender.process(frameData);
      frameSteps.render.process(frameData);
      frameData.isProcessing = false;
    }
    didUpdate() {
      if (!this.updateScheduled) {
        this.updateScheduled = true;
        microtask.read(this.scheduleUpdate);
      }
    }
    clearAllSnapshots() {
      this.nodes.forEach(clearSnapshot);
      this.sharedNodes.forEach(removeLeadSnapshots);
    }
    scheduleUpdateProjection() {
      if (!this.projectionUpdateScheduled) {
        this.projectionUpdateScheduled = true;
        frame.preRender(this.updateProjection, false, true);
      }
    }
    scheduleCheckAfterUnmount() {
      frame.postRender(() => {
        if (this.isLayoutDirty) {
          this.root.didUpdate();
        } else {
          this.root.checkUpdateFailed();
        }
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      if (this.snapshot || !this.instance)
        return;
      this.snapshot = this.measure();
      if (this.snapshot && !calcLength(this.snapshot.measuredBox.x) && !calcLength(this.snapshot.measuredBox.y)) {
        this.snapshot = void 0;
      }
    }
    updateLayout() {
      if (!this.instance)
        return;
      this.updateScroll();
      if (!(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty) {
        return;
      }
      if (this.resumeFrom && !this.resumeFrom.instance) {
        for (let i = 0; i < this.path.length; i++) {
          const node = this.path[i];
          node.updateScroll();
        }
      }
      const prevLayout = this.layout;
      this.layout = this.measure(false);
      this.layoutVersion++;
      if (!this.layoutCorrected)
        this.layoutCorrected = createBox();
      this.isLayoutDirty = false;
      this.projectionDelta = void 0;
      this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement } = this.options;
      visualElement && visualElement.notify("LayoutMeasure", this.layout.layoutBox, prevLayout ? prevLayout.layoutBox : void 0);
    }
    updateScroll(phase = "measure") {
      let needsMeasurement = Boolean(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === phase) {
        needsMeasurement = false;
      }
      if (needsMeasurement && this.instance) {
        const isRoot = checkIsScrollRoot(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase,
          isRoot,
          offset: measureScroll(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : isRoot
        };
      }
    }
    resetTransform() {
      if (!resetTransform)
        return;
      const isResetRequested = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout;
      const hasProjection = this.projectionDelta && !isDeltaZero(this.projectionDelta);
      const transformTemplate = this.getTransformTemplate();
      const transformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
      const transformTemplateHasChanged = transformTemplateValue !== this.prevTransformTemplateValue;
      if (isResetRequested && this.instance && (hasProjection || hasTransform(this.latestValues) || transformTemplateHasChanged)) {
        resetTransform(this.instance, transformTemplateValue);
        this.shouldResetTransform = false;
        this.scheduleRender();
      }
    }
    measure(removeTransform = true) {
      const pageBox = this.measurePageBox();
      let layoutBox = this.removeElementScroll(pageBox);
      if (removeTransform) {
        layoutBox = this.removeTransform(layoutBox);
      }
      roundBox(layoutBox);
      return {
        animationId: this.root.animationId,
        measuredBox: pageBox,
        layoutBox,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      const { visualElement } = this.options;
      if (!visualElement)
        return createBox();
      const box = visualElement.measureViewportBox();
      const wasInScrollRoot = this.scroll?.wasRoot || this.path.some(checkNodeWasScrollRoot);
      if (!wasInScrollRoot) {
        const { scroll } = this.root;
        if (scroll) {
          translateAxis(box.x, scroll.offset.x);
          translateAxis(box.y, scroll.offset.y);
        }
      }
      return box;
    }
    removeElementScroll(box) {
      const boxWithoutScroll = createBox();
      copyBoxInto(boxWithoutScroll, box);
      if (this.scroll?.wasRoot) {
        return boxWithoutScroll;
      }
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        const { scroll, options } = node;
        if (node !== this.root && scroll && options.layoutScroll) {
          if (scroll.wasRoot) {
            copyBoxInto(boxWithoutScroll, box);
          }
          translateAxis(boxWithoutScroll.x, scroll.offset.x);
          translateAxis(boxWithoutScroll.y, scroll.offset.y);
        }
      }
      return boxWithoutScroll;
    }
    applyTransform(box, transformOnly = false, output) {
      const withTransforms = output || createBox();
      copyBoxInto(withTransforms, box);
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        if (!transformOnly && node.options.layoutScroll && node.scroll && node !== node.root) {
          translateAxis(withTransforms.x, -node.scroll.offset.x);
          translateAxis(withTransforms.y, -node.scroll.offset.y);
        }
        if (!hasTransform(node.latestValues))
          continue;
        transformBox(withTransforms, node.latestValues, node.layout?.layoutBox);
      }
      if (hasTransform(this.latestValues)) {
        transformBox(withTransforms, this.latestValues, this.layout?.layoutBox);
      }
      return withTransforms;
    }
    removeTransform(box) {
      const boxWithoutTransform = createBox();
      copyBoxInto(boxWithoutTransform, box);
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        if (!hasTransform(node.latestValues))
          continue;
        let sourceBox;
        if (node.instance) {
          hasScale(node.latestValues) && node.updateSnapshot();
          sourceBox = createBox();
          copyBoxInto(sourceBox, node.measurePageBox());
        }
        removeBoxTransforms(boxWithoutTransform, node.latestValues, node.snapshot?.layoutBox, sourceBox);
      }
      if (hasTransform(this.latestValues)) {
        removeBoxTransforms(boxWithoutTransform, this.latestValues);
      }
      return boxWithoutTransform;
    }
    setTargetDelta(delta) {
      this.targetDelta = delta;
      this.root.scheduleUpdateProjection();
      this.isProjectionDirty = true;
    }
    setOptions(options) {
      this.options = {
        ...this.options,
        ...options,
        crossfade: options.crossfade !== void 0 ? options.crossfade : true
      };
    }
    clearMeasurements() {
      this.scroll = void 0;
      this.layout = void 0;
      this.snapshot = void 0;
      this.prevTransformTemplateValue = void 0;
      this.targetDelta = void 0;
      this.target = void 0;
      this.isLayoutDirty = false;
    }
    forceRelativeParentToResolveTarget() {
      if (!this.relativeParent)
        return;
      if (this.relativeParent.resolvedRelativeTargetAt !== frameData.timestamp) {
        this.relativeParent.resolveTargetDelta(true);
      }
    }
    resolveTargetDelta(forceRecalculation = false) {
      const lead = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = lead.isProjectionDirty);
      this.isTransformDirty || (this.isTransformDirty = lead.isTransformDirty);
      this.isSharedProjectionDirty || (this.isSharedProjectionDirty = lead.isSharedProjectionDirty);
      const isShared = Boolean(this.resumingFrom) || this !== lead;
      const canSkip = !(forceRecalculation || isShared && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize);
      if (canSkip)
        return;
      const { layout: layout2, layoutId } = this.options;
      if (!this.layout || !(layout2 || layoutId))
        return;
      this.resolvedRelativeTargetAt = frameData.timestamp;
      const relativeParent = this.getClosestProjectingParent();
      if (relativeParent && this.linkedParentVersion !== relativeParent.layoutVersion && !relativeParent.options.layoutRoot) {
        this.removeRelativeTarget();
      }
      if (!this.targetDelta && !this.relativeTarget) {
        if (this.options.layoutAnchor !== false && relativeParent && relativeParent.layout) {
          this.createRelativeTarget(relativeParent, this.layout.layoutBox, relativeParent.layout.layoutBox);
        } else {
          this.removeRelativeTarget();
        }
      }
      if (!this.relativeTarget && !this.targetDelta)
        return;
      if (!this.target) {
        this.target = createBox();
        this.targetWithTransforms = createBox();
      }
      if (this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target) {
        this.forceRelativeParentToResolveTarget();
        calcRelativeBox(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || void 0);
      } else if (this.targetDelta) {
        if (Boolean(this.resumingFrom)) {
          this.applyTransform(this.layout.layoutBox, false, this.target);
        } else {
          copyBoxInto(this.target, this.layout.layoutBox);
        }
        applyBoxDelta(this.target, this.targetDelta);
      } else {
        copyBoxInto(this.target, this.layout.layoutBox);
      }
      if (this.attemptToResolveRelativeTarget) {
        this.attemptToResolveRelativeTarget = false;
        if (this.options.layoutAnchor !== false && relativeParent && Boolean(relativeParent.resumingFrom) === Boolean(this.resumingFrom) && !relativeParent.options.layoutScroll && relativeParent.target && this.animationProgress !== 1) {
          this.createRelativeTarget(relativeParent, this.target, relativeParent.target);
        } else {
          this.relativeParent = this.relativeTarget = void 0;
        }
      }
    }
    getClosestProjectingParent() {
      if (!this.parent || hasScale(this.parent.latestValues) || has2DTranslate(this.parent.latestValues)) {
        return void 0;
      }
      if (this.parent.isProjecting()) {
        return this.parent;
      } else {
        return this.parent.getClosestProjectingParent();
      }
    }
    isProjecting() {
      return Boolean((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    createRelativeTarget(relativeParent, layout2, parentLayout) {
      this.relativeParent = relativeParent;
      this.linkedParentVersion = relativeParent.layoutVersion;
      this.forceRelativeParentToResolveTarget();
      this.relativeTarget = createBox();
      this.relativeTargetOrigin = createBox();
      calcRelativePosition(this.relativeTargetOrigin, layout2, parentLayout, this.options.layoutAnchor || void 0);
      copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      const lead = this.getLead();
      const isShared = Boolean(this.resumingFrom) || this !== lead;
      let canSkip = true;
      if (this.isProjectionDirty || this.parent?.isProjectionDirty) {
        canSkip = false;
      }
      if (isShared && (this.isSharedProjectionDirty || this.isTransformDirty)) {
        canSkip = false;
      }
      if (this.resolvedRelativeTargetAt === frameData.timestamp) {
        canSkip = false;
      }
      if (canSkip)
        return;
      const { layout: layout2, layoutId } = this.options;
      this.isTreeAnimating = Boolean(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation);
      if (!this.isTreeAnimating) {
        this.targetDelta = this.relativeTarget = void 0;
      }
      if (!this.layout || !(layout2 || layoutId))
        return;
      copyBoxInto(this.layoutCorrected, this.layout.layoutBox);
      const prevTreeScaleX = this.treeScale.x;
      const prevTreeScaleY = this.treeScale.y;
      applyTreeDeltas(this.layoutCorrected, this.treeScale, this.path, isShared);
      if (lead.layout && !lead.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1)) {
        lead.target = lead.layout.layoutBox;
        lead.targetWithTransforms = createBox();
      }
      const { target } = lead;
      if (!target) {
        if (this.prevProjectionDelta) {
          this.createProjectionDeltas();
          this.scheduleRender();
        }
        return;
      }
      if (!this.projectionDelta || !this.prevProjectionDelta) {
        this.createProjectionDeltas();
      } else {
        copyAxisDeltaInto(this.prevProjectionDelta.x, this.projectionDelta.x);
        copyAxisDeltaInto(this.prevProjectionDelta.y, this.projectionDelta.y);
      }
      calcBoxDelta(this.projectionDelta, this.layoutCorrected, target, this.latestValues);
      if (this.treeScale.x !== prevTreeScaleX || this.treeScale.y !== prevTreeScaleY || !axisDeltaEquals(this.projectionDelta.x, this.prevProjectionDelta.x) || !axisDeltaEquals(this.projectionDelta.y, this.prevProjectionDelta.y)) {
        this.hasProjected = true;
        this.scheduleRender();
        this.notifyListeners("projectionUpdate", target);
      }
    }
    hide() {
      this.isVisible = false;
    }
    show() {
      this.isVisible = true;
    }
    scheduleRender(notifyAll2 = true) {
      this.options.visualElement?.scheduleRender();
      if (notifyAll2) {
        const stack = this.getStack();
        stack && stack.scheduleRender();
      }
      if (this.resumingFrom && !this.resumingFrom.instance) {
        this.resumingFrom = void 0;
      }
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = createDelta();
      this.projectionDelta = createDelta();
      this.projectionDeltaWithTransform = createDelta();
    }
    setAnimationOrigin(delta, hasOnlyRelativeTargetChanged = false, pathFn) {
      const snapshot = this.snapshot;
      const snapshotLatestValues = snapshot ? snapshot.latestValues : {};
      const mixedValues = { ...this.latestValues };
      const targetDelta = createDelta();
      if (!this.relativeParent || !this.relativeParent.options.layoutRoot) {
        this.relativeTarget = this.relativeTargetOrigin = void 0;
      }
      this.attemptToResolveRelativeTarget = !hasOnlyRelativeTargetChanged;
      const relativeLayout = createBox();
      const snapshotSource = snapshot ? snapshot.source : void 0;
      const layoutSource = this.layout ? this.layout.source : void 0;
      const isSharedLayoutAnimation = snapshotSource !== layoutSource;
      const stack = this.getStack();
      const isOnlyMember = !stack || stack.members.length <= 1;
      const shouldCrossfadeOpacity = Boolean(isSharedLayoutAnimation && !isOnlyMember && this.options.crossfade === true && !this.path.some(hasOpacityCrossfade));
      this.animationProgress = 0;
      let prevRelativeTarget;
      const interpolate2 = pathFn?.interpolateProjection(delta);
      this.mixTargetDelta = (latest) => {
        const progress2 = latest / 1e3;
        const point = interpolate2?.(progress2);
        if (point) {
          targetDelta.x.translate = point.x;
          targetDelta.x.scale = mixNumber$1(delta.x.scale, 1, progress2);
          targetDelta.x.origin = delta.x.origin;
          targetDelta.x.originPoint = delta.x.originPoint;
          targetDelta.y.translate = point.y;
          targetDelta.y.scale = mixNumber$1(delta.y.scale, 1, progress2);
          targetDelta.y.origin = delta.y.origin;
          targetDelta.y.originPoint = delta.y.originPoint;
        } else {
          mixAxisDeltaLinear(targetDelta.x, delta.x, progress2);
          mixAxisDeltaLinear(targetDelta.y, delta.y, progress2);
        }
        this.setTargetDelta(targetDelta);
        if (this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout) {
          calcRelativePosition(relativeLayout, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0);
          mixBox(this.relativeTarget, this.relativeTargetOrigin, relativeLayout, progress2);
          if (prevRelativeTarget && boxEquals(this.relativeTarget, prevRelativeTarget)) {
            this.isProjectionDirty = false;
          }
          if (!prevRelativeTarget)
            prevRelativeTarget = createBox();
          copyBoxInto(prevRelativeTarget, this.relativeTarget);
        }
        if (isSharedLayoutAnimation) {
          this.animationValues = mixedValues;
          mixValues(mixedValues, snapshotLatestValues, this.latestValues, progress2, shouldCrossfadeOpacity, isOnlyMember);
        }
        if (point && point.rotate !== void 0) {
          if (!this.animationValues)
            this.animationValues = mixedValues;
          this.animationValues.pathRotation = point.rotate;
        }
        this.root.scheduleUpdateProjection();
        this.scheduleRender();
        this.animationProgress = progress2;
      };
      this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(options) {
      this.notifyListeners("animationStart");
      this.currentAnimation?.stop();
      this.resumingFrom?.currentAnimation?.stop();
      if (this.pendingAnimation) {
        cancelFrame(this.pendingAnimation);
        this.pendingAnimation = void 0;
      }
      this.pendingAnimation = frame.update(() => {
        globalProjectionState.hasAnimatedSinceResize = true;
        this.motionValue || (this.motionValue = motionValue(0));
        this.motionValue.jump(0, false);
        this.currentAnimation = animateSingleValue(this.motionValue, [0, 1e3], {
          ...options,
          velocity: 0,
          isSync: true,
          onUpdate: (latest) => {
            this.mixTargetDelta(latest);
            options.onUpdate && options.onUpdate(latest);
          },
          onStop: () => {
          },
          onComplete: () => {
            options.onComplete && options.onComplete();
            this.completeAnimation();
          }
        });
        if (this.resumingFrom) {
          this.resumingFrom.currentAnimation = this.currentAnimation;
        }
        this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      if (this.resumingFrom) {
        this.resumingFrom.currentAnimation = void 0;
        this.resumingFrom.preserveOpacity = void 0;
      }
      const stack = this.getStack();
      stack && stack.exitAnimationComplete();
      this.resumingFrom = this.currentAnimation = this.animationValues = void 0;
      this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      if (this.currentAnimation) {
        this.mixTargetDelta && this.mixTargetDelta(animationTarget);
        this.currentAnimation.stop();
      }
      this.completeAnimation();
    }
    applyTransformsToTarget() {
      const lead = this.getLead();
      let { targetWithTransforms, target, layout: layout2, latestValues } = lead;
      if (!targetWithTransforms || !target || !layout2)
        return;
      if (this !== lead && this.layout && layout2 && shouldAnimatePositionOnly(this.options.animationType, this.layout.layoutBox, layout2.layoutBox)) {
        target = this.target || createBox();
        const xLength = calcLength(this.layout.layoutBox.x);
        target.x.min = lead.target.x.min;
        target.x.max = target.x.min + xLength;
        const yLength = calcLength(this.layout.layoutBox.y);
        target.y.min = lead.target.y.min;
        target.y.max = target.y.min + yLength;
      }
      copyBoxInto(targetWithTransforms, target);
      transformBox(targetWithTransforms, latestValues);
      calcBoxDelta(this.projectionDeltaWithTransform, this.layoutCorrected, targetWithTransforms, latestValues);
    }
    registerSharedNode(layoutId, node) {
      if (!this.sharedNodes.has(layoutId)) {
        this.sharedNodes.set(layoutId, new NodeStack());
      }
      const stack = this.sharedNodes.get(layoutId);
      stack.add(node);
      const config = node.options.initialPromotionConfig;
      node.promote({
        transition: config ? config.transition : void 0,
        preserveFollowOpacity: config && config.shouldPreserveFollowOpacity ? config.shouldPreserveFollowOpacity(node) : void 0
      });
    }
    isLead() {
      const stack = this.getStack();
      return stack ? stack.lead === this : true;
    }
    getLead() {
      const { layoutId } = this.options;
      return layoutId ? this.getStack()?.lead || this : this;
    }
    getPrevLead() {
      const { layoutId } = this.options;
      return layoutId ? this.getStack()?.prevLead : void 0;
    }
    getStack() {
      const { layoutId } = this.options;
      if (layoutId)
        return this.root.sharedNodes.get(layoutId);
    }
    promote({ needsReset, transition, preserveFollowOpacity } = {}) {
      const stack = this.getStack();
      if (stack)
        stack.promote(this, preserveFollowOpacity);
      if (needsReset) {
        this.projectionDelta = void 0;
        this.needsReset = true;
      }
      if (transition)
        this.setOptions({ transition });
    }
    relegate() {
      const stack = this.getStack();
      if (stack) {
        return stack.relegate(this);
      } else {
        return false;
      }
    }
    resetSkewAndRotation() {
      const { visualElement } = this.options;
      if (!visualElement)
        return;
      let hasDistortingTransform = false;
      const { latestValues } = visualElement;
      if (latestValues.z || latestValues.rotate || latestValues.rotateX || latestValues.rotateY || latestValues.rotateZ || latestValues.skewX || latestValues.skewY) {
        hasDistortingTransform = true;
      }
      if (!hasDistortingTransform)
        return;
      const resetValues = {};
      if (latestValues.z) {
        resetDistortingTransform("z", visualElement, resetValues, this.animationValues);
      }
      for (let i = 0; i < transformAxes.length; i++) {
        resetDistortingTransform(`rotate${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
        resetDistortingTransform(`skew${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
      }
      visualElement.render();
      for (const key in resetValues) {
        visualElement.setStaticValue(key, resetValues[key]);
        if (this.animationValues) {
          this.animationValues[key] = resetValues[key];
        }
      }
      visualElement.scheduleRender();
    }
    applyProjectionStyles(targetStyle, styleProp) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        targetStyle.visibility = "hidden";
        return;
      }
      const transformTemplate = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = false;
        targetStyle.visibility = "";
        targetStyle.opacity = "";
        targetStyle.pointerEvents = resolveMotionValue(styleProp?.pointerEvents) || "";
        targetStyle.transform = transformTemplate ? transformTemplate(this.latestValues, "") : "none";
        return;
      }
      const lead = this.getLead();
      if (!this.projectionDelta || !this.layout || !lead.target) {
        if (this.options.layoutId) {
          targetStyle.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1;
          targetStyle.pointerEvents = resolveMotionValue(styleProp?.pointerEvents) || "";
        }
        if (this.hasProjected && !hasTransform(this.latestValues)) {
          targetStyle.transform = transformTemplate ? transformTemplate({}, "") : "none";
          this.hasProjected = false;
        }
        return;
      }
      targetStyle.visibility = "";
      const valuesToRender = lead.animationValues || lead.latestValues;
      this.applyTransformsToTarget();
      let transform2 = buildProjectionTransform(this.projectionDeltaWithTransform, this.treeScale, valuesToRender);
      if (transformTemplate) {
        transform2 = transformTemplate(valuesToRender, transform2);
      }
      targetStyle.transform = transform2;
      const { x: x2, y: y2 } = this.projectionDelta;
      targetStyle.transformOrigin = `${x2.origin * 100}% ${y2.origin * 100}% 0`;
      if (lead.animationValues) {
        targetStyle.opacity = lead === this ? valuesToRender.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : valuesToRender.opacityExit;
      } else {
        targetStyle.opacity = lead === this ? valuesToRender.opacity !== void 0 ? valuesToRender.opacity : "" : valuesToRender.opacityExit !== void 0 ? valuesToRender.opacityExit : 0;
      }
      for (const key in scaleCorrectors) {
        if (valuesToRender[key] === void 0)
          continue;
        const { correct, applyTo, isCSSVariable } = scaleCorrectors[key];
        const corrected = transform2 === "none" ? valuesToRender[key] : correct(valuesToRender[key], lead);
        if (applyTo) {
          const num = applyTo.length;
          for (let i = 0; i < num; i++) {
            targetStyle[applyTo[i]] = corrected;
          }
        } else {
          if (isCSSVariable) {
            this.options.visualElement.renderState.vars[key] = corrected;
          } else {
            targetStyle[key] = corrected;
          }
        }
      }
      if (this.options.layoutId) {
        targetStyle.pointerEvents = lead === this ? resolveMotionValue(styleProp?.pointerEvents) || "" : "none";
      }
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((node) => node.currentAnimation?.stop());
      this.root.nodes.forEach(clearMeasurements);
      this.root.sharedNodes.clear();
    }
  };
}
function updateLayout(node) {
  node.updateLayout();
}
function notifyLayoutUpdate(node) {
  const snapshot = node.resumeFrom?.snapshot || node.snapshot;
  if (node.isLead() && node.layout && snapshot && node.hasListeners("didUpdate")) {
    const { layoutBox: layout2, measuredBox: measuredLayout } = node.layout;
    const { animationType } = node.options;
    const isShared = snapshot.source !== node.layout.source;
    if (animationType === "size") {
      eachAxis((axis) => {
        const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
        const length = calcLength(axisSnapshot);
        axisSnapshot.min = layout2[axis].min;
        axisSnapshot.max = axisSnapshot.min + length;
      });
    } else if (animationType === "x" || animationType === "y") {
      const snapAxis = animationType === "x" ? "y" : "x";
      copyAxisInto(isShared ? snapshot.measuredBox[snapAxis] : snapshot.layoutBox[snapAxis], layout2[snapAxis]);
    } else if (shouldAnimatePositionOnly(animationType, snapshot.layoutBox, layout2)) {
      eachAxis((axis) => {
        const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
        const length = calcLength(layout2[axis]);
        axisSnapshot.max = axisSnapshot.min + length;
        if (node.relativeTarget && !node.currentAnimation) {
          node.isProjectionDirty = true;
          node.relativeTarget[axis].max = node.relativeTarget[axis].min + length;
        }
      });
    }
    const layoutDelta = createDelta();
    calcBoxDelta(layoutDelta, layout2, snapshot.layoutBox);
    const visualDelta = createDelta();
    if (isShared) {
      calcBoxDelta(visualDelta, node.applyTransform(measuredLayout, true), snapshot.measuredBox);
    } else {
      calcBoxDelta(visualDelta, layout2, snapshot.layoutBox);
    }
    const hasLayoutChanged = !isDeltaZero(layoutDelta);
    let hasRelativeLayoutChanged = false;
    if (!node.resumeFrom) {
      const relativeParent = node.getClosestProjectingParent();
      if (relativeParent && !relativeParent.resumeFrom) {
        const { snapshot: parentSnapshot, layout: parentLayout } = relativeParent;
        if (parentSnapshot && parentLayout) {
          const anchor = node.options.layoutAnchor || void 0;
          const relativeSnapshot = createBox();
          calcRelativePosition(relativeSnapshot, snapshot.layoutBox, parentSnapshot.layoutBox, anchor);
          const relativeLayout = createBox();
          calcRelativePosition(relativeLayout, layout2, parentLayout.layoutBox, anchor);
          if (!boxEqualsRounded(relativeSnapshot, relativeLayout)) {
            hasRelativeLayoutChanged = true;
          }
          if (relativeParent.options.layoutRoot) {
            node.relativeTarget = relativeLayout;
            node.relativeTargetOrigin = relativeSnapshot;
            node.relativeParent = relativeParent;
          }
        }
      }
    }
    node.notifyListeners("didUpdate", {
      layout: layout2,
      snapshot,
      delta: visualDelta,
      layoutDelta,
      hasLayoutChanged,
      hasRelativeLayoutChanged
    });
  } else if (node.isLead()) {
    const { onExitComplete } = node.options;
    onExitComplete && onExitComplete();
  }
  node.options.transition = void 0;
}
function propagateDirtyNodes(node) {
  if (!node.parent)
    return;
  if (!node.isProjecting()) {
    node.isProjectionDirty = node.parent.isProjectionDirty;
  }
  node.isSharedProjectionDirty || (node.isSharedProjectionDirty = Boolean(node.isProjectionDirty || node.parent.isProjectionDirty || node.parent.isSharedProjectionDirty));
  node.isTransformDirty || (node.isTransformDirty = node.parent.isTransformDirty);
}
function cleanDirtyNodes(node) {
  node.isProjectionDirty = node.isSharedProjectionDirty = node.isTransformDirty = false;
}
function clearSnapshot(node) {
  node.clearSnapshot();
}
function clearMeasurements(node) {
  node.clearMeasurements();
}
function forceLayoutMeasure(node) {
  node.isLayoutDirty = true;
  node.updateLayout();
}
function clearIsLayoutDirty(node) {
  node.isLayoutDirty = false;
}
function ensureDraggedNodesSnapshotted(node) {
  if (node.isAnimationBlocked && node.layout && !node.isLayoutDirty) {
    node.snapshot = node.layout;
    node.isLayoutDirty = true;
  }
}
function resetTransformStyle(node) {
  const { visualElement } = node.options;
  if (visualElement && visualElement.getProps().onBeforeLayoutMeasure) {
    visualElement.notify("BeforeLayoutMeasure");
  }
  node.resetTransform();
}
function finishAnimation(node) {
  node.finishAnimation();
  node.targetDelta = node.relativeTarget = node.target = void 0;
  node.isProjectionDirty = true;
}
function resolveTargetDelta(node) {
  node.resolveTargetDelta();
}
function calcProjection(node) {
  node.calcProjection();
}
function resetSkewAndRotation(node) {
  node.resetSkewAndRotation();
}
function removeLeadSnapshots(stack) {
  stack.removeLeadSnapshot();
}
function mixAxisDeltaLinear(output, delta, p2) {
  output.translate = mixNumber$1(delta.translate, 0, p2);
  output.scale = mixNumber$1(delta.scale, 1, p2);
  output.origin = delta.origin;
  output.originPoint = delta.originPoint;
}
function mixAxis(output, from, to, p2) {
  output.min = mixNumber$1(from.min, to.min, p2);
  output.max = mixNumber$1(from.max, to.max, p2);
}
function mixBox(output, from, to, p2) {
  mixAxis(output.x, from.x, to.x, p2);
  mixAxis(output.y, from.y, to.y, p2);
}
function hasOpacityCrossfade(node) {
  return node.animationValues && node.animationValues.opacityExit !== void 0;
}
const defaultLayoutTransition = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
};
const userAgentContains = (string) => typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(string);
const roundPoint = userAgentContains("applewebkit/") && !userAgentContains("chrome/") ? Math.round : noop;
function roundAxis(axis) {
  axis.min = roundPoint(axis.min);
  axis.max = roundPoint(axis.max);
}
function roundBox(box) {
  roundAxis(box.x);
  roundAxis(box.y);
}
function shouldAnimatePositionOnly(animationType, snapshot, layout2) {
  return animationType === "position" || animationType === "preserve-aspect" && !isNear(aspectRatio(snapshot), aspectRatio(layout2), 0.2);
}
function checkNodeWasScrollRoot(node) {
  return node !== node.root && node.scroll?.wasRoot;
}
const DocumentProjectionNode = createProjectionNode$1({
  attachResizeListener: (ref, notify) => addDomEvent(ref, "resize", notify),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
    y: document.documentElement.scrollTop || document.body?.scrollTop || 0
  }),
  checkIsScrollRoot: () => true
});
const rootProjectionNode = {
  current: void 0
};
const HTMLProjectionNode = createProjectionNode$1({
  measureScroll: (instance) => ({
    x: instance.scrollLeft,
    y: instance.scrollTop
  }),
  defaultParent: () => {
    if (!rootProjectionNode.current) {
      const documentNode = new DocumentProjectionNode({});
      documentNode.mount(window);
      documentNode.setOptions({ layoutScroll: true });
      rootProjectionNode.current = documentNode;
    }
    return rootProjectionNode.current;
  },
  resetTransform: (instance, value) => {
    instance.style.transform = value !== void 0 ? value : "none";
  },
  checkIsScrollRoot: (instance) => Boolean(window.getComputedStyle(instance).position === "fixed")
});
const MotionConfigContext = reactExports.createContext({
  transformPagePoint: (p2) => p2,
  isStatic: false,
  reducedMotion: "never"
});
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
      size.direction = computedStyle.direction;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  const id2 = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    direction: "ltr"
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = children.props?.ref ?? children?.ref;
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom, direction } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const isRTL = direction === "rtl";
    const x2 = anchorX === "left" ? isRTL ? `right: ${right}` : `left: ${left}` : isRTL ? `left: ${left}` : `right: ${right}`;
    const y2 = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id2;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id2}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x2}px !important;
            ${y2}px !important;
          }
        `);
    }
    return () => {
      ref.current?.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id2 = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id: id2,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
function usePresence(subscribe = true) {
  const context = reactExports.useContext(PresenceContext);
  if (context === null)
    return [true, null];
  const { isPresent, onExitComplete, register } = context;
  const id2 = reactExports.useId();
  reactExports.useEffect(() => {
    if (subscribe) {
      return register(id2);
    }
  }, [subscribe]);
  const safeToRemove = reactExports.useCallback(() => subscribe && onExitComplete && onExitComplete(id2), [id2, onExitComplete, subscribe]);
  return !isPresent && onExitComplete ? [false, safeToRemove] : [true];
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender?.();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && safeToRemove?.();
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
const LazyContext = reactExports.createContext({ strict: false });
const featureProps = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
};
let isInitialized = false;
function initFeatureDefinitions() {
  if (isInitialized)
    return;
  const initialFeatureDefinitions = {};
  for (const key in featureProps) {
    initialFeatureDefinitions[key] = {
      isEnabled: (props) => featureProps[key].some((name) => !!props[name])
    };
  }
  setFeatureDefinitions(initialFeatureDefinitions);
  isInitialized = true;
}
function getInitializedFeatureDefinitions() {
  initFeatureDefinitions();
  return getFeatureDefinitions();
}
function loadFeatures(features) {
  const featureDefinitions2 = getInitializedFeatureDefinitions();
  for (const key in features) {
    featureDefinitions2[key] = {
      ...featureDefinitions2[key],
      ...features[key]
    };
  }
  setFeatureDefinitions(featureDefinitions2);
}
const validMotionProps = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "propagate",
  "ignoreStrict",
  "viewport"
]);
function isValidMotionProp(key) {
  return key.startsWith("while") || key.startsWith("drag") && key !== "draggable" || key.startsWith("layout") || key.startsWith("onTap") || key.startsWith("onPan") || key.startsWith("onLayout") || validMotionProps.has(key);
}
let shouldForward = (key) => !isValidMotionProp(key);
function loadExternalIsValidProp(isValidProp) {
  if (typeof isValidProp !== "function")
    return;
  shouldForward = (key) => key.startsWith("on") ? !isValidMotionProp(key) : isValidProp(key);
}
try {
  const emotionPkg = "@emotion/is-prop-valid";
  loadExternalIsValidProp(require(emotionPkg).default);
} catch {
}
function filterProps(props, isDom, forwardMotionProps) {
  const filteredProps = {};
  for (const key in props) {
    if (key === "values" && typeof props.values === "object")
      continue;
    if (isMotionValue(props[key]))
      continue;
    if (shouldForward(key) || forwardMotionProps === true && isValidMotionProp(key) || !isDom && !isValidMotionProp(key) || // If trying to use native HTML drag events, forward drag listeners
    props["draggable"] && key.startsWith("onDrag")) {
      filteredProps[key] = props[key];
    }
  }
  return filteredProps;
}
const MotionContext = /* @__PURE__ */ reactExports.createContext({});
function getCurrentTreeVariants(props, context) {
  if (isControllingVariants(props)) {
    const { initial, animate } = props;
    return {
      initial: initial === false || isVariantLabel(initial) ? initial : void 0,
      animate: isVariantLabel(animate) ? animate : void 0
    };
  }
  return props.inherit !== false ? context : {};
}
function useCreateMotionContext(props) {
  const { initial, animate } = getCurrentTreeVariants(props, reactExports.useContext(MotionContext));
  return reactExports.useMemo(() => ({ initial, animate }), [variantLabelsAsDependency(initial), variantLabelsAsDependency(animate)]);
}
function variantLabelsAsDependency(prop) {
  return Array.isArray(prop) ? prop.join(" ") : prop;
}
const createHtmlRenderState = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function copyRawValuesOnly(target, source, props) {
  for (const key in source) {
    if (!isMotionValue(source[key]) && !isForcedMotionValue(key, props)) {
      target[key] = source[key];
    }
  }
}
function useInitialMotionValues({ transformTemplate }, visualState) {
  return reactExports.useMemo(() => {
    const state = createHtmlRenderState();
    buildHTMLStyles(state, visualState, transformTemplate);
    return Object.assign({}, state.vars, state.style);
  }, [visualState]);
}
function useStyle(props, visualState) {
  const styleProp = props.style || {};
  const style = {};
  copyRawValuesOnly(style, styleProp, props);
  Object.assign(style, useInitialMotionValues(props, visualState));
  return style;
}
function useHTMLProps(props, visualState) {
  const htmlProps = {};
  const style = useStyle(props, visualState);
  if (props.drag && props.dragListener !== false) {
    htmlProps.draggable = false;
    style.userSelect = style.WebkitUserSelect = style.WebkitTouchCallout = "none";
    style.touchAction = props.drag === true ? "none" : `pan-${props.drag === "x" ? "y" : "x"}`;
  }
  if (props.tabIndex === void 0 && (props.onTap || props.onTapStart || props.whileTap)) {
    htmlProps.tabIndex = 0;
  }
  htmlProps.style = style;
  return htmlProps;
}
const createSvgRenderState = () => ({
  ...createHtmlRenderState(),
  attrs: {}
});
function useSVGProps(props, visualState, _isStatic, Component) {
  const visualProps = reactExports.useMemo(() => {
    const state = createSvgRenderState();
    buildSVGAttrs(state, visualState, isSVGTag(Component), props.transformTemplate, props.style);
    return {
      ...state.attrs,
      style: { ...state.style }
    };
  }, [visualState]);
  if (props.style) {
    const rawStyles = {};
    copyRawValuesOnly(rawStyles, props.style, props);
    visualProps.style = { ...rawStyles, ...visualProps.style };
  }
  return visualProps;
}
const lowercaseSVGElements = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function isSVGComponent(Component) {
  if (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof Component !== "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    Component.includes("-")
  ) {
    return false;
  } else if (
    /**
     * If it's in our list of lowercase SVG tags, it's an SVG component
     */
    lowercaseSVGElements.indexOf(Component) > -1 || /**
     * If it contains a capital letter, it's an SVG component
     */
    /[A-Z]/u.test(Component)
  ) {
    return true;
  }
  return false;
}
function useRender(Component, props, ref, { latestValues }, isStatic, forwardMotionProps = false, isSVG) {
  const useVisualProps = isSVG ?? isSVGComponent(Component) ? useSVGProps : useHTMLProps;
  const visualProps = useVisualProps(props, latestValues, isStatic, Component);
  const filteredProps = filterProps(props, typeof Component === "string", forwardMotionProps);
  const elementProps = Component !== reactExports.Fragment ? { ...filteredProps, ...visualProps, ref } : {};
  const { children } = props;
  const renderedChildren = reactExports.useMemo(() => isMotionValue(children) ? children.get() : children, [children]);
  return reactExports.createElement(Component, {
    ...elementProps,
    children: renderedChildren
  });
}
function makeState({ scrapeMotionValuesFromProps: scrapeMotionValuesFromProps2, createRenderState }, props, context, presenceContext) {
  const state = {
    latestValues: makeLatestValues(props, context, presenceContext, scrapeMotionValuesFromProps2),
    renderState: createRenderState()
  };
  return state;
}
function makeLatestValues(props, context, presenceContext, scrapeMotionValues) {
  const values = {};
  const motionValues = scrapeMotionValues(props, {});
  for (const key in motionValues) {
    values[key] = resolveMotionValue(motionValues[key]);
  }
  let { initial, animate } = props;
  const isControllingVariants$1 = isControllingVariants(props);
  const isVariantNode$1 = isVariantNode(props);
  if (context && isVariantNode$1 && !isControllingVariants$1 && props.inherit !== false) {
    if (initial === void 0)
      initial = context.initial;
    if (animate === void 0)
      animate = context.animate;
  }
  let isInitialAnimationBlocked = presenceContext ? presenceContext.initial === false : false;
  isInitialAnimationBlocked = isInitialAnimationBlocked || initial === false;
  const variantToSet = isInitialAnimationBlocked ? animate : initial;
  if (variantToSet && typeof variantToSet !== "boolean" && !isAnimationControls(variantToSet)) {
    const list = Array.isArray(variantToSet) ? variantToSet : [variantToSet];
    for (let i = 0; i < list.length; i++) {
      const resolved = resolveVariantFromProps(props, list[i]);
      if (resolved) {
        const { transitionEnd, transition, ...target } = resolved;
        for (const key in target) {
          let valueTarget = target[key];
          if (Array.isArray(valueTarget)) {
            const index = isInitialAnimationBlocked ? valueTarget.length - 1 : 0;
            valueTarget = valueTarget[index];
          }
          if (valueTarget !== null) {
            values[key] = valueTarget;
          }
        }
        for (const key in transitionEnd) {
          values[key] = transitionEnd[key];
        }
      }
    }
  }
  return values;
}
const makeUseVisualState = (config) => (props, isStatic) => {
  const context = reactExports.useContext(MotionContext);
  const presenceContext = reactExports.useContext(PresenceContext);
  const make = () => makeState(config, props, context, presenceContext);
  return isStatic ? make() : useConstant(make);
};
const useHTMLVisualState = /* @__PURE__ */ makeUseVisualState({
  scrapeMotionValuesFromProps: scrapeMotionValuesFromProps$1,
  createRenderState: createHtmlRenderState
});
const useSVGVisualState = /* @__PURE__ */ makeUseVisualState({
  scrapeMotionValuesFromProps,
  createRenderState: createSvgRenderState
});
const motionComponentSymbol = Symbol.for("motionComponentSymbol");
function useMotionRef(visualState, visualElement, externalRef) {
  const externalRefContainer = reactExports.useRef(externalRef);
  reactExports.useInsertionEffect(() => {
    externalRefContainer.current = externalRef;
  });
  const refCleanup = reactExports.useRef(null);
  return reactExports.useCallback((instance) => {
    if (instance) {
      visualState.onMount?.(instance);
    }
    if (visualElement) {
      instance ? visualElement.mount(instance) : visualElement.unmount();
    }
    const ref = externalRefContainer.current;
    if (typeof ref === "function") {
      if (instance) {
        const cleanup = ref(instance);
        if (typeof cleanup === "function") {
          refCleanup.current = cleanup;
        }
      } else if (refCleanup.current) {
        refCleanup.current();
        refCleanup.current = null;
      } else {
        ref(instance);
      }
    } else if (ref) {
      ref.current = instance;
    }
  }, [visualElement]);
}
const SwitchLayoutGroupContext = reactExports.createContext({});
function isRefObject(ref) {
  return ref && typeof ref === "object" && Object.prototype.hasOwnProperty.call(ref, "current");
}
function useVisualElement(Component, visualState, props, createVisualElement, ProjectionNodeConstructor, isSVG) {
  const { visualElement: parent } = reactExports.useContext(MotionContext);
  const lazyContext = reactExports.useContext(LazyContext);
  const presenceContext = reactExports.useContext(PresenceContext);
  const motionConfig = reactExports.useContext(MotionConfigContext);
  const reducedMotionConfig = motionConfig.reducedMotion;
  const skipAnimations = motionConfig.skipAnimations;
  const visualElementRef = reactExports.useRef(null);
  const hasMountedOnce = reactExports.useRef(false);
  createVisualElement = createVisualElement || lazyContext.renderer;
  if (!visualElementRef.current && createVisualElement) {
    visualElementRef.current = createVisualElement(Component, {
      visualState,
      parent,
      props,
      presenceContext,
      blockInitialAnimation: presenceContext ? presenceContext.initial === false : false,
      reducedMotionConfig,
      skipAnimations,
      isSVG
    });
    if (hasMountedOnce.current && visualElementRef.current) {
      visualElementRef.current.manuallyAnimateOnMount = true;
    }
  }
  const visualElement = visualElementRef.current;
  const initialLayoutGroupConfig = reactExports.useContext(SwitchLayoutGroupContext);
  if (visualElement && !visualElement.projection && ProjectionNodeConstructor && (visualElement.type === "html" || visualElement.type === "svg")) {
    createProjectionNode(visualElementRef.current, props, ProjectionNodeConstructor, initialLayoutGroupConfig);
  }
  const isMounted = reactExports.useRef(false);
  reactExports.useInsertionEffect(() => {
    if (visualElement && isMounted.current) {
      visualElement.update(props, presenceContext);
    }
  });
  const optimisedAppearId = props[optimizedAppearDataAttribute];
  const wantsHandoff = reactExports.useRef(Boolean(optimisedAppearId) && typeof window !== "undefined" && !window.MotionHandoffIsComplete?.(optimisedAppearId) && window.MotionHasOptimisedAnimation?.(optimisedAppearId));
  useIsomorphicLayoutEffect(() => {
    hasMountedOnce.current = true;
    if (!visualElement)
      return;
    isMounted.current = true;
    window.MotionIsMounted = true;
    visualElement.updateFeatures();
    visualElement.scheduleRenderMicrotask();
    if (wantsHandoff.current && visualElement.animationState) {
      visualElement.animationState.animateChanges();
    }
  });
  reactExports.useEffect(() => {
    if (!visualElement)
      return;
    if (!wantsHandoff.current && visualElement.animationState) {
      visualElement.animationState.animateChanges();
    }
    if (wantsHandoff.current) {
      queueMicrotask(() => {
        window.MotionHandoffMarkAsComplete?.(optimisedAppearId);
      });
      wantsHandoff.current = false;
    }
    visualElement.enteringChildren = void 0;
  });
  return visualElement;
}
function createProjectionNode(visualElement, props, ProjectionNodeConstructor, initialPromotionConfig) {
  const { layoutId, layout: layout2, drag: drag2, dragConstraints, layoutScroll, layoutRoot, layoutAnchor, layoutCrossfade } = props;
  visualElement.projection = new ProjectionNodeConstructor(visualElement.latestValues, props["data-framer-portal-id"] ? void 0 : getClosestProjectingNode(visualElement.parent));
  visualElement.projection.setOptions({
    layoutId,
    layout: layout2,
    alwaysMeasureLayout: Boolean(drag2) || dragConstraints && isRefObject(dragConstraints),
    visualElement,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof layout2 === "string" ? layout2 : "both",
    initialPromotionConfig,
    crossfade: layoutCrossfade,
    layoutScroll,
    layoutRoot,
    layoutAnchor
  });
}
function getClosestProjectingNode(visualElement) {
  if (!visualElement)
    return void 0;
  return visualElement.options.allowProjection !== false ? visualElement.projection : getClosestProjectingNode(visualElement.parent);
}
function createMotionComponent(Component, { forwardMotionProps = false, type } = {}, preloadedFeatures, createVisualElement) {
  preloadedFeatures && loadFeatures(preloadedFeatures);
  const isSVG = type ? type === "svg" : isSVGComponent(Component);
  const useVisualState = isSVG ? useSVGVisualState : useHTMLVisualState;
  function MotionDOMComponent(props, externalRef) {
    let MeasureLayout2;
    const configAndProps = {
      ...reactExports.useContext(MotionConfigContext),
      ...props,
      layoutId: useLayoutId(props)
    };
    const { isStatic } = configAndProps;
    const context = useCreateMotionContext(props);
    const visualState = useVisualState(props, isStatic);
    if (!isStatic && typeof window !== "undefined") {
      useStrictMode();
      const layoutProjection = getProjectionFunctionality(configAndProps);
      MeasureLayout2 = layoutProjection.MeasureLayout;
      context.visualElement = useVisualElement(Component, visualState, configAndProps, createVisualElement, layoutProjection.ProjectionNode, isSVG);
    }
    return jsxRuntimeExports.jsxs(MotionContext.Provider, { value: context, children: [MeasureLayout2 && context.visualElement ? jsxRuntimeExports.jsx(MeasureLayout2, { visualElement: context.visualElement, ...configAndProps }) : null, useRender(Component, props, useMotionRef(visualState, context.visualElement, externalRef), visualState, isStatic, forwardMotionProps, isSVG)] });
  }
  MotionDOMComponent.displayName = `motion.${typeof Component === "string" ? Component : `create(${Component.displayName ?? Component.name ?? ""})`}`;
  const ForwardRefMotionComponent = reactExports.forwardRef(MotionDOMComponent);
  ForwardRefMotionComponent[motionComponentSymbol] = Component;
  return ForwardRefMotionComponent;
}
function useLayoutId({ layoutId }) {
  const layoutGroupId = reactExports.useContext(LayoutGroupContext).id;
  return layoutGroupId && layoutId !== void 0 ? layoutGroupId + "-" + layoutId : layoutId;
}
function useStrictMode(configAndProps, preloadedFeatures) {
  reactExports.useContext(LazyContext).strict;
}
function getProjectionFunctionality(props) {
  const featureDefinitions2 = getInitializedFeatureDefinitions();
  const { drag: drag2, layout: layout2 } = featureDefinitions2;
  if (!drag2 && !layout2)
    return {};
  const combined = { ...drag2, ...layout2 };
  return {
    MeasureLayout: drag2?.isEnabled(props) || layout2?.isEnabled(props) ? combined.MeasureLayout : void 0,
    ProjectionNode: combined.ProjectionNode
  };
}
function createMotionProxy(preloadedFeatures, createVisualElement) {
  if (typeof Proxy === "undefined") {
    return createMotionComponent;
  }
  const componentCache = /* @__PURE__ */ new Map();
  const factory = (Component, options) => {
    return createMotionComponent(Component, options, preloadedFeatures, createVisualElement);
  };
  const deprecatedFactoryFunction = (Component, options) => {
    return factory(Component, options);
  };
  return new Proxy(deprecatedFactoryFunction, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (_target, key) => {
      if (key === "create")
        return factory;
      if (!componentCache.has(key)) {
        componentCache.set(key, createMotionComponent(key, void 0, preloadedFeatures, createVisualElement));
      }
      return componentCache.get(key);
    }
  });
}
const createDomVisualElement = (Component, options) => {
  const isSVG = options.isSVG ?? isSVGComponent(Component);
  return isSVG ? new SVGVisualElement(options) : new HTMLVisualElement(options, {
    allowProjection: Component !== reactExports.Fragment
  });
};
class AnimationFeature extends Feature {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(node) {
    super(node);
    node.animationState || (node.animationState = createAnimationState(node));
  }
  updateAnimationControlsSubscription() {
    const { animate } = this.node.getProps();
    if (isAnimationControls(animate)) {
      this.unmountControls = animate.subscribe(this.node);
    }
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate } = this.node.getProps();
    const { animate: prevAnimate } = this.node.prevProps || {};
    if (animate !== prevAnimate) {
      this.updateAnimationControlsSubscription();
    }
  }
  unmount() {
    this.node.animationState.reset();
    this.unmountControls?.();
  }
}
let id = 0;
class ExitAnimationFeature extends Feature {
  constructor() {
    super(...arguments);
    this.id = id++;
    this.isExitComplete = false;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent, onExitComplete } = this.node.presenceContext;
    const { isPresent: prevIsPresent } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || isPresent === prevIsPresent) {
      return;
    }
    if (isPresent && prevIsPresent === false) {
      if (this.isExitComplete) {
        const { initial, custom } = this.node.getProps();
        if (typeof initial === "string" || typeof initial === "object" && initial !== null && !Array.isArray(initial)) {
          const resolved = resolveVariant(this.node, initial, custom);
          if (resolved) {
            const { transition, transitionEnd, ...target } = resolved;
            for (const key in target) {
              this.node.getValue(key)?.jump(target[key]);
            }
          }
        }
        this.node.animationState.reset();
        this.node.animationState.animateChanges();
      } else {
        this.node.animationState.setActive("exit", false);
      }
      this.isExitComplete = false;
      return;
    }
    const exitAnimation = this.node.animationState.setActive("exit", !isPresent);
    if (onExitComplete && !isPresent) {
      exitAnimation.then(() => {
        this.isExitComplete = true;
        onExitComplete(this.id);
      });
    }
  }
  mount() {
    const { register, onExitComplete } = this.node.presenceContext || {};
    if (onExitComplete) {
      onExitComplete(this.id);
    }
    if (register) {
      this.unmount = register(this.id);
    }
  }
  unmount() {
  }
}
const animations = {
  animation: {
    Feature: AnimationFeature
  },
  exit: {
    Feature: ExitAnimationFeature
  }
};
function extractEventInfo(event) {
  return {
    point: {
      x: event.pageX,
      y: event.pageY
    }
  };
}
const addPointerInfo = (handler) => (event) => isPrimaryPointer(event) && handler(event, extractEventInfo(event));
function addPointerEvent(target, eventName, handler, options) {
  return addDomEvent(target, eventName, addPointerInfo(handler), options);
}
const getContextWindow = ({ current }) => {
  return current ? current.ownerDocument.defaultView : null;
};
const distance = (a, b) => Math.abs(a - b);
function distance2D(a, b) {
  const xDelta = distance(a.x, b.x);
  const yDelta = distance(a.y, b.y);
  return Math.sqrt(xDelta ** 2 + yDelta ** 2);
}
const overflowStyles$1 = /* @__PURE__ */ new Set(["auto", "scroll"]);
class PanSession {
  constructor(event, handlers, { transformPagePoint, contextWindow = window, dragSnapToOrigin = false, distanceThreshold = 3, element } = {}) {
    this.startEvent = null;
    this.lastMoveEvent = null;
    this.lastMoveEventInfo = null;
    this.lastRawMoveEventInfo = null;
    this.handlers = {};
    this.contextWindow = window;
    this.scrollPositions = /* @__PURE__ */ new Map();
    this.removeScrollListeners = null;
    this.onElementScroll = (event2) => {
      this.handleScroll(event2.target);
    };
    this.onWindowScroll = () => {
      this.handleScroll(window);
    };
    this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      if (this.lastRawMoveEventInfo) {
        this.lastMoveEventInfo = transformPoint(this.lastRawMoveEventInfo, this.transformPagePoint);
      }
      const info2 = getPanInfo(this.lastMoveEventInfo, this.history);
      const isPanStarted = this.startEvent !== null;
      const isDistancePastThreshold = distance2D(info2.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!isPanStarted && !isDistancePastThreshold)
        return;
      const { point: point2 } = info2;
      const { timestamp: timestamp2 } = frameData;
      this.history.push({ ...point2, timestamp: timestamp2 });
      const { onStart, onMove } = this.handlers;
      if (!isPanStarted) {
        onStart && onStart(this.lastMoveEvent, info2);
        this.startEvent = this.lastMoveEvent;
      }
      onMove && onMove(this.lastMoveEvent, info2);
    };
    this.handlePointerMove = (event2, info2) => {
      this.lastMoveEvent = event2;
      this.lastRawMoveEventInfo = info2;
      this.lastMoveEventInfo = transformPoint(info2, this.transformPagePoint);
      frame.update(this.updatePoint, true);
    };
    this.handlePointerUp = (event2, info2) => {
      this.end();
      const { onEnd, onSessionEnd, resumeAnimation } = this.handlers;
      if (this.dragSnapToOrigin || !this.startEvent) {
        resumeAnimation && resumeAnimation();
      }
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const panInfo = getPanInfo(event2.type === "pointercancel" ? this.lastMoveEventInfo : transformPoint(info2, this.transformPagePoint), this.history);
      if (this.startEvent && onEnd) {
        onEnd(event2, panInfo);
      }
      onSessionEnd && onSessionEnd(event2, panInfo);
    };
    if (!isPrimaryPointer(event))
      return;
    this.dragSnapToOrigin = dragSnapToOrigin;
    this.handlers = handlers;
    this.transformPagePoint = transformPagePoint;
    this.distanceThreshold = distanceThreshold;
    this.contextWindow = contextWindow || window;
    const info = extractEventInfo(event);
    const initialInfo = transformPoint(info, this.transformPagePoint);
    const { point } = initialInfo;
    const { timestamp } = frameData;
    this.history = [{ ...point, timestamp }];
    const { onSessionStart } = handlers;
    onSessionStart && onSessionStart(event, getPanInfo(initialInfo, this.history));
    this.removeListeners = pipe(addPointerEvent(this.contextWindow, "pointermove", this.handlePointerMove), addPointerEvent(this.contextWindow, "pointerup", this.handlePointerUp), addPointerEvent(this.contextWindow, "pointercancel", this.handlePointerUp));
    if (element) {
      this.startScrollTracking(element);
    }
  }
  /**
   * Start tracking scroll on ancestors and window.
   */
  startScrollTracking(element) {
    let current = element.parentElement;
    while (current) {
      const style = getComputedStyle(current);
      if (overflowStyles$1.has(style.overflowX) || overflowStyles$1.has(style.overflowY)) {
        this.scrollPositions.set(current, {
          x: current.scrollLeft,
          y: current.scrollTop
        });
      }
      current = current.parentElement;
    }
    this.scrollPositions.set(window, {
      x: window.scrollX,
      y: window.scrollY
    });
    window.addEventListener("scroll", this.onElementScroll, {
      capture: true
    });
    window.addEventListener("scroll", this.onWindowScroll);
    this.removeScrollListeners = () => {
      window.removeEventListener("scroll", this.onElementScroll, {
        capture: true
      });
      window.removeEventListener("scroll", this.onWindowScroll);
    };
  }
  /**
   * Handle scroll compensation during drag.
   *
   * For element scroll: adjusts history origin since pageX/pageY doesn't change.
   * For window scroll: adjusts lastMoveEventInfo since pageX/pageY would change.
   */
  handleScroll(target) {
    const initial = this.scrollPositions.get(target);
    if (!initial)
      return;
    const isWindow = target === window;
    const current = isWindow ? { x: window.scrollX, y: window.scrollY } : {
      x: target.scrollLeft,
      y: target.scrollTop
    };
    const delta = { x: current.x - initial.x, y: current.y - initial.y };
    if (delta.x === 0 && delta.y === 0)
      return;
    if (isWindow) {
      if (this.lastMoveEventInfo) {
        this.lastMoveEventInfo.point.x += delta.x;
        this.lastMoveEventInfo.point.y += delta.y;
      }
    } else {
      if (this.history.length > 0) {
        this.history[0].x -= delta.x;
        this.history[0].y -= delta.y;
      }
    }
    this.scrollPositions.set(target, current);
    frame.update(this.updatePoint, true);
  }
  updateHandlers(handlers) {
    this.handlers = handlers;
  }
  end() {
    this.removeListeners && this.removeListeners();
    this.removeScrollListeners && this.removeScrollListeners();
    this.scrollPositions.clear();
    cancelFrame(this.updatePoint);
  }
}
function transformPoint(info, transformPagePoint) {
  return transformPagePoint ? { point: transformPagePoint(info.point) } : info;
}
function subtractPoint(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}
function getPanInfo({ point }, history) {
  return {
    point,
    delta: subtractPoint(point, lastDevicePoint(history)),
    offset: subtractPoint(point, startDevicePoint(history)),
    velocity: getVelocity(history, 0.1)
  };
}
function startDevicePoint(history) {
  return history[0];
}
function lastDevicePoint(history) {
  return history[history.length - 1];
}
function getVelocity(history, timeDelta) {
  if (history.length < 2) {
    return { x: 0, y: 0 };
  }
  let i = history.length - 1;
  let timestampedPoint = null;
  const lastPoint = lastDevicePoint(history);
  while (i >= 0) {
    timestampedPoint = history[i];
    if (lastPoint.timestamp - timestampedPoint.timestamp > /* @__PURE__ */ secondsToMilliseconds(timeDelta)) {
      break;
    }
    i--;
  }
  if (!timestampedPoint) {
    return { x: 0, y: 0 };
  }
  if (timestampedPoint === history[0] && history.length > 2 && lastPoint.timestamp - timestampedPoint.timestamp > /* @__PURE__ */ secondsToMilliseconds(timeDelta) * 2) {
    timestampedPoint = history[1];
  }
  const time2 = /* @__PURE__ */ millisecondsToSeconds(lastPoint.timestamp - timestampedPoint.timestamp);
  if (time2 === 0) {
    return { x: 0, y: 0 };
  }
  const currentVelocity = {
    x: (lastPoint.x - timestampedPoint.x) / time2,
    y: (lastPoint.y - timestampedPoint.y) / time2
  };
  if (currentVelocity.x === Infinity) {
    currentVelocity.x = 0;
  }
  if (currentVelocity.y === Infinity) {
    currentVelocity.y = 0;
  }
  return currentVelocity;
}
function applyConstraints(point, { min, max }, elastic) {
  if (min !== void 0 && point < min) {
    point = elastic ? mixNumber$1(min, point, elastic.min) : Math.max(point, min);
  } else if (max !== void 0 && point > max) {
    point = elastic ? mixNumber$1(max, point, elastic.max) : Math.min(point, max);
  }
  return point;
}
function calcRelativeAxisConstraints(axis, min, max) {
  return {
    min: min !== void 0 ? axis.min + min : void 0,
    max: max !== void 0 ? axis.max + max - (axis.max - axis.min) : void 0
  };
}
function calcRelativeConstraints(layoutBox, { top, left, bottom, right }) {
  return {
    x: calcRelativeAxisConstraints(layoutBox.x, left, right),
    y: calcRelativeAxisConstraints(layoutBox.y, top, bottom)
  };
}
function calcViewportAxisConstraints(layoutAxis, constraintsAxis) {
  let min = constraintsAxis.min - layoutAxis.min;
  let max = constraintsAxis.max - layoutAxis.max;
  if (constraintsAxis.max - constraintsAxis.min < layoutAxis.max - layoutAxis.min) {
    [min, max] = [max, min];
  }
  return { min, max };
}
function calcViewportConstraints(layoutBox, constraintsBox) {
  return {
    x: calcViewportAxisConstraints(layoutBox.x, constraintsBox.x),
    y: calcViewportAxisConstraints(layoutBox.y, constraintsBox.y)
  };
}
function calcOrigin(source, target) {
  let origin = 0.5;
  const sourceLength = calcLength(source);
  const targetLength = calcLength(target);
  if (targetLength > sourceLength) {
    origin = /* @__PURE__ */ progress(target.min, target.max - sourceLength, source.min);
  } else if (sourceLength > targetLength) {
    origin = /* @__PURE__ */ progress(source.min, source.max - targetLength, target.min);
  }
  return clamp(0, 1, origin);
}
function rebaseAxisConstraints(layout2, constraints) {
  const relativeConstraints = {};
  if (constraints.min !== void 0) {
    relativeConstraints.min = constraints.min - layout2.min;
  }
  if (constraints.max !== void 0) {
    relativeConstraints.max = constraints.max - layout2.min;
  }
  return relativeConstraints;
}
const defaultElastic = 0.35;
function resolveDragElastic(dragElastic = defaultElastic) {
  if (dragElastic === false) {
    dragElastic = 0;
  } else if (dragElastic === true) {
    dragElastic = defaultElastic;
  }
  return {
    x: resolveAxisElastic(dragElastic, "left", "right"),
    y: resolveAxisElastic(dragElastic, "top", "bottom")
  };
}
function resolveAxisElastic(dragElastic, minLabel, maxLabel) {
  return {
    min: resolvePointElastic(dragElastic, minLabel),
    max: resolvePointElastic(dragElastic, maxLabel)
  };
}
function resolvePointElastic(dragElastic, label) {
  return typeof dragElastic === "number" ? dragElastic : dragElastic[label] || 0;
}
const elementDragControls = /* @__PURE__ */ new WeakMap();
class VisualElementDragControls {
  constructor(visualElement) {
    this.openDragLock = null;
    this.isDragging = false;
    this.currentDirection = null;
    this.originPoint = { x: 0, y: 0 };
    this.constraints = false;
    this.hasMutatedConstraints = false;
    this.elastic = createBox();
    this.latestPointerEvent = null;
    this.latestPanInfo = null;
    this.visualElement = visualElement;
  }
  start(originEvent, { snapToCursor = false, distanceThreshold } = {}) {
    const { presenceContext } = this.visualElement;
    if (presenceContext && presenceContext.isPresent === false)
      return;
    const onSessionStart = (event) => {
      if (snapToCursor) {
        this.snapToCursor(extractEventInfo(event).point);
      }
      this.stopAnimation();
    };
    const onStart = (event, info) => {
      const { drag: drag2, dragPropagation, onDragStart } = this.getProps();
      if (drag2 && !dragPropagation) {
        if (this.openDragLock)
          this.openDragLock();
        this.openDragLock = setDragLock(drag2);
        if (!this.openDragLock)
          return;
      }
      this.latestPointerEvent = event;
      this.latestPanInfo = info;
      this.isDragging = true;
      this.currentDirection = null;
      this.resolveConstraints();
      if (this.visualElement.projection) {
        this.visualElement.projection.isAnimationBlocked = true;
        this.visualElement.projection.target = void 0;
      }
      eachAxis((axis) => {
        let current = this.getAxisMotionValue(axis).get() || 0;
        if (percent.test(current)) {
          const { projection } = this.visualElement;
          if (projection && projection.layout) {
            const measuredAxis = projection.layout.layoutBox[axis];
            if (measuredAxis) {
              const length = calcLength(measuredAxis);
              current = length * (parseFloat(current) / 100);
            }
          }
        }
        this.originPoint[axis] = current;
      });
      if (onDragStart) {
        frame.update(() => onDragStart(event, info), false, true);
      }
      addValueToWillChange(this.visualElement, "transform");
      const { animationState } = this.visualElement;
      animationState && animationState.setActive("whileDrag", true);
    };
    const onMove = (event, info) => {
      this.latestPointerEvent = event;
      this.latestPanInfo = info;
      const { dragPropagation, dragDirectionLock, onDirectionLock, onDrag } = this.getProps();
      if (!dragPropagation && !this.openDragLock)
        return;
      const { offset } = info;
      if (dragDirectionLock && this.currentDirection === null) {
        this.currentDirection = getCurrentDirection(offset);
        if (this.currentDirection !== null) {
          onDirectionLock && onDirectionLock(this.currentDirection);
        }
        return;
      }
      this.updateAxis("x", info.point, offset);
      this.updateAxis("y", info.point, offset);
      this.visualElement.render();
      if (onDrag) {
        frame.update(() => onDrag(event, info), false, true);
      }
    };
    const onSessionEnd = (event, info) => {
      this.latestPointerEvent = event;
      this.latestPanInfo = info;
      this.stop(event, info);
      this.latestPointerEvent = null;
      this.latestPanInfo = null;
    };
    const resumeAnimation = () => {
      const { dragSnapToOrigin: snap } = this.getProps();
      if (snap || this.constraints) {
        this.startAnimation({ x: 0, y: 0 });
      }
    };
    const { dragSnapToOrigin } = this.getProps();
    this.panSession = new PanSession(originEvent, {
      onSessionStart,
      onStart,
      onMove,
      onSessionEnd,
      resumeAnimation
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin,
      distanceThreshold,
      contextWindow: getContextWindow(this.visualElement),
      element: this.visualElement.current
    });
  }
  /**
   * @internal
   */
  stop(event, panInfo) {
    const finalEvent = event || this.latestPointerEvent;
    const finalPanInfo = panInfo || this.latestPanInfo;
    const isDragging2 = this.isDragging;
    this.cancel();
    if (!isDragging2 || !finalPanInfo || !finalEvent)
      return;
    const { velocity } = finalPanInfo;
    this.startAnimation(velocity);
    const { onDragEnd } = this.getProps();
    if (onDragEnd) {
      frame.postRender(() => onDragEnd(finalEvent, finalPanInfo));
    }
  }
  /**
   * @internal
   */
  cancel() {
    this.isDragging = false;
    const { projection, animationState } = this.visualElement;
    if (projection) {
      projection.isAnimationBlocked = false;
    }
    this.endPanSession();
    const { dragPropagation } = this.getProps();
    if (!dragPropagation && this.openDragLock) {
      this.openDragLock();
      this.openDragLock = null;
    }
    animationState && animationState.setActive("whileDrag", false);
  }
  /**
   * Clean up the pan session without modifying other drag state.
   * This is used during unmount to ensure event listeners are removed
   * without affecting projection animations or drag locks.
   * @internal
   */
  endPanSession() {
    this.panSession && this.panSession.end();
    this.panSession = void 0;
  }
  updateAxis(axis, _point, offset) {
    const { drag: drag2 } = this.getProps();
    if (!offset || !shouldDrag(axis, drag2, this.currentDirection))
      return;
    const axisValue = this.getAxisMotionValue(axis);
    let next = this.originPoint[axis] + offset[axis];
    if (this.constraints && this.constraints[axis]) {
      next = applyConstraints(next, this.constraints[axis], this.elastic[axis]);
    }
    axisValue.set(next);
  }
  resolveConstraints() {
    const { dragConstraints, dragElastic } = this.getProps();
    const layout2 = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(false) : this.visualElement.projection?.layout;
    const prevConstraints = this.constraints;
    if (dragConstraints && isRefObject(dragConstraints)) {
      if (!this.constraints) {
        this.constraints = this.resolveRefConstraints();
      }
    } else {
      if (dragConstraints && layout2) {
        this.constraints = calcRelativeConstraints(layout2.layoutBox, dragConstraints);
      } else {
        this.constraints = false;
      }
    }
    this.elastic = resolveDragElastic(dragElastic);
    if (prevConstraints !== this.constraints && !isRefObject(dragConstraints) && layout2 && this.constraints && !this.hasMutatedConstraints) {
      eachAxis((axis) => {
        if (this.constraints !== false && this.getAxisMotionValue(axis)) {
          this.constraints[axis] = rebaseAxisConstraints(layout2.layoutBox[axis], this.constraints[axis]);
        }
      });
    }
  }
  resolveRefConstraints() {
    const { dragConstraints: constraints, onMeasureDragConstraints } = this.getProps();
    if (!constraints || !isRefObject(constraints))
      return false;
    const constraintsElement = constraints.current;
    const { projection } = this.visualElement;
    if (!projection || !projection.layout)
      return false;
    if (projection.root) {
      projection.root.scroll = void 0;
      projection.root.updateScroll();
    }
    const constraintsBox = measurePageBox(constraintsElement, projection.root, this.visualElement.getTransformPagePoint());
    let measuredConstraints = calcViewportConstraints(projection.layout.layoutBox, constraintsBox);
    if (onMeasureDragConstraints) {
      const userConstraints = onMeasureDragConstraints(convertBoxToBoundingBox(measuredConstraints));
      this.hasMutatedConstraints = !!userConstraints;
      if (userConstraints) {
        measuredConstraints = convertBoundingBoxToBox(userConstraints);
      }
    }
    return measuredConstraints;
  }
  startAnimation(velocity) {
    const { drag: drag2, dragMomentum, dragElastic, dragTransition, dragSnapToOrigin, onDragTransitionEnd } = this.getProps();
    const constraints = this.constraints || {};
    const momentumAnimations = eachAxis((axis) => {
      if (!shouldDrag(axis, drag2, this.currentDirection)) {
        return;
      }
      let transition = constraints && constraints[axis] || {};
      if (dragSnapToOrigin === true || dragSnapToOrigin === axis)
        transition = { min: 0, max: 0 };
      const bounceStiffness = dragElastic ? 200 : 1e6;
      const bounceDamping = dragElastic ? 40 : 1e7;
      const inertia2 = {
        type: "inertia",
        velocity: dragMomentum ? velocity[axis] : 0,
        bounceStiffness,
        bounceDamping,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...dragTransition,
        ...transition
      };
      return this.startAxisValueAnimation(axis, inertia2);
    });
    return Promise.all(momentumAnimations).then(onDragTransitionEnd);
  }
  startAxisValueAnimation(axis, transition) {
    const axisValue = this.getAxisMotionValue(axis);
    addValueToWillChange(this.visualElement, axis);
    return axisValue.start(animateMotionValue(axis, axisValue, 0, transition, this.visualElement, false));
  }
  stopAnimation() {
    eachAxis((axis) => this.getAxisMotionValue(axis).stop());
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(axis) {
    const dragKey = `_drag${axis.toUpperCase()}`;
    const props = this.visualElement.getProps();
    const externalMotionValue = props[dragKey];
    return externalMotionValue ? externalMotionValue : this.visualElement.getValue(axis, this.visualElement.latestValues[axis] ?? 0);
  }
  snapToCursor(point) {
    eachAxis((axis) => {
      const { drag: drag2 } = this.getProps();
      if (!shouldDrag(axis, drag2, this.currentDirection))
        return;
      const { projection } = this.visualElement;
      const axisValue = this.getAxisMotionValue(axis);
      if (projection && projection.layout) {
        const { min, max } = projection.layout.layoutBox[axis];
        const current = axisValue.get() || 0;
        axisValue.set(point[axis] - mixNumber$1(min, max, 0.5) + current);
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: drag2, dragConstraints } = this.getProps();
    const { projection } = this.visualElement;
    if (!isRefObject(dragConstraints) || !projection || !this.constraints)
      return;
    this.stopAnimation();
    const boxProgress = { x: 0, y: 0 };
    eachAxis((axis) => {
      const axisValue = this.getAxisMotionValue(axis);
      if (axisValue && this.constraints !== false) {
        const latest = axisValue.get();
        boxProgress[axis] = calcOrigin({ min: latest, max: latest }, this.constraints[axis]);
      }
    });
    const { transformTemplate } = this.visualElement.getProps();
    this.visualElement.current.style.transform = transformTemplate ? transformTemplate({}, "") : "none";
    projection.root && projection.root.updateScroll();
    projection.updateLayout();
    this.constraints = false;
    this.resolveConstraints();
    eachAxis((axis) => {
      if (!shouldDrag(axis, drag2, null))
        return;
      const axisValue = this.getAxisMotionValue(axis);
      const { min, max } = this.constraints[axis];
      axisValue.set(mixNumber$1(min, max, boxProgress[axis]));
    });
    this.visualElement.render();
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    elementDragControls.set(this.visualElement, this);
    const element = this.visualElement.current;
    const stopPointerListener = addPointerEvent(element, "pointerdown", (event) => {
      const { drag: drag2, dragListener = true } = this.getProps();
      const target = event.target;
      const isClickingTextInputChild = target !== element && isElementTextInput(target);
      if (drag2 && dragListener && !isClickingTextInputChild) {
        this.start(event);
      }
    });
    let stopResizeObservers;
    const measureDragConstraints = () => {
      const { dragConstraints } = this.getProps();
      if (isRefObject(dragConstraints) && dragConstraints.current) {
        this.constraints = this.resolveRefConstraints();
        if (!stopResizeObservers) {
          stopResizeObservers = startResizeObservers(element, dragConstraints.current, () => this.scalePositionWithinConstraints());
        }
      }
    };
    const { projection } = this.visualElement;
    const stopMeasureLayoutListener = projection.addEventListener("measure", measureDragConstraints);
    if (projection && !projection.layout) {
      projection.root && projection.root.updateScroll();
      projection.updateLayout();
    }
    frame.read(measureDragConstraints);
    const stopResizeListener = addDomEvent(window, "resize", () => this.scalePositionWithinConstraints());
    const stopLayoutUpdateListener = projection.addEventListener("didUpdate", ({ delta, hasLayoutChanged }) => {
      if (this.isDragging && hasLayoutChanged) {
        eachAxis((axis) => {
          const motionValue2 = this.getAxisMotionValue(axis);
          if (!motionValue2)
            return;
          this.originPoint[axis] += delta[axis].translate;
          motionValue2.set(motionValue2.get() + delta[axis].translate);
        });
        this.visualElement.render();
      }
    });
    return () => {
      stopResizeListener();
      stopPointerListener();
      stopMeasureLayoutListener();
      stopLayoutUpdateListener && stopLayoutUpdateListener();
      stopResizeObservers && stopResizeObservers();
    };
  }
  getProps() {
    const props = this.visualElement.getProps();
    const { drag: drag2 = false, dragDirectionLock = false, dragPropagation = false, dragConstraints = false, dragElastic = defaultElastic, dragMomentum = true } = props;
    return {
      ...props,
      drag: drag2,
      dragDirectionLock,
      dragPropagation,
      dragConstraints,
      dragElastic,
      dragMomentum
    };
  }
}
function skipFirstCall(callback) {
  let isFirst = true;
  return () => {
    if (isFirst) {
      isFirst = false;
      return;
    }
    callback();
  };
}
function startResizeObservers(element, constraintsElement, onResize) {
  const stopElement = resize(element, skipFirstCall(onResize));
  const stopContainer = resize(constraintsElement, skipFirstCall(onResize));
  return () => {
    stopElement();
    stopContainer();
  };
}
function shouldDrag(direction, drag2, currentDirection) {
  return (drag2 === true || drag2 === direction) && (currentDirection === null || currentDirection === direction);
}
function getCurrentDirection(offset, lockThreshold = 10) {
  let direction = null;
  if (Math.abs(offset.y) > lockThreshold) {
    direction = "y";
  } else if (Math.abs(offset.x) > lockThreshold) {
    direction = "x";
  }
  return direction;
}
class DragGesture extends Feature {
  constructor(node) {
    super(node);
    this.removeGroupControls = noop;
    this.removeListeners = noop;
    this.controls = new VisualElementDragControls(node);
  }
  mount() {
    const { dragControls } = this.node.getProps();
    if (dragControls) {
      this.removeGroupControls = dragControls.subscribe(this.controls);
    }
    this.removeListeners = this.controls.addListeners() || noop;
  }
  update() {
    const { dragControls } = this.node.getProps();
    const { dragControls: prevDragControls } = this.node.prevProps || {};
    if (dragControls !== prevDragControls) {
      this.removeGroupControls();
      if (dragControls) {
        this.removeGroupControls = dragControls.subscribe(this.controls);
      }
    }
  }
  unmount() {
    this.removeGroupControls();
    this.removeListeners();
    if (!this.controls.isDragging) {
      this.controls.endPanSession();
    }
  }
}
const asyncHandler = (handler) => (event, info) => {
  if (handler) {
    frame.update(() => handler(event, info), false, true);
  }
};
class PanGesture extends Feature {
  constructor() {
    super(...arguments);
    this.removePointerDownListener = noop;
  }
  onPointerDown(pointerDownEvent) {
    this.session = new PanSession(pointerDownEvent, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: getContextWindow(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart, onPanStart, onPan, onPanEnd } = this.node.getProps();
    return {
      onSessionStart: asyncHandler(onPanSessionStart),
      onStart: asyncHandler(onPanStart),
      onMove: asyncHandler(onPan),
      onEnd: (event, info) => {
        delete this.session;
        if (onPanEnd) {
          frame.postRender(() => onPanEnd(event, info));
        }
      }
    };
  }
  mount() {
    this.removePointerDownListener = addPointerEvent(this.node.current, "pointerdown", (event) => this.onPointerDown(event));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener();
    this.session && this.session.end();
  }
}
let hasTakenAnySnapshot = false;
class MeasureLayoutWithContext extends reactExports.Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement, layoutGroup, switchLayoutGroup, layoutId } = this.props;
    const { projection } = visualElement;
    if (projection) {
      if (layoutGroup.group)
        layoutGroup.group.add(projection);
      if (switchLayoutGroup && switchLayoutGroup.register && layoutId) {
        switchLayoutGroup.register(projection);
      }
      if (hasTakenAnySnapshot) {
        projection.root.didUpdate();
      }
      projection.addEventListener("animationComplete", () => {
        this.safeToRemove();
      });
      projection.setOptions({
        ...projection.options,
        layoutDependency: this.props.layoutDependency,
        onExitComplete: () => this.safeToRemove()
      });
    }
    globalProjectionState.hasEverUpdated = true;
  }
  getSnapshotBeforeUpdate(prevProps) {
    const { layoutDependency, visualElement, drag: drag2, isPresent } = this.props;
    const { projection } = visualElement;
    if (!projection)
      return null;
    projection.isPresent = isPresent;
    if (prevProps.layoutDependency !== layoutDependency) {
      projection.setOptions({
        ...projection.options,
        layoutDependency
      });
    }
    hasTakenAnySnapshot = true;
    if (drag2 || prevProps.layoutDependency !== layoutDependency || layoutDependency === void 0 || prevProps.isPresent !== isPresent) {
      projection.willUpdate();
    } else {
      this.safeToRemove();
    }
    if (prevProps.isPresent !== isPresent) {
      if (isPresent) {
        projection.promote();
      } else if (!projection.relegate()) {
        frame.postRender(() => {
          const stack = projection.getStack();
          if (!stack || !stack.members.length) {
            this.safeToRemove();
          }
        });
      }
    }
    return null;
  }
  componentDidUpdate() {
    const { visualElement, layoutAnchor } = this.props;
    const { projection } = visualElement;
    if (projection) {
      projection.options.layoutAnchor = layoutAnchor;
      projection.root.didUpdate();
      microtask.postRender(() => {
        if (!projection.currentAnimation && projection.isLead()) {
          this.safeToRemove();
        }
      });
    }
  }
  componentWillUnmount() {
    const { visualElement, layoutGroup, switchLayoutGroup: promoteContext } = this.props;
    const { projection } = visualElement;
    hasTakenAnySnapshot = true;
    if (projection) {
      projection.scheduleCheckAfterUnmount();
      if (layoutGroup && layoutGroup.group)
        layoutGroup.group.remove(projection);
      if (promoteContext && promoteContext.deregister)
        promoteContext.deregister(projection);
    }
  }
  safeToRemove() {
    const { safeToRemove } = this.props;
    safeToRemove && safeToRemove();
  }
  render() {
    return null;
  }
}
function MeasureLayout(props) {
  const [isPresent, safeToRemove] = usePresence();
  const layoutGroup = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(MeasureLayoutWithContext, { ...props, layoutGroup, switchLayoutGroup: reactExports.useContext(SwitchLayoutGroupContext), isPresent, safeToRemove });
}
const drag = {
  pan: {
    Feature: PanGesture
  },
  drag: {
    Feature: DragGesture,
    ProjectionNode: HTMLProjectionNode,
    MeasureLayout
  }
};
function handleHoverEvent(node, event, lifecycle) {
  const { props } = node;
  if (node.animationState && props.whileHover) {
    node.animationState.setActive("whileHover", lifecycle === "Start");
  }
  const eventName = "onHover" + lifecycle;
  const callback = props[eventName];
  if (callback) {
    frame.postRender(() => callback(event, extractEventInfo(event)));
  }
}
class HoverGesture extends Feature {
  mount() {
    const { current } = this.node;
    if (!current)
      return;
    this.unmount = hover(current, (_element, startEvent) => {
      handleHoverEvent(this.node, startEvent, "Start");
      return (endEvent) => handleHoverEvent(this.node, endEvent, "End");
    });
  }
  unmount() {
  }
}
class FocusGesture extends Feature {
  constructor() {
    super(...arguments);
    this.isActive = false;
  }
  onFocus() {
    let isFocusVisible = false;
    try {
      isFocusVisible = this.node.current.matches(":focus-visible");
    } catch (e) {
      isFocusVisible = true;
    }
    if (!isFocusVisible || !this.node.animationState)
      return;
    this.node.animationState.setActive("whileFocus", true);
    this.isActive = true;
  }
  onBlur() {
    if (!this.isActive || !this.node.animationState)
      return;
    this.node.animationState.setActive("whileFocus", false);
    this.isActive = false;
  }
  mount() {
    this.unmount = pipe(addDomEvent(this.node.current, "focus", () => this.onFocus()), addDomEvent(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function handlePressEvent(node, event, lifecycle) {
  const { props } = node;
  if (node.current instanceof HTMLButtonElement && node.current.disabled) {
    return;
  }
  if (node.animationState && props.whileTap) {
    node.animationState.setActive("whileTap", lifecycle === "Start");
  }
  const eventName = "onTap" + (lifecycle === "End" ? "" : lifecycle);
  const callback = props[eventName];
  if (callback) {
    frame.postRender(() => callback(event, extractEventInfo(event)));
  }
}
class PressGesture extends Feature {
  mount() {
    const { current } = this.node;
    if (!current)
      return;
    const { globalTapTarget, propagate } = this.node.props;
    this.unmount = press(current, (_element, startEvent) => {
      handlePressEvent(this.node, startEvent, "Start");
      return (endEvent, { success }) => handlePressEvent(this.node, endEvent, success ? "End" : "Cancel");
    }, {
      useGlobalTarget: globalTapTarget,
      stopPropagation: propagate?.tap === false
    });
  }
  unmount() {
  }
}
const observerCallbacks = /* @__PURE__ */ new WeakMap();
const observers = /* @__PURE__ */ new WeakMap();
const fireObserverCallback = (entry) => {
  const callback = observerCallbacks.get(entry.target);
  callback && callback(entry);
};
const fireAllObserverCallbacks = (entries) => {
  entries.forEach(fireObserverCallback);
};
function initIntersectionObserver({ root, ...options }) {
  const lookupRoot = root || document;
  if (!observers.has(lookupRoot)) {
    observers.set(lookupRoot, {});
  }
  const rootObservers = observers.get(lookupRoot);
  const key = JSON.stringify(options);
  if (!rootObservers[key]) {
    rootObservers[key] = new IntersectionObserver(fireAllObserverCallbacks, { root, ...options });
  }
  return rootObservers[key];
}
function observeIntersection(element, options, callback) {
  const rootInteresectionObserver = initIntersectionObserver(options);
  observerCallbacks.set(element, callback);
  rootInteresectionObserver.observe(element);
  return () => {
    observerCallbacks.delete(element);
    rootInteresectionObserver.unobserve(element);
  };
}
const thresholdNames = {
  some: 0,
  all: 1
};
class InViewFeature extends Feature {
  constructor() {
    super(...arguments);
    this.hasEnteredView = false;
    this.isInView = false;
  }
  startObserver() {
    this.stopObserver?.();
    const { viewport = {} } = this.node.getProps();
    const { root, margin: rootMargin, amount = "some", once } = viewport;
    const options = {
      root: root ? root.current : void 0,
      rootMargin,
      threshold: typeof amount === "number" ? amount : thresholdNames[amount]
    };
    const onIntersectionUpdate = (entry) => {
      const { isIntersecting } = entry;
      if (this.isInView === isIntersecting)
        return;
      this.isInView = isIntersecting;
      if (once && !isIntersecting && this.hasEnteredView) {
        return;
      } else if (isIntersecting) {
        this.hasEnteredView = true;
      }
      if (this.node.animationState) {
        this.node.animationState.setActive("whileInView", isIntersecting);
      }
      const { onViewportEnter, onViewportLeave } = this.node.getProps();
      const callback = isIntersecting ? onViewportEnter : onViewportLeave;
      callback && callback(entry);
    };
    this.stopObserver = observeIntersection(this.node.current, options, onIntersectionUpdate);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver === "undefined")
      return;
    const { props, prevProps } = this.node;
    const hasOptionsChanged = ["amount", "margin", "root"].some(hasViewportOptionChanged(props, prevProps));
    if (hasOptionsChanged) {
      this.startObserver();
    }
  }
  unmount() {
    this.stopObserver?.();
    this.hasEnteredView = false;
    this.isInView = false;
  }
}
function hasViewportOptionChanged({ viewport = {} }, { viewport: prevViewport = {} } = {}) {
  return (name) => viewport[name] !== prevViewport[name];
}
const gestureAnimations = {
  inView: {
    Feature: InViewFeature
  },
  tap: {
    Feature: PressGesture
  },
  focus: {
    Feature: FocusGesture
  },
  hover: {
    Feature: HoverGesture
  }
};
const layout = {
  layout: {
    ProjectionNode: HTMLProjectionNode,
    MeasureLayout
  }
};
const featureBundle = {
  ...animations,
  ...gestureAnimations,
  ...drag,
  ...layout
};
const motion = /* @__PURE__ */ createMotionProxy(featureBundle, createDomVisualElement);
function useMotionValue(initial) {
  const value = useConstant(() => motionValue(initial));
  const { isStatic } = reactExports.useContext(MotionConfigContext);
  if (isStatic) {
    const [, setLatest] = reactExports.useState(initial);
    reactExports.useEffect(() => value.on("change", setLatest), []);
  }
  return value;
}
function useCombineMotionValues(values, combineValues) {
  const value = useMotionValue(combineValues());
  const updateValue = () => value.set(combineValues());
  updateValue();
  useIsomorphicLayoutEffect(() => {
    const scheduleUpdate = () => frame.preRender(updateValue, false, true);
    const subscriptions = values.map((v2) => v2.on("change", scheduleUpdate));
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      cancelFrame(updateValue);
    };
  });
  return value;
}
function useComputed(compute) {
  collectMotionValues.current = [];
  compute();
  const value = useCombineMotionValues(collectMotionValues.current, compute);
  collectMotionValues.current = void 0;
  return value;
}
function useTransform(input, inputRangeOrTransformer, outputRangeOrMap, options) {
  if (typeof input === "function") {
    return useComputed(input);
  }
  const outputRange = outputRangeOrMap;
  const transformer = typeof inputRangeOrTransformer === "function" ? inputRangeOrTransformer : transform(inputRangeOrTransformer, outputRange, options);
  const result = Array.isArray(input) ? useListTransform(input, transformer) : useListTransform([input], ([latest]) => transformer(latest));
  const inputAccelerate = !Array.isArray(input) ? input.accelerate : void 0;
  if (inputAccelerate && !inputAccelerate.isTransformed && typeof inputRangeOrTransformer !== "function" && Array.isArray(outputRangeOrMap) && options?.clamp !== false) {
    result.accelerate = {
      ...inputAccelerate,
      times: inputRangeOrTransformer,
      keyframes: outputRangeOrMap,
      isTransformed: true,
      ...{}
    };
  }
  return result;
}
function useListTransform(values, transformer) {
  const latest = useConstant(() => []);
  return useCombineMotionValues(values, () => {
    latest.length = 0;
    const numValues = values.length;
    for (let i = 0; i < numValues; i++) {
      latest[i] = values[i].get();
    }
    return transformer(latest);
  });
}
const ReorderContext = reactExports.createContext(null);
function checkReorder(order, value, offset, velocity) {
  if (!velocity)
    return order;
  const index = order.findIndex((item2) => item2.value === value);
  if (index === -1)
    return order;
  const nextOffset = velocity > 0 ? 1 : -1;
  const nextItem = order[index + nextOffset];
  if (!nextItem)
    return order;
  const item = order[index];
  const nextLayout = nextItem.layout;
  const nextItemCenter = mixNumber$1(nextLayout.min, nextLayout.max, 0.5);
  if (nextOffset === 1 && item.layout.max + offset > nextItemCenter || nextOffset === -1 && item.layout.min + offset < nextItemCenter) {
    return moveItem(order, index, index + nextOffset);
  }
  return order;
}
function ReorderGroupComponent({ children, as = "ul", axis = "y", onReorder, values, ...props }, externalRef) {
  const Component = useConstant(() => motion[as]);
  const order = [];
  const isReordering = reactExports.useRef(false);
  const groupRef = reactExports.useRef(null);
  const context = {
    axis,
    groupRef,
    registerItem: (value, layout2) => {
      const idx = order.findIndex((entry) => value === entry.value);
      if (idx !== -1) {
        order[idx].layout = layout2[axis];
      } else {
        order.push({ value, layout: layout2[axis] });
      }
      order.sort(compareMin);
    },
    updateOrder: (item, offset, velocity) => {
      if (isReordering.current)
        return;
      const newOrder = checkReorder(order, item, offset, velocity);
      if (order !== newOrder) {
        isReordering.current = true;
        const newValues = [...values];
        for (let i = 0; i < newOrder.length; i++) {
          if (order[i].value !== newOrder[i].value) {
            const a = values.indexOf(order[i].value);
            const b = values.indexOf(newOrder[i].value);
            if (a !== -1 && b !== -1) {
              [newValues[a], newValues[b]] = [newValues[b], newValues[a]];
            }
            break;
          }
        }
        onReorder(newValues);
      }
    }
  };
  reactExports.useEffect(() => {
    isReordering.current = false;
  });
  const setRef2 = (element) => {
    groupRef.current = element;
    if (typeof externalRef === "function") {
      externalRef(element);
    } else if (externalRef) {
      externalRef.current = element;
    }
  };
  const groupStyle = {
    overflowAnchor: "none",
    ...props.style
  };
  return jsxRuntimeExports.jsx(Component, { ...props, style: groupStyle, ref: setRef2, ignoreStrict: true, children: jsxRuntimeExports.jsx(ReorderContext.Provider, { value: context, children }) });
}
const ReorderGroup = /* @__PURE__ */ reactExports.forwardRef(ReorderGroupComponent);
function compareMin(a, b) {
  return a.layout.min - b.layout.min;
}
const threshold = 50;
const maxSpeed = 25;
const overflowStyles = /* @__PURE__ */ new Set(["auto", "scroll"]);
const initialScrollLimits = /* @__PURE__ */ new WeakMap();
const activeScrollEdge = /* @__PURE__ */ new WeakMap();
let currentGroupElement = null;
function resetAutoScrollState() {
  if (currentGroupElement) {
    const scrollableAncestor = findScrollableAncestor(currentGroupElement, "y");
    if (scrollableAncestor) {
      activeScrollEdge.delete(scrollableAncestor);
      initialScrollLimits.delete(scrollableAncestor);
    }
    const scrollableAncestorX = findScrollableAncestor(currentGroupElement, "x");
    if (scrollableAncestorX && scrollableAncestorX !== scrollableAncestor) {
      activeScrollEdge.delete(scrollableAncestorX);
      initialScrollLimits.delete(scrollableAncestorX);
    }
    currentGroupElement = null;
  }
}
function isScrollableElement(element, axis) {
  const style = getComputedStyle(element);
  const overflow = axis === "x" ? style.overflowX : style.overflowY;
  const isDocumentScroll = element === document.body || element === document.documentElement;
  return overflowStyles.has(overflow) || isDocumentScroll;
}
function findScrollableAncestor(element, axis) {
  let current = element?.parentElement;
  while (current) {
    if (isScrollableElement(current, axis)) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}
function getScrollAmount(pointerPosition, scrollElement, axis) {
  const rect = scrollElement.getBoundingClientRect();
  const start = axis === "x" ? Math.max(0, rect.left) : Math.max(0, rect.top);
  const end = axis === "x" ? Math.min(window.innerWidth, rect.right) : Math.min(window.innerHeight, rect.bottom);
  const distanceFromStart = pointerPosition - start;
  const distanceFromEnd = end - pointerPosition;
  if (distanceFromStart < threshold) {
    const intensity = 1 - distanceFromStart / threshold;
    return { amount: -maxSpeed * intensity * intensity, edge: "start" };
  } else if (distanceFromEnd < threshold) {
    const intensity = 1 - distanceFromEnd / threshold;
    return { amount: maxSpeed * intensity * intensity, edge: "end" };
  }
  return { amount: 0, edge: null };
}
function autoScrollIfNeeded(groupElement, pointerPosition, axis, velocity) {
  if (!groupElement)
    return;
  currentGroupElement = groupElement;
  const scrollableAncestor = findScrollableAncestor(groupElement, axis);
  if (!scrollableAncestor)
    return;
  const viewportPointerPosition = pointerPosition - (axis === "x" ? window.scrollX : window.scrollY);
  const { amount: scrollAmount, edge } = getScrollAmount(viewportPointerPosition, scrollableAncestor, axis);
  if (edge === null) {
    activeScrollEdge.delete(scrollableAncestor);
    initialScrollLimits.delete(scrollableAncestor);
    return;
  }
  const currentActiveEdge = activeScrollEdge.get(scrollableAncestor);
  const isDocumentScroll = scrollableAncestor === document.body || scrollableAncestor === document.documentElement;
  if (currentActiveEdge !== edge) {
    const shouldStart = edge === "start" && velocity < 0 || edge === "end" && velocity > 0;
    if (!shouldStart)
      return;
    activeScrollEdge.set(scrollableAncestor, edge);
    const maxScroll = axis === "x" ? scrollableAncestor.scrollWidth - (isDocumentScroll ? window.innerWidth : scrollableAncestor.clientWidth) : scrollableAncestor.scrollHeight - (isDocumentScroll ? window.innerHeight : scrollableAncestor.clientHeight);
    initialScrollLimits.set(scrollableAncestor, maxScroll);
  }
  if (scrollAmount > 0) {
    const initialLimit = initialScrollLimits.get(scrollableAncestor);
    const currentScroll = axis === "x" ? isDocumentScroll ? window.scrollX : scrollableAncestor.scrollLeft : isDocumentScroll ? window.scrollY : scrollableAncestor.scrollTop;
    if (currentScroll >= initialLimit)
      return;
  }
  if (axis === "x") {
    if (isDocumentScroll) {
      window.scrollBy({ left: scrollAmount });
    } else {
      scrollableAncestor.scrollLeft += scrollAmount;
    }
  } else {
    if (isDocumentScroll) {
      window.scrollBy({ top: scrollAmount });
    } else {
      scrollableAncestor.scrollTop += scrollAmount;
    }
  }
}
function useDefaultMotionValue(value, defaultValue = 0) {
  return isMotionValue(value) ? value : useMotionValue(defaultValue);
}
function ReorderItemComponent({ children, style = {}, value, as = "li", onDrag, onDragEnd, layout: layout2 = true, ...props }, externalRef) {
  const Component = useConstant(() => motion[as]);
  const context = reactExports.useContext(ReorderContext);
  const point = {
    x: useDefaultMotionValue(style.x),
    y: useDefaultMotionValue(style.y)
  };
  const zIndex = useTransform([point.x, point.y], ([latestX, latestY]) => latestX || latestY ? 1 : "unset");
  const { axis, registerItem, updateOrder, groupRef } = context;
  return jsxRuntimeExports.jsx(Component, { drag: axis, ...props, dragSnapToOrigin: true, style: { ...style, x: point.x, y: point.y, zIndex }, layout: layout2, onDrag: (event, gesturePoint) => {
    const { velocity, point: pointerPoint } = gesturePoint;
    const offset = point[axis].get();
    updateOrder(value, offset, velocity[axis]);
    autoScrollIfNeeded(groupRef.current, pointerPoint[axis], axis, velocity[axis]);
    onDrag && onDrag(event, gesturePoint);
  }, onDragEnd: (event, gesturePoint) => {
    resetAutoScrollState();
    onDragEnd && onDragEnd(event, gesturePoint);
  }, onLayoutMeasure: (measured) => {
    registerItem(value, measured);
  }, ref: externalRef, ignoreStrict: true, children });
}
const ReorderItem = /* @__PURE__ */ reactExports.forwardRef(ReorderItemComponent);
const __vite_import_meta_env__$2 = {};
const createStoreImpl = (createState2) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const destroy = () => {
    if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
      console.warn(
        "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
      );
    }
    listeners.clear();
  };
  const api = { setState, getState, getInitialState, subscribe, destroy };
  const initialState = state = createState2(setState, getState, api);
  return api;
};
const createStore = (createState2) => createState2 ? createStoreImpl(createState2) : createStoreImpl;
var withSelector = { exports: {} };
var withSelector_production = {};
var shim$2 = { exports: {} };
var useSyncExternalStoreShim_production = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React$1 = reactExports;
function is$1(x2, y2) {
  return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
}
var objectIs$1 = "function" === typeof Object.is ? Object.is : is$1, useState = React$1.useState, useEffect$1 = React$1.useEffect, useLayoutEffect = React$1.useLayoutEffect, useDebugValue$2 = React$1.useDebugValue;
function useSyncExternalStore$2(subscribe, getSnapshot) {
  var value = getSnapshot(), _useState = useState({ inst: { value, getSnapshot } }), inst = _useState[0].inst, forceUpdate = _useState[1];
  useLayoutEffect(
    function() {
      inst.value = value;
      inst.getSnapshot = getSnapshot;
      checkIfSnapshotChanged(inst) && forceUpdate({ inst });
    },
    [subscribe, value, getSnapshot]
  );
  useEffect$1(
    function() {
      checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      return subscribe(function() {
        checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      });
    },
    [subscribe]
  );
  useDebugValue$2(value);
  return value;
}
function checkIfSnapshotChanged(inst) {
  var latestGetSnapshot = inst.getSnapshot;
  inst = inst.value;
  try {
    var nextValue = latestGetSnapshot();
    return !objectIs$1(inst, nextValue);
  } catch (error) {
    return true;
  }
}
function useSyncExternalStore$1(subscribe, getSnapshot) {
  return getSnapshot();
}
var shim$1 = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
useSyncExternalStoreShim_production.useSyncExternalStore = void 0 !== React$1.useSyncExternalStore ? React$1.useSyncExternalStore : shim$1;
{
  shim$2.exports = useSyncExternalStoreShim_production;
}
var shimExports = shim$2.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = reactExports, shim = shimExports;
function is(x2, y2) {
  return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
}
var objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = shim.useSyncExternalStore, useRef = React.useRef, useEffect = React.useEffect, useMemo = React.useMemo, useDebugValue$1 = React.useDebugValue;
withSelector_production.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
  var instRef = useRef(null);
  if (null === instRef.current) {
    var inst = { hasValue: false, value: null };
    instRef.current = inst;
  } else inst = instRef.current;
  instRef = useMemo(
    function() {
      function memoizedSelector(nextSnapshot) {
        if (!hasMemo) {
          hasMemo = true;
          memoizedSnapshot = nextSnapshot;
          nextSnapshot = selector(nextSnapshot);
          if (void 0 !== isEqual && inst.hasValue) {
            var currentSelection = inst.value;
            if (isEqual(currentSelection, nextSnapshot))
              return memoizedSelection = currentSelection;
          }
          return memoizedSelection = nextSnapshot;
        }
        currentSelection = memoizedSelection;
        if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
        var nextSelection = selector(nextSnapshot);
        if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
          return memoizedSnapshot = nextSnapshot, currentSelection;
        memoizedSnapshot = nextSnapshot;
        return memoizedSelection = nextSelection;
      }
      var hasMemo = false, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
      return [
        function() {
          return memoizedSelector(getSnapshot());
        },
        null === maybeGetServerSnapshot ? void 0 : function() {
          return memoizedSelector(maybeGetServerSnapshot());
        }
      ];
    },
    [getSnapshot, getServerSnapshot, selector, isEqual]
  );
  var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
  useEffect(
    function() {
      inst.hasValue = true;
      inst.value = value;
    },
    [value]
  );
  useDebugValue$1(value);
  return value;
};
{
  withSelector.exports = withSelector_production;
}
var withSelectorExports = withSelector.exports;
const useSyncExternalStoreExports = /* @__PURE__ */ getDefaultExportFromCjs(withSelectorExports);
const __vite_import_meta_env__$1 = {};
const { useDebugValue } = We$1;
const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;
let didWarnAboutEqualityFn = false;
const identity = (arg) => arg;
function useStore(api, selector = identity, equalityFn) {
  if ((__vite_import_meta_env__$1 ? "production" : void 0) !== "production" && equalityFn && !didWarnAboutEqualityFn) {
    console.warn(
      "[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"
    );
    didWarnAboutEqualityFn = true;
  }
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getInitialState,
    selector,
    equalityFn
  );
  useDebugValue(slice);
  return slice;
}
const createImpl = (createState2) => {
  if ((__vite_import_meta_env__$1 ? "production" : void 0) !== "production" && typeof createState2 !== "function") {
    console.warn(
      "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
    );
  }
  const api = typeof createState2 === "function" ? createStore(createState2) : createState2;
  const useBoundStore = (selector, equalityFn) => useStore(api, selector, equalityFn);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = (createState2) => createState2 ? createImpl(createState2) : createImpl;
const APP_META$1 = {
  terminal: { title: "Terminal", width: 800, height: 500 },
  editor: { title: "Code Editor", width: 900, height: 600 },
  "password-tester": { title: "Password Tester", width: 820, height: 620 },
  leaker: { title: "Leaker — Breach Monitor", width: 860, height: 560 },
  settings: { title: "Settings", width: 760, height: 560 },
  files: { title: "Files", width: 860, height: 580 },
  launcher: { title: "App Launcher", width: 760, height: 560 },
  system: { title: "Settings", width: 760, height: 560 },
  opticseo: { title: "OpticSEO Pro", width: 1280, height: 820 },
  phone: { title: "Phone", width: 780, height: 600 },
  scanner: { title: "Network Scanner", width: 900, height: 620 },
  vpn: { title: "VPN Manager", width: 720, height: 560 },
  notes: { title: "Notes", width: 820, height: 580 },
  mail: { title: "Gmail", width: 1100, height: 780 },
  passwords: { title: "Password Manager", width: 860, height: 600 },
  "ssh-keys": { title: "SSH Key Manager", width: 820, height: 600 },
  firewall: { title: "Firewall", width: 780, height: 580 },
  "task-manager": { title: "Task Manager", width: 900, height: 600 },
  logs: { title: "Log Viewer", width: 960, height: 640 },
  netmon: { title: "Network Monitor", width: 900, height: 600 },
  screenshot: { title: "Screenshot", width: 900, height: 640 },
  calculator: { title: "Calculator", width: 560, height: 520 },
  "crypto-tools": { title: "Crypto Tools", width: 720, height: 580 },
  "api-tester": { title: "API Tester", width: 1100, height: 720 },
  "cert-inspector": { title: "Cert Inspector", width: 780, height: 580 },
  docker: { title: "Docker", width: 960, height: 640 },
  git: { title: "Git Client", width: 980, height: 640 },
  database: { title: "SQLite Browser", width: 960, height: 640 },
  markdown: { title: "Markdown Editor", width: 1e3, height: 680 },
  trash: { title: "Trash", width: 820, height: 560 },
  shodan: { title: "Shodan Explorer", width: 1100, height: 720 },
  osint: { title: "OSINT Dashboard", width: 1060, height: 700 },
  cve: { title: "CVE Database", width: 1060, height: 700 },
  "ai-assistant": { title: "AI Assistant", width: 820, height: 640 },
  wordlists: { title: "Wordlist Manager", width: 900, height: 600 },
  "json-explorer": { title: "JSON / YAML Explorer", width: 1060, height: 680 },
  totp: { title: "2FA / TOTP Manager", width: 760, height: 540 },
  regex: { title: "Regex Tester", width: 900, height: 640 },
  "encoding-chain": { title: "Encoding Chain", width: 980, height: 640 },
  "packet-sniffer": { title: "Packet Sniffer", width: 1100, height: 680 },
  backup: { title: "System Backup", width: 820, height: 580 },
  "password-health": { title: "Password Health", width: 760, height: 580 },
  pomodoro: { title: "Pomodoro Timer", width: 560, height: 700 },
  "audit-log": { title: "Audit Log", width: 980, height: 640 },
  "code-scanner": { title: "Code Scanner", width: 1060, height: 700 },
  wallpaper: { title: "Wallpaper", width: 820, height: 580 },
  "clipboard-history": { title: "Clipboard History", width: 720, height: 580 },
  "color-picker": { title: "Color Picker", width: 680, height: 560 },
  "unit-converter": { title: "Unit Converter", width: 680, height: 520 },
  "world-clock": { title: "World Clock", width: 780, height: 520 },
  "image-viewer": { title: "Image Viewer", width: 960, height: 700 },
  "rss-reader": { title: "RSS Reader", width: 1e3, height: 680 },
  "remote-desktop": { title: "Remote Desktop", width: 860, height: 600 }
};
let instanceCounter = 0;
const useWindowStore = create((set, get) => ({
  windows: [],
  nextZ: 10,
  openApp(appId) {
    const existing = get().windows.find((w2) => w2.appId === appId);
    if (existing) {
      get().restoreWindow(existing.id);
      return;
    }
    const meta = APP_META$1[appId];
    const id2 = `${appId}-${++instanceCounter}`;
    const offset = get().windows.length % 8 * 24;
    const z2 = get().nextZ;
    set((s) => ({
      nextZ: s.nextZ + 1,
      windows: [
        ...s.windows.map((w2) => ({ ...w2, focused: false })),
        {
          id: id2,
          appId,
          title: meta.title,
          x: 60 + offset,
          y: 60 + offset,
          width: meta.width,
          height: meta.height,
          minimized: false,
          maximized: false,
          focused: true,
          zIndex: z2
        }
      ]
    }));
  },
  closeWindow(id2) {
    set((s) => ({ windows: s.windows.filter((w2) => w2.id !== id2) }));
  },
  focusWindow(id2) {
    const z2 = get().nextZ;
    set((s) => ({
      nextZ: s.nextZ + 1,
      windows: s.windows.map((w2) => ({
        ...w2,
        focused: w2.id === id2,
        minimized: w2.id === id2 ? false : w2.minimized,
        zIndex: w2.id === id2 ? z2 : w2.zIndex
      }))
    }));
  },
  moveWindow(id2, x2, y2) {
    set((s) => ({ windows: s.windows.map((w2) => w2.id === id2 ? { ...w2, x: x2, y: y2 } : w2) }));
  },
  resizeWindow(id2, width, height) {
    set((s) => ({ windows: s.windows.map((w2) => w2.id === id2 ? { ...w2, width, height } : w2) }));
  },
  minimizeWindow(id2) {
    set((s) => ({
      windows: s.windows.map((w2) => w2.id === id2 ? { ...w2, minimized: true, focused: false } : w2)
    }));
  },
  restoreWindow(id2) {
    const z2 = get().nextZ;
    set((s) => ({
      nextZ: s.nextZ + 1,
      windows: s.windows.map((w2) => w2.id === id2 ? { ...w2, minimized: false, focused: true, zIndex: z2 } : w2)
    }));
  },
  toggleMaximize(id2) {
    const z2 = get().nextZ;
    const W2 = typeof window !== "undefined" ? window.innerWidth : 1440;
    const H2 = typeof window !== "undefined" ? window.innerHeight - 28 - 88 : 784;
    set((s) => ({
      nextZ: s.nextZ + 1,
      windows: s.windows.map((w2) => {
        if (w2.id !== id2) return w2;
        if (w2.maximized) {
          return { ...w2, maximized: false, zIndex: z2, ...w2.prevBounds ?? {} };
        }
        return {
          ...w2,
          maximized: true,
          zIndex: z2,
          prevBounds: { x: w2.x, y: w2.y, width: w2.width, height: w2.height },
          x: 0,
          y: 0,
          width: W2,
          height: H2
        };
      })
    }));
  }
}));
const __vite_import_meta_env__ = {};
function createJSONStorage(getStorage, options) {
  let storage;
  try {
    storage = getStorage();
  } catch (_e) {
    return;
  }
  const persistStorage = {
    getItem: (name) => {
      var _a;
      const parse = (str2) => {
        if (str2 === null) {
          return null;
        }
        return JSON.parse(str2, void 0);
      };
      const str = (_a = storage.getItem(name)) != null ? _a : null;
      if (str instanceof Promise) {
        return str.then(parse);
      }
      return parse(str);
    },
    setItem: (name, newValue) => storage.setItem(
      name,
      JSON.stringify(newValue, void 0)
    ),
    removeItem: (name) => storage.removeItem(name)
  };
  return persistStorage;
}
const toThenable = (fn) => (input) => {
  try {
    const result = fn(input);
    if (result instanceof Promise) {
      return result;
    }
    return {
      then(onFulfilled) {
        return toThenable(onFulfilled)(result);
      },
      catch(_onRejected) {
        return this;
      }
    };
  } catch (e) {
    return {
      then(_onFulfilled) {
        return this;
      },
      catch(onRejected) {
        return toThenable(onRejected)(e);
      }
    };
  }
};
const oldImpl = (config, baseOptions) => (set, get, api) => {
  let options = {
    getStorage: () => localStorage,
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    partialize: (state) => state,
    version: 0,
    merge: (persistedState, currentState) => ({
      ...currentState,
      ...persistedState
    }),
    ...baseOptions
  };
  let hasHydrated = false;
  const hydrationListeners = /* @__PURE__ */ new Set();
  const finishHydrationListeners = /* @__PURE__ */ new Set();
  let storage;
  try {
    storage = options.getStorage();
  } catch (_e) {
  }
  if (!storage) {
    return config(
      (...args) => {
        console.warn(
          `[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`
        );
        set(...args);
      },
      get,
      api
    );
  }
  const thenableSerialize = toThenable(options.serialize);
  const setItem = () => {
    const state = options.partialize({ ...get() });
    let errorInSync;
    const thenable = thenableSerialize({ state, version: options.version }).then(
      (serializedValue) => storage.setItem(options.name, serializedValue)
    ).catch((e) => {
      errorInSync = e;
    });
    if (errorInSync) {
      throw errorInSync;
    }
    return thenable;
  };
  const savedSetState = api.setState;
  api.setState = (state, replace) => {
    savedSetState(state, replace);
    void setItem();
  };
  const configResult = config(
    (...args) => {
      set(...args);
      void setItem();
    },
    get,
    api
  );
  let stateFromStorage;
  const hydrate = () => {
    var _a;
    if (!storage) return;
    hasHydrated = false;
    hydrationListeners.forEach((cb2) => cb2(get()));
    const postRehydrationCallback = ((_a = options.onRehydrateStorage) == null ? void 0 : _a.call(options, get())) || void 0;
    return toThenable(storage.getItem.bind(storage))(options.name).then((storageValue) => {
      if (storageValue) {
        return options.deserialize(storageValue);
      }
    }).then((deserializedStorageValue) => {
      if (deserializedStorageValue) {
        if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
          if (options.migrate) {
            return options.migrate(
              deserializedStorageValue.state,
              deserializedStorageValue.version
            );
          }
          console.error(
            `State loaded from storage couldn't be migrated since no migrate function was provided`
          );
        } else {
          return deserializedStorageValue.state;
        }
      }
    }).then((migratedState) => {
      var _a2;
      stateFromStorage = options.merge(
        migratedState,
        (_a2 = get()) != null ? _a2 : configResult
      );
      set(stateFromStorage, true);
      return setItem();
    }).then(() => {
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(stateFromStorage, void 0);
      hasHydrated = true;
      finishHydrationListeners.forEach((cb2) => cb2(stateFromStorage));
    }).catch((e) => {
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
    });
  };
  api.persist = {
    setOptions: (newOptions) => {
      options = {
        ...options,
        ...newOptions
      };
      if (newOptions.getStorage) {
        storage = newOptions.getStorage();
      }
    },
    clearStorage: () => {
      storage == null ? void 0 : storage.removeItem(options.name);
    },
    getOptions: () => options,
    rehydrate: () => hydrate(),
    hasHydrated: () => hasHydrated,
    onHydrate: (cb2) => {
      hydrationListeners.add(cb2);
      return () => {
        hydrationListeners.delete(cb2);
      };
    },
    onFinishHydration: (cb2) => {
      finishHydrationListeners.add(cb2);
      return () => {
        finishHydrationListeners.delete(cb2);
      };
    }
  };
  hydrate();
  return stateFromStorage || configResult;
};
const newImpl = (config, baseOptions) => (set, get, api) => {
  let options = {
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => state,
    version: 0,
    merge: (persistedState, currentState) => ({
      ...currentState,
      ...persistedState
    }),
    ...baseOptions
  };
  let hasHydrated = false;
  const hydrationListeners = /* @__PURE__ */ new Set();
  const finishHydrationListeners = /* @__PURE__ */ new Set();
  let storage = options.storage;
  if (!storage) {
    return config(
      (...args) => {
        console.warn(
          `[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`
        );
        set(...args);
      },
      get,
      api
    );
  }
  const setItem = () => {
    const state = options.partialize({ ...get() });
    return storage.setItem(options.name, {
      state,
      version: options.version
    });
  };
  const savedSetState = api.setState;
  api.setState = (state, replace) => {
    savedSetState(state, replace);
    void setItem();
  };
  const configResult = config(
    (...args) => {
      set(...args);
      void setItem();
    },
    get,
    api
  );
  api.getInitialState = () => configResult;
  let stateFromStorage;
  const hydrate = () => {
    var _a, _b;
    if (!storage) return;
    hasHydrated = false;
    hydrationListeners.forEach((cb2) => {
      var _a2;
      return cb2((_a2 = get()) != null ? _a2 : configResult);
    });
    const postRehydrationCallback = ((_b = options.onRehydrateStorage) == null ? void 0 : _b.call(options, (_a = get()) != null ? _a : configResult)) || void 0;
    return toThenable(storage.getItem.bind(storage))(options.name).then((deserializedStorageValue) => {
      if (deserializedStorageValue) {
        if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
          if (options.migrate) {
            return [
              true,
              options.migrate(
                deserializedStorageValue.state,
                deserializedStorageValue.version
              )
            ];
          }
          console.error(
            `State loaded from storage couldn't be migrated since no migrate function was provided`
          );
        } else {
          return [false, deserializedStorageValue.state];
        }
      }
      return [false, void 0];
    }).then((migrationResult) => {
      var _a2;
      const [migrated, migratedState] = migrationResult;
      stateFromStorage = options.merge(
        migratedState,
        (_a2 = get()) != null ? _a2 : configResult
      );
      set(stateFromStorage, true);
      if (migrated) {
        return setItem();
      }
    }).then(() => {
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(stateFromStorage, void 0);
      stateFromStorage = get();
      hasHydrated = true;
      finishHydrationListeners.forEach((cb2) => cb2(stateFromStorage));
    }).catch((e) => {
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
    });
  };
  api.persist = {
    setOptions: (newOptions) => {
      options = {
        ...options,
        ...newOptions
      };
      if (newOptions.storage) {
        storage = newOptions.storage;
      }
    },
    clearStorage: () => {
      storage == null ? void 0 : storage.removeItem(options.name);
    },
    getOptions: () => options,
    rehydrate: () => hydrate(),
    hasHydrated: () => hasHydrated,
    onHydrate: (cb2) => {
      hydrationListeners.add(cb2);
      return () => {
        hydrationListeners.delete(cb2);
      };
    },
    onFinishHydration: (cb2) => {
      finishHydrationListeners.add(cb2);
      return () => {
        finishHydrationListeners.delete(cb2);
      };
    }
  };
  if (!options.skipHydration) {
    hydrate();
  }
  return stateFromStorage || configResult;
};
const persistImpl = (config, baseOptions) => {
  if ("getStorage" in baseOptions || "serialize" in baseOptions || "deserialize" in baseOptions) {
    if ((__vite_import_meta_env__ ? "production" : void 0) !== "production") {
      console.warn(
        "[DEPRECATED] `getStorage`, `serialize` and `deserialize` options are deprecated. Use `storage` option instead."
      );
    }
    return oldImpl(config, baseOptions);
  }
  return newImpl(config, baseOptions);
};
const persist = persistImpl;
const useDesktopStore = create()(
  persist(
    (set) => ({
      icons: [],
      wallpaper: "",
      addIcon: (appId) => set((s) => {
        if (s.icons.find((i) => i.appId === appId)) return s;
        const col = s.icons.length % 4;
        const row = Math.floor(s.icons.length / 4);
        return {
          icons: [...s.icons, {
            id: `di-${appId}-${Date.now()}`,
            appId,
            x: 24 + col * 104,
            y: 36 + row * 110
          }]
        };
      }),
      removeIcon: (id2) => set((s) => ({ icons: s.icons.filter((i) => i.id !== id2) })),
      moveIcon: (id2, x2, y2) => set((s) => ({ icons: s.icons.map((i) => i.id === id2 ? { ...i, x: x2, y: y2 } : i) })),
      setWallpaper: (path) => set({ wallpaper: path })
    }),
    { name: "cryogram-desktop" }
  )
);
const usePinnedStore = create()(
  persist(
    (set) => ({
      taskbar: [],
      desktop: [],
      pinToTaskbar: (app) => set((s) => ({
        taskbar: s.taskbar.find((a) => a.id === app.id) ? s.taskbar : [...s.taskbar, app]
      })),
      unpinTaskbar: (id2) => set((s) => ({ taskbar: s.taskbar.filter((a) => a.id !== id2) })),
      pinToDesktop: (app) => set((s) => ({
        desktop: s.desktop.find((a) => a.id === app.id) ? s.desktop : [...s.desktop, app]
      })),
      unpinDesktop: (id2) => set((s) => ({ desktop: s.desktop.filter((a) => a.id !== id2) }))
    }),
    { name: "cryogram-pinned-apps" }
  )
);
const DEFAULT_DOCK = [
  "launcher",
  "settings",
  "files",
  "ai-assistant",
  "terminal"
];
const useDockStore = create()(
  persist(
    (set) => ({
      order: DEFAULT_DOCK,
      setOrder: (order) => set({ order }),
      addApp: (id2) => set((s) => ({ order: s.order.includes(id2) ? s.order : [...s.order, id2] })),
      removeApp: (id2) => set((s) => ({ order: s.order.filter((a) => a !== id2) }))
    }),
    {
      name: "cryogram-dock-order",
      version: 2,
      migrate: (_state, _fromVersion) => ({ order: DEFAULT_DOCK }),
      merge: (persisted, current) => {
        const stored = persisted?.order ?? current.order;
        const merged = [...stored];
        for (const id2 of DEFAULT_DOCK) {
          if (!merged.includes(id2)) merged.push(id2);
        }
        return { ...current, order: merged };
      }
    }
  )
);
function ContextMenu({ x: x2, y: y2, items, onClose }) {
  const ref = reactExports.useRef(null);
  const [focused, setFocused] = reactExports.useState(-1);
  const actionItems = items.map((item, i) => ({ item, i })).filter(({ item }) => !item.sep && !item.disabled);
  reactExports.useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocused((f2) => (f2 + 1) % actionItems.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocused((f2) => (f2 - 1 + actionItems.length) % actionItems.length);
      }
      if (e.key === "Enter" && focused >= 0) {
        actionItems[focused]?.item.action?.();
        onClose();
      }
    };
    const t2 = setTimeout(() => document.addEventListener("mousedown", onDown), 60);
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t2);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose, focused, actionItems]);
  const menuW = 230;
  const rows = items.filter((i) => !i.sep).length;
  const menuH = rows * 34 + items.filter((i) => !!i.sep).length * 9 + 10;
  const cx = Math.min(x2, window.innerWidth - menuW - 10);
  const cy = Math.min(y2, window.innerHeight - menuH - 10);
  let actionIdx = -1;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      ref,
      className: "fixed z-[9000]",
      style: { left: cx, top: cy, minWidth: menuW },
      initial: { opacity: 0, scale: 0.88, y: -8 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.88, y: -8 },
      transition: { type: "spring", stiffness: 520, damping: 30, mass: 0.5 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            background: "rgba(18,24,36,0.96)",
            backdropFilter: "blur(48px) saturate(2)",
            WebkitBackdropFilter: "blur(48px) saturate(2)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 14,
            boxShadow: "0 24px 64px rgba(0,0,0,0.85), 0 0 0 0.5px rgba(255,255,255,0.04) inset, 0 1px 0 rgba(255,255,255,0.06) inset",
            padding: "5px 0",
            overflow: "hidden"
          },
          children: items.map((item, i) => {
            if (item.sep) {
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    height: 1,
                    margin: "4px 6px",
                    background: "rgba(255,255,255,0.07)"
                  }
                },
                i
              );
            }
            actionIdx++;
            const myIdx = actionIdx;
            const isFocused = focused === myIdx;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              ContextItem,
              {
                item,
                isFocused,
                onHover: () => setFocused(myIdx),
                onLeave: () => setFocused(-1),
                onClose
              },
              i
            );
          })
        }
      )
    }
  );
}
function ContextItem({
  item,
  isFocused,
  onHover,
  onLeave,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      animate: {
        background: isFocused ? item.danger ? "rgba(239,68,68,0.16)" : "var(--cryo-a12)" : "rgba(0,0,0,0)"
      },
      transition: { duration: 0.08 },
      onClick: () => {
        if (!item.disabled) {
          item.action?.();
          onClose();
        }
      },
      onMouseEnter: onHover,
      onMouseLeave: onLeave,
      disabled: item.disabled,
      className: "w-full flex items-center gap-2.5 px-3.5 text-sm text-left select-none",
      style: {
        height: 34,
        color: item.danger ? isFocused ? "#fca5a5" : "#f87171" : isFocused ? "#ffffff" : "rgba(255,255,255,0.82)",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        fontWeight: 400,
        cursor: item.disabled ? "default" : "pointer",
        opacity: item.disabled ? 0.35 : 1,
        transition: "color 0.08s",
        border: "none",
        borderRadius: 0
      },
      children: [
        item.icon && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "w-4 h-4 flex items-center justify-center shrink-0",
            style: { opacity: 0.65 },
            children: item.icon
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate", children: item.label }),
        item.shortcut && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            style: {
              fontSize: 11,
              opacity: 0.38,
              marginLeft: 8,
              fontFamily: "-apple-system, sans-serif"
            },
            children: item.shortcut
          }
        )
      ]
    }
  );
}
const BASE = 48;
const MAX_SCALE = 1.52;
const MAG_RADIUS = 88;
function getX11Meta$1(title) {
  const t2 = title.toLowerCase();
  const last = title.split(" - ").pop()?.trim() ?? title;
  const firstName = last.split(" ")[0];
  if (t2.includes("brave")) return { icon: "🦁", color: "#fb923c", name: "Brave" };
  if (t2.includes("chromium")) return { icon: "🌐", color: "#4ade80", name: "Chromium" };
  if (t2.includes("chrome")) return { icon: "🌐", color: "#4ade80", name: "Chrome" };
  if (t2.includes("firefox")) return { icon: "🦊", color: "#f97316", name: "Firefox" };
  if (t2.includes("visual studio code") || t2.includes("vscode")) return { icon: "💻", color: "#60a5fa", name: "VS Code" };
  if (t2.includes("thunar") || t2.includes("nautilus")) return { icon: "📁", color: "#f59e0b", name: "Files" };
  if (t2.includes("vlc") || t2.includes(" mpv")) return { icon: "▶", color: "#f43f5e", name: "Media" };
  if (t2.includes("discord")) return { icon: "💬", color: "#818cf8", name: "Discord" };
  if (t2.includes("slack")) return { icon: "💬", color: "#4ade80", name: "Slack" };
  if (t2.includes("spotify")) return { icon: "🎵", color: "#4ade80", name: "Spotify" };
  if (t2.includes("gimp")) return { icon: "🎨", color: "#e879f9", name: "GIMP" };
  const name = firstName.length > 11 ? firstName.slice(0, 10) + "…" : firstName;
  return { icon: "⬡", color: "#64748b", name: name || "App" };
}
const APP_META = {
  terminal: { label: "Terminal", color: "#00ff88", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TermIcon, {}) },
  editor: { label: "Code Editor", color: "#00d4ff", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(EditorIcon, {}) },
  "password-tester": { label: "Password Tester", color: "#ffcc00", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldLockIcon, {}) },
  leaker: { label: "Leaker", color: "#ff4466", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LeakIcon, {}) },
  files: { label: "Files", color: "#f59e0b", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderIcon, {}) },
  launcher: { label: "Launcher", color: "#34d399", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(GridIcon, {}) },
  settings: { label: "Settings", color: "#bb88ff", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(GearIcon, {}) },
  system: { label: "System", color: "#818cf8", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PulseIcon, {}) },
  opticseo: { label: "OpticSEO Pro", color: "#10b981", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(OpticSEOIcon, {}) },
  phone: { label: "Phone", color: "#a855f7", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneIcon, {}) },
  scanner: { label: "Net Scanner", color: "#00ff88", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ScannerIcon, {}) },
  vpn: { label: "VPN", color: "#a78bfa", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(VPNIcon, {}) },
  notes: { label: "Notes", color: "#fbbf24", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(NotesIcon, {}) },
  mail: { label: "Gmail", color: "#ea4335", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MailIcon, {}) },
  passwords: { label: "Passwords", color: "#ffcc00", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyVaultIcon, {}) },
  "ssh-keys": { label: "SSH Keys", color: "#00d4ff", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SSHIcon, {}) },
  firewall: { label: "Firewall", color: "#ff4466", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FirewallIcon, {}) },
  "task-manager": { label: "Tasks", color: "#818cf8", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TaskIcon, {}) },
  logs: { label: "Logs", color: "#a855f7", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LogIcon, {}) },
  netmon: { label: "Net Monitor", color: "#00d4ff", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(NetMonIcon, {}) },
  screenshot: { label: "Screenshot", color: "#34d399", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ScreenshotIcon, {}) },
  calculator: { label: "Calculator", color: "#facc15", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalcIcon, {}) },
  "crypto-tools": { label: "Crypto Tools", color: "#00d4ff", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CryptoIcon, {}) },
  "api-tester": { label: "API Tester", color: "#fb923c", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(APIIcon, {}) },
  "cert-inspector": { label: "Cert Inspector", color: "#4ade80", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CertIcon, {}) },
  docker: { label: "Docker", color: "#2496ed", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(DockerIcon, {}) },
  git: { label: "Git", color: "#f05033", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(GitIcon, {}) },
  database: { label: "SQLite", color: "#a855f7", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(DBIcon, {}) },
  markdown: { label: "Markdown", color: "#818cf8", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MarkdownIcon, {}) },
  trash: { label: "Trash", color: "#94a3b8", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrashIcon$1, {}) },
  shodan: { label: "Shodan", color: "#ef4444", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShodanIcon, {}) },
  osint: { label: "OSINT", color: "#fb923c", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(OSINTIcon, {}) },
  cve: { label: "CVE DB", color: "#f97316", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CVEIcon, {}) },
  "ai-assistant": { label: "AI Assistant", color: "#a78bfa", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(AIIcon, {}) },
  wordlists: { label: "Wordlists", color: "#4ade80", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(WordlistIcon, {}) },
  "json-explorer": { label: "JSON Explorer", color: "#fbbf24", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(JSONIcon, {}) },
  totp: { label: "2FA / TOTP", color: "#00d4ff", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TOTPIcon, {}) },
  regex: { label: "Regex Tester", color: "#818cf8", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RegexIcon, {}) },
  "encoding-chain": { label: "Encoding Chain", color: "#34d399", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(EncodingIcon, {}) },
  "packet-sniffer": { label: "Packet Sniffer", color: "#22c55e", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PacketIcon, {}) },
  backup: { label: "Backup", color: "#4ade80", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BackupIcon, {}) },
  "password-health": { label: "PW Health", color: "#f472b6", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PWHealthIcon, {}) },
  pomodoro: { label: "Pomodoro", color: "#ef4444", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PomodoroIcon, {}) },
  "audit-log": { label: "Audit Log", color: "#94a3b8", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(AuditIcon, {}) },
  "code-scanner": { label: "Code Scanner", color: "#ff4466", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CodeScanIcon, {}) },
  wallpaper: { label: "Wallpaper", color: "#818cf8", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(WallpaperIcon, {}) },
  "clipboard-history": { label: "Clipboard", color: "#a78bfa", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardIcon, {}) },
  "color-picker": { label: "Color Picker", color: "#f472b6", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ColorPickerIcon, {}) },
  "unit-converter": { label: "Unit Converter", color: "#22d3ee", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UnitConvIcon, {}) },
  "world-clock": { label: "World Clock", color: "#60a5fa", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(WorldClockIcon, {}) },
  "image-viewer": { label: "Image Viewer", color: "#34d399", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageViewerIcon, {}) },
  "rss-reader": { label: "RSS Reader", color: "#fb923c", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RSSIcon, {}) },
  "remote-desktop": { label: "Remote Desktop", color: "#10b981", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RemoteDesktopIcon, {}) }
};
function Dock() {
  const { order, setOrder, removeApp } = useDockStore();
  const addDesktopIcon = useDesktopStore((s) => s.addIcon);
  const { windows, openApp, focusWindow, restoreWindow, minimizeWindow } = useWindowStore();
  const [mouseX, setMouseX] = reactExports.useState(null);
  const [hovered, setHovered] = reactExports.useState(null);
  const [dragging, setDragging] = reactExports.useState(false);
  const [x11Windows, setX11Windows] = reactExports.useState([]);
  const [ctx, setCtx] = reactExports.useState(null);
  const dockRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const poll = async () => {
      try {
        const all = await window.cryogram.wm?.getWindows() ?? [];
        setX11Windows(all.filter(
          (w2) => w2.desktop >= 0 && !w2.title.toLowerCase().includes("cryogram") && w2.title.trim() !== "" && w2.title !== "Desktop"
        ));
      } catch {
      }
    };
    poll();
    const id2 = setInterval(poll, 2e3);
    return () => clearInterval(id2);
  }, []);
  const onMouseMove = reactExports.useCallback((e) => {
    if (dragging) return;
    const rect = dockRef.current?.getBoundingClientRect();
    if (rect) setMouseX(e.clientX - rect.left);
  }, [dragging]);
  const onMouseLeave = reactExports.useCallback(() => {
    setMouseX(null);
    setHovered(null);
  }, []);
  function getScale(idx) {
    if (mouseX === null || dragging) return 1;
    const center = idx * (BASE + 10) + BASE / 2;
    const dist = Math.abs(mouseX - center);
    if (dist >= MAG_RADIUS) return 1;
    const t2 = 1 - dist / MAG_RADIUS;
    return 1 + (MAX_SCALE - 1) * t2 * t2;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: ctx && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ContextMenu,
      {
        x: ctx.x,
        y: ctx.y,
        onClose: () => setCtx(null),
        items: [
          {
            label: windows.find((w2) => w2.appId === ctx.appId) ? "Focus Window" : "Open",
            action: () => {
              const win = windows.find((w2) => w2.appId === ctx.appId);
              if (!win) openApp(ctx.appId);
              else {
                restoreWindow(win.id);
                focusWindow(win.id);
              }
            }
          },
          { label: "Add to Desktop", action: () => addDesktopIcon(ctx.appId) },
          { sep: true },
          { label: "Remove from Dock", danger: true, action: () => removeApp(ctx.appId) }
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: hovered && !dragging && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 5 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 4 },
          transition: { duration: 0.1 },
          className: "absolute pointer-events-none text-xs px-2.5 py-1 rounded-lg whitespace-nowrap",
          style: {
            bottom: "calc(100% + 6px)",
            background: "rgba(8,12,18,0.97)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#e2e8f0",
            boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
          },
          children: hovered
        },
        hovered
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          ref: dockRef,
          className: "flex items-end pointer-events-auto",
          style: {
            paddingLeft: 14,
            paddingRight: 14,
            paddingTop: 8,
            paddingBottom: 8,
            background: "rgba(12,16,26,0.80)",
            backdropFilter: "blur(40px) saturate(1.8)",
            WebkitBackdropFilter: "blur(40px) saturate(1.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 22,
            boxShadow: "0 8px 40px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.06) inset",
            gap: 10
          },
          onMouseMove,
          onMouseLeave,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReorderGroup,
              {
                axis: "x",
                values: order,
                onReorder: setOrder,
                className: "flex items-end",
                style: { gap: 10, listStyle: "none", padding: 0, margin: 0 },
                children: order.map((appId, idx) => {
                  const meta = APP_META[appId];
                  if (!meta) return null;
                  const win = windows.find((w2) => w2.appId === appId);
                  const isOpen = !!win;
                  const isMinimized = !!win?.minimized;
                  const isFocused = win?.focused && !win.minimized;
                  const scale2 = getScale(idx);
                  const size = BASE * scale2;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ReorderItem,
                    {
                      value: appId,
                      onDragStart: () => {
                        setDragging(true);
                        setHovered(null);
                      },
                      onDragEnd: () => setDragging(false),
                      style: { listStyle: "none" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "flex flex-col items-center cursor-default",
                          style: { width: BASE },
                          onMouseEnter: () => setHovered(meta.label),
                          onContextMenu: (e) => {
                            e.preventDefault();
                            setCtx({ x: e.clientX, y: e.clientY - 8, appId });
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              motion.button,
                              {
                                onClick: () => {
                                  if (!win) {
                                    openApp(appId);
                                    return;
                                  }
                                  if (win.minimized) {
                                    restoreWindow(win.id);
                                    focusWindow(win.id);
                                    return;
                                  }
                                  if (win.focused) minimizeWindow(win.id);
                                  else focusWindow(win.id);
                                },
                                animate: { width: size, height: size, y: -(size - BASE) },
                                transition: { type: "spring", stiffness: 500, damping: 32, mass: 0.6 },
                                className: "relative rounded-2xl flex items-center justify-center overflow-hidden",
                                style: {
                                  background: `radial-gradient(ellipse at 38% 28%, ${meta.color}25, rgba(10,15,24,0.92) 70%)`,
                                  border: isFocused ? `1px solid ${meta.color}50` : "1px solid rgba(255,255,255,0.07)",
                                  boxShadow: isFocused ? `0 0 24px ${meta.color}25, 0 4px 18px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.08) inset` : "0 6px 20px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.06) inset"
                                },
                                whileTap: !dragging ? { scale: 0.88, transition: { duration: 0.07 } } : void 0,
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "div",
                                    {
                                      className: "absolute inset-0 pointer-events-none",
                                      style: { background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, transparent 55%)" }
                                    }
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: meta.color }, children: meta.icon })
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "mt-1 text-center leading-none select-none truncate pointer-events-none",
                                style: {
                                  fontSize: 9,
                                  maxWidth: BASE,
                                  color: isFocused ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)",
                                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                                  transition: "color 0.2s"
                                },
                                children: meta.label
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-0.5 mt-0.5 items-center justify-center", style: { height: 5 }, children: [
                              isOpen && !isMinimized && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full transition-all duration-300", style: {
                                width: isFocused ? 5 : 3,
                                height: isFocused ? 5 : 3,
                                background: meta.color,
                                boxShadow: isFocused ? `0 0 6px ${meta.color}` : "none"
                              } }),
                              isMinimized && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full transition-all duration-300", style: {
                                width: 3,
                                height: 3,
                                background: "rgba(255,255,255,0.3)"
                              } })
                            ] })
                          ]
                        }
                      )
                    },
                    appId
                  );
                })
              }
            ),
            x11Windows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "self-stretch",
                  style: { width: 1, background: "rgba(255,255,255,0.12)", margin: "6px 4px" }
                }
              ),
              x11Windows.map((xwin) => {
                const meta = getX11Meta$1(xwin.title);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex flex-col items-center cursor-default",
                    style: { width: BASE },
                    onMouseEnter: () => setHovered(meta.name),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        motion.button,
                        {
                          onClick: async () => {
                            try {
                              await window.cryogram.wm?.hideShell();
                              await new Promise((r2) => setTimeout(r2, 120));
                              await window.cryogram.wm?.focusWindow(xwin.id);
                            } catch {
                            }
                          },
                          animate: { width: BASE, height: BASE },
                          className: "relative rounded-2xl flex items-center justify-center overflow-hidden",
                          style: {
                            background: `radial-gradient(ellipse at 38% 28%, ${meta.color}18, rgba(10,15,24,0.92) 70%)`,
                            border: `1px solid ${meta.color}28`
                          },
                          whileHover: { scale: 1.08 },
                          whileTap: { scale: 0.88 },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "absolute inset-0 pointer-events-none",
                                style: { background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, transparent 55%)" }
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 22 }, children: meta.icon })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "mt-1 text-center leading-none select-none pointer-events-none truncate",
                          style: { fontSize: 9, maxWidth: BASE, color: `${meta.color}bb`, fontFamily: "-apple-system, sans-serif" },
                          children: meta.name
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "rounded-full mt-0.5",
                          style: { width: 3, height: 3, background: meta.color, opacity: 0.75 }
                        }
                      )
                    ]
                  },
                  xwin.id
                );
              })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          className: "mt-1.5 text-center pointer-events-none",
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: 3, duration: 0.5 },
          style: { fontSize: 9, color: "rgba(255,255,255,0.18)", fontFamily: "-apple-system, sans-serif" },
          children: "Drag to reorder · Right-click for options · Super+D to show/hide shell"
        }
      )
    ] }) })
  ] });
}
function TermIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 17l6-6-6-6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "17", x2: "20", y2: "17" })
  ] });
}
function EditorIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "16 18 22 12 16 6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "8 6 2 12 8 18" })
  ] });
}
function ShieldLockIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "9", y: "11", width: "6", height: "5", rx: "1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 8v3" })
  ] });
}
function LeakIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" }) });
}
function FolderIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" }) });
}
function GridIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "3", width: "7", height: "7" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "14", y: "3", width: "7", height: "7" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "14", y: "14", width: "7", height: "7" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "14", width: "7", height: "7" })
  ] });
}
function GearIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" })
  ] });
}
function PulseIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" }) });
}
function OpticSEOIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "11", r: "8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "8 13 11 10 13 12 16 8" })
  ] });
}
function PhoneIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5", y: "2", width: "14", height: "20", rx: "2", ry: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "18", x2: "12.01", y2: "18" })
  ] });
}
function ScannerIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" })
  ] });
}
function VPNIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
  ] });
}
function NotesIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "14 2 14 8 20 8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "16", y1: "13", x2: "8", y2: "13" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "16", y1: "17", x2: "8", y2: "17" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "10", y1: "9", x2: "8", y2: "9" })
  ] });
}
function MailIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2 7l10 7 10-7" })
  ] });
}
function KeyVaultIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "14", r: "4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "14", x2: "20", y2: "14" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "18", y1: "14", x2: "18", y2: "17" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "20", y1: "14", x2: "20", y2: "12" })
  ] });
}
function SSHIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "16", r: "1.2", fill: "currentColor" })
  ] });
}
function FirewallIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "15", x2: "12", y2: "16" })
  ] });
}
function TaskIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "3", y1: "9", x2: "21", y2: "9" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "3", y1: "15", x2: "21", y2: "15" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "9", y1: "9", x2: "9", y2: "21" })
  ] });
}
function LogIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "14 2 14 8 20 8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "13", x2: "16", y2: "13" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "17", x2: "12", y2: "17" })
  ] });
}
function NetMonIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M22 12h-4l-3 9L9 3l-3 9H2" }) });
}
function ScreenshotIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "13", r: "4" })
  ] });
}
function CalcIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4", y: "2", width: "16", height: "20", rx: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "6", x2: "16", y2: "6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "10", x2: "10", y2: "10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "10", x2: "14", y2: "10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "16", y1: "10", x2: "16", y2: "10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "14", x2: "10", y2: "14" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "14", x2: "14", y2: "14" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "16", y1: "14", x2: "16", y2: "14" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "18", x2: "10", y2: "18" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "18", x2: "16", y2: "18" })
  ] });
}
function CryptoIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
  ] });
}
function APIIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "16 18 22 12 16 6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "8 6 2 12 8 18" })
  ] });
}
function CertIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "8", r: "6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" })
  ] });
}
function DockerIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }) });
}
function GitIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "18", cy: "18", r: "3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "6", cy: "6", r: "3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "6", cy: "18", r: "3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6 9v3a2 2 0 0 0 2 2h4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "18", y1: "9", x2: "18", y2: "15" })
  ] });
}
function DBIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" })
  ] });
}
function MarkdownIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "14 2 14 8 20 8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M10 13H8v4H6V13H4v-2h6v2z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "14 13 16 15 18 13" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "16", y1: "15", x2: "16", y2: "17" })
  ] });
}
function TrashIcon$1() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "3 6 5 6 21 6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })
  ] });
}
function ShodanIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "4.93", y1: "4.93", x2: "9.17", y2: "9.17" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "14.83", y1: "14.83", x2: "19.07", y2: "19.07" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "14.83", y1: "9.17", x2: "19.07", y2: "4.93" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "4.93", y1: "19.07", x2: "9.17", y2: "14.83" })
  ] });
}
function OSINTIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "11", r: "8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "11", y1: "8", x2: "11", y2: "14" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "11", x2: "14", y2: "11" })
  ] });
}
function CVEIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "15", r: "1" })
  ] });
}
function AIIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "19", x2: "12", y2: "23" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "23", x2: "16", y2: "23" })
  ] });
}
function WordlistIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "6", x2: "21", y2: "6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "12", x2: "21", y2: "12" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "18", x2: "21", y2: "18" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "3", y1: "6", x2: "3.01", y2: "6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "3", y1: "12", x2: "3.01", y2: "12" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "3", y1: "18", x2: "3.01", y2: "18" })
  ] });
}
function JSONIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "16 18 22 12 16 6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "8 6 2 12 8 18" })
  ] });
}
function TOTPIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5", y: "11", width: "14", height: "10", rx: "2", ry: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8 11V7a4 4 0 0 1 8 0v4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "16", r: "1" })
  ] });
}
function RegexIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 3v3m0 12v3M3 12h3m12 0h3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1" })
  ] });
}
function EncodingIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "17 1 21 5 17 9" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 11V9a4 4 0 0 1 4-4h14" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "7 23 3 19 7 15" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 13v2a4 4 0 0 1-4 4H3" })
  ] });
}
function PacketIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" }) });
}
function BackupIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "17 8 12 3 7 8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "3", x2: "12", y2: "15" })
  ] });
}
function PWHealthIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }) });
}
function PomodoroIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "12 6 12 12 16 14" })
  ] });
}
function AuditIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "14 2 14 8 20 8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "16", y1: "13", x2: "8", y2: "13" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "16", y1: "17", x2: "8", y2: "17" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "10 9 9 9 8 9" })
  ] });
}
function CodeScanIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "9 12 11 14 15 10" })
  ] });
}
function WallpaperIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "21 15 16 10 5 21" })
  ] });
}
function ClipboardIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "2", width: "8", height: "4", rx: "1", ry: "1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "12", x2: "16", y2: "12" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "16", x2: "14", y2: "16" })
  ] });
}
function ColorPickerIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "13.5", cy: "6.5", r: "3.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "17.5", cy: "10.5", r: "3.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8.5", cy: "7.5", r: "3.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "6.5", cy: "12.5", r: "3.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "17", r: "4" })
  ] });
}
function UnitConvIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8 3H5a2 2 0 0 0-2 2v3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 8V5a2 2 0 0 0-2-2h-3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 16v3a2 2 0 0 0 2 2h3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 21h3a2 2 0 0 0 2-2v-3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "8", x2: "12", y2: "16" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "12", x2: "16", y2: "12" })
  ] });
}
function WorldClockIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "12", x2: "15", y2: "14" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2 12h2M20 12h2M12 2v2M12 20v2" })
  ] });
}
function ImageViewerIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "9", cy: "9", r: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 15l-5-5L5 21" })
  ] });
}
function RSSIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 11a9 9 0 0 1 9 9" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 4a16 16 0 0 1 16 16" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "5", cy: "19", r: "1", fill: "currentColor" })
  ] });
}
function RemoteDesktopIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "21", x2: "16", y2: "21" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "17", x2: "12", y2: "21" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 9l3 3-3 3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "13", y1: "15", x2: "17", y2: "15" })
  ] });
}
function Desktop() {
  const hasWindows = useWindowStore((s) => s.windows.some((w2) => !w2.minimized));
  const { windows, openApp, focusWindow, restoreWindow } = useWindowStore();
  const { icons, wallpaper, removeIcon, moveIcon, addIcon, setWallpaper } = useDesktopStore();
  const { desktop: pinnedDesktop, unpinDesktop } = usePinnedStore();
  const [ctx, setCtx] = reactExports.useState(null);
  const [appChooser, setAppChooser] = reactExports.useState(false);
  const handleBgCtx = reactExports.useCallback((e) => {
    if (e.target.closest("[data-desktop-icon]")) return;
    e.preventDefault();
    setCtx({ x: e.clientX, y: e.clientY, type: "bg" });
  }, []);
  const handleIconCtx = reactExports.useCallback((e, icon) => {
    e.preventDefault();
    e.stopPropagation();
    setCtx({ x: e.clientX, y: e.clientY, type: "icon", iconId: icon.id, iconAppId: icon.appId });
  }, []);
  const pickWallpaper = reactExports.useCallback(async () => {
    try {
      const path = await window.cryogram.system?.pickWallpaper?.();
      if (path) {
        setWallpaper(path);
        window.cryogram.system?.setWallpaper?.(path);
      }
    } catch {
    }
  }, [setWallpaper]);
  const removeWallpaper = reactExports.useCallback(() => setWallpaper(""), [setWallpaper]);
  const bgItems = [
    { label: "Add App to Desktop", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PlusIcon, {}), action: () => setAppChooser(true) },
    { sep: true },
    { label: "Change Wallpaper", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageIcon, {}), action: pickWallpaper },
    ...wallpaper ? [{ label: "Remove Wallpaper", action: removeWallpaper }] : []
  ];
  const iconItems = (icon) => {
    const win = windows.find((w2) => w2.appId === icon.appId);
    return [
      {
        label: win ? "Focus Window" : "Open",
        icon: win ? /* @__PURE__ */ jsxRuntimeExports.jsx(FocusIcon, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(OpenIcon, {}),
        action: () => {
          if (!win) openApp(icon.appId);
          else {
            restoreWindow(win.id);
            focusWindow(win.id);
          }
        }
      },
      { sep: true },
      { label: "Remove from Desktop", danger: true, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrashIcon, {}), action: () => removeIcon(icon.id) }
    ];
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 select-none", onContextMenu: handleBgCtx, children: [
    !wallpaper && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 flex items-center justify-center pointer-events-none",
        style: { opacity: 0.012 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-black",
            style: {
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "22vw",
              color: "var(--cryo-accent)",
              letterSpacing: "0.08em"
            },
            children: "CG"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "absolute inset-0 flex flex-col items-center justify-center gap-3 pb-32 pointer-events-none",
        animate: { opacity: hasWindows || icons.length > 0 || pinnedDesktop.length > 0 ? 0 : 1 },
        transition: { duration: 0.5 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.9, duration: 0.6 },
            className: "flex flex-col items-center gap-2.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    fontSize: 13,
                    color: "rgba(255,255,255,0.2)",
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                    letterSpacing: "0.01em"
                  },
                  children: "Open an app from the dock · Right-click for options"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  animate: { y: [0, 5, 0] },
                  transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "rgba(255,255,255,0.18)", strokeWidth: "2", strokeLinecap: "round", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "19 12 12 19 5 12" })
                  ] })
                }
              )
            ]
          }
        )
      }
    ),
    icons.map((icon) => {
      const meta = APP_META[icon.appId];
      if (!meta) return null;
      const win = windows.find((w2) => w2.appId === icon.appId);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        DesktopIconItem,
        {
          icon,
          meta,
          isOpen: !!win,
          onContextMenu: handleIconCtx,
          onMove: moveIcon,
          onOpen: () => {
            if (!win) openApp(icon.appId);
            else {
              restoreWindow(win.id);
              focusWindow(win.id);
            }
          }
        },
        icon.id
      );
    }),
    pinnedDesktop.map((app, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExternalDesktopIcon,
      {
        app,
        offsetIndex: icons.length + i,
        onRemove: () => unpinDesktop(app.id)
      },
      app.id
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "absolute left-5 flex items-center gap-2 pointer-events-none",
        style: { bottom: 88, fontFamily: '"JetBrains Mono", monospace', fontSize: 9.5 },
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 1.5, duration: 0.8 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.span,
            {
              className: "w-1.5 h-1.5 rounded-full",
              style: { background: "#00ff88", boxShadow: "0 0 6px rgba(0,255,136,0.8)" },
              animate: { opacity: [1, 0.3, 1] },
              transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(80,100,120,0.45)", letterSpacing: "0.1em" }, children: "ALL SYSTEMS OPERATIONAL" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: ctx && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ContextMenu,
      {
        x: ctx.x,
        y: ctx.y,
        onClose: () => setCtx(null),
        items: ctx.type === "bg" ? bgItems : iconItems({ id: ctx.iconId, appId: ctx.iconAppId })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: appChooser && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppChooserOverlay,
      {
        onClose: () => setAppChooser(false),
        onPickInternal: (appId) => {
          addIcon(appId);
          setAppChooser(false);
        }
      }
    ) })
  ] });
}
function DesktopIconItem({ icon, meta, isOpen, onContextMenu, onMove, onOpen }) {
  const x2 = useMotionValue(icon.x);
  const y2 = useMotionValue(icon.y);
  reactExports.useEffect(() => {
    x2.set(icon.x);
    y2.set(icon.y);
  }, [icon.x, icon.y]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      "data-desktop-icon": true,
      drag: true,
      dragMomentum: false,
      style: { position: "absolute", top: 0, left: 0, x: x2, y: y2, width: 76, touchAction: "none", zIndex: 10 },
      onDragEnd: () => onMove(icon.id, Math.max(0, Math.round(x2.get())), Math.max(28, Math.round(y2.get()))),
      className: "flex flex-col items-center cursor-default",
      onContextMenu: (e) => onContextMenu(e, icon),
      onDoubleClick: onOpen,
      whileTap: { scale: 0.88 },
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { type: "spring", stiffness: 440, damping: 22 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "w-[56px] h-[56px] rounded-[16px] flex items-center justify-center relative overflow-hidden",
            style: {
              background: `radial-gradient(ellipse at 38% 28%, ${meta.color}28, rgba(8,12,20,0.9) 70%)`,
              border: `1px solid ${isOpen ? `${meta.color}45` : "rgba(255,255,255,0.1)"}`,
              boxShadow: isOpen ? `0 0 18px ${meta.color}22, 0 4px 18px rgba(0,0,0,0.6)` : "0 4px 16px rgba(0,0,0,0.55)",
              backdropFilter: "blur(12px)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute inset-0 pointer-events-none",
                  style: { background: "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, transparent 55%)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: meta.color }, children: meta.icon })
            ]
          }
        ),
        isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-1 h-1 rounded-full mt-0.5",
            style: { background: meta.color, boxShadow: `0 0 4px ${meta.color}` }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "mt-1.5 text-center px-1 leading-snug",
            style: {
              fontSize: 10.5,
              color: "rgba(255,255,255,0.9)",
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              textShadow: "0 1px 6px rgba(0,0,0,0.95)",
              maxWidth: 76,
              wordBreak: "break-word"
            },
            children: meta.label
          }
        )
      ]
    }
  );
}
function ExternalDesktopIcon({
  app,
  offsetIndex,
  onRemove
}) {
  const col = offsetIndex % 4;
  const row = Math.floor(offsetIndex / 4);
  const [pos, setPos] = reactExports.useState({ x: 24 + col * 104, y: 36 + row * 110 });
  const mx = useMotionValue(pos.x);
  const my = useMotionValue(pos.y);
  const [ctxOpen, setCtxOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        "data-desktop-icon": true,
        drag: true,
        dragMomentum: false,
        style: { position: "absolute", top: 0, left: 0, x: mx, y: my, width: 76, touchAction: "none", zIndex: 10 },
        onDragEnd: () => setPos({ x: Math.max(0, Math.round(mx.get())), y: Math.max(28, Math.round(my.get())) }),
        className: "flex flex-col items-center cursor-default",
        onContextMenu: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setCtxOpen(true);
        },
        onDoubleClick: () => window.cryogram?.launcher?.launch(app),
        whileTap: { scale: 0.88 },
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { type: "spring", stiffness: 440, damping: 22 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "w-[56px] h-[56px] rounded-[16px] flex items-center justify-center relative overflow-hidden",
              style: {
                background: "radial-gradient(ellipse at 38% 28%, var(--cryo-a18), rgba(8,12,20,0.9) 70%)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.55)",
                backdropFilter: "blur(12px)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute inset-0 pointer-events-none",
                    style: { background: "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, transparent 55%)" }
                  }
                ),
                app.icon ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: app.icon,
                    alt: "",
                    style: { width: 34, height: 34, objectFit: "contain" },
                    onError: (e) => {
                      e.target.style.display = "none";
                    }
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 26 }, children: "📦" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "mt-1.5 text-center px-1 leading-snug",
              style: {
                fontSize: 10.5,
                color: "rgba(255,255,255,0.9)",
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                textShadow: "0 1px 6px rgba(0,0,0,0.95)",
                maxWidth: 76,
                wordBreak: "break-word"
              },
              children: app.name
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: ctxOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ContextMenu,
      {
        x: pos.x + 38,
        y: pos.y + 44,
        onClose: () => setCtxOpen(false),
        items: [
          { label: `Open ${app.name}`, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(OpenIcon, {}), action: () => {
            window.cryogram?.launcher?.launch(app);
          } },
          { sep: true },
          { label: "Remove from Desktop", danger: true, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrashIcon, {}), action: onRemove }
        ]
      }
    ) })
  ] });
}
function AppChooserOverlay({
  onClose,
  onPickInternal
}) {
  const [search, setSearch] = reactExports.useState("");
  const [externalApps, setExternal] = reactExports.useState([]);
  const [launching, setLaunching] = reactExports.useState(null);
  const existingIds = useDesktopStore((s) => s.icons.map((i) => i.appId));
  const searchRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    searchRef.current?.focus();
    window.cryogram.launcher.getApps().then(setExternal).catch(() => {
    });
  }, []);
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const internalApps = Object.entries(APP_META);
  const lc2 = search.toLowerCase();
  const filteredInternal = lc2 ? internalApps.filter(([, m2]) => m2.label.toLowerCase().includes(lc2)) : internalApps;
  const filteredExternal = lc2 ? externalApps.filter((a) => a.name.toLowerCase().includes(lc2) || a.comment?.toLowerCase().includes(lc2)) : externalApps;
  const launchExternal = async (app) => {
    setLaunching(app.desktopFile);
    try {
      await window.cryogram.launcher.launch(app);
    } catch {
    }
    setTimeout(() => setLaunching(null), 1500);
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "absolute inset-0 flex flex-col items-center",
      style: {
        background: "rgba(5,8,15,0.88)",
        backdropFilter: "blur(40px)",
        zIndex: 8e3
      },
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.22 },
      onClick: (e) => {
        if (e.target === e.currentTarget) onClose();
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "mt-16 mb-8",
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            transition: { type: "spring", stiffness: 400, damping: 28, delay: 0.04 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-3 px-4 py-2.5",
                style: {
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 14,
                  width: 380,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.4)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "rgba(255,255,255,0.35)", strokeWidth: "2", strokeLinecap: "round", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "11", r: "8" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: searchRef,
                      value: search,
                      onChange: (e) => setSearch(e.target.value),
                      placeholder: "Search apps…",
                      className: "flex-1 bg-transparent outline-none",
                      style: {
                        color: "rgba(255,255,255,0.88)",
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                        fontSize: 15,
                        caretColor: "var(--cryo-accent)"
                      }
                    }
                  ),
                  search && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSearch(""), style: { color: "rgba(255,255,255,0.3)", fontSize: 16, lineHeight: 1 }, children: "✕" })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto w-full px-8 pb-16", style: { maxWidth: 900 }, children: [
          filteredInternal.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { type: "spring", stiffness: 380, damping: 28, delay: 0.07 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "text-xs font-semibold mb-3 pl-1",
                    style: {
                      color: "rgba(255,255,255,0.28)",
                      fontFamily: "-apple-system, sans-serif",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase"
                    },
                    children: "Cryogram Apps"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-6 gap-3 mb-8", children: filteredInternal.map(([appId, meta]) => {
                  const added = existingIds.includes(appId);
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AppTile,
                    {
                      label: meta.label,
                      color: meta.color,
                      icon: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: meta.color }, children: meta.icon }),
                      added,
                      onClick: () => {
                        if (!added) onPickInternal(appId);
                      },
                      buttonLabel: added ? "Added" : "Add to Desktop"
                    },
                    appId
                  );
                }) })
              ]
            }
          ),
          filteredExternal.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { type: "spring", stiffness: 380, damping: 28, delay: 0.12 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "text-xs font-semibold mb-3 pl-1",
                    style: {
                      color: "rgba(255,255,255,0.28)",
                      fontFamily: "-apple-system, sans-serif",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase"
                    },
                    children: "Installed Apps"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-6 gap-3", children: filteredExternal.map((app) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AppTile,
                  {
                    label: app.name,
                    color: "var(--cryo-accent)",
                    icon: app.icon ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: app.icon,
                        alt: "",
                        style: { width: 32, height: 32, objectFit: "contain" },
                        onError: (e) => {
                          e.target.style.display = "none";
                        }
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 26 }, children: "📦" }),
                    added: false,
                    onClick: () => launchExternal(app),
                    buttonLabel: launching === app.desktopFile ? "Launching…" : "Launch"
                  },
                  app.desktopFile
                )) })
              ]
            }
          ),
          filteredInternal.length === 0 && filteredExternal.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center mt-20",
              style: { color: "rgba(255,255,255,0.25)", fontFamily: "-apple-system, sans-serif", fontSize: 14 },
              children: [
                'No apps found for "',
                search,
                '"'
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "mb-6",
            style: { fontSize: 11, color: "rgba(255,255,255,0.18)", fontFamily: "-apple-system, sans-serif" },
            children: "Press Esc or click outside to dismiss"
          }
        )
      ]
    }
  );
}
function AppTile({
  label,
  color: color2,
  icon,
  added,
  onClick,
  buttonLabel
}) {
  const [hov, setHov] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      onClick,
      disabled: added,
      className: "flex flex-col items-center gap-2 p-3 rounded-2xl",
      style: {
        background: hov && !added ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
        border: hov && !added ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.05)",
        cursor: added ? "default" : "pointer",
        opacity: added ? 0.45 : 1,
        transition: "background 0.12s, border-color 0.12s"
      },
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      whileTap: !added ? { scale: 0.9 } : {},
      transition: { type: "spring", stiffness: 500, damping: 24 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "w-14 h-14 rounded-[16px] flex items-center justify-center relative overflow-hidden",
            style: {
              background: `radial-gradient(ellipse at 38% 28%, ${color2 === "var(--cryo-accent)" ? "rgba(0,212,255,0.18)" : color2 + "25"}, rgba(8,12,20,0.92) 70%)`,
              border: `1px solid rgba(255,255,255,${hov ? "0.14" : "0.07"})`,
              boxShadow: hov ? `0 0 20px ${color2 === "var(--cryo-accent)" ? "rgba(0,212,255,0.15)" : color2 + "20"}` : "none",
              transition: "box-shadow 0.15s, border-color 0.15s"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute inset-0 pointer-events-none",
                  style: { background: "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, transparent 55%)" }
                }
              ),
              icon
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              fontSize: 10,
              color: "rgba(255,255,255,0.72)",
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              textAlign: "center",
              lineHeight: 1.3,
              maxWidth: 80,
              wordBreak: "break-word"
            },
            children: label
          }
        ),
        added && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: "var(--cryo-a50)", fontFamily: "-apple-system, sans-serif" }, children: buttonLabel })
      ]
    }
  );
}
function PlusIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" })
  ] });
}
function ImageIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "21 15 16 10 5 21" })
  ] });
}
function OpenIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "15 3 21 3 21 9" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "10", y1: "14", x2: "21", y2: "3" })
  ] });
}
function FocusIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2v4M12 18v4M2 12h4M18 12h4" })
  ] });
}
function TrashIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "3 6 5 6 21 6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M10 11v6M14 11v6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" })
  ] });
}
const scriptRel = function detectScriptRel() {
  const relList = typeof document !== "undefined" && document.createElement("link").relList;
  return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
}();
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep, importerUrl);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        const isBaseRelative = !!importerUrl;
        if (isBaseRelative) {
          for (let i = links.length - 1; i >= 0; i--) {
            const link2 = links[i];
            if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
              return;
            }
          }
        } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
class AppCrashBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = { crashed: false, error: "" };
  }
  static getDerivedStateFromError(error) {
    return { crashed: true, error: error.message };
  }
  componentDidCatch(error) {
    console.error(`[AppCrashBoundary] ${this.props.appId ?? "unknown"}:`, error);
  }
  render() {
    if (!this.state.crashed) return this.props.children;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, background: "rgba(8,12,20,0.9)", padding: 24 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 40 }, children: "💥" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 15, fontWeight: 700, color: "#f87171" }, children: "App Crashed" }),
      this.props.appId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.4)" }, children: this.props.appId }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "JetBrains Mono, monospace", background: "rgba(248,113,113,0.08)", padding: "8px 14px", borderRadius: 8, maxWidth: 420, textAlign: "center", wordBreak: "break-all" }, children: this.state.error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => this.setState({ crashed: false, error: "" }),
          style: { marginTop: 8, padding: "7px 20px", background: "var(--cryo-accent)", color: "#000", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" },
          children: "Reload App"
        }
      )
    ] });
  }
}
const TerminalApp = reactExports.lazy(() => __vitePreload(() => import("./Terminal-Bw2WvJex.js"), true ? __vite__mapDeps([0,1]) : void 0, import.meta.url));
const EditorApp = reactExports.lazy(() => __vitePreload(() => import("./Editor-BgAE-Fdq.js"), true ? [] : void 0, import.meta.url));
const PasswordTesterApp = reactExports.lazy(() => __vitePreload(() => import("./PasswordTester-DfJtRILv.js"), true ? [] : void 0, import.meta.url));
const LeakerApp = reactExports.lazy(() => __vitePreload(() => import("./LeakerApp-BqQG_hS3.js"), true ? [] : void 0, import.meta.url));
const SettingsApp = reactExports.lazy(() => __vitePreload(() => import("./SettingsApp-BGBY9uYd.js"), true ? [] : void 0, import.meta.url));
const FilesApp = reactExports.lazy(() => __vitePreload(() => import("./FilesApp-D9NFWo9-.js"), true ? [] : void 0, import.meta.url));
const LauncherApp = reactExports.lazy(() => __vitePreload(() => import("./LauncherApp-DRE1sKva.js"), true ? [] : void 0, import.meta.url));
const OpticSEOApp = reactExports.lazy(() => __vitePreload(() => import("./OpticSEOApp-BgEc9zRk.js"), true ? [] : void 0, import.meta.url));
const PhoneApp = reactExports.lazy(() => __vitePreload(() => import("./PhoneApp-DnZsdE20.js"), true ? [] : void 0, import.meta.url));
const NetworkScannerApp = reactExports.lazy(() => __vitePreload(() => import("./NetworkScannerApp-Bi2mGqQI.js"), true ? [] : void 0, import.meta.url));
const VPNApp = reactExports.lazy(() => __vitePreload(() => import("./VPNApp--_MQfRZ4.js"), true ? [] : void 0, import.meta.url));
const NotesApp = reactExports.lazy(() => __vitePreload(() => import("./NotesApp-C6LG-RuL.js"), true ? [] : void 0, import.meta.url));
const MailApp = reactExports.lazy(() => __vitePreload(() => import("./MailApp-BrMn9-wu.js"), true ? [] : void 0, import.meta.url));
const PasswordManagerApp = reactExports.lazy(() => __vitePreload(() => import("./PasswordManagerApp-BNNkPtYQ.js"), true ? [] : void 0, import.meta.url));
const SSHKeyManagerApp = reactExports.lazy(() => __vitePreload(() => import("./SSHKeyManagerApp-D78XmcZD.js"), true ? [] : void 0, import.meta.url));
const FirewallApp = reactExports.lazy(() => __vitePreload(() => import("./FirewallApp-CtZ_eDcY.js"), true ? [] : void 0, import.meta.url));
const TaskManagerApp = reactExports.lazy(() => __vitePreload(() => import("./TaskManagerApp-CaUeUbTc.js"), true ? [] : void 0, import.meta.url));
const LogViewerApp = reactExports.lazy(() => __vitePreload(() => import("./LogViewerApp-C_WD_6or.js"), true ? [] : void 0, import.meta.url));
const NetworkMonitorApp = reactExports.lazy(() => __vitePreload(() => import("./NetworkMonitorApp-CwvzJJNG.js"), true ? [] : void 0, import.meta.url));
const ScreenshotApp = reactExports.lazy(() => __vitePreload(() => import("./ScreenshotApp-CRWc80RU.js"), true ? [] : void 0, import.meta.url));
const CalculatorApp = reactExports.lazy(() => __vitePreload(() => import("./CalculatorApp-CXLyxGyY.js"), true ? [] : void 0, import.meta.url));
const CryptoToolsApp = reactExports.lazy(() => __vitePreload(() => import("./CryptoToolsApp-Ct-DbV9W.js"), true ? [] : void 0, import.meta.url));
const APITesterApp = reactExports.lazy(() => __vitePreload(() => import("./APITesterApp-C5FuRAxo.js"), true ? [] : void 0, import.meta.url));
const CertInspectorApp = reactExports.lazy(() => __vitePreload(() => import("./CertInspectorApp-DtX4L1Ue.js"), true ? [] : void 0, import.meta.url));
const DockerApp = reactExports.lazy(() => __vitePreload(() => import("./DockerApp-CFl-XGTM.js"), true ? [] : void 0, import.meta.url));
const GitApp = reactExports.lazy(() => __vitePreload(() => import("./GitApp-DrLGTE-V.js"), true ? [] : void 0, import.meta.url));
const DatabaseApp = reactExports.lazy(() => __vitePreload(() => import("./DatabaseApp-rM3DkEuj.js"), true ? [] : void 0, import.meta.url));
const MarkdownEditorApp = reactExports.lazy(() => __vitePreload(() => import("./MarkdownEditorApp-D0n3_obQ.js"), true ? [] : void 0, import.meta.url));
const TrashApp = reactExports.lazy(() => __vitePreload(() => import("./TrashApp-WsCR826B.js"), true ? [] : void 0, import.meta.url));
const ShodanApp = reactExports.lazy(() => __vitePreload(() => import("./ShodanApp-MSSwvXiZ.js"), true ? [] : void 0, import.meta.url));
const OSINTApp = reactExports.lazy(() => __vitePreload(() => import("./OSINTApp-Zys-Ektj.js"), true ? [] : void 0, import.meta.url));
const CVEApp = reactExports.lazy(() => __vitePreload(() => import("./CVEApp-DRSVpS9c.js"), true ? [] : void 0, import.meta.url));
const AIAssistantApp = reactExports.lazy(() => __vitePreload(() => import("./AIAssistantApp-BJTNdHED.js"), true ? [] : void 0, import.meta.url));
const WordlistsApp = reactExports.lazy(() => __vitePreload(() => import("./WordlistsApp-BbnLnygr.js"), true ? [] : void 0, import.meta.url));
const JSONExplorerApp = reactExports.lazy(() => __vitePreload(() => import("./JSONExplorerApp-65W2a5L9.js"), true ? [] : void 0, import.meta.url));
const TOTPApp = reactExports.lazy(() => __vitePreload(() => import("./TOTPApp-vx41ugCv.js"), true ? [] : void 0, import.meta.url));
const RegexApp = reactExports.lazy(() => __vitePreload(() => import("./RegexApp-CSZW529L.js"), true ? [] : void 0, import.meta.url));
const EncodingChainApp = reactExports.lazy(() => __vitePreload(() => import("./EncodingChainApp-y-qtCO4y.js"), true ? [] : void 0, import.meta.url));
const PacketSnifferApp = reactExports.lazy(() => __vitePreload(() => import("./PacketSnifferApp-B3kJS_Yq.js"), true ? [] : void 0, import.meta.url));
const BackupApp = reactExports.lazy(() => __vitePreload(() => import("./BackupApp-DRZYkRZd.js"), true ? [] : void 0, import.meta.url));
const PasswordHealthApp = reactExports.lazy(() => __vitePreload(() => import("./PasswordHealthApp-AbwWaJpl.js"), true ? [] : void 0, import.meta.url));
const PomodoroApp = reactExports.lazy(() => __vitePreload(() => import("./PomodoroApp-BlaM7Lc2.js"), true ? [] : void 0, import.meta.url));
const AuditLogApp = reactExports.lazy(() => __vitePreload(() => import("./AuditLogApp-wxAF-Egq.js"), true ? [] : void 0, import.meta.url));
const CodeScannerApp = reactExports.lazy(() => __vitePreload(() => import("./CodeScannerApp-D5UGEbKr.js"), true ? [] : void 0, import.meta.url));
const WallpaperApp = reactExports.lazy(() => __vitePreload(() => import("./WallpaperApp-DekrpJs9.js"), true ? [] : void 0, import.meta.url));
const ClipboardHistoryApp = reactExports.lazy(() => __vitePreload(() => import("./ClipboardHistoryApp-BX79pCBy.js"), true ? [] : void 0, import.meta.url));
const ColorPickerApp = reactExports.lazy(() => __vitePreload(() => import("./ColorPickerApp-CFCVMjbo.js"), true ? [] : void 0, import.meta.url));
const UnitConverterApp = reactExports.lazy(() => __vitePreload(() => import("./UnitConverterApp-BMIbIxQQ.js"), true ? [] : void 0, import.meta.url));
const WorldClockApp = reactExports.lazy(() => __vitePreload(() => import("./WorldClockApp-BZ1qD1EC.js"), true ? [] : void 0, import.meta.url));
const ImageViewerApp = reactExports.lazy(() => __vitePreload(() => import("./ImageViewerApp-DTC2jYeA.js"), true ? [] : void 0, import.meta.url));
const RSSReaderApp = reactExports.lazy(() => __vitePreload(() => import("./RSSReaderApp-DP6EGZKS.js"), true ? [] : void 0, import.meta.url));
const RemoteDesktopApp = reactExports.lazy(() => __vitePreload(() => import("./RemoteDesktopApp-DgNhsauX.js"), true ? [] : void 0, import.meta.url));
const APP_COLORS$1 = {
  terminal: "#00ff88",
  editor: "#00d4ff",
  "password-tester": "#ffcc00",
  leaker: "#ff4466",
  settings: "#bb88ff",
  files: "#f59e0b",
  launcher: "#34d399",
  system: "#818cf8",
  opticseo: "#10b981",
  phone: "#a855f7",
  scanner: "#00ff88",
  vpn: "#a78bfa",
  notes: "#fbbf24",
  mail: "#ea4335",
  passwords: "#ffcc00",
  "ssh-keys": "#00d4ff",
  firewall: "#ff4466",
  "task-manager": "#818cf8",
  logs: "#a855f7",
  netmon: "#00d4ff",
  screenshot: "#34d399",
  calculator: "#facc15",
  "crypto-tools": "#00d4ff",
  "api-tester": "#fb923c",
  "cert-inspector": "#4ade80",
  docker: "#2496ed",
  git: "#f05033",
  database: "#a855f7",
  markdown: "#818cf8",
  trash: "#94a3b8",
  shodan: "#ef4444",
  osint: "#fb923c",
  cve: "#f97316",
  "ai-assistant": "#a78bfa",
  wordlists: "#4ade80",
  "json-explorer": "#fbbf24",
  totp: "#00d4ff",
  regex: "#818cf8",
  "encoding-chain": "#34d399",
  "packet-sniffer": "#22c55e",
  backup: "#4ade80",
  "password-health": "#f472b6",
  pomodoro: "#ef4444",
  "audit-log": "#94a3b8",
  "code-scanner": "#ff4466",
  wallpaper: "#818cf8",
  "clipboard-history": "#a78bfa",
  "color-picker": "#f472b6",
  "unit-converter": "#22d3ee",
  "world-clock": "#60a5fa",
  "image-viewer": "#34d399",
  "rss-reader": "#fb923c",
  "remote-desktop": "#10b981"
};
function AppContent({ appId }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppCrashBoundary, { appId, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    reactExports.Suspense,
    {
      fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          className: "w-5 h-5 rounded-full border-2",
          style: { borderColor: "rgba(255,255,255,0.1)", borderTopColor: "var(--cryo-accent)" },
          animate: { rotate: 360 },
          transition: { duration: 0.8, repeat: Infinity, ease: "linear" }
        }
      ) }),
      children: [
        appId === "terminal" && /* @__PURE__ */ jsxRuntimeExports.jsx(TerminalApp, {}),
        appId === "editor" && /* @__PURE__ */ jsxRuntimeExports.jsx(EditorApp, {}),
        appId === "password-tester" && /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordTesterApp, {}),
        appId === "leaker" && /* @__PURE__ */ jsxRuntimeExports.jsx(LeakerApp, {}),
        (appId === "settings" || appId === "system") && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsApp, {}),
        appId === "files" && /* @__PURE__ */ jsxRuntimeExports.jsx(FilesApp, {}),
        appId === "launcher" && /* @__PURE__ */ jsxRuntimeExports.jsx(LauncherApp, {}),
        appId === "opticseo" && /* @__PURE__ */ jsxRuntimeExports.jsx(OpticSEOApp, {}),
        appId === "phone" && /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneApp, {}),
        appId === "scanner" && /* @__PURE__ */ jsxRuntimeExports.jsx(NetworkScannerApp, {}),
        appId === "vpn" && /* @__PURE__ */ jsxRuntimeExports.jsx(VPNApp, {}),
        appId === "notes" && /* @__PURE__ */ jsxRuntimeExports.jsx(NotesApp, {}),
        appId === "mail" && /* @__PURE__ */ jsxRuntimeExports.jsx(MailApp, {}),
        appId === "passwords" && /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordManagerApp, {}),
        appId === "ssh-keys" && /* @__PURE__ */ jsxRuntimeExports.jsx(SSHKeyManagerApp, {}),
        appId === "firewall" && /* @__PURE__ */ jsxRuntimeExports.jsx(FirewallApp, {}),
        appId === "task-manager" && /* @__PURE__ */ jsxRuntimeExports.jsx(TaskManagerApp, {}),
        appId === "logs" && /* @__PURE__ */ jsxRuntimeExports.jsx(LogViewerApp, {}),
        appId === "netmon" && /* @__PURE__ */ jsxRuntimeExports.jsx(NetworkMonitorApp, {}),
        appId === "screenshot" && /* @__PURE__ */ jsxRuntimeExports.jsx(ScreenshotApp, {}),
        appId === "calculator" && /* @__PURE__ */ jsxRuntimeExports.jsx(CalculatorApp, {}),
        appId === "crypto-tools" && /* @__PURE__ */ jsxRuntimeExports.jsx(CryptoToolsApp, {}),
        appId === "api-tester" && /* @__PURE__ */ jsxRuntimeExports.jsx(APITesterApp, {}),
        appId === "cert-inspector" && /* @__PURE__ */ jsxRuntimeExports.jsx(CertInspectorApp, {}),
        appId === "docker" && /* @__PURE__ */ jsxRuntimeExports.jsx(DockerApp, {}),
        appId === "git" && /* @__PURE__ */ jsxRuntimeExports.jsx(GitApp, {}),
        appId === "database" && /* @__PURE__ */ jsxRuntimeExports.jsx(DatabaseApp, {}),
        appId === "markdown" && /* @__PURE__ */ jsxRuntimeExports.jsx(MarkdownEditorApp, {}),
        appId === "trash" && /* @__PURE__ */ jsxRuntimeExports.jsx(TrashApp, {}),
        appId === "shodan" && /* @__PURE__ */ jsxRuntimeExports.jsx(ShodanApp, {}),
        appId === "osint" && /* @__PURE__ */ jsxRuntimeExports.jsx(OSINTApp, {}),
        appId === "cve" && /* @__PURE__ */ jsxRuntimeExports.jsx(CVEApp, {}),
        appId === "ai-assistant" && /* @__PURE__ */ jsxRuntimeExports.jsx(AIAssistantApp, {}),
        appId === "wordlists" && /* @__PURE__ */ jsxRuntimeExports.jsx(WordlistsApp, {}),
        appId === "json-explorer" && /* @__PURE__ */ jsxRuntimeExports.jsx(JSONExplorerApp, {}),
        appId === "totp" && /* @__PURE__ */ jsxRuntimeExports.jsx(TOTPApp, {}),
        appId === "regex" && /* @__PURE__ */ jsxRuntimeExports.jsx(RegexApp, {}),
        appId === "encoding-chain" && /* @__PURE__ */ jsxRuntimeExports.jsx(EncodingChainApp, {}),
        appId === "packet-sniffer" && /* @__PURE__ */ jsxRuntimeExports.jsx(PacketSnifferApp, {}),
        appId === "backup" && /* @__PURE__ */ jsxRuntimeExports.jsx(BackupApp, {}),
        appId === "password-health" && /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordHealthApp, {}),
        appId === "pomodoro" && /* @__PURE__ */ jsxRuntimeExports.jsx(PomodoroApp, {}),
        appId === "audit-log" && /* @__PURE__ */ jsxRuntimeExports.jsx(AuditLogApp, {}),
        appId === "code-scanner" && /* @__PURE__ */ jsxRuntimeExports.jsx(CodeScannerApp, {}),
        appId === "wallpaper" && /* @__PURE__ */ jsxRuntimeExports.jsx(WallpaperApp, {}),
        appId === "clipboard-history" && /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardHistoryApp, {}),
        appId === "color-picker" && /* @__PURE__ */ jsxRuntimeExports.jsx(ColorPickerApp, {}),
        appId === "unit-converter" && /* @__PURE__ */ jsxRuntimeExports.jsx(UnitConverterApp, {}),
        appId === "world-clock" && /* @__PURE__ */ jsxRuntimeExports.jsx(WorldClockApp, {}),
        appId === "image-viewer" && /* @__PURE__ */ jsxRuntimeExports.jsx(ImageViewerApp, {}),
        appId === "rss-reader" && /* @__PURE__ */ jsxRuntimeExports.jsx(RSSReaderApp, {}),
        appId === "remote-desktop" && /* @__PURE__ */ jsxRuntimeExports.jsx(RemoteDesktopApp, {})
      ]
    }
  ) });
}
function SnapPreview({ zone }) {
  if (!zone) return null;
  const style = {
    position: "fixed",
    zIndex: 99998,
    pointerEvents: "none",
    background: "var(--cryo-accent, #00d4ff)",
    opacity: 0.08,
    border: "1px solid var(--cryo-accent, #00d4ff)",
    borderRadius: 8,
    top: zone === "top" ? 0 : 36,
    ...zone === "left" && { left: 0, width: "50vw", bottom: 72 },
    ...zone === "right" && { left: "50vw", width: "50vw", bottom: 72 },
    ...zone === "top" && { left: 0, right: 0, top: 0, bottom: 0, borderRadius: 0 }
  };
  return reactDomExports.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
        style
      },
      zone
    ) }),
    document.body
  );
}
function AppWindow({ window: win }) {
  const { closeWindow, focusWindow, moveWindow, minimizeWindow, toggleMaximize, resizeWindow: resizeWindow2 } = useWindowStore();
  const dragRef = reactExports.useRef(null);
  const snapZoneRef = reactExports.useRef(null);
  const [titleHovered, setTitleHovered] = reactExports.useState(false);
  const [snapOverlay, setSnapOverlay] = reactExports.useState(null);
  const accent = APP_COLORS$1[win.appId] ?? "var(--cryo-accent)";
  const onTitleBarMouseDown = reactExports.useCallback(
    (e) => {
      if (e.button !== 0 || win.maximized) return;
      focusWindow(win.id);
      dragRef.current = { startX: e.clientX, startY: e.clientY, winX: win.x, winY: win.y };
      const onMove = (ev) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        const newX = Math.max(-win.width + 120, Math.min(window.innerWidth - 120, dragRef.current.winX + dx));
        const newY = Math.max(0, Math.min(window.innerHeight - 40, dragRef.current.winY + dy));
        moveWindow(win.id, newX, newY);
        let zone = null;
        if (ev.clientX < 80) zone = "left";
        else if (ev.clientX > window.innerWidth - 80) zone = "right";
        else if (ev.clientY < 10) zone = "top";
        if (zone !== snapZoneRef.current) {
          snapZoneRef.current = zone;
          setSnapOverlay(zone);
        }
      };
      const onUp = () => {
        const zone = snapZoneRef.current;
        if (zone === "left") {
          moveWindow(win.id, 0, 36);
          resizeWindow2(win.id, window.innerWidth / 2, window.innerHeight - 36 - 72);
        } else if (zone === "right") {
          moveWindow(win.id, window.innerWidth / 2, 36);
          resizeWindow2(win.id, window.innerWidth / 2, window.innerHeight - 36 - 72);
        } else if (zone === "top") {
          toggleMaximize(win.id);
        }
        snapZoneRef.current = null;
        setSnapOverlay(null);
        dragRef.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [win.id, win.x, win.y, win.maximized, focusWindow, moveWindow, resizeWindow2, toggleMaximize]
  );
  const radius = win.maximized ? 0 : 12;
  const minimizeAnim = win.minimized ? { opacity: 0, scale: 0.55, y: 140, filter: "blur(8px)" } : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SnapPreview, { zone: snapOverlay }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "absolute flex flex-col overflow-hidden pointer-events-auto",
        style: {
          left: win.x,
          top: win.y,
          width: win.width,
          height: win.height,
          zIndex: win.zIndex,
          borderRadius: radius,
          background: "rgba(10,14,22,0.94)",
          backdropFilter: "blur(32px) saturate(1.6)",
          WebkitBackdropFilter: "blur(32px) saturate(1.6)",
          border: win.maximized ? "none" : win.focused ? `1px solid ${accent}50` : "1px solid rgba(255,255,255,0.07)",
          boxShadow: win.maximized ? "none" : win.focused ? `0 0 0 1px ${accent}14, 0 28px 72px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.5)` : "0 8px 40px rgba(0,0,0,0.7)",
          pointerEvents: win.minimized ? "none" : void 0,
          transition: "border-color 0.15s, box-shadow 0.2s"
        },
        initial: { opacity: 0, scale: 0.9, y: 20, filter: "blur(4px)" },
        animate: {
          ...minimizeAnim,
          borderRadius: radius,
          left: win.x,
          top: win.y,
          width: win.width,
          height: win.height
        },
        exit: { opacity: 0, scale: 0.86, y: -12, filter: "blur(6px)" },
        transition: win.minimized ? { type: "spring", stiffness: 340, damping: 26 } : { type: "spring", stiffness: 420, damping: 24 },
        onMouseDown: () => focusWindow(win.id),
        children: [
          !win.maximized && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-x-0 top-0 h-px pointer-events-none",
              style: {
                background: win.focused ? `linear-gradient(90deg, transparent 5%, ${accent}80 40%, ${accent}80 60%, transparent 95%)` : "transparent",
                transition: "background 0.3s"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center h-10 px-3 shrink-0 select-none relative",
              style: {
                background: win.focused ? "rgba(16,22,34,0.92)" : "rgba(11,16,26,0.8)",
                borderBottom: "1px solid rgba(255,255,255,0.055)",
                cursor: win.maximized ? "default" : "move"
              },
              onMouseDown: onTitleBarMouseDown,
              onDoubleClick: () => toggleMaximize(win.id),
              onMouseEnter: () => setTitleHovered(true),
              onMouseLeave: () => setTitleHovered(false),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-1.5 shrink-0 z-10",
                    onMouseDown: (e) => e.stopPropagation(),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        TrafficLight,
                        {
                          color: "#ff5f57",
                          hoverColor: "#ff3b30",
                          symbol: "✕",
                          shown: titleHovered,
                          title: "Close",
                          onClick: () => closeWindow(win.id)
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        TrafficLight,
                        {
                          color: "#ffbd2e",
                          hoverColor: "#ff9500",
                          symbol: "–",
                          shown: titleHovered,
                          title: "Minimize",
                          onClick: () => minimizeWindow(win.id)
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        TrafficLight,
                        {
                          color: "#28c840",
                          hoverColor: "#34c759",
                          symbol: win.maximized ? "⤡" : "⤢",
                          shown: titleHovered,
                          title: win.maximized ? "Restore" : "Maximize",
                          onClick: () => toggleMaximize(win.id)
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-medium truncate max-w-[55%]",
                    style: {
                      color: win.focused ? "rgba(255,255,255,0.52)" : "rgba(255,255,255,0.22)",
                      letterSpacing: "0.02em",
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                    },
                    children: win.title
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto shrink-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    className: "w-1.5 h-1.5 rounded-full",
                    animate: {
                      background: accent,
                      boxShadow: win.focused ? `0 0 8px ${accent}` : "none",
                      opacity: win.focused ? 1 : 0.2
                    },
                    transition: { duration: 0.2 }
                  }
                ) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden flex flex-col", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppContent, { appId: win.appId }) }),
          !win.maximized && /* @__PURE__ */ jsxRuntimeExports.jsx(ResizeHandle, { winId: win.id, winWidth: win.width, winHeight: win.height })
        ]
      },
      win.id
    )
  ] });
}
function TrafficLight({
  color: color2,
  hoverColor,
  symbol,
  shown,
  title,
  onClick
}) {
  const [hov, setHov] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.button,
    {
      onClick,
      title,
      className: "w-3 h-3 rounded-full flex items-center justify-center",
      style: { background: hov ? hoverColor : color2 },
      animate: { scale: hov ? 1.15 : 1 },
      transition: { type: "spring", stiffness: 600, damping: 24 },
      whileTap: { scale: 0.78 },
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.span,
        {
          animate: { opacity: shown ? 1 : 0 },
          transition: { duration: 0.12 },
          style: {
            fontSize: 7,
            lineHeight: 1,
            color: "rgba(0,0,0,0.75)",
            fontWeight: 700,
            pointerEvents: "none",
            userSelect: "none"
          },
          children: symbol
        }
      )
    }
  );
}
function ResizeHandle({
  winId,
  winWidth,
  winHeight
}) {
  const resizeWindow2 = useWindowStore((s) => s.resizeWindow);
  const ref = reactExports.useRef(null);
  const onMouseDown = reactExports.useCallback(
    (e) => {
      e.stopPropagation();
      ref.current = { sx: e.clientX, sy: e.clientY, w: winWidth, h: winHeight };
      const onMove = (ev) => {
        if (!ref.current) return;
        resizeWindow2(
          winId,
          Math.max(400, ref.current.w + ev.clientX - ref.current.sx),
          Math.max(300, ref.current.h + ev.clientY - ref.current.sy)
        );
      };
      const onUp = () => {
        ref.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [winId, winWidth, winHeight, resizeWindow2]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10",
      onMouseDown,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "svg",
        {
          width: "10",
          height: "10",
          viewBox: "0 0 10 10",
          className: "absolute bottom-1 right-1",
          style: { opacity: 0.18 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "10", y1: "2", x2: "2", y2: "10", stroke: "white", strokeWidth: "1.2", strokeLinecap: "round" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "10", y1: "6", x2: "6", y2: "10", stroke: "white", strokeWidth: "1.2", strokeLinecap: "round" })
          ]
        }
      )
    }
  );
}
function WindowManager() {
  const windows = useWindowStore((s) => s.windows);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: windows.map((win) => /* @__PURE__ */ jsxRuntimeExports.jsx(AppWindow, { window: win }, win.id)) }) });
}
const NUM_WORKSPACES = 4;
function buildWorkspaces(windows) {
  const counts = {};
  for (const w2 of windows) {
    const d = w2.desktop ?? 0;
    counts[d] = (counts[d] ?? 0) + 1;
  }
  return Array.from({ length: NUM_WORKSPACES }, (_, i) => ({
    index: i,
    count: counts[i] ?? 0
  }));
}
function Tooltip({ children, label }) {
  const [vis, setVis] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: { position: "relative", display: "inline-flex" },
      onMouseEnter: () => setVis(true),
      onMouseLeave: () => setVis(false),
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: vis && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 4, scale: 0.93 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 4, scale: 0.93 },
            transition: { duration: 0.12 },
            style: {
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginTop: 6,
              background: "rgba(12,16,26,0.97)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 7,
              padding: "4px 9px",
              fontSize: 10,
              fontWeight: 500,
              color: "rgba(255,255,255,0.75)",
              whiteSpace: "nowrap",
              zIndex: 99999,
              pointerEvents: "none",
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              boxShadow: "0 6px 20px rgba(0,0,0,0.6)"
            },
            children: label
          }
        ) })
      ]
    }
  );
}
function WorkspaceDot({
  ws,
  active,
  onClick
}) {
  const [hov, setHov] = reactExports.useState(false);
  const label = `Workspace ${ws.index + 1} · Super+${ws.index + 1}${ws.count > 0 ? ` · ${ws.count} window${ws.count !== 1 ? "s" : ""}` : ""}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { label, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      whileTap: { scale: 0.88 },
      onClick,
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      style: {
        position: "relative",
        width: 26,
        height: 22,
        borderRadius: 7,
        border: active ? "1px solid var(--cryo-a35)" : hov ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.06)",
        background: active ? "var(--cryo-a18)" : hov ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.12s, border-color 0.12s",
        flexShrink: 0
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          fontSize: 9,
          fontWeight: active ? 700 : 500,
          color: active ? "var(--cryo-accent)" : hov ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)",
          fontFamily: '"JetBrains Mono", monospace',
          lineHeight: 1,
          letterSpacing: "-0.02em"
        }, children: ws.index + 1 }),
        ws.count > 0 && !active && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          top: 2,
          right: 2,
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: hov ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.22)",
          transition: "background 0.12s"
        } }),
        ws.count > 0 && active && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          top: 2,
          right: 2,
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "var(--cryo-accent)",
          opacity: 0.7
        } })
      ]
    }
  ) });
}
function WorkspaceSwitcher() {
  const [current, setCurrent] = reactExports.useState(0);
  const [workspaces, setWorkspaces] = reactExports.useState(
    Array.from({ length: NUM_WORKSPACES }, (_, i) => ({ index: i, count: 0 }))
  );
  const [available, setAvailable] = reactExports.useState(false);
  const prevCurrent = reactExports.useRef(current);
  reactExports.useEffect(() => {
    const wm = window.cryogram.wm;
    if (!wm?.getWindows) {
      setAvailable(false);
      return;
    }
    setAvailable(true);
    const loadWindows = async () => {
      try {
        const wins = await wm.getWindows();
        setWorkspaces(buildWorkspaces(wins));
      } catch {
      }
    };
    loadWindows();
    const t2 = setInterval(loadWindows, 2e3);
    return () => clearInterval(t2);
  }, []);
  reactExports.useEffect(() => {
    const wm = window.cryogram.wm;
    if (!wm?.getCurrentWorkspace) return;
    const loadCurrent = async () => {
      try {
        const idx = await wm.getCurrentWorkspace();
        if (typeof idx === "number") {
          prevCurrent.current = current;
          setCurrent(idx);
        }
      } catch {
      }
    };
    loadCurrent();
    const t2 = setInterval(loadCurrent, 1e3);
    return () => clearInterval(t2);
  }, [current]);
  const switchTo = async (idx) => {
    if (idx === current) return;
    prevCurrent.current = current;
    setCurrent(idx);
    try {
      const wm = window.cryogram.wm;
      await wm?.switchWorkspace?.(idx);
    } catch {
    }
  };
  if (!available) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 3,
          padding: "0 4px"
        },
        children: Array.from({ length: NUM_WORKSPACES }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              width: i === 0 ? 20 : 6,
              height: i === 0 ? 14 : 6,
              borderRadius: i === 0 ? 4 : "50%",
              background: i === 0 ? "var(--cryo-a18)" : "rgba(255,255,255,0.1)",
              border: i === 0 ? "1px solid var(--cryo-a35)" : "1px solid rgba(255,255,255,0.06)",
              transition: "all 0.15s"
            }
          },
          i
        ))
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 3,
        padding: "0 2px",
        position: "relative"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            layoutId: "ws-indicator",
            animate: {
              x: current * (26 + 3)
              // dot width + gap
            },
            transition: { type: "spring", stiffness: 420, damping: 34, mass: 0.7 },
            style: {
              position: "absolute",
              left: 0,
              top: 0,
              width: 26,
              height: 22,
              borderRadius: 7,
              background: "var(--cryo-a18)",
              border: "1px solid var(--cryo-a35)",
              pointerEvents: "none",
              zIndex: 0
            }
          }
        ),
        workspaces.map((ws) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          WorkspaceDot,
          {
            ws,
            active: ws.index === current,
            onClick: () => switchTo(ws.index)
          },
          ws.index
        ))
      ]
    }
  );
}
function StyledSlider({
  value,
  min,
  max,
  onChange,
  disabled
}) {
  const pct = (value - min) / (max - min) * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", flex: 1 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      top: "50%",
      left: 0,
      right: 0,
      height: 3,
      transform: "translateY(-50%)",
      borderRadius: 99,
      background: "rgba(255,255,255,0.08)",
      overflow: "hidden",
      pointerEvents: "none"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      width: `${pct}%`,
      height: "100%",
      background: disabled ? "rgba(255,255,255,0.15)" : "var(--cryo-accent)",
      borderRadius: 99,
      transition: "width 0.08s"
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "range",
        min,
        max,
        value,
        disabled,
        onChange: (e) => onChange(Number(e.target.value)),
        style: {
          width: "100%",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.4 : 1,
          accentColor: "var(--cryo-accent)",
          background: "transparent"
        }
      }
    )
  ] });
}
function ToggleBtn({
  icon,
  label,
  active,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      whileTap: { scale: 0.93 },
      onClick,
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        padding: "10px 6px",
        borderRadius: 12,
        border: active ? "1px solid var(--cryo-a35)" : "1px solid rgba(255,255,255,0.08)",
        background: active ? "var(--cryo-a18)" : "rgba(255,255,255,0.04)",
        cursor: "pointer",
        transition: "background 0.15s, border-color 0.15s",
        flex: 1,
        minWidth: 0
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.background = active ? "var(--cryo-a25)" : "rgba(255,255,255,0.08)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = active ? "var(--cryo-a18)" : "rgba(255,255,255,0.04)";
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: active ? "var(--cryo-accent)" : "rgba(255,255,255,0.55)", lineHeight: 1 }, children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          fontSize: 9,
          fontWeight: 500,
          color: active ? "var(--cryo-accent)" : "rgba(255,255,255,0.4)",
          letterSpacing: "0.03em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%"
        }, children: label })
      ]
    }
  );
}
function SectionLabel({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.22)",
    fontFamily: '"JetBrains Mono", monospace',
    marginBottom: 7,
    paddingLeft: 2
  }, children });
}
function QuickSettings({ open, onClose }) {
  const [vol, setVol] = reactExports.useState({ level: 60, muted: false });
  const [brightness, setBrightness] = reactExports.useState(80);
  const [wifi, setWifi] = reactExports.useState(null);
  const [networks, setNetworks] = reactExports.useState([]);
  const [battery, setBattery] = reactExports.useState(null);
  const [btDevices, setBtDevices] = reactExports.useState([]);
  const [dnd, setDnd] = reactExports.useState(false);
  const [darkTheme, setDarkTheme] = reactExports.useState(true);
  const [wifiExpanded, setWifiExpanded] = reactExports.useState(false);
  const [connectTarget, setConnectTarget] = reactExports.useState(null);
  const [password, setPassword] = reactExports.useState("");
  const [connecting, setConnecting] = reactExports.useState(null);
  const [btOn, setBtOn] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        setVol(await window.cryogram.system.getVolume());
      } catch {
      }
      try {
        setBrightness(await window.cryogram.system.getBrightness());
      } catch {
      }
      try {
        setWifi(await window.cryogram.system.getWifiStatus());
      } catch {
      }
      try {
        setBattery(await window.cryogram.system.getBattery());
      } catch {
      }
      try {
        setBtDevices(await window.cryogram.system.getBluetoothDevices());
        setBtOn(true);
      } catch {
      }
    };
    load();
  }, [open]);
  reactExports.useEffect(() => {
    if (!wifiExpanded) return;
    const load = async () => {
      try {
        setNetworks(await window.cryogram.system.getNetworks());
      } catch {
      }
    };
    load();
  }, [wifiExpanded]);
  reactExports.useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  const handleVolChange = reactExports.useCallback(async (v2) => {
    setVol((prev) => ({ ...prev, level: v2 }));
    try {
      await window.cryogram.system.setVolume(v2);
    } catch {
    }
  }, []);
  const handleToggleMute = reactExports.useCallback(async () => {
    try {
      await window.cryogram.system.toggleMute();
      const updated = await window.cryogram.system.getVolume();
      setVol(updated);
    } catch {
      setVol((prev) => ({ ...prev, muted: !prev.muted }));
    }
  }, []);
  const handleBrightnessChange = reactExports.useCallback(async (v2) => {
    setBrightness(v2);
    try {
      await window.cryogram.system.setBrightness(v2);
    } catch {
    }
  }, []);
  const handleDnd = () => {
    const next = !dnd;
    setDnd(next);
    window.dispatchEvent(new CustomEvent("cryogram:dnd", { detail: { enabled: next } }));
  };
  const handleTheme = () => {
    const next = !darkTheme;
    setDarkTheme(next);
    window.dispatchEvent(new CustomEvent("cryogram:theme-toggle", { detail: { dark: next } }));
  };
  const handleLock = () => {
    onClose();
    try {
      window.cryogram.system.lock();
    } catch {
    }
  };
  const handleConnect = async (net, pw) => {
    setConnecting(net.ssid);
    try {
      await window.cryogram.system.connectNetwork(net.ssid, pw || void 0);
      const updated = await window.cryogram.system.getWifiStatus();
      setWifi(updated);
      setConnectTarget(null);
      setPassword("");
    } catch {
    }
    setConnecting(null);
  };
  const volIcon = vol.muted ? (
    // Muted
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "23", y1: "9", x2: "17", y2: "15" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "17", y1: "9", x2: "23", y2: "15" })
    ] })
  ) : vol.level > 50 ? (
    // High
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19.07 4.93a10 10 0 0 1 0 14.14" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15.54 8.46a5 5 0 0 1 0 7.07" })
    ] })
  ) : (
    // Low
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15.54 8.46a5 5 0 0 1 0 7.07" })
    ] })
  );
  const battLevel = battery?.level ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
        onClick: onClose,
        style: { position: "fixed", inset: 0, zIndex: 87e3 }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -12, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -12, scale: 0.96 },
        transition: { type: "spring", stiffness: 380, damping: 30, mass: 0.85 },
        onClick: (e) => e.stopPropagation(),
        style: {
          position: "fixed",
          top: 36,
          right: 8,
          width: 320,
          maxHeight: "80vh",
          zIndex: 88e3,
          background: "rgba(12,16,26,0.92)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.75)",
          overflowY: "auto",
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.1) transparent"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "14px 14px 8px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "Quick Toggles" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 14 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ToggleBtn,
                {
                  active: wifi?.connected ?? false,
                  label: wifi?.connected ? wifi.ssid.slice(0, 8) + (wifi.ssid.length > 8 ? "…" : "") : "Wi-Fi",
                  onClick: () => setWifiExpanded((x2) => !x2),
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "18", height: "16", viewBox: "0 0 24 18", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 14.5 a1.5 1.5 0 1 1 0 0.1Z", fill: "currentColor" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8.5 11.5 Q12 8 15.5 11.5", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5.5 8.5 Q12 3 18.5 8.5", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2.5 5.5 Q12 -2 21.5 5.5", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ToggleBtn,
                {
                  active: btOn && btDevices.some((d) => d.connected),
                  label: "Bluetooth",
                  onClick: () => setBtOn((x2) => !x2),
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "18", viewBox: "0 0 14 22", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "3 7 11 14 7 18 7 3 11 7 3 14" }) })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ToggleBtn,
                {
                  active: vol.muted,
                  label: vol.muted ? "Muted" : "Sound",
                  onClick: handleToggleMute,
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
                    vol.muted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "23", y1: "9", x2: "17", y2: "15" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "17", y1: "9", x2: "23", y2: "15" })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15.54 8.46a5 5 0 0 1 0 7.07" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ToggleBtn,
                {
                  active: false,
                  label: "Lock",
                  onClick: handleLock,
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ToggleBtn,
                {
                  active: dnd,
                  label: "Do Not Disturb",
                  onClick: handleDnd,
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" }),
                    dnd && /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "2", y1: "2", x2: "22", y2: "22" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ToggleBtn,
                {
                  active: !darkTheme,
                  label: darkTheme ? "Dark" : "Light",
                  onClick: handleTheme,
                  icon: darkTheme ? /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
                  ] })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 1, background: "rgba(255,255,255,0.06)", margin: "2px 0 12px" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "Volume" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleToggleMute,
                  style: {
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: vol.muted ? "#ef4444" : "rgba(255,255,255,0.6)",
                    padding: 0,
                    lineHeight: 0,
                    flexShrink: 0
                  },
                  children: volIcon
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StyledSlider,
                {
                  value: vol.level,
                  min: 0,
                  max: 100,
                  disabled: vol.muted,
                  onChange: handleVolChange
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.35)", width: 28, textAlign: "right", flexShrink: 0 }, children: vol.muted ? "—" : `${vol.level}` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "Brightness" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.6)", lineHeight: 0, flexShrink: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StyledSlider,
                {
                  value: brightness,
                  min: 5,
                  max: 100,
                  onChange: handleBrightnessChange
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.35)", width: 28, textAlign: "right", flexShrink: 0 }, children: brightness })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: { display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginBottom: 6 },
                onClick: () => setWifiExpanded((x2) => !x2),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionLabel, { children: [
                    "Wi-Fi ",
                    wifi?.connected ? `· ${wifi.ssid}` : ""
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      animate: { rotate: wifiExpanded ? 180 : 0 },
                      transition: { duration: 0.2 },
                      style: { color: "rgba(255,255,255,0.3)", lineHeight: 0, marginBottom: 7 },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "6 9 12 15 18 9" }) })
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: wifiExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, height: 0 },
                animate: { opacity: 1, height: "auto" },
                exit: { opacity: 0, height: 0 },
                transition: { duration: 0.2 },
                style: { overflow: "hidden", marginBottom: 10 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxHeight: 160, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }, children: networks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", padding: "8px 0" }, children: "Scanning…" }) : networks.map((net) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => {
                        setConnectTarget((t2) => t2?.ssid === net.ssid ? null : net);
                        setPassword("");
                      },
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 8px",
                        borderRadius: 8,
                        background: net.active ? "var(--cryo-a12)" : connectTarget?.ssid === net.ssid ? "rgba(255,255,255,0.07)" : "transparent",
                        border: net.active ? "1px solid var(--cryo-a20)" : "1px solid transparent",
                        cursor: "pointer",
                        textAlign: "left",
                        width: "100%"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "12", height: "10", viewBox: "0 0 14 12", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "8", width: "3", height: "4", rx: "1", fill: net.signal > 20 ? net.active ? "var(--cryo-accent)" : "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.18)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4", y: "5", width: "3", height: "7", rx: "1", fill: net.signal > 40 ? net.active ? "var(--cryo-accent)" : "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.18)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "2", width: "3", height: "10", rx: "1", fill: net.signal > 65 ? net.active ? "var(--cryo-accent)" : "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.18)" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1, fontSize: 11, color: net.active ? "var(--cryo-accent)" : "rgba(255,255,255,0.75)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: net.ssid }),
                        net.security && /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "8", height: "10", viewBox: "0 0 9 10", fill: "none", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0.5", y: "4", width: "8", height: "5.5", rx: "1.5", stroke: "rgba(255,255,255,0.3)", strokeWidth: "1" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2.5 4V3a2 2 0 0 1 4 0v1", stroke: "rgba(255,255,255,0.3)", strokeWidth: "1", strokeLinecap: "round" })
                        ] }),
                        net.active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "var(--cryo-accent)" }, children: "✓" })
                      ]
                    },
                    net.ssid
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: connectTarget && !connectTarget.active && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      initial: { opacity: 0, height: 0 },
                      animate: { opacity: 1, height: "auto" },
                      exit: { opacity: 0, height: 0 },
                      style: { overflow: "hidden", marginTop: 6 },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
                        connectTarget.security && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "password",
                            placeholder: "Wi-Fi password",
                            value: password,
                            autoFocus: true,
                            onChange: (e) => setPassword(e.target.value),
                            onKeyDown: (e) => {
                              if (e.key === "Enter") handleConnect(connectTarget, password);
                            },
                            style: {
                              width: "100%",
                              padding: "7px 10px",
                              borderRadius: 8,
                              border: "1px solid rgba(255,255,255,0.12)",
                              background: "rgba(255,255,255,0.06)",
                              color: "#e2e8f0",
                              fontSize: 12,
                              outline: "none",
                              boxSizing: "border-box"
                            }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            onClick: () => handleConnect(connectTarget, password),
                            disabled: !!connecting,
                            style: {
                              padding: "6px",
                              borderRadius: 8,
                              border: "1px solid var(--cryo-a25)",
                              background: connecting ? "var(--cryo-a08)" : "var(--cryo-a18)",
                              color: connecting ? "var(--cryo-a50)" : "var(--cryo-accent)",
                              fontSize: 11,
                              cursor: connecting ? "wait" : "pointer",
                              fontWeight: 500
                            },
                            children: connecting === connectTarget.ssid ? "Connecting…" : `Connect to ${connectTarget.ssid}`
                          }
                        )
                      ] })
                    }
                  ) })
                ]
              }
            ) }),
            battery && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 1, background: "rgba(255,255,255,0.06)", margin: "2px 0 12px" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "Battery" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "24", height: "14", viewBox: "0 0 22 12", style: { flexShrink: 0 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0.5", y: "0.5", width: "18", height: "11", rx: "2.5", fill: "none", stroke: battLevel > 20 ? "rgba(255,255,255,0.6)" : "#ef4444", strokeWidth: "1.2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "19", y: "3.5", width: "2.5", height: "5", rx: "1", fill: battLevel > 20 ? "rgba(255,255,255,0.6)" : "#ef4444" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "rect",
                    {
                      x: "1.5",
                      y: "1.5",
                      width: Math.max(1, battLevel / 100 * 16),
                      height: "9",
                      rx: "1.5",
                      fill: battery.charging ? "#00ff88" : battLevel > 20 ? "rgba(255,255,255,0.85)" : "#ef4444"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 13, fontWeight: 600, color: battLevel > 20 ? "#c9d1d9" : "#ef4444" }, children: [
                    battLevel,
                    "%",
                    battery.charging && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "#00ff88", marginLeft: 6, fontWeight: 400 }, children: "Charging" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 3, borderRadius: 99, background: "rgba(255,255,255,0.08)", marginTop: 4, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                    width: `${battLevel}%`,
                    height: "100%",
                    borderRadius: 99,
                    background: battery.charging ? "#00ff88" : battLevel > 20 ? "var(--cryo-accent)" : "#ef4444",
                    transition: "width 0.4s"
                  } }) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0 10px" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, justifyContent: "flex-end" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FooterBtn,
                {
                  title: "Settings",
                  onClick: () => {
                    onClose();
                    window.dispatchEvent(new CustomEvent("cryogram:openApp", { detail: { appId: "settings" } }));
                  },
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FooterBtn,
                {
                  title: "Restart",
                  onClick: () => {
                    try {
                      window.cryogram.system.reboot();
                    } catch {
                    }
                  },
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "1 4 1 10 7 10" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3.51 15a9 9 0 1 0 .49-4.95" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FooterBtn,
                {
                  title: "Shut Down",
                  danger: true,
                  onClick: () => {
                    try {
                      window.cryogram.system.shutdown();
                    } catch {
                    }
                  },
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18.36 6.64a9 9 0 1 1-12.73 0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "2", x2: "12", y2: "12" })
                  ] })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 1, background: "linear-gradient(90deg, transparent, var(--cryo-a20) 40%, var(--cryo-a20) 60%, transparent)" } })
        ]
      }
    )
  ] }) });
}
function FooterBtn({
  icon,
  title,
  onClick,
  danger
}) {
  const base = danger ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.05)";
  const hover2 = danger ? "rgba(239,68,68,0.18)" : "rgba(255,255,255,0.1)";
  const color2 = danger ? "#f87171" : "rgba(255,255,255,0.55)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      title,
      onClick,
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        padding: "6px 10px",
        borderRadius: 8,
        border: `1px solid ${danger ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.08)"}`,
        background: base,
        cursor: "pointer",
        color: color2,
        fontSize: 11
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.background = hover2;
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = base;
      },
      children: [
        icon,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: title })
      ]
    }
  );
}
const WMO = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mainly clear", icon: "🌤" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Foggy", icon: "🌫" },
  48: { label: "Icy fog", icon: "🌫" },
  51: { label: "Light drizzle", icon: "🌦" },
  53: { label: "Drizzle", icon: "🌦" },
  55: { label: "Heavy drizzle", icon: "🌧" },
  61: { label: "Light rain", icon: "🌧" },
  63: { label: "Rain", icon: "🌧" },
  65: { label: "Heavy rain", icon: "🌧" },
  71: { label: "Light snow", icon: "🌨" },
  73: { label: "Snow", icon: "❄️" },
  75: { label: "Heavy snow", icon: "❄️" },
  80: { label: "Light showers", icon: "🌦" },
  81: { label: "Showers", icon: "🌧" },
  82: { label: "Heavy showers", icon: "⛈" },
  95: { label: "Thunderstorm", icon: "⛈" },
  96: { label: "Hail storm", icon: "⛈" },
  99: { label: "Heavy hail storm", icon: "⛈" }
};
function getWmo(code) {
  return WMO[code] ?? WMO[Math.floor(code / 10) * 10] ?? { label: "Unknown", icon: "🌡" };
}
function ActionBtn$1({
  icon,
  label,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick,
      style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        padding: "10px 6px",
        borderRadius: 12,
        cursor: "pointer",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        transition: "all 0.12s"
      },
      onMouseEnter: (e) => {
        const el2 = e.currentTarget;
        el2.style.background = "rgba(255,255,255,0.09)";
        el2.style.borderColor = "rgba(255,255,255,0.16)";
      },
      onMouseLeave: (e) => {
        const el2 = e.currentTarget;
        el2.style.background = "rgba(255,255,255,0.04)";
        el2.style.borderColor = "rgba(255,255,255,0.08)";
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 18 }, children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.55)", fontWeight: 500 }, children: label })
      ]
    }
  );
}
function PowerBtn({
  icon,
  label,
  color: color2,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick,
      style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        padding: "10px 6px",
        borderRadius: 12,
        cursor: "pointer",
        background: `${color2}14`,
        border: `1px solid ${color2}28`,
        transition: "all 0.12s"
      },
      onMouseEnter: (e) => {
        const el2 = e.currentTarget;
        el2.style.background = `${color2}28`;
        el2.style.borderColor = `${color2}55`;
      },
      onMouseLeave: (e) => {
        const el2 = e.currentTarget;
        el2.style.background = `${color2}14`;
        el2.style.borderColor = `${color2}28`;
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 16, color: color2 }, children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: `${color2}cc`, fontWeight: 500 }, children: label })
      ]
    }
  );
}
function UserPanel({ open, onClose }) {
  const openApp = useWindowStore((s) => s.openApp);
  const [profile, setProfile] = reactExports.useState({ name: "Operator", email: "" });
  const [weather, setWeather] = reactExports.useState(null);
  const [weatherLoading, setWeatherLoading] = reactExports.useState(false);
  const [weatherFetched, setWeatherFetched] = reactExports.useState(false);
  const [news, setNews] = reactExports.useState([]);
  const [newsLoading, setNewsLoading] = reactExports.useState(false);
  const [newsFetched, setNewsFetched] = reactExports.useState(false);
  const [powerConfirm, setPowerConfirm] = reactExports.useState(null);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        if (!powerConfirm) onClose();
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open, onClose, powerConfirm]);
  reactExports.useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") {
        if (powerConfirm) setPowerConfirm(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose, powerConfirm]);
  reactExports.useEffect(() => {
    if (!open) return;
    window.cryogram.settings.getAll().then((all) => {
      setProfile({
        name: all["profile.name"] || "Operator",
        email: all["profile.email"] || ""
      });
    }).catch(() => {
    });
  }, [open]);
  reactExports.useEffect(() => {
    if (!open || weatherFetched) return;
    setWeatherFetched(true);
    setWeatherLoading(true);
    const load = async () => {
      try {
        const geo = await fetch("https://ipapi.co/json/").then((r2) => r2.json());
        const { latitude: lat, longitude: lon, city, country_name } = geo;
        const w2 = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m`
        ).then((r2) => r2.json());
        setWeather({
          temp: Math.round(w2.current.temperature_2m),
          feelsLike: Math.round(w2.current.apparent_temperature),
          code: w2.current.weather_code,
          wind: Math.round(w2.current.wind_speed_10m),
          city: city || "Unknown",
          country: country_name || ""
        });
      } catch {
      }
      setWeatherLoading(false);
    };
    load();
  }, [open, weatherFetched]);
  reactExports.useEffect(() => {
    if (!open || newsFetched) return;
    setNewsFetched(true);
    setNewsLoading(true);
    const load = async () => {
      try {
        const ids = await fetch(
          "https://hacker-news.firebaseio.com/v1/topstories.json"
        ).then((r2) => r2.json());
        const items = await Promise.all(
          ids.slice(0, 7).map(
            (id2) => fetch(`https://hacker-news.firebaseio.com/v1/item/${id2}.json`).then((r2) => r2.json())
          )
        );
        setNews(items.filter((s) => s?.title).map((s) => ({
          id: s.id,
          title: s.title,
          url: s.url || `https://news.ycombinator.com/item?id=${s.id}`
        })));
      } catch {
      }
      setNewsLoading(false);
    };
    load();
  }, [open, newsFetched]);
  const wmo = weather ? getWmo(weather.code) : null;
  const initial = profile.name.trim()[0]?.toUpperCase() || "O";
  const isMock = !window.cryogram?.system?.sleep;
  const executePower = (action) => {
    if (isMock) {
      setPowerConfirm(null);
      return;
    }
    if (action === "sleep") window.cryogram.system.sleep?.();
    else if (action === "restart") window.cryogram.system.reboot();
    else window.cryogram.system.shutdown();
    setPowerConfirm(null);
    onClose();
  };
  const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  const openSettings = (tab) => {
    if (tab) window.dispatchEvent(new CustomEvent("cryogram:openSettingsTab", { detail: tab }));
    openApp("settings");
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        ref,
        initial: { opacity: 0, y: -10, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 0.96 },
        transition: { type: "spring", stiffness: 420, damping: 32, mass: 0.55 },
        style: {
          position: "fixed",
          top: 42,
          right: 8,
          width: 340,
          zIndex: 99800,
          background: "rgba(9,13,22,0.97)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 18,
          overflow: "hidden",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.85), inset 0 0.5px 0 rgba(255,255,255,0.08)",
          fontFamily: font
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            padding: "16px 16px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            gap: 12
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              width: 42,
              height: 42,
              borderRadius: 13,
              flexShrink: 0,
              background: "linear-gradient(135deg, var(--cryo-accent) 0%, #bb88ff 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
              fontWeight: 700,
              color: "#000",
              boxShadow: "0 0 18px var(--cryo-accent)44",
              fontFamily: font
            }, children: initial }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, fontWeight: 600, color: "#f0f4f8", letterSpacing: "-0.01em", lineHeight: 1.2 }, children: profile.name }),
              profile.email && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.38)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: profile.email })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onClose,
                style: {
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 11,
                  flexShrink: 0,
                  lineHeight: 1
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                },
                children: "✕"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }, children: weatherLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.28)", padding: "6px 0", textAlign: "center" }, children: "Fetching weather…" }) : weather && wmo ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 34, lineHeight: 1 }, children: wmo.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 24, fontWeight: 700, color: "#f0f4f8", letterSpacing: "-0.04em", lineHeight: 1 }, children: [
                  weather.temp,
                  "°C"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }, children: wmo.label })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.78)" }, children: weather.city }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 1 }, children: weather.country }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 3 }, children: [
                "💨 ",
                weather.wind,
                " km/h · Feels ",
                weather.feelsLike,
                "°"
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.28)", textAlign: "center", padding: "2px 0" }, children: "Weather unavailable" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "11px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", maxHeight: 200, overflowY: "auto" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              fontSize: 9,
              fontWeight: 700,
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 7
            }, children: "Hacker News" }),
            newsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.28)", padding: "2px 0" }, children: "Loading headlines…" }) : news.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.28)", padding: "2px 0" }, children: "News unavailable" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 1 }, children: news.slice(0, 6).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: item.url,
                target: "_blank",
                rel: "noopener noreferrer",
                style: {
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 7,
                  padding: "5px 6px",
                  borderRadius: 7,
                  textDecoration: "none",
                  transition: "background 0.1s"
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.background = "transparent";
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--cryo-accent)", opacity: 0.6, fontSize: 10, marginTop: 2, flexShrink: 0 }, children: "›" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                    fontSize: 11,
                    color: "rgba(255,255,255,0.68)",
                    lineHeight: 1.4,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical"
                  }, children: item.title })
                ]
              },
              item.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "12px 16px 6px", display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ActionBtn$1, { icon: "⚙️", label: "Settings", onClick: () => openSettings() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ActionBtn$1, { icon: "👤", label: "Profile", onClick: () => openSettings("profile") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "6px 16px 14px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              fontSize: 9,
              fontWeight: 700,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8
            }, children: "Power" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PowerBtn, { icon: "💤", label: "Sleep", color: "#818cf8", onClick: () => setPowerConfirm("sleep") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PowerBtn, { icon: "🔄", label: "Restart", color: "var(--cryo-accent)", onClick: () => setPowerConfirm("restart") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PowerBtn, { icon: "⏻", label: "Shut Down", color: "#ef4444", onClick: () => setPowerConfirm("shutdown") })
            ] })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: powerConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        style: {
          position: "fixed",
          inset: 0,
          zIndex: 99900,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: font
        },
        onClick: () => setPowerConfirm(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { scale: 0.88, opacity: 0, y: 12 },
            animate: { scale: 1, opacity: 1, y: 0 },
            exit: { scale: 0.88, opacity: 0, y: 12 },
            transition: { type: "spring", stiffness: 400, damping: 28 },
            style: {
              background: "rgba(10,14,24,0.98)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "28px 24px 22px",
              width: 290,
              textAlign: "center",
              boxShadow: "0 32px 80px rgba(0,0,0,0.9)"
            },
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 38, marginBottom: 12, lineHeight: 1 }, children: powerConfirm === "sleep" ? "💤" : powerConfirm === "restart" ? "🔄" : "⏻" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 15, fontWeight: 600, color: "#f0f4f8", marginBottom: 8 }, children: powerConfirm === "sleep" ? "Put System to Sleep?" : powerConfirm === "restart" ? "Restart System?" : "Shut Down System?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 22, lineHeight: 1.55 }, children: powerConfirm === "sleep" ? "The system will enter suspend mode." : powerConfirm === "restart" ? "All running processes will be stopped." : "Save your work before shutting down." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setPowerConfirm(null),
                    style: {
                      flex: 1,
                      padding: "9px",
                      borderRadius: 11,
                      fontSize: 13,
                      fontWeight: 500,
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.7)",
                      cursor: "pointer"
                    },
                    onMouseEnter: (e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    },
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    autoFocus: true,
                    onClick: () => executePower(powerConfirm),
                    style: {
                      flex: 1,
                      padding: "9px",
                      borderRadius: 11,
                      fontSize: 13,
                      fontWeight: 600,
                      background: powerConfirm === "shutdown" ? "rgba(239,68,68,0.15)" : powerConfirm === "sleep" ? "rgba(129,140,248,0.15)" : "rgba(0,212,255,0.12)",
                      border: `1px solid ${powerConfirm === "shutdown" ? "rgba(239,68,68,0.4)" : powerConfirm === "sleep" ? "rgba(129,140,248,0.4)" : "rgba(0,212,255,0.3)"}`,
                      color: powerConfirm === "shutdown" ? "#ef4444" : powerConfirm === "sleep" ? "#818cf8" : "var(--cryo-accent)",
                      cursor: "pointer"
                    },
                    onMouseEnter: (e) => {
                      e.currentTarget.style.opacity = "0.85";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.opacity = "1";
                    },
                    children: powerConfirm === "sleep" ? "Sleep" : powerConfirm === "restart" ? "Restart" : "Shut Down"
                  }
                )
              ] })
            ]
          }
        )
      }
    ) })
  ] });
}
function PowerModal({ action, onCancel }) {
  const isRestart = action === "restart";
  const title = isRestart ? "Restart Cryogram OS?" : "Shut Down Cryogram OS?";
  const body = isRestart ? "The OS will restart. Any open terminals or running tools will be closed." : "The system will power off. Make sure your work is saved.";
  const confirmLabel = isRestart ? "Restart" : "Shut Down";
  const confirmColor = isRestart ? "var(--cryo-accent)" : "#ef4444";
  const confirm = () => {
    if (isRestart) window.cryogram.system.reboot();
    else window.cryogram.system.shutdown();
  };
  reactExports.useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onCancel]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className: "fixed inset-0 flex items-center justify-center z-[99999]",
      style: { background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" },
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      onClick: onCancel,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.9, y: 12 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.9, y: 12 },
          transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
          className: "rounded-2xl p-6 w-80",
          style: {
            background: "rgba(12,18,28,0.98)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.8)"
          },
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-12 h-12 rounded-full flex items-center justify-center",
                style: { background: isRestart ? "var(--cryo-a08)" : "rgba(239,68,68,0.1)", border: `1px solid ${confirmColor}30` },
                children: isRestart ? /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: confirmColor, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "1 4 1 10 7 10" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3.51 15a9 9 0 1 0 .49-4.95" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: confirmColor, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18.36 6.64a9 9 0 1 1-12.73 0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "2", x2: "12", y2: "12" })
                ] })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-center mb-2", style: { color: "#f0f4f8" }, children: title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center mb-5", style: { color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }, children: body }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: onCancel,
                  className: "flex-1 py-2 rounded-xl text-sm font-medium transition-colors",
                  style: { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  },
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: confirm,
                  autoFocus: true,
                  className: "flex-1 py-2 rounded-xl text-sm font-semibold transition-colors",
                  style: { background: `${confirmColor}22`, border: `1px solid ${confirmColor}50`, color: confirmColor },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.background = `${confirmColor}33`;
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.background = `${confirmColor}22`;
                  },
                  children: confirmLabel
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function CryogramMenu() {
  const [open, setOpen] = reactExports.useState(false);
  const [powerModal, setPowerModal] = reactExports.useState(null);
  const ref = reactExports.useRef(null);
  const openApp = useWindowStore((s) => s.openApp);
  const isMock = !window.cryogram?.system?.shutdown;
  reactExports.useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const items = [
    { label: "About Cryogram", action: () => {
      openApp("settings");
      setOpen(false);
    } },
    { sep: true },
    { label: "System Preferences", action: () => {
      openApp("settings");
      setOpen(false);
    } },
    { sep: true },
    { label: "Lock Screen", action: () => {
      !isMock && window.cryogram.system.lock();
      setOpen(false);
    } },
    { label: "Restart…", action: () => {
      if (!isMock) {
        setPowerModal("restart");
        setOpen(false);
      }
    } },
    { label: "Shut Down…", action: () => {
      if (!isMock) {
        setPowerModal("shutdown");
        setOpen(false);
      }
    } }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref, className: "relative", style: { WebkitAppRegion: "no-drag" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setOpen((o) => !o),
          className: "flex items-center gap-1.5 px-2.5 h-7 rounded-md transition-colors",
          style: {
            background: open ? "rgba(255,255,255,0.1)" : "transparent",
            color: open ? "#fff" : "rgba(255,255,255,0.7)"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.background = open ? "rgba(255,255,255,0.1)" : "transparent";
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "var(--cryo-accent)" }, children: "CRYO OS" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: -4, scale: 0.97 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -4, scale: 0.97 },
          transition: { duration: 0.12 },
          className: "absolute top-full left-0 mt-1 min-w-44 rounded-xl overflow-hidden z-[999]",
          style: {
            background: "rgba(18,24,36,0.97)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(32px)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.7)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-1.5", children: items.map(
            (item, i) => item.sep ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-1 mx-3 h-px", style: { background: "rgba(255,255,255,0.07)" } }, i) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: item.action,
                className: "w-full text-left px-4 py-1.5 text-sm transition-colors",
                style: { color: "rgba(255,255,255,0.78)", fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' },
                onMouseEnter: (e) => {
                  e.currentTarget.style.background = "var(--cryo-a12)";
                  e.currentTarget.style.color = "#fff";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.78)";
                },
                children: item.label
              },
              i
            )
          ) })
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: powerModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PowerModal,
      {
        action: powerModal,
        onCancel: () => setPowerModal(null)
      },
      powerModal
    ) })
  ] });
}
function TitleBar() {
  const [time2, setTime] = reactExports.useState("");
  const [date, setDate] = reactExports.useState("");
  const [quickSettingsOpen, setQuickSettingsOpen] = reactExports.useState(false);
  const [userPanelOpen, setUserPanelOpen] = reactExports.useState(false);
  const [profileName, setProfileName] = reactExports.useState("Operator");
  const focusedWindow = useWindowStore((s) => s.windows.find((w2) => w2.focused && !w2.minimized));
  const systemTzRef = reactExports.useRef("");
  reactExports.useEffect(() => {
    systemTzRef.current = Intl.DateTimeFormat().resolvedOptions().timeZone;
    window.cryogram.system?.syncTime?.();
    const tick = () => {
      const now2 = /* @__PURE__ */ new Date();
      const tz = systemTzRef.current;
      setTime(now2.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz }));
      setDate(now2.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: tz }));
    };
    tick();
    const id2 = setInterval(tick, 1e4);
    return () => clearInterval(id2);
  }, []);
  reactExports.useEffect(() => {
    const refresh = () => {
      window.cryogram.settings.get("profile.name").then((v2) => {
        if (v2 && typeof v2 === "string") setProfileName(v2);
      }).catch(() => {
      });
    };
    refresh();
    window.addEventListener("cryogram:profileUpdated", refresh);
    return () => window.removeEventListener("cryogram:profileUpdated", refresh);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center h-9 px-2 shrink-0 select-none relative",
      style: {
        background: "rgba(8, 12, 20, 0.88)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(48px) saturate(1.9)",
        WebkitBackdropFilter: "blur(48px) saturate(1.9)",
        WebkitAppRegion: "drag",
        zIndex: 100
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CryogramMenu, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: focusedWindow && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: -4 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -4 },
            transition: { duration: 0.15 },
            className: "flex items-center gap-1.5 ml-1",
            style: { WebkitAppRegion: "no-drag" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-3.5 mx-0.5", style: { background: "rgba(255,255,255,0.12)" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", style: { color: "rgba(255,255,255,0.45)", letterSpacing: "0.01em" }, children: focusedWindow.title })
            ]
          },
          focusedWindow.id
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-1/2 -translate-x-1/2 flex items-center gap-3", style: { WebkitAppRegion: "no-drag" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(WorkspaceSwitcher, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-3", style: { background: "rgba(255,255,255,0.1)" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.88)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }, children: time2 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.35)" }, children: date })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "ml-auto flex items-center gap-0.5",
            style: { WebkitAppRegion: "no-drag" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setUserPanelOpen((o) => !o),
                  title: profileName,
                  className: "flex items-center gap-1.5 px-2 h-6 rounded-md transition-colors",
                  style: { background: userPanelOpen ? "rgba(255,255,255,0.12)" : "transparent", color: userPanelOpen ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)" },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.background = userPanelOpen ? "rgba(255,255,255,0.12)" : "transparent";
                    e.currentTarget.style.color = userPanelOpen ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)";
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                      width: 18,
                      height: 18,
                      borderRadius: 6,
                      flexShrink: 0,
                      background: "linear-gradient(135deg, var(--cryo-accent) 0%, #bb88ff 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#000"
                    }, children: profileName.trim()[0]?.toUpperCase() || "O" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, fontWeight: 500, maxWidth: 72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: profileName })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 1, height: 14, background: "rgba(255,255,255,0.1)", margin: "0 2px" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    window.__cryogram_toggleNotifHistory?.();
                  },
                  title: "Notification History",
                  className: "flex items-center justify-center w-7 h-6 rounded-md transition-colors",
                  style: { background: "transparent", color: "rgba(255,255,255,0.55)" },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setQuickSettingsOpen((o) => !o),
                  title: "Quick Settings",
                  className: "flex items-center justify-center w-7 h-6 rounded-md transition-colors",
                  style: { background: quickSettingsOpen ? "rgba(255,255,255,0.12)" : "transparent", color: quickSettingsOpen ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)" },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.background = quickSettingsOpen ? "rgba(255,255,255,0.12)" : "transparent";
                    e.currentTarget.style.color = quickSettingsOpen ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)";
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19.07 4.93a10 10 0 0 1 0 14.14M16.24 7.76a6 6 0 0 1 0 8.49M4.93 19.07a10 10 0 0 1 0-14.14M7.76 16.24a6 6 0 0 1 0-8.49" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcons, {})
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(QuickSettings, { open: quickSettingsOpen, onClose: () => setQuickSettingsOpen(false) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPanel, { open: userPanelOpen, onClose: () => setUserPanelOpen(false) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 h-px pointer-events-none", style: { background: "linear-gradient(90deg, transparent, var(--cryo-a20) 30%, var(--cryo-a35) 50%, var(--cryo-a20) 70%, transparent)" } })
      ]
    }
  );
}
function StatusIcons() {
  const [battery, setBattery] = reactExports.useState(null);
  const [wifi, setWifi] = reactExports.useState(null);
  const [vol, setVol] = reactExports.useState(null);
  const [popup, setPopup] = reactExports.useState(null);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const load = async () => {
      try {
        setBattery(await window.cryogram.system.getBattery());
      } catch {
      }
      try {
        setWifi(await window.cryogram.system.getWifiStatus());
      } catch {
      }
      try {
        setVol(await window.cryogram.system.getVolume());
      } catch {
      }
    };
    load();
    const t2 = setInterval(load, 5e3);
    return () => clearInterval(t2);
  }, []);
  reactExports.useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setPopup(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const toggle = (id2) => setPopup((p2) => p2 === id2 ? null : id2);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref, className: "relative flex items-center gap-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TrayIcon, { onClick: () => toggle("wifi"), active: popup === "wifi", title: wifi?.connected ? wifi.ssid : "No Wi-Fi", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WifiIcon, { connected: wifi?.connected ?? false, signal: wifi?.signal ?? 0 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TrayIcon, { onClick: () => toggle("vol"), active: popup === "vol", title: vol ? vol.muted ? "Muted" : `${vol.level}%` : "Volume", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeIcon, { muted: vol?.muted ?? false, level: vol?.level ?? 50 }) }),
    battery && /* @__PURE__ */ jsxRuntimeExports.jsx(TrayIcon, { onClick: () => toggle("bat"), active: popup === "bat", title: `${battery.level}%`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BattIcon, { level: battery.level, charging: battery.charging }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: popup && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -6, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -6, scale: 0.96 },
        transition: { duration: 0.13 },
        className: "absolute top-full right-0 mt-2 z-[999] rounded-2xl p-4 min-w-56",
        style: {
          background: "rgba(14,20,32,0.97)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(32px)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.7)"
        },
        children: [
          popup === "wifi" && /* @__PURE__ */ jsxRuntimeExports.jsx(WifiPanel, { wifi, onWifiChange: setWifi }),
          popup === "vol" && /* @__PURE__ */ jsxRuntimeExports.jsx(VolumePanel, { vol, setVol }),
          popup === "bat" && /* @__PURE__ */ jsxRuntimeExports.jsx(BattPanel, { battery })
        ]
      },
      popup
    ) })
  ] });
}
function TrayIcon({ children, onClick, active, title }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      title,
      className: "flex items-center justify-center w-7 h-6 rounded-md transition-colors",
      style: { background: active ? "rgba(255,255,255,0.12)" : "transparent", color: "rgba(255,255,255,0.7)" },
      onMouseEnter: (e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.09)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = active ? "rgba(255,255,255,0.12)" : "transparent";
      },
      children
    }
  );
}
function WifiIcon({ connected, signal }) {
  const c = connected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)";
  const eff = connected && signal === 0 ? 100 : signal;
  const s1 = connected || eff > 25 ? c : "rgba(255,255,255,0.2)";
  const s2 = eff > 40 ? c : "rgba(255,255,255,0.2)";
  const s3 = eff > 70 ? c : "rgba(255,255,255,0.2)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "12", viewBox: "0 0 24 18", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 14.5 a1.5 1.5 0 1 1 0 0.1Z", fill: c }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8.5 11.5 Q12 8 15.5 11.5", fill: "none", stroke: s1, strokeWidth: "2", strokeLinecap: "round" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5.5 8.5 Q12 3 18.5 8.5", fill: "none", stroke: s2, strokeWidth: "2", strokeLinecap: "round" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2.5 5.5 Q12 -2 21.5 5.5", fill: "none", stroke: s3, strokeWidth: "2", strokeLinecap: "round" })
  ] });
}
function VolumeIcon({ muted, level }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "rgba(255,255,255,0.85)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
    muted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "23", y1: "9", x2: "17", y2: "15" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "17", y1: "9", x2: "23", y2: "15" })
    ] }) : level > 50 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19.07 4.93a10 10 0 0 1 0 14.14" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15.54 8.46a5 5 0 0 1 0 7.07" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15.54 8.46a5 5 0 0 1 0 7.07" })
  ] });
}
function BattIcon({ level, charging }) {
  const low = level <= 20;
  const stroke = low ? "#ef4444" : charging ? "#00ff88" : "rgba(255,255,255,0.85)";
  const fill = low ? "#ef4444" : charging ? "#00ff88" : "rgba(255,255,255,0.85)";
  const fillW = Math.max(1, level / 100 * 16);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: "18",
      height: "11",
      viewBox: "0 0 22 12",
      style: charging ? { filter: "drop-shadow(0 0 3px rgba(0,255,136,0.6))" } : void 0,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0.5", y: "0.5", width: "18", height: "11", rx: "2.5", fill: "none", stroke, strokeWidth: "1.2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "19", y: "3.5", width: "2.5", height: "5", rx: "1", fill: stroke }),
        charging ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.g,
          {
            animate: { opacity: [0.55, 1, 0.55] },
            transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "1.5", y: "1.5", width: fillW, height: "9", rx: "1.5", fill }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "9", y: "10", fontSize: "8", fill: "#050a0f", textAnchor: "middle", fontWeight: "bold", children: "⚡" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "1.5", y: "1.5", width: fillW, height: "9", rx: "1.5", fill })
      ]
    }
  );
}
function PanelLabel({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold mb-3", style: { color: "var(--cryo-accent)", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 10 }, children });
}
function WifiPanel({ wifi, onWifiChange }) {
  const [networks, setNetworks] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [connecting, setConnecting] = reactExports.useState(null);
  const [selected, setSelected] = reactExports.useState(null);
  const [password, setPassword] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  reactExports.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const nets = await window.cryogram.system.getNetworks();
        setNetworks(nets);
      } catch {
      }
      setLoading(false);
    };
    load();
  }, []);
  const connect = async (net, pw) => {
    setConnecting(net.ssid);
    setError("");
    try {
      const result = await window.cryogram.system.connectNetwork(net.ssid, pw || void 0);
      if (result?.success) {
        setSelected(null);
        setPassword("");
        const updated = await window.cryogram.system.getWifiStatus();
        onWifiChange(updated);
      } else {
        setError(result?.message || "Connection failed — check your password");
      }
    } catch {
      setError("Connection error");
    }
    setConnecting(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 260 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLabel, { children: "Wi-Fi" }),
    wifi?.connected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3 px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full shrink-0", style: { background: "#4ade80", boxShadow: "0 0 6px #4ade80" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium truncate", style: { color: "#e2e8f0" }, children: wifi.ssid }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs ml-auto shrink-0", style: { color: "rgba(255,255,255,0.35)" }, children: [
        wifi.signal,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5 max-h-52 overflow-y-auto mb-2", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-center py-4", style: { color: "rgba(255,255,255,0.3)" }, children: "Scanning…" }) : networks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-center py-4", style: { color: "rgba(255,255,255,0.3)" }, children: "No networks found" }) : networks.map((net) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => {
          setSelected((s) => s?.ssid === net.ssid ? null : net);
          setPassword("");
          setError("");
        },
        className: "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors",
        style: {
          background: net.active ? "var(--cryo-a12)" : selected?.ssid === net.ssid ? "rgba(255,255,255,0.08)" : "transparent",
          border: net.active ? "1px solid var(--cryo-a20)" : "1px solid transparent"
        },
        onMouseEnter: (e) => {
          if (!net.active) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        },
        onMouseLeave: (e) => {
          if (!net.active) e.currentTarget.style.background = selected?.ssid === net.ssid ? "rgba(255,255,255,0.08)" : "transparent";
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SignalBars, { signal: net.signal, active: net.active }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-xs truncate", style: { color: net.active ? "var(--cryo-accent)" : "rgba(255,255,255,0.75)" }, children: net.ssid }),
          net.security && /* @__PURE__ */ jsxRuntimeExports.jsx(LockTinyIcon, {}),
          net.active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: { color: "var(--cryo-accent)" }, children: "✓" })
        ]
      },
      net.ssid
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: selected && !selected.active && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 },
        className: "overflow-hidden",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 space-y-2", children: [
          selected.security && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              placeholder: "Wi-Fi password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") connect(selected, password);
              },
              autoFocus: true,
              className: "w-full px-3 py-2 rounded-lg text-xs outline-none",
              style: {
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#e2e8f0"
              }
            }
          ),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", style: { color: "#f87171" }, children: error }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => connect(selected, password),
              disabled: !!connecting,
              className: "w-full py-1.5 rounded-lg text-xs font-medium transition-colors",
              style: {
                background: connecting ? "var(--cryo-a08)" : "var(--cryo-a18)",
                border: "1px solid var(--cryo-a25)",
                color: connecting ? "var(--cryo-a50)" : "var(--cryo-accent)"
              },
              children: connecting === selected.ssid ? "Connecting…" : `Connect to ${selected.ssid}`
            }
          )
        ] })
      }
    ) })
  ] });
}
function SignalBars({ signal, active }) {
  const color2 = active ? "var(--cryo-accent)" : "rgba(255,255,255,0.6)";
  const dim = "rgba(255,255,255,0.18)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "12", viewBox: "0 0 14 12", className: "shrink-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "8", width: "3", height: "4", rx: "1", fill: signal > 20 ? color2 : dim }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4", y: "5", width: "3", height: "7", rx: "1", fill: signal > 40 ? color2 : dim }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "2", width: "3", height: "10", rx: "1", fill: signal > 65 ? color2 : dim }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "12", y: "0", width: "2", height: "12", rx: "1", fill: signal > 85 ? color2 : dim })
  ] });
}
function LockTinyIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "9", height: "10", viewBox: "0 0 9 10", fill: "none", className: "shrink-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0.5", y: "4", width: "8", height: "5.5", rx: "1.5", stroke: "rgba(255,255,255,0.3)", strokeWidth: "1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2.5 4V3a2 2 0 0 1 4 0v1", stroke: "rgba(255,255,255,0.3)", strokeWidth: "1", strokeLinecap: "round" })
  ] });
}
function VolumePanel({ vol, setVol }) {
  if (!vol) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.4)" }, className: "text-sm", children: "Unavailable" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLabel, { children: "Volume" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeIcon, { muted: vol.muted, level: vol.level }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "range",
          min: 0,
          max: 100,
          value: vol.level,
          disabled: vol.muted,
          onChange: async (e) => {
            const v2 = Number(e.target.value);
            setVol({ ...vol, level: v2 });
            await window.cryogram.system.setVolume(v2);
          },
          className: "w-full accent-cyan-400",
          style: { opacity: vol.muted ? 0.4 : 1 }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs w-8 text-right", style: { color: "rgba(255,255,255,0.5)" }, children: vol.muted ? "—" : `${vol.level}%` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: async () => {
          await window.cryogram.system.toggleMute();
          const u2 = await window.cryogram.system.getVolume();
          setVol(u2);
        },
        className: "w-full text-xs py-1.5 rounded-lg transition-colors",
        style: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.1)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        },
        children: vol.muted ? "Unmute" : "Mute"
      }
    )
  ] });
}
function BattPanel({ battery }) {
  if (!battery) return null;
  const color2 = battery.level > 20 ? "#00d4ff" : "#ef4444";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLabel, { children: "Battery" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1.5 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-3xl font-bold", style: { color: color2 }, children: [
        battery.level,
        "%"
      ] }),
      battery.charging && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: { color: "#00ff88" }, children: "Charging" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1.5 rounded-full overflow-hidden mb-2", style: { background: "rgba(255,255,255,0.08)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "h-full rounded-full",
        animate: { width: `${battery.level}%` },
        style: { background: battery.level > 20 ? "linear-gradient(90deg,#00d4ff,#bb88ff)" : "#ef4444" }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", style: { color: "rgba(255,255,255,0.35)" }, children: battery.status })
  ] });
}
let toastId = 0;
function NotificationToast() {
  const [toasts, setToasts] = reactExports.useState([]);
  const dismiss = (id2) => setToasts((p2) => p2.filter((t2) => t2.id !== id2));
  reactExports.useEffect(() => {
    const handler = (e) => {
      const { title, body } = e.detail;
      const id2 = ++toastId;
      setToasts((prev) => [...prev, { id: id2, title, body }]);
      setTimeout(() => dismiss(id2), 5500);
    };
    window.addEventListener("cryogram:notification", handler);
    return () => window.removeEventListener("cryogram:notification", handler);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed top-12 right-4 flex flex-col gap-2 z-[200] pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: toasts.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: 60, scale: 0.9 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 60, scale: 0.9 },
      transition: { type: "spring", stiffness: 350, damping: 28 },
      className: "pointer-events-auto w-72 rounded-xl overflow-hidden",
      style: {
        background: "rgba(13,20,33,0.95)",
        border: "1px solid rgba(0,212,255,0.3)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.1)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-0.5 w-full bg-gradient-to-r from-cryo-accent via-cryo-purple to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex items-start gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
              style: { background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.25)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "#00d4ff", strokeWidth: "2.5", strokeLinecap: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" }) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cryo-accent text-xs font-bold truncate", children: t2.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cryo-text text-xs mt-0.5 leading-relaxed opacity-80", children: t2.body })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => dismiss(t2.id),
              className: "text-cryo-muted hover:text-cryo-text transition-colors text-base leading-none shrink-0 mt-0.5",
              children: "×"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "h-px mx-3 mb-2 rounded-full bg-cryo-accent/40",
            initial: { scaleX: 1, originX: 0 },
            animate: { scaleX: 0 },
            transition: { duration: 5.5, ease: "linear" }
          }
        )
      ]
    },
    t2.id
  )) }) });
}
function SystemHUD() {
  const [hud, setHud] = reactExports.useState(null);
  const timer = reactExports.useRef();
  const show = reactExports.useCallback((next) => {
    setHud(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setHud(null), 2200);
  }, []);
  reactExports.useEffect(() => {
    const api = window.cryogram;
    const c1 = api?.onHudVolume?.((v2) => show({ type: "volume", value: v2.level, muted: v2.muted }));
    const c2 = api?.onHudBrightness?.((v2) => show({ type: "brightness", value: v2.level }));
    return () => {
      c1?.();
      c2?.();
    };
  }, [show]);
  if (!hud) return null;
  const icon = hud.type === "brightness" ? "☀" : hud.muted ? "🔇" : hud.value < 40 ? "🔈" : "🔊";
  const label = hud.type === "brightness" ? "Brightness" : "Volume";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: -12, scale: 0.94 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -12, scale: 0.94 },
      transition: { duration: 0.18 },
      style: {
        position: "fixed",
        top: 38,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(13,20,33,0.96)",
        border: "1px solid var(--cryo-a25)",
        borderRadius: 14,
        padding: "10px 18px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        zIndex: 99999,
        boxShadow: "0 8px 40px rgba(0,0,0,0.65), 0 0 0 1px rgba(0,212,255,0.08)",
        backdropFilter: "blur(20px)",
        minWidth: 210,
        pointerEvents: "none"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 22 }, children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "#8b949e", fontFamily: "monospace", marginBottom: 5, letterSpacing: 1 }, children: label.toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "rgba(0,212,255,0.1)", borderRadius: 4, height: 5, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              style: { height: "100%", background: "linear-gradient(90deg, var(--cryo-accent), var(--cryo-accent2))", borderRadius: 4 },
              animate: { width: `${hud.muted ? 0 : hud.value}%` },
              transition: { type: "spring", stiffness: 280, damping: 22 }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, color: "var(--cryo-accent)", fontFamily: "monospace", width: 34, textAlign: "right" }, children: hud.muted ? "M" : `${hud.value}%` })
      ]
    },
    "hud"
  ) });
}
const APP_COLORS = {
  terminal: "#00ff88",
  editor: "#00d4ff",
  "password-tester": "#ffcc00",
  leaker: "#ff4466",
  settings: "#bb88ff",
  files: "#f59e0b",
  launcher: "#34d399",
  system: "#818cf8",
  opticseo: "#10b981",
  phone: "#a855f7",
  scanner: "#00ff88",
  vpn: "#a78bfa",
  notes: "#fbbf24",
  mail: "#ea4335",
  "password-manager": "#ffcc00",
  "ssh-keys": "#00d4ff",
  firewall: "#ff4466",
  "task-manager": "#818cf8",
  logs: "#a855f7",
  netmon: "#00d4ff",
  screenshot: "#34d399"
};
const APP_ICONS = {
  terminal: ">_",
  editor: "{}",
  mail: "✉",
  files: "📁",
  launcher: "⊞",
  settings: "⚙",
  system: "♡",
  phone: "📱",
  scanner: "◎",
  vpn: "🔒",
  notes: "📝",
  screenshot: "📸",
  "password-tester": "🔑",
  leaker: "💧",
  opticseo: "🔍",
  "password-manager": "🗝",
  "ssh-keys": "🔐",
  firewall: "🛡",
  "task-manager": "📊",
  logs: "📋",
  netmon: "📡"
};
const APP_LABELS = {
  terminal: "Terminal",
  editor: "Editor",
  "password-tester": "Pwd Tester",
  leaker: "Leaker",
  settings: "Settings",
  files: "Files",
  launcher: "Launcher",
  system: "System",
  opticseo: "OpticSEO",
  phone: "Phone",
  scanner: "Scanner",
  vpn: "VPN",
  notes: "Notes",
  mail: "Gmail",
  "password-manager": "Pwd Mgr",
  "ssh-keys": "SSH Keys",
  firewall: "Firewall",
  "task-manager": "Tasks",
  logs: "Logs",
  netmon: "NetMon",
  screenshot: "Screenshot"
};
function getX11Meta(title) {
  const t2 = title.toLowerCase();
  const last = title.split(" - ").pop()?.trim() ?? title;
  const firstName = last.split(" ")[0];
  if (t2.includes("brave")) return { icon: "🦁", color: "#fb923c", name: "Brave" };
  if (t2.includes("chromium")) return { icon: "🌐", color: "#4ade80", name: "Chromium" };
  if (t2.includes("chrome")) return { icon: "🌐", color: "#4ade80", name: "Chrome" };
  if (t2.includes("firefox")) return { icon: "🦊", color: "#f97316", name: "Firefox" };
  if (t2.includes("visual studio code") || t2.includes("vscode")) return { icon: "💻", color: "#60a5fa", name: "VS Code" };
  if (t2.includes("thunar") || t2.includes("nautilus")) return { icon: "📁", color: "#f59e0b", name: "Files" };
  if (t2.includes("vlc") || t2.includes(" mpv")) return { icon: "▶", color: "#f43f5e", name: "Media" };
  if (t2.includes("discord")) return { icon: "💬", color: "#818cf8", name: "Discord" };
  if (t2.includes("slack")) return { icon: "💬", color: "#4ade80", name: "Slack" };
  if (t2.includes("spotify")) return { icon: "🎵", color: "#4ade80", name: "Spotify" };
  if (t2.includes("gimp")) return { icon: "🎨", color: "#e879f9", name: "GIMP" };
  const name = firstName.length > 11 ? firstName.slice(0, 10) + "…" : firstName;
  return { icon: "⬡", color: "#64748b", name: name || "App" };
}
function AppSwitcherOverlay() {
  const [visible, setVisible] = reactExports.useState(false);
  const [selIdx, setSelIdx] = reactExports.useState(0);
  const windows = useWindowStore((s) => s.windows);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);
  const [x11Windows, setX11Windows] = reactExports.useState([]);
  const hideTimer = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!visible) return;
    const fetchX11 = () => {
      try {
        ;
        window.cryogram?.wm?.getWindows?.()?.then?.((wins) => {
          if (Array.isArray(wins)) setX11Windows(wins.filter(
            (w2) => w2.desktop >= 0 && !w2.title?.toLowerCase().includes("cryogram") && w2.title?.trim()
          ));
        });
      } catch {
      }
    };
    fetchX11();
  }, [visible]);
  const entries = [];
  const seenApps = /* @__PURE__ */ new Set();
  for (const win of windows) {
    if (seenApps.has(win.appId)) continue;
    seenApps.add(win.appId);
    const color2 = APP_COLORS[win.appId] ?? "#64748b";
    const icon = APP_ICONS[win.appId] ?? "⬡";
    const label = APP_LABELS[win.appId] ?? win.title;
    entries.push({
      key: `app-${win.id}`,
      type: "app",
      windowId: win.id,
      appId: win.appId,
      icon,
      color: color2,
      label
    });
  }
  for (const x2 of x11Windows) {
    const meta = getX11Meta(x2.title);
    entries.push({
      key: `x11-${x2.id}`,
      type: "x11",
      x11Title: x2.title,
      icon: meta.icon,
      color: meta.color,
      label: meta.name
    });
  }
  const shown = entries.slice(0, 8);
  const resetHideTimer = reactExports.useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), 1e3);
  }, []);
  const showSwitcher = reactExports.useCallback((direction) => {
    setVisible(true);
    setSelIdx((idx) => {
      const len = Math.max(shown.length, 1);
      if (direction === "next") return (idx + 1) % len;
      return (idx - 1 + len) % len;
    });
    resetHideTimer();
  }, [shown.length, resetHideTimer]);
  reactExports.useEffect(() => {
    const onSwitcherEvent = (e) => {
      const ce2 = e;
      showSwitcher(ce2.detail ?? "next");
    };
    window.addEventListener("cryogram:switcher", onSwitcherEvent);
    return () => window.removeEventListener("cryogram:switcher", onSwitcherEvent);
  }, [showSwitcher]);
  reactExports.useEffect(() => {
    const cg2 = window.cryogram;
    if (cg2?.onAppSwitcher) {
      const unsub = cg2.onAppSwitcher((dir) => showSwitcher(dir));
      return unsub;
    }
  }, [showSwitcher]);
  reactExports.useEffect(() => {
    if (!visible) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "Tab") {
        e.preventDefault();
        setSelIdx((i) => (i + 1) % Math.max(shown.length, 1));
        resetHideTimer();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSelIdx((i) => (i - 1 + Math.max(shown.length, 1)) % Math.max(shown.length, 1));
        resetHideTimer();
      } else if (e.key === "Enter") {
        e.preventDefault();
        activateEntry(shown[selIdx]);
        setVisible(false);
      } else if (e.key === "Escape") {
        setVisible(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, shown, selIdx, resetHideTimer]);
  function activateEntry(entry) {
    if (!entry) return;
    if (entry.type === "app" && entry.windowId) {
      restoreWindow(entry.windowId);
      focusWindow(entry.windowId);
    }
  }
  reactExports.useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);
  const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: visible && /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.14 },
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 99e3,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: font
      },
      onClick: () => setVisible(false),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.92, y: 16 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.92, y: 10 },
            transition: { type: "spring", stiffness: 420, damping: 30, mass: 0.7 },
            onClick: (e) => e.stopPropagation(),
            style: {
              background: "rgba(12,16,26,0.92)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              overflowX: "auto",
              maxWidth: "min(90vw, 900px)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.75)"
            },
            children: shown.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.3)", fontSize: 13, padding: "8px 16px" }, children: "No open windows" }) : shown.map((entry, i) => {
              const isSelected = i === selIdx;
              const color2 = entry.color;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.button,
                {
                  onClick: () => {
                    activateEntry(entry);
                    setVisible(false);
                  },
                  whileHover: { scale: 1.08 },
                  animate: {
                    scale: isSelected ? 1.12 : 1,
                    opacity: isSelected ? 1 : 0.55
                  },
                  transition: { type: "spring", stiffness: 400, damping: 26 },
                  style: {
                    width: 96,
                    height: 96,
                    flexShrink: 0,
                    borderRadius: 18,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    cursor: "pointer",
                    background: `radial-gradient(ellipse at 40% 30%, ${color2}30, rgba(8,12,20,0.92) 70%)`,
                    border: isSelected ? `1.5px solid ${color2}` : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: isSelected ? `0 0 20px ${color2}55, 0 0 6px ${color2}30` : "none",
                    outline: "none",
                    padding: 0
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          fontSize: 28,
                          lineHeight: 1,
                          color: isSelected ? color2 : "rgba(255,255,255,0.75)",
                          fontFamily: font
                        },
                        children: entry.icon
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          fontSize: 10,
                          color: isSelected ? color2 : "rgba(255,255,255,0.4)",
                          fontWeight: isSelected ? 600 : 400,
                          textAlign: "center",
                          maxWidth: 82,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          letterSpacing: "0.01em"
                        },
                        children: entry.label
                      }
                    )
                  ]
                },
                entry.key
              );
            })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 16,
          alignItems: "center"
        }, children: [
          { key: "←→", desc: "navigate" },
          { key: "↵", desc: "switch" },
          { key: "esc", desc: "cancel" }
        ].map(({ key, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { style: {
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 5,
            color: "rgba(255,255,255,0.35)",
            fontSize: 10,
            padding: "1px 6px",
            fontFamily: font
          }, children: key }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.22)" }, children: desc })
        ] }, key)) })
      ]
    }
  ) });
}
function AnimatedBackground() {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf;
    let t2 = 0;
    const resize2 = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize2();
    window.addEventListener("resize", resize2);
    const SPACING = 46;
    const DOT_R = 1.05;
    const draw = () => {
      t2 += 7e-3;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W2 = canvas.width;
      const H2 = canvas.height;
      const cols = Math.ceil(W2 / SPACING) + 1;
      const rows = Math.ceil(H2 / SPACING) + 1;
      const maxDist = Math.sqrt((W2 / 2) ** 2 + (H2 / 2) ** 2);
      for (let x2 = 0; x2 < cols; x2++) {
        for (let y2 = 0; y2 < rows; y2++) {
          const px2 = x2 * SPACING;
          const py = y2 * SPACING;
          const dx = px2 - W2 / 2;
          const dy = py - H2 / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = 1 - dist / maxDist;
          const wave1 = Math.sin(dist * 0.011 - t2 * 1.5) * 0.5 + 0.5;
          const wave2 = Math.sin(dist * 9e-3 - t2 * 0.9 + Math.PI * 0.7) * 0.5 + 0.5;
          const alphaCyan = 0.04 + wave1 * 0.1 * proximity + proximity * 0.04;
          const alphaPurple = (0.02 + wave2 * 0.07 * proximity) * (1 - proximity * 0.5);
          const clamped1 = Math.min(alphaCyan, 0.22);
          const clamped2 = Math.min(alphaPurple, 0.12);
          ctx.beginPath();
          ctx.arc(px2, py, DOT_R, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,212,255,${clamped1})`;
          ctx.fill();
          if (clamped2 > 0.01) {
            ctx.beginPath();
            ctx.arc(px2, py, DOT_R, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(187,136,255,${clamped2})`;
            ctx.fill();
          }
        }
      }
      const gA1 = 0.022 + Math.sin(t2 * 0.6) * 0.01;
      const g1 = ctx.createRadialGradient(W2 / 2, H2 / 2, 0, W2 / 2, H2 / 2, W2 * 0.42);
      g1.addColorStop(0, `rgba(0,212,255,${gA1})`);
      g1.addColorStop(0.55, `rgba(0,212,255,${gA1 * 0.25})`);
      g1.addColorStop(1, "rgba(0,212,255,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W2, H2);
      const gA2 = 0.012 + Math.sin(t2 * 0.4 + 1.2) * 6e-3;
      const g2 = ctx.createRadialGradient(W2 * 0.75, H2 * 0.65, 0, W2 * 0.75, H2 * 0.65, W2 * 0.35);
      g2.addColorStop(0, `rgba(187,136,255,${gA2})`);
      g2.addColorStop(1, "rgba(187,136,255,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W2, H2);
      const scanY = t2 * 26 % (H2 * 2) - H2 * 0.25;
      const scanG = ctx.createLinearGradient(0, scanY - 80, 0, scanY + 80);
      scanG.addColorStop(0, "rgba(0,212,255,0)");
      scanG.addColorStop(0.5, "rgba(0,212,255,0.018)");
      scanG.addColorStop(1, "rgba(0,212,255,0)");
      ctx.fillStyle = scanG;
      ctx.fillRect(0, scanY - 80, W2, 160);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize2);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      className: "absolute inset-0 pointer-events-none"
    }
  );
}
const STEPS = [
  { text: "Initializing secure kernel modules…", ms: 0 },
  { text: "Mounting encrypted workspace…", ms: 320 },
  { text: "Starting PTY subsystem…", ms: 600 },
  { text: "Loading breach intelligence engine…", ms: 860 },
  { text: "Calibrating network interfaces…", ms: 1100 },
  { text: "All systems nominal — welcome back.", ms: 1320 }
];
function BootSplash({ onDone }) {
  const [phase, setPhase] = reactExports.useState("scan");
  const [visibleSteps, setVisible] = reactExports.useState(0);
  const [progress2, setProgress] = reactExports.useState(0);
  const canvasRef = reactExports.useRef(null);
  const rafRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize2 = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize2();
    const cols = Math.floor(canvas.width / 22);
    const drops = Array(cols).fill(1).map(() => Math.random() * -canvas.height / 22);
    const chars = "01アイウエオカキクケコサシスセソ";
    const draw = () => {
      ctx.fillStyle = "rgba(6,10,16,0.22)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '12px "JetBrains Mono", monospace';
      drops.forEach((y2, i) => {
        const ch2 = chars[Math.floor(Math.random() * chars.length)];
        const alpha2 = Math.random() > 0.93 ? 0.65 : 0.1;
        ctx.fillStyle = `rgba(0,212,255,${alpha2})`;
        ctx.fillText(ch2, i * 22, y2 * 22);
        if (y2 * 22 > canvas.height && Math.random() > 0.977) drops[i] = 0;
        else drops[i] = y2 + 1;
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  reactExports.useEffect(() => {
    const t1 = setTimeout(() => setPhase("logo"), 500);
    const t2 = setTimeout(() => setPhase("boot"), 1100);
    STEPS.forEach((step, i) => {
      setTimeout(() => {
        setVisible(i + 1);
        setProgress(Math.round((i + 1) / STEPS.length * 100));
      }, 1100 + step.ms);
    });
    const lastMs = STEPS[STEPS.length - 1].ms;
    const t3 = setTimeout(() => setPhase("exit"), 1100 + lastMs + 500);
    const t4 = setTimeout(onDone, 1100 + lastMs + 1100);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onDone]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden",
      style: { background: "#060a10" },
      animate: phase === "exit" ? { opacity: 0, scale: 1.03 } : { opacity: 1, scale: 1 },
      transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "absolute inset-0 pointer-events-none", style: { opacity: 0.38 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 pointer-events-none",
            style: { background: "radial-gradient(ellipse 60% 50% at 50% 52%, rgba(0,212,255,0.055) 0%, transparent 70%)" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: phase === "scan" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "absolute left-0 right-0 pointer-events-none",
            style: {
              height: 1.5,
              background: "linear-gradient(90deg, transparent 8%, rgba(0,212,255,0.9) 38%, rgba(0,255,136,1) 50%, rgba(0,212,255,0.9) 62%, transparent 92%)",
              boxShadow: "0 0 20px rgba(0,212,255,0.7)"
            },
            initial: { top: "0%", opacity: 0 },
            animate: { top: "100%", opacity: [0, 1, 1, 0] },
            transition: { duration: 0.48, ease: "linear" }
          }
        ) }),
        ["tl", "tr", "bl", "br"].map((corner, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "absolute w-8 h-8 pointer-events-none",
            style: {
              top: corner.startsWith("t") ? 28 : void 0,
              bottom: corner.startsWith("b") ? 28 : void 0,
              left: corner.endsWith("l") ? 28 : void 0,
              right: corner.endsWith("r") ? 28 : void 0,
              borderTop: corner.startsWith("t") ? "1px solid rgba(0,212,255,0.28)" : void 0,
              borderBottom: corner.startsWith("b") ? "1px solid rgba(0,212,255,0.28)" : void 0,
              borderLeft: corner.endsWith("l") ? "1px solid rgba(0,212,255,0.28)" : void 0,
              borderRight: corner.endsWith("r") ? "1px solid rgba(0,212,255,0.28)" : void 0
            },
            initial: { opacity: 0, scale: 0.5 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: 0.45 + i * 0.05, duration: 0.3, ease: [0.34, 1.4, 0.64, 1] }
          },
          corner
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: (phase === "logo" || phase === "boot" || phase === "exit") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            className: "flex flex-col items-center mb-10",
            initial: { opacity: 0, y: 20, scale: 0.85 },
            animate: { opacity: 1, y: 0, scale: 1 },
            transition: { duration: 0.5, ease: [0.34, 1.3, 0.64, 1] },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    className: "w-[88px] h-[88px] flex items-center justify-center",
                    style: {
                      background: "radial-gradient(circle at 38% 32%, rgba(0,212,255,0.12) 0%, rgba(0,212,255,0.03) 60%, transparent 100%)",
                      border: "1px solid rgba(0,212,255,0.28)",
                      borderRadius: 24,
                      boxShadow: "0 0 48px rgba(0,212,255,0.08), inset 0 1px 0 rgba(0,212,255,0.15)"
                    },
                    animate: { boxShadow: ["0 0 30px rgba(0,212,255,0.08)", "0 0 55px rgba(0,212,255,0.16)", "0 0 30px rgba(0,212,255,0.08)"] },
                    transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "absolute inset-0 rounded-[23px] pointer-events-none",
                          style: { background: "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, transparent 60%)" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "40", height: "40", viewBox: "0 0 24 24", fill: "none", stroke: "#00d4ff", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "9 12 11 14 15 10" })
                      ] })
                    ]
                  }
                ),
                [1, 1.35].map((scale2, ri2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    className: "absolute inset-0 rounded-[24px] pointer-events-none",
                    style: { border: "1px solid rgba(0,212,255,0.35)" },
                    animate: { scale: [1, scale2], opacity: [0.4, 0] },
                    transition: { duration: 2.2, delay: ri2 * 0.7, repeat: Infinity, ease: "easeOut" }
                  },
                  ri2
                ))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex mb-2", style: { gap: 2 }, children: "CRYOGRAM".split("").map((ch2, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.span,
                {
                  initial: { opacity: 0, y: 18 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: i * 0.048, duration: 0.32, ease: [0.2, 0, 0, 1] },
                  style: {
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 44,
                    fontWeight: 900,
                    color: "var(--cryo-accent, #00d4ff)",
                    textShadow: "0 0 22px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.14)",
                    letterSpacing: "0.18em",
                    lineHeight: 1
                  },
                  children: ch2
                },
                i
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { delay: 0.55, duration: 0.5 },
                  style: {
                    fontSize: 11,
                    letterSpacing: "0.45em",
                    textTransform: "uppercase",
                    color: "rgba(0,212,255,0.36)",
                    fontFamily: '"JetBrains Mono", monospace'
                  },
                  children: "Security Operations Platform"
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: (phase === "boot" || phase === "exit") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            className: "flex flex-col items-center gap-4 w-72",
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            transition: { duration: 0.35 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[2px] rounded-full overflow-hidden", style: { background: "rgba(0,212,255,0.08)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    className: "h-full rounded-full relative",
                    style: { background: "linear-gradient(90deg, #00d4ff 0%, #00ff88 100%)", boxShadow: "0 0 10px rgba(0,212,255,0.9)" },
                    initial: { width: "0%" },
                    animate: { width: `${progress2}%` },
                    transition: { ease: [0.4, 0, 0.2, 1], duration: 0.28 },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "absolute right-0 top-1/2 -translate-y-1/2 rounded-full",
                        style: { width: 6, height: 6, background: "#00d4ff", boxShadow: "0 0 10px 4px rgba(0,212,255,0.8)" }
                      }
                    )
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mt-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, fontFamily: '"JetBrains Mono", monospace', color: "rgba(0,212,255,0.3)", letterSpacing: "0.1em" }, children: "BOOT" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 9, fontFamily: '"JetBrains Mono", monospace', color: progress2 === 100 ? "#00ff88" : "rgba(0,212,255,0.38)" }, children: [
                    progress2,
                    "%"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full space-y-1.5", children: STEPS.slice(0, visibleSteps).map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, x: -12 },
                  animate: { opacity: 1, x: 0 },
                  transition: { duration: 0.2 },
                  className: "flex items-center gap-2.5",
                  style: { fontFamily: '"JetBrains Mono", monospace', fontSize: 10 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: i === visibleSteps - 1 ? "#00ff88" : "#00ff8855" }, children: "✓" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: i === visibleSteps - 1 ? "rgba(200,210,220,0.8)" : "rgba(80,95,115,0.5)" }, children: step.text })
                  ]
                },
                i
              )) })
            ]
          }
        ) })
      ]
    }
  );
}
const useLockStore = create((set) => ({
  isLocked: false,
  pinRequired: false,
  lock: (pinRequired = true) => set({ isLocked: true, pinRequired }),
  unlock: () => {
    window.cryogram?.notifyUnlock?.();
    set({ isLocked: false, pinRequired: false });
  }
}));
const MIN_DIGITS = 4;
const MAX_DIGITS = 8;
function LockScreen() {
  const { unlock, pinRequired } = useLockStore();
  const [pin, setPin] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [shaking, setShaking] = reactExports.useState(false);
  const [time2, setTime] = reactExports.useState(/* @__PURE__ */ new Date());
  reactExports.useEffect(() => {
    const id2 = setInterval(() => setTime(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(id2);
  }, []);
  const addDigit = reactExports.useCallback((d) => {
    setPin((p2) => p2.length >= MAX_DIGITS ? p2 : p2 + d);
    setError("");
  }, []);
  const del = reactExports.useCallback(() => {
    setPin((p2) => p2.slice(0, -1));
    setError("");
  }, []);
  const shake = reactExports.useCallback((msg) => {
    setError(msg);
    setShaking(true);
    setPin("");
    setTimeout(() => setShaking(false), 550);
  }, []);
  reactExports.useEffect(() => {
    if (!pinRequired || pin.length < MIN_DIGITS) return;
    let cancelled = false;
    (async () => {
      try {
        const ok2 = await window.cryogram.system.verifyPin(pin);
        if (cancelled) return;
        if (ok2) {
          unlock();
        } else if (pin.length >= MAX_DIGITS) {
          shake("Incorrect PIN — try again");
        }
      } catch {
        if (!cancelled && pin.length >= MAX_DIGITS) shake("Unable to verify PIN");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pin, pinRequired, unlock, shake]);
  reactExports.useEffect(() => {
    const onKey = (e) => {
      e.stopPropagation();
      if (!pinRequired) {
        if (e.key === "Enter" || e.key === " ") unlock();
        return;
      }
      if (e.key >= "0" && e.key <= "9") addDigit(e.key);
      else if (e.key === "Backspace") del();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [pinRequired, unlock, addDigit, del]);
  const h = time2.getHours().toString().padStart(2, "0");
  const m2 = time2.getMinutes().toString().padStart(2, "0");
  const ds = time2.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const dotCount = Math.max(MIN_DIGITS, pin.length);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "fixed inset-0 flex flex-col items-center justify-center",
      style: { zIndex: 99999, background: "rgba(3,7,14,0.97)", backdropFilter: "blur(48px)" },
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0, transition: { duration: 0.25 } },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full",
            style: { background: "radial-gradient(circle, var(--cryo-a05) 0%, transparent 65%)" }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "tracking-[0.5em] uppercase text-xs mb-1",
              style: { color: "var(--cryo-a45)", fontFamily: '"JetBrains Mono", monospace' },
              children: "CRYOGRAM OS"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-px mx-auto", style: { background: "var(--cryo-a20)" } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12 select-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BlinkingClock, { h, m: m2, seconds: time2.getSeconds() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.38)", fontSize: 13, fontFamily: "-apple-system, sans-serif", marginTop: 6 }, children: ds })
        ] }),
        pinRequired ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: "flex gap-4",
              animate: shaking ? { x: [0, -10, 10, -10, 10, -5, 5, 0] } : {},
              transition: { duration: 0.5 },
              children: Array.from({ length: dotCount }).map((_, i) => {
                const filled = i < pin.length;
                const isErr = !!(error && filled);
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    className: "rounded-full",
                    animate: {
                      scale: filled ? 1.2 : 1,
                      background: isErr ? "#f87171" : filled ? "var(--cryo-accent)" : "rgba(255,255,255,0.18)",
                      boxShadow: filled && !isErr ? `0 0 12px var(--cryo-a50)` : "none"
                    },
                    transition: { duration: 0.1 },
                    style: { width: 12, height: 12 }
                  },
                  i
                );
              })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: error && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: -4 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0 },
              className: "text-xs text-center",
              style: { color: "#f87171", fontFamily: "-apple-system, sans-serif" },
              children: error
            },
            error
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.22)", fontFamily: "-apple-system, sans-serif", marginTop: 4 }, children: "Type your PIN to unlock" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.3)", fontSize: 13, fontFamily: "-apple-system, sans-serif" }, children: "Press any key or click to continue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.button,
            {
              onClick: unlock,
              whileTap: { scale: 0.95 },
              className: "px-10 py-2.5 rounded-xl text-sm font-medium",
              style: {
                background: "var(--cryo-a08)",
                border: "1px solid var(--cryo-a30)",
                color: "var(--cryo-accent)",
                fontFamily: "-apple-system, sans-serif"
              },
              whileHover: { background: "var(--cryo-a18)" },
              children: "Unlock"
            }
          )
        ] })
      ]
    }
  );
}
function BlinkingClock({ h, m: m2, seconds }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "tabular-nums font-extralight",
      style: {
        fontSize: "5.5rem",
        lineHeight: 1,
        color: "#ffffff",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        letterSpacing: "-0.03em",
        textShadow: "0 0 60px var(--cryo-a10)"
      },
      children: [
        h,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: seconds % 2 === 0 ? 1 : 0.25, transition: "opacity 0.4s" }, children: ":" }),
        m2
      ]
    }
  );
}
const THEME_PRESETS = [
  { id: "cyber", name: "Cyber", accent: "#00d4ff", accent2: "#00ff88", bg: "#070b11" },
  { id: "phantom", name: "Phantom", accent: "#a855f7", accent2: "#ec4899", bg: "#09070f" },
  { id: "emerald", name: "Emerald", accent: "#10b981", accent2: "#06b6d4", bg: "#060d0a" },
  { id: "fire", name: "Fire", accent: "#f97316", accent2: "#ef4444", bg: "#0e0805" },
  { id: "slate", name: "Slate", accent: "#94a3b8", accent2: "#e2e8f0", bg: "#0a0c10" }
];
const DEFAULT = THEME_PRESETS[0];
const useThemeStore = create((set) => ({
  preset: DEFAULT.id,
  accent: DEFAULT.accent,
  accent2: DEFAULT.accent2,
  bg: DEFAULT.bg,
  setPreset(id2) {
    const p2 = THEME_PRESETS.find((t2) => t2.id === id2) ?? DEFAULT;
    set({ preset: p2.id, accent: p2.accent, accent2: p2.accent2, bg: p2.bg });
    const api = window.cryogram;
    api?.settings?.set("theme.preset", p2.id);
    api?.settings?.set("theme.accent", p2.accent);
    api?.settings?.set("theme.accent2", p2.accent2);
    api?.settings?.set("theme.bg", p2.bg);
  },
  setCustomAccent(accent) {
    set({ preset: "custom", accent });
    const api = window.cryogram;
    api?.settings?.set("theme.preset", "custom");
    api?.settings?.set("theme.accent", accent);
  },
  async loadFromSettings() {
    try {
      const api = window.cryogram;
      if (!api?.settings) return;
      const all = await api.settings.getAll();
      const id2 = all["theme.preset"];
      const accent = all["theme.accent"];
      const accent2 = all["theme.accent2"];
      const bg2 = all["theme.bg"];
      if (id2 && id2 !== "custom") {
        const p2 = THEME_PRESETS.find((t2) => t2.id === id2);
        if (p2) {
          set({ preset: p2.id, accent: p2.accent, accent2: p2.accent2, bg: p2.bg });
          return;
        }
      }
      if (accent) {
        set({
          preset: id2 ?? "custom",
          accent,
          accent2: accent2 ?? DEFAULT.accent2,
          bg: bg2 ?? DEFAULT.bg
        });
      }
    } catch {
    }
  }
}));
function hexAlpha(hex2, pct) {
  const h = Math.round(pct * 255).toString(16).padStart(2, "0");
  return hex2 + h;
}
function ThemeProvider({ children }) {
  const { accent, accent2, bg: bg2, loadFromSettings } = useThemeStore();
  reactExports.useEffect(() => {
    loadFromSettings();
  }, []);
  reactExports.useEffect(() => {
    const r2 = document.documentElement.style;
    r2.setProperty("--cryo-accent", accent);
    r2.setProperty("--cryo-accent2", accent2);
    r2.setProperty("--cryo-bg", bg2);
    r2.setProperty("--cryo-a05", hexAlpha(accent, 0.05));
    r2.setProperty("--cryo-a08", hexAlpha(accent, 0.08));
    r2.setProperty("--cryo-a10", hexAlpha(accent, 0.1));
    r2.setProperty("--cryo-a12", hexAlpha(accent, 0.12));
    r2.setProperty("--cryo-a18", hexAlpha(accent, 0.18));
    r2.setProperty("--cryo-a20", hexAlpha(accent, 0.2));
    r2.setProperty("--cryo-a25", hexAlpha(accent, 0.25));
    r2.setProperty("--cryo-a30", hexAlpha(accent, 0.3));
    r2.setProperty("--cryo-a45", hexAlpha(accent, 0.45));
    r2.setProperty("--cryo-a50", hexAlpha(accent, 0.5));
  }, [accent, accent2, bg2]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
function UpdateNotification({ info, onUpdate, onDismiss }) {
  const [expanded, setExpanded] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onDismiss]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 32, scale: 0.94 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 24, scale: 0.92 },
      transition: { type: "spring", stiffness: 420, damping: 30 },
      style: {
        position: "fixed",
        bottom: 90,
        right: 20,
        width: 340,
        zIndex: 99e3,
        background: "rgba(10,16,26,0.97)",
        border: "1px solid rgba(0,212,255,0.25)",
        borderRadius: 18,
        boxShadow: "0 0 0 1px rgba(0,212,255,0.08), 0 24px 64px rgba(0,0,0,0.85), 0 0 40px rgba(0,212,255,0.06)",
        backdropFilter: "blur(40px)",
        overflow: "hidden",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 2, background: "linear-gradient(90deg, transparent, var(--cryo-accent) 40%, #00ff88 60%, transparent)", opacity: 0.7 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "14px 16px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "rgba(0,212,255,0.12)",
              border: "1px solid rgba(0,212,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "var(--cryo-accent)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "17 8 12 3 7 8" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "3", x2: "12", y2: "15" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.92)" }, children: "Update Available" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 1 }, children: [
                info.commitCount,
                " new ",
                info.commitCount === 1 ? "change" : "changes",
                " ready to install"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onDismiss,
                style: { marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 4, borderRadius: 6 },
                onMouseEnter: (e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)",
                onMouseLeave: (e) => e.currentTarget.style.color = "rgba(255,255,255,0.3)",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                ] })
              }
            )
          ] }),
          info.changes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: (expanded ? info.changes : info.changes.slice(0, 2)).map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, height: 0 },
                animate: { opacity: 1, height: "auto" },
                style: { display: "flex", alignItems: "flex-start", gap: 7, marginBottom: 4 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 4, height: 4, borderRadius: 2, background: "var(--cryo-accent)", marginTop: 5, flexShrink: 0, opacity: 0.7 } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }, children: c })
                ]
              },
              i
            )) }),
            info.changes.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setExpanded((v2) => !v2),
                style: { background: "none", border: "none", color: "var(--cryo-accent)", fontSize: 11, cursor: "pointer", padding: 0, opacity: 0.75 },
                children: expanded ? "Show less" : `+${info.changes.length - 2} more changes`
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onUpdate,
                style: {
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 700,
                  background: "linear-gradient(135deg, var(--cryo-accent) 0%, #00ff88 100%)",
                  border: "none",
                  color: "#000",
                  cursor: "pointer",
                  boxShadow: "0 0 16px rgba(0,212,255,0.3)"
                },
                children: "Update Now"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onDismiss,
                style: {
                  padding: "8px 16px",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.55)",
                  cursor: "pointer"
                },
                onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)",
                onMouseLeave: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.07)",
                children: "Not Now"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function HexGrid$1() {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize2 = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize2();
    window.addEventListener("resize", resize2);
    const SIZE = 32;
    const W2 = SIZE * 2;
    const H2 = Math.sqrt(3) * SIZE;
    let frame2 = 0;
    const hexPath = (cx, cy, r2) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = Math.PI / 3 * i - Math.PI / 6;
        const x2 = cx + r2 * Math.cos(angle);
        const y2 = cy + r2 * Math.sin(angle);
        if (i === 0) ctx.moveTo(x2, y2);
        else ctx.lineTo(x2, y2);
      }
      ctx.closePath();
    };
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame2++;
      const cols = Math.ceil(canvas.width / W2) + 2;
      const rows = Math.ceil(canvas.height / H2) + 2;
      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const cx = col * W2 + (row % 2 === 0 ? 0 : W2 / 2);
          const cy = row * H2;
          const pulse = Math.sin(frame2 * 0.018 + col * 0.4 + row * 0.3) * 0.5 + 0.5;
          const alpha2 = pulse * 0.12 + 0.02;
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha2})`;
          ctx.lineWidth = 0.8;
          hexPath(cx, cy, SIZE - 2);
          ctx.stroke();
        }
      }
      requestAnimationFrame(animate);
    };
    const animId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize2);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, style: { position: "absolute", inset: 0, opacity: 0.6 } });
}
function SpinRing({ size, color: color2, speed = 2, gap = 0.25 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      style: { width: size, height: size, borderRadius: "50%", position: "absolute" },
      animate: { rotate: 360 },
      transition: { duration: speed, repeat: Infinity, ease: "linear" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        border: `2px solid transparent`,
        borderTopColor: color2,
        borderRightColor: gap < 0.5 ? color2 : "transparent",
        boxShadow: `0 0 12px ${color2}60`
      } })
    }
  );
}
function stripAnsi(s) {
  return s.replace(/\x1B\[[0-9;]*[mGKH]/g, "").replace(/\r/g, "");
}
function UpdateScreen({ onCancel }) {
  const [phase, setPhase] = reactExports.useState("auth");
  const [log, setLog] = reactExports.useState([]);
  const [countdown, setCount] = reactExports.useState(10);
  const [error, setError] = reactExports.useState(null);
  const [needsSudoSetup, setNeedsSudoSetup] = reactExports.useState(false);
  const [password, setPassword] = reactExports.useState("");
  const [wrongPassword, setWrongPassword] = reactExports.useState(false);
  const logRef = reactExports.useRef(null);
  const countdownRef = reactExports.useRef(null);
  const appendLog = reactExports.useCallback((raw) => {
    const lines = stripAnsi(raw).split("\n").filter((l2) => l2.trim());
    setLog((prev) => [...prev, ...lines].slice(-120));
    if (raw.includes("Rebooting in") || raw.includes("Rebooting")) {
      setPhase("countdown");
    }
  }, []);
  reactExports.useEffect(() => {
    const el2 = logRef.current;
    if (el2) el2.scrollTop = el2.scrollHeight;
  }, [log]);
  reactExports.useEffect(() => {
    if (phase !== "countdown") return;
    setCount(10);
    countdownRef.current = setInterval(() => {
      setCount((n2) => {
        if (n2 <= 1) {
          clearInterval(countdownRef.current);
          setPhase("rebooting");
          return 0;
        }
        return n2 - 1;
      });
    }, 1e3);
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [phase]);
  reactExports.useEffect(() => {
    const api = window.cryogram?.updater;
    if (!api) return;
  }, []);
  const runUpdate = reactExports.useCallback(async (pw) => {
    setPhase("starting");
    setError(null);
    setNeedsSudoSetup(false);
    setWrongPassword(false);
    await new Promise((r2) => setTimeout(r2, 800));
    setPhase("updating");
    try {
      const api = window.cryogram?.updater;
      if (!api) {
        setError("Updater API not available — run from the live OS.");
        return;
      }
      const unsub = api.onProgress((line) => appendLog(line));
      try {
        await api.run(pw);
        if (phase !== "countdown" && phase !== "rebooting") setPhase("countdown");
      } finally {
        unsub();
      }
    } catch (err) {
      const msg = String(err?.message ?? err);
      if (msg.includes("code null") || msg.includes("killed")) {
        setPhase("rebooting");
      } else if (msg === "wrong-password" || msg.includes("wrong-password")) {
        setPhase("auth");
        setWrongPassword(true);
      } else if (msg.includes("password is required") || msg.includes("sudo:")) {
        setNeedsSudoSetup(true);
        setPhase("auth");
      } else {
        setError(msg);
      }
    }
  }, [phase, appendLog]);
  const phaseLabel = {
    auth: "Install Update",
    starting: "Preparing update…",
    updating: "Installing update…",
    countdown: "Update complete",
    rebooting: "Rebooting…"
  };
  const phaseColor = {
    auth: "var(--cryo-accent)",
    starting: "var(--cryo-accent)",
    updating: "var(--cryo-accent)",
    countdown: "#00ff88",
    rebooting: "#a855f7"
  };
  const color2 = error ? "#ef4444" : phaseColor[phase];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.4 },
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 2e5,
        background: "rgba(4,7,14,0.98)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(HexGrid$1, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${color2}08, transparent 70%)`,
          transition: "background 1s"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 32, width: "100%", maxWidth: 680, padding: "0 24px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }, children: [
            phase !== "auth" && /* @__PURE__ */ jsxRuntimeExports.jsx(SpinRing, { size: 120, color: color2, speed: 3, gap: 0.3 }),
            phase !== "auth" && /* @__PURE__ */ jsxRuntimeExports.jsx(SpinRing, { size: 96, color: `${color2}80`, speed: 2.1, gap: 0.5 }),
            phase !== "auth" && /* @__PURE__ */ jsxRuntimeExports.jsx(SpinRing, { size: 74, color: `${color2}40`, speed: 1.5, gap: 0.7 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                animate: { scale: [1, 1.06, 1] },
                transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                style: {
                  position: "absolute",
                  width: 50,
                  height: 50,
                  borderRadius: 16,
                  background: `${color2}15`,
                  border: `1.5px solid ${color2}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 24px ${color2}40`
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: phase === "countdown" || phase === "rebooting" ? /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { type: "spring", stiffness: 500, damping: 24 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: color2, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "20 6 9 17 4 12" }) }) }, "check") : /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: color2, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "17 8 12 3 7 8" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "3", x2: "12", y2: "15" })
                ] }) }, "arrow") })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 8 },
                animate: { opacity: 1, y: 0 },
                style: { fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.02em" },
                children: needsSudoSetup ? "One-Time Setup Required" : error ? "Update Failed" : phaseLabel[phase]
              },
              phase
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, color: "rgba(255,255,255,0.38)", marginTop: 5 }, children: needsSudoSetup ? "Run the command below once in a terminal, then try again" : error ? "Check log below for details" : phase === "countdown" || phase === "rebooting" ? "Your laptop will fully restart" : "Downloading code changes only — not a new OS" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: phase === "auth" && !needsSudoSetup && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -8 },
              style: { width: "100%", maxWidth: 380 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16,
                padding: "20px 22px"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 12 }, children: "Enter your account password to install the update" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "password",
                    placeholder: "Password",
                    value: password,
                    autoFocus: true,
                    onChange: (e) => {
                      setPassword(e.target.value);
                      setWrongPassword(false);
                    },
                    onKeyDown: (e) => {
                      if (e.key === "Enter" && password) runUpdate(password);
                    },
                    style: {
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "rgba(0,0,0,0.4)",
                      border: `1px solid ${wrongPassword ? "#ef4444" : "rgba(255,255,255,0.12)"}`,
                      color: "#fff",
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit"
                    }
                  }
                ),
                wrongPassword && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#f87171", marginTop: 6 }, children: "Incorrect password — try again" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, marginTop: 14 }, children: [
                  onCancel && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: onCancel,
                      style: {
                        flex: 1,
                        padding: "9px 0",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 500,
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.6)",
                        cursor: "pointer"
                      },
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => password && runUpdate(password),
                      disabled: !password,
                      style: {
                        flex: 2,
                        padding: "9px 0",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 700,
                        background: password ? "linear-gradient(135deg, var(--cryo-accent), #7c3aed)" : "rgba(255,255,255,0.05)",
                        border: "none",
                        color: password ? "#fff" : "rgba(255,255,255,0.25)",
                        cursor: password ? "pointer" : "default",
                        boxShadow: password ? "0 0 20px var(--cryo-a30)" : "none",
                        transition: "all 0.2s"
                      },
                      children: "Install Update & Reboot"
                    }
                  )
                ] })
              ] })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: (phase === "countdown" || phase === "rebooting") && !error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.5 },
              animate: { opacity: 1, scale: 1 },
              exit: { opacity: 0 },
              transition: { type: "spring", stiffness: 380, damping: 24 },
              style: { textAlign: "center" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, scale: 0.4, y: -12 },
                    animate: { opacity: 1, scale: 1, y: 0 },
                    exit: { opacity: 0, scale: 1.2, y: 8 },
                    transition: { type: "spring", stiffness: 500, damping: 26 },
                    style: {
                      fontSize: 80,
                      fontWeight: 900,
                      lineHeight: 1,
                      color: color2,
                      textShadow: `0 0 40px ${color2}80, 0 0 80px ${color2}40`,
                      letterSpacing: "-0.05em",
                      fontVariantNumeric: "tabular-nums"
                    },
                    children: phase === "rebooting" ? "↺" : countdown
                  },
                  countdown
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 8 }, children: phase === "rebooting" ? "Restarting system…" : `Rebooting in ${countdown} second${countdown !== 1 ? "s" : ""}…` })
              ]
            }
          ) }),
          (phase === "updating" || error) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              style: { width: "100%" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  ref: logRef,
                  style: {
                    height: 200,
                    overflowY: "auto",
                    background: "rgba(0,0,0,0.55)",
                    border: `1px solid ${error ? "rgba(239,68,68,0.25)" : "rgba(0,212,255,0.12)"}`,
                    borderRadius: 12,
                    padding: "10px 14px",
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                    fontSize: 11,
                    lineHeight: 1.65,
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255,255,255,0.12) transparent"
                  },
                  children: log.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "rgba(255,255,255,0.25)" }, children: "Starting update process…" }) : log.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                    color: line.includes("FAIL") || line.includes("error") || line.includes("Error") ? "#f87171" : line.includes("OK") || line.includes("ok") || line.includes("✓") ? "#4ade80" : line.includes("──") || line.includes("WARN") ? "#fbbf24" : "rgba(255,255,255,0.62)"
                  }, children: line }, i))
                }
              )
            }
          ),
          needsSudoSetup && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              style: { width: "100%" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                background: "rgba(251,191,36,0.07)",
                border: "1px solid rgba(251,191,36,0.25)",
                borderRadius: 12,
                padding: "16px 18px"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(251,191,36,0.8)", marginBottom: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }, children: "Open a terminal and run this command once:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  background: "rgba(0,0,0,0.5)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11,
                  color: "#00d4ff",
                  wordBreak: "break-all",
                  lineHeight: 1.7,
                  userSelect: "text"
                }, children: 'echo "$(whoami) ALL=(ALL) NOPASSWD: /usr/local/bin/cryogram-update" | sudo tee /etc/sudoers.d/cryogram && sudo chmod 440 /etc/sudoers.d/cryogram' }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 10 }, children: "After running it, click Update Now again — no password will be needed from that point on." })
              ] })
            }
          ),
          (error || needsSudoSetup) && onCancel && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onCancel,
              style: {
                padding: "8px 24px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                background: needsSudoSetup ? "rgba(251,191,36,0.1)" : "rgba(239,68,68,0.15)",
                border: `1px solid ${needsSudoSetup ? "rgba(251,191,36,0.3)" : "rgba(239,68,68,0.35)"}`,
                color: needsSudoSetup ? "#fbbf24" : "#f87171",
                cursor: "pointer"
              },
              children: "Close"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          bottom: 28,
          fontSize: 10,
          letterSpacing: "0.3em",
          fontWeight: 700,
          color: "rgba(255,255,255,0.12)",
          fontFamily: '"JetBrains Mono", monospace',
          textTransform: "uppercase"
        }, children: "CRYOGRAM OS" })
      ]
    }
  );
}
function SpotlightSearch({ open, onClose }) {
  const [query, setQuery] = reactExports.useState("");
  const [selectedIdx, setIdx] = reactExports.useState(0);
  const openApp = useWindowStore((s) => s.openApp);
  const inputRef = reactExports.useRef(null);
  const allResults = Object.entries(APP_META).map(([id2, meta]) => ({
    appId: id2,
    label: meta.label,
    color: meta.color,
    icon: meta.icon
  }));
  const results = query.trim() ? allResults.filter((r2) => r2.label.toLowerCase().includes(query.toLowerCase())) : allResults;
  const shown = results.slice(0, 8);
  reactExports.useEffect(() => {
    if (open) {
      setQuery("");
      setIdx(0);
      const t2 = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t2);
    }
  }, [open]);
  reactExports.useEffect(() => {
    setIdx((i) => Math.min(i, Math.max(0, shown.length - 1)));
  }, [shown.length]);
  const launch = reactExports.useCallback((appId) => {
    openApp(appId);
    onClose();
  }, [openApp, onClose]);
  reactExports.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIdx((i) => Math.min(i + 1, shown.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (shown[selectedIdx]) launch(shown[selectedIdx].appId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, shown, selectedIdx, launch, onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.18 },
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 9e4,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "14vh"
      },
      onClick: (e) => {
        if (e.target === e.currentTarget) onClose();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.95, y: -12 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95, y: -8 },
          transition: { type: "spring", stiffness: 420, damping: 28, mass: 0.7 },
          style: {
            width: 600,
            borderRadius: 18,
            overflow: "hidden",
            background: "rgba(10,14,22,0.97)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(0,212,255,0.08)",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
          },
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 18px",
              borderBottom: shown.length > 0 ? "1px solid rgba(255,255,255,0.06)" : "none"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "svg",
                {
                  width: "18",
                  height: "18",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "rgba(255,255,255,0.35)",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "11", r: "8" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: inputRef,
                  value: query,
                  onChange: (e) => {
                    setQuery(e.target.value);
                    setIdx(0);
                  },
                  placeholder: "Search apps…",
                  style: {
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "rgba(255,255,255,0.92)",
                    fontSize: 18,
                    fontFamily: "inherit",
                    caretColor: "var(--cryo-accent)"
                  }
                }
              ),
              query && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    setQuery("");
                    setIdx(0);
                    inputRef.current?.focus();
                  },
                  style: {
                    background: "rgba(255,255,255,0.08)",
                    border: "none",
                    borderRadius: 6,
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 13,
                    cursor: "pointer",
                    padding: "2px 7px",
                    lineHeight: 1.4
                  },
                  children: "✕"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { style: {
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 6,
                color: "rgba(255,255,255,0.3)",
                fontSize: 11,
                padding: "2px 7px",
                fontFamily: "inherit",
                letterSpacing: "0.02em",
                whiteSpace: "nowrap"
              }, children: "esc" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: shown.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, height: 0 },
                animate: { opacity: 1, height: "auto" },
                exit: { opacity: 0, height: 0 },
                transition: { duration: 0.15 },
                style: { overflow: "hidden" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "6px 8px 8px" }, children: shown.map((result, i) => {
                  const isSelected = i === selectedIdx;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.button,
                    {
                      initial: { opacity: 0, x: -8 },
                      animate: { opacity: 1, x: 0 },
                      transition: { delay: i * 0.03, duration: 0.14 },
                      onClick: () => launch(result.appId),
                      onMouseEnter: () => setIdx(i),
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: 11,
                        border: isSelected ? `1px solid ${result.color}50` : "1px solid transparent",
                        background: isSelected ? `${result.color}12` : "transparent",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background 0.1s, border-color 0.1s"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          background: `radial-gradient(ellipse at 40% 30%, ${result.color}25, rgba(8,12,20,0.9) 70%)`,
                          border: `1px solid ${result.color}30`,
                          color: result.color
                        }, children: result.icon }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: result.color,
                          flexShrink: 0,
                          boxShadow: `0 0 6px ${result.color}80`
                        } }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                          flex: 1,
                          color: isSelected ? "#fff" : "rgba(255,255,255,0.78)",
                          fontSize: 14,
                          fontWeight: isSelected ? 600 : 400,
                          transition: "color 0.1s"
                        }, children: result.label }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                          background: isSelected ? `${result.color}25` : "rgba(255,255,255,0.06)",
                          border: `1px solid ${isSelected ? `${result.color}50` : "rgba(255,255,255,0.1)"}`,
                          borderRadius: 6,
                          color: isSelected ? result.color : "rgba(255,255,255,0.35)",
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "2px 8px",
                          transition: "all 0.1s"
                        }, children: "Open" })
                      ]
                    },
                    result.appId
                  );
                }) })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: query.trim() !== "" && shown.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                style: {
                  padding: "28px 0",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.25)",
                  fontSize: 13
                },
                children: [
                  "No apps found for “",
                  query,
                  "”"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              padding: "6px 18px 10px",
              display: "flex",
              gap: 16,
              alignItems: "center",
              borderTop: shown.length > 0 ? "1px solid rgba(255,255,255,0.05)" : "none"
            }, children: [
              { key: "↑↓", desc: "navigate" },
              { key: "↵", desc: "open" },
              { key: "esc", desc: "close" }
            ].map(({ key, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { style: {
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 5,
                color: "rgba(255,255,255,0.35)",
                fontSize: 10,
                padding: "1px 5px",
                fontFamily: "inherit"
              }, children: key }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.22)" }, children: desc })
            ] }, key)) })
          ]
        }
      )
    }
  ) });
}
function StatBar({ value, color: color2 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    flex: 1,
    height: 3,
    borderRadius: 99,
    background: "rgba(255,255,255,0.07)",
    overflow: "hidden"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      animate: { width: `${Math.min(100, Math.max(0, value))}%` },
      transition: { duration: 0.6, ease: "easeOut" },
      style: { height: "100%", borderRadius: 99, background: color2 }
    }
  ) });
}
function Widget({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    background: "rgba(8,12,20,0.65)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12,
    padding: "10px 14px",
    minWidth: 160
  }, children });
}
function ClockWidget() {
  const [now2, setNow] = reactExports.useState(/* @__PURE__ */ new Date());
  reactExports.useEffect(() => {
    const id2 = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(id2);
  }, []);
  const hh2 = now2.getHours().toString().padStart(2, "0");
  const mm = now2.getMinutes().toString().padStart(2, "0");
  const sec = now2.getSeconds();
  const day = now2.toLocaleDateString("en-US", { weekday: "short" });
  const dt = now2.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Widget, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      fontSize: 34,
      fontWeight: 200,
      lineHeight: 1,
      color: "rgba(255,255,255,0.92)",
      letterSpacing: "-0.02em",
      fontVariantNumeric: "tabular-nums",
      marginBottom: 3
    }, children: [
      hh2,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: sec % 2 === 0 ? 1 : 0.3, transition: "opacity 0.3s" }, children: ":" }),
      mm
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      fontSize: 11,
      color: "rgba(255,255,255,0.35)",
      fontFamily: "-apple-system, sans-serif",
      letterSpacing: "0.02em"
    }, children: [
      day,
      "  ",
      dt
    ] })
  ] });
}
function SystemStatsWidget() {
  const [info, setInfo] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const fetch2 = async () => {
      try {
        const raw = await window.cryogram.system.getInfo();
        const cpuPercent = Math.round(Math.random() * 35 + 8);
        const ramPercent = raw.ramTotal > 0 ? Math.round(raw.ramUsed / raw.ramTotal * 100) : 0;
        setInfo({ cpuPercent, ramPercent, ramUsed: raw.ramUsed, ramTotal: raw.ramTotal });
      } catch {
        setInfo({ cpuPercent: 12, ramPercent: 26, ramUsed: 0, ramTotal: 0 });
      }
    };
    fetch2();
    const id2 = setInterval(fetch2, 3e3);
    return () => clearInterval(id2);
  }, []);
  const cpuColor = !info ? "rgba(255,255,255,0.2)" : info.cpuPercent > 80 ? "#ef4444" : info.cpuPercent > 50 ? "#fbbf24" : "var(--cryo-accent)";
  const ramColor = !info ? "rgba(255,255,255,0.2)" : info.ramPercent > 80 ? "#ef4444" : info.ramPercent > 60 ? "#fbbf24" : "#a855f7";
  const fmt = (bytes) => {
    const gb2 = bytes / 1024 ** 3;
    return gb2 >= 1 ? `${gb2.toFixed(1)} GB` : `${Math.round(bytes / 1024 ** 2)} MB`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Widget, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      fontSize: 9,
      color: "rgba(255,255,255,0.28)",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      fontFamily: '"JetBrains Mono", monospace',
      marginBottom: 8
    }, children: "System" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 7 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 3 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "-apple-system, sans-serif" }, children: "CPU" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: cpuColor, fontFamily: '"JetBrains Mono", monospace' }, children: info ? `${info.cpuPercent}%` : "–" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBar, { value: info?.cpuPercent ?? 0, color: cpuColor })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 3 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "-apple-system, sans-serif" }, children: "RAM" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: ramColor, fontFamily: '"JetBrains Mono", monospace' }, children: info ? info.ramTotal > 0 ? `${fmt(info.ramUsed)} / ${fmt(info.ramTotal)}` : `${info.ramPercent}%` : "–" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBar, { value: info?.ramPercent ?? 0, color: ramColor })
    ] })
  ] });
}
function NetworkWidget() {
  const [wifi, setWifi] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const fetch2 = async () => {
      try {
        const s = await window.cryogram.system.getWifiStatus();
        setWifi(s);
      } catch {
        setWifi({ connected: false, ssid: "", signal: 0 });
      }
    };
    fetch2();
    const id2 = setInterval(fetch2, 5e3);
    return () => clearInterval(id2);
  }, []);
  const dotColor = wifi?.connected ? "#4ade80" : "#ef4444";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Widget, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      fontSize: 9,
      color: "rgba(255,255,255,0.28)",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      fontFamily: '"JetBrains Mono", monospace',
      marginBottom: 8
    }, children: "Network" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 7 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: dotColor,
        boxShadow: `0 0 6px ${dotColor}`,
        flexShrink: 0
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontSize: 12,
          fontWeight: 500,
          color: wifi?.connected ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)",
          fontFamily: "-apple-system, sans-serif",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }, children: wifi === null ? "Loading…" : wifi.connected ? wifi.ssid || "Connected" : "Not connected" }),
        wifi?.connected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "-apple-system, sans-serif", marginTop: 1 }, children: [
          "Signal: ",
          wifi.signal > 0 ? `${wifi.signal}%` : "good"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "12", viewBox: "0 0 24 18", style: { flexShrink: 0, opacity: wifi?.connected ? 1 : 0.25 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 14.5 a1.5 1.5 0 1 1 0 0.1Z", fill: dotColor }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8.5 11.5 Q12 8 15.5 11.5", fill: "none", stroke: dotColor, strokeWidth: "2", strokeLinecap: "round" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5.5 8.5 Q12 3 18.5 8.5", fill: "none", stroke: dotColor, strokeWidth: "2", strokeLinecap: "round", opacity: "0.7" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2.5 5.5 Q12 -2 21.5 5.5", fill: "none", stroke: dotColor, strokeWidth: "2", strokeLinecap: "round", opacity: "0.4" })
      ] })
    ] })
  ] });
}
function DesktopWidgets() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    position: "absolute",
    right: 20,
    bottom: 90,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    zIndex: 40,
    pointerEvents: "none"
  }, children: [
    { key: "clock", delay: 0, node: /* @__PURE__ */ jsxRuntimeExports.jsx(ClockWidget, {}) },
    { key: "sys", delay: 0.08, node: /* @__PURE__ */ jsxRuntimeExports.jsx(SystemStatsWidget, {}) },
    { key: "network", delay: 0.16, node: /* @__PURE__ */ jsxRuntimeExports.jsx(NetworkWidget, {}) }
  ].map(({ key, delay: delay2, node }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, x: 24 },
      animate: { opacity: 1, x: 0 },
      transition: { type: "spring", stiffness: 380, damping: 28, delay: delay2 },
      style: { pointerEvents: "auto" },
      children: node
    },
    key
  )) });
}
let _nextId$1 = 1;
let _entries = [];
const _listeners$1 = /* @__PURE__ */ new Set();
function _notify$1() {
  _listeners$1.forEach((fn) => fn());
}
function addToNotificationHistory(n2) {
  const entry = {
    id: _nextId$1++,
    title: n2.title,
    body: n2.body,
    timestamp: Date.now()
  };
  _entries = [entry, ..._entries].slice(0, 50);
  _notify$1();
}
if (typeof window !== "undefined") {
  window.addEventListener("cryogram:notification", (e) => {
    const { title, body } = e.detail;
    addToNotificationHistory({ title, body });
  });
}
function timeAgo$1(ts) {
  const diff = Math.floor((Date.now() - ts) / 1e3);
  if (diff < 10) return "just now";
  if (diff < 60) return `${diff}s ago`;
  const m2 = Math.floor(diff / 60);
  if (m2 < 60) return `${m2} minute${m2 !== 1 ? "s" : ""} ago`;
  const h = Math.floor(m2 / 60);
  if (h < 24) return `${h} hour${h !== 1 ? "s" : ""} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d !== 1 ? "s" : ""} ago`;
}
function groupKey(n2) {
  return n2.title.split(/\s+/)[0] ?? "Other";
}
function NotifCard({ entry, ticker }) {
  const [hov, setHov] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      transition: { type: "spring", stiffness: 380, damping: 28 },
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      style: {
        padding: "10px 12px",
        borderRadius: 10,
        background: hov ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border: hov ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.06)",
        transition: "background 0.15s, border-color 0.15s",
        cursor: "default"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "var(--cryo-accent)",
            flexShrink: 0
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            flex: 1,
            fontSize: 12,
            fontWeight: 600,
            color: "rgba(255,255,255,0.88)",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }, children: entry.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            fontSize: 10,
            color: "rgba(255,255,255,0.25)",
            fontFamily: "-apple-system, sans-serif",
            flexShrink: 0
          }, children: timeAgo$1(entry.timestamp) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontSize: 11,
          color: "rgba(255,255,255,0.5)",
          fontFamily: "-apple-system, sans-serif",
          lineHeight: 1.5,
          marginLeft: 12
        }, children: entry.body })
      ]
    }
  );
}
function NotificationHistory({ open, onClose }) {
  const [entries, setEntries] = reactExports.useState([..._entries]);
  const [ticker, setTicker] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const sync = () => setEntries([..._entries]);
    _listeners$1.add(sync);
    return () => {
      _listeners$1.delete(sync);
    };
  }, []);
  reactExports.useEffect(() => {
    const id2 = setInterval(() => setTicker((t2) => t2 + 1), 3e4);
    return () => clearInterval(id2);
  }, []);
  reactExports.useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  const clearAll = () => {
    _entries = [];
    _notify$1();
  };
  const grouped = {};
  entries.forEach((n2) => {
    const k2 = groupKey(n2);
    if (!grouped[k2]) grouped[k2] = [];
    grouped[k2].push(n2);
  });
  const groups = Object.entries(grouped);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.18 },
        onClick: onClose,
        style: {
          position: "fixed",
          inset: 0,
          zIndex: 88e3
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { x: 320, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 320, opacity: 0 },
        transition: { type: "spring", stiffness: 340, damping: 32, mass: 0.9 },
        style: {
          position: "fixed",
          top: 36,
          // below titlebar (36px)
          right: 0,
          bottom: 0,
          width: 320,
          zIndex: 89e3,
          background: "rgba(10,14,22,0.97)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          overflow: "hidden"
        },
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px 12px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            flexShrink: 0
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.88)" }, children: "Notifications" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 1 }, children: entries.length === 0 ? "None" : `${entries.length} item${entries.length !== 1 ? "s" : ""}` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
              entries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: clearAll,
                  style: {
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: 7,
                    color: "#f87171",
                    fontSize: 11,
                    fontWeight: 500,
                    padding: "4px 10px",
                    cursor: "pointer",
                    fontFamily: "inherit"
                  },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.background = "rgba(239,68,68,0.18)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                  },
                  children: "Clear All"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: onClose,
                  style: {
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 7,
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 14,
                    lineHeight: 1,
                    padding: "3px 8px",
                    cursor: "pointer"
                  },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  },
                  children: "✕"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            flex: 1,
            overflowY: "auto",
            padding: "10px 12px 16px",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.1) transparent"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0 },
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                paddingTop: 60
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "svg",
                  {
                    width: "22",
                    height: "22",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "rgba(255,255,255,0.25)",
                    strokeWidth: "1.8",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center" }, children: "No notifications yet" })
              ]
            },
            "empty"
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { style: { display: "flex", flexDirection: "column", gap: 10 }, children: groups.map(([groupLabel, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              fontSize: 9,
              fontWeight: 600,
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: '"JetBrains Mono", monospace',
              marginBottom: 5,
              paddingLeft: 2
            }, children: groupLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: items.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(NotifCard, { entry, ticker }, entry.id)) })
          ] }, groupLabel)) }, "list") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            height: 1,
            flexShrink: 0,
            background: "linear-gradient(90deg, transparent, var(--cryo-a20) 40%, var(--cryo-a20) 60%, transparent)"
          } })
        ]
      }
    )
  ] }) });
}
function AppGrid({ apps }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }, children: apps.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 32, height: 32, borderRadius: 8, background: `${a.color}18`, border: `1px solid ${a.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }, children: a.icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 2 }, children: a.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.4)", lineHeight: 1.4 }, children: a.desc })
    ] })
  ] }, a.name)) });
}
function ShortcutList({ rows }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: rows.map((r2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: "rgba(255,255,255,0.6)" }, children: r2.desc }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 4, flexShrink: 0 }, children: r2.keys.map((k2, ki2) => /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { style: { background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 4, padding: "2px 7px", fontSize: 10, fontFamily: '"JetBrains Mono",monospace', color: "rgba(255,255,255,0.75)" }, children: k2 }, ki2)) })
  ] }, i)) });
}
function Tip({ text, accent }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 14px", background: `${accent}10`, border: `1px solid ${accent}28`, borderRadius: 8, fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: accent, fontWeight: 700, marginRight: 6 }, children: "Tip" }),
    text
  ] });
}
const SLIDES = [
  // ── 1. Welcome ────────────────────────────────────────────────────────────
  {
    id: "welcome",
    title: "Welcome to CryoGram OS",
    subtitle: "A purpose-built security operations desktop",
    accent: "#00d4ff",
    content: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }, children: "CryoGram OS is a full-featured desktop environment designed for cybersecurity professionals. It runs as an Electron app on Linux and Windows, giving you a unified workspace for penetration testing, OSINT, breach monitoring, development, and system management." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }, children: [
        { icon: "🛡️", color: "#00d4ff", label: "40+ Built-in Apps" },
        { icon: "⚡", color: "#4ade80", label: "Real PTY Terminal" },
        { icon: "🔒", color: "#facc15", label: "Encrypted Vault" },
        { icon: "🤖", color: "#a78bfa", label: "AI Assistant" },
        { icon: "🌐", color: "#ef4444", label: "Shodan + OSINT" },
        { icon: "🔍", color: "#f97316", label: "CVE Database" }
      ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "14px 8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 22, marginBottom: 6 }, children: item.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.55)", fontWeight: 600 }, children: item.label })
      ] }, item.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tip, { text: "Use this guide anytime from Settings → Guide to refresh your memory.", accent: "#00d4ff" })
    ] })
  },
  // ── 2. Navigation ─────────────────────────────────────────────────────────
  {
    id: "navigation",
    title: "Getting Around",
    subtitle: "Titlebar, Dock, workspaces, and Mission Control",
    accent: "#bb88ff",
    content: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
      { icon: "📌", color: "#bb88ff", title: "Titlebar", desc: "Left: CryoGram menu. Centre: workspace switcher + clock. Right: notifications, quick settings gear, and your user avatar for weather, news & power controls." },
      { icon: "⬡", color: "#00d4ff", title: "Dock", desc: "Hover to magnify icons. Click to open or focus an app. Right-click for context menu. Drag to reorder. All 40+ apps appear automatically." },
      { icon: "🪟", color: "#4ade80", title: "Windows", desc: "Drag to any edge to snap (left/right half, or full-screen). Double-click titlebar to maximise. Middle-click or ✕ to close." },
      { icon: "🔭", color: "#facc15", title: "Mission Control", desc: "Press Super+M (or ⊞+M) to see all open windows as tiles. Click any tile to jump to it." }
    ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 12, padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 36, height: 36, borderRadius: 9, background: `${item.color}15`, border: `1px solid ${item.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }, children: item.icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 3 }, children: item.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }, children: item.desc })
      ] })
    ] }, item.title)) }) })
  },
  // ── 3. Security Tools ────────────────────────────────────────────────────
  {
    id: "security",
    title: "Security Tools",
    subtitle: "Built-in offensive & defensive security suite",
    accent: "#ff4466",
    content: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 14px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, fontSize: 11, color: "#f87171", lineHeight: 1.5 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Authorization Required" }),
        " — All network testing tools display a legal disclaimer. Only test systems you own or have written permission to test."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppGrid, { apps: [
        { icon: "🔑", color: "#ffcc00", name: "Password Tester", desc: "Hash cracking (brute, dict, hybrid) + SSH/HTTP/FTP spraying" },
        { icon: "💧", color: "#ff4466", name: "Leaker Monitor", desc: "HIBP + Dehashed breach monitoring for emails & domains" },
        { icon: "🔍", color: "#00ff88", name: "Network Scanner", desc: "Nmap-powered port scanner with service detection" },
        { icon: "🔥", color: "#ff4466", name: "Firewall", desc: "UFW rule manager — add, remove, enable/disable rules" },
        { icon: "🌐", color: "#a78bfa", name: "VPN Manager", desc: "OpenVPN & WireGuard connection profiles" },
        { icon: "🔒", color: "#4ade80", name: "Cert Inspector", desc: "Inspect TLS certificates by hostname or pasted PEM" },
        { icon: "🛡️", color: "#ff4466", name: "Code Scanner", desc: "Scan projects for OWASP Top 10, hardcoded secrets, XSS, injection" },
        { icon: "📡", color: "#22c55e", name: "Packet Sniffer", desc: "Live network capture via tshark/tcpdump with BPF filters" }
      ] })
    ] })
  },
  // ── 4. Security Intelligence ──────────────────────────────────────────────
  {
    id: "intel",
    title: "Security Intelligence",
    subtitle: "Shodan, OSINT, CVE database, and reconnaissance",
    accent: "#ef4444",
    content: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppGrid, { apps: [
        { icon: "🌐", color: "#ef4444", name: "Shodan Explorer", desc: "Search Shodan IoT/device database by query, view host details, saved searches" },
        { icon: "🔍", color: "#fb923c", name: "OSINT Dashboard", desc: "IP lookup, WHOIS, DNS records, email lookup, domain recon — no key needed" },
        { icon: "🛡️", color: "#f97316", name: "CVE Database", desc: "Search NVD vulnerability database — recent CVEs, severity, CVSS scores, references" },
        { icon: "📋", color: "#4ade80", name: "Wordlist Manager", desc: "Manage, import, preview, and generate custom wordlists for password testing" },
        { icon: "❤️", color: "#f472b6", name: "Password Health", desc: "Analyze password strength, check HIBP k-anonymity breach database" },
        { icon: "🔐", color: "#00d4ff", name: "2FA / TOTP", desc: "Manage TOTP accounts, generate codes, add via Base32 secret" }
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tip, { text: "Shodan requires an API key — configure it in Settings → API Keys. OSINT tools use free public APIs.", accent: "#ef4444" })
    ] })
  },
  // ── 5. Developer Tools ───────────────────────────────────────────────────
  {
    id: "developer",
    title: "Developer Tools",
    subtitle: "Terminal, editor, Git, Docker, and more",
    accent: "#4ade80",
    content: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppGrid, { apps: [
        { icon: "⬛", color: "#00ff88", name: "Terminal", desc: "Real PTY — runs bash, python, nmap, anything in your PATH" },
        { icon: "💻", color: "#00d4ff", name: "Code Editor", desc: "Monaco editor with file tree, syntax highlighting & run buttons" },
        { icon: "🌿", color: "#f05033", name: "Git Client", desc: "Stage, diff, commit, push/pull — visual branch + log view" },
        { icon: "🐳", color: "#2496ed", name: "Docker", desc: "Container & image management, live stats, log viewer, pull" },
        { icon: "🗄️", color: "#a855f7", name: "SQLite Browser", desc: "Read-only table browser + SQL query editor with pagination" },
        { icon: "🌐", color: "#fb923c", name: "API Tester", desc: "Postman-style HTTP client with saved collections" }
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tip, { text: "The Terminal has full PTY access — run nmap, hashcat, sqlmap, or any installed tool directly.", accent: "#4ade80" })
    ] })
  },
  // ── 6. Analysis & Encoding Tools ────────────────────────────────────────
  {
    id: "analysis",
    title: "Analysis & Encoding Tools",
    subtitle: "AI assistant, regex, encoding chains, and more",
    accent: "#a78bfa",
    content: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppGrid, { apps: [
        { icon: "🤖", color: "#a78bfa", name: "AI Assistant", desc: "Claude-powered security expert chat — vulnerability analysis, code review, tool guidance" },
        { icon: "🔐", color: "#00d4ff", name: "Crypto Tools", desc: "Hash (MD5/SHA/SHA256), encode/decode, JWT decode, password entropy" },
        { icon: "{}", color: "#fbbf24", name: "JSON / YAML Explorer", desc: "Parse, format, minify JSON; convert to YAML; interactive tree view" },
        { icon: ".*", color: "#818cf8", name: "Regex Tester", desc: "Live regex match highlighting, group capture, replace mode, quick patterns" },
        { icon: "🔄", color: "#34d399", name: "Encoding Chain", desc: "Build pipelines: Base64 → URL encode → Hex → ROT13 and more, chained" }
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tip, { text: "AI Assistant requires an Anthropic API key in Settings → API Keys. All other tools work offline.", accent: "#a78bfa" })
    ] })
  },
  // ── 7. Productivity & Utilities ──────────────────────────────────────────
  {
    id: "productivity",
    title: "Productivity & Utilities",
    subtitle: "Notes, pomodoro, backup, audit log, and more",
    accent: "#facc15",
    content: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppGrid, { apps: [
      { icon: "📝", color: "#fbbf24", name: "Notes", desc: "Quick notes with search — always available from the dock" },
      { icon: "🧮", color: "#facc15", name: "Calculator", desc: "Basic + scientific modes, keyboard support, calculation history" },
      { icon: "🍅", color: "#ef4444", name: "Pomodoro Timer", desc: "25-min focus sessions with task tracking and break reminders" },
      { icon: "💾", color: "#4ade80", name: "System Backup", desc: "Create and restore backups of CryoGram config and settings" },
      { icon: "📋", color: "#94a3b8", name: "Audit Log", desc: "Append-only activity log — track security events, app usage, auth" },
      { icon: "🖼", color: "#818cf8", name: "Wallpaper", desc: "Set custom wallpapers or choose gradient themes" },
      { icon: "📄", color: "#818cf8", name: "Markdown Editor", desc: "Split-pane editor with live preview and format toolbar" },
      { icon: "📁", color: "#f59e0b", name: "Files", desc: "Full file manager with copy, move, rename, and external open" }
    ] }) })
  },
  // ── 8. System & Monitoring ───────────────────────────────────────────────
  {
    id: "system",
    title: "System & Monitoring",
    subtitle: "Task manager, logs, network, phone, and SEO",
    accent: "#818cf8",
    content: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppGrid, { apps: [
        { icon: "⚙️", color: "#bb88ff", name: "Settings", desc: "10 tabs: appearance, profile, network, Bluetooth, sound, display, security, API keys, updates, about + Guide" },
        { icon: "📊", color: "#818cf8", name: "Task Manager", desc: "Live CPU/memory per process, kill signal support" },
        { icon: "📋", color: "#a855f7", name: "Log Viewer", desc: "journalctl browser — filter by unit, priority, time range" },
        { icon: "📡", color: "#00d4ff", name: "Network Monitor", desc: "Interface stats, live bandwidth graph, active connections" },
        { icon: "📱", color: "#a855f7", name: "Phone", desc: "ADB device manager + scrcpy screen mirror over USB or Wi-Fi" },
        { icon: "📈", color: "#10b981", name: "OpticSEO Pro", desc: "SEO analysis, keyword tracking, competitor research" }
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 10 }, children: [
        { icon: "🌡️", label: "Weather", desc: "Live weather in User Panel" },
        { icon: "📰", label: "News", desc: "Hacker News feed in User Panel" },
        { icon: "🔔", label: "Notifications", desc: "History via bell icon" }
      ].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, textAlign: "center", padding: "10px 6px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 20, marginBottom: 4 }, children: i.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.75)", marginBottom: 2 }, children: i.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.35)" }, children: i.desc })
      ] }, i.label)) })
    ] })
  },
  // ── 9. Keyboard Shortcuts ─────────────────────────────────────────────────
  {
    id: "shortcuts",
    title: "Keyboard Shortcuts",
    subtitle: "Every shortcut at a glance",
    accent: "#00d4ff",
    content: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: "#00d4ff", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }, children: "System" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShortcutList, { rows: [
            { keys: ["Ctrl", "Space"], desc: "Spotlight search" },
            { keys: ["Super", "L"], desc: "Lock screen" },
            { keys: ["Super", "M"], desc: "Mission Control" },
            { keys: ["Ctrl", "/"], desc: "Keyboard shortcuts" },
            { keys: ["Ctrl", "⇧", "V"], desc: "Clipboard history" }
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: "#bb88ff", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }, children: "Windows" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShortcutList, { rows: [
            { keys: ["Alt", "Tab"], desc: "Switch app" },
            { keys: ["Ctrl", "Alt", "T"], desc: "Open Terminal" },
            { keys: ["Super", "D"], desc: "Show desktop" },
            { keys: ["Super", "1–4"], desc: "Switch workspace" }
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }, children: "Snapping" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShortcutList, { rows: [
            { keys: ["Drag → left"], desc: "Snap left half" },
            { keys: ["Drag → right"], desc: "Snap right half" },
            { keys: ["Drag → top"], desc: "Maximise" }
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: "#facc15", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }, children: "In-App" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShortcutList, { rows: [
            { keys: ["Ctrl", "S"], desc: "Save (Markdown)" },
            { keys: ["⌘", "↵"], desc: "Run SQL query" },
            { keys: ["Esc"], desc: "Close overlay" }
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tip, { text: "Press Ctrl+/ anytime to show this shortcuts reference as a floating overlay.", accent: "#00d4ff" })
    ] })
  }
];
function NavDots({ total, current, accent, onGo }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }, children: Array.from({ length: total }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onGo(i), style: {
    padding: 0,
    border: "none",
    cursor: "pointer",
    width: i === current ? 20 : 7,
    height: 7,
    borderRadius: 99,
    background: i === current ? accent : "rgba(255,255,255,0.2)",
    transition: "all 0.25s ease"
  } }, i)) });
}
function TutorialSlides({ inline, onDone, doneLabel = "Finish" }) {
  const [page, setPage] = reactExports.useState(0);
  const [prev, setPrev] = reactExports.useState(0);
  const slide = SLIDES[page];
  const direction = page >= prev ? 1 : -1;
  const isLast = page === SLIDES.length - 1;
  const goTo = (next) => {
    setPrev(page);
    setPage(Math.max(0, Math.min(SLIDES.length - 1, next)));
  };
  const variants = {
    enter: (d) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -48 : 48, opacity: 0 })
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", height: inline ? "100%" : "auto", minHeight: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto", padding: inline ? "20px 24px 16px" : "0 0 16px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", custom: direction, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        custom: direction,
        variants,
        initial: "enter",
        animate: "center",
        exit: "exit",
        transition: { duration: 0.22, ease: "easeInOut" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 18 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: 6, background: `${slide.accent}14`, border: `1px solid ${slide.accent}28`, borderRadius: 20, padding: "3px 10px", marginBottom: 10 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 6, height: 6, borderRadius: "50%", background: slide.accent } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 10, fontWeight: 700, color: slide.accent, textTransform: "uppercase", letterSpacing: "0.08em" }, children: [
                page + 1,
                " / ",
                SLIDES.length
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 4 }, children: slide.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.4)" }, children: slide.subtitle })
          ] }),
          slide.content
        ]
      },
      slide.id
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flexShrink: 0, padding: inline ? "12px 24px 16px" : "12px 0 0", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: inline ? "rgba(8,12,20,0.6)" : "transparent" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => goTo(page - 1),
          disabled: page === 0,
          style: { padding: "7px 16px", fontSize: 12, fontWeight: 600, background: page === 0 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: page === 0 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.65)", cursor: page === 0 ? "default" : "pointer" },
          children: "← Previous"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(NavDots, { total: SLIDES.length, current: page, accent: slide.accent, onGo: goTo }),
      isLast && onDone ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onDone,
          style: { padding: "7px 18px", fontSize: 12, fontWeight: 700, background: "var(--cryo-accent)", color: "#000", border: "none", borderRadius: 8, cursor: "pointer" },
          children: doneLabel
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => goTo(page + 1),
          disabled: isLast && !onDone,
          style: { padding: "7px 16px", fontSize: 12, fontWeight: 600, background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.25)", borderRadius: 8, color: isLast ? "rgba(255,255,255,0.25)" : "var(--cryo-accent)", cursor: isLast ? "default" : "pointer" },
          children: "Next →"
        }
      )
    ] })
  ] });
}
function HexGrid() {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize2 = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize2();
    window.addEventListener("resize", resize2);
    const SIZE = 32;
    const W2 = SIZE * 2;
    const H2 = Math.sqrt(3) * SIZE;
    let frame2 = 0;
    const hexPath = (cx, cy, r2) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = Math.PI / 3 * i - Math.PI / 6;
        const x2 = cx + r2 * Math.cos(angle);
        const y2 = cy + r2 * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(x2, y2);
        } else {
          ctx.lineTo(x2, y2);
        }
      }
      ctx.closePath();
    };
    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame2++;
      const cols = Math.ceil(canvas.width / W2) + 2;
      const rows = Math.ceil(canvas.height / H2) + 2;
      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const cx = col * W2 + (row % 2 === 0 ? 0 : W2 / 2);
          const cy = row * H2;
          const pulse = Math.sin(frame2 * 0.018 + col * 0.4 + row * 0.3) * 0.5 + 0.5;
          const alpha2 = pulse * 0.1 + 0.02;
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha2})`;
          ctx.lineWidth = 0.8;
          hexPath(cx, cy, SIZE - 2);
          ctx.stroke();
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize2);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      style: { position: "absolute", inset: 0, opacity: 0.55, pointerEvents: "none" }
    }
  );
}
function HexShield({ color: color2 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      animate: { scale: [1, 1.05, 1] },
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      style: {
        width: 72,
        height: 72,
        borderRadius: 18,
        background: `radial-gradient(circle at 38% 30%, ${color2}18, rgba(8,12,20,0.9) 70%)`,
        border: `1.5px solid ${color2}40`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 32px ${color2}25, inset 0 1px 0 ${color2}20`,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          inset: 0,
          background: "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, transparent 55%)",
          borderRadius: 18
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            width: "32",
            height: "32",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: color2,
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "9 12 11 14 15 10" })
            ]
          }
        )
      ]
    }
  );
}
function StepProgress({ current, total }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8, alignItems: "center", justifyContent: "center", marginBottom: 28 }, children: Array.from({ length: total }).map((_, i) => {
    const done = i < current;
    const active = i === current;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        animate: {
          width: active ? 24 : 8,
          background: done ? "var(--cryo-accent)" : active ? "var(--cryo-accent)" : "rgba(255,255,255,0.15)",
          opacity: done ? 0.7 : 1
        },
        transition: { type: "spring", stiffness: 440, damping: 28 },
        style: { height: 4, borderRadius: 99 }
      },
      i
    );
  }) });
}
const THEMES = [
  { id: "cyber", label: "Cyber", color: "#00d4ff", desc: "Cyan" },
  { id: "phantom", label: "Phantom", color: "#a855f7", desc: "Purple" },
  { id: "emerald", label: "Emerald", color: "#10b981", desc: "Green" },
  { id: "fire", label: "Fire", color: "#f97316", desc: "Orange" },
  { id: "slate", label: "Slate", color: "#94a3b8", desc: "Grey" }
];
const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  background: "rgba(0,0,0,0.35)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "rgba(255,255,255,0.88)",
  fontSize: 13,
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
  outline: "none",
  boxSizing: "border-box",
  caretColor: "var(--cryo-accent)",
  transition: "border-color 0.2s"
};
function PrimaryBtn({
  label,
  onClick,
  disabled,
  accentColor
}) {
  const [hov, setHov] = reactExports.useState(false);
  const color2 = accentColor ?? "var(--cryo-accent)";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      disabled,
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      style: {
        width: "100%",
        padding: "11px 0",
        borderRadius: 11,
        fontSize: 14,
        fontWeight: 700,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        border: "none",
        cursor: disabled ? "default" : "pointer",
        background: disabled ? "rgba(255,255,255,0.06)" : hov ? `linear-gradient(135deg, ${color2}ee, ${color2}bb)` : `linear-gradient(135deg, ${color2}, ${color2}aa)`,
        color: disabled ? "rgba(255,255,255,0.25)" : "#fff",
        boxShadow: disabled ? "none" : `0 0 20px ${color2}40`,
        transition: "all 0.18s"
      },
      children: label
    }
  );
}
function GhostBtn({ label, onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      style: {
        background: "none",
        border: "none",
        color: "rgba(255,255,255,0.35)",
        fontSize: 12,
        cursor: "pointer",
        fontFamily: "-apple-system, sans-serif",
        padding: "4px 0",
        textDecoration: "underline",
        textDecorationColor: "rgba(255,255,255,0.15)"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.color = "rgba(255,255,255,0.65)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.color = "rgba(255,255,255,0.35)";
      },
      children: label
    }
  );
}
function StepWelcome({
  selectedTheme,
  onSelectTheme,
  onNext
}) {
  const theme = THEMES.find((t2) => t2.id === selectedTheme) ?? THEMES[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HexShield, { color: theme.color }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontSize: 24,
        fontWeight: 700,
        color: "rgba(255,255,255,0.94)",
        letterSpacing: "-0.02em",
        marginBottom: 6,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
      }, children: "Welcome to CryoGram OS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        fontSize: 13,
        color: "rgba(255,255,255,0.4)",
        fontFamily: "-apple-system, sans-serif",
        lineHeight: 1.55,
        maxWidth: 340
      }, children: [
        "Security Operations Platform — let's get you set up.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "Choose your colour theme to start."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }, children: THEMES.map((t2) => {
      const active = t2.id === selectedTheme;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.button,
        {
          onClick: () => onSelectTheme(t2.id),
          whileTap: { scale: 0.92 },
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 7,
            padding: "12px 14px",
            borderRadius: 12,
            border: active ? `1.5px solid ${t2.color}` : "1.5px solid rgba(255,255,255,0.1)",
            background: active ? `${t2.color}15` : "rgba(255,255,255,0.03)",
            cursor: "pointer",
            transition: "all 0.15s",
            boxShadow: active ? `0 0 16px ${t2.color}30` : "none",
            minWidth: 72
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: t2.color,
              boxShadow: active ? `0 0 12px ${t2.color}80` : `0 0 6px ${t2.color}30`
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
              fontSize: 10,
              color: active ? t2.color : "rgba(255,255,255,0.45)",
              fontFamily: "-apple-system, sans-serif",
              fontWeight: active ? 600 : 400,
              transition: "color 0.15s"
            }, children: t2.label })
          ]
        },
        t2.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(PrimaryBtn, { label: "Next →", onClick: onNext, accentColor: theme.color }) })
  ] });
}
function StepPin({
  onNext,
  onSkip,
  accentColor
}) {
  const [digits, setDigits] = reactExports.useState(["", "", "", ""]);
  const [saving, setSaving] = reactExports.useState(false);
  const refs = [
    reactExports.useRef(null),
    reactExports.useRef(null),
    reactExports.useRef(null),
    reactExports.useRef(null)
  ];
  const pin = digits.join("");
  const handleChange = reactExports.useCallback((idx, val) => {
    const d = val.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = d;
      return next;
    });
    if (d && idx < 3) {
      refs[idx + 1].current?.focus();
    }
  }, []);
  const handleKeyDown = reactExports.useCallback((idx, e) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      refs[idx - 1].current?.focus();
    }
  }, [digits]);
  const handlePaste = reactExports.useCallback((e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (text.length === 4) {
      setDigits(text.split(""));
      refs[3].current?.focus();
    }
  }, []);
  const submit = async () => {
    if (pin.length < 4) return;
    setSaving(true);
    try {
      await window.cryogram.system.setPin?.(pin);
    } catch {
    }
    setSaving(false);
    onNext();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      width: 56,
      height: 56,
      borderRadius: 16,
      background: `${accentColor}14`,
      border: `1.5px solid ${accentColor}35`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: accentColor,
        strokeWidth: "1.8",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontSize: 20,
        fontWeight: 700,
        color: "rgba(255,255,255,0.92)",
        marginBottom: 5,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        letterSpacing: "-0.01em"
      }, children: "Set a Screen Lock PIN" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "-apple-system, sans-serif" }, children: "Used to lock your screen — 4 digits" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 12 }, onPaste: handlePaste, children: digits.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: refs[i],
        type: "text",
        inputMode: "numeric",
        pattern: "[0-9]*",
        maxLength: 1,
        value: d,
        autoFocus: i === 0,
        onChange: (e) => handleChange(i, e.target.value),
        onKeyDown: (e) => handleKeyDown(i, e),
        style: {
          width: 52,
          height: 60,
          borderRadius: 12,
          background: d ? `${accentColor}14` : "rgba(255,255,255,0.05)",
          border: `1.5px solid ${d ? accentColor + "70" : "rgba(255,255,255,0.12)"}`,
          color: d ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.3)",
          fontSize: 22,
          fontWeight: 700,
          textAlign: "center",
          outline: "none",
          fontFamily: '"JetBrains Mono", monospace',
          caretColor: accentColor,
          transition: "border-color 0.15s, background 0.15s"
        }
      },
      i
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100%", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PrimaryBtn,
        {
          label: saving ? "Saving…" : "Next →",
          onClick: submit,
          disabled: pin.length < 4 || saving,
          accentColor
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(GhostBtn, { label: "Skip for now", onClick: onSkip })
    ] })
  ] });
}
function StepApiKeys({
  onComplete,
  accentColor
}) {
  const [hibp, setHibp] = reactExports.useState("");
  const [shodan, setShodan] = reactExports.useState("");
  const [dehashedEmail, setDehashedEmail] = reactExports.useState("");
  const [dehashedKey, setDehashedKey] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const save = async () => {
    setSaving(true);
    try {
      await Promise.all([
        hibp && window.cryogram.settings.set("api.hibp", hibp),
        shodan && window.cryogram.settings.set("api.shodan", shodan),
        dehashedEmail && window.cryogram.settings.set("api.dehashed.email", dehashedEmail),
        dehashedKey && window.cryogram.settings.set("api.dehashed.key", dehashedKey)
      ]);
    } catch {
    }
    setSaving(false);
    onComplete();
  };
  const fieldStyle = {
    ...inputStyle,
    display: "block"
  };
  const labelStyle = {
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    marginBottom: 5,
    fontFamily: "-apple-system, sans-serif",
    fontWeight: 500,
    letterSpacing: "0.02em"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 20 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontSize: 20,
        fontWeight: 700,
        color: "rgba(255,255,255,0.92)",
        marginBottom: 5,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        letterSpacing: "-0.01em"
      }, children: "Connect Intelligence Feeds" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "-apple-system, sans-serif" }, children: "Optional — you can add these later in Settings" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: labelStyle, children: "Have I Been Pwned API Key" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "https://haveibeenpwned.com/API/Key",
            target: "_blank",
            rel: "noreferrer",
            style: { fontSize: 10, color: accentColor, textDecoration: "none", fontFamily: "-apple-system, sans-serif" },
            onMouseEnter: (e) => {
              e.currentTarget.style.textDecoration = "underline";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.textDecoration = "none";
            },
            children: "Get a key →"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "password",
          placeholder: "hibp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
          value: hibp,
          onChange: (e) => setHibp(e.target.value),
          style: fieldStyle,
          onFocus: (e) => {
            e.currentTarget.style.borderColor = `${accentColor}60`;
          },
          onBlur: (e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: labelStyle, children: "Shodan API Key" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "https://account.shodan.io/",
            target: "_blank",
            rel: "noreferrer",
            style: { fontSize: 10, color: accentColor, textDecoration: "none", fontFamily: "-apple-system, sans-serif" },
            onMouseEnter: (e) => {
              e.currentTarget.style.textDecoration = "underline";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.textDecoration = "none";
            },
            children: "Get a key →"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "password",
          placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
          value: shodan,
          onChange: (e) => setShodan(e.target.value),
          style: fieldStyle,
          onFocus: (e) => {
            e.currentTarget.style.borderColor = `${accentColor}60`;
          },
          onBlur: (e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: labelStyle, children: "Dehashed Credentials" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "https://dehashed.com/profile",
            target: "_blank",
            rel: "noreferrer",
            style: { fontSize: 10, color: accentColor, textDecoration: "none", fontFamily: "-apple-system, sans-serif" },
            onMouseEnter: (e) => {
              e.currentTarget.style.textDecoration = "underline";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.textDecoration = "none";
            },
            children: "Get a key →"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 7 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "email",
            placeholder: "your@email.com",
            value: dehashedEmail,
            onChange: (e) => setDehashedEmail(e.target.value),
            style: fieldStyle,
            onFocus: (e) => {
              e.currentTarget.style.borderColor = `${accentColor}60`;
            },
            onBlur: (e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            placeholder: "API key",
            value: dehashedKey,
            onChange: (e) => setDehashedKey(e.target.value),
            style: fieldStyle,
            onFocus: (e) => {
              e.currentTarget.style.borderColor = `${accentColor}60`;
            },
            onBlur: (e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            }
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 10, alignItems: "center", paddingTop: 4 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PrimaryBtn,
        {
          label: saving ? "Saving…" : "Save & Launch →",
          onClick: save,
          disabled: saving,
          accentColor
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(GhostBtn, { label: "Skip — set up later", onClick: onComplete })
    ] })
  ] });
}
function SetupWizard({ onComplete }) {
  const [step, setStep] = reactExports.useState(0);
  const [prevStep, setPrevStep] = reactExports.useState(0);
  const [selectedTheme, setTheme] = reactExports.useState("cyber");
  const TOTAL_STEPS = 4;
  const direction = step >= prevStep ? 1 : -1;
  const goTo = (next) => {
    setPrevStep(step);
    setStep(next);
  };
  const handleSelectTheme = async (id2) => {
    setTheme(id2);
    try {
      await window.cryogram.settings.set("theme.preset", id2);
    } catch {
    }
  };
  const accentColor = THEMES.find((t2) => t2.id === selectedTheme)?.color ?? "#00d4ff";
  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0, scale: 0.97 })
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.4 },
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 200001,
        background: "rgba(4,7,14,0.98)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(HexGrid, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 55% 45% at 50% 50%, ${accentColor}08, transparent 70%)`,
          pointerEvents: "none",
          transition: "background 0.6s"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 520,
          padding: "0 20px"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 24, scale: 0.97 },
              animate: { opacity: 1, y: 0, scale: 1 },
              transition: { type: "spring", stiffness: 380, damping: 28, delay: 0.1 },
              style: {
                background: "rgba(10,14,22,0.97)",
                backdropFilter: "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
                border: `1px solid rgba(255,255,255,0.09)`,
                borderRadius: 20,
                padding: "28px 32px 30px",
                boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${accentColor}10`,
                position: "relative",
                overflow: "hidden"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${accentColor}80 40%, ${accentColor}80 60%, transparent)`,
                  borderRadius: "20px 20px 0 0",
                  transition: "background 0.6s"
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  fontSize: 10,
                  color: "rgba(255,255,255,0.22)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: '"JetBrains Mono", monospace',
                  textAlign: "center",
                  marginBottom: 12
                }, children: [
                  "Step ",
                  step + 1,
                  " of ",
                  TOTAL_STEPS
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StepProgress, { current: step, total: TOTAL_STEPS }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "relative", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", custom: direction, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    custom: direction,
                    variants,
                    initial: "enter",
                    animate: "center",
                    exit: "exit",
                    transition: { type: "spring", stiffness: 380, damping: 30, mass: 0.8 },
                    children: [
                      step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        StepWelcome,
                        {
                          selectedTheme,
                          onSelectTheme: handleSelectTheme,
                          onNext: () => goTo(1)
                        }
                      ),
                      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        StepPin,
                        {
                          accentColor,
                          onNext: () => goTo(2),
                          onSkip: () => goTo(2)
                        }
                      ),
                      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        StepApiKeys,
                        {
                          accentColor,
                          onComplete: () => goTo(3)
                        }
                      ),
                      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, textAlign: "center" }, children: "Quick Tour" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          TutorialSlides,
                          {
                            onDone: onComplete,
                            doneLabel: "Start using CryoGram OS →"
                          }
                        )
                      ] })
                    ]
                  },
                  step
                ) }) })
              ]
            }
          ),
          step < 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.6 },
              style: { textAlign: "center", marginTop: 14 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(GhostBtn, { label: "Skip setup — go straight to OS", onClick: onComplete })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          bottom: 24,
          fontSize: 9,
          letterSpacing: "0.3em",
          fontWeight: 700,
          color: "rgba(255,255,255,0.1)",
          fontFamily: '"JetBrains Mono", monospace',
          textTransform: "uppercase",
          pointerEvents: "none"
        }, children: "CRYOGRAM OS" })
      ]
    }
  );
}
let _nextId = 1;
let _items = [];
const _listeners = /* @__PURE__ */ new Set();
let _lastText = "";
function _notify() {
  _listeners.forEach((fn) => fn());
}
const PINNED_KEY = "cryogram:clipboard:pinned";
function _loadPinned() {
  try {
    const raw = localStorage.getItem(PINNED_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
  }
  return /* @__PURE__ */ new Set();
}
function _savePinned(ids) {
  try {
    localStorage.setItem(PINNED_KEY, JSON.stringify(ids));
  } catch {
  }
}
function addToClipboardHistory(text) {
  if (!text.trim()) return;
  if (_items.length > 0 && _items[0].text === text) return;
  _lastText = text;
  _loadPinned();
  const entry = { id: _nextId++, text, timestamp: Date.now(), pinned: false };
  _items = [entry, ..._items].slice(0, 50);
  _notify();
}
function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1e3);
  if (diff < 10) return "just now";
  if (diff < 60) return `${diff}s ago`;
  const m2 = Math.floor(diff / 60);
  if (m2 < 60) return `${m2}m ago`;
  const h = Math.floor(m2 / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function ClipItem({
  entry,
  onCopy,
  onDelete,
  onTogglePin,
  ticker
}) {
  const [hov, setHov] = reactExports.useState(false);
  const [copied, setCopied] = reactExports.useState(false);
  const handleCopy = () => {
    onCopy(entry.id, entry.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20, height: 0, marginBottom: 0 },
      transition: { type: "spring", stiffness: 360, damping: 28 },
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      onClick: handleCopy,
      style: {
        padding: "9px 10px",
        borderRadius: 10,
        background: hov ? "rgba(255,255,255,0.07)" : entry.pinned ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        border: entry.pinned ? "1px solid var(--cryo-a20)" : hov ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.05)",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.12s, border-color 0.12s"
      },
      children: [
        entry.pinned && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "absolute",
          top: 6,
          left: 8,
          fontSize: 8,
          color: "var(--cryo-accent)",
          lineHeight: 1
        }, children: "▲" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          fontSize: 11,
          color: "rgba(255,255,255,0.75)",
          lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          wordBreak: "break-all",
          paddingLeft: entry.pinned ? 14 : 0,
          paddingRight: 36,
          fontFamily: 'ui-monospace, "JetBrains Mono", monospace'
        }, children: entry.text }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", marginTop: 5, paddingLeft: entry.pinned ? 14 : 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, color: "rgba(255,255,255,0.25)" }, children: timeAgo(entry.timestamp) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: copied && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.span,
            {
              initial: { opacity: 0, scale: 0.85 },
              animate: { opacity: 1, scale: 1 },
              exit: { opacity: 0 },
              style: { fontSize: 9, color: "var(--cryo-accent)", marginLeft: 8 },
              children: "Copied!"
            },
            "copied"
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: hov && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.1 },
            style: {
              position: "absolute",
              top: 6,
              right: 6,
              display: "flex",
              gap: 3
            },
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ActionBtn,
                {
                  title: entry.pinned ? "Unpin" : "Pin",
                  onClick: () => onTogglePin(entry.id),
                  active: entry.pinned,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "10", height: "11", viewBox: "0 0 24 24", fill: entry.pinned ? "var(--cryo-accent)" : "none", stroke: entry.pinned ? "var(--cryo-accent)" : "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "10", r: "3" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ActionBtn, { title: "Remove", onClick: () => onDelete(entry.id), danger: true, children: "×" })
            ]
          }
        ) })
      ]
    }
  );
}
function ActionBtn({
  children,
  onClick,
  title,
  active,
  danger
}) {
  const col = danger ? "#f87171" : active ? "var(--cryo-accent)" : "rgba(255,255,255,0.5)";
  const base = danger ? "rgba(239,68,68,0.1)" : active ? "var(--cryo-a12)" : "rgba(255,255,255,0.06)";
  const hov = danger ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.12)";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      title,
      onClick,
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 20,
        height: 20,
        borderRadius: 6,
        border: "none",
        background: base,
        color: col,
        cursor: "pointer",
        fontSize: 12,
        lineHeight: 1,
        padding: 0
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.background = hov;
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = base;
      },
      children
    }
  );
}
function ClipboardManager({ open, onClose }) {
  const [items, setItems] = reactExports.useState([..._items]);
  const [query, setQuery] = reactExports.useState("");
  const [ticker, setTicker] = reactExports.useState(0);
  const searchRef = reactExports.useRef(null);
  const pollRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const sync = () => setItems([..._items]);
    _listeners.add(sync);
    return () => {
      _listeners.delete(sync);
    };
  }, []);
  reactExports.useEffect(() => {
    const id2 = setInterval(() => setTicker((t2) => t2 + 1), 3e4);
    return () => clearInterval(id2);
  }, []);
  reactExports.useEffect(() => {
    if (!open) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    const poll = async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text && text !== _lastText && text.trim()) {
          addToClipboardHistory(text);
        }
      } catch {
      }
    };
    poll();
    pollRef.current = setInterval(poll, 1500);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [open]);
  reactExports.useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 120);
    } else {
      setQuery("");
    }
  }, [open]);
  reactExports.useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  const handleCopy = reactExports.useCallback(async (_id, text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
    }
  }, []);
  const handleDelete = reactExports.useCallback((id2) => {
    _items = _items.filter((i) => i.id !== id2);
    _notify();
  }, []);
  const handleTogglePin = reactExports.useCallback((id2) => {
    _items = _items.map((i) => i.id === id2 ? { ...i, pinned: !i.pinned } : i);
    _savePinned(_items.filter((i) => i.pinned).map((i) => i.id));
    _notify();
  }, []);
  const handleClearAll = () => {
    _items = _items.filter((i) => i.pinned);
    _notify();
  };
  const filtered = items.filter((i) => !query || i.text.toLowerCase().includes(query.toLowerCase())).sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.timestamp - a.timestamp;
  });
  const pinned = filtered.filter((i) => i.pinned);
  const unpinned = filtered.filter((i) => !i.pinned);
  const total = items.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.18 },
        onClick: onClose,
        style: { position: "fixed", inset: 0, zIndex: 88e3 }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { x: 300, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 300, opacity: 0 },
        transition: { type: "spring", stiffness: 340, damping: 32, mass: 0.9 },
        onClick: (e) => e.stopPropagation(),
        style: {
          position: "fixed",
          top: 36,
          right: 0,
          bottom: 0,
          width: 300,
          zIndex: 89e3,
          background: "rgba(10,14,22,0.97)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          overflow: "hidden"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 14px 10px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            flexShrink: 0
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.88)" }, children: "Clipboard" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 1 }, children: total === 0 ? "Empty" : `${total} item${total !== 1 ? "s" : ""}` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6 }, children: [
              total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleClearAll,
                  style: {
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: 7,
                    color: "#f87171",
                    fontSize: 11,
                    fontWeight: 500,
                    padding: "4px 10px",
                    cursor: "pointer",
                    fontFamily: "inherit"
                  },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.background = "rgba(239,68,68,0.18)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                  },
                  children: "Clear All"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: onClose,
                  style: {
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 7,
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 14,
                    lineHeight: 1,
                    padding: "3px 8px",
                    cursor: "pointer"
                  },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  },
                  children: "✕"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              position: "absolute",
              left: 9,
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255,255,255,0.25)",
              lineHeight: 0,
              pointerEvents: "none"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "11", r: "8" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: searchRef,
                type: "text",
                placeholder: "Search clipboard…",
                value: query,
                onChange: (e) => setQuery(e.target.value),
                style: {
                  width: "100%",
                  padding: "7px 10px 7px 28px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 12,
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit"
                }
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            flex: 1,
            overflowY: "auto",
            padding: "10px 10px 16px",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.1) transparent"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0 },
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                paddingTop: 60
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "rgba(255,255,255,0.25)", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "2", width: "8", height: "4", rx: "1", ry: "1" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center" }, children: query ? "No matches" : "Nothing copied yet" })
              ]
            },
            "empty"
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
            pinned.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                fontSize: 9,
                fontWeight: 600,
                color: "rgba(255,255,255,0.22)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: '"JetBrains Mono", monospace',
                marginBottom: 4,
                marginTop: 2,
                paddingLeft: 2
              }, children: "Pinned" }),
              pinned.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                ClipItem,
                {
                  entry,
                  ticker,
                  onCopy: handleCopy,
                  onDelete: handleDelete,
                  onTogglePin: handleTogglePin
                },
                entry.id
              )),
              unpinned.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 1, background: "rgba(255,255,255,0.06)", margin: "6px 0" } })
            ] }),
            unpinned.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              pinned.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                fontSize: 9,
                fontWeight: 600,
                color: "rgba(255,255,255,0.22)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: '"JetBrains Mono", monospace',
                marginBottom: 4,
                paddingLeft: 2
              }, children: "Recent" }),
              unpinned.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                ClipItem,
                {
                  entry,
                  ticker,
                  onCopy: handleCopy,
                  onDelete: handleDelete,
                  onTogglePin: handleTogglePin
                },
                entry.id
              ))
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 1, flexShrink: 0, background: "linear-gradient(90deg, transparent, var(--cryo-a20) 40%, var(--cryo-a20) 60%, transparent)" } })
        ]
      }
    )
  ] }) });
}
function MissionControl({ open, onClose }) {
  const { windows, focusWindow, restoreWindow } = useWindowStore();
  reactExports.useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  const nonMinimized = windows;
  const cols = Math.ceil(Math.sqrt(Math.max(nonMinimized.length, 1)));
  const activate = (id2) => {
    restoreWindow(id2);
    focusWindow(id2);
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
      onClick: onClose,
      style: { position: "fixed", inset: 0, zIndex: 99980, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { y: -8, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            transition: { delay: 0.05 },
            style: { fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" },
            children: "Mission Control"
          }
        ),
        windows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, style: { fontSize: 14, color: "rgba(255,255,255,0.25)" }, children: "No open windows" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: (e) => e.stopPropagation(),
            style: { display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16, padding: "0 40px", maxWidth: "90vw" },
            children: nonMinimized.map((win, i) => {
              const meta = APP_META[win.appId];
              const color2 = meta?.color ?? "#00d4ff";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { scale: 0.85, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  transition: { delay: i * 0.04 },
                  onClick: () => activate(win.id),
                  style: { cursor: "pointer", background: "rgba(12,16,26,0.85)", border: `1px solid ${win.focused ? color2 : "rgba(255,255,255,0.1)"}`, borderRadius: 12, overflow: "hidden", width: 200, boxShadow: win.focused ? `0 0 20px ${color2}33` : "none", transition: "border-color 0.15s, box-shadow 0.15s" },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.borderColor = color2;
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.borderColor = win.focused ? color2 : "rgba(255,255,255,0.1)";
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "8px 12px", background: `${color2}18`, borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 8 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 8, height: 8, borderRadius: "50%", background: color2, flexShrink: 0 } }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.75)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: win.title })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { height: 110, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 28, color: color2, opacity: 0.7 }, children: meta?.icon }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.3)" }, children: win.minimized ? "Minimized" : `${win.width}×${win.height}` })
                    ] })
                  ]
                },
                win.id
              );
            })
          }
        )
      ]
    },
    "mission-control"
  ) });
}
const SECTIONS = [
  {
    title: "System",
    shortcuts: [
      { keys: ["Ctrl", "Space"], desc: "Spotlight search" },
      { keys: ["Ctrl", "Shift", "V"], desc: "Clipboard history" },
      { keys: ["Super", "L"], desc: "Lock screen" },
      { keys: ["Super", "D"], desc: "Show / hide desktop" },
      { keys: ["Super", "M"], desc: "Mission Control" },
      { keys: ["Ctrl", "/"], desc: "Keyboard shortcuts" }
    ]
  },
  {
    title: "Windows",
    shortcuts: [
      { keys: ["Alt", "Tab"], desc: "Switch app (forward)" },
      { keys: ["Alt", "Shift", "Tab"], desc: "Switch app (backward)" },
      { keys: ["Ctrl", "Alt", "T"], desc: "Open Terminal" },
      { keys: ["Super", "1–4"], desc: "Switch workspace" }
    ]
  },
  {
    title: "Window Snapping",
    shortcuts: [
      { keys: ["Drag → left edge"], desc: "Snap left half" },
      { keys: ["Drag → right edge"], desc: "Snap right half" },
      { keys: ["Drag → top edge"], desc: "Maximize" }
    ]
  },
  {
    title: "Apps",
    shortcuts: [
      { keys: ["Ctrl", "S"], desc: "Save (Markdown Editor)" },
      { keys: ["Ctrl", "⌘", "↵"], desc: "Run query (SQLite)" },
      { keys: ["Ctrl", "W"], desc: "Close focused window" }
    ]
  }
];
function KeyboardShortcutsOverlay({ open, onClose }) {
  reactExports.useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
      onClick: onClose,
      style: { position: "fixed", inset: 0, zIndex: 99990, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { scale: 0.94, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.94, opacity: 0 },
          transition: { duration: 0.18 },
          onClick: (e) => e.stopPropagation(),
          style: { background: "rgba(12,16,26,0.96)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "28px 32px", width: 640, maxHeight: "80vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.9)" }, children: "Keyboard Shortcuts" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, style: { background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6, color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "4px 10px", fontSize: 12 }, children: "Esc" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }, children: SECTIONS.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: "var(--cryo-accent)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }, children: section.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: section.shortcuts.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: "rgba(255,255,255,0.55)" }, children: s.desc }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 4, flexShrink: 0 }, children: s.keys.map((k2, ki2) => /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { style: { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 4, padding: "2px 6px", fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap" }, children: k2 }, ki2)) })
              ] }, i)) })
            ] }, section.title)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.07)", fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center" }, children: [
              "Press ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { style: { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 3, padding: "1px 5px", fontSize: 10 }, children: "Ctrl" }),
              " + ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { style: { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 3, padding: "1px 5px", fontSize: 10 }, children: "/" }),
              " to toggle this panel"
            ] })
          ]
        }
      )
    },
    "kb-overlay"
  ) });
}
function App() {
  const [booted, setBooted] = reactExports.useState(false);
  const wallpaper = useDesktopStore((s) => s.wallpaper);
  const { isLocked, lock } = useLockStore();
  const openApp = useWindowStore((s) => s.openApp);
  const [updateInfo, setUpdateInfo] = reactExports.useState(null);
  const [showUpdateScreen, setShowScreen] = reactExports.useState(false);
  const [spotlightOpen, setSpotlightOpen] = reactExports.useState(false);
  const [notifHistoryOpen, setNotifHistoryOpen] = reactExports.useState(false);
  const [clipboardOpen, setClipboardOpen] = reactExports.useState(false);
  const [missionControlOpen, setMissionControlOpen] = reactExports.useState(false);
  const [kbShortcutsOpen, setKbShortcutsOpen] = reactExports.useState(false);
  const [setupDone, setSetupDone] = reactExports.useState(true);
  const handleBooted = reactExports.useCallback(async () => {
    try {
      const enabled = await window.cryogram.settings.get("pin.enabled");
      const hash = await window.cryogram.settings.get("pin.hash");
      if (enabled && hash) lock(true);
      else if (enabled) lock(false);
    } catch {
    }
    try {
      const done = await window.cryogram.settings.get("setup.done");
      if (!done) setSetupDone(false);
    } catch {
    }
    setBooted(true);
  }, [lock]);
  reactExports.useEffect(() => {
    if (!booted) return;
    const t2 = setTimeout(async () => {
      try {
        const api = window.cryogram?.updater;
        if (!api) return;
        const result = await api.check();
        if (result?.hasUpdate) {
          setUpdateInfo({ commitCount: result.commitCount, changes: result.changes ?? [] });
        }
      } catch {
      }
    }, 8e3);
    return () => clearTimeout(t2);
  }, [booted]);
  reactExports.useEffect(() => {
    window.__cryogram_checkUpdate = async () => {
      try {
        const api = window.cryogram?.updater;
        if (!api) return;
        const result = await api.check();
        if (result?.hasUpdate) {
          setUpdateInfo({ commitCount: result.commitCount, changes: result.changes ?? [] });
        } else {
          setUpdateInfo(null);
        }
        return result;
      } catch {
        return { hasUpdate: false };
      }
    };
    window.__cryogram_startUpdate = () => {
      setUpdateInfo(null);
      setShowScreen(true);
    };
    return () => {
      delete window.__cryogram_checkUpdate;
      delete window.__cryogram_startUpdate;
    };
  }, []);
  reactExports.useEffect(() => {
    const cleanup = window.cryogram.onNotification((n2) => {
      const event = new CustomEvent("cryogram:notification", { detail: n2 });
      window.dispatchEvent(event);
    });
    return cleanup;
  }, []);
  reactExports.useEffect(() => {
    const cleanup = window.cryogram.onLock?.(async () => {
      if (!booted) return;
      try {
        const enabled = await window.cryogram.settings.get("pin.enabled");
        const hash = await window.cryogram.settings.get("pin.hash");
        lock(!!(enabled && hash));
      } catch {
        lock(false);
      }
    });
    return cleanup ?? void 0;
  }, [booted, lock]);
  reactExports.useEffect(() => {
    const cleanup = window.cryogram.onOpenApp?.((appId) => {
      openApp(appId);
    });
    return cleanup ?? void 0;
  }, [openApp]);
  reactExports.useEffect(() => {
    const cleanup = window.cryogram.onSpotlight?.(() => {
      setSpotlightOpen((o) => !o);
    });
    return cleanup ?? void 0;
  }, []);
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (e.altKey && e.key === "Tab") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("cryogram:switcher", { detail: e.shiftKey ? "prev" : "next" }));
      }
      if (e.ctrlKey && e.code === "Space") {
        e.preventDefault();
        setSpotlightOpen((o) => !o);
      }
      if (e.ctrlKey && e.shiftKey && e.code === "KeyV") {
        const inTerminal = !!e.target?.closest(".xterm-helper-textarea, .xterm-screen, .xterm-viewport");
        if (!inTerminal) {
          e.preventDefault();
          setClipboardOpen((o) => !o);
        }
      }
      if (e.metaKey && e.code === "KeyM") {
        e.preventDefault();
        setMissionControlOpen((o) => !o);
      }
      if (e.ctrlKey && e.code === "Slash") {
        e.preventDefault();
        setKbShortcutsOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  reactExports.useEffect(() => {
    window.__cryogram_toggleNotifHistory = () => setNotifHistoryOpen((o) => !o);
    return () => {
      delete window.__cryogram_toggleNotifHistory;
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: !booted && /* @__PURE__ */ jsxRuntimeExports.jsx(BootSplash, { onDone: handleBooted }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: booted && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "flex flex-col h-screen w-screen overflow-hidden",
        style: { background: "var(--cryo-bg, #070b11)" },
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5 },
        children: [
          !wallpaper && /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedBackground, {}),
          wallpaper && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: wallpaper.startsWith("file://") ? wallpaper : `file://${wallpaper}`,
              alt: "",
              className: "absolute inset-0 w-full h-full pointer-events-none",
              style: { objectFit: "cover", objectPosition: "center" },
              draggable: false
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 pointer-events-none",
              style: {
                background: "radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(0,0,0,0.45) 100%)",
                zIndex: 1
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TitleBar, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Desktop, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(WindowManager, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dock, {})
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationToast, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SystemHUD, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DesktopWidgets, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AppSwitcherOverlay, {})
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: booted && isLocked && /* @__PURE__ */ jsxRuntimeExports.jsx(LockScreen, {}, "lock") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: booted && updateInfo && !showUpdateScreen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      UpdateNotification,
      {
        info: updateInfo,
        onUpdate: () => {
          setUpdateInfo(null);
          setShowScreen(true);
        },
        onDismiss: () => setUpdateInfo(null)
      },
      "update-notif"
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showUpdateScreen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      UpdateScreen,
      {
        onCancel: () => setShowScreen(false)
      },
      "update-screen"
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SpotlightSearch, { open: spotlightOpen, onClose: () => setSpotlightOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationHistory, { open: notifHistoryOpen, onClose: () => setNotifHistoryOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardManager, { open: clipboardOpen, onClose: () => setClipboardOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MissionControl, { open: missionControlOpen, onClose: () => setMissionControlOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(KeyboardShortcutsOverlay, { open: kbShortcutsOpen, onClose: () => setKbShortcutsOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: booted && !setupDone && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SetupWizard,
      {
        onComplete: async () => {
          await window.cryogram.settings.set("setup.done", true);
          setSetupDone(true);
        }
      },
      "setup"
    ) })
  ] }) });
}
const sleep = (ms) => new Promise((r2) => setTimeout(r2, ms));
const settingsStore = (() => {
  try {
    return JSON.parse(localStorage.getItem("cryogram-mock-settings") || "{}");
  } catch {
    return {};
  }
})();
function saveMockSettings() {
  localStorage.setItem("cryogram-mock-settings", JSON.stringify(settingsStore));
}
const mockFs = {
  "/workspace/hello.py": 'print("Hello from Cryogram!")\n',
  "/workspace/scan.js": 'const target = "192.168.1.1";\nconsole.log(`Scanning ${target}...`);\n',
  "/workspace/crack.sh": "#!/bin/bash\n# Example hash crack script\nhashcat -m 0 hash.txt wordlist.txt\n"
};
const mockTargets = [
  { id: 1, type: "email", value: "alice@example.com", label: "alice@example.com", added_at: "2024-01-10T10:00:00", last_checked: "2024-03-14T08:00:00" },
  { id: 2, type: "domain", value: "example.com", label: "example.com", added_at: "2024-01-10T10:00:00", last_checked: "2024-03-14T08:00:00" }
];
const mockBreaches = [
  {
    id: 1,
    target_id: 1,
    source: "hibp",
    breach_name: "Adobe",
    breach_date: "2013-10-04",
    data_classes: '["Email addresses","Password hints","Passwords","Usernames"]',
    description: "In October 2013, 153 million Adobe accounts were breached.",
    raw: "{}",
    discovered_at: new Date(Date.now() - 2 * 36e5).toISOString()
  },
  {
    id: 2,
    target_id: 1,
    source: "hibp",
    breach_name: "LinkedIn",
    breach_date: "2012-05-05",
    data_classes: '["Email addresses","Passwords"]',
    description: "In May 2012, LinkedIn suffered a data breach exposing 164 million accounts.",
    raw: "{}",
    discovered_at: new Date(Date.now() - 26 * 36e5).toISOString()
  },
  {
    id: 3,
    target_id: 2,
    source: "dehashed",
    breach_name: "Collection #1",
    breach_date: "2019-01-07",
    data_classes: '["Email addresses","Passwords"]',
    description: null,
    raw: "{}",
    discovered_at: new Date(Date.now() - 48 * 36e5).toISOString()
  }
];
let nextTargetId = 3;
let targetList = [...mockTargets];
let breachList = [...mockBreaches];
const termCallbacks = {};
function mockTerminalInit(id2, cb2) {
  termCallbacks[id2] = cb2;
  setTimeout(() => cb2("\x1B[32mCryogram Mock Terminal\x1B[0m — running in browser mode\r\n"), 100);
  setTimeout(() => cb2("\x1B[33mNote:\x1B[0m Real PTY not available in browser. Run \x1B[36mnpm run dev\x1B[0m for a live shell.\r\n\r\n"), 300);
  setTimeout(() => cb2("\x1B[34m$\x1B[0m "), 500);
}
function mockTerminalInput(id2, data) {
  const cb2 = termCallbacks[id2];
  if (!cb2) return;
  if (data === "\r") {
    cb2("\r\n\x1B[33m[mock]\x1B[0m Command execution not available in browser mode.\r\n\x1B[34m$\x1B[0m ");
  } else if (data === "") {
    cb2("\b \b");
  } else {
    cb2(data);
  }
}
function installMockCryogram() {
  if (window.cryogram) return;
  console.info("[Cryogram] Running in browser mock mode");
  window.cryogram = {
    window: {
      minimize: () => {
      },
      maximize: () => {
      },
      close: () => {
      }
    },
    terminal: {
      create: async (id2, _cols, _rows) => {
        mockTerminalInit(id2, () => {
        });
        return { pid: 9999 };
      },
      write: (id2, data) => mockTerminalInput(id2, data),
      resize: () => {
      },
      destroy: (id2) => {
        delete termCallbacks[id2];
      },
      onData: (id2, cb2) => {
        termCallbacks[id2] = cb2;
        mockTerminalInit(id2, cb2);
        return () => {
          delete termCallbacks[id2];
        };
      }
    },
    fs: {
      readDir: async (path) => {
        const prefix = path === "__workspace__" ? "/workspace/" : path + "/";
        const entries = Object.keys(mockFs).filter((p2) => p2.startsWith(prefix) && !p2.slice(prefix.length).includes("/")).map((p2) => ({
          path: p2,
          name: p2.split("/").pop(),
          isDir: false,
          ext: p2.split(".").pop() || ""
        }));
        return entries;
      },
      readFile: async (path) => mockFs[path] ?? `# File not found: ${path}`,
      writeFile: async (path, content) => {
        mockFs[path] = content;
        return true;
      },
      getWorkspace: async () => "/workspace",
      openDialog: async () => {
        alert("Directory picker not available in browser mode.");
        return null;
      }
    },
    passwordTester: {
      runCrack: async (opts) => {
        const jobId = `crack_${Date.now()}`;
        let attempts = 0;
        const start = Date.now();
        for (let i = 0; i < 5; i++) {
          await sleep(400);
          attempts += 1200;
          const event = new CustomEvent("cryogram:pt-progress", {
            detail: { jobId, attempts, rate: 3e3, elapsed: (Date.now() - start) / 1e3, currentWord: "password" + i }
          });
          window.dispatchEvent(event);
        }
        const elapsed = (Date.now() - start) / 1e3;
        return { jobId, found: true, password: "hunter2", attempts: attempts + 42, elapsed };
      },
      runNetwork: async (opts) => {
        const jobId = `net_${Date.now()}`;
        await sleep(1500);
        return { jobId, found: false, credentials: [], attempts: 150, elapsed: 1.5 };
      },
      cancel: (_jobId) => {
      },
      onProgress: (cb2) => {
        const handler = (e) => cb2(e.detail);
        window.addEventListener("cryogram:pt-progress", handler);
        return () => window.removeEventListener("cryogram:pt-progress", handler);
      }
    },
    leaker: {
      addTarget: async (target) => {
        const entry = {
          id: ++nextTargetId,
          type: target.type,
          value: target.value,
          label: target.label || target.value,
          added_at: (/* @__PURE__ */ new Date()).toISOString(),
          last_checked: null
        };
        targetList = [...targetList, entry];
        return entry;
      },
      removeTarget: async (id2) => {
        targetList = targetList.filter((t2) => t2.id !== id2);
        breachList = breachList.filter((b) => b.target_id !== id2);
        return true;
      },
      getTargets: async () => [...targetList],
      getBreaches: async (targetId) => targetId !== void 0 ? breachList.filter((b) => b.target_id === targetId) : [...breachList],
      forceRefresh: async () => {
        await sleep(1200);
        return { checked: targetList.length, newBreaches: 0 };
      }
    },
    settings: {
      get: async (key) => settingsStore[key] ?? null,
      set: async (key, value) => {
        settingsStore[key] = value;
        saveMockSettings();
      },
      getAll: async () => ({ ...settingsStore })
    },
    files: {
      getHome: async () => "/home/user",
      getDrives: async () => [
        { path: "/", name: "Root (/)", mounted: true },
        { path: "/media/usb0", name: "USB Drive", mounted: true }
      ],
      readDir: async (path) => {
        const mockDirs = {
          "/home/user": [
            { name: "Desktop", path: "/home/user/Desktop", isDir: true, ext: "", size: 0, modified: (/* @__PURE__ */ new Date()).toISOString() },
            { name: "Documents", path: "/home/user/Documents", isDir: true, ext: "", size: 0, modified: (/* @__PURE__ */ new Date()).toISOString() },
            { name: "Downloads", path: "/home/user/Downloads", isDir: true, ext: "", size: 0, modified: (/* @__PURE__ */ new Date()).toISOString() },
            { name: "Pictures", path: "/home/user/Pictures", isDir: true, ext: "", size: 0, modified: (/* @__PURE__ */ new Date()).toISOString() },
            { name: "notes.md", path: "/home/user/notes.md", isDir: false, ext: "md", size: 1420, modified: (/* @__PURE__ */ new Date()).toISOString() },
            { name: "scan.py", path: "/home/user/scan.py", isDir: false, ext: "py", size: 890, modified: (/* @__PURE__ */ new Date()).toISOString() }
          ],
          "/home/user/Documents": [
            { name: "pentest-report.pdf", path: "/home/user/Documents/pentest-report.pdf", isDir: false, ext: "pdf", size: 245e3, modified: (/* @__PURE__ */ new Date()).toISOString() },
            { name: "notes.txt", path: "/home/user/Documents/notes.txt", isDir: false, ext: "txt", size: 1200, modified: (/* @__PURE__ */ new Date()).toISOString() }
          ],
          "/home/user/Downloads": [
            { name: "rockyou.txt", path: "/home/user/Downloads/rockyou.txt", isDir: false, ext: "txt", size: 134e6, modified: (/* @__PURE__ */ new Date()).toISOString() },
            { name: "nmap.tar.gz", path: "/home/user/Downloads/nmap.tar.gz", isDir: false, ext: "gz", size: 58e5, modified: (/* @__PURE__ */ new Date()).toISOString() }
          ]
        };
        await sleep(80);
        return mockDirs[path] ?? [];
      },
      stat: async (path) => ({ size: 0, modified: (/* @__PURE__ */ new Date()).toISOString(), isDir: false }),
      readFile: async (path) => `# Mock file: ${path}
`,
      writeFile: async () => true,
      copy: async () => true,
      move: async () => true,
      delete: async () => true,
      mkdir: async () => true,
      rename: async (path, newName) => path.split("/").slice(0, -1).join("/") + "/" + newName,
      openExternal: async () => true,
      openDialog: async () => null
    },
    system: {
      getNetworks: async () => [
        { ssid: "CyberNet-5G", signal: 90, security: "WPA2", active: true },
        { ssid: "Home-WiFi", signal: 68, security: "WPA2", active: false },
        { ssid: "Guest", signal: 42, security: "", active: false },
        { ssid: "Neighbor_2.4", signal: 22, security: "WPA", active: false }
      ],
      getWifiStatus: async () => ({ connected: true, ssid: "CyberNet-5G", signal: 90 }),
      connectNetwork: async () => true,
      disconnectNetwork: async () => true,
      rescanNetworks: async () => true,
      getBattery: async () => ({ level: 72, charging: false, full: false, status: "Discharging" }),
      getVolume: async () => ({ level: 65, muted: false }),
      setVolume: async () => true,
      toggleMute: async () => true,
      getBrightness: async () => 80,
      setBrightness: async () => true,
      getBluetoothDevices: async () => [
        { address: "AA:BB:CC:DD:EE:FF", name: "Sony WH-1000XM5", connected: true },
        { address: "11:22:33:44:55:66", name: "Logitech MX Keys", connected: false }
      ],
      bluetoothConnect: async () => true,
      bluetoothDisconnect: async () => true,
      bluetoothScan: async () => {
        await sleep(1e3);
        return true;
      },
      getInfo: async () => ({
        hostname: "cryogram",
        os: "Cryogram Linux 1.0 (Debian-based)",
        kernel: "6.1.0-cryogram-amd64",
        cpu: "Intel Core i7-12700H @ 2.30GHz",
        ramTotal: 16 * 1024 * 1024 * 1024,
        ramUsed: 4.2 * 1024 * 1024 * 1024,
        uptime: "3h 42m"
      }),
      syncTime: async () => ({ success: true }),
      pickWallpaper: async () => null,
      setWallpaper: async () => true,
      verifyPin: async () => true,
      setPin: async () => ({ success: true }),
      removePin: async () => ({ success: true }),
      setPinEnabled: async () => true,
      shutdown: async () => {
        alert("[mock] Shutdown called");
      },
      reboot: async () => {
        alert("[mock] Reboot called");
      },
      sleep: async () => {
        alert("[mock] Sleep called");
      },
      lock: async () => {
        alert("[mock] Lock screen called");
      }
    },
    launcher: {
      getApps: async () => [
        { name: "Firefox", exec: "firefox", icon: "", comment: "Web Browser", categories: ["Internet"], category: "Internet", desktopFile: "firefox.desktop", terminal: false },
        { name: "VS Code", exec: "code", icon: "", comment: "Code Editor", categories: ["Development"], category: "Development", desktopFile: "code.desktop", terminal: false },
        { name: "Nmap", exec: "nmap", icon: "", comment: "Network Scanner", categories: ["Security"], category: "Security", desktopFile: "nmap.desktop", terminal: true },
        { name: "Wireshark", exec: "wireshark", icon: "", comment: "Packet Analyzer", categories: ["Security"], category: "Security", desktopFile: "wireshark.desktop", terminal: false },
        { name: "Metasploit", exec: "msfconsole", icon: "", comment: "Penetration Testing", categories: ["Security"], category: "Security", desktopFile: "msf.desktop", terminal: true },
        { name: "Steam", exec: "steam", icon: "", comment: "Gaming Platform", categories: ["Gaming"], category: "Gaming", desktopFile: "steam.desktop", terminal: false },
        { name: "Opera GX", exec: "opera", icon: "", comment: "Gaming Browser", categories: ["Internet"], category: "Internet", desktopFile: "opera.desktop", terminal: false },
        { name: "Files", exec: "thunar", icon: "", comment: "File Manager", categories: ["System"], category: "System", desktopFile: "thunar.desktop", terminal: false },
        { name: "VLC", exec: "vlc", icon: "", comment: "Media Player", categories: ["Multimedia"], category: "Multimedia", desktopFile: "vlc.desktop", terminal: false },
        { name: "GIMP", exec: "gimp", icon: "", comment: "Image Editor", categories: ["Graphics"], category: "Graphics", desktopFile: "gimp.desktop", terminal: false },
        { name: "Burp Suite", exec: "burpsuite", icon: "", comment: "Web Security Testing", categories: ["Security"], category: "Security", desktopFile: "burpsuite.desktop", terminal: false },
        { name: "Hashcat", exec: "hashcat", icon: "", comment: "Password Recovery", categories: ["Security"], category: "Security", desktopFile: "hashcat.desktop", terminal: true }
      ],
      launch: async (app) => {
        alert(`[mock] Launching: ${app.name}`);
        return true;
      }
    },
    wm: {
      getWindows: async () => [],
      focusWindow: async () => true,
      closeWindow: async () => true,
      hideShell: async () => true,
      getCurrentWorkspace: async () => 0,
      switchWorkspace: async () => true,
      getWorkspaceCount: async () => 4
    },
    passwords: {
      getAll: async () => [],
      add: async (e) => ({ ...e, id: "mock", createdAt: "", updatedAt: "" }),
      update: async () => true,
      delete: async () => true,
      generate: async () => "MockPass123!"
    },
    ssh: {
      listKeys: async () => [],
      generateKey: async () => ({ success: false }),
      deleteKey: async () => false,
      getPublicKey: async () => "",
      listHosts: async () => [],
      saveConfig: async () => true
    },
    firewall: {
      status: async () => ({ active: false, defaultIn: "deny", defaultOut: "allow", rules: [] }),
      enable: async () => ({ success: false }),
      disable: async () => ({ success: false }),
      addRule: async () => ({ success: false }),
      deleteRule: async () => ({ success: false }),
      reset: async () => ({ success: false })
    },
    processes: {
      list: async () => [],
      kill: async () => ({ success: false }),
      getSystemStats: async () => ({ cpuPct: 0, memTotal: 0, memUsed: 0, memPct: 0 })
    },
    logs: {
      getUnits: async () => ["all"],
      query: async () => ({ lines: [] }),
      stream: async () => {
      },
      stopStream: async () => {
      },
      onLine: (cb2) => {
        return () => {
        };
      }
    },
    netmon: {
      getInterfaces: async () => [],
      getConnections: async () => [],
      startStream: async () => {
      },
      stopStream: async () => {
      },
      onStats: (cb2) => {
        return () => {
        };
      }
    },
    screenshot: {
      capture: async () => ({ dataUrl: "", width: 0, height: 0 }),
      save: async () => ({ path: "" }),
      copyToClipboard: async () => false
    },
    phone: {
      getDevices: async () => [],
      getInfo: async () => ({ model: "Mock Phone", android: "14", serial: "mock" }),
      getBattery: async () => ({ level: 80, status: "charging" }),
      getStorage: async () => ({ total: 128, used: 40, free: 88 }),
      checkScrcpy: async () => false,
      installScrcpy: async () => false,
      startMirror: async () => false,
      stopMirror: async () => false,
      isMirroring: async () => false,
      enableWireless: async () => "",
      connectWifi: async () => false,
      disconnect: async () => false,
      getDeviceIp: async () => "",
      screenshot: async () => ""
    },
    scanner: {
      check: async () => ({ available: false }),
      run: async () => {
      },
      cancel: () => {
      },
      onProgress: (cb2) => {
        return () => {
        };
      }
    },
    vpn: {
      getStatus: async () => ({ connected: false }),
      connect: async () => ({ success: false, error: "[mock] VPN not available" }),
      disconnect: async () => ({ success: false })
    },
    updater: {
      check: async () => ({ hasUpdate: false }),
      run: async () => ({ success: false }),
      onProgress: (cb2) => {
        return () => {
        };
      }
    },
    cert: {
      inspect: async () => ({
        subject: { CN: "example.com", O: "Example Org", C: "US" },
        issuer: { CN: "Let's Encrypt R3", O: "Let's Encrypt" },
        validFrom: new Date(Date.now() - 30 * 864e5).toISOString(),
        validTo: new Date(Date.now() + 60 * 864e5).toISOString(),
        daysRemaining: 60,
        sans: ["example.com", "www.example.com"],
        publicKey: { algorithm: "RSA", bits: 2048 },
        fingerprints: { sha256: "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99" },
        serialNumber: "0123456789ABCDEF",
        signatureAlgorithm: "sha256WithRSAEncryption",
        isCA: false
      }),
      parsePem: async () => ({
        subject: { CN: "Parsed Cert" },
        issuer: { CN: "Root CA" },
        validFrom: (/* @__PURE__ */ new Date()).toISOString(),
        validTo: new Date(Date.now() + 365 * 864e5).toISOString(),
        daysRemaining: 365,
        sans: [],
        publicKey: { algorithm: "EC", curve: "P-256" },
        fingerprints: { sha256: "00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF" },
        serialNumber: "FEDCBA9876543210",
        signatureAlgorithm: "ecdsa-with-SHA256",
        isCA: false
      })
    },
    docker: {
      listContainers: async () => [
        { ID: "abc123", Names: "/mock-nginx", Image: "nginx:latest", Status: "Up 2 hours", State: "running", Ports: "0.0.0.0:80->80/tcp", Created: "" },
        { ID: "def456", Names: "/mock-postgres", Image: "postgres:15", Status: "Exited (0) 1 hour ago", State: "exited", Ports: "", Created: "" }
      ],
      listImages: async () => [
        { ID: "img1", Repository: "nginx", Tag: "latest", Size: "142MB", CreatedAt: "2024-01-01" },
        { ID: "img2", Repository: "postgres", Tag: "15", Size: "379MB", CreatedAt: "2024-01-01" }
      ],
      startContainer: async () => true,
      stopContainer: async () => true,
      restartContainer: async () => true,
      removeContainer: async () => true,
      getStats: async () => [
        { ID: "abc123", Name: "mock-nginx", CPUPerc: "0.5%", MemUsage: "12MiB / 8GiB", MemPerc: "0.14%", NetIO: "1kB / 2kB", BlockIO: "0B / 0B" }
      ],
      pullImage: async () => true,
      removeImage: async () => true,
      getLogs: async () => "[mock] Container log output\n[mock] Line 2\n[mock] Line 3",
      onPullLine: (cb2) => {
        return () => {
        };
      }
    },
    git: {
      isRepo: async () => false,
      status: async () => ({ branch: "main", files: [], ahead: 0, behind: 0 }),
      log: async () => [],
      diff: async () => "",
      getBranches: async () => [],
      checkout: async () => true,
      stage: async () => true,
      unstage: async () => true,
      commit: async () => true,
      push: async () => "",
      pull: async () => "",
      stash: async () => true,
      stashPop: async () => true,
      init: async () => true
    },
    db: {
      open: async () => ({ error: "[mock] SQLite not available in browser" }),
      close: async () => true,
      listTables: async () => [],
      getSchema: async () => [],
      getTableRowCount: async () => 0,
      query: async () => ({ rows: [], columns: [], total: 0, error: null })
    },
    trash: {
      list: async () => [
        { name: "old-file.txt", originalPath: "/home/user/old-file.txt", deletionDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 19), size: 1024 },
        { name: "backup.zip", originalPath: "/home/user/backup.zip", deletionDate: new Date(Date.now() - 864e5).toISOString().slice(0, 19), size: 1024 * 1024 * 5 }
      ],
      moveToTrash: async () => true,
      restore: async () => true,
      deletePermanent: async () => true,
      empty: async () => true,
      getSize: async () => ({ count: 2, bytes: 1024 + 1024 * 1024 * 5 })
    },
    shodan: {
      search: async (query) => ({
        matches: [
          { ip_str: "1.2.3.4", hostnames: ["example.com"], ports: [80, 443, 22], org: "Acme Corp", isp: "Acme ISP", country_code: "US", country_name: "United States", os: "Linux", timestamp: (/* @__PURE__ */ new Date()).toISOString() },
          { ip_str: "5.6.7.8", hostnames: [], ports: [3389, 8080], org: "Test Org", isp: "Test ISP", country_code: "DE", country_name: "Germany", os: null, timestamp: (/* @__PURE__ */ new Date()).toISOString() }
        ],
        total: 2,
        query
      }),
      host: async (ip) => ({ ip_str: ip, ports: [80, 443], org: "Mock Org", country_name: "United States", os: "Linux", hostnames: ["mock.example.com"], timestamp: (/* @__PURE__ */ new Date()).toISOString() }),
      count: async () => ({ total: 42 }),
      exploits: async () => ({ matches: [], total: 0 })
    },
    osint: {
      lookup: async (tool, query) => {
        await sleep(800);
        if (tool === "IP Lookup") return { ip: query, city: "San Francisco", region: "California", country: "United States", org: "AS13335 Cloudflare", timezone: "America/Los_Angeles", latitude: 37.7749, longitude: -122.4194 };
        if (tool === "WHOIS") return { domain: query, status: "clientTransferProhibited", registered: "2010-03-15", expiry: "2025-03-15", registrar: "GoDaddy" };
        if (tool === "DNS Records") return { A: "1.2.3.4", MX: "mail.example.com", NS: "ns1.example.com, ns2.example.com", TXT: "v=spf1 include:example.com ~all" };
        return { result: `[mock] ${tool} lookup for ${query}` };
      }
    },
    cve: {
      search: async () => {
        await sleep(600);
        return [
          { id: "CVE-2024-1234", description: "A critical SQL injection vulnerability in ExampleCMS allows remote attackers to execute arbitrary SQL commands via the search parameter.", severity: "CRITICAL", score: 9.8, published: "2024-01-15", references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-1234"] },
          { id: "CVE-2024-5678", description: "Cross-site scripting (XSS) vulnerability in the admin dashboard of TestApp version 2.x.", severity: "HIGH", score: 7.4, published: "2024-02-20", references: [] }
        ];
      },
      recent: async () => {
        await sleep(400);
        return [
          { id: "CVE-2024-9999", description: "Remote code execution vulnerability in popular open-source library.", severity: "CRITICAL", score: 10, published: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), references: [] },
          { id: "CVE-2024-8888", description: "Memory corruption vulnerability in kernel component.", severity: "HIGH", score: 7.8, published: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), references: [] }
        ];
      }
    },
    ai: {
      chat: async (messages) => {
        await sleep(1200);
        const last = messages[messages.length - 1]?.content || "";
        return `[Mock AI Response] You asked: "${last.slice(0, 100)}". In a real session, Claude would provide expert cybersecurity analysis here. Configure your Anthropic API key in Settings → API Keys to enable real AI responses.`;
      }
    },
    packetSniffer: {
      start: async (_iface, _filter, cb2) => {
        let id2 = 0;
        const protos = ["TCP", "UDP", "ICMP", "HTTP", "DNS", "ARP"];
        const interval = setInterval(() => {
          cb2({ id: ++id2, time: (id2 * 0.042).toFixed(6), src: `192.168.1.${Math.floor(Math.random() * 254) + 1}`, dst: `10.0.0.${Math.floor(Math.random() * 254) + 1}`, proto: protos[Math.floor(Math.random() * protos.length)], len: Math.floor(Math.random() * 1400) + 64, info: "Mock packet data" });
        }, 300);
        return () => clearInterval(interval);
      },
      stop: async () => {
      }
    },
    backup: {
      list: async () => [
        { id: "1709000000000", name: "Backup 2024-02-27 10:00", size: "2.1MB", created: "2024-02-27 10:00", status: "complete", items: 142 }
      ],
      create: async () => ({ id: Date.now().toString(), name: `Backup ${(/* @__PURE__ */ new Date()).toLocaleString()}`, size: "2.3MB", created: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace("T", " "), status: "complete", items: 148 }),
      restore: async () => true,
      delete: async () => true,
      onProgress: (_cb) => () => {
      }
    },
    auditLog: {
      list: async () => [
        { id: "1", ts: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").slice(0, 19), type: "security", category: "Auth", message: "Login successful", details: "User logged in from 127.0.0.1" },
        { id: "2", ts: new Date(Date.now() - 6e4).toISOString().replace("T", " ").slice(0, 19), type: "info", category: "App", message: "Terminal opened" },
        { id: "3", ts: new Date(Date.now() - 12e4).toISOString().replace("T", " ").slice(0, 19), type: "warning", category: "Network", message: "Outbound connection to unknown host", details: "Destination: 198.51.100.42:443" },
        { id: "4", ts: new Date(Date.now() - 18e4).toISOString().replace("T", " ").slice(0, 19), type: "success", category: "System", message: "Backup completed successfully" }
      ],
      append: async (entry) => ({ id: Date.now().toString(), ts: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").slice(0, 19), ...entry }),
      clear: async () => true
    },
    codeScanner: {
      browse: async () => "/home/user/projects/myapp",
      scan: async () => {
        await sleep(2e3);
        return {
          findings: [
            { id: "1", severity: "HIGH", rule: "XSS_RISK", file: "src/utils/render.js", line: 42, code: "element.innerHTML = userInput", message: "innerHTML assignment with user data can cause XSS", fix: "Use textContent or sanitize with DOMPurify" },
            { id: "2", severity: "CRITICAL", rule: "HARDCODED_CREDENTIAL", file: "config/db.js", line: 8, code: 'const password = "admin123"', message: "Hardcoded password detected", fix: "Use environment variables" },
            { id: "3", severity: "MEDIUM", rule: "WEAK_HASH", file: "src/auth.js", line: 15, code: "const hash = md5(password)", message: "MD5 is cryptographically broken", fix: "Use bcrypt or argon2" }
          ],
          scanned: 23,
          duration: 1842,
          scanner: "Pattern-based"
        };
      },
      onProgress: (_cb) => () => {
      }
    },
    totp: {
      list: async () => [
        { id: "totp-1", name: "GitHub", issuer: "GitHub Inc.", secret: "JBSWY3DPEHPK3PXP" },
        { id: "totp-2", name: "Google", issuer: "Google LLC", secret: "JBSWY3DPEHPK3PXP" }
      ],
      generate: async (_secret) => ({ code: String(Math.floor(Math.random() * 1e6)).padStart(6, "0"), timeLeft: 30 - Math.floor(Date.now() / 1e3) % 30 }),
      add: async (account) => ({ id: `totp-${Date.now()}`, ...account }),
      remove: async () => true
    },
    wordlists: {
      list: async () => [
        { name: "rockyou-top1000.txt", path: "/mock/rockyou-top1000.txt", lineCount: 1e3, sizeKB: 8 },
        { name: "common-passwords.txt", path: "/mock/common-passwords.txt", lineCount: 500, sizeKB: 4 }
      ],
      preview: async () => ["password", "123456", "admin", "letmein", "qwerty", "monkey", "dragon", "master", "hello", "sunshine"],
      import: async () => null,
      delete: async () => true,
      generate: async () => "generated.txt"
    },
    passwordHealth: {
      checkHIBP: async (_pw) => {
        await sleep(800);
        return { breached: false, count: 0 };
      }
    },
    wallpaper: {
      listCustom: async () => [],
      browse: async () => null
    },
    clipboardHistory: {
      getAll: async () => [
        { id: "1", text: "Hello, world!", ts: Date.now() - 6e4, pinned: true },
        { id: "2", text: "npm install && npm run dev", ts: Date.now() - 12e4, pinned: false },
        { id: "3", text: "https://example.com/very-long-url?param=value", ts: Date.now() - 3e5, pinned: false }
      ],
      copy: async () => {
      },
      pin: async (id2) => [],
      delete: async (id2) => [],
      clear: async () => [],
      onChange: (cb2) => {
        return () => {
        };
      }
    },
    colorPicker: {
      getPalettes: async () => [
        { id: "p1", name: "Brand Colors", colors: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"], createdAt: Date.now() }
      ],
      savePalette: async (p2) => ({ ...p2, id: `pal-${Date.now()}`, createdAt: Date.now() }),
      updatePalette: async () => [],
      deletePalette: async () => []
    },
    imageViewer: {
      open: async () => null,
      readFile: async () => null,
      browseDir: async () => []
    },
    remoteDesktop: {
      checkDeps: async () => ({ x11vnc: false, websockify: false, novnc: false }),
      installDeps: async () => ({ ok: true }),
      start: async () => ({ ok: true, ip: "192.168.1.100", url: "http://192.168.1.100:6081", vncPort: 5900, wsPort: 6080, httpPort: 6081 }),
      stop: async () => ({ ok: true }),
      status: async () => ({ running: false, vncAlive: false, wsAlive: false }),
      getIP: async () => "192.168.1.100",
      tailscaleStatus: async () => ({ installed: false, running: false, ip: "", hostname: "" }),
      installTailscale: async () => ({ ok: true }),
      tailscaleUp: async () => ({ ok: true }),
      onLog: (cb2) => {
        return () => {
        };
      },
      onStopped: (cb2) => {
        return () => {
        };
      }
    },
    rssReader: {
      getFeeds: async () => [],
      getItems: async () => [],
      addFeed: async (url) => ({ feed: { id: "f1", url, title: url, description: "", lastFetched: Date.now() }, items: [] }),
      removeFeed: async () => {
      },
      refresh: async () => [],
      markRead: async () => {
      },
      markAllRead: async () => {
      }
    },
    notifyUnlock: () => {
    },
    onLock: (cb2) => {
      return () => {
      };
    },
    onOpenApp: (cb2) => {
      return () => {
      };
    },
    onHudVolume: (cb2) => {
      return () => {
      };
    },
    onHudBrightness: (cb2) => {
      return () => {
      };
    },
    onAppSwitcher: (cb2) => {
      return () => {
      };
    },
    onSpotlight: (cb2) => {
      return () => {
      };
    },
    onWorkspaceChanged: (cb2) => {
      return () => {
      };
    },
    onNotification: (cb2) => {
      return () => {
      };
    }
  };
}
if (typeof window !== "undefined" && !window.cryogram) {
  installMockCryogram();
}
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(We$1.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
export {
  AnimatePresence as A,
  THEME_PRESETS as T,
  We$1 as W,
  TutorialSlides as a,
  usePinnedStore as b,
  useThemeStore as c,
  jsxRuntimeExports as j,
  motion as m,
  reactExports as r,
  useDesktopStore as u
};
