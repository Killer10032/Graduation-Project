<template>
  <el-form class="pt-5" ref="form" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="文章内容">
      <div id="div1" style="max-width: 600px"></div>
    </el-form-item>
    <el-form-item style="float: right">
      <el-button type="primary" @click="onSubmit">立即发布</el-button>
      <el-button>退出</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

import E from 'wangeditor'
import request from "@/utils/request";
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css';
import moment from 'moment'


let editor

export default {
  name: "Editor",
  data() {
    return {
      rules: {
        title: [
          { required: true, message: '请输入标题名称', trigger: 'blur' },
          { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' }
        ]
      },
      form: {
        title: '',
        content: '',
        createTime: '',
      }
    }
  },
  methods: {
    getCurrentTime() {
      return moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    },
    onSubmit() {
      let userStr = sessionStorage.getItem("user") || "{}"
      let user = JSON.parse(userStr)
      this.form.uid = user.id
      this.form.content = editor.txt.html();
      this.form.createTime = this.getCurrentTime();
      request.post("/blog/article",this.form).then(res => {
        console.log(res)
        if(res.code == '0') {
          this.$message({
            type: "success",
            message: "新增成功"
          })
          this.form.name = ''
          this.form.content = ''
          editor.txt.clear()
          editor.destroy()
          this.$router.push('/blog')
        } else {
          this.$message({
            type: "error",
            message: res.msg
          })
        }
      })
    }
  },
  mounted() {
    editor = new E('#div1')
    editor.config.height = 500
    editor.highlight = hljs
    editor.create()
  }

}
</script>

<style scoped>

</style>
