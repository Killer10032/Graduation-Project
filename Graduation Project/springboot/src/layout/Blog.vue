<template>
  <BlogHeader />
  <hr>
  <router-view style="flex: 1"/>
  <BlogFooter />
</template>

<script>
import "../assets/css/bootstrap.css"
import BlogHeader from "@/components/BlogHeader";
import BlogMain from "@/views/BlogMain";
import BlogFooter from "@/components/BlogFooter";
export default {
  name: "Blog",
  components: {BlogFooter, BlogMain, BlogHeader}
}
</script>
