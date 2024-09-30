import z from 'zod';
import { initTRPC } from '@trpc/server';
import { log, logError, getTime, isEthereumAddress } from '@arken/node/util';
import { customErrorFormatter, transformer, hasRole, validateRequest } from '@arken/node/util/rpc';
import * as Schema from '@arken/node/schema';
import { Shard } from '../shard/shard.schema';
import type { Service, Client } from './realm.types';

const t = initTRPC
  .context<{
    client: Client;
  }>()
  .create();

export const router = t.router;
export const procedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

export const createRouter = (service?: Service) => {
  return router({
    auth: procedure
      .use(customErrorFormatter(t))
      .use(validateRequest(t))
      .input(Schema.OnlySignatureInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.auth as any)(input, ctx)),

    connectSeer: procedure
      .use(customErrorFormatter(t))
      .use(validateRequest(t))
      .input(Schema.OnlySignatureInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.connectSeer as any)(input, ctx)),

    createShard: procedure
      .use(customErrorFormatter(t))
      .use(validateRequest(t))
      .input(Schema.OnlySignatureInput)
      .output(Schema.getQueryOutput(Shard))
      .mutation(({ input, ctx }) => (service.createShard as any)(input, ctx)),

    getShards: procedure
      .use(customErrorFormatter(t))
      // .use(validateRequest(t))
      .input(Schema.getQueryInput(Shard))
      .output(Schema.getQueryOutput(z.array(Shard)))
      .query(({ input, ctx }) => (service.getShards as any)(input, ctx)),

    setConfig: procedure
      .use(customErrorFormatter(t))
      .use(hasRole('mod', t))
      .use(validateRequest(t))
      .input(
        z.object({
          data: z.object({ shardId: z.string(), config: z.record(z.any()) }),
          signature: Schema.Signature,
        })
      )
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.setConfig as any)(input, ctx)),

    ping: procedure
      .use(customErrorFormatter(t))
      .input(z.object({ id: z.string() }))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.ping as any)(input, ctx)),

    info: procedure
      .use(customErrorFormatter(t))
      // .use(hasRole('mod', t))
      // .use(validateRequest(t))
      // .input(Schema.OnlySignatureInput)
      .output(
        Schema.getQueryOutput(
          z.object({
            playerCount: z.number(),
            speculatorCount: z.number(),
            version: z.string(),
            games: z.any(),
          })
        )
      )
      .query(({ input, ctx }) => (service.info as any)(input, ctx)),

    addMod: procedure
      .use(customErrorFormatter(t))
      .use(hasRole('admin', t))
      .use(validateRequest(t))
      .input(
        z.object({
          data: z.object({ target: z.string() }),
          signature: Schema.Signature,
        })
      )
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.addMod as any)(input, ctx)),

    removeMod: procedure
      .use(customErrorFormatter(t))
      .use(hasRole('admin', t))
      .use(validateRequest(t))
      .input(
        z.object({
          data: z.object({ target: z.string() }),
          signature: Schema.Signature,
        })
      )
      .mutation(({ input, ctx }) => (service.removeMod as any)(input, ctx)),

    banClient: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(
        z.object({
          data: z.object({ target: z.string() }),
          signature: Schema.Signature,
        })
      )
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.banClient as any)(input, ctx)),

    banUser: procedure
      .use(customErrorFormatter(t))
      .use(hasRole('admin', t))
      .use(validateRequest(t))
      .input(
        z.object({
          data: z.object({ target: z.string(), banReason: z.string(), banExpireDate: z.string() }),
          signature: Schema.Signature,
        })
      )
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.banUser as any)(input, ctx)),

    // bridgeState: procedure
    //   .use(hasRole('mod', t))
    //   .use(customErrorFormatter(t))
    //   .input(Schema.OnlySignatureInput)
    //   .mutation(({ input, ctx }) => service.bridgeState()),

    unbanClient: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(
        z.object({
          data: z.object({
            target: z.string().refine(isEthereumAddress, {
              message: 'Target must be a valid Ethereum address',
            }),
          }),
          signature: Schema.Signature,
        })
      )
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.unbanClient as any)(input, ctx)),

    matchShard: procedure.input(z.void()).mutation(({ input, ctx }) => (service.matchShard as any)(input, ctx)),

    // call: procedure
    //   .use(customErrorFormatter(t))
    //   .input(
    //     z.object({
    //       data: z.object({
    //         method: z.string(),
    //       }),
    //       signature: Schema.Signature,
    //     })
    //   )
    //   .mutation(({ input, ctx }) => (service.call as any)(input)),
  });
};

export type Router = ReturnType<typeof createRouter>;
export type RouterInput = Schema.inferRouterInputs<Router>;
export type RouterOutput = Schema.inferRouterOutputs<Router>;
