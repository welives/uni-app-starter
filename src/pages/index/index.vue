<script setup lang="ts">
import { request } from '@/api'
import { useAuthStore, useUserStore } from '@/stores'
import router from '@/router'

const setToken = useUserStore().setToken
const auth = useAuthStore()
async function login() {
  const res = await request('https://mock.mengxuegu.com/mock/64f5ddc4e70b8004a69e9c4c/expo-starter/login', {
    method: 'post',
  })
  setToken(res.data)
  if (auth.redirect?.url) {
    const success = () => {
      auth.clear()
    }
    auth.redirect.tab
      ? router.switchTab({
        url: auth.redirect.url,
        success,
      })
      : router.redirectTo({
        url: auth.redirect.url,
        success,
      })
  }
  else {
    router.switchTab({ url: '/pages/home/index' })
  }
}
</script>

<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <button class="my-3" @tap="login">
      Go Home
    </button>
  </view>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}
</style>
