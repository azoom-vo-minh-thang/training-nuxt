import type { KyInstance } from 'ky';

import AuthServices from './AuthService';

const initApiServices = (ky: KyInstance) => {
  return {
    auth: new AuthServices(ky, 'auth')
  };
};

export type ApiServices = ReturnType<typeof initApiServices>;

export default initApiServices;
