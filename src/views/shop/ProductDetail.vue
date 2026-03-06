<template>
  <div class="product-detail-page container">
    <div class="product-main">
      <!-- 商品图片 -->
      <div class="product-gallery">
        <div class="main-image">
          <img :src="currentImage" :alt="product.name" />
        </div>
        <div class="thumbnail-list">
          <div
            v-for="(img, index) in product.images"
            :key="index"
            class="thumbnail"
            :class="{ active: currentImageIndex === index }"
            @click="currentImageIndex = index"
          >
            <img :src="img" :alt="`图片${index + 1}`" />
          </div>
        </div>
      </div>

      <!-- 商品信息 -->
      <div class="product-info">
        <h1 class="product-name">{{ product.name }}</h1>
        <p class="product-desc">{{ product.desc }}</p>
        <div class="product-price-box">
          <span class="label">价格</span>
          <span class="price">¥{{ product.price }}</span>
          <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
        </div>

        <!-- 规格选择 -->
        <div class="spec-section">
          <div class="spec-item">
            <span class="label">颜色</span>
            <div class="spec-options">
              <span
                v-for="color in product.colors"
                :key="color"
                class="spec-option"
                :class="{ active: selectedColor === color }"
                @click="selectedColor = color"
              >
                {{ color }}
              </span>
            </div>
          </div>
          <div class="spec-item">
            <span class="label">规格</span>
            <div class="spec-options">
              <span
                v-for="spec in product.specs"
                :key="spec"
                class="spec-option"
                :class="{ active: selectedSpec === spec }"
                @click="selectedSpec = spec"
              >
                {{ spec }}
              </span>
            </div>
          </div>
        </div>

        <!-- 数量选择 -->
        <div class="quantity-section">
          <span class="label">数量</span>
          <el-input-number v-model="quantity" :min="1" :max="99" />
          <span class="stock">库存 {{ product.stock }} 件</span>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button type="primary" size="large" @click="buyNow">
            立即购买
          </el-button>
          <el-button size="large" @click="addToCart">
            加入购物车
          </el-button>
        </div>
      </div>
    </div>

    <!-- 商品详情 -->
    <div class="product-detail card mt-20">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="商品详情" name="detail">
          <div class="detail-content">
            <div v-for="(item, index) in product.details" :key="index" class="detail-section">
              <h3>{{ item.title }}</h3>
              <p>{{ item.content }}</p>
            </div>
            <div class="detail-images">
              <img v-for="(img, index) in product.detailImages" :key="index" :src="img" alt="详情图" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品评价" name="reviews">
          <div class="reviews-list">
            <div v-for="review in reviews" :key="review.id" class="review-item">
              <div class="review-header">
                <el-avatar :size="40">{{ review.user.charAt(0) }}</el-avatar>
                <div class="review-meta">
                  <span class="user">{{ review.user }}</span>
                  <el-rate v-model="review.rating" disabled />
                </div>
                <span class="date">{{ review.date }}</span>
              </div>
              <p class="review-content">{{ review.content }}</p>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const currentImageIndex = ref(0)
const selectedColor = ref('')
const selectedSpec = ref('')
const quantity = ref(1)
const activeTab = ref('detail')

// 商品数据
const product = ref({
  id: 1,
  name: '智能手机 Pro Max 旗舰版',
  desc: '最新旗舰处理器 | 1亿像素相机 | 超大电池容量',
  price: 5999,
  originalPrice: 6999,
  stock: 100,
  images: [
    'https://picsum.photos/400/400?random=20',
    'https://picsum.photos/400/400?random=21',
    'https://picsum.photos/400/400?random=22',
    'https://picsum.photos/400/400?random=23'
  ],
  colors: ['星空黑', '月光白', '海洋蓝', '玫瑰金'],
  specs: ['128GB', '256GB', '512GB'],
  details: [
    { title: '屏幕', content: '6.7英寸 AMOLED 显示屏，120Hz 刷新率' },
    { title: '处理器', content: '最新旗舰芯片，性能提升30%' },
    { title: '相机', content: '1亿像素主摄，支持8K视频录制' },
    { title: '电池', content: '5000mAh大电池，支持67W快充' }
  ],
  detailImages: [
    'https://picsum.photos/800/400?random=30',
    'https://picsum.photos/800/400?random=31'
  ]
})

