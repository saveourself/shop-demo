<template>
  <div class="shop-layout">
    <!-- 顶部导航 -->
    <header class="shop-header">
      <div class="container header-content">
        <div class="logo" @click="$router.push('/')">
          <el-icon :size="28"><Shop /></el-icon>
          <span>商城系统</span>
        </div>
        <nav class="nav-menu">
          <router-link to="/">首页</router-link>
          <router-link to="/products">商品</router-link>
        </nav>
        <div class="header-right">
          <el-badge :value="cartStore.totalCount" :hidden="cartStore.totalCount === 0">
            <el-button text @click="$router.push('/cart')">
              <el-icon :size="20"><ShoppingCart /></el-icon>
            </el-button>
          </el-badge>
          <template v-if="userStore.isLoggedIn">
            <el-dropdown>
              <span class="user-dropdown">
                <el-avatar :size="32" icon="UserFilled" />
                <span class="username">{{ userStore.userInfo?.username || '用户' }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="$router.push('/profile')">个人中心</el-dropdown-item>
                  <el-dropdown-item @click="$router.push('/orders')">我的订单</el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" @click="showLoginDialog = true">登录</el-button>
          </template>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="shop-main">
      <router-view />
    </main>

    <!-- 底部 -->
    <footer class="shop-footer">
      <div class="container">
        <p>&copy; 2024 商城系统 - Vue3 Demo</p>
      </div>
    </footer>

    <!-- 登录弹窗 -->
    <el-dialog v-model="showLoginDialog" title="登录" width="400px">
      <el-form :model="loginForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showLoginDialog = false">取消</el-button>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'

const userStore = useUserStore()
const cartStore = useCartStore()

const showLoginDialog = ref(false)
const loginForm = reactive({
  username: '',
  password: ''
})

function handleLogin() {
  // 模拟登录
  userStore.login({
    token: 'mock-token-' + Date.now(),
    userInfo: {
      id: 1,
      username: loginForm.username || 'demo',
      avatar: '',
      phone: '13800138000'
    }
  })
  showLoginDialog.value = false
  ElMessage.success('登录成功')
}

function handleLogout() {
  userStore.logout()
  cartStore.clearCart()
  ElMessage.success('已退出登录')
}
</script>

<style lang="scss" scoped>
.shop-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.shop-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;

  .header-content {
    display: flex;
    align-items: center;
    height: 60px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    font-weight: 600;
    color: #409EFF;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  .nav-menu {
    flex: 1;
    display: flex;
    gap: 30px;
    margin-left: 50px;

    a {
      color: #333;
      font-size: 15px;
      transition: color 0.3s;

      &:hover,
      &.router-link-active {
        color: #409EFF;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .user-dropdown {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    .username {
      font-size: 14px;
    }
  }
}

.shop-main {
  flex: 1;
  padding: 20px 0;
}

.shop-footer {
  background: #fff;
  padding: 20px 0;
  text-align: center;
  color: #999;
  border-top: 1px solid #eee;
}
</style>