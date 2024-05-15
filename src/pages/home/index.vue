<script setup lang="ts">
import { useAuth } from '@/hooks'
import { useCounterStore } from '@/stores'

useAuth()
const counter = useCounterStore()
</script>

<template>
  <view class="flex flex-1 flex-wrap flex-col items-center justify-center gap-4 h-full">
    <text>Home Page</text>
    <!-- #ifdef MP-WEIXIN -->
    <van-button type="primary">
      这个是Vant-Weapp的组件
    </van-button>
    <!-- #endif -->
    <view class="text-center">
      <button @tap="counter.decrement">
        Dec
      </button>
      <text>{{ counter.count }}</text>
      <button @tap="counter.increment">
        Inc
      </button>
    </view>
  </view>
</template>
