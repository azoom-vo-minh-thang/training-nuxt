export const DEFAULT_SNACKBAR_OPTIONS = {
  visibleIcon: true,
  timeout: 30000,
  location: 'top',
  position: 'fixed',
  minWidth: 416,
  minHeight: 56
} as const;

export const SNACKBAR_TYPE = {
  info: 'info',
  error: 'error',
  success: 'primary'
} as const;

export const LOCAL_STORAGE_KEY = {
  TOKEN: '_authToken'
}

export const ROUTES = {
  home: {
    name: 'home',
    path: '/'
  },
  login: {
    name: 'login',
    path: '/login'
  }
} as const;

export const META_AUTH = {
  guest: 'guest'
}

export const ERROR_STATUS = {
  notFound: 404
}

export const ERROR_MESSAGES = {
  page: {
    pageNotFound: 'The page you are looking for could not be found.',
    invalidUrl: 'Please check the URL and try accessing again.'
  }
}
