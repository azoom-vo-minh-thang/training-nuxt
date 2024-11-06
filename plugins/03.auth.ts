import type { LoginCredentials, FacebookLoginResponse } from '@/types';
import { LoginStrategy } from '@/types';

import { LOCAL_STORAGE_KEY, ROUTES } from '@/config';

export default defineNuxtPlugin(async () => {
  const { $services } = useNuxtApp();
  const route = useRoute();
  const token = useCookie(LOCAL_STORAGE_KEY.TOKEN, {
    watch: true
  });

  const { showLoading, hideLoading } = useAppStore();
  const { fetchUser, setUser } = useAuthStore();

  if (route.meta.auth && route.meta.auth && token.value) {
    await fetchUser();
  }

  const loginWith = async (strategy: LoginStrategy, credentials?: LoginCredentials) => {
    switch (strategy) {
      case LoginStrategy.LOCAL:
        return await onLogin(credentials!);
      case LoginStrategy.GOOGLE:
        // Google login logic
        break;
      case LoginStrategy.FACEBOOK:
        return await loginFacebook();
      case LoginStrategy.GITHUB:
        // Github login logic
        break;
    }
  };

  const onLogin = async (payload: LoginCredentials) => {
    showLoading();
    const response = await $services.auth.login(payload);

    token.value = response?.token || null;

    if (token.value) {
      await fetchUser();
    }

    hideLoading();

    return !!response;
  };

  const loginFacebook = async () => {
    showLoading();
    const FB = window.FB;

    if (!FB) {
      hideLoading();
      throw new Error('Facebook SDK not loaded.');
    }

    try {
      const response = await new Promise((resolve, reject) => {
        FB.login((response: FacebookLoginResponse) => {
          if (response.authResponse) {
            resolve(response);
          }
          else {
            reject(new Error('User cancelled login or did not fully authorize.'));
          }
        });
      }) as FacebookLoginResponse;

      const { authResponse } = response || {};
      const { accessToken } = authResponse || {};

      if (!accessToken) {
        throw new Error('Facebook login failed.');
      }

      const loginResponse = await $services.auth.loginWithFacebook(accessToken);

      token.value = loginResponse?.token || null;

      if (token.value) {
        await fetchUser();
      }

      return !!loginResponse;
    }
    catch (error) {
      console.error(error);
      throw error;
    }
    finally {
      hideLoading();
    }
  };

  const logout = async (redirectPath: string = ROUTES.login.path) => {
    showLoading();
    token.value = null;
    setUser(null);
    await navigateTo(redirectPath);
    hideLoading();
  };

  const loggedIn = computed(() => token.value);

  return {
    provide: {
      auth: {
        loggedIn,
        loginWith,
        logout,
        token
      }
    }
  };
});
