<template>

  <el-Progress
    :percentage="percent"
    type="line"
    class="microphone-bar"
    :class="{'microphone-bar-hidden':isRecording}"
    :stroke-width="15">
    <el-row>

      <p v-text="format" />
      <el-button @click="ywySendRecord"   class="microphone-button">发送</el-button>
      <el-button @click="stopRecording"  class="microphone-button">取消</el-button>
    </el-row>

  </el-Progress>

  <div :class="`message-input-container${focus ? ' highlight' : ''}`">
    <div style="align-items: center; display: flex;" class="tool-box">
      <el-popover
        placement="top"
        :width="400"
        trigger="click">
        <template #reference>
          <span class="iconfont icon-smile" />
        </template>
        <el-scrollbar class="emoji-scrollbar">
          <div class="emoji-group">
            <div
              class="emoji"
              v-for="(emoji, index) in emojis"
              :key="index"
              @click="content += emoji">{{ emoji }}</div>
          </div>
        </el-scrollbar>
      </el-popover>
      <el-upload
        class="image-upload"
        :action="uploadApi()"
        :show-file-list="false"
        :on-success="uploadSuccessHandle"
        :headers="{
          [TOKEN_KEY]: token
        }">
        <span class="iconfont icon-image" />
      </el-upload>

      <el-icon @click="startRecording" style="font-size: 20px;" class="input-microphone"><microphone /></el-icon>

      <!--
 <el-popover
        placement="top"
        :width="400"
        trigger="click">
        <template #reference>
          <el-icon  style="font-size: 20px;" class="input-microphone"><microphone /></el-icon>
        </template>

        <div>

          <button @click="startRecording">开始录音</button>
          <button @click="stopRecording">停止录音</button>
          <button @click="playRecording">播放录音</button>
          <button @click="sendRecording">发送录音</button>
        </div>
      </el-popover>
-->
    </div>
    <div class="textarea padding_t-10">
      <el-input
        v-model="content"
        type="textarea"
        resize="none"
        rows="4"
        @focus="focus = !focus"
        @blur="focus = !focus"
        @keydown="listener" />
      <el-tooltip effect="dark" placement="top-end" content="按Enter发送消息，Shift+Enter换行">
        <span class="iconfont icon-send" @click="submit" />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { getUUID } from '@/utils'
import { emojiApi } from '@/api'
import { uploadApi } from '@/api/user'
import { uploadApi as uploadFile } from '@/api/index'
import { SUCCESS_CODE, TOKEN_KEY } from '@/utils/constants'
import { ElMessage, ElProgress } from 'element-plus'
import { Microphone } from '@element-plus/icons'

