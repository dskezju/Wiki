import request from '@/request'


export function getCommentsByArticle(id) {
  return request({
    url: `/comments/article/${id}`,
    method: 'get'
  })
}

export function publishComment(comment) {
  return request({
    url: '/comments/create/change', //保存评论并更改文章的评论数
    method: 'post',
    data: comment
  })
}

export function deleteCommentById(id){
  return request({
    url: `/comments/delete/change/${id}`,
    method: 'get',
  })
}
