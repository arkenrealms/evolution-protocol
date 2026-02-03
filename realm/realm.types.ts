// import express, { Express } from 'express';
// import { Server as HttpServer } from 'http';
// import { Server as HttpsServer } from 'https';
// import { Server as SocketServer } from 'socket.io';
// import { httpBatchLink, createTRPCProxyClient, loggerLink } from '@trpc/client';
// import type { Types as SeerTypes } from '@arken/seer-protocol';
// import type * as Shard from '../shard/shard.types';
import type { Service as ShardService } from '../shard/shard.service';

export type { Router, RouterInput, RouterOutput } from './realm.router';
export type { Service } from './realm.service';

export interface ApplicationConfig {
  maxClients: number;
  roundId: number;
  gameMode: string;
  shardKey: string;
  isRoundPaused: boolean;
  isBattleRoyale: boolean;
  isGodParty: boolean;
  level2open: boolean;
  //   rewardItemAmountPerLegitPlayer: number;
  //   rewardItemAmountMax: number;
  //   rewardWinnerAmountPerLegitPlayer: number;
  //   rewardWinnerAmountMax: number;
  //   rewardItemAmount: number;
  //   rewardWinnerAmount: number;
  //   drops: {
  //     guardian: number;
  //     earlyAccess: number;
  //     trinket: number;
  //     santa: number;
  //   };
  //   totalLegitPlayers: number;
  //   isBattleRoyale: boolean;
  //   isGodParty: boolean;
  //   level2open: boolean;
  //   isRoundPaused: boolean;
  //   gameMode: string;
  //   maxEvolves: number;
  //   pointsPerEvolve: number;
  //   pointsPerKill: number;
  //   decayPower: number;
  //   dynamicDecayPower: boolean;
  //   baseSpeed: number;
  //   avatarSpeedMultiplier: Record<number, number>;
  //   avatarDecayPower: Record<number, number>;
  //   preventBadKills: boolean;
  //   antifeed1: boolean;
  //   antifeed2: boolean;
  //   antifeed3: boolean;
  //   noDecay: boolean;
  //   noBoot: boolean;
  //   rewardSpawnLoopSeconds: number;
  //   orbOnDeathPercent: number;
  //   orbTimeoutSeconds: number;
  //   orbCutoffSeconds: number;
  //   orbLookup: Record<string, any>;
  //   roundLoopSeconds: number;
  //   fastLoopSeconds: number;
  //   leadercap: boolean;
  //   hideMap: boolean;
  //   checkPositionDistance: number;
  //   checkInterval: number;
  //   resetInterval: number;
  //   loggableEvents: string[];
  //   rewardSpawnPoints: { x: number; y: number }[];
  //   rewardSpawnPoints2: { x: number; y: number }[];
  //   mapBoundary: {
  //     x: { min: number; max: number };
  //     y: { min: number; max: number };
  //   };
  //   spawnBoundary1: {
  //     x: { min: number; max: number };
  //     y: { min: number; max: number };
  //   };
  //   spawnBoundary2: {
  //     x: { min: number; max: number };
  //     y: { min: number; max: number };
  //   };
  //   rewards: Record<string, any>;
}

export interface ApplicationModule {
  name: string;
  instance: (app: Application) => void | Promise<void>;
  async: boolean;
  timeout: number;
  unsavedGames: any[];
}

export interface ApplicationModules {
  [key: string]: (app: Application) => void | Promise<void>;
}

export interface Application {
  config: ApplicationConfig;
  server: any; // Express;
  isHttps: boolean;
  https?: any; //HttpsServer;
  http?: any; //HttpServer;
  io: any; //SocketServer;
  subProcesses: any[];
  moduleConfig: ApplicationModule[];
  modules: Record<string, ApplicationModule>;
  seerList: string[];
  adminList: string[];
  modList: string[];
  sockets: Record<string, any>;
  version: string;
  endpoint: string;
  shards: Record<string, ShardService>;
  profiles: Record<string, Profile>;
  web3: any; // Assume web3 is a configured instance
  secrets: any; // Secrets for signing
}

export interface ApplicationRouterContext {
  client: any;
  socket: any;
}

export interface Seer {
  client: any;
  emit: any; //ReturnType<typeof createTRPCProxyClient<SeerTypes.Router>>;
}

export interface Profile {
  address: string;
}

export class Realm {
  router: any;

  constructor() {
    // this.router = createRealmRouter(this);
  }
}

export interface Client {
  id: string;
  name: string;
  address: string;
  ip: string;
  socket: any;
  endpoint: string;
  ioCallbacks: any;
  info: any;
  lastReportedTime: number;
  isMod: boolean;
  isAdmin: boolean;
  isSeer: boolean;
  roles: string[];
  status: 'None' | 'Disconnected' | 'Connected';
  permissions: any;
  profile: any;
  log: {
    clientDisconnected: number;
  };
}

export interface ServiceContext {
  client: Client;
}
