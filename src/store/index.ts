import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import user from "./modules/user";

export interface State {
  count: number,
  user?: any, //不声明的话state就会找不到
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({ //原本的new Vuex.store({})
  state: {
    count: 0
  },
  modules: {
    user
  },
  mutations: {
    increment(state) {
      state.count++
    }
  }
})
