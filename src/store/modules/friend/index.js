/*
 * @Description:
 * @Author: gumingchen
 * @Email: 1240235512@qq.com
 * @Date: 2021-08-26 07:57:01
 * @LastEditors: gumingchen
 * @LastEditTime: 2021-08-31 20:43:46
 */
import { listApi as groupListApi, addApi as friendGroupAddApi, deleteApi as friendGroupDelApi } from '@/api/friend-group'
import { deleteApi, moveApi, applyListApi as friendApplyListApi, acceptApi, refuseApi, againApi } from '@/api/friend'

export default {
  state: {
    isGetGroup: false,
    groups: [],
    applys: []
  },
  mutations: {
    SET_GROUPS: (state, groups) => {
      state.groups = groups
      state.isGetGroup = true
    },
    SET_GROUP_FRIENDS: (state, data) => {
      const { groupId, friends } = data
      for (let i = 0; i < state.groups.length; i++) {
        const group = state.groups[i]
        if (group.id === groupId) {
          group.friends = friends
          group.isGet = true
        }
      }
    },
    ADD_GROUP: (state, group) => {
      state.groups.push(group)
    },
    DELETE_GROUP: (state, index) => {
      state.groups.splice(index, 1)
    },
    ADD_FRIEND: (state, friend) => {
      for (let i = 0; i < state.groups.length; i++) {
        const group = state.groups[i]
        if (group.id === friend.group_id) {
          group.friends.push(friend)
          break
        }
      }
    },
    DELETE_FRIEND: (state, id) => {
      for (let i = 0; i < state.groups.length; i++) {
        const group = state.groups[i]
        for (let j = 0; j < group.friends.length; j++) {
          const friend = group.friends[j]
          if (friend.user_id === id) {
            group.friends.splice(j, 1)
            break
          }
        }
      }
    },
    SET_APPLYS: (state, applys) => {
      state.applys = applys
    },
    REMOVE_APPLY: (state, id) => {
      state.applys = state.applys.filter(item => item.id !== id)
    },
    UPDATE_APPLY_STATUS: (state, data) => {
      for (let i = 0; i < state.applys.length; i++) {
        const item = state.applys[i]
        if (item.id === data.id) {
          item.status = data.status
          break
        }
      }
    },
    CLEAR: (state) => {
      state.isGetGroup = false
      state.groups = []
      state.applys = []
    }
  },
  getters: {
    selectGroups: state => {
      console.log('state.getters.friend.selectGroups里面')
      console.log('好友分组信息太多，把它拆碎了取出精华形成映射形成一个新的分组，然后返回，只有id和 name')
      return state.groups.map(item => {
        return {
          id: item.id,
          name: item.name
        }
      })
    },
    groups: state => {
      return function(keywords) {
        const groups = []
        state.groups.forEach(group => {
          const friends = []
          group.friends.forEach(friend => {
            if (friend.nickname.includes(keywords) || friend.username.includes(keywords)) {
              friends.push(friend)
            }
          })
          if (group.name.includes(keywords) || friends.length) {
            group.friends = friends
            groups.push(group)
          }
        })
        return groups
      }
    }
  },
  actions: {

    /**
     * @description: 获取好友分组 及好友列表
     * @param {*} commit
     * @return {*}
     * @author: gumingchen
     */
    async getGroups({ commit }) {
      const r = await groupListApi()
      if (r) {
        commit('SET_GROUPS', r.data)
        console.log('将得到的数据保存在state.friend.groups里面，并将isGetGroup设置为true，因为这种东西的变动需要授权，所以可以断言了')
      }
      return r
    },

    /**
     * @description: 添加分组
     * @param {*} commit
     * @param {*} group
     * @return {*}
     * @author: gumingchen
     */
    async addGroup({ commit }, value) {
      const r = await friendGroupAddApi({ name: value })
      if (r) {
        commit('ADD_GROUP', {
          ...r.data,
          friends: []
        })
      }
      return r
    },

    /**
     * @description: 移除分组
     * @param {*} commit
     * @param {*} index
     * @return {*}
     * @author: gumingchen
     */
    async deleteGroup({ commit }, { index, id }) {
      const r = await friendGroupDelApi(id)
      if (r) {
        commit('DELETE_GROUP', index)
      }
      return r
    },

    /**
     * @description: 移除好友
     * @param {*} commit
     * @param {*} params
     * @return {*}
     * @author: gumingchen
     */
    async deleteFriend({ commit, dispatch }, friend) {
      console.log('看看里面能否接收到这个代理数据 friend = ', friend)
      let param = null
      if ('user_id' in friend) {
        param = friend.user_id
      } else if ('id' in friend) {
        param = friend.id
      }
      // 保证两版参数一致
      const r = await deleteApi(param)
      console.log('删除幽幽的api，咱也不知道返回的是个啥，兴许被拦截了-> ', r)
      if (r) {
        commit('DELETE_FRIEND', friend.user_id)
        dispatch('conversation/removeActive', { userId: friend.user_id }, { root: true })
        dispatch('conversation/removeConversation', { userId: friend.user_id }, { root: true })
      }
      return r
    },

    /**
     * @description: 移动好友
     * @param {*} dispatch
     * @param {*} data
     * @return {*}
     * @author: gumingchen
     */
    async moveFriend({ commit }, { friend, groupId }) {
      const params = {
        id: friend.id,
        group_id: groupId
      }
      const r = await moveApi(params)
      if (r) {
        commit('DELETE_FRIEND', friend.user_id)
        friend.group_id = groupId
        commit('ADD_FRIEND', friend)
      }
      return r
    },

    /**
     * @description: 获取好友申请列表
     * @param {*} commit
     * @return {*}
     * @author: gumingchen
     */
    async getApplys({ commit }) {
      console.log('为什么加完了友友之后要自己调用一下 得到好友申请列表的api啊，是为了可以自己加自己吗')
      const r = await friendApplyListApi()
      if (r) {
        commit('SET_APPLYS', r.data)
        console.log('将好友申请列表保存在state.friend.applys里面')
      }
      return r
    },

    /**
     * @description: 同意好友申请
     * @param {*} commit
     * @return {*}
     * @author: gumingchen
     */
    async acceptApply({ commit }, data) {
      console.log('接受好友申请')
      const r = await acceptApi(data.params)
      if (r) {
        const friend = {
          ...data.user,
          group_id: data.params.group_id,
          user_id: data.user.id
        }
        commit('REMOVE_APPLY', data.params.id)
        commit('ADD_FRIEND', friend)
      }
      return r
    },

    /**
     * @description: 拒绝好友申请
     * @param {*} commit
     * @return {*}
     * @author: gumingchen
     */
    async refuseApply({ commit }, params) {
      const r = await refuseApi(params.id)
      if (r) {
        commit('UPDATE_APPLY_STATUS', params)
      }
      return r
    },

    /**
     * @description: 重新申请好友
     * @param {*} commit
     * @return {*}
     * @author: gumingchen
     */
    async againApply({ commit }, params) {
      const r = await againApi(params.id)
      if (r) {
        commit('UPDATE_APPLY_STATUS', params)
      }
      return r
    },

    /**
     * @description: 初始化数据
     * @param {*} commit
     * @return {*}
     * @author: gumingchen
     */
    clear({ commit }) {
      commit('CLEAR')
    }

  }
}
