export type SnackbarOptions = {
  visibleIcon: boolean;
  timeout: number;
  location: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'start' | 'end';
  position: 'static' | 'relative' | 'fixed' | 'absolute' | 'sticky';
  minWidth: number;
  minHeight: number;
};

export enum LoginStrategy {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  GITHUB = 'github',
}

export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type NuxtAppAuth = {
  loggedIn: Ref<boolean>;
  loginWith: (strategy: LoginStrategy, credentials?: LoginCredentials ) => Promise<boolean>;
  logout: (redirectPath?: string) => void;
}

export type AppDataError = {
  icon?: string
}

export type AppError = {
  statusCode: number
  statusMessage: string
  message: string
  data?: AppDataError
}
