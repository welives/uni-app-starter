interface Redirect {
  url: string
  tab?: boolean
}
interface AuthState {
  redirect: Redirect | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({ redirect: null }),
  actions: {
    setRedirect(value: Redirect) {
      this.redirect = value
    },
    clear() {
      this.redirect = null
    },
  },
})
