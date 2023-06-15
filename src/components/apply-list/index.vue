<template>
  <div>
    <friend-apply
      v-for="(item, index) in data"
      :key="index"
      :data="item"
      @accept="acceptHandle(item)"
      @refuse="refuseHandle(item)"
      @again="againHandle(item)" />
    <dialog-accept-friend ref="refAcceptFriend" v-if="visible" />
  </div>
</template>

<script>
import { defineComponent, computed, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import FriendApply from '@/components/friend-apply'
import DialogAcceptFriend from '@/components/dialog-accept-friend'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  components: {
    FriendApply,
    DialogAcceptFriend
  },
  setup() {
    const store = useStore()

    const refAcceptFriend = ref()
    const visible = ref(true)

    const data = computed(() => store.state.friend.applys)

    const acceptHandle = (val) => {
      console.log('好友申请的接受，为什么，ref不仅能够成为节点的代名词，还能够用来绑定v-if,或者，这只是一个真假的响应式数据，成为什么只跟它的用途有关。')
      visible.value = true
      console.log('true 之后节点显性')
      nextTick(() => {
        console.log('节点线性之后自己线性，最后的倔强了')
        refAcceptFriend.value.init(val)
      })
    }

    const refuseHandle = (val) => {
      ElMessageBox.confirm('是否拒绝对方的好友请求？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: val.id,
          status: 2
        }
        store.dispatch('friend/refuseApply', params).then(r => {
          if (r) {
            ElMessage({
              message: '已拒绝对方的好友请求！',
              type: 'success'
            })
          }
        })
      }).catch(() => {
        //
      })
    }

    const againHandle = (val) => {
      const params = {
        id: val.id,
        status: 0
      }
      store.dispatch('friend/againApply', params).then(r => {
        if (r) {
          ElMessage({
            message: '已重新申请添加对方为好友！',
            type: 'success'
          })
        }
      })
    }

    return {
      refAcceptFriend,
      visible,
      data,
      acceptHandle,
      refuseHandle,
      againHandle
    }
  }
})
</script>

<style>

</style>
