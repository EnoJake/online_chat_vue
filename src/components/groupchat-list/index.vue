<template>
  <div>
    <el-button type="text" class="add-group-btn" @click="createGroup">创建群聊</el-button>
    <groupchat
      v-for="(item, index) in data"
      :key="index"
      :data="item"
      @click="clickHandle(index, item)"
      @on-close="exitHandle" />
  </div>
</template>

<script>
import { defineComponent, reactive, computed, onMounted, onActivated, watch, ref } from 'vue'
import Groupchat from '@/components/groupchat'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  components: {
    Groupchat
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

    const data = computed(() => store.state.group.groups)

    /**
     * 会话点击事件
     */
    const clickHandle = (_index, val) => {
      console.log('click在conversation-list里面 在 作用在 conversation上面奠奠奠奠')
      console.log('将 -> ', val.id, ' 设置为活化人')
      store.dispatch('conversation/setActive', val.id)
    }

    /**
     * 退出群聊
     */
    const exitHandle = (val) => {
      store.dispatch('group/exitGroup', val.name).then(r => {
        if (r) {
          store.dispatch('conversation/getConversations')
          if (store.state.conversation.active.id === val.id) {
            store.state.conversation.active = null
          }
          ElMessage({
            message: '退出群聊成功!',
            type: 'success'
          })
        }
      })
    }

    const createGroup = () => {
      ElMessageBox.prompt('请输入群聊名称', '创建群聊', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '群聊名称不能为空'
      }).then(async ({ value }) => {
        console.log('刚开始创建群聊呢')
        const r = await store.dispatch('group/addGroup', value)
        if (r) {
          ElMessage({
            message: '创建群聊成功！',
            type: 'success'
          })
        }
      }).catch(() => {
        //
      })
    }

    return {
      data,
      clickHandle,
      exitHandle,
      createGroup
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/sass/_variable.scss';
.el-collapse, ::v-deep(.el-collapse-item__header), ::v-deep(.el-collapse-item__wrap) {
  border: none;
}
::v-deep(.el-collapse-item__header), ::v-deep(.el-collapse-item__wrap) {
  background-color: transparent;
}
::v-deep(.el-collapse-item__header:hover) {
  background-color: $darkColor-3;
}
::v-deep(.el-collapse-item__arrow) {
  color: $darkColor-6;
}
.add-group-btn {
  color: $darkColor-6;
  &:hover {
    color: $activeColor;
  }
}
.group-name-box {
  position: relative;
  display: flex;
  width: 100%;
  text-align: left;
  .group-name {
    color: $lightColor-1;
    flex: 1;
  }
  .group-icon-btn-group {
    position: absolute;
    left: -30px;
    width: 20px;
    color: $darkColor-6;
    transition: .2s;
    .iconfont {
      font-size: 12px;
    }
    .icon-fork:hover {
      color: $warmColor;
    }
  }
  &:hover {
    .group-icon-btn-group {
      left: 5px;
    }
  }
}

</style>
