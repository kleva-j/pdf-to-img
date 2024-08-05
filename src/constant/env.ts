import { env } from '@/env';

export const showLogger =
  env.NODE_ENV !== 'production' ? true : env.SHOW_LOGGER === 'yes' ?? false;
