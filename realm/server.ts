import z from 'zod';
import { initTRPC, TRPCError } from '@trpc/server';
import { log, logError, getTime, isEthereumAddress } from '@arken/node/util';
import { customErrorFormatter, transformer, hasRole, validateRequest } from '@arken/node/util/rpc';
import type { Server, Client } from './types';
import type { Server as ShardServer } from '../shard/server';

const t = initTRPC
  .context<{
    client: Client;
  }>()
  .create();

export const router = t.router;
export const procedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

export const create = () => {};

export const createRouter = (server: Server) => {
  return router({
    auth: procedure
      .use(customErrorFormatter(t))
      .use(validateRequest(t))
      .input(z.object({ signature: z.object({ address: z.string(), hash: z.string() }) }))
      .mutation(({ input }) => server.auth(input)),

    setConfig: procedure
      .use(customErrorFormatter(t))
      .use(hasRole('mod', t))
      .use(validateRequest(t))
      .input(
        z.object({
          data: z.object({ shardId: z.string(), config: z.record(z.any()) }),
          signature: z.object({ address: z.string(), hash: z.string() }),
        })
      )
      .mutation(({ input }) => server.setConfig(input)),

    ping: procedure
      .use(customErrorFormatter(t))
      .input(z.object({ id: z.string() }))
      .mutation(() => server.ping()),

    info: procedure
      .use(customErrorFormatter(t))
      .use(hasRole('mod', t))
      .use(validateRequest(t))
      .input(z.object({ signature: z.object({ address: z.string(), hash: z.string() }) }))
      .mutation(() => server.info()),

    addMod: procedure
      .use(customErrorFormatter(t))
      .use(hasRole('admin', t))
      .use(validateRequest(t))
      .input(
        z.object({
          data: z.object({ target: z.string() }),
          signature: z.object({ address: z.string(), hash: z.string() }),
        })
      )
      .mutation(({ input }) => server.addMod(input)),

    removeMod: procedure
      .use(customErrorFormatter(t))
      .use(hasRole('admin', t))
      .use(validateRequest(t))
      .input(
        z.object({
          data: z.object({ target: z.string() }),
          signature: z.object({ address: z.string(), hash: z.string() }),
        })
      )
      .mutation(({ input }) => server.removeMod(input)),

    banClient: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(
        z.object({
          data: z.object({ target: z.string() }),
          signature: z.object({ address: z.string(), hash: z.string() }),
        })
      )
      .mutation(({ input }) => server.banClient(input)),

    banUser: procedure
      .use(customErrorFormatter(t))
      .use(hasRole('admin', t))
      .use(validateRequest(t))
      .input(
        z.object({
          data: z.object({ target: z.string(), banReason: z.string(), banExpireDate: z.string() }),
          signature: z.object({ address: z.string(), hash: z.string() }),
        })
      )
      .mutation(({ input }) => server.banUser(input)),

    // bridgeState: procedure
    //   .use(hasRole('mod', t))
    //   .use(customErrorFormatter(t))
    //   .input(z.object({ signature: z.object({ address: z.string(), hash: z.string() }) }))
    //   .mutation(() => server.bridgeState()),

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
          signature: z.object({ address: z.string(), hash: z.string() }),
        })
      )
      .mutation(({ input }) => server.unbanClient(input)),

    matchShard: procedure.input(z.void()).mutation(() => server.matchShard()),

    // call: procedure
    //   .use(customErrorFormatter(t))
    //   .input(
    //     z.object({
    //       data: z.object({
    //         method: z.string(),
    //       }),
    //       signature: z.object({ address: z.string(), hash: z.string() }),
    //     })
    //   )
    //   .mutation(({ input }) => server.call(input)),
  });
};

export type Router = ReturnType<typeof createRouter>;
