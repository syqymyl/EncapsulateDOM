const div = dom.create("<div>newDiv</div>");
console.log(div);

dom.after(test, div);

const div3 = dom.create("<div id='parent'></div>");
dom.wrap(test, div3);

const nodes = dom.empty(window.empty);
console.log(nodes);

dom.attr(test, "title", "Hi, I am syqsmyl");
const title = dom.attr(test, "title"); //读取title属性
console.log(`title: ${title}`);

// dom.text(test, "你好");
// console.log(dom.text(test));

dom.style(test, { border: "1px solid red", color: "orange" });
console.log(dom.style(test, "border"));
dom.style(test, "border", "1px solid blue");

dom.class.add(test2, "red");
dom.class.add(test2, "blue");
dom.class.remove(test2, "blue");
console.log(dom.class.has(test2, "blue"));

const fn = () => {
  console.log("点击了");
};
dom.on(test2, "click", fn);
dom.off(test2, "click", fn);
//此处必须提前为函数命名

const test2Div = dom.find("#test2")[0];
console.log(test2Div);
//找test2
console.log(dom.find(".red", test2Div)[0]);
//找test2中的p元素
const div2 = dom.find("#test2>.red")[0];
dom.style(div2, "color", "blue");

console.log(dom.parent(test2));
console.log(dom.children(test2));

const s2 = dom.find("#s2")[0];
console.log(dom.siblings(s2));
console.log(dom.next(s2));
console.log(dom.previous(s2));

const t = dom.find("#travel")[0];
dom.each(dom.children(t), (n) => {
  dom.style(n, "color", "red");
});
const divList = dom.find(".red");
dom.each(divList, (n) => console.log(n));

console.log(dom.index(s2)); //1
