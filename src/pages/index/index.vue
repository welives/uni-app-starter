<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" @click="login" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <button class="my-3" @click="go('/pages/download/index')">goDownload</button>
    <button @click="go('/pages/upload/index')">goUpload</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { request } from '@/api'
const title = ref('Hello')
const login = async () => {
  request('https://mock.mengxuegu.com/mock/64f5ddc4e70b8004a69e9c4c/expo-starter/login', {
    method: 'post',
    data: { test: 123 },
  }).then((res) => {
    console.log(res)
  })
}
const go = (url: string) => {
  uni.navigateTo({ url })
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
