import { z } from 'zod';
import { initTRPC } from '@trpc/server';
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
      .input(z.tuple([z.string(), z.string()]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onGameOver as any)(input, ctx)),
    onJoinGame: procedure
      .input(z.tuple([z.string(), z.string(), z.number(), z.string(), z.number(), z.number(), z.number()]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onJoinGame as any)(input, ctx)),
    onRoundWinner: procedure
      .input(z.tuple([z.string()]))
      .output(z.string())
      .mutation(({ input, ctx }) => (service.onRoundWinner as any)(input, ctx)),
    onClearLeaderboard: procedure
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
      .input(z.tuple([z.string(), z.number(), z.number()]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onSpectate as any)(input, ctx)),
    onDisconnected: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onDisconnected as any)(input, ctx)),
    onBanned: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onBanned as any)(input, ctx)),
    onLogin: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onLogin as any)(input, ctx)),
    onMaintenance: procedure
      .input(z.tuple([z.boolean()]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onMaintenance as any)(input, ctx)),
    onUpdateEvolution: procedure
      .input(Schema.AnyInput)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onUpdateEvolution as any)(input, ctx)),
    onHideMinimap: procedure
      .input(z.tuple([]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onHideMinimap as any)(input, ctx)),
    onShowMinimap: procedure
      .input(z.tuple([]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onShowMinimap as any)(input, ctx)),
    onSetRoundInfo: procedure
      .input(z.tuple([z.number(), z.string(), z.string()]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onSetRoundInfo as any)(input, ctx)),
    onLoaded: procedure
      .input(z.tuple([z.number()]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onLoaded as any)(input, ctx)),
    onOpenLevel2: procedure
      .input(z.tuple([]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onOpenLevel2 as any)(input, ctx)),
    onCloseLevel2: procedure
      .input(z.tuple([]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onCloseLevel2 as any)(input, ctx)),
    onSpawnPowerUp: procedure
      .input(z.tuple([z.string(), z.number(), z.number(), z.number(), z.number()]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onSpawnPowerUp as any)(input, ctx)),
    onUpdatePickup: procedure
      .input(z.tuple([z.string(), z.string(), z.number()]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onUpdatePickup as any)(input, ctx)),
    onRoundPaused: procedure
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onRoundPaused as any)(input, ctx)),
    onUnmaintenance: procedure
      .input(z.tuple([z.boolean()]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onUnmaintenance as any)(input, ctx)),
    onSetPositionMonitor: procedure
      .input(z.tuple([z.number(), z.number(), z.number()]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onSetPositionMonitor as any)(input, ctx)),
    onUpdatePlayer: procedure
      .input(
        z.tuple([
          z.string(),
          z.number(),
          z.number(),
          z.number(),
          z.number(),
          z.number(),
          z.number(),
          z.number(),
          z.number(),
          z.number(),
          z.string(),
          z.string(),
        ])
      )
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onUpdatePlayer as any)(input, ctx)),
    onSpawnClient: procedure
      .input(z.tuple([z.string(), z.string(), z.number(), z.number(), z.number(), z.number(), z.number(), z.number()]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onSpawnClient as any)(input, ctx)),
    onShowUI: procedure
      .input(z.string())
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onShowUI as any)(input, ctx)),
    onHideUI: procedure
      .input(z.string())
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onHideUI as any)(input, ctx)),
    onEmote: procedure
      .input(z.tuple([z.string(), z.string()]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onEmote as any)(input, ctx)),
    onAction: procedure
      .input(z.tuple([z.string(), z.string()]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onAction as any)(input, ctx)),
    onUpgrade: procedure
      .input(z.tuple([z.number(), z.number(), z.array(z.string())]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onUpgrade as any)(input, ctx)),
    onUpdateRegression: procedure
      .input(z.tuple([z.string(), z.number(), z.number()]))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.onUpdateRegression as any)(input, ctx)),
  });
};

export type Router = ReturnType<typeof createRouter>;
export type RouterInput = inferRouterInputs<Router>;
export type RouterOutput = inferRouterOutputs<Router>;
