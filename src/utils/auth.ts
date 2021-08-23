import {getToken} from '@/request/token'
import {useStore} from 'vuex'
import {key} from '@/store'
import { getUserInfo } from '../api/login'


const store = useStore(key)

export function userAuth(){
    if(!store.state.user.id && getToken()){
      getUserInfo()
    }
}
