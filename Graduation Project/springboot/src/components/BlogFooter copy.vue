<template>
  <div style="background-color: #FF3030">
    <el-row :gutter="10">
      <el-col :xs="1" :sm="3" :md="4" :lg="5" :xl="6"></el-col>
      <el-col :xs="20" :sm="18" :md="16" :lg="14" :xl="12">
        <div class="block">
          <el-image
              style="width: 100px; height: 100px; border-radius: 5px;margin: 10px 0px"
              :src="url"></el-image>
        </div>
      </el-col>
      <el-col :xs="1" :sm="3" :md="4" :lg="5" :xl="6"></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "BlogFooter",
  data() {
    return {
      url: 'https://img2.baidu.com/',
    }
  }
}
</script>

<style scoped>

</style>
