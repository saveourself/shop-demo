<template>
  <div class="cart-page container">
    <h2 class="page-title">购物车</h2>

    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <el-empty description="购物车是空的">
        <el-button type="primary" @click="$router.push('/products')">去购物</el-button>
      </el-empty>
    </div>

    <div v-else class="cart-content">
      <div class="cart-list">
        <el-table :data="cartStore.items" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="商品信息" min-width="300">
            <template #default="{ row }">
              <div class="product-info">
                <img :src="row.image" :alt="row.name" class="product-image" />
                <div class="product-detail">
                  <h4>{{ row.name }}</h4>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="120">
            <template #default="{ row }">
              <span class="price">¥{{ row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" width="150">
            <template #default="{ row }">
              <el-input-number
                v-model="row.quantity"
                :min="1"
                :max="99"
                size="small"
                @change="updateQuantity(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="小计" width="120">
            <template #default="{ row }">
              <span class="subtotal">¥{{ (row.price * row.quantity).toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button type="danger" text @click="removeItem(row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="cart-footer card">
        <div class="footer-left">
          <el-checkbox v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
          <el-button text @click="clearCart">清空购物车</el-button>
        </div>
        <div class="footer-right">
          <div class="summary">
            <span>已选 <strong>{{ selectedItems.length }}</strong> 件商品</span>
            <span class="total">
              合计：<strong>¥{{ selectedTotalPrice.toFixed(2) }}</strong>
            </span>
          </div>
          <el-button type="primary" size="large" :disabled="selectedItems.length === 0" @click="checkout">
            结算
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cartStore = useCartStore()

const selectedItems = ref([])
const selectAll = ref(false)

function handleSelectionChange(selection) {
  selectedItems.value = selection
  selectAll.value = selection.length === cartStore.items.length
}

function handleSelectAll(val) {
  selectedItems.value = val ? [...cartStore.items] : []
}

function updateQuantity(item) {
  cartStore.updateQuantity(item.id, item.quantity)
}

function removeItem(id) {
  cartStore.removeItem(id)
  ElMessage.success('已删除')
}

function clearCart() {
  cartStore.clearCart()
  ElMessage.success('购物车已清空')
}

const selectedTotalPrice = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

function checkout() {
  router.push('/orders')
}
</script>

<style lang="scss" scoped>
.cart-page {
  .empty-cart {
    background: #fff;
    border-radius: 8px;
    padding: 60px 0;
  }

  .cart-content {
    .cart-list {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
    }

    .product-info {
      display: flex;
      align-items: center;
      gap: 15px;

      .product-image {
        width: 80px;
        height: 80px;
        border-radius: 4px;
        object-fit: cover;
      }

      .product-detail {
        h4 {
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    .price {
      color: #666;
    }

    .subtotal {
      color: #f56c6c;
      font-weight: 600;
    }

    .cart-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding: 15px 20px;

      .footer-left {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .footer-right {
        display: flex;
        align-items: center;
        gap: 30px;

        .summary {
          span {
            color: #666;
            margin-right: 15px;

            strong {
              color: #f56c6c;
            }
          }

          .total {
            strong {
              font-size: 24px;
            }
          }
        }
      }
    }
  }
}
</style>