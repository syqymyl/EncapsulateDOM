# 思路

1. 创建节点： create

- 在 dom 全局对象中写一个创建节点的函数 create，并在 main.js 中调用

```javascript
  create(tagName) {
    return document.createElement(tagName);
  }//dom.js
  const div = dom.create("div");
  console.log(div);
  //main.js
```

- 思考在 div 中加 span

```javascript
  create(string) {
    const container = document.createElement('div');
    container.innerHTML = string.trim() //trim用于除去string前后的空格
    return container.children;
  }//dom.js
  const div = dom.create("<div><span>1</span></div>");
  console.log(div);
  //main.js
```

- div 中不能包含<tr><td></td></tr>等标签，但换成<template></template>可以。template 标签在 html 中直接使用，其内容不会显示在页面上

```javascript
  create(string) {
    const container = document.createElement("template");
    container.innerHTML = string.trim(); //trim用于除去string前后的空格
    // console.log(container);
    return container.content.firstChild;  //template不能用children拿到内容
  }//dom.js
  const div = dom.create("<tr><td>1</td></tr>");
  console.log(div);
  //main.js
```

2. 删除子节点：empty

- 初版代码如下，是错误的代码，调试过程中发现 childNodes 随着 remove 在不断更新，于是使用不断更新 firstChild 方法，此处移除的节点包括文本节点

```javascript
  empty(node) {
    // const childNodes = node.childNodes;
    const { childNodes } = node; //与上一行代码等效
    const array = [];
    for (let i = 0; i < childNodes.length; i++) {
      array.push(dom.remove(childNodes[i]));
    }
    return array;
  },
```

3. 增删事件监听：on/off

- 若增删的事件监听为同一事件，要使用同一 fn，即为函数命名，以下的()=>{}不是同一 fn

```javascript
dom.on(test2, "click", () => {});
dom.off(test2, "click", () => {});
```
