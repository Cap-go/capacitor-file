import { registerPlugin } from '@capacitor/core';

import type { CapacitorFilePlugin } from './definitions';

const CapacitorFile = registerPlugin<CapacitorFilePlugin>('CapacitorFile', {
  web: () => import('./web').then((m) => new m.CapacitorFileWeb()),
});

export * from './definitions';
export { CapacitorFile };
