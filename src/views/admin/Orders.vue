<template>
  <div class="admin-orders-page">
    <div class="page-header">
      <h2 class="page-title">订单管理</h2>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar card">
      <el-form :inline="true">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待付款" value="pending" />
            <el-option label="待发货" value="paid" />
            <el-option label="待收货" value="shipped" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 订单状态统计 -->
    <el-row :gutter="20" class="status-stats">
      <el-col :span="4">
        <div class="stat-item" :class="{ active: activeStatus === '' }" @click="filterByStatus('')">
          <p class="stat-value">{{ statusCounts.all }}</p>
          <p class="stat-label">全部订单</p>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="stat-item" :class="{ active: activeStatus === 'pending' }" @click="filterByStatus('pending')">
          <p class="stat-value">{{ statusCounts.pending }}</p>
          <p class="stat-label">待付款</p>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="stat-item" :class="{ active: activeStatus === 'paid' }" @click="filterByStatus('paid')">
          <p class="stat-value">{{ statusCounts.paid }}</p>
          <p class="stat-label">待发货</p>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="stat-item" :class="{ active: activeStatus === 'shipped' }" @click="filterByStatus('shipped')">
          <p class="stat-value">{{ statusCounts.shipped }}</p>
          <p class="stat-label">待收货</p>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="stat-item" :class="{ active: activeStatus === 'completed' }" @click="filterByStatus('completed')">
          <p class="stat-value">{{ statusCounts.completed }}</p>
          <p class="stat-label">已完成</p>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="stat-item" :class="{ active: activeStatus === 'cancelled' }" @click="filterByStatus('cancelled')">
          <p class="stat-value">{{ statusCounts.cancelled }}</p>
          <p class="stat-label">已取消</p>
        </div>
      </el-col>
    </el-row>

    <!-- 订单列表 -->
    <div class="card">
      <el-table :data="filteredOrders" stripe>
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="user" label="用户" width="120" />
        <el-table-column label="商品信息" min-width="200">
          <template #default="{ row }">
            <div v-for="item in row.items" :key="item.id" class="order-product">
              <span>{{ item.name }}</span>
              <span class="text-muted">×{{ item.quantity }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="订单金额" width="120">
          <template #default="{ row }">
            <span class="text-danger">¥{{ row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="viewOrder(row)">查看</el-button>
            <el-button v-if="row.status === 'paid'" text type="primary" @click="shipOrder(row)">发货</el-button>
            <el-button v-if="row.status === 'pending'" text type="danger" @click="cancelOrder(row)">取消</el-button>
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

    <!-- 订单详情弹窗 -->
    <el-dialog v-model="detailVisible" title="订单详情" width="600px">
      <div v-if="currentOrder" class="order-detail">
        <div class="detail-section">
          <h4>订单信息</h4>
          <p><span>订单号：</span>{{ currentOrder.orderNo }}</p>
          <p><span>下单时间：</span>{{ currentOrder.createTime }}</p>
          <p><span>订单状态：</span><el-tag :type="getStatusType(currentOrder.status)">{{ getStatusText(currentOrder.status) }}</el-tag></p>
        </div>
        <div class="detail-section">
          <h4>收货信息</h4>
          <p><span>收货人：</span>{{ currentOrder.address.name }}</p>
          <p><span>联系电话：</span>{{ currentOrder.address.phone }}</p>
          <p><span>收货地址：</span>{{ currentOrder.address.detail }}</p>
        </div>
        <div class="detail-section">
          <h4>商品信息</h4>
          <div v-for="item in currentOrder.items" :key="item.id" class="detail-product">
            <img :src="item.image" :alt="item.name" class="product-img" />
            <div class="product-info">
              <p class="name">{{ item.name }}</p>
              <p class="price">¥{{ item.price }} × {{ item.quantity }}</p>
            </div>
          </div>
        </div>
        <div class="detail-total">
          <span>订单总额：</span>
          <strong>¥{{ currentOrder.total }}</strong>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const currentPage = ref(1)
const total = ref(50)
const activeStatus = ref('')
const detailVisible = ref(false)
const currentOrder = ref(null)

const searchForm = reactive({
  orderNo: '',
  status: '',
  dateRange: null
})

const statusCounts = {
  all: 156,
  pending: 23,
  paid: 45,
  shipped: 38,
  completed: 42,
  cancelled: 8
}

const orders = ref([
  {
    id: 1,
    orderNo: '202401150001',
    user: '张三',
    items: [{ id: 1, name: '智能手机 Pro Max', price: 5999, quantity: 1, image: 'https://picsum.photos/60/60?random=50' }],
    total: '5999.00',
    status: 'pending',
    createTime: '2024-01-15 10:30:00',
    address: { name: '张三', phone: '13800138000', detail: '北京市朝阳区某某街道某某小区1号楼101室' }
  },
  {
    id: 2,
    orderNo: '202401150002',
    user: '李四',
    items: [
      { id: 2, name: '无线蓝牙耳机', price: 599, quantity: 2, image: 'https://picsum.photos/60/60?random=51' },
      { id: 3, name: '手机壳', price: 49, quantity: 1, image: 'https://picsum.photos/60/60?random=52' }
    ],
    total: '1247.00',
    status: 'paid',
    createTime: '2024-01-14 15:20:00',
    address: { name: '李四', phone: '13900139000', detail: '上海市浦东新区某某路某某号' }
  },
  {
    id: 3,
    orderNo: '202401140003',
    user: '王五',
    items: [{ id: 4, name: '机械键盘 RGB', price: 459, quantity: 1, image: 'https://picsum.photos/60/60?random=53' }],
    total: '459.00',
    status: 'shipped',
    createTime: '2024-01-13 09:15:00',
    address: { name: '王五', phone: '13700137000', detail: '广州市天河区某某大道' }
  },
  {
    id: 4,
    orderNo: '202401140004',
    user: '赵六',
    items: [{ id: 5, name: '便携充电宝', price: 129, quantity: 1, image: 'https://picsum.photos/60/60?random=54' }],
    total: '129.00',
    status: 'completed',
    createTime: '2024-01-12 14:30:00',
    address: { name: '赵六', phone: '13600136000', detail: '深圳市南山区某某科技园' }
  },
  {
    id: 5,
    orderNo: '202401140005',
    user: '钱七',
    items: [{ id: 6, name: '电竞鼠标', price: 299, quantity: 1, image: 'https://picsum.photos/60/60?random=55' }],
    total: '299.00',
    status: 'cancelled',
    createTime: '2024-01-11 16:45:00',
    address: { name: '钱七', phone: '13500135000', detail: '杭州市西湖区某某路' }
  }
])

const filteredOrders = computed(() => {
  if (!activeStatus.value) return orders.value
  return orders.value.filter(o => o.status === activeStatus.value)
})

function getStatusType(status) {
  const types = {
    pending: 'warning',
    paid: 'info',
    shipped: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return types[status] || 'info'
}

function getStatusText(status) {
  const texts = {
    pending: '待付款',
    paid: '待发货',
    shipped: '待收货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return texts[status] || status
}

function handleSearch() {
  console.log('Search:', searchForm)
}

function resetSearch() {
  searchForm.orderNo = ''
  searchForm.status = ''
  searchForm.dateRange = null
}

function filterByStatus(status) {
  activeStatus.value = status
}

function viewOrder(order) {
  currentOrder.value = order
  detailVisible.value = true
}

function shipOrder(order) {
  ElMessageBox.confirm('确定发货吗？').then(() => {
    order.status = 'shipped'
    ElMessage.success('已发货')
  }).catch(() => {})
}

function cancelOrder(order) {
  ElMessageBox.confirm('确定取消该订单吗？').then(() => {
    order.status = 'cancelled'
    ElMessage.success('订单已取消')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.admin-orders-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .search-bar {
    margin-bottom: 20px;
  }

  .status-stats {
    margin-bottom: 20px;

    .stat-item {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      border: 2px solid transparent;

      &:hover {
        border-color: #409EFF;
      }

      &.active {
        border-color: #409EFF;
        background: #ecf5ff;
      }

      .stat-value {
        font-size: 24px;
        font-weight: 600;
        color: #333;
        margin-bottom: 5px;
      }

      .stat-label {
        font-size: 14px;
        color: #666;
      }
    }
  }

  .order-product {
    margin-bottom: 5px;
    font-size: 13px;

    .text-muted {
      color: #999;
      margin-left: 5px;
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

  .order-detail {
    .detail-section {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;

      h4 {
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 10px;
      }

      p {
        margin-bottom: 8px;
        font-size: 14px;

        span {
          color: #666;
          margin-right: 10px;
        }
      }
    }

    .detail-product {
      display: flex;
      gap: 15px;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;

      .product-img {
        width: 60px;
        height: 60px;
        border-radius: 4px;
        object-fit: cover;
      }

      .product-info {
        flex: 1;

        .name {
          font-weight: 500;
          margin-bottom: 5px;
        }

        .price {
          color: #f56c6c;
        }
      }
    }

    .detail-total {
      text-align: right;
      font-size: 16px;

      strong {
        font-size: 24px;
        color: #f56c6c;
      }
    }
  }
}
</style>