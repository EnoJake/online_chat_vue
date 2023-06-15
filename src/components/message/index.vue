<template>
  <div class="message-container">
    <div :class="`message-wrap ${data.from === currentUser.id ? 'message-wrap_sender' : 'message-wrap_recipient'}`">
      <el-avatar class="avatar width-50" :size="50" :src="data.from === currentUser.id ? currentUser.avatar : data.avatar" />
      <div class="message-box">
        <div class="details">
          <span class="nickname">{{data.from === currentUser.id ? currentUser.nickname : data.nickname}}</span>
          <span class="time">{{data.createdAt}}</span>
        </div>
        <div class="content margin_t-10">
          <span v-if="data.type === 1">{{data.content}}</span>
          <el-image
            v-if="data.type === 2"
            style="width: 100px; height: 100px"
            :src="data.url"
            :preview-src-list="[data.url]" />
          <!--          <audio-->
          <!--            v-if="data.type === 3"-->
          <!--            :src="data.url"-->
          <!--            controls />-->
          <span
            style="user-select:none; white-space: pre; display: flex; align-items: center;"
            class="audio-message"
            v-if="data.type === 3 && data.from !== currentUser.id"
            @click="togglePlayback"><img src="@/assets/left_audio.png" style="width: 15px;height: 15px;"  alt=""> {{audioDuration}}</span>
          <span
            style="user-select:none; white-space: pre; display: flex; align-items: center;"
            class="audio-message"
            v-if="data.type === 3 && data.from === currentUser.id"
            @click="togglePlayback">{{audioDuration}} <img src="@/assets/right_audio.png" style="width: 15px;height: 15px;"  alt=""></span>

          <!--          <img src="@/assets/left_audio.png" style="width: 20px;height: 20px;" />-->
          <!--          <span><img :src="`@/assets/${data.from === currentUser.id ? 'right' : 'left'}_audio.png`" alt=""></span>-->
          <div class="loading-icon-box" v-show="data.loading">
            <el-icon class="loading-icon"><loading /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  props: {
    data: {
      type: Object
    }
  },
  setup(props) {
    const store = useStore()
    const currentUser = computed(() => store.state.user.user)
    const friend = computed(() => store.state.conversation.active)

    console.log('props.data = ', props.data)

    let index
    let desiredGroup = null
    let trueFriend = null
    if (friend.value.id >= 22800) {
      // 是群聊
      desiredGroup = store.state.group.groups.find(group => group.id === friend.value.id)
      index = desiredGroup.memberss.indexOf(props.data.from)
      trueFriend = {
        avatar: props.data.from === currentUser.value.id ? currentUser.value.avatar : props.to < 22800 ? friend.value.avatar : desiredGroup.avatars[index],
        nickname: props.data.from === currentUser.value.id ? currentUser.value.nickname : props.to < 22800 ? friend.value.nickname : desiredGroup.members[index]
      }
      // data.from === currentUser.id ?
      // currentUser.avatar : data.to < 22800 ? friend.avatar : trueFriend.avatar
    } else {
      // 不是群聊
      trueFriend = {
        avatar: props.data.from === currentUser.value.id ? currentUser.value.avatar : friend.value.avatar,
        nickname: props.data.from === currentUser.value.id ? currentUser.value.nickname : friend.value.nickname
      }
    }
    console.log('trueFriend = ', trueFriend)

    // ===显示优化了之后上面的这些也就没什么用了===
    const audioDuration = ref(null)
    const isPlaying = ref(false)

    let audio
    // 计算音频长度
    if (props.data.type === 3) {
      console.log('计算音频长度')
      console.log('url: ', props.data.url)
      audio = new Audio(props.data.url)
      console.log('audio: ', audio)
      audio.addEventListener('loadedmetadata', () => {
        let seconds = audio.duration
        console.log('seconds = audio.duration: ', seconds)

        // ======😢

        // 计算音频的时长
        const countAudioTime = async () => {
          while (isNaN(audio.duration) || audio.duration === Infinity) {
            // 延迟一会 不然网页都卡死
            await new Promise(resolve => setTimeout(resolve, 200))
            // 设置随机播放时间，模拟调进度条
            audio.currentTime = 10000000 * Math.random()
          }
          console.log('音频的总时长:', audio.duration)
          seconds = audio.duration
          console.log('音频的总时长:', seconds)
          seconds = seconds === Infinity ? 0 : seconds
          if (seconds && seconds !== Infinity) {
            audioDuration.value = `${ Math.floor(seconds) }"`
          } else {
            audioDuration.value = '0"'
          }

          let len = ''
          for (let i = 0; i < Math.floor(seconds); i++) {
            len += '  '
          }
          if (Math.floor(seconds) > 10) {
            len = '                    '
          }
          if (props.data.from === currentUser.value.id) {
            audioDuration.value = len + audioDuration.value
          } else {
            audioDuration.value = audioDuration.value + len
          }
          console.log('最终效果：', audioDuration.value)
        }
        countAudioTime()

        // ======
      })
    }

    // 切换播放/暂停状态
    const togglePlayback = () => {
      console.log('点击的时候的状态：', isPlaying.value)
      if (isPlaying.value) {
        console.log('正在播放，主动停止')
        audio.pause()
        isPlaying.value = !isPlaying.value
      } else {
        isPlaying.value = true
        console.log('没人播放，主动播放')
        audio = new Audio(props.data.url)
        console.log('新的，就不存在暂停和新开始的问题了')
        audio.addEventListener('loadedmetadata', () => {
          console.log('加载元数据')
          // let seconds = audio.duration
          // seconds = seconds === Infinity ? 0 : seconds
          // if (seconds && seconds !== Infinity) {
          //   audioDuration.value = `${ Math.floor(seconds) }"`
          // } else {
          //   audioDuration.value = '0"'
          // }
          //
          // let len = ''
          // for (let i = 0; i < Math.floor(seconds); i++) {
          //   len += '--'
          // }
          // if (Math.floor(seconds) > 10) {
          //   len = '--------------------'
          // }
          // if (props.data.from === currentUser.value.id) {
          //   audioDuration.value = len + audioDuration.value
          // } else {
          //   audioDuration.value = audioDuration.value + len
          // }
          // console.log('最终效果：', audioDuration.value)

          console.log('元数据加载完成')
        })
        audio.play()
        isPlaying.value = false
      }
    }

    // 监听音频播放结束事件，更新播放状态为暂停
    audio?.addEventListener('ended', () => {
      console.log('播放结束，置为false')
      isPlaying.value = false
    })

    return {
      currentUser,
      friend,
      trueFriend,
      audioDuration,
      isPlaying,
      togglePlayback
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/sass/_variable.scss';

.message-container {
  .message-wrap {
    display: flex;
    &_recipient {
      flex-direction: row;
      .message-box {
        margin-left: 10px;
        .details {
          flex-direction: row;
          .nickname {
            margin-right: 10px;
          }
        }
        .content {
          flex-direction: row;
          position: relative;
          span::before {
            content: '';
            position: absolute;
            left: -10px;
            border-right: 5px solid $activeColor;
            border-top: 5px solid transparent;
            border-left: 5px solid transparent;
            border-bottom: 5px solid transparent;
          }
        }
      }
    }
    &_sender {
      flex-direction: row-reverse;
      .message-box {
        margin-right: 10px;
        .details {
          flex-direction: row-reverse;
          .nickname {
            margin-left: 10px;
          }
        }
        .content {
          flex-direction: row-reverse;
          span::before {
            content: '';
            position: absolute;
            right: -10px;
            border-left: 5px solid $activeColor;
            border-top: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 5px solid transparent;
          }
          .loading-icon-box {
            position: relative;
            .loading-icon {
              position: absolute;
              top: 50%;
              right: 5px;
              transform: translateY(-50%);
            }
          }
        }
      }

    }
    .message-box {
      flex: 1;
      .details {
        display: flex;
        font-size: 12px;
        .nickname {
          color: $darkColor-9;
        }
        .time {
          color: $darkColor-6;
        }
      }
      .content {
        display: flex;
        span {
          position: relative;
          padding: 10px;
          font-size: 14px;
          color: $lightColor-0;
          text-align: left;
          background-color: $activeColor;
          border-radius: 4px;
          max-width: 50%;
        }
      }
    }
  }
}

.audio-message:hover {
  cursor: pointer;
}
</style>
