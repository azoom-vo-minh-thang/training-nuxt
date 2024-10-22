import { ROUTES, META_AUTH } from '@/config'

export default defineNuxtRouteMiddleware(to => {
  const { $auth } = useNuxtApp()

  const isGuest = to.meta.auth === META_AUTH.guest

  if (isGuest) {
    if ($auth.loggedIn.value) {
      return navigateTo(ROUTES.home.path)
    }

    return
  }

  if (to.meta.auth && !$auth.loggedIn.value && to.name !== ROUTES.login.name) {
    return navigateTo(ROUTES.login.path)
  }
})
