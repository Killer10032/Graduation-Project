<template>
  <el-row :gutter="10" v-loading="loading" style="min-height: 480px">
    <el-col :xs="1" :sm="2" :md="3" :lg="4" :xl="5"></el-col>
    <el-col :xs="22" :sm="20" :md="14" :lg="16" :xl="14">
      <el-card :body-style="{ padding: '20px' }" v-for="(item, index) in articles" :key="item.aid" style="margin-top: 20px; margin-bottom: 20px">
        <img :src="item.img" class="image">
        <div style="padding: 14px;">
          <span>{{item.title}}</span>
          <div class="bottom clearfix">
            <time class="time">{{item.createTime}}</time>
            <el-button type="text" class="button" @click="ToContent(item.aid)" style="color: red">查看详细内容</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="1" :sm="2" :md="3" :lg="4" :xl="5"></el-col>
  </el-row>
<!--  <el-pagination-->
<!--      @size-change="handleSizeChange"-->
<!--      @current-change="handleCurrentChange"-->
<!--      :current-page="currentPage"-->
<!--      :page-sizes="[5, 10, 20]"-->
<!--      :page-size="pageSize"-->
<!--      layout="total, sizes, prev, pager, next, jumper"-->
<!--      :total="total"-->
<!--      align="center"-->
<!--      style="margin-bottom: 10px">-->
<!--  </el-pagination>-->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20]"
      :page-size="pageSize"
      layout=" prev, pager, next"
      :total="total"
      align="center"
      style="margin-bottom: 10px">
  </el-pagination>

</template>

<script>


import request from "@/utils/request";

export default {
  name: "BlogMain",
  data() {
    return {
      loading: true,
      currentPage: 1,
      pageSize: 5,
      total: 0,
      articles: {}
    };
  },
  methods: {
    ToContent(id) {
      this.$router.push({
        name: 'Content',
        params: {
          articleId: id
        }
      })
    },
    load() {
      this.loading = true
      request.get("/blog/articlePage", {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        }
      }).then(res => {
        this.loading = false
        this.total = res.data.total
        this.articles = res.data.records
      })
    },
    handleSizeChange(pageSize) {   // 改变当前每页的个数触发
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {  // 改变当前页码触发
      this.currentPage = pageNum
      this.load()
    }
  },
  created() {
    this.load()
  }

}
</script>

<style scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}





</style>
