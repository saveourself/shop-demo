<template>
  <div class="admin-categories-page">
    <div class="page-header">
      <h2 class="page-title">分类管理</h2>
      <el-button type="primary" @click="openDialog()">
        <el-icon><Plus /></el-icon>新增分类
      </el-button>
    </div>

    <div class="card">
      <el-table :data="categories" row-key="id" default-expand-all>
        <el-table-column prop="name" label="分类名称" min-width="200" />
        <el-table-column prop="icon" label="图标" width="100">
          <template #default="{ row }">
            <el-icon v-if="row.icon"><component :is="row.icon" /></el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.status" :active-value="1" :inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="openDialog(row)">编辑</el-button>
            <el-button text type="primary" @click="openDialog(null, row.id)">添加子分类</el-button>
            <el-button text type="danger" @click="deleteCategory(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="categoryForm" label-width="100px">
        <el-form-item label="上级分类">
          <el-cascader
            v-model="categoryForm.parentId"
            :options="categoryOptions"
            :props="{ checkStrictly: true, value: 'id', label: 'name' }"
            placeholder="请选择上级分类"
            clearable
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="分类名称" required>
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类图标">
          <el-input v-model="categoryForm.icon" placeholder="请输入图标名称" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="categoryForm.sort" :min="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="categoryForm.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCategory">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const dialogVisible = ref(false)
const dialogTitle = computed(() => categoryForm.id ? '编辑分类' : '新增分类')

const categories = ref([
  {
    id: 1,
    name: '数码产品',
    icon: 'Phone',
    sort: 1,
    status: 1,
    createTime: '2024-01-01 00:00:00',
    children: [
      { id: 11, name: '手机通讯', icon: '', sort: 1, status: 1, createTime: '2024-01-01 00:00:00' },
      { id: 12, name: '电脑办公', icon: '', sort: 2, status: 1, createTime: '2024-01-01 00:00:00' },
      { id: 13, name: '智能设备', icon: '', sort: 3, status: 1, createTime: '2024-01-01 00:00:00' }
    ]
  },
  {
    id: 2,
    name: '服饰鞋包',
    icon: 'ShoppingBag',
    sort: 2,
    status: 1,
    createTime: '2024-01-01 00:00:00',
    children: [
      { id: 21, name: '男装', icon: '', sort: 1, status: 1, createTime: '2024-01-01 00:00:00' },
      { id: 22, name: '女装', icon: '', sort: 2, status: 1, createTime: '2024-01-01 00:00:00' },
      { id: 23, name: '鞋靴', icon: '', sort: 3, status: 1, createTime: '2024-01-01 00:00:00' }
    ]
  },
  {
    id: 3,
    name: '家居生活',
    icon: 'House',
    sort: 3,
    status: 1,
    createTime: '2024-01-01 00:00:00'
  },
  {
    id: 4,
    name: '美妆个护',
    icon: 'Present',
    sort: 4,
    status: 1,
    createTime: '2024-01-01 00:00:00'
  },
  {
    id: 5,
    name: '食品饮料',
    icon: 'Coffee',
    sort: 5,
    status: 1,
    createTime: '2024-01-01 00:00:00'
  }
])

const categoryOptions = computed(() => {
  return [{ id: 0, name: '顶级分类' }, ...categories.value]
})

const categoryForm = reactive({
  id: null,
  parentId: [0],
  name: '',
  icon: '',
  sort: 0,
  status: 1
})

function openDialog(category = null, parentId = null) {
  if (category) {
    Object.assign(categoryForm, {
      id: category.id,
      parentId: [0],
      name: category.name,
      icon: category.icon,
      sort: category.sort,
      status: category.status
    })
  } else {
    Object.assign(categoryForm, {
      id: null,
      parentId: parentId ? [parentId] : [0],
      name: '',
      icon: '',
      sort: 0,
      status: 1
    })
  }
  dialogVisible.value = true
}

function saveCategory() {
  if (!categoryForm.name) {
    ElMessage.error('请输入分类名称')
    return
  }

  if (categoryForm.id) {
    // 编辑
    const findAndUpdate = (list) => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === categoryForm.id) {
          list[i] = { ...list[i], ...categoryForm }
          return true
        }
        if (list[i].children) {
          if (findAndUpdate(list[i].children)) return true
        }
      }
      return false
    }
    findAndUpdate(categories.value)
    ElMessage.success('修改成功')
  } else {
    // 新增
    const newCategory = {
      id: Date.now(),
      name: categoryForm.name,
      icon: categoryForm.icon,
      sort: categoryForm.sort,
      status: categoryForm.status,
      createTime: new Date().toLocaleString()
    }

    if (categoryForm.parentId && categoryForm.parentId[0] !== 0) {
      const findAndAdd = (list) => {
        for (let item of list) {
          if (item.id === categoryForm.parentId[categoryForm.parentId.length - 1]) {
            if (!item.children) item.children = []
            item.children.push(newCategory)
            return true
          }
          if (item.children && findAndAdd(item.children)) return true
        }
        return false
      }
      findAndAdd(categories.value)
    } else {
      categories.value.push(newCategory)
    }
    ElMessage.success('添加成功')
  }

  dialogVisible.value = false
}

function deleteCategory(id) {
  ElMessageBox.confirm('确定删除该分类吗？').then(() => {
    const findAndDelete = (list, parent = null) => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          list.splice(i, 1)
          return true
        }
        if (list[i].children && findAndDelete(list[i].children, list[i])) {
          return true
        }
      }
      return false
    }
    findAndDelete(categories.value)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.admin-categories-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
}
</style>