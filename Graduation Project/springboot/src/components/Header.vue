<template>
  <div style="height: 50px; line-height: 50px; border-bottom: 1px solid #ccc; display: flex">
    <div style="width: 200px; padding-left: 30px; font-weight: bold;">后台管理</div>
    <div style="flex: 1"></div>
    <div style="width: 200px; padding-left: 30px; font-weight: bold;" class="float-right"><a class="qianduan" href="/blogMain">前端页面</a></div>
    <div style="width: 100px">
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ user.nickName }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="$router.push('/person')">个人信息</el-dropdown-item>
            <el-dropdown-item @click="$router.push('/login')">退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      user: {}
    }
  },
  created() {
    let str = sessionStorage.getItem("user") || "{}"
    this.user = JSON.parse(str)
  }
}
</script>

<style scoped>
.qianduan{
  color: rgb(170, 170, 170);
  font-size: 12px;
}
.qianduan:hover{
  color: rgb(50, 50, 50);
}
</style>
