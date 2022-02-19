// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"dom.js":[function(require,module,exports) {
window.dom = {
  create: function create(string) {
    //创建节点
    var container = document.createElement("template");
    container.innerHTML = string.trim();
    return container.content.firstChild;
  },
  after: function after(node, node2) {
    //新增下一节点
    //DOM API中没有insertAfter，只能用insertBefore
    node.parentNode.insertBefore(node2, node.nextSiBling);
  },
  before: function before(node, node2) {
    //新增上一节点
    node.parentNode.insertBefore(node2, node);
  },
  append: function append(parent, node) {
    //新增子节点
    parent.appendChild(node);
  },
  wrap: function wrap(node, parent) {
    //新增父节点
    dom.before(node, parent);
    dom.append(parent, node);
  },
  remove: function remove(node) {
    //删除节点
    node.parentNode.removeChild(node); // node.remove()有些浏览器不支持
    return node; // 保留引用
  },
  empty: function empty(node) {
    // 删除子节点：文本节点也会移除
    var array = [];
    var x = node.firstChild;
    while (x) {
      array.push(dom.remove(node.firstChild));
      x = node.firstChild;
    }
    return array;
  },
  attr: function attr(node, name, value) {
    // 读写属性
    if (arguments.length === 3) {
      node.setAttribute(name, value);
    } else if (arguments.length === 2) {
      return node.getAttribute(name);
    }
  },
  text: function text(node, string) {
    // 读写文本内容，注意适配
    if (arguments.length === 2) {
      //修改text
      if ("innerText" in node) {
        node.innerText = string; // ie
      } else {
        node.textContent = string; // firefox / Chrome
      }
    } else if (arguments.length === 1) {
      // 获取text
      if ("innerText" in node) {
        return node.innerText;
      } else {
        return node.textContent;
      }
    }
  },
  html: function html(node, string) {
    //读写HTML内容
    if (arguments.length === 2) {
      node.innerHTML = string;
    } else if (arguments.length === 1) {
      return node.innerHTML;
    }
  },
  style: function style(node, name, value) {
    //修改style
    if (arguments.length === 3) {
      //调用栗子：dom.style(div, 'color', 'red')
      node.style[name] = value;
    } else if (arguments.length === 2) {
      if (typeof name === "string") {
        //调用栗子：dom.style(div, 'color')
        return node.style[name];
      } else if (name instanceof Object) {
        //调用栗子：dom.style(div, {color:'red'})
        for (var key in name) {
          // key: border/color
          // node.style.border = ...
          // node.style.color = ...
          node.style[key] = name[key];
          //使用变量名作为属性名时，变量名要用[]括起来
        }
      }
    }
  },

  class: {
    add: function add(node, className) {
      node.classList.add(className);
    },
    remove: function remove(node, className) {
      node.classList.remove(className);
    },
    has: function has(node, className) {
      //根据属性名判断是否存在该节点
      return node.classList.contains(className);
    }
  },
  on: function on(node, eventName, fn) {
    //添加事件监听
    node.addEventListener(eventName, fn);
  },
  off: function off(node, eventName, fn) {
    //删除事件监听
    node.removeEventListener(eventName, fn);
  },
  find: function find(selector, scope) {
    //获取标签，返回的是标签数组
    return (scope || document).querySelectorAll(selector);
  },
  parent: function parent(node) {
    //获取父元素
    return node.parentNode;
  },
  children: function children(node) {
    //获取子元素
    return node.children;
  },
  siblings: function siblings(node) {
    //获取兄弟姐妹元素
    return Array.from(node.parentNode.children).filter(function (n) {
      return n !== node;
    });
    //node.parentNode.children返回的是一个伪数组
  },
  next: function next(node) {
    //获取下一节点（除文本）
    var x = node.nextSibling;
    while (x && x.nodeType === 3) {
      //如果下一个节点存在且是文本节点就取该节点的下一个
      x = x.nextSibling;
    }
    return x;
  },
  previous: function previous(node) {
    //获取上一节点（除文本）
    var x = node.previousSibling;
    while (x && x.nodeType === 3) {
      x = x.previousSibling;
    }
    return x;
  },
  each: function each(nodeList, fn) {
    //遍历所有节点
    for (var i = 0; i < nodeList.length; i++) {
      fn.call(null, nodeList[i]);
    }
  },
  index: function index(node) {
    //获取位置排行：返回的位置从0开始
    var list = dom.children(node.parentNode);
    for (var i = 0; i < list.length; i++) {
      if (list[i] === node) {
        return i;
      }
    }
  }
};
},{}],"C:\\Users\\落薇\\AppData\\Local\\Yarn\\Data\\global\\node_modules\\parcel\\src\\builtins\\hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '7638' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["C:\\Users\\落薇\\AppData\\Local\\Yarn\\Data\\global\\node_modules\\parcel\\src\\builtins\\hmr-runtime.js","dom.js"], null)
//# sourceMappingURL=/dom.7e9a2d1a.map