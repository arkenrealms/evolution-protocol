import express, { Express } from 'express';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import { Server as SocketServer } from 'socket.io';
import { httpBatchLink, createTRPCProxyClient, loggerLink } from '@trpc/client';
import type { Router as SeerRouter } from '@arken/seer';
import type * as Shard from '../shard/types';
import type { Server as ShardServer } from '../shard/server';
import type { Signature } from '@arken/node/types';
export type { Router } from './server';

export interface ApplicationConfig {
  maxClients: number;
  roundId: number;
  shardKey: string;
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
  server: Express;
  isHttps: boolean;
  https?: HttpsServer;
  http?: HttpServer;
  io: SocketServer;
  subProcesses: any[];
  moduleConfig: ApplicationModule[];
  modules: Record<string, ApplicationModule>;
  seerList: string[];
  adminList: string[];
  modList: string[];
  sockets: Record<string, any>;
  version: string;
  endpoint: string;
  shards: Record<string, ShardServer>;
  profiles: Record<string, Profile>;
  web3: any; // Assume web3 is a configured instance
  secrets: any; // Secrets for signing
}

export interface ApplicationRouterContext {
  client: any;
  socket: any;
}

export interface Seer {
  emit: ReturnType<typeof createTRPCProxyClient<SeerRouter>>;
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
  ip: string;
  info: any;
  lastReportedTime: number;
  isMod: boolean;
  isAdmin: boolean;
  isSeer: boolean;
  log: {
    clientDisconnected: number;
  };
}

type ServerResponse = { status?: number };

export type Server = {
  seer: Seer;
  subProcesses: any[];
  auth({ signature }: { signature?: Signature }): Promise<ServerResponse>;
  ping(): Promise<ServerResponse>;
  setConfig({
    data,
    signature,
  }: {
    data?: { shardId?: string; config?: Record<string, any> };
    signature?: { address?: string; hash?: string };
  }): Promise<ServerResponse>;
  info(): Promise<ServerResponse>;
  addMod({
    data,
    signature,
  }: {
    data?: { target?: string };
    signature?: { address?: string; hash?: string };
  }): Promise<ServerResponse>;
  removeMod({
    data,
    signature,
  }: {
    data?: { target?: string };
    signature?: { address?: string; hash?: string };
  }): Promise<ServerResponse>;
  banClient({
    data,
    signature,
  }: {
    data?: { target?: string };
    signature?: { address?: string; hash?: string };
  }): Promise<ServerResponse>;
  banUser({
    data,
    signature,
  }: {
    data?: { target?: string; banReason?: string; banExpireDate?: string };
    signature?: { address?: string; hash?: string };
  }): Promise<ServerResponse>;
  // bridgeState(): Promise<ServerResponse>;
  unbanClient({
    data,
    signature,
  }: {
    data?: { target?: string };
    signature?: { address?: string; hash?: string };
  }): Promise<ServerResponse>;
  matchShard(): Promise<ServerResponse>;
  // call({
  //   data,
  //   signature,
  // }: {
  //   data: { method: string };
  //   signature?: { address?: string; hash?: string };
  // }): Promise<ServerResponse>;
};
