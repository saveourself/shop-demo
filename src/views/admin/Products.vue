<template>
  <div class="admin-products-page">
    <div class="page-header">
      <h2 class="page-title">商品管理</h2>
      <el-button type="primary" @click="openDialog()">
        <el-icon><Plus /></el-icon>新增商品
      </el-button>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar card">
      <el-form :inline="true">
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.name" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类" clearable>
            <el-option label="数码产品" value="1" />
            <el-option label="服饰鞋包" value="2" />
            <el-option label="家居生活" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="上架" value="1" />
            <el-option label="下架" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 商品列表 -->
    <div class="card">
      <el-table :data="products" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="商品信息" min-width="250">
          <template #default="{ row }">
            <div class="product-cell">
              <img :src="row.image" :alt="row.name" class="product-thumb" />
              <div>
                <p class="product-name">{{ row.name }}</p>
                <p class="product-category">{{ row.categoryName }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">
            <span class="text-danger">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="sales" label="销量" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="openDialog(row)">编辑</el-button>
            <el-button text type="danger" @click="deleteProduct(row.id)">删除</el-button>
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="productForm" label-width="100px">
        <el-form-item label="商品名称" required>
          <el-input v-model="productForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品分类" required>
          <el-select v-model="productForm.categoryId" placeholder="请选择分类" style="width: 100%;">
            <el-option label="数码产品" :value="1" />
            <el-option label="服饰鞋包" :value="2" />
            <el-option label="家居生活" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" required>
          <el-input-number v-model="productForm.price" :min="0" :precision="2" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="库存数量" required>
          <el-input-number v-model="productForm.stock" :min="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="商品图片">
          <el-input v-model="productForm.image" placeholder="请输入图片URL" />
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model="productForm.desc" type="textarea" :rows="3" placeholder="请输入商品描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProduct">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const currentPage = ref(1)
const total = ref(50)

const searchForm = reactive({
  name: '',
  category: '',
  status: ''
})

const products = ref([
  { id: 1, name: '智能手机 Pro Max', categoryName: '数码产品', price: 5999, stock: 100, sales: 2345, status: 1, image: 'https://picsum.photos/60/60?random=1', createTime: '2024-01-10 10:00' },
  { id: 2, name: '无线蓝牙耳机', categoryName: '数码产品', price: 599, stock: 200, sales: 1876, status: 1, image: 'https://picsum.photos/60/60?random=2', createTime: '2024-01-09 15:30' },
  { id: 3, name: '机械键盘 RGB', categoryName: '数码产品', price: 459, stock: 150, sales: 1543, status: 1, image: 'https://picsum.photos/60/60?random=3', createTime: '2024-01-08 09:20' },
  { id: 4, name: '智能手表 Ultra', categoryName: '数码产品', price: 2999, stock: 80, sales: 1234, status: 1, image: 'https://picsum.photos/60/60?random=4', createTime: '2024-01-07 14:45' },
  { id: 5, name: '便携充电宝', categoryName: '数码产品', price: 129, stock: 300, sales: 987, status: 0, image: 'https://picsum.photos/60/60?random=5', createTime: '2024-01-06 11:10' }
])

const dialogVisible = ref(false)
const dialogTitle = computed(() => productForm.id ? '编辑商品' : '新增商品')

const productForm = reactive({
  id: null,
  name: '',
  categoryId: null,
  price: 0,
  stock: 0,
  image: '',
  desc: ''
})

function handleSearch() {
  console.log('Search:', searchForm)
}

function resetSearch() {
  searchForm.name = ''
  searchForm.category = ''
  searchForm.status = ''
}

function openDialog(product = null) {
  if (product) {
    Object.assign(productForm, {
      id: product.id,
      name: product.name,
      categoryId: 1,
      price: product.price,
      stock: product.stock,
      image: product.image,
      desc: ''
    })
  } else {
    Object.assign(productForm, {
      id: null,
      name: '',
      categoryId: null,
      price: 0,
      stock: 0,
      image: '',
      desc: ''
    })
  }
  dialogVisible.value = true
}

function saveProduct() {
  if (!productForm.name || !productForm.categoryId) {
    ElMessage.error('请填写完整信息')
    return
  }

  if (productForm.id) {
    const index = products.value.findIndex(p => p.id === productForm.id)
    if (index > -1) {
      products.value[index] = {
        ...products.value[index],
        name: productForm.name,
        price: productForm.price,
        stock: productForm.stock,
        image: productForm.image || 'https://picsum.photos/60/60?random=10'
      }
    }
    ElMessage.success('修改成功')
  } else {
    products.value.unshift({
      id: Date.now(),
      name: productForm.name,
      categoryName: '数码产品',
      price: productForm.price,
      stock: productForm.stock,
      sales: 0,
      status: 1,
      image: productForm.image || 'https://picsum.photos/60/60?random=10',
      createTime: new Date().toLocaleString()
    })
    ElMessage.success('添加成功')
  }

  dialogVisible.value = false
}

function handleStatusChange(product) {
  ElMessage.success(product.status === 1 ? '已上架' : '已下架')
}

function deleteProduct(id) {
  ElMessageBox.confirm('确定删除该商品吗？').then(() => {
    products.value = products.value.filter(p => p.id !== id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.admin-products-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .search-bar {
    margin-bottom: 20px;
  }

  .product-cell {
    display: flex;
    align-items: center;
    gap: 10px;

    .product-thumb {
      width: 50px;
      height: 50px;
      border-radius: 4px;
      object-fit: cover;
    }

    .product-name {
      font-weight: 500;
      margin-bottom: 3px;
    }

    .product-category {
      font-size: 12px;
      color: #999;
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
}
</style>