<template>
  <div>
    <conversation
      v-for="(item, index) in data"
      :key="index"
      :data="item"
      @click="clickHandle(index, item)"
      @on-close="closeHandle" />
  </div>
</template>

<script>
import { defineComponent, reactive, computed, onMounted, onActivated, watch, ref } from 'vue'
import Conversation from '@/components/conversation'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { listApi } from '@/api/group'

export default defineComponent({
  components: {
    Conversation
  },
  props: {
    keywords: {
      type: [Number, String, Boolean],
      required: false
    }
  },
  setup(props, { emit }) {
    const store = useStore()

    /* 根据关键字过滤聊天会话 */
    const data = computed(() => {
      console.log('bar left 右边兄弟 bar right 的选择，来到了conversation-list， 通过关键字来过滤数据')
      console.log('这就是为什么getters[]是数组调用的方式吗')
      return store.getters['conversation/conversations'](props.keywords)
    })

    /**
     * 会话点击事件
     */
    const clickHandle = (_index, val) => {
      console.log('click在conversation-list里面 在 作用在 conversation上面奠奠奠奠')
      console.log('将 -> ', val.to.id, ' 设置为活化人')
      store.dispatch('conversation/setActive', val.to.id)
    }

    /**
     * 会话删除事件
     */
    const closeHandle = (val) => {
      store.dispatch('conversation/deleteConversation', val.id).then(r => {
        if (r) {
          ElMessage({
            message: '删除会话成功!',
            type: 'success'
          })
        }
      })
    }

    return {
      data,
      clickHandle,
      closeHandle
    }
  }
})
</script>

<style>

</style>
