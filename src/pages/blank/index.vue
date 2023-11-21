<template></template>
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores'
import router from '@/router'
const isLogged = useUserStore().isLogged
onLoad(() => {
  if (isLogged) {
    router.switchTab({ url: '/pages/home/index' })
  } else {
    router.reLaunch({ url: '/pages/index/index' })
  }
})
</script>
