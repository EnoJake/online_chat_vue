<!--
 * @Description:
 * @Author: gumingchen
 * @Email: 1240235512@qq.com
 * @Date: 2021-08-18 10:08:51
 * @LastEditors: gumingchen
 * @LastEditTime: 2021-08-31 20:25:19
-->
<template>
  <el-dialog
    width="500px"
    title="添加群聊"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle">
    <el-form
      :model="form"
      :rules="rules"
      ref="refForm"
      label-width="80px">
      <!-- @submit.native.prevent @keyup.enter.native="submit()" -->
      <el-form-item style="margin-bottom:0;display:none;">
        <el-input />
      </el-form-item>
      <el-form-item label="名称" prop="username">
        <el-input v-model="form.username" placeholder="请输入群聊名称" />
      </el-form-item>
      <el-form-item>
        <el-button class="width-full" type="primary" @click="submit()">
          确认
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { addApi } from '@/api/group'
import { ElMessage } from 'element-plus'

export default defineComponent({
  setup() {
    const store = useStore()

    const groups = computed(() => store.getters['friend/selectGroups'])

    const refForm = ref()
    const data = reactive({
      visible: false,
      form: {
        username: ''
      }
    })
    const rules = reactive(function() {
      return {
        username: [{ required: true, message: '请输入群聊名称', trigger: 'blur' }]
      }
    }())

    const init = () => {
      data.visible = true
      console.log('内部初始化完成唤醒')
    }

    const submit = () => {
      console.log('群聊添加而不是创建提交情况')
      refForm.value.validate(valid => {
        if (valid) {
          addApi(data.form.username).then(r => {
            if (r) {
              ElMessage({
                message: '添加群聊成功！',
                type: 'success'
              })
              data.visible = false
              store.dispatch('group/getGroups')
              console.log('若成功添加群聊，则重新获取群聊信息，当然也可以只添加一个')
            }
          })
        }
      })
    }

    /**
     * @description: 弹窗关闭动画结束时的回调
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const dialogClosedHandle = () => {
      console.log('重置群聊添加表单')
      refForm.value.resetFields()
    }

    return {
      refForm,
      groups,
      ...toRefs(data),
      rules,
      init,
      submit,
      dialogClosedHandle
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/sass/_variable.scss';

</style>
