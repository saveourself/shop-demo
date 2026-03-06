<template>
  <div class="orders-page container">
    <h2 class="page-title">我的订单</h2>

    <!-- 订单筛选 -->
    <div class="order-tabs card">
      <el-tabs v-model="activeStatus">
        <el-tab-pane label="全部订单" name="all" />
        <el-tab-pane label="待付款" name="pending" />
        <el-tab-pane label="待发货" name="paid" />
        <el-tab-pane label="待收货" name="shipped" />
        <el-tab-pane label="已完成" name="completed" />
      </el-tabs>
    </div>

    <!-- 订单列表 -->
    <div class="order-list">
      <div v-for="order in filteredOrders" :key="order.id" class="order-item card">
        <div class="order-header">
          <div class="order-info">
            <span class="order-no">订单号：{{ order.orderNo }}</span>
            <span class="order-date">{{ order.date }}</span>
          </div>
          <el-tag :type="getStatusType(order.status)">{{ getStatusText(order.status) }}</el-tag>
        </div>
        <div class="order-products">
          <div v-for="item in order.items" :key="item.id" class="product-item">
            <img :src="item.image" :alt="item.name" class="product-image" />
            <div class="product-info">
              <h4>{{ item.name }}</h4>
              <p class="price">¥{{ item.price }} × {{ item.quantity }}</p>
            </div>
          </div>
        </div>
        <div class="order-footer">
          <div class="order-total">
            共 {{ order.items.length }} 件商品，实付：<span class="amount">¥{{ order.total }}</span>
          </div>
          <div class="order-actions">
            <el-button v-if="order.status === 'pending'" type="primary" @click="payOrder(order.id)">
              立即付款
            </el-button>
            <el-button v-if="order.status === 'pending'" @click="cancelOrder(order.id)">
              取消订单
            </el-button>
            <el-button v-if="order.status === 'shipped'" type="primary" @click="confirmReceive(order.id)">
              确认收货
            </el-button>
            <el-button v-if="order.status === 'completed'" @click="viewDetail(order.id)">
              查看详情
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <el-empty v-if="filteredOrders.length === 0" description="暂无订单" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeStatus = ref('all')

// 模拟订单数据
const orders = ref([
  {
    id: 1,
    orderNo: '202401150001',
    date: '2024-01-15 10:30:00',
    status: 'pending',
    items: [
      { id: 1, name: '智能手机 Pro Max', price: 5999, quantity: 1, image: 'https://picsum.photos/100/100?random=40' }
    ],
    total: '5999.00'
  },
  {
    id: 2,
    orderNo: '202401140002',
    date: '2024-01-14 15:20:00',
    status: 'shipped',
    items: [
      { id: 2, name: '无线蓝牙耳机', price: 599, quantity: 2, image: 'https://picsum.photos/100/100?random=41' },
      { id: 3, name: '手机壳', price: 49, quantity: 1, image: 'https://picsum.photos/100/100?random=42' }
    ],
    total: '1247.00'
  },
  {
    id: 3,
    orderNo: '202401100003',
    date: '2024-01-10 09:15:00',
    status: 'completed',
    items: [
      { id: 4, name: '机械键盘', price: 399, quantity: 1, image: 'https://picsum.photos/100/100?random=43' }
    ],
    total: '399.00'
  }
])

const filteredOrders = computed(() => {
  if (activeStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === activeStatus.value)
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

function payOrder(id) {
  ElMessage.success('支付成功')
  const order = orders.value.find(o => o.id === id)
  if (order) {
    order.status = 'paid'
  }
}

function cancelOrder(id) {
  ElMessage.confirm('确定取消订单吗？').then(() => {
    const order = orders.value.find(o => o.id === id)
    if (order) {
      order.status = 'cancelled'
    }
    ElMessage.success('订单已取消')
  }).catch(() => {})
}

function confirmReceive(id) {
  ElMessage.success('已确认收货')
  const order = orders.value.find(o => o.id === id)
  if (order) {
    order.status = 'completed'
  }
}

function viewDetail(id) {
  console.log('View order detail:', id)
}
</script>

<style lang="scss" scoped>
.orders-page {
  .order-tabs {
    margin-bottom: 20px;
    padding: 0 20px;

    :deep(.el-tabs__header) {
      margin-bottom: 0;
    }
  }

  .order-item {
    margin-bottom: 15px;
    padding: 20px;

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;

      .order-info {
        .order-no {
          font-weight: 500;
          margin-right: 20px;
        }

        .order-date {
          color: #999;
          font-size: 13px;
        }
      }
    }

    .order-products {
      padding: 15px 0;

      .product-item {
        display: flex;
        gap: 15px;
        margin-bottom: 10px;

        &:last-child {
          margin-bottom: 0;
        }

        .product-image {
          width: 60px;
          height: 60px;
          border-radius: 4px;
          object-fit: cover;
        }

        .product-info {
          flex: 1;

          h4 {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 5px;
          }

          .price {
            color: #666;
            font-size: 13px;
          }
        }
      }
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 15px;
      border-top: 1px solid #eee;

      .order-total {
        color: #666;

        .amount {
          font-size: 18px;
          font-weight: 600;
          color: #f56c6c;
        }
      }

      .order-actions {
        display: flex;
        gap: 10px;
      }
    }
  }
}
</style>