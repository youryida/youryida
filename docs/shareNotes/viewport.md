[TOC]

# Web 前端开发中的 viewport 与移动端适配

## 1. 引言

移动端开发中，有一个躲避不掉的 HTML meta 声明 `<meta viewport>`。通常被用来做跨屏适配，常见声明如下：

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1,user-scalable=no"
/>
```

这个声明中隐含的概念和历史，以及如何更合理的搭配 `px/rem/vw` 来做跨屏适配，我们接下来一起探讨一下。

## 2. viewport 简述

### 2.1 viewport 概念

`viewport` 中文译作“视口”。[维基百科的解释](https://en.wikipedia.org/wiki/Viewport)为：

> - 在计算机图形学理论中，当将一些对象渲染到图像时，存在两个类似区域的相关概念。(视口和窗口)
> - 视口是一个以特定于渲染设备的坐标表示的区域（通常为矩形）。视口范围内的图像会以剪切的形式，投影到到世界坐标窗口中，完成图像的可视化展示。
> - 在 Web 浏览器中，视口是整个文档的可见部分。如果文档大于视口，则用户可以通过滚动来移动视口。

白话描述一下，计算机把图像渲染到显示器的过程中，会先创建一个逻辑层的画布，然后从这个画布中框选一部分投影到显示层。这个选框就是`视口`，显示层就是`窗口`。

截一张某宝的商品放大的效果图，来做更形象的视口解释。
![更形象的视口解释](./assets/viewport/viewport.png)
如图，左半图为计算机里的看不到的逻辑画布，上方半透明选框为视口(viewport)，右半图为窗口，即用户看到的部分。

逻辑关系简单清晰。

此处插入问题 1：浏览器中，对页面进行放大的时候，视口的大小如何变化？

### 2.2 viewport 的缩放与平移

回答问题 1，视口会变小。

因为，浏览器窗口中所浏览图像的放大，是依赖于视口的缩小来实现的。

参考 2.1 中插图来理解，右侧浏览器窗口不变的情况下，左侧视口缩小到只能覆盖模特的面部时，右侧窗口中的图像就会放大到满屏都是大头像了。

同理，在浏览器窗口中，当我们想看到模特的小腿时，我们需要向下滚动滚动条，浏览器在实现这个的过程中所依赖的，便是视口的下移。

### 2.3 viewport 的 DOM API

关于上面的解释，我们来验证一下。

目前已被标准实现的 API 中，有两个 DOM 属性可以用来获取视口的大小。

以宽度为例：

- document.documentElement.clientWidth（不含滚动条）
- window.innerWidth（含滚动条）

![视口宽度](./assets/viewport/viewport-width-scale.png)

如图，PC Chrome 中试验，确实如之前解释，放大到 200%后，视口大小缩小了一倍。（小数点默认四舍五入了）

以上，看起来 viewport 并没有太多复杂之处，但是 2012 年左右，移动端时代来了。

## 3. 移动端的 viewport

### 3.1 放大的 viewport

移动互联网的早期，屏幕设备的物理像素点宽度多数在 320、480、640 等。如果浏览器和针对 PC 制作的网页都不做任何处理，那么在窄屏设备上加载网页，我们看到的效果便是默认显示网页的左上角部分，然后通过水平和竖直方向的滚动来浏览网页的其他部分。

_注：移动设备的显著特点是屏幕小，考虑到人类的水平阅读习惯，我们这里只讨论宽度。_

首先，我们看不到网页全局的样子。其次，我们需要通过不断的滚动来保证阅读内容的连续性。这样的体验，有点过于糟糕了。

为了优化“最初为 PC 设计的网页”在移动设备的浏览体验，移动浏览器厂商们想了一个方案，那就是增大页面载入时初始视口的宽度，比如 980px。

按照 2.1 里的 viewport 的解释，如此的设计，会把逻辑层画布中 980px 的图像投影显示到 320px 的屏幕上，看到的效果便是一个缩小版的页面。

![移动端浏览PC页面效果](./assets/viewport/pc-in-mobile.png)
如上图，页面载入时，我们可以一眼看到整个页面的样子了。
不过，对缩小版页面内细节内容的浏览，依然要依靠放大和滚动，这样的体验依然不够好。而且如果 PC 网页的 CSS 宽度大于 980px，那么初始页面依然会有滚动条。

### 3.2 定制 viewport

对于使用媒体查询技术(Media queries)对窄屏进行优化的页面，3.1 所述的方案显得更加不合理了。因为，如果视口宽度初始为 980px，那么浏览器便不会以 640px、480px 或更低分辨率来启动对应的媒体查询，从而限制了这类查询机制的有效性。

为了解决这个问题，Apple 在 iOS Safari 中首先引入了`viewport meta tag`，允许 Web 开发人员[定制视口](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html)的大小和比例（约 2014 年）。

虽然，后续其他的移动浏览器也都支持了此标记，但是 W3C 并未将此列入标准。（这并不影响我们使用它）

_从目前 W3C 的草案规范来看，他希望按如下方式在 css 中声明 viewport，而不是在\<meta\>中。更多相关细节，可以参考下面链接，本文不作更多讨论。_

```css
@viewport {
  width: device-width;
}
```

> 参考：
>
> - https://drafts.csswg.org/css-device-adapt/#the-viewport
> - https://developer.mozilla.org/en-US/docs/Web/CSS/@viewport

4. 移动 Web 开发中 viewport 的使用

safari
https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html

### 2.4 Visual Viewport 和 Layout Viewport

在 [MDN 对 vieport 的解释](https://developer.mozilla.org/en-US/docs/Glossary/viewport)中

> 视口表示当前正在查看的计算机图形中的多边形（通常为矩形）区域。在 Web 浏览器术语中，它指的是您正在查看的文档中当前`可在其窗口中显示的部分`（如果以全屏模式查看文档，则指的是屏幕）。在滚动到视图中之前，视口外部的内容在屏幕上不可见。

> 当前可见的视口部分称为可视视口。这可以小于布局视口，例如当用户进行缩放缩放时。该布局视口保持不变，但视觉视口变小。

引入了新的概念——`Visual Viewport`和`Layout Viewport`，即可视视口和布局视口。

_注：有的文章将 Visual Viewport 译作“视觉视口”，个人认为其语义感不如“可视视口”。_

我们上面一直描述的视口，即为此处的可视视口——**可**在窗口中显示的区域。而布局视口则指的就是 2.1 白话描述中的画布。

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
