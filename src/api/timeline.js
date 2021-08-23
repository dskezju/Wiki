import request from '@/request'

export function getTimeAxisList(params){
    return request({
        url: '/timeline',
        method: 'post',
        data: params
    })
}