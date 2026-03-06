import request from '../request'

// 用户登录
export function login(data) {
  return request.post('/auth/login', data)
}

// 用户注册
export function register(data) {
  return request.post('/auth/register', data)
}

// 获取用户信息
export function getUserInfo() {
  return request.get('/user/info')
}

// 更新用户信息
export function updateUserInfo(data) {
  return request.put('/user/info', data)
}

// 获取收货地址
export function getAddresses() {
  return request.get('/user/addresses')
}

// 添加收货地址
export function addAddress(data) {
  return request.post('/user/addresses', data)
}

// 更新收货地址
export function updateAddress(id, data) {
  return request.put(`/user/addresses/${id}`, data)
}

// 删除收货地址
export function deleteAddress(id) {
  return request.delete(`/user/addresses/${id}`)
}