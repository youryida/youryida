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
      server { #可以有多个server
          location {
              #可以有多个location
              #location中的多数简单指令都可以统一声明在server块下
          }
      }
  }
  ```

#### 默认配置文件预览

安装 nginx 后，默认配置文件`cat /usr/local/etc/nginx/nginx.conf`

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

## 块指令 - location

```
Syntax:	location [ = | ~ | ~* | ^~ ] uri { ... }
Default:	—
Context:	server, location
```

注：从文档看，location 支持嵌套，但是实际用的不多。（待研究）

### 匹配修饰符及优先级

location 可以由前缀字符串或正则表达式定义，并由匹配修饰符确定具体匹配规则。

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

### 反向代理相关指令

配置反向代理，常用的两个指令为`proxy_pass`和`rewrite`。

### proxy_pass

```
Syntax:	proxy_pass URL;
Default:	—
Context:	location, if in location, limit_except
```

示例：

```nginx
#http://127.0.0.1:4321/sohu/
location = /sohu/ {
    proxy_pass http://www.sohu.com/;
}
```

代理到新 server 地址，不改变浏览器地址栏 URL。
根据 proxy_pass 的取值尾部是否带/，会出现两种不同的代理目的地。

|   type    |                       描述                       |
| :-------: | :----------------------------------------------: |
|  with /   | 请求地址的匹配 path 部分， 会被替换为 proxy_pass |
| without / |    请求地址的全部 path 会被追加到 proxy_pass     |

示例：

```nginx
#http://127.0.0.1:4321/with/15
location = /with/ {
    proxy_pass http://m.sohu.com/ch/;
}
location = /without/ {
    proxy_pass http://m.sohu.com/ch;
}
```

### rewrite

https://blog.csdn.net/dmw412724/article/details/79770159
