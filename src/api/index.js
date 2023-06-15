import service from '@/utils/request'
import { OSS_BASE_URL } from '@/utils/constants'

export function emojiApi() {
  return service({
    url: `${ OSS_BASE_URL }/im/emoji.txt`,
    method: 'get'
  })
}

export function uploadApi(params) {
  console.log('上传文件api | 这里只是用来上传音频了，图片绕过了axios')
  console.log('params = ', params)
  return service({
    url: '/im/file/upload',
    method: 'post',
    data: params
  })
}
