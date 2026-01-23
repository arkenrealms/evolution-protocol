import { initTRPC } from '@trpc/server';
import { inferRouterInputs, inferRouterOutputs } from '../util/schema';
import { z } from 'zod';

const t = initTRPC.context<{}>().create();

export async function monitorEvolutionRealms(app) {}

export const procedure = t.procedure;

export const createRouter = (service: any) =>
  t.router({
    info: procedure.query(({ input, ctx }) => (service.info as any)(input, ctx)),

    banUser: procedure
      .input(z.object({ target: z.string(), banReason: z.string(), banExpireDate: z.string() }))
      .mutation(({ input, ctx }) => (service.banUser as any)(input, ctx)),

    // TODO: utilize service
    auth: procedure
      .input(z.object({ data: z.any(), signature: z.object({ hash: z.string(), address: z.string() }) }))
      .output(z.object({ roundId: z.number() }))
      .mutation(({ input, ctx }) => (service.auth as any)(input, ctx)),

    saveRound: procedure
      .input(
        z.object({
          shardId: z.string(),
          roundId: z.string(),
          round: z.any(),
        })
      )
      .mutation(({ input, ctx }) => (service.saveRound as any)(input, ctx)),

    getProfile: procedure.input(z.string()).query(({ input, ctx }) => (service.getProfile as any)(input, ctx)),

    updateRealm: procedure.input(z.any()).mutation(({ input, ctx }) => (service.updateRealm as any)(input, ctx)),
  });

export type Router = ReturnType<typeof createRouter>;
export type RouterInput = inferRouterInputs<Router>;
export type RouterOutput = inferRouterOutputs<Router>;
