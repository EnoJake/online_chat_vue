import service from '@/utils/request'

/**
 * @description: 登入
 * @param {*} params
 * @return {*}
 * @author: gumingchen
 */
export function loginApi(params) {
  console.log('login | 登录 | POST')
  return service({
    url: '/im/login',
    method: 'post',
    data: params
  })
}

/**
 * @description: 注册
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function registerApi(params) {
  console.log('register | 注册 | POST')
  return service({
    url: '/im/register',
    method: 'post',
    data: params
  })
}

/**
 * @description: 登出
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
export function logoutApi() {
  console.log('logout | 登出 | POST')
  return service({
    url: '/im/logout',
    method: 'post'
  })
}
