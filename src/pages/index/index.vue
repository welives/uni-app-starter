<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <button class="my-3" @tap="login">Go Home</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { request } from '@/api'
import { useUserStore } from '@/stores'
const { setToken } = useUserStore()
const title = ref('Hello')
const login = async () => {
  const res = await request('/api/login', { method: 'post' })
  setToken(res.data)
  uni.switchTab({ url: '/pages/home/index' })
}
</script>

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

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
