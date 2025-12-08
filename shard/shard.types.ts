import express, { Express } from 'express';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import { Server as SocketServer } from 'socket.io';
import { z } from 'zod';
import * as schema from './shard.schema';
import { Position, Signature } from '@arken/node/types';
import { createTRPCProxyClient } from '@trpc/client';
import type { Router } from './shard.router';
import { createCallerFactory } from './shard.router';
import type { createRouter, RouterInput, RouterOutput } from './shard.router';
import * as Schema from './shard.schema';

export type { Router, RouterInput, RouterOutput };
export type Shard = z.infer<typeof Schema.Shard>;
export type ShardDocument = Shard & Document;

export type Config = {
  id?: string;
  roundId?: string;
  damagePerTouch: number;
  periodicReboots: boolean;
  startAvatar: number;
  spriteXpMultiplier: number;
  forcedLatency: number;
  isRoundPaused: boolean;
  level2forced: boolean;
  level2allowed: boolean;
  level2open: boolean;
  level3open: boolean;
  hideMap: boolean;
  mechanicsAllowed?: boolean;
  dynamicDecayPower: boolean;
  decayPowerPerMaxEvolvedClients: number;
  pickupCheckPositionDistance: number;
  playersRequiredForLevel2: number;
  preventBadKills: boolean;
  colliderBuffer: number;
  stickyIslands: boolean;
  antifeed2: boolean;
  antifeed3: boolean;
  antifeed4: boolean;
  isBattleRoyale: boolean;
  isGodParty: boolean;
  isRoyale: boolean;
  avatarDirection: number;
  calcRoundRewards: boolean;
  flushEventQueueSeconds: number;
  mechanics: number[];
  disabledMechanics: number[];
  log: {
    connections: boolean;
  };
  anticheat: {
    enabled: boolean;
    sameClientCantClaimRewardTwiceInRow: boolean;
    disconnectPositionJumps: boolean;
  };
  optimization: {
    sendClientUpdateWithNoChanges: boolean;
  };
  antifeed1: boolean;
  avatarDecayPower0: number;
  avatarDecayPower1: number;
  avatarDecayPower2: number;
  avatarTouchDistance0: number;
  avatarTouchDistance1: number;
  avatarTouchDistance2: number;
  avatarSpeedMultiplier0: number;
  avatarSpeedMultiplier1: number;
  avatarSpeedMultiplier2: number;
  clientsRequiredForLevel2: number;
  baseSpeed: number;
  cameraSize: number;
  checkConnectionLoopSeconds: number;
  checkInterval: number;
  checkPositionDistance: number;
  claimingRewards: boolean;
  decayPower: number;
  disconnectClientSeconds: number;
  disconnectPositionJumps: boolean;
  fastestLoopSeconds: number;
  fastLoopSeconds: number;
  gameMode: string;
  killSameNetworkClients: boolean;
  immunitySeconds: number;
  isMaintenance: boolean;
  leadercap: boolean;
  maxEvolves: number;
  noBoot: boolean;
  noDecay: boolean;
  orbCutoffSeconds: number;
  orbOnDeathPercent: number;
  orbTimeoutSeconds: number;
  pickupDistance: number;
  pointsPerEvolve: number;
  pointsPerKill: number;
  pointsPerOrb: number;
  pointsPerPowerup: number;
  pointsPerReward: number;
  powerupXp0: number;
  powerupXp1: number;
  powerupXp2: number;
  powerupXp3: number;
  resetInterval: number;
  rewardItemAmount: number;
  rewardItemName: string;
  rewardItemType: number;
  rewardSpawnLoopSeconds: number;
  rewardWinnerAmount: number;
  rewardWinnerName: string;
  roundLoopSeconds: number;
  sendUpdateLoopSeconds: number;
  slowLoopSeconds: number;
  spritesPerClientCount: number;
  spritesStartCount: number;
  spritesTotal: number;
  guide: string[];
  maxClients?: number;
  upgrades?: boolean;
};

