enum StorageSceneKey {
  DEVICE = 'storage-device-uuid',
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
