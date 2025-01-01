// shard.router.ts

import { z } from 'zod';
import { initTRPC } from '@trpc/server';
import { customErrorFormatter, hasRole } from '@arken/node/util/rpc';
import { inferRouterInputs, inferRouterOutputs } from '@arken/node/schema';
import * as Schema from '@arken/node/schema';
import { Character, Application, Client } from './shard.types';
import type * as Types from './shard.types';

const t = initTRPC
  .context<{
    client: Client;
  }>()
  .create();

export const router = t.router;
export const procedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

// export const createCallerFactory = (router: Router) => {
//   return (ctx: { client: Client }) => router.createCaller(ctx);
// };

export const createRouter = (service: any) =>
  router({
    connected: procedure
      .input(
        z.object({
          data: z.object({ id: z.string() }),
          signature: Schema.Signature,
        })
      )
      .use(customErrorFormatter(t))
      // .use(hasRole('realm', t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.connected as any)(input, ctx)),

    info: procedure
      .use(hasRole(['admin', 'mod'], t))
      .use(customErrorFormatter(t))
      .output(
        z.object({
          id: z.string(),
          version: z.string(),
          // port: z.number(),
          round: z.object({ id: z.string(), startedDate: z.number() }),
          clientCount: z.number(),
          // clientCount: this.clients.filter((c) => !c.isDead && !c.isSpectating).length,
          spectatorCount: z.number(),
          recentClientsCount: z.number(),
          spritesCount: z.number(),
          connectedClients: z.array(z.string()),
          rewardItemAmount: z.number(),
          rewardWinnerAmount: z.number(),
          gameMode: z.string(),
          orbs: z.any(),
          currentReward: z.any(),
        })
      )
      .mutation(({ input, ctx }) => (service.info as any)(input, ctx)),

    auth: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      .input(Schema.SignedData)
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.auth as any)(input, ctx)),

    login: procedure
      .use(customErrorFormatter(t))
      .input(
        z.object({
          name: z.string(),
          network: z.string(),
          address: z.string(),
          device: z.string(),
          signature: z.string(),
          version: z.string(),
        })
      )
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.login as any)(input, ctx)),

    forceJoin: procedure
      .use(customErrorFormatter(t))
      .use(hasRole(['admin', 'mod'], t))
      .mutation(({ input, ctx }) => (service.forceJoin as any)(input, ctx)),

    join: procedure
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.join as any)(input, ctx)),

    updateMyself: procedure
      .use(customErrorFormatter(t))
      .input(
        z.object({
          position: z.string(),
          target: z.string(),
          time: z.string(),
        })
      )
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.updateMyself as any)(input, ctx)),

    broadcastMechanics: procedure
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.broadcastMechanics as any)(input, ctx)),

    isMechanicEnabled: procedure
      .use(customErrorFormatter(t))
      .input(
        z.object({
          id: z.number(),
        })
      )
      .output(z.boolean())
      .mutation(({ input, ctx }) => (service.isMechanicEnabled as any)(input, ctx)),

    seerConnected: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.seerConnected as any)(input, ctx)),

    seerDisconnected: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.seerDisconnected as any)(input, ctx)),

    setCharacter: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      .input(
        z.object({
          character: z.any(),
          address: z.string(),
        })
      )
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.setCharacter as any)(input, ctx)),

    setConfig: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      .input(
        z.object({
          data: z.any(),
        })
      )
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.setConfig as any)(input, ctx)),

    getConfig: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      // .output(Schema.AnyDataOutput)
      .query(({ input, ctx }) => (service.getConfig as any)(input, ctx)),

    load: procedure.use(customErrorFormatter(t)).mutation(({ input, ctx }) => (service.load as any)(input, ctx)),

    spectate: procedure
      .use(customErrorFormatter(t))
      .mutation(({ input, ctx }) => (service.spectate as any)(input, ctx)),

    restart: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.restart as any)(input, ctx)),

    maintenance: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.maintenance as any)(input, ctx)),

    unmaintenance: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.unmaintenance as any)(input, ctx)),

    startBattleRoyale: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.startBattleRoyale as any)(input, ctx)),

    stopBattleRoyale: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.stopBattleRoyale as any)(input, ctx)),

    pauseRound: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.pauseRound as any)(input, ctx)),

    startRound: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(
        z.object({
          gameMode: z.string(),
        })
      )
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.startRound as any)(input, ctx)),

    nextRound: procedure
      .use(hasRole('admin', t))
      .use(customErrorFormatter(t))
      .mutation(({ input, ctx }) => (service.nextRound as any)(input, ctx)),

    enableForceLevel2: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.enableForceLevel2 as any)(input, ctx)),

    disableForceLevel2: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.disableForceLevel2 as any)(input, ctx)),

    startGodParty: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .mutation(({ input, ctx }) => (service.startGodParty as any)(input, ctx)),

    stopGodParty: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.stopGodParty as any)(input, ctx)),

    startRoyale: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.startRoyale as any)(input, ctx)),

    pauseRoyale: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.pauseRoyale as any)(input, ctx)),

    unpauseRoyale: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.unpauseRoyale as any)(input, ctx)),

    stopRoyale: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.stopRoyale as any)(input, ctx)),

    makeBattleHarder: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.makeBattleHarder as any)(input, ctx)),

    makeBattleEasier: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.makeBattleEasier as any)(input, ctx)),

    resetBattleDifficulty: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.resetBattleDifficulty as any)(input, ctx)),

    messageUser: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      // .output(Schema.NoDataOutput)
      .input(z.object({ target: z.string(), message: z.string() }))
      .mutation(({ input, ctx }) => (service.messageUser as any)(input, ctx)),

    changeUser: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(z.object({ target: z.string(), config: z.any() }))
      .mutation(({ input, ctx }) => (service.changeUser as any)(input, ctx)),

    broadcast: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(z.string())
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.broadcast as any)(input, ctx)),

    kickClient: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(z.object({ target: z.string() }))
      // .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.kickClient as any)(input, ctx)),
  });

export type Router = ReturnType<typeof createRouter>;
export type RouterInput = inferRouterInputs<Router>;
export type RouterOutput = inferRouterOutputs<Router>;
