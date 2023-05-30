<template>
  <el-button @click="clickLiked">
    点赞
  </el-button>
  <div>
    <mavon-editor></mavon-editor>
  </div>
  <span>{{liked == 1 ? "like" : "unlike"}}</span>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "likeTest",
  data() {
    return {
      liked: 0
    }
  },
  methods: {
    clickLiked() {
      request.get("/like/1/1/"+this.liked).then(res => {
        if (res.code == 0)
          this.liked = this.liked == 0 ? 1 : 0
        console.log(res)
      })
    }
  }

}
</script>

<style scoped>

</style>
