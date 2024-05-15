import { onShow } from '@dcloudio/uni-app'
import { useAuthStore, useUserStore } from '../stores'
import router from '../router'

const tabbar = ['pages/home/index', 'pages/profile/index']

export function useAuth() {
  const isLogged = useUserStore().isLogged
  const setRedirect = useAuthStore().setRedirect
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  const isTab = tabbar.includes(current.route ?? '')
  // @ts-expect-error
  const fullPath = current.$page?.fullPath
  onShow(() => {
    if (!isLogged) {
      setRedirect({ tab: isTab, url: fullPath })
      router.reLaunch({ url: '/pages/index/index' })
    }
  })
}
