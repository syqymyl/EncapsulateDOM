window.dom = {
  create(string) {
    //创建节点
    const container = document.createElement("template");
    container.innerHTML = string.trim();
    return container.content.firstChild;
  },
  after(node, node2) {
    //新增下一节点
    //DOM API中没有insertAfter，只能用insertBefore
    node.parentNode.insertBefore(node2, node.nextSiBling);
  },
  before(node, node2) {
    //新增上一节点
    node.parentNode.insertBefore(node2, node);
  },
  append(parent, node) {
    //新增子节点
    parent.appendChild(node);
  },
  wrap(node, parent) {
    //新增父节点
    dom.before(node, parent);
    dom.append(parent, node);
  },
  remove(node) {
    //删除节点
    node.parentNode.removeChild(node); // node.remove()有些浏览器不支持
    return node; // 保留引用
  },
  empty(node) {
    // 删除子节点：文本节点也会移除
    const array = [];
    let x = node.firstChild;
    while (x) {
      array.push(dom.remove(node.firstChild));
      x = node.firstChild;
    }
    return array;
  },
  attr(node, name, value) {
    // 读写属性
    if (arguments.length === 3) {
      node.setAttribute(name, value);
    } else if (arguments.length === 2) {
      return node.getAttribute(name);
    }
  },
  text(node, string) {
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
  html(node, string) {
    //读写HTML内容
    if (arguments.length === 2) {
      node.innerHTML = string;
    } else if (arguments.length === 1) {
      return node.innerHTML;
    }
  },
  style(node, name, value) {
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
        for (let key in name) {
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
    add(node, className) {
      node.classList.add(className);
    },
    remove(node, className) {
      node.classList.remove(className);
    },
    has(node, className) {
      //根据属性名判断是否存在该节点
      return node.classList.contains(className);
    },
  },
  on(node, eventName, fn) {
    //添加事件监听
    node.addEventListener(eventName, fn);
  },
  off(node, eventName, fn) {
    //删除事件监听
    node.removeEventListener(eventName, fn);
  },
  find(selector, scope) {
    //获取标签，返回的是标签数组
    return (scope || document).querySelectorAll(selector);
  },
  parent(node) {
    //获取父元素
    return node.parentNode;
  },
  children(node) {
    //获取子元素
    return node.children;
  },
  siblings(node) {
    //获取兄弟姐妹元素
    return Array.from(node.parentNode.children).filter((n) => n !== node);
    //node.parentNode.children返回的是一个伪数组
  },
  next(node) {
    //获取下一节点（除文本）
    let x = node.nextSibling;
    while (x && x.nodeType === 3) {
      //如果下一个节点存在且是文本节点就取该节点的下一个
      x = x.nextSibling;
    }
    return x;
  },
  previous(node) {
    //获取上一节点（除文本）
    let x = node.previousSibling;
    while (x && x.nodeType === 3) {
      x = x.previousSibling;
    }
    return x;
  },
  each(nodeList, fn) {
    //遍历所有节点
    for (let i = 0; i < nodeList.length; i++) {
      fn.call(null, nodeList[i]);
    }
  },
  index(node) {
    //获取位置排行：返回的位置从0开始
    const list = dom.children(node.parentNode);
    for (let i = 0; i < list.length; i++) {
      if (list[i] === node) {
        return i;
      }
    }
  },
};
