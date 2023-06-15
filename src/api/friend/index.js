/*
 * @Description:
 * @Author: gumingchen
 * @Email: 1240235512@qq.com
 * @Date: 2021-08-26 08:28:30
 * @LastEditors: gumingchen
 * @LastEditTime: 2021-08-31 20:31:37
 */
import service from '@/utils/request'

/**
 * @description: 获取分组好友
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function listApi(params) {
  console.log('获取分组 -> 好友的api | get')
  return service({
    url: '/im/friend/list',
    method: 'get',
    params: params
  })
}

/**
 * @description: 添加好友
 * @param {*} params
 * @return {*}
 * @author: gumingchen
 */
export function addApi(params) {
  console.log('加好友，加友友的申请api | POST | params')
  return service({
    url: '/im/friend/create',
    method: 'post',
    data: params
  })
}

/**
 * @description: 接受好友请求
 * @param {*} params
 * @return {*}
 * @author: gumingchen
 */
export function acceptApi(params) {
  console.log('接受好友申请api | POST')
  return service({
    url: '/im/friend/accept',
    method: 'post',
    data: params
  })
}

/**
 * @description: 拒绝好友请求
 * @param {*} params
 * @return {*}
 * @author: gumingchen
 */
export function refuseApi(params) {
  console.log('拒绝好友申请的api | POST')
  return service({
    url: '/im/friend/refuse',
    method: 'post',
    data: params
  })
}

/**
 * @description: 重新申请好友请求
 * @param {*} params
 * @return {*}
 * @author: gumingchen
 */
export function againApi(params) {
  console.log('重新申请好友的api | POST')
  return service({
    url: '/im/friend/again',
    method: 'post',
    data: params
  })
}

/**
 * @description: 移动好友到分组
 * @param {*} params
 * @return {*}
 * @author: gumingchen
 */
export function moveApi(params) {
  console.log('移动好友分组的api | POST')
  return service({
    url: '/im/friend/move',
    method: 'post',
    data: params
  })
}

/**
 * @description: 删除好友
 * @param {*} params
 * @return {*}
 * @author: gumingchen
 */
export function deleteApi(params) {
  console.log('删除好友的api | POST')
  return service({
    url: '/im/friend/delete',
    method: 'post',
    data: params
  })
}

/**
 * @description: 获取好友申请列表
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function applyListApi(params) {
  console.log('得到好友申请列表 | GET')
  return service({
    url: '/im/friend/apply/list',
    method: 'get',
    params: params
  })
}

/**
 * @description: 获取好友聊天记录
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function messagePageApi(params) {
  console.log('得到当前会话的私有消息的api | GET')
  return service({
    url: '/im/private/message/page',
    method: 'get',
    params: params
  })
}

/**
 * @description: 设置聊天记录已读
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function messageStatusApi(params) {
  console.log('设置聊天记录已读的api | POST | 设置范围是多少')
  return service({
    url: '/im/private/message/status',
    method: 'post',
    data: params
  })
}

