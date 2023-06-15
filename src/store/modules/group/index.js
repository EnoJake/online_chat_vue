import { listApi, addGroupApi, addApi, deleteApi } from '@/api/group'

export default {
  state: {
    groups: []
  },
  getters: {

  },
  mutations: {
    SET_GROUPS: (state, groups) => {
      state.groups = groups
    },
    ADD_GROUP: (state, group) => {
      state.groups.push(group)
    },
    DELETE_GROUP: (state, name) => {
      state.groups = state.groups.filter(item => item.name !== name)
    }
  },
  actions: {

    /**
     * @description: 获取群聊信息
     * @param {*} commit
     * @return {*}
     * @author: fengfengzi
     */
    async getGroups({ commit }) {
      console.log('将获取群聊的api封装在store里，统一管理')
      const r = await listApi()
      if (r) {
        console.log('获取群聊有响应捏捏捏捏')
        commit('SET_GROUPS', r.data)
      }
      return r
    },

    /**
     * @description: 创建新的群聊
     * @param {*} commit
     * @param value
     * @return {*}
     * @author: fengfengzi
     */
    async addGroup({ commit }, value) {
      console.log('任务分派收到，开始具体的执行')
      const r = await addGroupApi(value)
      if (r) {
        commit('ADD_GROUP', r.data)
      }
      return r
    },

    async joinGroup({ commit }, value) {
      console.log('加入群聊也封装了')
      const r = await addApi(value)
      if (r) {
        commit('ADD_GROUP', r.data)
      }
      return r
    },

    async exitGroup({ commit }, value) {
      console.log('退出群聊')
      const r = await deleteApi(value)
      if (r) {
        commit('DELETE_GROUP', value)
      }
      return r
    }
  }

}
