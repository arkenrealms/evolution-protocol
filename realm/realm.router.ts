import z from 'zod';
import { initTRPC } from '@trpc/server';
import { customErrorFormatter, transformer, hasRole, validateRequest } from '../util/rpc';
import * as Schema from '../util/schema';
import { Shard } from '../shard/shard.schema';
import type { Service, Client } from './realm.types';

export const isEthereumAddress = (address: string) => {
  // Regular expression to check if the string is a valid Ethereum address
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

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
      .input(Schema.SignedData)
      .use(customErrorFormatter(t))
      .use(validateRequest(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.auth as any)(input, ctx)),

    claimMaster: procedure
      .input(
        z.object({
          data: z.object({ id: z.string() }),
          signature: Schema.Signature,
        })
      )
      .use(customErrorFormatter(t))
      // .use(hasRole('Master', t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.claimMaster as any)(input, ctx)),

    connectSeer: procedure
      .use(customErrorFormatter(t))
      // .use(validateRequest(t))
      // .input(Schema.OnlySignatureInput)
      .output(z.object({ message: z.string() }))
      .mutation(({ input, ctx }) => (service.connectSeer as any)(input, ctx)),

    createShard: procedure
      .use(customErrorFormatter(t))
      // .use(validateRequest(t))
      // .input(Schema.OnlySignatureInput)
      .output(z.object({ data: Shard.optional(), message: z.string().optional(), error: z.string().optional() })) // Schema.getQueryOutput(Shard))
      .mutation(({ input, ctx }) => (service.createShard as any)(input, ctx)),

    getShards: procedure
      .use(customErrorFormatter(t))
      // .use(validateRequest(t))
      .input(Schema.getQueryInput(Shard))
      .output(z.array(Shard)) // Schema.getQueryOutput(z.array(Shard)))
      .query(({ input, ctx }) => (service.getShards as any)(input, ctx)),

    setConfig: procedure
      .use(customErrorFormatter(t))
      .use(hasRole('mod', t))
      .use(validateRequest(t))
      .input(
        z.object({ shardId: z.string(), config: z.record(z.any()) })
        // z.object({
        //   data: z.object({ shardId: z.string(), config: z.record(z.any()) }),
        //   signature: Schema.Signature,
        // })
      )
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.setConfig as any)(input, ctx)),

    ping: procedure
      .use(customErrorFormatter(t))
      .input(z.object({ id: z.string() }))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.ping as any)(input, ctx)),

    info: procedure
      .use(customErrorFormatter(t))
      // .use(hasRole('mod', t))
      // .use(validateRequest(t))
      // .input(Schema.OnlySignatureInput)
      .output(
        // Schema.getQueryOutput(
        z.object({
          playerCount: z.number(),
          speculatorCount: z.number(),
          version: z.string(),
          authorizedProfile: z
            .object({
              id: z.string(),
            })
            .optional(),
          isSeerConnected: z.boolean(),
          games: z.any(),
        })
        // )
      )
      .query(({ input, ctx }) => (service.info as any)(input, ctx)),

    broadcast: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(z.string())
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.broadcast as any)(input, ctx)),

    addMod: procedure
      .use(customErrorFormatter(t))
      .use(hasRole('admin', t))
      .use(validateRequest(t))
      .input(
        z.object({ target: z.string() })
        // z.object({
        //   data: z.object({ target: z.string() }),
        //   signature: Schema.Signature,
        // })
      )
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.addMod as any)(input, ctx)),

    removeMod: procedure
      .use(customErrorFormatter(t))
      .use(hasRole('admin', t))
      .use(validateRequest(t))
      .input(
        z.object({ target: z.string() })
        // z.object({
        //   data: z.object({ target: z.string() }),
        //   signature: Schema.Signature,
        // })
      )
      .mutation(({ input, ctx }) => (service.removeMod as any)(input, ctx)),

    banClient: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(
        z.object({ target: z.string() })
        // z.object({
        //   data: z.object({ target: z.string() }),
        //   signature: Schema.Signature,
        // })
      )
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.banClient as any)(input, ctx)),

    banUser: procedure
      .use(customErrorFormatter(t))
      .use(hasRole('admin', t))
      .use(validateRequest(t))
      .input(
        z.object({ target: z.string(), banReason: z.string(), banExpireDate: z.string() })
        // z.object({
        //   data: z.object({ target: z.string(), banReason: z.string(), banExpireDate: z.string() }),
        //   signature: Schema.Signature,
        // })
      )
      // .output(Schema.NoDataOutput)
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
          target: z.string().refine(isEthereumAddress, {
            message: 'Target must be a valid Ethereum address',
          }),
        })
        // z.object({
        //   data: z.object({
        //     target: z.string().refine(isEthereumAddress, {
        //       message: 'Target must be a valid Ethereum address',
        //     }),
        //   }),
        //   signature: Schema.Signature,
        // })
      )
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.unbanClient as any)(input, ctx)),

    matchShard: procedure.input(z.any()).mutation(({ input, ctx }) => (service.matchShard as any)(input, ctx)),

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
