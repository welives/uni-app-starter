import type { StorageLike } from 'pinia-plugin-persistedstate'
enum StorageSceneKey {
  USER = 'storage-user',
}

function getItem<T = any>(key: string): T {
  const value = uni.getStorageSync(key)
  return value ? JSON.parse(value) ?? null : null
}
function setItem(key: string, value: any) {
  uni.setStorageSync(key, JSON.stringify(value))
}
function removeItem(key: string) {
  uni.removeStorageSync(key)
}

export { getItem, setItem, removeItem, StorageSceneKey }

/** @description 用来覆盖pinia持久化存储的方法 */
export const piniaStorage: StorageLike = {
  getItem: (key) => {
    const value = uni.getStorageSync(key)
    return value ?? null
  },
  setItem: (key, value) => {
    uni.setStorageSync(key, value)
  },
}
