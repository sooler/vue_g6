<template>
  <div>
    <el-row>
      <el-button @click="open1">打开通知</el-button>
      <el-button type="primary" @click="state.dialogVisible = true">弹框</el-button>
      <el-button type="success" @click="open2">打开对话框</el-button>
      <el-button type="info" @click="open3">通知消息</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
    </el-row>
    <el-dropdown>
  <span class="el-dropdown-link">
    下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item disabled>双皮奶</el-dropdown-item>
          <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dialog
        title="提示"
        v-model="state.dialogVisible"
        width="30%"
        :before-close="handleClose">
      <span>这是一段信息</span>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="state.dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="state.dialogVisible = false">确 定</el-button>
    </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, reactive} from 'vue';
import { ElMessage,ElMessageBox,ElNotification} from 'element-plus'

export default defineComponent({
  setup() {  // setup钩子函数
    // 使用响应式函数reactive构建proxy响应式对象state
    const state = reactive({
      msg: '时光',
      dialogVisible:false
    })
    console.log(state); // state对象是一个proxy拦截对象
    let info = 'hello'; // info是一个普通对象，修改后不会被proxy拦截，进而页面也不会动态更新
    const changeMsg = () => { // 在外边定义methods
      state.msg = '时光，你好'
      info = 'hello，你好'
    }
    let open1=() =>{
      ElMessage({
        message: '恭喜你，这是一条成功消息',
        type: 'success'
      })
    }
    let open2=() =>{
      ElMessageBox.alert('这是一段内容', '标题名称', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${ action }`
          });
        }
      })
    }
    let open3=() =>{
      ElNotification({
        title: '标题名称',
        message: '这是提示文案'
      })
    }
    return {  // 使用时，要把对象return出去，才能在template中使用
      state,
      info,
      changeMsg,
      open1,
      open2,
      open3
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>