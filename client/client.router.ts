import { z } from 'zod';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server';
import { transformer } from '@arken/node/util/rpc';
import { inferRouterInputs, inferRouterOutputs } from '@arken/node/schema';
import * as Schema from '@arken/node/schema';
import { Client } from '../shard/shard.types';

export const t = initTRPC
  .context<{
    client: Client;
  }>()
  .create();
export const router = t.router;
export const procedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

export const createRouter = (service: any) => {
  return router({
    onEvents: procedure
      .input(z.array(z.object({ name: z.string(), args: z.array(z.any()) })))
      .mutation(({ input, ctx }) => (service.onEvents as any)(input, ctx)),
    onBroadcast: procedure
      .input(
        z.tuple([
          z.string(), // message
          z.number(), // priority
        ])
      )
      .mutation(({ input, ctx }) => (service.onBroadcast as any)(input, ctx)),
    onGameOver: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onGameOver as any)(input, ctx)),
    onJoinGame: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onJoinGame as any)(input, ctx)),
    onRoundWinner: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onRoundWinner as any)(input, ctx)),
    onClearLeaderboard: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onClearLeaderboard as any)(input, ctx)),
    onSpawnReward: procedure
      .input(
        z.tuple([
          z.string(), // id
          z.union([z.string(), z.number()]), // rewardItemType
          z.string(), // rewardItemName
          z.number(), // quantity
          z.number(), // position x
          z.number(), // position y
        ])
      )
      .mutation(({ input, ctx }) => (service.onSpawnReward as any)(input, ctx)),
    onUpdateReward: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onUpdateReward as any)(input, ctx)),
    onUpdateBestClient: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onUpdateBestClient as any)(input, ctx)),
    onSpectate: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onSpectate as any)(input, ctx)),
    onUserDisconnected: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onUserDisconnected as any)(input, ctx)),
    onBanned: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onBanned as any)(input, ctx)),
    onLogin: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onLogin as any)(input, ctx)),
    onMaintenance: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onMaintenance as any)(input, ctx)),
    onUpdateEvolution: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onUpdateEvolution as any)(input, ctx)),
    onHideMinimap: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onHideMinimap as any)(input, ctx)),
    onShowMinimap: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onShowMinimap as any)(input, ctx)),
    onSetRoundInfo: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onSetRoundInfo as any)(input, ctx)),
    onLoaded: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onLoaded as any)(input, ctx)),
    onOpenLevel2: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onOpenLevel2 as any)(input, ctx)),
    onCloseLevel2: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onCloseLevel2 as any)(input, ctx)),
    onSpawnPowerUp: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onSpawnPowerUp as any)(input, ctx)),
    onUpdatePickup: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onUpdatePickup as any)(input, ctx)),
    onRoundPaused: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onRoundPaused as any)(input, ctx)),
    onUnmaintenance: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onUnmaintenance as any)(input, ctx)),
    onSetPositionMonitor: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onSetPositionMonitor as any)(input, ctx)),
    onUpdatePlayer: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onUpdatePlayer as any)(input, ctx)),
    onSpawnClient: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onSpawnClient as any)(input, ctx)),
    onUpdateRegression: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onUpdateRegression as any)(input, ctx)),
  });
};

export type Router = ReturnType<typeof createRouter>;
export type RouterInput = inferRouterInputs<Router>;
export type RouterOutput = inferRouterOutputs<Router>;

// export const create = (url: string) => {
//   return createTRPCProxyClient<Router>({
//     links: [
//       httpBatchLink({
//         url,
//       }),
//     ],
//     transformer,
//   });
// };

// export type Client = inferAsyncReturnType<typeof create>;