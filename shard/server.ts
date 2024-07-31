import { initTRPC, TRPCError } from '@trpc/server';
import { createTRPCProxyClient, httpBatchLink, createWSClient, wsLink } from '@trpc/client';
import { customErrorFormatter, hasRole, transformer } from '@arken/node/util/rpc';
import { Client as ServiceClient } from './types';
import { Character, Application } from './types';
import * as schema from './schema';
import type * as Schema from './types';

const t = initTRPC
  .context<{
    client: ServiceClient;
  }>()
  .create();

export const router = t.router;
export const procedure = t.procedure;

export const create = () => {};

export const createRouter = (service: Schema.Service) => {
  return router({
    connected: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      .input(schema.connected)
      .mutation(({ input, ctx }) => service.connected(input as Schema.ConnectedInput, ctx)),

    seerConnected: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      .input(schema.seerConnected)
      .mutation(({ input, ctx }) => service.seerConnected(input as Schema.ApiConnectedInput, ctx)),

    seerDisconnected: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      .input(schema.seerDisconnected)
      .mutation(({ input, ctx }) => service.seerDisconnected(input as Schema.ApiDisconnectedInput, ctx)),

    setCharacter: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      .input(schema.setCharacter)
      .mutation(({ input, ctx }) => service.setCharacter(input as Schema.SetCharacterInput, ctx)),

    setConfig: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      .input(schema.setConfig)
      .mutation(({ input, ctx }) => service.setConfig(input as Schema.SetConfigInput, ctx)),

    getConfig: procedure
      .use(hasRole('realm', t))
      .use(customErrorFormatter(t))
      .input(schema.getConfig)
      .mutation(({ input, ctx }) => service.getConfig(input as Schema.GetConfigInput, ctx)),

    load: procedure
      .use(customErrorFormatter(t))
      .input(schema.load)
      .mutation(({ input, ctx }) => service.load(input as Schema.LoadInput, ctx)),

    spectate: procedure
      .use(customErrorFormatter(t))
      .input(schema.spectate)
      .mutation(({ input, ctx }) => service.spectate(input, ctx)),

    login: procedure
      .use(customErrorFormatter(t))
      .input(schema.login)
      .mutation(({ input, ctx }) => service.login(input as Schema.LoginInput, ctx)),

    join: procedure
      .use(customErrorFormatter(t))
      .input(schema.join)
      .mutation(({ input, ctx }) => service.join(input as Schema.JoinInput, ctx)),

    updateMyself: procedure
      .use(customErrorFormatter(t))
      .input(schema.updateMyself)
      .mutation(({ input, ctx }) => service.updateMyself(input as Schema.UpdateMyselfInput, ctx)),

    restart: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.restart)
      .mutation(({ input, ctx }) => service.restart(input as Schema.RestartInput, ctx)),

    maintenance: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.maintenance)
      .mutation(({ input, ctx }) => service.maintenance(input as Schema.MaintenanceInput, ctx)),

    unmaintenance: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.unmaintenance)
      .mutation(({ input, ctx }) => service.unmaintenance(input as Schema.UnmaintenanceInput, ctx)),

    startBattleRoyale: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.startBattleRoyale)
      .mutation(({ input, ctx }) => service.startBattleRoyale(input as Schema.StartBattleRoyaleInput, ctx)),

    stopBattleRoyale: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.stopBattleRoyale)
      .mutation(({ input, ctx }) => service.stopBattleRoyale(input as Schema.StopBattleRoyaleInput, ctx)),

    pauseRound: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.pauseRound)
      .mutation(({ input, ctx }) => service.pauseRound(input as Schema.PauseRoundInput, ctx)),

    startRound: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.startRound)
      .mutation(({ input, ctx }) => service.startRound(input as Schema.StartRoundInput, ctx)),

    enableForceLevel2: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.enableForceLevel2)
      .mutation(({ input, ctx }) => service.enableForceLevel2(input as Schema.EnableForceLevel2Input, ctx)),

    disableForceLevel2: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.disableForceLevel2)
      .mutation(({ input, ctx }) => service.disableForceLevel2(input as Schema.DisableForceLevel2Input, ctx)),

    startGodParty: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.startGodParty)
      .mutation(({ input, ctx }) => service.startGodParty(input as Schema.StartGodPartyInput, ctx)),

    stopGodParty: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.stopGodParty)
      .mutation(({ input, ctx }) => service.stopGodParty(input as Schema.StopGodPartyInput, ctx)),

    startRoyale: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.startRoyale)
      .mutation(({ input, ctx }) => service.startRoyale(input as Schema.StartRoyaleInput, ctx)),

    pauseRoyale: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.pauseRoyale)
      .mutation(({ input, ctx }) => service.pauseRoyale(input as Schema.PauseRoyaleInput, ctx)),

    unpauseRoyale: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.unpauseRoyale)
      .mutation(({ input, ctx }) => service.unpauseRoyale(input as Schema.UnpauseRoyaleInput, ctx)),

    stopRoyale: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.stopRoyale)
      .mutation(({ input, ctx }) => service.stopRoyale(input as Schema.StopRoyaleInput, ctx)),

    makeBattleHarder: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.makeBattleHarder)
      .mutation(({ input, ctx }) => service.makeBattleHarder(input as Schema.MakeBattleHarderInput, ctx)),

    makeBattleEasier: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.makeBattleEasier)
      .mutation(({ input, ctx }) => service.makeBattleEasier(input as Schema.MakeBattleEasierInput, ctx)),

    resetBattleDifficulty: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.resetBattleDifficulty)
      .mutation(({ input, ctx }) => service.resetBattleDifficulty(input as Schema.ResetBattleDifficultyInput, ctx)),

    messageUser: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.messageUser)
      .mutation(({ input, ctx }) => service.messageUser(input as Schema.MessageUserInput, ctx)),

    changeUser: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.changeUser)
      .mutation(({ input, ctx }) => service.changeUser(input as Schema.ChangeUserInput, ctx)),

    broadcast: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.broadcast)
      .mutation(({ input, ctx }) => service.broadcast(input as Schema.BroadcastInput, ctx)),

    kickClient: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.kickClient)
      .mutation(({ input, ctx }) => service.kickClient(input as Schema.KickClientInput, ctx)),

    info: procedure
      .use(hasRole('mod', t))
      .use(customErrorFormatter(t))
      .input(schema.info)
      .mutation(({ input, ctx }) => service.info(input, ctx)),
  });
};

export type Router = ReturnType<typeof createRouter>;

export class Server {
  app: Application;
  endpoint: string;
  key: string;
  emit?: ReturnType<typeof createTRPCProxyClient<Router>>;
  socket?: any;
  id: string;
  info: undefined;
  isAuthed: boolean;
  characters: Record<string, Character>;
  process: any;
  spawnPort: any;
}
