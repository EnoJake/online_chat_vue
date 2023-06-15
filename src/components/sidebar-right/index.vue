<template>
  <div class="bar-right">
    <div class="header">
      <el-input
        size="mini"
        class="search-input margin_r-10"
        prefix-icon="el-icon-search"
        placeholder="请输入名称或ID搜索"
        v-model="keywords" />
      <span class="icon-btn iconfont icon-plus" @click="addHandle" />
      <span class="iconfont icon-refresh icon-btn margin_l-5" @click="refresh" />
    </div>
    <el-scrollbar class="body">
      <transition name="el-fade-in-linear" mode="out-in">
        <keep-alive>
          <component :is="view" :key="active" :keywords="keywords" />
        </keep-alive>
      </transition>
    </el-scrollbar>
    <dialog-add-friend ref="refAddFriend" v-if="friendVisible" />
    <dialog-add-group ref="refAddGroup" v-if="groupVisible" />
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, nextTick, computed, watch } from 'vue'
import { useStore } from 'vuex'
import ConversationList from '@/components/conversation-list'
import FriendList from '@/components/friend-list'
import ApplyList from '@/components/apply-list'
import DialogAddFriend from '@/components/dialog-add-friend'
import DialogAddGroup from '@/components/dialog-add-group'
import GroupchatList from '@/components/groupchat-list'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  components: {
    ConversationList,
    FriendList,
    ApplyList,
    DialogAddFriend,
    DialogAddGroup,
    GroupchatList
  },
  setup() {
    const store = useStore()

    const refAddFriend = ref()
    const refAddGroup = ref()

    const data = reactive({
      friendVisible: false,
      groupVisible: false,
      keywords: '',
      groupActive: ''
    })

    const active = computed(() => {
      return store.state.status.active
    })

    watch(() => active.value, (_newVal, _oldVal) => {
      data.keywords = ''
      console.log('监听活化天尊的改变，为了将 keywords置空')
    })

    const view = computed(() => {
      console.log('bar left 隔壁兄弟 view 的计算属性，决定哪个是用来展示的组件')
      let result = ''
      switch (active.value) {
        case 1:
          result = 'conversation-list'
          break
        case 2:
          result = 'friend-list'
          break
        case 3:
          result = 'groupchat-list'
          console.log('3 是群聊 group，作者还没有写好')
          break
        case 4:
          result = 'apply-list'
          break
      }
      console.log('决定之后是 result = ', result, ' 来展示')
      return result
    })

    /**
     * 添加事件 好友 / 群组
     */
    const addHandle = () => {
      console.log('有人要加好友了吗')
      switch (active.value) {
        case 1:
        case 2:
        case 4:
          data.friendVisible = true
          console.log('1 2 4的话则将好友可视化置为正确 true 响应式数据，一改，加好友的框框就会弹出来')
          console.log('nextTick 是一个异步更新函数 用于再当前DOM更新循环结束之后执行一些回调函数或者操作')
          console.log('更新之后也就是响应数据改变，新的你想要的加好友的框框出来之后为了它而服务的')
          nextTick(() => {
            console.log('ref 应用响应数据与这个组件的ref标签相互重合了，所以能够成为它的代言人来进行操作')
            console.log('这条语句真的妙啊，都是响应式数据，他不是数据，所以需要把它是数据的那一面给拿出来，又跟ref关联了，所以是标签节点实例本身了，调用它自身的init()方法，真是太妙了')
            refAddFriend.value.init()
            console.log('你让我可见就可见，我要自己可见')
          })
          break
        case 3:
          ElMessageBox.prompt('请输入群聊名称', '添加群聊', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /\S/,
            inputErrorMessage: '群聊名称不能为空'
          }).then(async ({ value }) => {
            console.log('另类添加群聊')
            const r = await store.dispatch('group/joinGroup', value)
            if (r) {
              ElMessage({
                message: '添加群聊成功！',
                type: 'success'
              })
            }
          }).catch(() => {
            //
          })
          // data.groupVisible = true
          // console.log('尝试唤醒加群框框')
          // nextTick(() => {
          //   console.log('通过引用正式唤醒')
          //   refAddGroup.value.init()
          // })
          break
      }
    }

    // /**
    //  * 创建群聊
    //  */
    // const addGroup = async (value) => {
    //   const r = await store.dispatch('group/addGroup', value)
    //   if (r) {
    //     ElMessage({
    //       message: '创建群聊成功!',
    //       type: 'success'
    //     })
    //   }
    // }

    /**
     * 刷新
     */
    const refresh = () => {
      console.log('刷新操作，我根据活化元老的值来决定是具体执行什么操作')
      switch (active.value) {
        case 1:
          console.log('比如case 1 那就是直接重新得到会话 通过调用api')
          store.dispatch('conversation/getConversations')
          break
        case 2:
          console.log('操作2 则是再重新得到好友分组列表')
          store.dispatch('friend/getGroups')
          break
        case 3:
          console.log('操作3 奠奠奠奠')
          store.dispatch('group/getGroups')
          break
        case 4:
          console.log('操作4 则是再重新得到申请列表')
          store.dispatch('friend/getApplys')
          break
      }
    }

    return {
      refAddFriend,
      refAddGroup,
      active,
      view,
      ...toRefs(data),
      addHandle,
      refresh
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/sass/_variable.scss';
@import '@/assets/sass/_animation.scss';

$height: 50px;

.bar-right {
  flex: 1;
  .header {
    height: $height;
    padding: 10px 10px 10px 20px;
    display: flex;
    border-bottom: 1px solid $darkColor-1;
    .search-input {
      flex: 1;
    }
    ::v-deep(.search-input input) {
      color: $darkColor-6;
      background-color: $darkColor-1;
      border-radius: 30px;
      border: none;
      &::-webkit-input-placeholder {
        color: $darkColor-6;
        font-size: 12px;
      }
    }
    .icon-btn {
      height: 30px;
      width: 30px;
      line-height: 30px;
      color: $darkColor-6;
      border-radius: 50%;
      background-color: $darkColor-1;
      cursor: pointer;
      animation: rotateAgainst360 .3s ease-out 0s;
      &:hover {
        color: $activeColor;
        animation: rotateAlong360 .4s ease-out 0s;
      }
    }
  }
  .body {
    height: calc(100% - 50px);
    ::v-deep(.el-scrollbar__bar.is-vertical) {
      display: none!important;
    }
  }
}
</style>
