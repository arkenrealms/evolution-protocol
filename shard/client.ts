import { z } from 'zod';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server';
import { transformer } from '@arken/node/util/rpc';
import { Client as ServiceClient } from './types';

interface ProcedureContext {
  client: ServiceClient;
}

export const t = initTRPC
  .context<{
    client: ServiceClient;
  }>()
  .create();
export const router = t.router;
export const procedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

export const onEvents = z.array(z.object({ name: z.string(), args: z.array(z.any()) }));
export const onBroadcast = z.tuple([
  z.string(), // message
  z.number(), // priority
]);
export const onClearLeaderboard = z.object({});
export const onSpawnReward = z.tuple([
  z.string(), // id
  z.union([z.string(), z.number()]), // rewardItemType
  z.string(), // rewardItemName
  z.number(), // quantity
  z.number(), // position x
  z.number(), // position y
]);
export const onRoundWinner = z.object({});
export const onUpdateReward = z.object({});
export const onGameOver = z.object({});
export const onUpdateBestClient = z.object({});
export const onSpectate = z.object({});
export const onUserDisconnected = z.object({});
export const onBanned = z.object({});
export const onLogin = z.object({});
export const onMaintenance = z.object({});
export const onUpdateEvolution = z.object({});
export const onHideMinimap = z.object({});
export const onShowMinimap = z.object({});
export const onSetRoundInfo = z.object({});
export const onLoaded = z.object({});
export const onOpenLevel2 = z.object({});
export const onCloseLevel2 = z.object({});
export const onSpawnPowerUp = z.object({});
export const onUpdatePickup = z.object({});
export const onRoundPaused = z.object({});
export const onUnmaintenance = z.object({});
export const onSetPositionMonitor = z.object({});
export const onUpdatePlayer = z.object({});
export const onSpawnClient = z.object({});
export const onUpdateRegression = z.object({});
export const onJoinGame = z.object({});

export type OnEventsInput = z.infer<typeof onEvents>;
export type OnRoundWinnerInput = z.infer<typeof onRoundWinner>;
export type OnGameOverInput = z.infer<typeof onGameOver>;
export type OnBroadcastInput = z.infer<typeof onBroadcast>;
export type OnClearLeaderboardInput = z.infer<typeof onClearLeaderboard>;
export type OnSpawnRewardInput = z.infer<typeof onSpawnReward>;
export type OnUpdateRewardInput = z.infer<typeof onUpdateReward>;
export type OnUpdateBestClientInput = z.infer<typeof onUpdateBestClient>;
export type OnSpectateInput = z.infer<typeof onSpectate>;
export type OnUserDisconnectedInput = z.infer<typeof onUserDisconnected>;
export type OnBannedInput = z.infer<typeof onBanned>;
export type OnLoginInput = z.infer<typeof onLogin>;
export type OnMaintenanceInput = z.infer<typeof onMaintenance>;
export type OnUpdateEvolutionInput = z.infer<typeof onUpdateEvolution>;
export type OnHideMinimapInput = z.infer<typeof onHideMinimap>;
export type OnShowMinimapInput = z.infer<typeof onShowMinimap>;
export type OnSetRoundInfoInput = z.infer<typeof onSetRoundInfo>;
export type OnLoadedInput = z.infer<typeof onLoaded>;
export type OnOpenLevel2Input = z.infer<typeof onOpenLevel2>;
export type OnCloseLevel2Input = z.infer<typeof onCloseLevel2>;
export type OnSpawnPowerUpInput = z.infer<typeof onSpawnPowerUp>;
export type OnUpdatePickupInput = z.infer<typeof onUpdatePickup>;
export type OnRoundPausedInput = z.infer<typeof onRoundPaused>;
export type OnUnmaintenanceInput = z.infer<typeof onUnmaintenance>;
export type OnSetPositionMonitorInput = z.infer<typeof onSetPositionMonitor>;
export type OnUpdatePlayerInput = z.infer<typeof onUpdatePlayer>;
export type OnSpawnClientInput = z.infer<typeof onSpawnClient>;
export type OnUpdateRegressionInput = z.infer<typeof onUpdateRegression>;
export type OnJoinGameInput = z.infer<typeof onJoinGame>;

