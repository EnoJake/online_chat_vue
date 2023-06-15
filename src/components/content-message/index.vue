<!--
 * @Description:
 * @Author: gumingchen
 * @Email: 1240235512@qq.com
 * @Date: 2021-08-14 15:05:25
 * @LastEditors: gumingchen
 * @LastEditTime: 2021-08-26 17:02:11
-->
<template>
  <div class="message">
    <div class="message-header ellipse-1">
      <div class="name">{{user.nickname}}</div>
      <div class="icon-btn-box" style="display: flex; align-items: center; height: 100%;">
        <!--        <span class="iconfont el-icon-download message-download" style="display: flex;height: 100%;align-items: center;" @click="downLoad"><img src="@/assets/download.png" style="width: 20px;height: 20px"></span>-->
        <el-icon style="font-size: 20px;" class="message-download"><Download @click="downLoad" /></el-icon>
      </div>
      <div class="icon-btn-box">
        <span :class="`iconfont icon-${detailVisible ? 'right' : 'left'}`" @click="detailHandle" />
      </div>
    </div>
    <message-list class="message-group" />
    <message-input class="message-input" />
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import MessageList from '@/components/message-list'
import MessageInput from '@/components/message-input'
import { useStore } from 'vuex'
import { parseTime2Str } from '@/utils'
import { Download } from '@element-plus/icons'

// const downloadButton = document.getElementById('downloadButton')

// downloadButton.addEventListener('click', () => {
//   console.log('下载进来了吗')
//   const textData = '这里是你要下载的文本内容'
//   const blob = new Blob([textData], { type: 'text/plain' })
//   const url = URL.createObjectURL(blob)
//
//   const downloadLink = document.createElement('a')
//   downloadLink.href = url
//   downloadLink.download = 'chat_records.txt'
//   downloadLink.click()
//
//   // 可选：在下载完成后，释放URL对象
//   setTimeout(() => {
//     URL.revokeObjectURL(url)
//   }, 100)
// })

export default defineComponent({
  components: {
    Download,
    MessageList,
    MessageInput
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    detailVisible: [Boolean]
  },
  setup(props, { emit }) {
    const store = useStore()

    const detailHandle = () => {
      emit('on-detail')
    }

    const downLoad = () => {
      console.log('props.user = ', props.user)

      let title
      if (props.user.id >= 22800) {
        title = 'group_message_from_' + props.user.nickname + '.txt'
      } else {
        title = 'private_message_with_' + props.user.nickname + '.txt'
      }

      const privateMessages = computed(() => store.state.message.privateMessages)
      const user = computed(() => store.state.user.user)

      const generateChatContent = () => {
        const chatTexts = privateMessages.value.map(message => {
          const nickname = message.nickname
          const created_at = parseTime2Str(message.created_at)
          const content = () => {
            switch (message.type) {
              case 1:
                return message.content
              case 2:
                return '[图片]' + message.url
              case 3:
                return '[语音]' + message.url
            }
          }

          console.log('查看日期格式：', parseTime2Str(created_at))
          // 根据需要进行文本拼接处理，这里仅作示例
          return `${ nickname } (${ created_at }): ${ content() }`
        })

        // 将每条聊天信息用换行符连接
        return chatTexts.join('\n')
      }

      console.log('privateMessages = ', privateMessages.value)
      const textData = generateChatContent()
      const blob = new Blob([textData], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)

      const downloadLink = document.createElement('a')
      downloadLink.href = url
      downloadLink.download = title
      downloadLink.click()

      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 100)
    }

    return {
      detailHandle,
      downLoad
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/sass/_variable.scss';

$height: 50px;

//.download-button {
//  display: inline-block;
//  width: 24px; /* 设置图片的宽度 */
//  height: 24px; /* 设置图片的高度 */
//  background-image: url('src/assets/download.png'); /* 替换为你的下载图片路径 */
//  background-size: cover; /* 根据需要调整背景图片大小适应元素尺寸 */
//  cursor: pointer;
//}

@mixin pseudo {
  content: '';
  position: absolute;
  top: 21px;
  height: 8px;
  width: 8px;
  border-top: 2px solid $darkColor-6;
  border-right: 2px solid $darkColor-6;
  cursor: pointer;
}

.message {
  display: flex;
  flex-flow: column;
  border-right: 1px solid $darkColor-7;
  overflow: hidden;
  &-header {
    position: relative;
    padding: 0 0 0 20px;
    height: $height;
    border-bottom: 1px solid $darkColor-7;
    display: flex;
    line-height: $height;
    .name {
      flex: 1;
      text-align: left;
      color: $darkColor-8;
      font-weight: bold;
    }
    .icon-btn-box {
      width: 30px;
      color: $darkColor-6;
      .iconfont {
        cursor: pointer;
        &:hover {
          color: $activeColor;
        }
      }
    }
  }
  &-group {
    flex: 1;
  }
  &-input {
    border-top: 1px solid $darkColor-7;
    height: 140px;
  }
}

.message-download:hover {
  color: $activeColor;
  cursor: pointer;
}

</style>
