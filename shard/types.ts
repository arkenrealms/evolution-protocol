import express, { Express } from 'express';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import { Server as SocketServer } from 'socket.io';
import { z } from 'zod';
import * as schema from './schema';
import { Position, Signature } from '@arken/node/types';
export type { Router } from './server';
import type { ShardClientRouter, Realm } from '../types';
import { createRouter as createShardRouter } from './server';

export type SignatureInput = z.infer<typeof schema.signature>;
export type DataInput = z.infer<typeof schema.unsignedData>;
export type DataAndSignatureInput = z.infer<typeof schema.signedData>;
export type MsgInput = z.infer<typeof schema.nothing>;
export type ConnectedInput = z.infer<typeof schema.connected>;
export type SeerConnectedInput = z.infer<typeof schema.seerConnected>;
export type SeerDisconnectedInput = z.infer<typeof schema.seerDisconnected>;
export type SetCharacterInput = z.infer<typeof schema.setCharacter>;
export type SetConfigInput = z.infer<typeof schema.setConfig>;
export type GetConfigInput = z.infer<typeof schema.getConfig>;
export type LoadInput = z.infer<typeof schema.load>;
export type SpectateInput = z.infer<typeof schema.spectate>;
export type LoginInput = z.infer<typeof schema.login>;
export type JoinInput = z.infer<typeof schema.join>;
export type UpdateMyselfInput = z.infer<typeof schema.updateMyself>;
export type RestartInput = z.infer<typeof schema.restart>;
export type MaintenanceInput = z.infer<typeof schema.maintenance>;
export type UnmaintenanceInput = z.infer<typeof schema.unmaintenance>;
export type StartBattleRoyaleInput = z.infer<typeof schema.startBattleRoyale>;
export type StopBattleRoyaleInput = z.infer<typeof schema.stopBattleRoyale>;
export type PauseRoundInput = z.infer<typeof schema.pauseRound>;
export type StartRoundInput = z.infer<typeof schema.startRound>;
export type EnableForceLevel2Input = z.infer<typeof schema.enableForceLevel2>;
export type DisableForceLevel2Input = z.infer<typeof schema.disableForceLevel2>;
export type StartGodPartyInput = z.infer<typeof schema.startGodParty>;
export type StopGodPartyInput = z.infer<typeof schema.stopGodParty>;
export type StartRoyaleInput = z.infer<typeof schema.startRoyale>;
export type PauseRoyaleInput = z.infer<typeof schema.pauseRoyale>;
export type UnpauseRoyaleInput = z.infer<typeof schema.unpauseRoyale>;
export type StopRoyaleInput = z.infer<typeof schema.stopRoyale>;
export type MakeBattleHarderInput = z.infer<typeof schema.makeBattleHarder>;
export type MakeBattleEasierInput = z.infer<typeof schema.makeBattleEasier>;
export type ResetBattleDifficultyInput = z.infer<typeof schema.resetBattleDifficulty>;
export type MessageUserInput = z.infer<typeof schema.messageUser>;
export type ChangeUserInput = z.infer<typeof schema.changeUser>;
export type BroadcastInput = z.infer<typeof schema.broadcast>;
export type KickClientInput = z.infer<typeof schema.kickClient>;
export type InfoInput = z.infer<typeof schema.info>;
export type AuthInput = z.infer<typeof schema.auth>;

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
};

export interface Client {
  socket: any;
  name: string;
  roles: string[];
  shardId?: string;
  id: string;
  emit: ReturnType<typeof createShardRouter>; //any; // ShardClientRouter;
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
  isMasterClient: boolean;
  isDisconnected: boolean;
  isDead: boolean;
  isJoining: boolean;
  isSpectating: boolean;
  isStuck: boolean;
  isGod: boolean;
  isRealm: boolean;
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
  startedDate: number; // or Date if using Date objects
  endedAt: number | null;
  clients: Client[];
  events: RoundEvent[];
  states: any[];
};