export interface Client {
  socket: any;
  name: string;
  roles: string[];
  ui: string[];
  shardId?: string;
  ioCallbacks: any;
  id: string;
  emit: ReturnType<ReturnType<typeof createCallerFactory>>; // ReturnType<typeof createShardRouter>; //any; // ShardClientRouter;
  startedRoundAt: number | null;
  avatar: number | null;
  network: string | null;
  address: string | null;
  device: string | null;
  position: Position;
  target: Position;
  clientPosition: Position;
  clientTarget: Position;
  phasedPosition: Position;
  rotation: any;
  upgradesPending: number;
  upgradeRerolls: number;
  upgrades: any;
  xp: number;
  maxHp: number;
  latency: number;
  kills: number;
  killStreak: number;
  deaths: number;
  points: number;
  evolves: number;
  powerups: number;
  rewards: number;
  orbs: number;
  pickups: any[];
  isMod: boolean;
  isSeer: boolean;
  isAdmin: boolean;
  isBanned: boolean;
  isDisconnected: boolean;
  isDead: boolean;
  isJoining: boolean;
  isSpectating: boolean;
  isStuck: boolean;
  isGod: boolean;
  isRealm: boolean;
  isMaster: boolean;
  isGuest: boolean;
  isInvincible: boolean;
  isPhased: boolean;
  overrideSpeed: number | null;
  overrideCameraSize: number | null;
  cameraSize: number;
  speed: number;
  joinedAt: number;
  invincibleUntil: number;
  decayPower: number;
  hash: string;
  lastReportedTime: number;
  lastUpdate: number;
  gameMode: string;
  phasedUntil: number;
  overrideSpeedUntil: number;
  joinedRoundAt: number;
  baseSpeed: number;
  lastTouchClientId: string;
  lastTouchTime: number;
  character: {
    meta: Record<number, number>;
  };
  log: {
    kills: string[];
    deaths: string[];
    revenge: number;
    resetPosition: number;
    phases: number;
    stuck: number;
    collided: number;
    timeoutDisconnect: number;
    speedProblem: number;
    clientDistanceProblem: number;
    outOfBounds: number;
    ranOutOfHealth: number;
    notReallyTrying: number;
    tooManyKills: number;
    killingThemselves: number;
    sameNetworkDisconnect: number;
    connectedTooSoon: number;
    clientDisconnected: number;
    positionJump: number;
    pauses: number;
    connects: number;
    path: string;
    positions: number;
    replay: any[];
    recentJoinProblem: number;
    usernameProblem: number;
    maintenanceJoin: number;
    signatureProblem: number;
    signinProblem: number;
    versionProblem: number;
    failedRealmCheck: number;
    spectating: number;
    addressProblem: number;
  };
}

export interface Application {
  io: any;
  state: any;
  realm: any; // ReturnType<typeof createClient>;
  config: any;
  // guestNames: string[];
  // serverVersion: string;
  // observers: any[];
  // roundLoopTimeout?: NodeJS.Timeout;
  // addressToUsername: Record<string, string>;
  // announceReboot: boolean;
  // rebootAfterRound: boolean;
  // debugQueue: boolean;
  // killSameNetworkClients: boolean;
  // sockets: Record<string, any>;
  // clientLookup: Record<string, Client>;
  // powerups: any[];
  // powerupLookup: Record<string, any>;
  // currentReward?: any;
  // orbs: any[];
  // orbLookup: Record<string, any>;
  // eventQueue: any[];
  // clients: Client[];
  // lastReward?: any;
  // lastLeaderName?: string;
  // config: Partial<Config>;
  // sharedConfig: Partial<Config>;
  // baseConfig: Partial<Config>;
  // round: {
  //   startedDate: number;
  //   endedAt: number | null;
  //   events: any[];
  //   states: any[];
  //   clients: Client[];
  // };
  // ranks: Record<string, any>;
  // ioCallbacks: Record<string, any>;
  // pandas: string[];
  // rateLimitWindow: number;
  // maxRequestsPerWindow: number;
  // requestTimestamps: Record<string, number[]>;
  // loggableEvents: string[];
  // currentPreset: any;
  // roundConfig: Config;
  // spawnBoundary1: Boundary;
  // spawnBoundary2: Boundary;
  // mapBoundary: Boundary;
  // clientSpawnPoints: Position[];
  // lastFastGameloopTime: number;
  // lastFastestGameloopTime: number;
}

