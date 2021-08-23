import axios from 'axios'
import {ElMessage} from 'element-plus'
import {store} from '@/store'
import {getToken} from '@/request/token'
import router from '@/router'

const service = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
})

//request拦截器
service.interceptors.request.use(config => {

  if (store.state.user.token) { //如果有token就放在头部
    config.headers['Oauth-Token'] = getToken()
  }
  return config
}, error => {

  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {

    //全局统一处理 Session超时
    if (response.headers['session_time_out'] == 'timeout') {
      store.dispatch('fedLogOut')
    }

    const res = response.data;

    //0 为成功状态
    if (res.code !== 0) {

      //90001 Session超时
      if (res.code === 90001) {
        return Promise.reject('error');
      }

      //20001 用户未登录
      if (res.code === 20001) {
        console.info("用户未登录")

        ElMessage({
          type: 'warning',
          showClose: true,
          message: '未登录或登录超时，请重新登录哦'
        })

        return Promise.reject('error');
      }

      //70001 权限认证错误
      if (res.code === 70001) {
        console.info("权限认证错误")
        ElMessage({
          type: 'warning',
          showClose: true,
          message: '你没有权限访问哦'
        })
        return Promise.reject('error');
      }

      if(res.code === 50001){
        console.log('数据不存在')
        ElMessage({
          type: 'error',
          message: '数据不存在',
          showClose: true,
        })
        router.push('/')
      }

      return Promise.reject(res.msg);
    } else {
      return response.data;
    }
  },
  error => {
    console.log(error)
    ElMessage({
      type: 'warning',
      showClose: true,
      message: '连接超时'
    })
    return Promise.reject('error')
  })

export default service
