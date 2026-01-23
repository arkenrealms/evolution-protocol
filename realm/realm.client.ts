import { z } from 'zod';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server';
import { transformer } from '../util/rpc';

interface ClientContext {}

export const t = initTRPC.context<ClientContext>().create();
export const router = t.router;
export const procedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

// Procedures here

export const createRouter = (handler) => {
  return router({});
};

export type Router = ReturnType<typeof createRouter>;

export const create = (url: string) => {
  return createTRPCProxyClient<Router>({
    links: [
      httpBatchLink({
        url, // Example URL, update as needed
      }),
    ],
    transformer,
  });
};

export type Client = inferAsyncReturnType<typeof create>;