export interface Character {
  id: string;
  name: string;
  level: number;
  class: string;
}

export type Orb = {
  id: string;
  type: number;
  points: number;
  scale: number;
  enabledDate: number; // Timestamp or milliseconds
  position: Position;
};

export interface Boundary {
  x: { min: number; max: number };
  y: { min: number; max: number };
}

export type Reward = {
  id: string;
  rewardItemType: string | number;
  rewardItemName: string;
  quantity: number;
  position: Position;
  winner?: string;
  enabledDate: number;
};

export type PowerUp = {
  id: string;
  type: number | string;
  scale: number;
  position: Position;
};

export type RoundEvent = {
  type: string;
  name: string;
  args: any[];
  client?: string; // Optional client ID, depending on the event
};

// type Client = {
//   id: string;
//   name: string;
//   address: string;
//   [key: string]: any; // Additional client properties as needed
// };

export type Round = {
  id: string;
  gameMode: string;
  startedDate: number; // or Date if using Date objects
  endedAt: number | null;
  clients: Client[];
  events: RoundEvent[];
  states: any[];
};

export type Preset = {
  gameMode: string;
  isEnabled?: boolean;
  maxEvolves?: number;
  pointsPerEvolve?: number;
  pointsPerKill?: number;
  damagePerTouch?: number;
  orbOnDeathPercent?: number;
  orbTimeoutSeconds?: number;
  orbCutoffSeconds?: number;
  decayPower?: number;
  baseSpeed?: number;
  checkPositionDistance?: number;
  checkInterval?: number;
  roundLoopSeconds?: number;
  avatarSpeedMultiplier?: number[];
  avatarDecayPower?: number[];
  preventBadKills?: boolean;
  antifeed1?: boolean;
  antifeed2?: boolean;
  antifeed3?: boolean;
  noDecay?: boolean;
  noBoot?: boolean;
  leadercap?: boolean;
  fastLoopSeconds?: number;
  [key: string]: any; // Additional properties as needed
};

export type ServiceInfo = {
  id: string;
  version: string;
  port: string;
  round: { id: string; startedDate: number };
  clientCount: number;
  // clientCount: this.clients.filter((c) => !c.isDead && !c.isSpectating).length,
  spectatorCount: number;
  recentClientsCount: number;
  spritesCount: number;
  connectedClients: any[];
  rewardItemAmount: number;
  rewardWinnerAmount: number;
  gameMode: string;
  orbs: Orb[];
  currentReward: Reward;
};

export interface ServiceContext {
  client: Client;
}

export type Event = {
  name: string;
  args: Array<any>;
};

