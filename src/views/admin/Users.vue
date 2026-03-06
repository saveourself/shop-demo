<template>
  <div class="admin-users-page">
    <div class="page-header">
      <h2 class="page-title">用户管理</h2>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar card">
      <el-form :inline="true">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="正常" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 用户列表 -->
    <div class="card">
      <el-table :data="users" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="用户信息" min-width="200">
          <template #default="{ row }">
            <div class="user-cell">
              <el-avatar :size="40" :src="row.avatar">{{ row.username.charAt(0) }}</el-avatar>
              <div class="user-info">
                <p class="username">{{ row.username }}</p>
                <p class="phone">{{ row.phone }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="orderCount" label="订单数" width="100" />
        <el-table-column prop="totalSpent" label="消费金额" width="120">
          <template #default="{ row }">
            <span class="text-danger">¥{{ row.totalSpent }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="viewUser(row)">查看</el-button>
            <el-button text type="danger" @click="disableUser(row)" v-if="row.status === 1">禁用</el-button>
            <el-button text type="success" @click="enableUser(row)" v-else>启用</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="10"
          :total="total"
          layout="total, prev, pager, next"
          background
        />
      </div>
    </div>

    <!-- 用户详情弹窗 -->
    <el-dialog v-model="detailVisible" title="用户详情" width="600px">
      <div v-if="currentUser" class="user-detail">
        <div class="detail-header">
          <el-avatar :size="80" :src="currentUser.avatar">{{ currentUser.username.charAt(0) }}</el-avatar>
          <div class="header-info">
            <h3>{{ currentUser.username }}</h3>
            <p>{{ currentUser.phone }}</p>
            <el-tag :type="currentUser.status === 1 ? 'success' : 'danger'">
              {{ currentUser.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </div>
        </div>
        <el-divider />
        <div class="detail-info">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="info-item">
                <span class="label">用户ID</span>
                <span class="value">{{ currentUser.id }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <span class="label">邮箱</span>
                <span class="value">{{ currentUser.email }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <span class="label">注册时间</span>
                <span class="value">{{ currentUser.createTime }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <span class="label">最后登录</span>
                <span class="value">{{ currentUser.lastLoginTime }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-divider />
        <div class="detail-stats">
          <h4>消费统计</h4>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="stat-card">
                <p class="stat-value">{{ currentUser.orderCount }}</p>
                <p class="stat-label">订单数</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-card">
                <p class="stat-value">¥{{ currentUser.totalSpent }}</p>
                <p class="stat-label">消费金额</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-card">
                <p class="stat-value">¥{{ currentUser.avgOrderValue }}</p>
                <p class="stat-label">客单价</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const currentPage = ref(1)
const total = ref(100)
const detailVisible = ref(false)
const currentUser = ref(null)

const searchForm = reactive({
  username: '',
  phone: '',
  status: ''
})

const users = ref([
  { id: 1, username: '张三', phone: '13800138001', email: 'zhangsan@example.com', avatar: '', orderCount: 12, totalSpent: '5,280', status: 1, createTime: '2024-01-01 10:00', lastLoginTime: '2024-01-15 09:30', avgOrderValue: '440' },
  { id: 2, username: '李四', phone: '13800138002', email: 'lisi@example.com', avatar: '', orderCount: 8, totalSpent: '3,150', status: 1, createTime: '2024-01-02 14:20', lastLoginTime: '2024-01-14 18:45', avgOrderValue: '394' },
  { id: 3, username: '王五', phone: '13800138003', email: 'wangwu@example.com', avatar: '', orderCount: 25, totalSpent: '12,600', status: 1, createTime: '2024-01-03 09:15', lastLoginTime: '2024-01-15 10:00', avgOrderValue: '504' },
  { id: 4, username: '赵六', phone: '13800138004', email: 'zhaoliu@example.com', avatar: '', orderCount: 5, totalSpent: '1,200', status: 0, createTime: '2024-01-04 16:30', lastLoginTime: '2024-01-10 11:20', avgOrderValue: '240' },
  { id: 5, username: '钱七', phone: '13800138005', email: 'qianqi@example.com', avatar: '', orderCount: 18, totalSpent: '8,900', status: 1, createTime: '2024-01-05 11:45', lastLoginTime: '2024-01-14 22:15', avgOrderValue: '494' }
])

function handleSearch() {
  console.log('Search:', searchForm)
}

function resetSearch() {
  searchForm.username = ''
  searchForm.phone = ''
  searchForm.status = ''
}

function handleStatusChange(user) {
  ElMessage.success(user.status === 1 ? '已启用' : '已禁用')
}

function viewUser(user) {
  currentUser.value = user
  detailVisible.value = true
}

function disableUser(user) {
  ElMessageBox.confirm('确定禁用该用户吗？').then(() => {
    user.status = 0
    ElMessage.success('已禁用')
  }).catch(() => {})
}

function enableUser(user) {
  user.status = 1
  ElMessage.success('已启用')
}
</script>

<style lang="scss" scoped>
.admin-users-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .search-bar {
    margin-bottom: 20px;
  }

  .user-cell {
    display: flex;
    align-items: center;
    gap: 10px;

    .user-info {
      .username {
        font-weight: 500;
        margin-bottom: 3px;
      }

      .phone {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .text-danger {
    color: #f56c6c;
    font-weight: 600;
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

  .user-detail {
    .detail-header {
      display: flex;
      align-items: center;
      gap: 20px;

      .header-info {
        h3 {
          font-size: 18px;
          margin-bottom: 5px;
        }

        p {
          color: #666;
          margin-bottom: 8px;
        }
      }
    }

    .detail-info {
      .info-item {
        margin-bottom: 15px;

        .label {
          display: block;
          font-size: 12px;
          color: #999;
          margin-bottom: 5px;
        }

        .value {
          font-size: 14px;
          color: #333;
        }
      }
    }

    .detail-stats {
      h4 {
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 15px;
      }

      .stat-card {
        text-align: center;
        padding: 20px;
        background: #f5f7fa;
        border-radius: 8px;

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #409EFF;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 13px;
          color: #666;
        }
      }
    }
  }
}
</style>