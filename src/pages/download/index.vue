<template>
  <view>
    <view class="flex justify-center items-center my-10">
      <text>{{ title }}</text>
    </view>
    <view class="px-4">
      <view v-if="imageSrc" class="image-container">
        <image class="img" :src="imageSrc" mode="center" />
      </view>
      <block v-else style="margin-top: 50px">
        <view class="mb-2"> 点击按钮下载服务端示例图片（下载网络文件到本地临时目录） </view>
        <view class="py-2">
          <button @tap="downloadImage">下载</button>
        </view>
      </block>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { download } from '@/api'
const title = ref('downloadFile')
const imageSrc = ref('')
onLoad(() => {
  imageSrc.value = ''
})
const downloadImage = () => {
  const url =
    UNI_PLATFORM === 'h5' ? '/api/unidoc/zh/uni-app.png' : 'https://web-assets.dcloud.net.cn/unidoc/zh/uni-app.png'
  download(url, {
    onDownloadProgress: ({ loaded, total }) => {
      const progress = total ? (loaded / total) * 100 : 0
      console.log(`${progress.toFixed(2)}%`)
    },
  }).then((res) => {
    console.log(res)
    imageSrc.value = res
  })
}
</script>

<style scoped>
.img {
  width: 500rpx;
  height: 500rpx;
  margin: 0 auto;
}
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
