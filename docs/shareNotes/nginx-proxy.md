[TOC]

# nginx 反向代理

## nginx 简介

-  历史：俄罗斯人，用 c 写的，web 服务器，首个版本在 2004 年
- 特点：开源，跨平台，轻量级，高性能
- 用途：网站发布（内部支持 Rails/PHP），邮件代理，负载均衡，反向代理

## 安装

参考：https://www.cnblogs.com/meng1314-shuai/p/8335140.html

## 常用命令

```javascript
//启动服务
nginx

//停止服务
nginx -s stop

//语法检查
nginx -t

//重载配置不停服
nginx -s reload
```

## 反向代理

### 反向代理和正向代理区别

一些图解参考：https://www.cnblogs.com/Anker/p/6056540.html（个人认为描述的也不是很贴切）

网上很多文章描述的都有些迷糊， 可以拿一次内地访问 Google 的请求来感受正向和反向。

##### 正向代理

- client 通过梯子、桥请求到 目标 server，返回 clent 的数据就是目标 server 的数据（科学上网 vpn、fiddler/charles）

##### 反向代理

- server 把自己需要响应的请求分发到其他 server，返回 client 的数据由分发后的 server 决定（负载均衡、地址转发）

## nginx 常用配置

来不及了，后面有机会再讲。

- 语法（行尾分号）
- server{
  ...
  }
- http{
  ...
  }
- location{
  ...
  }
- include servers/\*;

```
#listen 4321;
#server_name localhost;
#index  index.html index.htm;
# root   html;
#charset koi8-r;
#expires 0s;
#access_log  logs/host.access.log  main;
```

## nginx 反向代理

### location 匹配及优先级

普通匹配

- location = URI { configuration } #精确匹配
- location ^~ URI { configuration } #非正则匹配
- location [space] URI { configuration} #前缀匹配

正则匹配

- location ~ URI { configuration } #大小写敏感匹配
- location ~\* URI { configuration } #大小写不敏感匹配

备注说明

```
= 精确匹配，匹配后停止后续匹配，直接执行该匹配后的配置
[空格] 前缀匹配，匹配后，会继续更长前缀匹配和正则匹配，直到没有
^~ 非正则匹配，匹配该规则后，停止继续正则匹配。
~ 区分大小写的正则匹配，按顺序匹配，一旦匹配上即停止后续匹配。
~* 不区分大小写的匹配，一旦匹配即停止后续匹配。
```

https://www.cnblogs.com/willgarden/p/7908374.html

### proxy_pass

举例。
http://127.0.0.1:4321/sohu/

```
location = /sohu/ {
    proxy_pass http://www.sohu.com/;
}
```

官方文档：

```
Syntax:	proxy_pass URL;
Default:	—
Context:	location, if in location, limit_except
```

### rewrite

https://blog.csdn.net/dmw412724/article/details/79770159
