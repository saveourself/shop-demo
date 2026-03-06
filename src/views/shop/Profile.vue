<template>
  <div class="profile-page container">
    <h2 class="page-title">个人中心</h2>

    <el-row :gutter="20">
      <!-- 左侧菜单 -->
      <el-col :span="6">
        <div class="menu-card card">
          <div class="user-info">
            <el-avatar :size="64" icon="UserFilled" />
            <h3>{{ userStore.userInfo?.username || '用户' }}</h3>
            <p>{{ userStore.userInfo?.phone || '未绑定手机' }}</p>
          </div>
          <el-menu :default-active="activeMenu" @select="handleMenuSelect">
            <el-menu-item index="profile">
              <el-icon><User /></el-icon>
              <span>个人信息</span>
            </el-menu-item>
            <el-menu-item index="address">
              <el-icon><Location /></el-icon>
              <span>收货地址</span>
            </el-menu-item>
            <el-menu-item index="security">
              <el-icon><Lock /></el-icon>
              <span>账户安全</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-col>

      <!-- 右侧内容 -->
      <el-col :span="18">
        <!-- 个人信息 -->
        <div v-show="activeMenu === 'profile'" class="content-card card">
          <h3>基本信息</h3>
          <el-form :model="profileForm" label-width="100px">
            <el-form-item label="头像">
              <el-avatar :size="80" icon="UserFilled" />
              <el-button type="primary" text class="ml-20">更换头像</el-button>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="profileForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="profileForm.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveProfile">保存修改</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 收货地址 -->
        <div v-show="activeMenu === 'address'" class="content-card card">
          <div class="card-header">
            <h3>收货地址</h3>
            <el-button type="primary" @click="showAddressDialog = true">
              <el-icon><Plus /></el-icon>新增地址
            </el-button>
          </div>
          <div class="address-list">
            <div v-for="addr in addresses" :key="addr.id" class="address-item">
              <div class="address-info">
                <div class="address-name">
                  <span class="name">{{ addr.name }}</span>
                  <span class="phone">{{ addr.phone }}</span>
                  <el-tag v-if="addr.isDefault" size="small" type="success">默认</el-tag>
                </div>
                <p class="address-detail">{{ addr.province }} {{ addr.city }} {{ addr.district }} {{ addr.detail }}</p>
              </div>
              <div class="address-actions">
                <el-button text @click="editAddress(addr)">编辑</el-button>
                <el-button text type="danger" @click="deleteAddress(addr.id)">删除</el-button>
                <el-button v-if="!addr.isDefault" text @click="setDefault(addr.id)">设为默认</el-button>
              </div>
            </div>
          </div>
          <el-empty v-if="addresses.length === 0" description="暂无收货地址" />
        </div>

        <!-- 账户安全 -->
        <div v-show="activeMenu === 'security'" class="content-card card">
          <h3>账户安全</h3>
          <el-form :model="securityForm" label-width="100px">
            <el-form-item label="当前密码">
              <el-input v-model="securityForm.oldPassword" type="password" placeholder="请输入当前密码" />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="securityForm.newPassword" type="password" placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="securityForm.confirmPassword" type="password" placeholder="请确认新密码" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changePassword">修改密码</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <!-- 新增地址弹窗 -->
    <el-dialog v-model="showAddressDialog" title="新增收货地址" width="500px">
      <el-form :model="addressForm" label-width="80px">
        <el-form-item label="收货人">
          <el-input v-model="addressForm.name" placeholder="请输入收货人姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addressForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="所在地区">
          <el-input v-model="addressForm.region" placeholder="请选择省市区" />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="addressForm.detail" type="textarea" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="addressForm.isDefault">设为默认地址</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddressDialog = false">取消</el-button>
        <el-button type="primary" @click="saveAddress">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const activeMenu = ref('profile')

const profileForm = reactive({
  username: '',
  phone: '',
  email: ''
})

const securityForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showAddressDialog = ref(false)
const addressForm = reactive({
  name: '',
  phone: '',
  region: '',
  detail: '',
  isDefault: false
})

const addresses = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '朝阳区',
    district: '望京街道',
    detail: '某某小区1号楼101室',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    province: '上海市',
    city: '浦东新区',
    district: '张江镇',
    detail: '某某科技园A座',
    isDefault: false
  }
])

function handleMenuSelect(key) {
  activeMenu.value = key
}

function saveProfile() {
  userStore.setUserInfo({
    ...userStore.userInfo,
    username: profileForm.username,
    phone: profileForm.phone,
    email: profileForm.email
  })
  ElMessage.success('保存成功')
}

function changePassword() {
  if (securityForm.newPassword !== securityForm.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  ElMessage.success('密码修改成功')
  securityForm.oldPassword = ''
  securityForm.newPassword = ''
  securityForm.confirmPassword = ''
}

function editAddress(addr) {
  Object.assign(addressForm, addr)
  showAddressDialog.value = true
}

function deleteAddress(id) {
  ElMessageBox.confirm('确定删除该地址吗？').then(() => {
    addresses.value = addresses.value.filter(a => a.id !== id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

function setDefault(id) {
  addresses.value.forEach(addr => {
    addr.isDefault = addr.id === id
  })
  ElMessage.success('已设为默认地址')
}

function saveAddress() {
  if (!addressForm.name || !addressForm.phone || !addressForm.detail) {
    ElMessage.error('请填写完整信息')
    return
  }

  if (addressForm.isDefault) {
    addresses.value.forEach(addr => {
      addr.isDefault = false
    })
  }

  addresses.value.push({
    id: Date.now(),
    name: addressForm.name,
    phone: addressForm.phone,
    province: '北京市',
    city: '朝阳区',
    district: '',
    detail: addressForm.detail,
    isDefault: addressForm.isDefault
  })

  showAddressDialog.value = false
  ElMessage.success('添加成功')

  // 重置表单
  addressForm.name = ''
  addressForm.phone = ''
  addressForm.region = ''
  addressForm.detail = ''
  addressForm.isDefault = false
}

onMounted(() => {
  if (userStore.userInfo) {
    profileForm.username = userStore.userInfo.username || ''
    profileForm.phone = userStore.userInfo.phone || ''
  }
})
</script>

<style lang="scss" scoped>
.profile-page {
  .menu-card {
    .user-info {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #eee;

      h3 {
        margin: 10px 0 5px;
        font-size: 16px;
      }

      p {
        color: #999;
        font-size: 13px;
      }
    }

    :deep(.el-menu) {
      border-right: none;
    }
  }

  .content-card {
    h3 {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      padding: 0;
      border: none;
    }
  }

  .address-list {
    .address-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border: 1px solid #eee;
      border-radius: 4px;
      margin-bottom: 10px;

      &:hover {
        border-color: #409EFF;
      }

      .address-info {
        .address-name {
          margin-bottom: 5px;

          .name {
            font-weight: 500;
            margin-right: 10px;
          }

          .phone {
            color: #666;
            margin-right: 10px;
          }
        }

        .address-detail {
          color: #999;
          font-size: 13px;
        }
      }

      .address-actions {
        display: flex;
        gap: 5px;
      }
    }
  }
}
</style>