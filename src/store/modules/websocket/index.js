/*
 * @Description:
 * @Author: gumingchen
 * @Email: 1240235512@qq.com
 * @Date: 2021-04-02 18:59:43
 * @LastEditors: gumingchen
 * @LastEditTime: 2021-08-26 08:44:56
 */
import WebsocketClass from '@/utils/websocket'
import { parseStringDate } from '@/utils'

export default {
  state: {
    response: null,
    socket: null
  },
  getters: {
  },
  mutations: {
    INIT: (state, token) => {
      // const baseUrl = 'ws://localhost:8080/websocket/'
      // const baseUrl = 'ws://124.223.50.19:8080/websocket/'
      const url = process.env.VUE_APP_WS_URL + token
      console.log('为什么这里的process.env.VUE_APP_WS_URL为什么为localhost啊 -> ', process.env.VUE_APP_WS_URL)
      console.log('妈的又好了，抽尼玛的疯')
      // const url = baseUrl + token
      console.log('url = process.env.VUE_APP_WS_URL + token = ', url)
      state.socket = new WebsocketClass(url, data => {
        state.response = data
        console.log('套接字回调函数被调用，有什么动静了，传进来数据，自行车的data')
        console.log('🚲~~:', data)
      })
      state.socket.connect()
    },
    SEND: (state, data) => {
      const params = {
        type: 1,
        requestBody: data
      }
      console.log('✈️:~~', params)
      state.socket.send(params)
    },
    CLOSE: (state) => {
      if (state.socket) {
        state.socket.close()
      }
      state.response = null
      state.body = null
      state.socket = null
    }
  },
  actions: {

    /**
     * @description: 初始化websocket
     * @param {*} commit
     * @param {*} rootState
     * @return {*}
     * @author: gumingchen
     */
    init({ commit, rootState }) {
      console.log('初始化socket套接字，用token？？？初始化')
      console.log('rootState.user.token.token = ', rootState.user.token.token)
      commit('INIT', rootState.user.token.token)
    },

    /**
     * @description: 发送信息
     * @param {*} commit
     * @param {*} data
     * @return {*}
     * @author: gumingchen
     */
    send({ commit, dispatch }, data) {
      commit('SEND', data)
      const now = new Date()
      dispatch('message/pushPrivateMessage', {
        ack: data.message.ack,
        content: data.message.content,
        created_at: now.getTime(),
        from: data.message.from,
        id: '',
        status: 0,
        to: data.message.to,
        type: data.message.messageType,
        url: data.message.url,
        loading: true,
        avatar: data.message.avatar,
        nickname: data.message.nickname
      }, { root: true })
    },

    /**
     * @description: 手动断开websocket
     * @param {*} commit
     * @return {*}
     * @author: gumingchen
     */
    close({ commit }) {
      commit('CLOSE')
    }
  }
}
