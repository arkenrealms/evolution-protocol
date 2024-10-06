import { z } from 'zod';

export const Shard = z.object({
  id: z.string(),
  name: z.string(),
  realmId: z.string(),
  endpoint: z.string(),
});
