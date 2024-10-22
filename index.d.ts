import type { KyInstance } from 'ky';

import type { ApiServices } from '@/services';
import type { NuxtAppAuth } from '@/types';

declare module '#app' {
  interface NuxtApp {
    $ky: KyInstance;
    $services: ApiServices;
    $auth: NuxtAppAuth;
  }

  interface PageMeta {
    auth?: 'guest' | boolean;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $ky: KyInstance;
    $services: ApiServices;
    $auth: NuxtAppAuth;
  }
}

export {};
