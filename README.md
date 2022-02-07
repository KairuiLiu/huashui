# vite-vue3-ts-template

#### 介绍

vite 项目开发模板，集成

- pnpm
- axios
- vuex
- vue-router
- eslint
- prettier
- husky
- commitlint
- less

#### 安装教程

```shell
# 安装pnpm
npm install -g pnpm

# 更新包
pnpm update

# 安装全部依赖
pnpm install

# 安装某个依赖
pnpm install xxx  -D/-S

# 运行
pnpm dev

# 打包
pnpm build
```

#### commit 提交规范

type(scope): desc，注意:后有一个空格

type 列表：

- feat：新功能
- update：更新某功能
- fix：修补某功能的 bug
- refactor：重构某个功能
- optimize: 优化构建工具或运行时性能
- style：仅样式改动
- docs：仅文档新增/改动
- chore：构建过程或辅助工具的变动

#### 结构树

```bash
├── src
│   ├── App.vue  // 根组件
│   ├── api  // 请求api
│   │   ├── ajax.ts  // 二次封装axios
│   │   ├── index.ts  // 统一导出api模块
│   │   └── modules  // api模块
│   │       └── common.ts
│   ├── assets  // 静态资源
│   │   ├── logo.png
│   │   └── styles  // 样式资源
│   │       └── main.scss
│   ├── components  // 子组件
│   │   └── HelloWorld.vue
│   ├── configs  // 项目配置
│   │   └── index.ts
│   ├── env.d.ts
│   ├── main.ts // 入口文件
│   ├── pages  // 页面组件
│   ├── router  // 路由
│   │   └── index.ts
│   ├── store  // 状态管理
│   │   ├── actions.ts // vuex actions
│   │   ├── getters.ts // vuex getters
│   │   ├── index.ts // 入口文件
│   │   ├── modules.ts
│   │   ├── mutations.ts // vuex mutations
│   │   ├── mutationsType.ts // mutations类型定义
│   │   └── state.ts // vuex state
│   ├── types  // 类型文件
│   │   └── common.d.ts
│   └── utils  // 工具类
└── vite.config.ts  // vite配置
```

#### 配置参考

[Merlin218/vite-template-vue3-typescript](https://github.com/Merlin218/vite-template-vue3-typescript)
