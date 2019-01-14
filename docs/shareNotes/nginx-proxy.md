[TOC]

# nginx 简介和反向代理配置

## 反向代理和正向代理

一些图解参考：https://www.cnblogs.com/Anker/p/6056540.html（个人认为描述的也不是很贴切）

网上很多文章对两者区别描述的都有些迷糊，可以拿一次内地访问 Google 的请求来感受正向和反向。

#### 正向代理

- 过程：client 通过代理 请求到 目标 server
- 响应数据：返回 clent 的数据就是目标 server 的数据
- 案例：科学上网 vpn、fiddler/charles

#### 反向代理

- 过程： server 作为一个代理，把自己需要响应的请求 分发到其他 server
- 响应数据：返回 client 的数据由分发后的 server 决定
- 案例：负载均衡、地址转发

---

## nginx

### 简介

- 历史：俄罗斯人，用 c 写的，web 服务器，首个版本在 2004 年
- 特点：开源，跨平台，轻量级，高性能
- 用途：网站发布（内部支持 Rails/PHP），邮件代理，负载均衡，反向代理 等

### 安装

参考：https://www.cnblogs.com/meng1314-shuai/p/8335140.html

### 常用命令

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

```
启动失败的错误日志：
access.log 和 error.log
/usr/local/nginx/logs or /var/log/nginx.
```

### 语法及基础配置

