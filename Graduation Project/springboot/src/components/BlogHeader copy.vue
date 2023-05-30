<template>
  <div style="background-color: #000000CC;">
    <el-row :gutter="10">
      <el-col :xs="0" :sm="2" :md="3" :lg="3" :xl="1"></el-col>
      <el-col :xs="0" :sm="2" :md="3" :lg="9" :xl="11"></el-col>
      <el-col :xs="21" :sm="18" :md="14" :lg="9" :xl="11">
        <el-menu
            router
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#000000CC"
            text-color="white"
            style="font-weight: bold">
          <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">{{item.navItem}}
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :xs="3" :sm="2" :md="4" :lg="3" :xl="1">
        <el-avatar src="https://img2.baidu.com/" style="float: right; margin: 10px 10px" @click="ToPersonCenter"></el-avatar>
      </el-col>
    </el-row>
  </div>



</template>

<script>
export default {
  name: "BlogHeader",
  data() {
    return {
      navList: [
        {
          name: '/blogMain', navItem: '查看文章'},
        // {
        //   name: '/question', navItem: '党史知识答题'  },
        {
          name: '/editor', navItem: '发布文章'},
        // {
        //   name: '/personCenter', navItem: '个人中心'}
      ]
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    ToPersonCenter() {
      // this.$router.push('/personCenter')
    }
  }
}
</script>

<style scoped>

</style>
