# 商城系统开发计划

## 一、项目概述
一个基于 Vue3 的现代化商城系统，包含前台商城和后台管理系统。

## 二、技术栈选型

### 前端技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.4.x | 核心框架 |
| Vite | ^5.x | 构建工具 |
| Pinia | ^2.x | 状态管理 |
| Vue Router | ^4.x | 路由管理 |
| Element Plus | ^2.x | UI 组件库 |
| Axios | ^1.x | HTTP 请求 |
| VueUse | ^10.x | 组合式 API 工具集 |

### 辅助工具
| 技术 | 用途 |
|------|------|
| SCSS | 样式预处理 |
| unplugin-auto-import | 自动导入 API |
| unplugin-vue-components | 组件自动注册 |

## 三、功能模块规划

### 前台商城
1. **用户模块**
   - 用户注册/登录
   - 个人信息管理
   - 收货地址管理

2. **商品模块**
   - 商品列表展示
   - 商品分类筛选
   - 商品搜索
   - 商品详情页

3. **购物车模块**
   - 添加/删除商品
   - 修改商品数量
   - 批量操作

4. **订单模块**
   - 订单创建
   - 订单列表
   - 订单详情
   - 订单状态管理

### 后台管理系统
1. **仪表盘** - 数据概览
2. **商品管理** - CRUD 操作
3. **分类管理** - 分类维护
4. **订单管理** - 订单处理
5. **用户管理** - 用户维护

## 四、项目目录结构

```
shop-demo/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   │   ├── modules/       # 接口模块
│   │   └── request.js     # Axios 封装
│   ├── assets/            # 静态资源
│   │   ├── images/
│   │   └── styles/
│   ├── components/        # 公共组件
│   │   └── common/
│   ├── composables/       # 组合式函数
│   ├── layouts/           # 布局组件
│   ├── router/            # 路由配置
│   ├── stores/            # Pinia 状态
│   ├── utils/             # 工具函数
│   └── views/             # 页面组件
│       ├── admin/         # 后台页面
│       └── shop/          # 前台页面
├── .env                   # 环境变量
├── index.html
├── package.json
├── vite.config.js
└── CLAUDE.md              # 项目规范文档
```

## 五、开发阶段划分

### 第一阶段：项目初始化
- [x] 创建项目文件夹
- [ ] 初始化 Vite + Vue3 项目
- [ ] 配置 Element Plus
- [ ] 配置路由
- [ ] 配置状态管理
- [ ] 配置 Axios

### 第二阶段：基础架构搭建
- [ ] 创建布局组件
- [ ] 创建公共组件
- [ ] 封装 API 请求
- [ ] 创建工具函数

### 第三阶段：前台商城开发
- [ ] 首页开发
- [ ] 商品列表页
- [ ] 商品详情页
- [ ] 购物车功能
- [ ] 订单流程

### 第四阶段：后台管理开发
- [ ] 管理后台布局
- [ ] 商品管理
- [ ] 分类管理
- [ ] 订单管理
- [ ] 用户管理

## 六、UI 设计规范

### 颜色规范
- 主色调: `#409EFF` (Element Plus 默认蓝)
- 成功色: `#67C23A`
- 警告色: `#E6A23C`
- 危险色: `#F56C6C`

### 命名规范
- 组件名: PascalCase (如 `ProductCard`)
- 文件名: kebab-case (如 `product-list.vue`)
- 变量/函数: camelCase
- 常量: UPPER_SNAKE_CASE
- CSS 类名: BEM 规范

## 七、代码规范

### Vue 组件结构
```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup>
// 1. 导入
// 2. Props/Emits
// 3. 响应式状态
// 4. 计算属性
// 5. 方法
// 6. 生命周期
</script>

<style scoped lang="scss">
/* 样式 */
</style>
```

### Git 提交规范
- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试相关