export default defineComponent({
  components: { Microphone, ElProgress },
  // methods:{
  //   format(percentage) {
  //       return percentage === 50 ? '满' : `${percentage}%`;
  //     }
  // },
  setup() {
    const store = useStore()

    const token = computed(() => store.state.user.token.token)

    const user = computed(() => store.state.user.user)

    const data = reactive({
      content: '',
      focus: false,
      isRecording: true,
      format: '0s',
      percent: 0,
      timer: null,
      emojis: '😃 😄 😁 😆 😅 🤣 😂 🙂 🙃 😉 😊 😇 😍 🤩 😘 😗 ☺️ 😚 😙 😋 😛 😜 🤪 😝 😝 🤗 🤭 🤫 🤔 🤐 🤨 😐 😑 😶 😏 😒 🙄 😬 🤥 😌 😔 😪 🤤 😴 😷 🤒 🤕 🤢 🤮 🤧 😵 🤯 🤠 😎 🤓 🧐 😕 😟 🙁 ☹️ 😮 😯 😲 😳 😦 😧 😨 😰 😥 😢 😭 😱 😖 😣 😞 😓 😩 😫 😤 😡 😠 🤬 😈 👿 💀 ☠️ 🤡 👹 👺 👻 👽 🙈 🙉 🙊 💋 💌 💘 💝 💖 💗 💓 💞 💕 💔 ❤️ 🧡 💛 💚 💙 💜 🖤 💬 🤳 👃 👅 👄 👶 🧒 👋 🤚 🖐️ ✋ 🖖 👌 ✌️ 🤞 🤟 🤘 🤙 👈 👉 👆 🖕 👇 ☝️ 👍 ⬆️ ➡️ ⬇️ ⬅️ ↩️ ↪️ ⤴️ ⤵️ 🔃 🔄 🔙 🔚 🔛 🔜 🔝 🔀 🔁 🔂 ▶️ ⏩ ⏭️ ⏯️ ◀️ ⏪ ⏮️ 🔼 ⏫ 🔽 ⏬'.split(' ')
    })

    /**
     * 获取emoji表情
     */
    const getEmoji = () => {
      emojiApi().then(r => {
        if (r) {
          data.emojis = r.split(' ')
        }
      })
    }

    /**
     * 参数处理
     */
    const paramsHandle = (type = 1, messageType = 1, url = '') => {
      const params = {
        message: {
          ack: getUUID(), // ack 消息确认
          from: store.state.user.user.id, // 当前用户ID
          to: store.state.conversation.active.id, // 接收者ID
          type: type, // 消息类型 1-私聊 2-群聊 此字段废弃，因为不是根据这个来判断是否是私聊，群聊了，倒不如把这个字段改成消息类型
          messageType: messageType, // 发送消息类型 1-text 2-image 3-file
          content: messageType === 1 ? data.content : '', // 消息内容 messageType = 1
          url: url, // 资源路径 messageType = 2 | 3
          avatar: user.value.avatar,
          nickname: user.value.nickname
        }
      }
      return params
    }

    /**
     * 发送
     */
    const submit = () => {
      if (data.content === '' || data.content.match(/^\s+$/)) return

      // 在submit里面测试群聊信息是否正确获取
      console.log('在submit里面测试群聊信息是否正确获取')
      const groups = computed(() => store.state.group.groups)
      console.log('groups = ', groups.value)
      store.dispatch('websocket/send', paramsHandle(1, 1))
      data.content = ''
      store.dispatch('message/updateScrollBottom')
    }

    /**
     * 图片上传成功事件
     */
    const uploadSuccessHandle = (res, _file) => {
      console.log('图片上传测试，这个res是什么鬼东西：res = ', res)
      console.log('res.data = ', res.data)
      console.log('res.data.url = ', res.data.url)
      if (SUCCESS_CODE.includes(res.code)) {
        store.dispatch('websocket/send', paramsHandle(2, 2, res.data.url))
        store.dispatch('message/updateScrollBottom')
      } else {
        ElMessage({
          message: res.message,
          type: 'warning'
        })
      }
    }

    /**
     * 监听textarea 键盘事件 取消回车换行 改为 shift+回车 换行
     */
    const listener = (e) => {
      if (e.keyCode === 13) {
        if (!e.shiftKey) {
          submit()
          e.preventDefault()
          return false
        }
      }
    }

    let mediaRecorder = null
    let recordedChunks = []

    // ===辅助===

    // 请求麦克风权限
    const requestMicrophonePermission = () => {
      console.log('请求麦克风权限')
      return navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          stream.getTracks().forEach(track => track.stop())
          return true // 用户授权了麦克风权限
        })
        .catch(error => {
          console.error('无法获取麦克风权限:', error)
          return false // 用户拒绝了麦克风权限
        })
        .catch(error => {
          console.error('请求麦克风权限失败：', error)
        })
    }

    // 检测麦克风权限状态
    const checkMicrophonePermission = () => {
      console.log('检测麦克风权限状态')
      return navigator.permissions.query({ name: 'microphone' })
        .then(permissionStatus => {
          console.log('permissionStatus = ', permissionStatus)
          if (permissionStatus.state === 'granted') {
            console.log('麦克风已授权')
            return true // 麦克风权限已授权
          } else if (permissionStatus.state === 'prompt') {
            console.log('麦克风权限尚未授权，请求授权')
            return requestMicrophonePermission() // 麦克风权限尚未授权，请求授权
          } else {
            console.log('麦克风权限已拒绝')
            return false // 麦克风权限已拒绝
          }
        })
        .catch(error => {
          console.error('检测麦克风权限失败：', error)
        })
    }

    // ===辅助===

    // ====测试语音聊天====
    const startRecording = () => {
      console.log('尝试录音')
      checkMicrophonePermission()
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          console.log('成功获取麦克风权限')
          recordedChunks = []
          mediaRecorder = new MediaRecorder(stream)

          console.log('增加保存录音的事件监听器')
          mediaRecorder.addEventListener('dataavailable', event => {
            recordedChunks.push(event.data)
          })

          console.log('开始录音')
          data.isRecording = false
          mediaRecorder.start()
          if (mediaRecorder == null) {
            console.log('根本没在录音，计个屁的时啊!')
          } else {
            let time = 0
            data.timer = setInterval(() => {
              if (time < 60) {
                console.log(time)
                time = time + 1
                data.format = time + 's'
                data.percent = time / 60 * 100
                console.log('timer is runnig!')
              } else {
                console.log('时间到！')
                ywySendRecord()
                console.log('录音停止啦')
                console.log('录音发送出去啦')
                stopTimer()
              }
            }, 1000)
          }
        })
        .catch(error => {
          console.error('获取麦克风访问权限失败：', error)
        })
    }

    const stopRecording = () => {
      console.log('尝试停止录音')
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        console.log('停止录影，导出音频')
        mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' })
          // 将音频 Blob 发送给服务器或其他聊天参与者
        })

        console.log('正式停止录音')
        mediaRecorder.stop()
        stopTimer()
      }
    }
    const stopTimer = () => {
      if (data.timer != null) {
        clearInterval(data.timer)
        data.timer = null
      }
      data.isRecording = true
      data.percent = 0
      data.format = '0s'
    }

    const playRecording = () => {
      console.log('尝试播放录音')
      if (recordedChunks.length > 0) {
        console.log('获取音频')
        console.log('音频本体输出：', recordedChunks)
        const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' })
        console.log('audioBlob二进制数据的对象封装：', audioBlob)
        const audioUrl = URL.createObjectURL(audioBlob)
        console.log('临时的audioUrl路径：', audioUrl)
        const audioElement = new Audio(audioUrl)
        console.log('用新生成的url来生成 《audio》 好家伙', audioElement)
        console.log('正式播放录音')
        audioElement.play()
      }
      console.log('无音频或播放完毕 | (异步播放)')
    }

    const sendRecording = () => {
      stopTimer()
      console.log('尝试发送录音')
      if (recordedChunks.length > 0) {
        console.log('获取音频')
        const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' })
        const formData = new FormData()
        formData.append('file', audioBlob, 'recording.webm')

        uploadFile(formData)
          .then(r => {
            if (r) {
              console.log('上传音频之后的r: ', r)
              console.log('r.data.url: ', r.data.url)
              store.dispatch('websocket/send', paramsHandle(3, 3, r.data.url))
              store.dispatch('message/updateScrollBottom')
            } else {
              ElMessage({
                message: r.message,
                type: 'warning'
              })
            }
          })
          .catch(r => {
            console.error('上传文件失败：', r.members)
          })
      } else {
        console.log(recordedChunks.length)
        console.log('这么短怎么发啊？!')
      }
    }
    function ywySendRecord () {
      stopRecording()
      console.log('录音被停止啦')
      setTimeout(() => {
        sendRecording()
        console.log('我等了一下再发送')
      }, 100)
    }

    // ==================

    onMounted(() => {
      // getEmoji()
    })

    return {
      ...toRefs(data),
      focus,
      listener,
      submit,
      uploadApi,
      uploadSuccessHandle,
      TOKEN_KEY,
      token,
      startRecording,
      stopRecording,
      playRecording,
      sendRecording,
      ywySendRecord
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/sass/_variable.scss';
.highlight {
  background-color: $lightColor-0;
}
.message-input-container {
  padding: 3px 20px 20px 20px;
  text-align: left;
  .tool-box {
    .iconfont {
      font-size: 20px;
      cursor: pointer;
    }
    .iconfont {
      margin-right: 10px;
    }
    .image-upload {
      display: inline;
    }
  }
  .textarea {
    position: relative;
    ::v-deep(.el-textarea__inner) {
      padding: 0;
      border: none;
      background: transparent;
    }
    .iconfont {
      position: absolute;
      right: -16px;
      bottom: -16px;
      font-size: 24px;
      color: $activeColor;
      cursor: pointer;
    }
    ::-webkit-scrollbar {
      display: none;
    }
  }
}
.emoji-scrollbar {
  height: 200px;
  .emoji-group {
    display: flex;
    flex-wrap: wrap;
    .emoji {
      flex:0 0 auto;
      width: 34px;
      font-size: 22px;
      cursor: pointer;
    }
  }
}
.input-microphone:hover {
  cursor: pointer;
}
.microphone-bar {
  height: 20px;
  size: 20px;
}
.microphone-bar-hidden{
  visibility: hidden;
}
.microphone-button{
  height: 10%;
  font-size: 5px;
  margin:0;
}

</style>
