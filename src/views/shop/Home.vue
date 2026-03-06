<template>
  <div class="home-page">
    <!-- 轮播图 -->
    <div class="banner-section">
      <el-carousel height="400px">
        <el-carousel-item v-for="item in banners" :key="item.id">
          <div class="banner-item">
            <img :src="item.image" :alt="item.title" />
            <div class="banner-content">
              <h2>{{ item.title }}</h2>
              <p>{{ item.desc }}</p>
              <el-button type="primary" size="large" @click="$router.push('/products')">
                立即选购
              </el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 分类导航 -->
    <div class="container">
      <div class="category-section">
        <div class="section-header">
          <h3>商品分类</h3>
        </div>
        <div class="category-list">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="category-item"
            @click="$router.push(`/products?category=${cat.id}`)"
          >
            <el-icon :size="40"><component :is="cat.icon" /></el-icon>
            <span>{{ cat.name }}</span>
          </div>
        </div>
      </div>

      <!-- 热门商品 -->
      <div class="hot-products">
        <div class="section-header">
          <h3>热门商品</h3>
          <el-button text @click="$router.push('/products')">查看更多</el-button>
        </div>
        <div class="product-grid">
          <div
            v-for="product in hotProducts"
            :key="product.id"
            class="product-card"
            @click="$router.push(`/product/${product.id}`)"
          >
            <div class="product-image">
              <img :src="product.image" :alt="product.name" />
            </div>
            <div class="product-info">
              <h4 class="product-name">{{ product.name }}</h4>
              <p class="product-desc">{{ product.desc }}</p>
              <div class="product-price">
                <span class="price">¥{{ product.price }}</span>
                <span class="original-price">¥{{ product.originalPrice }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 新品推荐 -->
      <div class="new-products">
        <div class="section-header">
          <h3>新品推荐</h3>
        </div>
        <div class="product-grid">
          <div
            v-for="product in newProducts"
            :key="product.id"
            class="product-card"
            @click="$router.push(`/product/${product.id}`)"
          >
            <div class="product-image">
              <img :src="product.image" :alt="product.name" />
              <span class="tag new">新品</span>
            </div>
            <div class="product-info">
              <h4 class="product-name">{{ product.name }}</h4>
              <div class="product-price">
                <span class="price">¥{{ product.price }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 轮播图数据
const banners = ref([
  { id: 1, title: '春季新品上市', desc: '精选优质商品，限时优惠', image: 'https://picsum.photos/1920/400?random=10' },
  { id: 2, title: '品质生活节', desc: '满减活动火热进行中', image: 'https://picsum.photos/1920/400?random=11' },
  { id: 3, title: '会员专享福利', desc: '注册即享新人礼包', image: 'https://picsum.photos/1920/400?random=12' }
])

// 分类数据
const categories = ref([
  { id: 1, name: '数码产品', icon: 'Phone' },
  { id: 2, name: '服饰鞋包', icon: 'ShoppingBag' },
  { id: 3, name: '家居生活', icon: 'House' },
  { id: 4, name: '美妆个护', icon: 'Present' },
  { id: 5, name: '食品饮料', icon: 'Coffee' },
  { id: 6, name: '图书文具', icon: 'Notebook' }
])

// 热门商品
const hotProducts = ref([
  { id: 1, name: '智能手表 Pro', desc: '运动健康监测，超长续航', price: 1999, originalPrice: 2999, image: 'https://picsum.photos/200/200?random=1' },
  { id: 2, name: '无线蓝牙耳机', desc: '主动降噪，音质卓越', price: 599, originalPrice: 899, image: 'https://picsum.photos/200/200?random=2' },
  { id: 3, name: '机械键盘', desc: '青轴手感，RGB背光', price: 399, originalPrice: 599, image: 'https://picsum.photos/200/200?random=3' },
  { id: 4, name: '便携充电宝', desc: '20000mAh大容量', price: 129, originalPrice: 199, image: 'https://picsum.photos/200/200?random=4' }
])

// 新品推荐
const newProducts = ref([
  { id: 5, name: '智能音箱 Mini', price: 299, image: 'https://picsum.photos/200/200?random=5' },
  { id: 6, name: '运动手环', price: 199, image: 'https://picsum.photos/200/200?random=6' },
  { id: 7, name: '无线充电器', price: 89, image: 'https://picsum.photos/200/200?random=7' },
  { id: 8, name: '蓝牙鼠标', price: 149, image: 'https://picsum.photos/200/200?random=8' }
])
</script>

<style lang="scss" scoped>
.home-page {
  .banner-section {
    margin-bottom: 30px;
  }

  .banner-item {
    height: 100%;
    position: relative;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.6);
    }

    .banner-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #fff;
      z-index: 1;

      h2 {
        font-size: 42px;
        margin-bottom: 15px;
      }

      p {
        font-size: 18px;
        margin-bottom: 25px;
        opacity: 0.9;
      }
    }
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      font-size: 20px;
      font-weight: 500;
    }
  }

  .category-section {
    background: #fff;
    border-radius: 8px;
    padding: 25px;
    margin-bottom: 30px;

    .category-list {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 20px;

      @media (max-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .category-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      color: #666;

      &:hover {
        background: #f5f7fa;
        color: #409EFF;
        transform: translateY(-2px);
      }

      span {
        font-size: 14px;
      }
    }
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;

    @media (max-width: 992px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 576px) {
      grid-template-columns: 1fr;
    }
  }

  .product-card {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-5px);
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

        &.new {
          background: #67C23A;
        }
      }
    }

    .product-info {
      padding: 15px;
    }

    .product-name {
      font-size: 15px;
      font-weight: 500;
      color: #333;
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
        margin-left: 8px;
      }
    }
  }

  .hot-products,
  .new-products {
    margin-bottom: 30px;
  }
}
</style>