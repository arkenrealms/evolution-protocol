import { initTRPC } from '@trpc/server';
import type * as Arken from '@arken/node/types';
import { z } from 'zod';

const t = initTRPC.context<{}>().create();

export async function monitorEvolutionRealms(app) {}

class Service {}

export const service = new Service();

export const router = t.router({
  banUser: t.procedure
    .input(z.object({ target: z.string(), banReason: z.string(), banExpireDate: z.string() }))
    .mutation(({ input, ctx }) => {
      return { status: 1 };
    }),

  info: t.procedure.query(({ input, ctx }) => {
    return { status: 1, data: { stuff: 1 } };
  }),

  saveRound: t.procedure
    .input(
      z.object({
        shardId: z.string(),
        roundId: z.number(),
        round: z.any(),
        rewardWinnerAmount: z.number(),
        lastClients: z.any(),
      })
    )
    .mutation(({ input, ctx }) => {
      return { status: 1 };
    }),

  getProfile: t.procedure.input(z.string()).query(({ input, ctx }) => {
    return { status: 1, data: {} };
  }),
});

export type Router = typeof router;
