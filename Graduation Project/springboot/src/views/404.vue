<template>
  <div :style="{backgroundImage: 'url('+img_404+')' }"
       style="
      background-size: 100% 100%;
      height: 100%;
      position: fixed;
      width: 100%">

  </div>
</template>

<script>

import img_404 from '@/assets/404_images/404.png'
import img_404_cloud from '@/assets/404_images/404_cloud.png'


export default {
  name: "404",
  data() {
    return {
      img_404,
      img_404_cloud
    }
  }
}
</script>

<style scoped>
</style>