export const createRouter = (
  handler: (input: unknown, ctx: ProcedureContext) => Promise<void> | void // Adjust the return type if needed
) => {
  return router({
    onEvents: procedure
      .input(onEvents)
      .mutation(({ input, ctx }: { input: OnEventsInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onBroadcast: procedure
      .input(onBroadcast)
      .mutation(({ input, ctx }: { input: OnBroadcastInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onGameOver: procedure
      .input(onGameOver)
      .mutation(({ input, ctx }: { input: OnGameOverInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onJoinGame: procedure
      .input(onJoinGame)
      .mutation(({ input, ctx }: { input: OnJoinGameInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onRoundWinner: procedure
      .input(onRoundWinner)
      .mutation(({ input, ctx }: { input: OnRoundWinnerInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onClearLeaderboard: procedure
      .input(onClearLeaderboard)
      .mutation(({ input, ctx }: { input: OnClearLeaderboardInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onSpawnReward: procedure
      .input(onSpawnReward)
      .mutation(({ input, ctx }: { input: OnSpawnRewardInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onUpdateReward: procedure
      .input(onUpdateReward)
      .mutation(({ input, ctx }: { input: OnUpdateRewardInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onUpdateBestClient: procedure
      .input(onUpdateBestClient)
      .mutation(({ input, ctx }: { input: OnUpdateBestClientInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onSpectate: procedure
      .input(onSpectate)
      .mutation(({ input, ctx }: { input: OnSpectateInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onUserDisconnected: procedure
      .input(onUserDisconnected)
      .mutation(({ input, ctx }: { input: OnUserDisconnectedInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onBanned: procedure
      .input(onBanned)
      .mutation(({ input, ctx }: { input: OnBannedInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onLogin: procedure
      .input(onLogin)
      .mutation(({ input, ctx }: { input: OnLoginInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onMaintenance: procedure
      .input(onMaintenance)
      .mutation(({ input, ctx }: { input: OnMaintenanceInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onUpdateEvolution: procedure
      .input(onUpdateEvolution)
      .mutation(({ input, ctx }: { input: OnUpdateEvolutionInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onHideMinimap: procedure
      .input(onHideMinimap)
      .mutation(({ input, ctx }: { input: OnHideMinimapInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onShowMinimap: procedure
      .input(onShowMinimap)
      .mutation(({ input, ctx }: { input: OnShowMinimapInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onSetRoundInfo: procedure
      .input(onSetRoundInfo)
      .mutation(({ input, ctx }: { input: OnSetRoundInfoInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onLoaded: procedure
      .input(onLoaded)
      .mutation(({ input, ctx }: { input: OnLoadedInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onOpenLevel2: procedure
      .input(onOpenLevel2)
      .mutation(({ input, ctx }: { input: OnOpenLevel2Input; ctx: ProcedureContext }) => handler(input, ctx)),
    onCloseLevel2: procedure
      .input(onCloseLevel2)
      .mutation(({ input, ctx }: { input: OnCloseLevel2Input; ctx: ProcedureContext }) => handler(input, ctx)),
    onSpawnPowerUp: procedure
      .input(onSpawnPowerUp)
      .mutation(({ input, ctx }: { input: OnSpawnPowerUpInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onUpdatePickup: procedure
      .input(onUpdatePickup)
      .mutation(({ input, ctx }: { input: OnUpdatePickupInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onRoundPaused: procedure
      .input(onRoundPaused)
      .mutation(({ input, ctx }: { input: OnRoundPausedInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onUnmaintenance: procedure
      .input(onUnmaintenance)
      .mutation(({ input, ctx }: { input: OnUnmaintenanceInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onSetPositionMonitor: procedure
      .input(onSetPositionMonitor)
      .mutation(({ input, ctx }: { input: OnSetPositionMonitorInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onUpdatePlayer: procedure
      .input(onUpdatePlayer)
      .mutation(({ input, ctx }: { input: OnUpdatePlayerInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onSpawnClient: procedure
      .input(onSpawnClient)
      .mutation(({ input, ctx }: { input: OnSpawnClientInput; ctx: ProcedureContext }) => handler(input, ctx)),
    onUpdateRegression: procedure
      .input(onUpdateRegression)
      .mutation(({ input, ctx }: { input: OnUpdateRegressionInput; ctx: ProcedureContext }) => handler(input, ctx)),
  });
};

export type Router = ReturnType<typeof createRouter>;

export const create = (url: string) => {
  return createTRPCProxyClient<Router>({
    links: [
      httpBatchLink({
        url,
      }),
    ],
    transformer,
  });
};

export type Client = inferAsyncReturnType<typeof create>;
