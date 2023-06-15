/*
 * @Description:
 * @Author: gumingchen
 * @Email: 1240235512@qq.com
 * @Date: 2021-08-26 07:57:01
 * @LastEditors: gumingchen
 * @LastEditTime: 2021-08-31 20:43:46
 */
import { listApi, createApi, deleteApi } from '@/api/conversation'
import { parseStringDate } from '@/utils'

export default {
  state: {
    active: null,
    list: []
  },
  mutations: {
    SET_CONVERSATION: (state, conversations) => {
      state.list = conversations
    },
    ADD_CONVERSATION: (state, conversation) => {
      console.log('增加新的session，这里是通过unshift的方式直接再头上加入一个新的会话，排在最上面了？？？')
      state.list.unshift(conversation)
    },
    DELETE_CONVERSATION: (state, index) => {
      console.log('splice index 1 删除指定位置的会话session，所以说这里删除会话其实是没有跟服务器进行过交互的')
      state.list.splice(index, 1)
    },
    SET_ACTIVE: (state, id) => {
      console.log('set active 内部')
      state.active = null
      for (let i = 0; i < state.list.length; i++) {
        const item = state.list[i]
        if (item.id === id) {
          state.active = {
            conversationId: item.id,
            ...item.to
          }
          console.log('将会话的item.to，估计是对方的信息展开，同时再将会话session id 加上去了，名为conversationId')
          item.unread_count = 0
          console.log('非常关键的活化人设置在state.conversation.active里面，活化会话')
          break
        }
      }
    },
    UPDATE_CONVERSATION_PRIVATE_MESSAGE: (state, message) => {
      let obj
      for (let i = 0; i < state.list.length; i++) {
        const item = state.list[i]
        if (item.to.id === message.to) {
          obj = item
          state.list.splice(i, 1)
        }
      }
      obj.message = {
        content: message.content,
        created_at: message.createdAt,
        createdAt: parseStringDate(message.createdAt),
        from: message.from,
        id: message.id,
        status: message.status,
        to: message.to,
        type: message.type,
        url: message.url
      }
      state.list.unshift(obj)
    },
    UPDATE_CONVERSATION_UNREAD: (state, id) => {
      for (let i = 0; i < state.list.length; i++) {
        const item = state.list[i]
        if (item.id === id) {
          item.unread_count = 0
          break
        }
      }
    },
    CLEAR: (state) => {
      state.active = false
      state.list = []
    }
  },
  getters: {
    conversations: state => {
      console.log('老子= () => 箭头函数里面的 函数，匿名函数还是可以接收值的哦，所以你是可以传进来的，箭头函数只好指定外边的值，而不好指定里边的值，只能够指定存在的')
      return function(keywords) {
        console.log('会话的过滤，通过里面回调函数的 true or false 来决定，关键词不存在直接返回，存在则是否包含')
        return state.list.filter(item => {
          return !keywords || item.to.nickname.includes(keywords) || item.to.username.includes(keywords)
        })
      }
    },
    unreadCount: state => {
      let count = 0
      state.list.forEach(item => {
        count += item.unread_count
      })
      console.log('遍历会话列表的每一项，注意是会话列表，将未读消息数item.unread_count进行累加 += 而并不是 +1')
      return count
    }
  },
  actions: {

    /**
     * @description: 获取会话窗口
     * @return {*}
     * @author: gumingchen
     */
    async getConversations({ commit }) {
      const r = await listApi()
      if (r) {
        console.log('得到聊天会话后')
        r.data.forEach(item => {
          if (item.message) {
            item.message.createdAt = parseStringDate(item.message.created_at)
          }
        })
        console.log('parse 0 会得到起始时间好有意思啊 -> ', parseStringDate(0))
        console.log('遍历聊天会话，解析时间，前提是得有消息')
        commit('SET_CONVERSATION', r.data)
        console.log('将响应数据data保存到本地state.conversation.list数组中')
      }
      return r
    },

    /**
     * @description: 设置当前会话窗口 不存在则添加聊天会话
     * @param {*} userId 好友ID
     * @return {*}
     * @author: gumingchen
     */
    async setActive({ commit, state }, userId) {
      console.log('拿到手机之后的第一件事情，点开消息看看 -》 同时也设置了命中注定的 the one')
      console.log('活化设置第一步，总之先进去再说')
      if (userId) {
        console.log('userId 存在')
        const conversations = state.list.filter(item => item.to.id === userId)
        if (conversations.length) {
          console.log('过滤会话数组，取第一个满足id相等（它的id是会话自己本身的id）的设置为活化session')
          console.log('设置为活化session,活化session,活化session')
          commit('SET_ACTIVE', conversations[0].id)
        } else {
          console.log('不存在的话则直接再创造一个session，这里的触发应该是直接点击好友列表来触发的')
          const r = await createApi(userId)
          if (r) {
            console.log('创造好友session有了响应之后则增加session并置为活性session')
            console.log('会话session有一个专门的 id, 用来标识这么一个唯一的session')
            commit('ADD_CONVERSATION', r.data)
            commit('SET_ACTIVE', r.data.id)
          }
        }
      } else {
        commit('SET_ACTIVE')
      }
    },

    /**
     * @description: 设置当前会话窗口 不存在则添加聊天会话
     * @param {*} id 会话ID
     * @return {*}
     * @author: gumingchen
     */
    async deleteConversation({ dispatch, state }, id) {
      const r = await deleteApi(id)
      if (r) {
        dispatch('removeConversation', id)
        if (state.active && state.active.conversationId === id) {
          dispatch('removeActive', { conversationId: id })
        }
      }
      return r
    },

    /**
     * @description: 移除当前会话窗口 选其中一个参数传递
     * @param {*} userId 好友ID
     * @param {*} conversationId 会话ID
     * @return {*}
     * @author: gumingchen
     */
    removeActive({ commit, state }, { userId, conversationId }) {
      if (!userId) {
        commit('SET_ACTIVE')
      } else if (state.active) {
        if (userId === state.active.id || conversationId === state.active.conversationId) {
          commit('SET_ACTIVE')
        }
      }
    },

    /**
     * @description: 移除会话 选其中一个参数传递
     * @param {*} userId 好友ID
     * @param {*} conversationId 会话ID
     * @return {*}
     * @author: gumingchen
     */
    removeConversation({ commit, state }, { userId, conversationId }) {
      console.log('删除会话内部信息，这里是选择一个参数进行传递啊\n'
          + '{ commit, state }, { userId, conversationId }\n'
          + '固有参数与选择参数，好排面呐')
      let index, flag
      if (conversationId) {
        flag = 1
      } else if (userId) {
        flag = 2
      }
      console.log('会话id 和 user id ，所以说，你搞出两个唯一的来就是那多次一举，两个在全局都是唯一的变量')
      for (let i = 0; i < state.list.length; i++) {
        const item = state.list[i]
        if (flag === 1 && item.id === conversationId) {
          index = i
          break
        } else if (flag === 2 && item.to.id === userId) {
          index = i
          break
        }
      }
      console.log('获取待删除会话在列表里面的索引')
      commit('DELETE_CONVERSATION', index)
    },

    /**
     * @description: 初始化数据
     * @param {*} message ack 确认消息
     * @return {*}
     * @author: gumingchen
     */
    updateConversationPrivateMessage({ commit, state, dispatch }, message) {
      console.log('update conversation private message | 这是个啥')
      console.log('message = ', message)
      // 这条消息的接收者 ==
      // 对于消息接收者来说，这个to就是自己本身，这里会触发的情况就只有自己跟自己聊天了啊，在我这里是不可能实现的啊
      // 我也没有试过自己加自己
      const flag = state.list.some(item => (item.to.id === message.to && message.to < 22800))
      if (flag) {
        console.log('将最新的会话置顶 -> 如果存在')
        commit('UPDATE_CONVERSATION_PRIVATE_MESSAGE', message)
        // 这里根本就没什么用，容易出错，直接获取会话更新不就好了
      } else {
        // 私聊也是重新获取会话，这是为什么
        console.log('置顶会话不存在，重新获取会话')
        dispatch('getConversations')
      }
    },

    /**
     * @description: 更新会话消息未读数
     * @param {*} message ack 确认消息
     * @return {*}
     * @author: gumingchen
     */
    updateConversationUnread({ commit }, id) {
      commit('UPDATE_CONVERSATION_UNREAD', id)
    },

    /**
     * @description: 初始化数据
     * @return {*}
     * @author: gumingchen
     */
    clear({ commit }) {
      commit('CLEAR')
    }

  }
}
