import z from 'zod';
import { initTRPC, TRPCError } from '@trpc/server';
import * as Schema from '@arken/node/schema';
import { Client, Service } from './bridge.types';

export type RouterContext = {
  client: Client;
};

const t = initTRPC.context<RouterContext>().create();

export const router = t.router;
export const procedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

export const createRouter = (service: Service) => {
  return router({
    // @ts-ignore
    connect: procedure.mutation(({ input, ctx }) => (service.connect as any)(input, ctx)),

    // @ts-ignore
    disconnect: procedure.mutation(({ input, ctx }) => (service.disconnect as any)(input, ctx)),

    // @ts-ignore
    seerDisconnected: procedure.query(({ input, ctx }) => (service.seerDisconnected as any)(input, ctx)),

    init: procedure
      // .input(z.object({ status: z.number() }))
      .mutation(({ input, ctx }) => (service.init as any)(input, ctx)),

    info: procedure.query(({ input, ctx }) => (service.info as any)(input, ctx)),

    configure: procedure
      .input(z.object({ clients: z.array(z.any()) })) //z.object({ clients: z.array(z.any()) }))
      .mutation(({ input, ctx }) => (service.configure as any)(input, ctx)),

    saveRound: procedure
      .input(
        z.object({
          // data: z.object({
          // status: z.number(),
          id: z.string(),
          startedAt: z.number(), // or Date if using Date objects
          endedAt: z.number().optional(),
          clients: z.array(z.any()),
          events: z.array(z.any()),
          states: z.array(z.any()),
          // }),
        })
      )
      // @ts-ignore
      .mutation(({ input, ctx }) => (service.saveRound as any)(input, ctx)),

    confirmProfile: procedure
      .input(z.object({ address: z.string() })) // z.object({ address: z.string() })) // z.object({ data: z.object({ address: z.string() }) }))
      .mutation(({ input, ctx }) => (service.confirmProfile as any)(input, ctx)),

    auth: procedure
      .input(z.object({ data: z.string(), signature: Schema.Signature }))
      .mutation(({ input, ctx }) => (service.auth as any)(input, ctx)),

    normalizeAddress: procedure
      .input(z.string()) // z.object({ address: z.string() }))
      .mutation(({ input, ctx }) => (service.normalizeAddress as any)(input, ctx)),

    getRandomReward: procedure
      // .input(z.object({ id: z.string(), data: z.any() }))
      .mutation(({ input, ctx }) => (service.getRandomReward as any)(input, ctx)),
  });
};

export type Router = ReturnType<typeof createRouter>;
export type RouterInput = Schema.inferRouterInputs<Router>;
export type RouterOutput = Schema.inferRouterOutputs<Router>;
