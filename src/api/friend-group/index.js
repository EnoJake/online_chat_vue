import service from '@/utils/request'

/**
 * @description: 获取好友分组列表
 * @param {*} params
 * @return {*}
 * @author: gumingchen
 */
export function listApi(params) {
  console.log('得到好友分组列表 | friend group list | GET')
  return service({
    url: '/im/friend/group/list',
    method: 'get',
    params: params
  })
}

/**
 * @description: 添加好友分组
 * @param {*} params
 * @return {*}
 * @author: gumingchen
 */
export function addApi(params) {
  console.log('添加一个新的友友分组 | POST')
  return service({
    url: '/im/friend/group/create',
    method: 'post',
    data: params
  })
}

/**
 * @description: 删除好友分组
 * @param {*} params
 * @return {*}
 * @author: gumingchen
 */
export function deleteApi(params) {
  console.log('删除这么个友友分组 | POST')
  return service({
    url: '/im/friend/group/delete',
    method: 'post',
    data: params
  })
}
