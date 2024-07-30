import { initTRPC, TRPCError } from '@trpc/server';
import { ShardClient } from '../types';

const t = initTRPC
  .context<{
    client: ShardClient;
  }>()
  .create();

export const router = t.router;
export const procedure = t.procedure;

export const create = () => {};
