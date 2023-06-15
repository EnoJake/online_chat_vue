import service from '@/utils/request'

/**
 * @description: 获取群聊列表
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function listApi() {
  console.log('得到群聊列表 | group list | GET')
  return service({
    url: '/im/group/list',
    method: 'get'
  })
}

export function addGroupApi(params) {
  console.log('创建新的群聊 | group create | post name')
  return service({
    url: 'im/group/create',
    method: 'post',
    data: params
  })
}

export function addApi(params) {
  console.log('添加已有群聊 | group add | post already name')
  return service({
    url: 'im/group/add',
    method: 'post',
    data: params
  })
}

export function deleteApi(params) {
  console.log('退出已加入群聊 | group exit | post name')
  return service({
    url: 'im/group/delete',
    method: 'post',
    data: params
  })
}