// 当前图片
const currentImage = computed(() => product.value.images[currentImageIndex.value])

// 评价数据
const reviews = ref([
  { id: 1, user: '张***三', rating: 5, content: '手机很好用，拍照效果很棒，物流也很快！', date: '2024-01-15' },
  { id: 2, user: '李***', rating: 4, content: '整体满意，就是电池续航一般般。', date: '2024-01-10' },
  { id: 3, user: '王**', rating: 5, content: '外观设计很好看，性能强劲，推荐购买！', date: '2024-01-08' }
])

// 初始化默认选中
selectedColor.value = product.value.colors[0]
selectedSpec.value = product.value.specs[0]

function addToCart() {
  cartStore.addItem(product.value, quantity.value)
  ElMessage.success('已添加到购物车')
}

function buyNow() {
  addToCart()
  router.push('/cart')
}
</script>

<style lang="scss" scoped>
.product-detail-page {
  .product-main {
    display: flex;
    gap: 40px;
    background: #fff;
    border-radius: 8px;
    padding: 30px;
  }

  .product-gallery {
    width: 450px;
    flex-shrink: 0;

    .main-image {
      width: 100%;
      height: 450px;
      border-radius: 8px;
      overflow: hidden;
      background: #f5f5f5;
      margin-bottom: 15px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .thumbnail-list {
      display: flex;
      gap: 10px;

      .thumbnail {
        width: 80px;
        height: 80px;
        border: 2px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;

        &.active,
        &:hover {
          border-color: #409EFF;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }

  .product-info {
    flex: 1;

    .product-name {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 10px;
    }

    .product-desc {
      color: #666;
      margin-bottom: 20px;
    }

    .product-price-box {
      background: #f5f5f5;
      padding: 15px 20px;
      border-radius: 4px;
      margin-bottom: 25px;

      .label {
        color: #666;
        margin-right: 15px;
      }

      .price {
        font-size: 28px;
        font-weight: 600;
        color: #f56c6c;
      }

      .original-price {
        font-size: 14px;
        color: #999;
        text-decoration: line-through;
        margin-left: 10px;
      }
    }

    .spec-section {
      margin-bottom: 25px;
    }

    .spec-item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;

      .label {
        width: 50px;
        color: #666;
      }

      .spec-options {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .spec-option {
        padding: 8px 20px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          border-color: #409EFF;
        }

        &.active {
          border-color: #409EFF;
          background: #ecf5ff;
          color: #409EFF;
        }
      }
    }

    .quantity-section {
      display: flex;
      align-items: center;
      margin-bottom: 30px;

      .label {
        width: 50px;
        color: #666;
      }

      .stock {
        margin-left: 15px;
        color: #999;
        font-size: 13px;
      }
    }

    .action-buttons {
      display: flex;
      gap: 15px;

      .el-button {
        flex: 1;
        height: 50px;
        font-size: 16px;
      }
    }
  }

  .product-detail {
    .detail-content {
      padding: 20px 0;

      .detail-section {
        margin-bottom: 20px;

        h3 {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        p {
          color: #666;
          line-height: 1.6;
        }
      }

      .detail-images {
        margin-top: 30px;

        img {
          width: 100%;
          border-radius: 4px;
          margin-bottom: 15px;
        }
      }
    }

    .review-item {
      padding: 20px 0;
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }

      .review-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;

        .review-meta {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;

          .user {
            font-weight: 500;
          }
        }

        .date {
          color: #999;
          font-size: 13px;
        }
      }

      .review-content {
        color: #333;
        line-height: 1.6;
      }
    }
  }
}
</style>