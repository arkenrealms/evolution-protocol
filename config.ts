import * as Types from './types';

export const testMode = false;

export const baseConfig: Types.Shard.Config = {
  id: '',
  roundId: '1',
  damagePerTouch: 10,
  periodicReboots: false,
  startAvatar: 0,
  spriteXpMultiplier: 1,
  forcedLatency: 20,
  isRoundPaused: false,
  level2forced: false,
  level2allowed: true,
  level2open: false,
  level3open: false,
  hideMap: true,
  dynamicDecayPower: true,
  decayPowerPerMaxEvolvedClients: 0.6,
  pickupCheckPositionDistance: 1,
  playersRequiredForLevel2: 15,
  preventBadKills: false,
  colliderBuffer: 0.05,
  stickyIslands: false,
  antifeed2: true,
  antifeed3: false,
  antifeed4: true,
  isBattleRoyale: false,
  isGodParty: false,
  isRoyale: false,
  avatarDirection: 1,
  calcRoundRewards: true,
  flushEventQueueSeconds: 0.02,
  mechanics: [1150, 1160, 1222, 1223, 1030, 1102, 1164, 1219, 1105, 1104, 1117, 1118],
  mechanicsAllowed: false,
  disabledMechanics: [],
  log: {
    connections: false,
  },
  anticheat: {
    enabled: false,
    sameClientCantClaimRewardTwiceInRow: false,
    disconnectPositionJumps: false,
  },
  optimization: {
    sendClientUpdateWithNoChanges: true,
  },
  antifeed1: false,
  avatarDecayPower0: 0,
  avatarDecayPower1: 0,
  avatarDecayPower2: 0,
  avatarTouchDistance0: 0,
  avatarTouchDistance1: 0,
  avatarTouchDistance2: 0,
  avatarSpeedMultiplier0: 0,
  avatarSpeedMultiplier1: 0,
  avatarSpeedMultiplier2: 0,
  clientsRequiredForLevel2: 1,
  baseSpeed: 0,
  cameraSize: 0,
  checkConnectionLoopSeconds: 0,
  checkInterval: 0,
  checkPositionDistance: 0,
  claimingRewards: false,
  decayPower: 0,
  disconnectClientSeconds: 120,
  disconnectPositionJumps: false,
  fastestLoopSeconds: 0,
  fastLoopSeconds: 0.08,
  gameMode: '',
  killSameNetworkClients: false,
  immunitySeconds: 0,
  isMaintenance: false,
  leadercap: false,
  maxEvolves: 0,
  noBoot: false,
  noDecay: false,
  orbCutoffSeconds: 0,
  orbOnDeathPercent: 0,
  orbTimeoutSeconds: 0,
  pickupDistance: 0,
  pointsPerEvolve: 0,
  pointsPerKill: 0,
  pointsPerOrb: 0,
  pointsPerPowerup: 0,
  pointsPerReward: 0,
  powerupXp0: 0,
  powerupXp1: 0,
  powerupXp2: 0,
  powerupXp3: 0,
  resetInterval: 0,
  rewardItemAmount: 0,
  rewardItemName: '',
  rewardItemType: 0,
  rewardSpawnLoopSeconds: 0,
  rewardWinnerAmount: 0,
  rewardWinnerName: '',
  roundLoopSeconds: 0,
  sendUpdateLoopSeconds: 3,
  slowLoopSeconds: 0,
  spritesPerClientCount: 0,
  spritesStartCount: 0,
  spritesTotal: 0,
  guide: [],
  maxClients: 100,
};

export const sharedConfig: Partial<Types.Shard.Config> = {
  antifeed1: true,
  avatarDecayPower0: 1.5,
  avatarDecayPower1: 2.5,
  avatarDecayPower2: 3,
  avatarTouchDistance0: 0.25,
  avatarTouchDistance1: 0.45,
  avatarTouchDistance2: 0.65,
  avatarSpeedMultiplier0: 1,
  avatarSpeedMultiplier1: 1,
  avatarSpeedMultiplier2: 0.85,
  baseSpeed: 3,
  cameraSize: 3,
  checkConnectionLoopSeconds: 2,
  checkInterval: 1,
  checkPositionDistance: 2,
  claimingRewards: false,
  decayPower: 2,
  disconnectClientSeconds: testMode ? 999 : 30,
  disconnectPositionJumps: true,
  fastestLoopSeconds: 0.02,
  fastLoopSeconds: 0.08,
  gameMode: 'Standard',
  immunitySeconds: 5,
  isMaintenance: false,
  leadercap: false,
  maxEvolves: 3,
  noBoot: testMode,
  noDecay: testMode,
  orbCutoffSeconds: testMode ? 0 : 60,
  orbOnDeathPercent: 25,
  orbTimeoutSeconds: testMode ? 3 : 10,
  pickupDistance: 0.3,
  pointsPerEvolve: 1,
  pointsPerKill: 20,
  pointsPerOrb: 1,
  pointsPerPowerup: 1,
  pointsPerReward: 5,
  powerupXp0: 2,
  powerupXp1: 4,
  powerupXp2: 8,
  powerupXp3: 16,
  resetInterval: 3.1,
  rewardItemAmount: 0,
  rewardItemName: '?',
  rewardItemType: 0,
  rewardSpawnLoopSeconds: testMode ? 1 : (3 * 60) / 20,
  rewardWinnerAmount: 0,
  rewardWinnerName: 'PEPE',
  roundLoopSeconds: 5 * 60, //testMode ? 1 * 60 : 5 * 60,
  sendUpdateLoopSeconds: 3,
  slowLoopSeconds: 1,
  spritesPerClientCount: 1,
  spritesStartCount: 50,
  spritesTotal: 50,
};
