import request from '@/request'


export function getColumns(query, page) {
  return request({
    url: '/columns',
    method: 'get',
    params: {
      pageNumber: page.pageNumber,
      pageSize: page.pageSize,
      name: page.name,
      sort: page.sort,
      tagId: query.tagId,
      authorId: query.authorId,
    }
  })
}

export function getColumnDetail(id){
  return request({
    url: `/columns/detail/${id}`,
    method: 'get',
  })
}

export function getColumnsByAuthor(id){
  return request({
    url: `/columns/author/${id}`,
    method: 'get',
  })
}

export function getColumnById(id){
  return request({
    url: `columns/${id}`,
    method: 'get',
  })
}

export function publishColumn(data){
  return request({
    url: 'columns/publish', //具有新增和更新功能
    method: 'post',
    data: data,
  })
}

export function removeColumnMember(columnId, memberId){
  return request({
    url: 'columns/members/remove',
    method: 'post',
    data: [columnId, memberId],
  })
}

export function addColumnMember(columnId, memberId){
  return request({
    url: 'columns/members/add',
    method: 'post',
    data: [columnId, memberId],
  })
}


export function deleteColumnById(id){
  return request({
    url: `columns/delete/${id}`,
    method: 'post',
  })
}

export function getWritableColumns(){ //获取当前用户可以写文章的专栏
  return request({
    url: '/columns/writable',
    method: 'get',
  })
}
