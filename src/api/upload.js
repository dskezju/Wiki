import request from '@/request'

export function upload(formdata) {
  const form = new FormData()
  form.append('file', formdata) //这样就可以配合后端用@RequestParam("file")来接收了
  return request({ //一定要有这个headers
    headers: {'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryBiBxWe5WNAV8km5r'},
    url: '/upload',
    method: 'post',
    data: form
  })
}
