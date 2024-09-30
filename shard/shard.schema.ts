import { z } from 'zod';

export const Shard = z.object({
  id: z.string(),
  name: z.string(),
  realmId: z.string(),
  endpoint: z.string(),
});

// export const connected = z.object({
//   data: z.object({ id: z.string() }),
//   signature,
// });
// export const seerConnected = signature;
// export const seerDisconnected = signature;
// export const setCharacter = unsignedData;
// export const setConfig = unsignedData;
// export const getConfig = nothing;
// export const load = nothing; //signature;
// export const spectate = nothing;
// export const login = anything;
// export const join = nothing;
// export const updateMyself = unsignedData;
// export const restart = signature;
// export const maintenance = signature;
// export const unmaintenance = signature;
// export const startBattleRoyale = signature;
// export const stopBattleRoyale = signature;
// export const pauseRound = signature;
// export const startRound = signedData;
// export const enableForceLevel2 = signature;
// export const disableForceLevel2 = signature;
// export const startGodParty = signature;
// export const stopGodParty = signature;
// export const startRoyale = signature;
// export const pauseRoyale = signature;
// export const unpauseRoyale = signature;
// export const stopRoyale = signature;
// export const makeBattleHarder = signature;
// export const makeBattleEasier = signature;
// export const resetBattleDifficulty = signature;
// export const messageUser = signedData;
// export const changeUser = signedData;
// export const broadcast = signedData;
// export const kickClient = signedData;
// export const info = nothing;
// export const auth = signedData;
