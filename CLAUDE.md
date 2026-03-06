# 商城系统 (shop-demo)

## 项目概述

基于 Vue3 + Element Plus 构建的现代化商城系统，包含前台商城和后台管理系统。

## 技术栈

- **框架**: Vue 3.5+ (Composition API)
- **构建工具**: Vite 7.x
- **UI 组件库**: Element Plus 2.x
- **状态管理**: Pinia 3.x
- **路由**: Vue Router 4.x
- **HTTP 客户端**: Axios
- **样式预处理**: SCSS

## 项目结构

```
shop-demo/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   │   ├── modules/       # 接口模块 (product, user, order)
│   │   └── request.js     # Axios 封装
│   ├── assets/            # 静态资源
│   │   ├── images/        # 图片
│   │   └── styles/        # 全局样式
│   ├── components/        # 公共组件
│   │   └── common/        # 通用组件
│   ├── composables/       # 组合式函数
│   ├── layouts/           # 布局组件
│   │   ├── ShopLayout.vue # 前台布局
│   │   └── AdminLayout.vue# 后台布局
│   ├── router/            # 路由配置
│   ├── stores/            # Pinia 状态
│   │   ├── user.js        # 用户状态
│   │   └── cart.js        # 购物车状态
│   ├── utils/             # 工具函数
│   └── views/             # 页面组件
│       ├── admin/         # 后台页面
│       └── shop/          # 前台页面
├── .env                   # 环境变量
├── index.html
├── package.json
├── vite.config.js
└── plan.md                # 开发计划
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

## 功能模块

### 前台商城 (`/`)

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 首页，展示轮播图、分类、热门商品 |
| `/products` | ProductList | 商品列表，支持筛选、排序、分页 |
| `/product/:id` | ProductDetail | 商品详情，规格选择、加购物车 |
| `/cart` | Cart | 购物车，商品管理、结算 |
| `/orders` | Orders | 订单列表，订单状态管理 |
| `/profile` | Profile | 个人中心，信息管理、收货地址 |

### 后台管理 (`/admin`)

| 路由 | 页面 | 说明 |
|------|------|------|
| `/admin` | Dashboard | 仪表盘，数据统计 |
| `/admin/products` | Products | 商品管理，CRUD 操作 |
| `/admin/categories` | Categories | 分类管理，树形结构 |
| `/admin/orders` | Orders | 订单管理，发货、取消 |
| `/admin/users` | Users | 用户管理，禁用/启用 |

## 代码规范

### 命名规范

- **组件名**: PascalCase (如 `ProductCard`)
- **文件名**: kebab-case (如 `product-list.vue`)
- **变量/函数**: camelCase
- **常量**: UPPER_SNAKE_CASE
- **CSS 类名**: BEM 规范或语义化命名

### Vue 组件结构

```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup>
// 1. 导入
// 2. Props/Emits 定义
// 3. 响应式状态
// 4. 计算属性
// 5. 方法
// 6. 生命周期钩子
</script>

<style scoped lang="scss">
/* 组件样式 */
</style>
```

### API 接口规范

```javascript
// api/modules/example.js
import request from '../request'

export function getList(params) {
  return request.get('/list', { params })
}

export function getById(id) {
  return request.get(`/detail/${id}`)
}

export function create(data) {
  return request.post('/create', data)
}

export function update(id, data) {
  return request.put(`/update/${id}`, data)
}

export function remove(id) {
  return request.delete(`/delete/${id}`)
}
```

### 状态管理规范

```javascript
// stores/example.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExampleStore = defineStore('example', () => {
  // 状态
  const state = ref(initialValue)

  // 计算属性
  const getter = computed(() => state.value * 2)

  // 方法
  function action() {
    state.value++
  }

  return { state, getter, action }
})
```

## 开发指南

### 添加新页面

1. 在 `src/views/` 对应目录下创建 Vue 组件
2. 在 `src/router/index.js` 添加路由配置
3. 根据需要添加 API 接口

### 添加新 API

1. 在 `src/api/modules/` 创建或修改对应模块文件
2. 导出 API 函数
3. 在组件中引入使用

### 样式开发

- 全局样式位于 `src/assets/styles/main.scss`
- 组件使用 scoped 样式
- 使用 SCSS 预处理器
- 遵循 Element Plus 设计规范

## 注意事项

1. **API 请求**: 当前使用模拟数据，实际项目需配置后端 API
2. **用户认证**: 登录功能为模拟实现，需接入实际认证系统
3. **图片资源**: 使用 picsum.photos 占位图，实际项目替换为真实图片
4. **环境变量**: 通过 `.env` 文件配置，`VITE_` 前缀变量可在代码中访问

## Git 提交规范

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具变动