export type Preset = {
  gameMode: string;
  isOmit?: boolean;
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

export type ConnectedOutput = Promise<{ status?: number }>;
export type InfoOutput = Promise<{ status?: number; data?: ServiceInfo }>;
export type SetCharacterOutput = Promise<{ status?: number }>;
export type SeerConnectedOutput = Promise<{ status?: number }>;
export type SeerDisconnectedOutput = Promise<{ status?: number }>;
export type SetConfigOutput = Promise<{ status?: number }>;
export type GetConfigOutput = Promise<{ status?: number; data?: Partial<Config> }>;
export type LoadOutput = Promise<{ status?: number }>;
export type SpectateOutput = Promise<{ status?: number }>;
export type LoginOutput = Promise<{ status?: number; token?: string }>;
export type AuthOutput = Promise<{ status?: number }>;
export type JoinOutput = Promise<{ status?: number }>;
export type UpdateMyselfOutput = Promise<{ status?: number }>;
export type RestartOutput = Promise<{ status?: number }>;
export type MaintenanceOutput = Promise<{ status?: number }>;
export type UnmaintenanceOutput = Promise<{ status?: number }>;
export type StartBattleRoyaleOutput = Promise<{ status?: number }>;
export type StopBattleRoyaleOutput = Promise<{ status?: number }>;
export type PauseRoundOutput = Promise<{ status?: number }>;
export type StartRoundOutput = Promise<{ status?: number }>;
export type EnableForceLevel2Output = Promise<{ status?: number }>;
export type DisableForceLevel2Output = Promise<{ status?: number }>;
export type StartGodPartyOutput = Promise<{ status?: number }>;
export type StopGodPartyOutput = Promise<{ status?: number }>;
export type StartRoyaleOutput = Promise<{ status?: number }>;
export type PauseRoyaleOutput = Promise<{ status?: number }>;
export type UnpauseRoyaleOutput = Promise<{ status?: number }>;
export type StopRoyaleOutput = Promise<{ status?: number }>;
export type MakeBattleHarderOutput = Promise<{ status?: number }>;
export type MakeBattleEasierOutput = Promise<{ status?: number }>;
export type ResetBattleDifficultyOutput = Promise<{ status?: number }>;
export type MessageUserOutput = Promise<{ status?: number }>;
export type ChangeUserOutput = Promise<{ status?: number }>;
export type BroadcastOutput = Promise<{ status?: number }>;
export type KickClientOutput = Promise<{ status?: number }>;

export type Service = {
  connected(input: ConnectedInput, ctx: ServiceContext): ConnectedOutput;
  info(input: InfoInput, ctx: ServiceContext): InfoOutput;
  seerConnected(input: SeerConnectedInput, ctx: ServiceContext): SeerConnectedOutput;
  seerDisconnected(input: SeerDisconnectedInput, ctx: ServiceContext): SeerDisconnectedOutput;
  setCharacter(input: SetCharacterInput, ctx: ServiceContext): SetCharacterOutput;
  setConfig(input: SetConfigInput, ctx: ServiceContext): SetConfigOutput;
  getConfig(input: GetConfigInput, ctx: ServiceContext): GetConfigOutput;
  load(input: LoadInput, ctx: ServiceContext): LoadOutput;
  spectate(input: SpectateInput, ctx: ServiceContext): SpectateOutput;
  login(input: LoginInput, ctx: ServiceContext): LoginOutput;
  auth(input: AuthInput, ctx: ServiceContext): AuthOutput;
  join(input: JoinInput, ctx: ServiceContext): JoinOutput;
  updateMyself(input: UpdateMyselfInput, ctx: ServiceContext): UpdateMyselfOutput;
  restart(input: RestartInput, ctx: ServiceContext): RestartOutput;
  maintenance(input: MaintenanceInput, ctx: ServiceContext): MaintenanceOutput;
  unmaintenance(input: UnmaintenanceInput, ctx: ServiceContext): UnmaintenanceOutput;
  startBattleRoyale(input: StartBattleRoyaleInput, ctx: ServiceContext): StartBattleRoyaleOutput;
  stopBattleRoyale(input: StopBattleRoyaleInput, ctx: ServiceContext): StopBattleRoyaleOutput;
  pauseRound(input: PauseRoundInput, ctx: ServiceContext): PauseRoundOutput;
  startRound(input: StartRoundInput, ctx: ServiceContext): StartRoundOutput;
  enableForceLevel2(input: EnableForceLevel2Input, ctx: ServiceContext): EnableForceLevel2Output;
  disableForceLevel2(input: DisableForceLevel2Input, ctx: ServiceContext): DisableForceLevel2Output;
  startGodParty(input: StartGodPartyInput, ctx: ServiceContext): StartGodPartyOutput;
  stopGodParty(input: StopGodPartyInput, ctx: ServiceContext): StopGodPartyOutput;
  startRoyale(input: StartRoyaleInput, ctx: ServiceContext): StartRoyaleOutput;
  pauseRoyale(input: PauseRoyaleInput, ctx: ServiceContext): PauseRoyaleOutput;
  unpauseRoyale(input: UnpauseRoyaleInput, ctx: ServiceContext): UnpauseRoyaleOutput;
  stopRoyale(input: StopRoyaleInput, ctx: ServiceContext): StopRoyaleOutput;
  makeBattleHarder(input: MakeBattleHarderInput, ctx: ServiceContext): MakeBattleHarderOutput;
  makeBattleEasier(input: MakeBattleEasierInput, ctx: ServiceContext): MakeBattleEasierOutput;
  resetBattleDifficulty(input: ResetBattleDifficultyInput, ctx: ServiceContext): ResetBattleDifficultyOutput;
  messageUser(input: MessageUserInput, ctx: ServiceContext): MessageUserOutput;
  changeUser(input: ChangeUserInput, ctx: ServiceContext): ChangeUserOutput;
  broadcast(input: BroadcastInput, ctx: ServiceContext): BroadcastOutput;
  kickClient(input: KickClientInput, ctx: ServiceContext): KickClientOutput;
};
