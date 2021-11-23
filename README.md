# NIL-ADMIN

这是一个基于`Vite``TS``Element-UI`的超级简单的后台管理前端框架。

## 功能

1. 用户管理
2. 角色管理
3. 菜单管理
4. 修改密码
5. 等等等等

## 关于后台

后台项目名为 `NIL-ADMIN-SERVER` [链接点我](https://github.com/zerotofull/nil-admin-server)

### 目录结构

```file
- public
- src
  - api 请求接口
  - assets 图片等静态文件
  - components 组件目录 可以不用
  - layout 这是一个统一的父页面(公有)
  - plugins 放一些插件 可以不用
  - router 路由文件
    - modules 子路由
  - store 一个仓库 可以储存全局变量
  - styles 样式文件夹
  - types 类型定义文件
  - utils 工具文件夹
  - views 视图文件夹 要写的页面都在这
  - main.ts 这很重要(入口配置文件)
  - setting.js 自定义配置文件()
- show 不用管
- index.html 这很重要
```

### 关于 `setting.js`

```js
export const APP_TITLE = "NIL 后台管理系统" // App的标题
export const ICON_PREFIX = "nilIcon" // 自定义的图标前缀(非全局)
export const BASE_API = "http://127.0.0.1:8080" // 请求 API
export const BASE_API_TIMEOUT = 5000 // 超时时间
```

### 展示

![后台展示](/show/show.gif)

## 下一步

我也不知道要做啥。

## 感谢

- [Element Plus](https://github.com/element-plus/element-plus) ，一套为开发者、设计师和产品经理准备的基于 Vue 3 的桌面端组件库
- [Pinia](https://pinia.esm.dev/) The Vue Store that you will enjoy using
- [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)
- 广大网友

...
