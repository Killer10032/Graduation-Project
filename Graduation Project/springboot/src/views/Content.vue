<template>
  <el-container style="box-shadow: 5px 5px 18px #404040">
    <el-header>
      <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; margin-top: 10px">
        <h1>{{form.title}}</h1>
      </div>
      <div style="display: flex; justify-content: center; align-items: center">{{form.createTime}}</div>
    </el-header>
    <el-main v-loading="loading">
      <div v-html="form.content" style="margin: 20px 15px; min-height: 240px"></div>
    </el-main>
    <el-footer>
      <div style="width: 100%; height: 100%"></div>
    </el-footer>
  </el-container>
</template>


<script>


import 'highlight.js/styles/monokai-sublime.css'
import request from "@/utils/request";
import '@/assets/css/content.css'

export default {
  name: "Content",
  data() {
    return {
      loading: true,
      articleId: 0,
      form: {
        title: '',
        createTime: '',
        content: ''
      }
    }
  },
  methods: {

  },
  created() {
    this.articleId = this.$route.params.articleId
    request.get("/blog/getArticleById", {
      params: {
        aid: this.articleId
      }
    }).then(res => {
      this.loading = false
      console.log(res)
      this.form = res.data
    })

  }
}
</script>

<style scoped>

</style>