- nginx 由模块组成，模块由配置文件中指定的指令控制。
- 指令分为简单指令和块指令。

  - 一个简单指令由名称和参数组成，空格分隔，分号结尾。
  - 一个块指令由指令名和{}包围的一组简单指令组成，空格分隔。（共 4 个块指令：events， http， server 和 location）
  - {} 内可以包含其他指令的块指令，可以称为一个上下文。
    ~~看起来，岂不是任何块指令，都可以称为一个上下文？这里不是很明白官网介绍的意思，参见[Configuration File’s Structure](http://nginx.org/en/docs/beginners_guide.html)~~
  - 一个上下文也可以成为一个模块。表达意思是一样的。
  - 不属于任何上下文的指令，被认为是在主上下文中。各上下文层级关系如下：

  ```nginx
  #主上下文

  events {

  }
  http {
      server { #可以有多个server（待测试）
          location {
              #可以有多个location
              #location中的多数简单指令都可以统一声明在server块下
          }
      }
  }
  ```

   附，[按字母顺序排列的指令索引文档](http://nginx.org/en/docs/dirindex.html)

#### 默认配置文件预览

安装 nginx 后，默认配置文件`/usr/local/etc/nginx/nginx.conf`

```nginx
#user  nobody; # 系统用户名
worker_processes 1; #工作进程数
#error_log  logs/error.log; #错误日志位置
events {
    worker_connections 1024; #工作连接数
}
http {
    include mime.types;
    include servers/*;
    default_type application/octet-stream;
    #access_log  logs/access.log  main;
    #gzip  on;
    server {
        listen 8080;
        server_name localhost;
        #index  index.html index.htm;
        # root   html; #可以在location块中重写
        #charset koi8-r;
        expires 0s;
        location = /50x.html {
            root html;
        }
        #error_page  404              /404.html;
        error_page 500 502 503 504  /50x.html;
    }
}

```

- include servers/\*; 需要测试这个 可以的话 拿这个做 demo 演示

### 常用全局变量

```nginx
$scheme ： HTTP方法（如http，https）
$server_protocol ： 请求使用的协议，通常是HTTP/1.0或HTTP/1.1
$server_addr ： 服务器地址，在完成一次系统调用后可以确定这个值
$server_name ： 服务器名称
$server_port ： 请求到达服务器的端口号
$request_uri ： 包含请求参数的原始URI，不包含主机名，如："/foo/bar.php?arg=baz"
$uri ： 不带请求参数的当前URI，$uri不包含主机名，如"/foo/bar.html"
$document_uri ： 与$uri相同
```

更多参见官网：[按字母顺序排列的变量索引文档](http://nginx.org/en/docs/varindex.html)

---

## 块指令 - location

```
Syntax:	location [ = | ~ | ~* | ^~ ] uri { ... }
Default:	—
Context:	server, location
```

注：从文档看，location 支持嵌套，但是实际用的不多。（待研究）

### 匹配修饰符及优先级

location 可以由前缀字符串或正则表达式定义，并由匹配修饰符指定具体匹配规则。

通用优先级规则：

- 优先选择同一修饰符中的最长匹配
- 配置文件内从上到下选择匹配（待测试）

修饰符优先级规则（从上到下依次降低）：
|修饰符|描述|备注|
|:-:|:-:|:-:|
| = | 精确匹配 | 最高优先级，匹配即终止 |
| ^~ | 前缀匹配 | 匹配即终止 |
| ~ | 正则匹配 | 区分大小写，匹配即终止 |
| ~\* | 正则匹配 | 忽略大小写，匹配即终止 |
| [space] | 无修饰符匹配 | 匹配后继续匹配其他 |
| !~ / !~\* | 正则不匹配 | 没遇到过，待研究 |

#### 案例

```nginx
location = / {
    [ configuration A ]
}
location / {
    [ configuration B ]
}
location /documents/ {
    [ configuration C ]
}
location ^~ /images/ {
    [ configuration D ]
}
location ~* \.(gif|jpg|jpeg)$ {
    [ configuration E ]
}
```

|      request      | configuration |
| :---------------: | :-----------: |
|         /         |       A       |
|    /index.html    |       B       |
| /documents/a.html |       C       |
|   /images/1.gif   |       D       |
| /documents/1.jpg  |       E       |
|   /images/1.jpg   |       ?       |
|      /other/      |       ?       |
|    /documents     |       ?       |

#### 一些特殊情况

- 无修饰符匹配情况下，如果 location 中定义了{url}/，那么没有尾部斜杠的请求{url}，会被 301 永久重定向到{url}/。如果不希望这样，需要为其定义精确匹配规则。如下：

```nginx
location / user / {
}
location = / user {
}
```

---

## 反向代理相关指令

配置反向代理，常用的两个指令为`proxy_pass`和`rewrite`。

### proxy_pass

```
Syntax:	proxy_pass URL;
Default:	—
Context:	location, if in location, limit_except
```

proxy_pass 指令可以实现把原始 url 代理到新 server 地址，不改变浏览器地址栏 URL。

> 注意：proxy_pass 取值必须符合 URL 规则（不能只是一个 path）

示例：

```nginx
#http://127.0.0.1:6001/sohu/
location = /sohu/ {
    proxy_pass http://www.sohu.com/;
}
```

#### 两种代理规则

根据 proxy_pass 是否指定了 path ~~（[官网文档](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass)称“是否有 URI part”，这里不是很明白 nginx 的作者是如何理解 URL 和 URI 的区别）~~ ，会有两种不同的代理规则。

|     是否指定 path      |                                               规则描述                                               |
| :--------------------: | :--------------------------------------------------------------------------------------------------: |
|       指定 path        | 与该 location 匹配的规范化请求 URI 的部分（从 请求 url 头一直到匹配部分）将被指令中指定的 URI `替换` |
| 未指定 path（仅 host） |                             请求 url 的全部 path 会被`追加`到 proxy_pass                             |

示例：

```nginx
location /host1/ {
    proxy_pass http://127.0.0.1:8888/;
}

location /host0/ {
    proxy_pass http://127.0.0.1:8888;
}

location /path1/ {
    proxy_pass http://127.0.0.1:8888/a/;
}

location /path0/ {
    proxy_pass http://127.0.0.1:8888/a;
}
```

##### 禁止使用 `指定path`的几种情况

以下几种情况下，因为 nginx 无法确定需要替换哪些 URI，所以，禁止使用`指定path`。

- 正则匹配的 location 内
- 在命名 location 内指定的 location 内 ~~（看起来是在说嵌套内层的 location？待确认）~~
- if 内
- limit_except 内

附，nginx 对应报错提示：

```
nginx: [emerg] "proxy_pass" cannot have URI part in location given by regular expression, or inside named location, or inside "if" statement, or inside "limit_except" block in /usr/local/etc/nginx/nginx.conf:49
```

#### `指定path`会被忽略的情况

- location 内同时存在 rewrite 指令时

```nginx
location /rw/ {
    rewrite /rw/ /a break;
    proxy_pass http://127.0.0.1:8888/origin/;
}
```

### rewrite

```
Syntax:	rewrite regex replacement [flag];
Default:	—
Context:	server, location, if
```

如果`regex`匹配，那么把原始 URL 代理到`replacement`指定的其他 URL（支持就地重写和重定向）。

- 一个 location 内可以写多个 rewrite 指令
- 注意不是仅替换匹配部分，是“如果匹配，就替换全部”
- 附，[官网文档参考](http://nginx.org/en/docs/http/ngx_http_rewrite_module.html#rewrite)

#### regex

正则表达式。

- \\/ 等同于 /
- 如果正则表达式包含" }"或" ;"字符，则整个表达式应包含在单引号或双引号中。(未测试)

#### 参数 - replacement

替换字符串，用来标记代理后的新 path 或 URL。

- 同一 location 中的多个 rewrite 指令顺序执行。可以使用`flag`提前终止。（多个 rewrite 都能匹配到的结果 待测试）
- 如果`replacement`以"http://"，"https://"或"\$scheme" 开头，则停止处理并重定向返回给客户端（忽略`flag`强制重定向）。其他情况，在当前 host 下重写。
- 如果 replacement 字符串包含新的请求参数，则先前的请求参数将以&连接符附加在它们之后。如果不希望附加，可以在替换字符串的末尾加上一个?，例如：(未测试)

``` nginx
rewrite ^/users/(.*)$ /show?user=$1? last;
```

#### 参数 - flag

用来标记是就地重写还是重定向。

|   value   |                      desc                      |
| :-------: | :--------------------------------------------: |
|   last    | 停止处理，并按改变后的新 location 重新搜索匹配 |
|   break   |               停止处理，直接返回               |
| redirect  |                 302 临时重定向                 |
| permanent |                 301 永久重定向                 |

```
注：不太明白官网对 redirect 的介绍，replacement没有协议头的时候用这个？（returns a temporary redirect with the 302 code; used if a replacement string does not start with “http://”, “https://”, or “\$scheme”;）
```

##### last 和 break 区别

如上表描述，last 在某些情况下存在陷入死循环的可能，比如：

```nginx
location /download/ {
    rewrite (/download/.*)/ $1/mp3/default.mp3 last;
}
```

上面案例，并不想对新 url 进行重新搜索匹配，last 需要替换为 break。否则，nginx 默认规则会在进行 10 个循环后返回 500 错误。

---

## 补充

### 指令 - try_file

```
Syntax:	try_files file ... uri;
Default:	—
Context:	server, location
```

检查指定顺序的文件是否存在，并使用第一个找到的文件进行请求处理。

在 web 前端开发中，部署静态服务时可以用来开启 history 模式，如下：

```nginx
location / {
    try_files $uri $uri/index.html /index.html;
}
```

先找$uri，找不到就找$uri/index.html，还找不到就找根目录下的/index.html

## 多层 nginx

。。。待整理
