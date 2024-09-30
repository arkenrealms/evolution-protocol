import { initTRPC } from '@trpc/server';
import type * as Arken from '@arken/node/types';
import { inferRouterInputs, inferRouterOutputs } from '@arken/node/schema';
import { z } from 'zod';

const t = initTRPC.context<{}>().create();

export async function monitorEvolutionRealms(app) {}

class Service {}

export const service = new Service();

export const procedure = t.procedure;

export const router = t.router({
  banUser: procedure
    .input(z.object({ target: z.string(), banReason: z.string(), banExpireDate: z.string() }))
    .mutation(({ input, ctx }) => {
      return { status: 1 };
    }),

  info: procedure.query(({ input, ctx }) => {
    return { status: 1, data: { stuff: 1 } };
  }),

  auth: procedure
    .input(z.object({ data: z.any(), signature: z.object({ hash: z.string(), address: z.string() }) }))
    // .output(z.object({ status: z.number(), config: z.any() }))
    .mutation(({ input, ctx }) => {
      return { status: 1, config: {} };
    }),

  saveRound: procedure
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

  getProfile: procedure.input(z.string()).query(({ input, ctx }) => {
    return { status: 1, data: {} };
  }),
});

export type Router = typeof router;
export type RouterInput = inferRouterInputs<Router>;
export type RouterOutput = inferRouterOutputs<Router>;
