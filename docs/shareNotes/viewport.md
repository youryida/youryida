[TOC]

# viewport 与移动端适配

## 1. viewport 简述

- HTML `<head>`中的一个`<meta>`声明。常见如下：

```html
<meta
  name="viewport"
  content="width=device-width,minimum-scale=1,maximum-scale=1"
/>
```

- 告诉浏览器，按满屏多少宽度来渲染（逻辑像素）。
  > 逻辑像素：css 中声明的 px 值

## 2.历史背景和作用

## 3. width 和 scale

`content`属性的取值，常用有两个：

- width
- scale
  表达的是同一个意思。

### 2.1 width

支持两种取值：

- device-width
- 具体 number 值（如 750）
