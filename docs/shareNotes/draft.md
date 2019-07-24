# 下为草稿

### 5.1 响应式适配

#### 5.1.1 需求描述

> The term Responsive Design was first coined by the web designer and developer Ethan Marcotte in his book, Responsive Web Design. Responsive designs respond to changes in browser width by adjusting the placement of design elements to fit in the available space.
>
> `响应式设计`首先由 Ethan Marcotte 在他的“响应式网页设计”一书中创造。响应式设计通过调整设计元素的位置以适应可用空间来响应浏览器宽度的变化。

响应式适配需求，可以说是一套代码需要适配所有大小的屏幕，常见于 PC 和移动端共用一套代码的场景。典型的 Web 站点如`GitHub`。浏览这类站点时，随着屏幕的缩小，你会看到页面模块的布局结构在伸缩、流动或显隐变化，文字图片等主体内容在布局容器内流动填充、其大小也一直在做梯级变化。

![github响应式表现图](./assets/viewport/github-demo.gif)

#### 5.1.2 技术方案

技术方案一般是下面几种方式的组合使用：

- 设置 viewport 宽度为 device-width 以实现同样 px 大小约束下不同屏幕（或者横竖屏切换）视觉大小的一致性
- 布局容器的宽度使用`%`以实现伸缩
- 定位排列使用`float/flex/inline-block`等以实现流动
- 使用媒体查询按照一定的梯级范围给各种屏幕定制页面模块的布局、字号图片的大小，以实现视觉上舒适的梯级变化

注：
媒体查询请注意区分`@media screen and (xxx){}`中的`min-device-width`和`min-width`，前者依据的是设备宽度(screen.width)，后者依据的是视口宽度(window.innerWidth)。

### 5.2 等比缩放式适配

#### 5.2.1 需求描述

缩放式适配需求，即按照屏幕宽度，在不同的屏幕上满屏等比例缩放展示。简单描述，就像一张固定长宽比，且横向总是铺满屏幕的图片，宽屏显示的大，窄屏显示的小。

移动互联网发展到一定阶段之后，越来越多的开发者意识到响应式适配的复杂性和局限性，开始针对特定屏幕设计固定的 UI，绝大多数数移动端产品都有了区分于 PC 的专门的`m站`。

这类业务场景中，运行环境都是便携式的手机，屏幕宽度差距都不大，UI 适配上，可以一把梭只做缩放式适配了。

_注：Pad 设备虽然也是移动设备，但是因为屏幕足够宽了，所以现在多数产品（如某宝）的方案都是访问 PC 站点了。_

#### 5.2.2 技术方案 - rem

`rem`是 CSS3 新增的相对于根元素 html 的 font-size 计算值的大小的倍数单位。早期的移动端等比缩放的适配方案都是基于 rem。

- 设置 viewport 宽度为 device-width 或其他固定值，以得到 px 为单位的文字或边线等的期望效果
- css 单位使用 rem，js 根据 viewport 宽度以及 css 中 rem 的换算系数，动态计算并设置 html 根节点 font-size，以实现整个页面内容的等比例缩放

_注：一些文本段落展示类的需求，不希望做等比缩放适配，希望宽屏比窄屏在一行内可以展示更多的文字。这时就需要引入媒体查询，并且对字号使用 px 单位做特殊处理。_

> rem 为基础的动态适配方案
>
> 设：横向满屏的 rem 个数预定为 remCount，标注稿总宽度 px 为 uiWidth，标注稿内某元素宽度为 uiEleWidth。
>
> 那么：
>
> - 设计稿中 1rem 表示的 px 数 uiPX1rem = uiWidth/remCount
> - CSS 中某元素 rem 的值 cssEleWidth= uiEleWidth/uiPX1rem
> - JS 中根节点的 fontSize = window.innerWidth/remCount

_github 中近 1 万 star 的 js 库`lib-flexible`便是采用的此方案。_

#### 5.2.3 技术方案 - viewport units

iOS8+/Android4.4+ 开始支持了新的单位——viewport units（视口单位）。包括：vw/vh/vmin/vmax。

1vw 即表示当前视口宽度的 1%，我们可以利用这一点替代“rem+根节点 font-size”的等比缩放适配方案。

举个例子，750px 的 UI 稿中，宽度 75px 的按钮，在 css 中的宽度描述即为：`width:1vw`。

这个方案中有两个常见问题点：

1. dpr>1 的屏幕，viewport 宽度为 device-width 时，如何实现 1 个物理像素粗的细线
2. 如何避免渲染 rem 单位的元素宽高、字号等样式时，因为计算出的 px 出现了多位小数点，而引起的跨浏览器渲染差异问题

这两个问题引出了两个关键点：

- viewport 的 width 的最优值是多少？
- css 的 rem 书写转换系数的最优值是多少？

继续抛出一个问题：
rem 方案中，不考虑 1px 细线问题的话，是否可以不设置 viewport？

**后期技术方案**

vw/vh/vmin/vmax

待整理。。

---

---

# 下为草稿

视口和窗口

viewport 中文译作“视口”，即可视区域，详细讲就是浏览器窗口中用来展示 Web 内容的区域。
和“窗口”（window）做对比，在浏览器全屏状态下，两者大小是相等的。但是因为浏览器中标题栏/状态栏/地址栏/滚动条/控制台等其他 UI 元素的存在，视口的大小绝大多数情况下是小于窗口大小的。

![视口宽度](./assets/viewport/viewport-window.png)
如图，以宽度举例：

- 视口宽度(document.documentElement.clientWidth)
- 窗口内部宽度(window.innerWidth) = 视口宽度+滚动条宽度
- 窗口外部宽度(window.outerWidth) = 窗口内部宽度+控制台宽度+边框宽度

逻辑关系简单清晰。
鉴于 Web 开发都是容器内的操作，我们通常并不关心浏览器的窗口宽度。下面，我们只讨论“视口”。

这里插入 问题 1：
在浏览器内对页面进行缩放操作，放大到 200%，视口宽度的值会如何变化？

### 视口与文档缩放

![放大的视口宽度](./assets/viewport/viewport-window-bigger.png)
如图，实际结果是：视口宽度由 166 缩小一倍到了 83。

放大一倍之后，页面大小 x2，可视区域的大小并没有变，为什么取到的视口宽度值缩小了一倍？

解释如此诡异的现象，需要引入新的概念——“可视视口(Visual Viewport)”和“布局视口(Layout Viewport )”。

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
- ppk 2012 viewport 的研究 https://www.quirksmode.org/mobile/metaviewport/
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
