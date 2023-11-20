<template>
  <view>
    <view class="flex justify-center items-center my-10">
      <text>{{ title }}</text>
    </view>
    <view>
      <view class="demo">
        <block v-if="imageSrc">
          <image :src="imageSrc" class="image" mode="widthFix"></image>
        </block>
        <block v-else>
          <view class="uni-hello-addfile" @click="chooseImage">+ 选择图片</view>
        </block>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { upload } from '@/api'
const title = ref('uploadFile')
const imageSrc = ref('')
onLoad(() => {
  imageSrc.value = ''
})

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success: (files) => {
      imageSrc.value = files.tempFilePaths[0]
      upload(
        'https://unidemo.dcloud.net.cn/upload',
        { filePath: files.tempFilePaths[0], name: 'file' },
        {
          onUploadProgress: ({ loaded, total }) => {
            const progress = total ? (loaded / total) * 100 : 0
            console.log(`${progress.toFixed(2)}%`)
          },
        }
      ).then((res) => {
        console.log(res)
        uni.showToast({
          title: '上传成功',
          icon: 'success',
          duration: 1000,
        })
        imageSrc.value = files.tempFilePaths[0]
      })
    },
    fail: (err) => {
      console.log('chooseImage fail', err)
    },
  })
}
</script>

<style scoped>
.image {
  width: 100%;
}

.demo {
  background: #f5f5f5;
  padding: 50rpx;
}
.uni-hello-addfile {
  text-align: center;
  line-height: 300rpx;
  background: #fff;
  padding: 50rpx;
  margin-top: 10px;
  font-size: 38rpx;
  color: #808080;
}
</style>
