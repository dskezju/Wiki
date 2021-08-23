import request from '@/request'

export function getAllCategories() {
  return request({
    url: '/categories',
    method: 'get',
  })
}

export function getAllCategoriesDetail() {
  return request({
    url: '/categories/detail',
    method: 'get',
  })
}

export function getCategory(id) {
  return request({
    url: `/categories/${id}`,
    method: 'get',
  })
}

export function getCategoryDetail(id) {
  return request({
    url: `/categories/detail/${id}`,
    method: 'get',
  })
}

export function addCategories(categories) {
  return request({
   url: 'categories/create',
   method: 'post',
   data: categories,
 })
}
