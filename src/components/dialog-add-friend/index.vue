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
    title="添加好友"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle">
    <el-form
      :model="form"
      :rules="rules"
      ref="refForm"
      label-width="80px">
      <el-form-item label="帐号" prop="username">
        <el-input v-model="form.username" placeholder="帐号" />
      </el-form-item>
      <el-form-item label="分组" prop="groupId">
        <el-select v-model="form.groupId" placeholder="请选择分组" class="width-full">
          <el-option
            v-for="item in groups"
            :key="item.id"
            :label="item.name"
            :value="item.id" />
        </el-select>
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
import { addApi } from '@/api/friend'
import { ElMessage } from 'element-plus'

export default defineComponent({
  setup() {
    const store = useStore()

    const groups = computed(() => store.getters['friend/selectGroups'])

    const refForm = ref()
    const data = reactive({
      visible: false,
      form: {
        username: '',
        groupId: ''
      }
    })
    const rules = reactive(function() {
      return {
        username: [{ required: true, message: '请输入帐号', trigger: 'blur' }],
        groupId: [{ required: true, message: '请选择分组', trigger: 'change' }]
      }
    }())

    const init = () => {
      console.log('没错，你们说的init()函数就是我，我通过自己设置自己的响应式属性来让自己可视化')
      data.visible = true
    }

    const submit = () => {
      console.log('提交好友申请信息，并对表单数据进行校验')
      refForm.value.validate(valid => {
        if (valid) {
          const params = {
            username: data.form.username,
            group_id: data.form.groupId
          }
          console.log('这里直接在组件里面调用api，而不是封装在store里面，为什么呀')
          console.log('自己定义了一下参数 params，因为没有人再给我封装了')
          addApi(params).then(r => {
            if (r) {
              ElMessage({
                message: '已申请添加对方为好友！',
                type: 'success'
              })
              data.visible = false
              console.log('加完了好友之后把自己设置为不可见，那还真是优雅啊')
              store.dispatch('friend/getApplys')
              console.log('为什么，这是为什么，为什么加完了友友之后自己调了一下好友申请的api啊')
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
      console.log('重置表单。该方法可以将 Form 表单中的所有数据还原为初始值，同时清除表单中已经设置的校验信息。')
      console.log('表单确实是只有一个，但是可以洗干净了再用')
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
