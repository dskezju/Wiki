import request from '@/request'


export function getArticles(query, page) {
  // console.log('in js, query:', query)
  return request({
    url: '/articles',
    method: 'get',
    params: {
      pageNumber: page.pageNumber,
      pageSize: page.pageSize,
      name: page.name,
      sort: page.sort,
      year: query.year,
      month: query.month,
      tagId: query.tagId,
      categoryId: query.categoryId,
      authorId: query.authorId,
      columnId: query.columnId,
    }
  })
}

export function getHotArtices() {
  return request({
    url: '/articles/hot',
    method: 'get'
  })
}

export function getNewArtices() {
  return request({
    url: '/articles/new',
    method: 'get'
  })
}

export function viewArticle(id) {
  console.log('view id:', id)
  return request({
    url: `/articles/view/${id}`,
    method: 'get'
  })
}

export function getArticlesByCategory(id) {
  return request({
    url: `/articles/category/${id}`,
    method: 'get'
  })
}

export function getArticlesByTag(id) {
  return request({
    url: `/articles/tag/${id}`,
    method: 'get'
  })
}

export function getArticlesByColumn(id){ //没用上
  return request({
    url: `/articles/column/${id}`,
    method: 'get',
  })
}


export function publishArticle(article) { //新增和更新都用这个
  return request({
    url: '/articles/publish',
    method: 'post',
    data: article
  })
}

export function listArchives(){
  return request({
    url: '/articles/listArchives',
    method: 'get',
  })
}

export async function listArchiveArticles(page){
  const data = await request({
    url: '/articles/listArchiveArticles',
    method: 'get',
    params: {
      pageNumber: page.pageNumber,
      pageSize: page.pageSize,
      name: page.name,
      sort: page.sort,
    }
  }) //.catch(()=>{}) //当用.catch时，哪怕出错了后面的代码也会执行，如果没有.catch，后面的代码就不会执行，直接进入外部的catch
  if(data.data){
    data.data.forEach(article => { //添加year和month属性
      const date = new Date(article.createDate)
      article.year = date.getFullYear()
      article.month = date.getMonth() + 1 //month从0开始算
    })
  }
  return data
}

export function getArticleById(id) { //获取文章，不增加阅读数

  return request({
    url: `/articles/${id}`,
    method: 'get'
  })
}

export function updateArticleLikes(articleId, userId){
  return request({
    url: `/articles/updateArticleLikes`,
    method: 'post',
    params: { //params始终会拼接再url后面，不管是什么请求，且后端都可以用@RequestParams接收
      articleId: articleId,
      likedUserId: userId,
    }
  })
}

export async function getArticlesByAuthor(id){
  return request({
    url: `articles/author/${id}`,
    method: 'get',
  })
}

export function deleteArticleById(id){
  return request({
    url: `articles/delete/${id}`,
    method: 'post',
  })
}
