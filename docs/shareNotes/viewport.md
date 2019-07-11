[TOC]

# Web 前端开发中的 viewport 与移动端适配

## 1. viewport 简述

### 视口和窗口

中文译作“视口”，即可视区域。
和“窗口”（即浏览器窗口）做对比，在浏览器全屏状态下，两者大小是相等的。但是因为标题栏/状态栏/地址栏/滚动条/控制台等其他 UI 元素的存在，视口的大小绝大多数情况下是小于窗口大小的。

![视口和窗口对比](./assets/viewport/viewport-window.png)
如图，以宽度举例：

- 视口宽度(document.documentElement.clientWidth)
- 窗口内部宽度(window.innerWidth) = 视口宽度+滚动条宽度
- 窗口外部宽度(window.outerWidth) = 窗口内部宽度+控制台宽度+边框宽度

逻辑关系简单清晰。
鉴于 Web 开发都是容器内的操作，我们通常并不关心浏览器的窗口宽度，所以，我们暂时忘掉窗口，接下来我们只讨论“视口”。

这里插入 问题 1：
对浏览器进行缩放操作，放大到 200%，视口宽度的值会如何变化？

### 缩放

![放大的视口和窗口对比](./assets/viewport/viewport-window-bigger.png)
如图，实际结果是：视口宽度由 166 缩小一倍到了 83。

放大一倍之后，只是文档大小变大了，可视区域的大小并没有变，为什么取到的视口宽度值缩小了一倍？

解释如此诡异的现象，需要引入新的概念——“视觉视口”和“布局视口”。

### 视觉视口和布局视口

参考 1 https://developer.mozilla.org/en-US/docs/Web/CSS/Viewport_concepts
参考 2 https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta

待继续整理

- HTML `<head>`中的一个`<meta>`声明，用来告诉浏览器`初始视口`的大小，仅供移动设备使用。常见如下：

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1,user-scalable=no"
/>
```

- 告诉浏览器，按满屏多少宽度来渲染（逻辑像素）。
  > 逻辑像素：css 中声明的 px 值

## 2.历史背景和作用

ppk 的三个视口 逻辑太麻烦 其实就是个逻辑容器和物理容器

- 34w 阅读 https://www.cnblogs.com/2050/p/3877280.html
- ppk 2014 viewport 的研究 https://www.quirksmode.org/mobile/metaviewport/
- 最早推出 meta viewport 的 Apple https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html
- CSS W3C 草案 https://drafts.csswg.org/css-device-adapt/
- 2019 标准权利移交之后的文档？ MDN 的文档？

以上都有点老了,还是参考 MDN 吧 https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta

获取容器逻辑宽度
document.documentElement.clientWidth

而元视窗指令被称为 initial-scale，minimum-scale 和 maximum-scale。其他浏览器被迫遵守以保持与 iPhone 特定网站的兼容性。

可以研究下 height
视觉宽度获取 visual viewport 的宽度可以通过 window.innerWidth

遗憾的是，历史上许多文档都是针对较大的视口设计的，并且在较小的视口中查看时会出现各种错误。这些包括非预期的布局包装，剪切的内容，笨拙的可滚动边界和脚本错误。为了避免这些问题，移动浏览器通常使用固定的初始包含块宽度来模仿常见的桌面浏览器窗口大小（通常为 980-1024px）。然后缩小生成的布局以适应可用的屏幕空间。

CSS 标准草案中提出了“使用@viewport 规则覆盖网页中视口大小”的标准方法，来替换从 Apple 流行起来的`<meta vieport>`实现，示例如下：

```css
@viewport {
  width: device-width;
}
```

然，截止 2019 年 8 月，主流浏览器均未提供实现。我们先忽略这个。

## 3. width 和 scale

`content`属性的取值，常用有两个：

- width
- scale
  表达的是同一个意思。

### 2.1 width

支持两种取值：

- device-width
- 具体 number 值（如 750）

initial-scale 和 width 的优先级？取大的 ？是书写顺序在后面的？
应该怎样呢
