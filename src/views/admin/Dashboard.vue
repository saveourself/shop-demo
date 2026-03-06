<template>
  <div class="dashboard-page">
    <h2 class="page-title">仪表盘</h2>

    <!-- 数据统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6">
        <div class="stat-card card">
          <div class="stat-icon" style="background: #409EFF;">
            <el-icon :size="30"><Goods /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ stats.totalProducts }}</p>
            <p class="stat-label">商品总数</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card card">
          <div class="stat-icon" style="background: #67C23A;">
            <el-icon :size="30"><Document /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ stats.totalOrders }}</p>
            <p class="stat-label">订单总数</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card card">
          <div class="stat-icon" style="background: #E6A23C;">
            <el-icon :size="30"><User /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ stats.totalUsers }}</p>
            <p class="stat-label">用户总数</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card card">
          <div class="stat-icon" style="background: #F56C6C;">
            <el-icon :size="30"><Money /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-value">¥{{ stats.totalRevenue }}</p>
            <p class="stat-label">总销售额</p>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- 最新订单 -->
      <el-col :span="16">
        <div class="card">
          <div class="card-header">
            <h3>最新订单</h3>
            <el-button text @click="$router.push('/admin/orders')">查看全部</el-button>
          </div>
          <el-table :data="recentOrders" stripe>
            <el-table-column prop="orderNo" label="订单号" width="180" />
            <el-table-column prop="user" label="用户" width="120" />
            <el-table-column prop="product" label="商品" />
            <el-table-column prop="amount" label="金额" width="100">
              <template #default="{ row }">
                <span class="text-danger">¥{{ row.amount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" size="small">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="下单时间" width="180" />
          </el-table>
        </div>
      </el-col>

      <!-- 热销商品 -->
      <el-col :span="8">
        <div class="card">
          <div class="card-header">
            <h3>热销商品</h3>
          </div>
          <div class="hot-products">
            <div v-for="(item, index) in hotProducts" :key="item.id" class="hot-item">
              <span class="rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
              <div class="hot-info">
                <p class="hot-name">{{ item.name }}</p>
                <p class="hot-sales">销量：{{ item.sales }}</p>
              </div>
              <span class="hot-price">¥{{ item.price }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const stats = reactive({
  totalProducts: 128,
  totalOrders: 1560,
  totalUsers: 892,
  totalRevenue: '328,560'
})

const recentOrders = ref([
  { orderNo: '202401150001', user: '张三', product: '智能手机 Pro Max', amount: '5999', status: 'paid', date: '2024-01-15 10:30' },
  { orderNo: '202401150002', user: '李四', product: '无线蓝牙耳机', amount: '599', status: 'shipped', date: '2024-01-15 09:20' },
  { orderNo: '202401140003', user: '王五', product: '机械键盘 RGB', amount: '459', status: 'completed', date: '2024-01-14 18:45' },
  { orderNo: '202401140004', user: '赵六', product: '便携充电宝', amount: '129', status: 'pending', date: '2024-01-14 15:30' },
  { orderNo: '202401140005', user: '钱七', product: '电竞鼠标', amount: '299', status: 'paid', date: '2024-01-14 12:15' }
])

const hotProducts = ref([
  { id: 1, name: '智能手机 Pro Max', sales: 2345, price: 5999 },
  { id: 2, name: '无线蓝牙耳机', sales: 1876, price: 599 },
  { id: 3, name: '机械键盘 RGB', sales: 1543, price: 459 },
  { id: 4, name: '智能手表 Ultra', sales: 1234, price: 2999 },
  { id: 5, name: '便携充电宝', sales: 987, price: 129 }
])

function getStatusType(status) {
  const types = {
    pending: 'warning',
    paid: 'info',
    shipped: 'primary',
    completed: 'success'
  }
  return types[status] || 'info'
}

function getStatusText(status) {
  const texts = {
    pending: '待付款',
    paid: '待发货',
    shipped: '待收货',
    completed: '已完成'
  }
  return texts[status] || status
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  .stat-row {
    margin-bottom: 20px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 25px;

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }

    .stat-info {
      .stat-value {
        font-size: 28px;
        font-weight: 600;
        color: #333;
        margin-bottom: 5px;
      }

      .stat-label {
        font-size: 14px;
        color: #999;
      }
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    h3 {
      font-size: 16px;
      font-weight: 500;
    }
  }

  .text-danger {
    color: #f56c6c;
    font-weight: 600;
  }

  .hot-products {
    .hot-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .rank {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #999;
        margin-right: 10px;

        &.top {
          background: #409EFF;
          color: #fff;
        }
      }

      .hot-info {
        flex: 1;

        .hot-name {
          font-size: 14px;
          margin-bottom: 3px;
        }

        .hot-sales {
          font-size: 12px;
          color: #999;
        }
      }

      .hot-price {
        font-size: 14px;
        font-weight: 500;
        color: #f56c6c;
      }
    }
  }
}
</style>