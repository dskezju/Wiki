import request from '@/request'

export function login(account, password) {
  const data = {
    account,
    password
  }
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

export function getUserInfo() {
  return request({
    url: '/users/currentUser',
    method: 'get'
  })
}

export function updateUser(user) {
  return request({
    url: '/users/update',
    method: 'post',
    data: user
  })
}

export function register(user) {
  return request({
    url: '/register',
    method: 'post',
    data: user,
  })
}
