<template>
  <nav class="navbar navbar-expand-sm navbar-light bg-nav py-0 navbar-dark fixed-top" id="navbar-sample">
                <div class="container">
                <a class="navbar-brand text-white mx-auto px-2 py-0">新闻</a>
                <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#sample">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-end" id="sample">
                    <ul class="nav navbar-nav navbar-right">
                      <li v-for="(item,i) in navList" :key="i"><a :href="item.name" class="nav-link mx-2 font-weight-bold">{{item.navItem}}</a></li>
                    </ul>
                </div>
                </div>
            </nav> 
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
.bg-nav{
  background-color: #000000CC;
  font-size: 12px;
  min-height: 44px;
}
</style>
