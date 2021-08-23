import * as types from "../types";
import {getToken, setToken, removeToken} from '@/request/token'
import {getUserInfo, logout, login, register} from '@/api/login'

const user = {
  state:{
    id: '',
    account: '',
    name: '',
    avatar: '',
    token: getToken(),
  },
  mutations: {
    //定义了一个"SAVE_USER"函数
    [types.SAVE_USER](state: object | any, pageState: object | any) {
      for (const prop in pageState) {
        state[prop] = pageState[prop];
      }
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ID: (state, id) => {
      state.id = id
    }
  },
  actions: {
    login({commit}, user) {
      return new Promise((resolve, reject) => {
        console.log('user:', user)
        login(user.account, user.password).then(data => {
          commit('SET_TOKEN', data.data['Oauth-Token']) //后端传来的登录token，即sessionId
          setToken(data.data['Oauth-Token']) //token保存到localStorage里
          resolve(data)
        }).catch(error => {
          removeToken()
          console.log(error)
          reject(error)
        })
      })
    },
    // 获取用户信息
    getUserInfo({commit, state}) {
      let that = this
      console.log('in getUserInfo')
      return new Promise((resolve, reject) => {
        getUserInfo().then(data => { //获取当前用户信息
          console.log('data:', data)
          commit('SET_ACCOUNT', data.data.account) //设置用户信息
          commit('SET_NAME', data.data.name)
          commit('SET_AVATAR', data.data.avatar)
          commit('SET_ID', data.data.id)
          resolve(data)
        }).catch(error => { //失败就删除所有信息
          commit('SET_TOKEN', '')
          commit('SET_ACCOUNT', '')
          commit('SET_NAME', '')
          commit('SET_AVATAR', '')
          commit('SET_ID', '')
          removeToken()
          console.log('getUserInfo failed')
          console.log('err:', error) //不打印错误信息的话，它错了也不会报错。。。
          reject(error)
        })
      })
    },
    // 退出
    logout({commit, state}) {
      return new Promise((resolve, reject) => {
        logout().then(data => {

          commit('SET_TOKEN', '')
          commit('SET_ACCOUNT', '')
          commit('SET_NAME', '')
          commit('SET_AVATAR', '')
          commit('SET_ID', '')
          removeToken()
          resolve(data)

        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    fedLogOut({commit}) { //清除信息、移除token
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ACCOUNT', '')
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        commit('SET_ID', '')
        removeToken()
        resolve("")
      })
    //   .catch(error => { //reject在这里已经找不到了，reject是在Promise内部出错时用的，见register的用法
    //     reject(error)
    //   })
    },
    register({commit}, user) { //注册，后端创建用户后自动登录，返回token
      return new Promise((resolve, reject) => {
        register(user.account, user.name, user.password).then((data) => {
          commit('SET_TOKEN', data.data['Oauth-Token'])
          setToken(data.data['Oauth-Token'])
          resolve("")
        }).catch((error) => { //内层的register出错了就会来catch，此时调用外层register的reject
          reject(error)
        })
      })
    }
  }
};

export default user;
