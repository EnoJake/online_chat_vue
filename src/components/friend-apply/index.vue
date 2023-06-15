<template>
  <div class="friend-apply-container">
    <div class="box">
      <div class="wrap">
        <el-avatar class="avatar margin_r-10" :size="40" :src="apply.avatar" />
        <div class="content">
          <p class="nickname ellipse-1">
            {{apply.nickname}}
          </p>
          <div class="message-box">
            <span class="message ellipse-1" v-if="apply.isApplicant">
              <span v-show="apply.status === 0">您已申请添加对方为好友</span>
              <span v-show="apply.status === 2">对方已拒绝添加您为好友</span>
            </span>
            <span class="message ellipse-1" v-else>
              <span v-show="apply.status === 0">对方已申请添加您为好友</span>
              <span v-show="apply.status === 2">您已拒绝添加对方为好友</span>
            </span>
          </div>
        </div>
        <div class="btn-box width-70">
          <template v-if="!apply.isApplicant && apply.status === 0">
            <el-button class="accept-btn" type="text" @click="acceptHandle">接受</el-button>
            <el-button class="refuse-btn" type="text" @click="refuseHandle">拒绝</el-button>
          </template>
          <template v-if="apply.isApplicant && apply.status === 2">
            <el-button class="again-btn" type="text" @click="againHandle">重新添加</el-button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  emits: ['accept', 'refuse', 'again'],
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const store = useStore()

    const user = computed(() => store.state.user.user)
    const apply = computed(() => {
      console.log('根据你是这条申请发出去的还以被别人加的来解封数据')
      return {
        id: props.data.id,
        remark: props.data.remark,
        status: props.data.status,
        isApplicant: props.data.applicant.id === user.value.id,
        ...(props.data.applicant.id === user.value.id ? props.data.reviewer : props.data.applicant)
      }
    })

    /**
     * @description: 接受
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const acceptHandle = () => {
      console.log('父组件，该你处理这个接受的回调函数处理接受申请了')
      emit('accept')
    }

    /**
     * @description: 拒绝
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const refuseHandle = () => {
      console.log('父组件，该你拒绝接受了')
      emit('refuse')
    }

    /**
     * @description: 重新申请添加好友
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const againHandle = () => {
      console.log('父组件，人家还想要再加它一遍了啦')
      emit('again')
    }

    return {
      user,
      apply,
      acceptHandle,
      refuseHandle,
      againHandle
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/sass/_variable.scss';
@import '@/assets/sass/_animation.scss';

$height: 70px;
$distance: 5px;

.friend-apply-container {
  height: $height;
}
.box {
  position: relative;
  height: $height;
  padding: 15px 20px;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  .wrap {
    display: flex;
    .content {
      flex: 1;
      .nickname {
        margin: 0;
        color: $lightColor-1;
        line-height: 21px;
      }
      .message-box {
        padding-top: 3px;
        font-size: 12px;
        color: $darkColor-6;
        display: flex;
        .message {
          flex: 1;
        }
      }
    }
    .btn-box {
      text-align: center;
      .el-button {
        color: $darkColor-6;
      }
      .accept-btn:hover, .again-btn:hover {
        color: $activeColor;
      }
      .refuse-btn:hover {
        color: $warmColor;
      }
    }
  }
  &:hover {
    background-color: $darkColor-3;
  }
}
</style>

