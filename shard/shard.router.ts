// shard.router.ts

import { z as zod } from 'zod';
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

export const createRouter = (service: Types.Service) =>
  router({
    connected: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      .input(
        zod.object({
          data: zod.object({ id: zod.string() }),
          signature: Schema.Signature,
        })
      )
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.connected as any)(input, ctx)),

    info: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.info as any)(input, ctx)),

    auth: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      .input(Schema.SignedData)
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.auth as any)(input, ctx)),

    login: procedure
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.login as any)(input, ctx)),

    join: procedure
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.join as any)(input, ctx)),

    seerConnected: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.seerConnected as any)(input, ctx)),

    seerDisconnected: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.seerDisconnected as any)(input, ctx)),

    setCharacter: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      .input(
        zod.object({
          data: zod.any(),
        })
      )
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.setCharacter as any)(input, ctx)),

    setConfig: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      .input(
        zod.object({
          data: zod.any(),
        })
      )
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.setConfig as any)(input, ctx)),

    getConfig: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .query(({ input, ctx }) => (service.getConfig as any)(input, ctx)),

    load: procedure.use(customErrorFormatter(t)).mutation(({ input, ctx }) => (service.load as any)(input, ctx)),

    spectate: procedure
      .use(customErrorFormatter(t))
      .mutation(({ input, ctx }) => (service.spectate as any)(input, ctx)),

    restart: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.restart as any)(input, ctx)),

    maintenance: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.maintenance as any)(input, ctx)),

    unmaintenance: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.unmaintenance as any)(input, ctx)),

    startBattleRoyale: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.startBattleRoyale as any)(input, ctx)),

    stopBattleRoyale: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.stopBattleRoyale as any)(input, ctx)),

    pauseRound: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.pauseRound as any)(input, ctx)),

    startRound: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.startRound as any)(input, ctx)),

    enableForceLevel2: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.enableForceLevel2 as any)(input, ctx)),

    disableForceLevel2: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.disableForceLevel2 as any)(input, ctx)),

    startGodParty: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .mutation(({ input, ctx }) => (service.startGodParty as any)(input, ctx)),

    stopGodParty: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.stopGodParty as any)(input, ctx)),

    startRoyale: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.startRoyale as any)(input, ctx)),

    pauseRoyale: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.pauseRoyale as any)(input, ctx)),

    unpauseRoyale: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.unpauseRoyale as any)(input, ctx)),

    stopRoyale: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.stopRoyale as any)(input, ctx)),

    makeBattleHarder: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.makeBattleHarder as any)(input, ctx)),

    makeBattleEasier: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.makeBattleEasier as any)(input, ctx)),

    resetBattleDifficulty: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.resetBattleDifficulty as any)(input, ctx)),

    messageUser: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.messageUser as any)(input, ctx)),

    changeUser: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .mutation(({ input, ctx }) => (service.changeUser as any)(input, ctx)),

    broadcast: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.broadcast as any)(input, ctx)),

    kickClient: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .output(Schema.NoDataOutput)
      .mutation(({ input, ctx }) => (service.kickClient as any)(input, ctx)),
  });

export type Router = ReturnType<typeof createRouter>;
export type RouterInput = inferRouterInputs<Router>;
export type RouterOutput = inferRouterOutputs<Router>;
