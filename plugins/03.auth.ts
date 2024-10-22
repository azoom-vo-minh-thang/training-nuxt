import { LoginStrategy, type LoginCredentials } from '@/types'

import { LOCAL_STORAGE_KEY, ROUTES } from '@/config'

export default defineNuxtPlugin(async () => {
  const { $services } = useNuxtApp()
  const route = useRoute()
  const token = useCookie(LOCAL_STORAGE_KEY.TOKEN, {
    watch: true
  })

  const { showLoading, hideLoading } = useAppStore()
  const { fetchUser, setUser } = useAuthStore()

  if (route.meta.auth && route.meta.auth !== 'guest' && token.value) {
    await fetchUser()
  }

  const loginWith = async (strategy: LoginStrategy, credentials?: LoginCredentials) => {
    switch (strategy) {
      case LoginStrategy.LOCAL:
        return await onLogin(credentials!)
      case LoginStrategy.GOOGLE:
        // Google login logic
        break
      case LoginStrategy.FACEBOOK:
        // Facebook login logic
        break
      case LoginStrategy.GITHUB:
        // Github login logic
        break
    }
  }

  const onLogin = async (payload: LoginCredentials) => {
    showLoading()
    const response = await $services.auth.login(payload)

    token.value = response?.token || null

    if (token.value) {
      await fetchUser()
    }

    hideLoading()

    return !!response
  }

  const logout = async (redirectPath: string = ROUTES.login.path) => {
    showLoading()
    token.value = null
    setUser(null)
    await navigateTo(redirectPath)
    hideLoading()
  }

  const loggedIn = computed(() => token.value)

  return {
    provide: {
      auth: {
        loggedIn,
        loginWith,
        logout
      }
    }
  }
})