export type Service = {
  onPlayerUpdates(input: RouterInput['onPlayerUpdates'], ctx: ServiceContext): Promise<RouterOutput['onPlayerUpdates']>;
  claimMaster(input: RouterInput['claimMaster'], ctx: ServiceContext): Promise<RouterOutput['claimMaster']>;
  initRealm(input: RouterInput['initRealm'], ctx: ServiceContext): Promise<RouterOutput['initRealm']>;
  info(input: RouterInput['info'], ctx: ServiceContext): Promise<RouterOutput['info']>;
  seerConnected(input: RouterInput['seerConnected'], ctx: ServiceContext): Promise<RouterOutput['seerConnected']>;
  seerDisconnected(
    input: RouterInput['seerDisconnected'],
    ctx: ServiceContext
  ): Promise<RouterOutput['seerDisconnected']>;
  emote(input: RouterInput['emote'], ctx: ServiceContext): Promise<RouterOutput['emote']>;
  updateMyself(input: RouterInput['updateMyself'], ctx: ServiceContext): Promise<RouterOutput['updateMyself']>;
  action(input: RouterInput['action'], ctx: ServiceContext): Promise<RouterOutput['action']>;
  setCharacter(input: RouterInput['setCharacter'], ctx: ServiceContext): Promise<RouterOutput['setCharacter']>;
  setConfig(input: RouterInput['setConfig'], ctx: ServiceContext): Promise<RouterOutput['setConfig']>;
  getConfig(input: RouterInput['getConfig'], ctx: ServiceContext): Promise<RouterOutput['getConfig']>;
  load(input: RouterInput['load'], ctx: ServiceContext): Promise<RouterOutput['load']>;
  spectate(input: RouterInput['spectate'], ctx: ServiceContext): Promise<RouterOutput['spectate']>;
  login(input: RouterInput['login'], ctx: ServiceContext): Promise<RouterOutput['login']>;
  auth(input: RouterInput['auth'], ctx: ServiceContext): Promise<RouterOutput['auth']>;
  join(input: RouterInput['join'], ctx: ServiceContext): Promise<RouterOutput['join']>;
  isMechanicEnabled(input: RouterInput['isMechanicEnabled'], ctx: ServiceContext): RouterOutput['isMechanicEnabled'];
  broadcastMechanics(
    input: RouterInput['broadcastMechanics'],
    ctx: ServiceContext
  ): Promise<RouterOutput['broadcastMechanics']>;
  restart(input: RouterInput['restart'], ctx: ServiceContext): Promise<RouterOutput['restart']>;
  maintenance(input: RouterInput['maintenance'], ctx: ServiceContext): Promise<RouterOutput['maintenance']>;
  unmaintenance(input: RouterInput['unmaintenance'], ctx: ServiceContext): Promise<RouterOutput['unmaintenance']>;
  startBattleRoyale(
    input: RouterInput['startBattleRoyale'],
    ctx: ServiceContext
  ): Promise<RouterOutput['startBattleRoyale']>;
  stopBattleRoyale(
    input: RouterInput['stopBattleRoyale'],
    ctx: ServiceContext
  ): Promise<RouterOutput['stopBattleRoyale']>;
  pauseRound(input: RouterInput['pauseRound'], ctx: ServiceContext): Promise<RouterOutput['pauseRound']>;
  startRound(input: RouterInput['startRound'], ctx: ServiceContext): Promise<RouterOutput['startRound']>;
  enableForceLevel2(
    input: RouterInput['enableForceLevel2'],
    ctx: ServiceContext
  ): Promise<RouterOutput['enableForceLevel2']>;
  disableForceLevel2(
    input: RouterInput['disableForceLevel2'],
    ctx: ServiceContext
  ): Promise<RouterOutput['disableForceLevel2']>;
  startGodParty(input: RouterInput['startGodParty'], ctx: ServiceContext): Promise<RouterOutput['startGodParty']>;
  stopGodParty(input: RouterInput['stopGodParty'], ctx: ServiceContext): Promise<RouterOutput['stopGodParty']>;
  startRoyale(input: RouterInput['startRoyale'], ctx: ServiceContext): Promise<RouterOutput['startRoyale']>;
  pauseRoyale(input: RouterInput['pauseRoyale'], ctx: ServiceContext): Promise<RouterOutput['pauseRoyale']>;
  unpauseRoyale(input: RouterInput['unpauseRoyale'], ctx: ServiceContext): Promise<RouterOutput['unpauseRoyale']>;
  stopRoyale(input: RouterInput['stopRoyale'], ctx: ServiceContext): Promise<RouterOutput['stopRoyale']>;
  makeBattleHarder(
    input: RouterInput['makeBattleHarder'],
    ctx: ServiceContext
  ): Promise<RouterOutput['makeBattleHarder']>;
  makeBattleEasier(
    input: RouterInput['makeBattleEasier'],
    ctx: ServiceContext
  ): Promise<RouterOutput['makeBattleEasier']>;
  resetBattleDifficulty(
    input: RouterInput['resetBattleDifficulty'],
    ctx: ServiceContext
  ): Promise<RouterOutput['resetBattleDifficulty']>;
  messageUser(input: RouterInput['messageUser'], ctx: ServiceContext): Promise<RouterOutput['messageUser']>;
  changeUser(input: RouterInput['changeUser'], ctx: ServiceContext): Promise<RouterOutput['changeUser']>;
  broadcast(input: RouterInput['broadcast'], ctx: ServiceContext): Promise<RouterOutput['broadcast']>;
  kickClient(input: RouterInput['kickClient'], ctx: ServiceContext): Promise<RouterOutput['kickClient']>;
};
