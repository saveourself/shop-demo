<template>
  <div class="product-list-page container">
    <div class="page-header">
      <h2 class="page-title">商品列表</h2>
    </div>

    <div class="page-content">
      <!-- 筛选侧边栏 -->
      <aside class="filter-sidebar">
        <div class="card">
          <h4>商品分类</h4>
          <div class="filter-list">
            <div
              v-for="cat in categories"
              :key="cat.id"
              class="filter-item"
              :class="{ active: selectedCategory === cat.id }"
              @click="selectCategory(cat.id)"
            >
              {{ cat.name }}
            </div>
          </div>
        </div>

        <div class="card mt-20">
          <h4>价格区间</h4>
          <div class="price-filter">
            <el-input v-model="priceMin" placeholder="最低价" size="small" />
            <span>-</span>
            <el-input v-model="priceMax" placeholder="最高价" size="small" />
          </div>
          <el-button type="primary" size="small" class="mt-10" @click="applyFilter">确定</el-button>
        </div>
      </aside>

      <!-- 商品列表 -->
      <main class="product-main">
        <!-- 排序栏 -->
        <div class="sort-bar card">
          <div class="sort-options">
            <span>排序：</span>
            <el-radio-group v-model="sortBy" size="small">
              <el-radio-button value="default">默认</el-radio-button>
              <el-radio-button value="price-asc">价格升序</el-radio-button>
              <el-radio-button value="price-desc">价格降序</el-radio-button>
              <el-radio-button value="sales">销量</el-radio-button>
            </el-radio-group>
          </div>
          <div class="result-count">
            共 <span>{{ products.length }}</span> 件商品
          </div>
        </div>

        <!-- 商品网格 -->
        <div class="product-grid">
          <div
            v-for="product in products"
            :key="product.id"
            class="product-card"
            @click="$router.push(`/product/${product.id}`)"
          >
            <div class="product-image">
              <img :src="product.image" :alt="product.name" />
              <span v-if="product.tag" class="tag" :class="product.tag.type">{{ product.tag.text }}</span>
            </div>
            <div class="product-info">
              <h4 class="product-name">{{ product.name }}</h4>
              <p class="product-desc">{{ product.desc }}</p>
              <div class="product-footer">
                <div class="product-price">
                  <span class="price">¥{{ product.price }}</span>
                  <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
                </div>
                <el-button type="primary" size="small" @click.stop="addToCart(product)">
                  加入购物车
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="12"
            :total="100"
            layout="prev, pager, next"
            background
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const cartStore = useCartStore()

const categories = ref([
  { id: 0, name: '全部' },
  { id: 1, name: '数码产品' },
  { id: 2, name: '服饰鞋包' },
  { id: 3, name: '家居生活' },
  { id: 4, name: '美妆个护' },
  { id: 5, name: '食品饮料' },
  { id: 6, name: '图书文具' }
])

const selectedCategory = ref(0)
const priceMin = ref('')
const priceMax = ref('')
const sortBy = ref('default')
const currentPage = ref(1)

// 模拟商品数据
const products = ref([
  { id: 1, name: '智能手机 Pro Max', desc: '最新旗舰芯片，拍照神器', price: 5999, originalPrice: 6999, image: 'https://picsum.photos/200/200?random=10', sales: 2345, tag: { text: '热销', type: 'hot' } },
  { id: 2, name: '超薄笔记本电脑', desc: '轻薄便携，性能强劲', price: 4999, image: 'https://picsum.photos/200/200?random=11', sales: 1234 },
  { id: 3, name: '无线降噪耳机', desc: '主动降噪，沉浸体验', price: 1299, originalPrice: 1599, image: 'https://picsum.photos/200/200?random=12', sales: 3456 },
  { id: 4, name: '智能手表 Ultra', desc: '运动健康，全能监测', price: 2999, image: 'https://picsum.photos/200/200?random=13', sales: 987, tag: { text: '新品', type: 'new' } },
  { id: 5, name: '机械键盘 RGB', desc: '青轴手感，炫彩背光', price: 459, image: 'https://picsum.photos/200/200?random=14', sales: 2345 },
  { id: 6, name: '电竞鼠标', desc: '高精度传感器，可编程按键', price: 299, image: 'https://picsum.photos/200/200?random=15', sales: 876 },
  { id: 7, name: '便携显示器', desc: '15.6寸 4K 分辨率', price: 1899, originalPrice: 2199, image: 'https://picsum.photos/200/200?random=16', sales: 432 },
  { id: 8, name: '移动固态硬盘', desc: '1TB 大容量，高速传输', price: 699, image: 'https://picsum.photos/200/200?random=17', sales: 1234, tag: { text: '促销', type: 'sale' } }
])

function selectCategory(id) {
  selectedCategory.value = id
}

function applyFilter() {
  // 应用价格筛选
  console.log('Filter by price:', priceMin.value, priceMax.value)
}

function addToCart(product) {
  cartStore.addItem(product)
  ElMessage.success('已添加到购物车')
}

onMounted(() => {
  if (route.query.category) {
    selectedCategory.value = parseInt(route.query.category)
  }
})
</script>

<style lang="scss" scoped>
.product-list-page {
  .page-content {
    display: flex;
    gap: 20px;
  }

  .filter-sidebar {
    width: 240px;
    flex-shrink: 0;

    h4 {
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 15px;
    }

    .filter-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .filter-item {
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: #f5f7fa;
      }

      &.active {
        background: #ecf5ff;
        color: #409EFF;
      }
    }

    .price-filter {
      display: flex;
      align-items: center;
      gap: 10px;

      .el-input {
        width: 80px;
      }
    }
  }

  .product-main {
    flex: 1;
  }

  .sort-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .result-count {
      color: #666;
      font-size: 14px;

      span {
        color: #409EFF;
      }
    }
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .product-card {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }

    .product-image {
      position: relative;
      height: 200px;
      background: #f5f5f5;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .tag {
        position: absolute;
        top: 10px;
        left: 10px;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        color: #fff;

        &.hot { background: #f56c6c; }
        &.new { background: #67c23a; }
        &.sale { background: #e6a23c; }
      }
    }

    .product-info {
      padding: 15px;
    }

    .product-name {
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .product-desc {
      font-size: 12px;
      color: #999;
      margin-bottom: 10px;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .product-price {
      .price {
        font-size: 18px;
        font-weight: 600;
        color: #f56c6c;
      }

      .original-price {
        font-size: 12px;
        color: #999;
        text-decoration: line-through;
        margin-left: 5px;
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
}
</style>