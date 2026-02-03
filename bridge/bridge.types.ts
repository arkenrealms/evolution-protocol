import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import { z } from 'zod';

export type { Router } from './bridge.router';

export type Client = any;

export type Service = {
  init: (input: any, ctx: any) => Promise<{ status: number }>;
  info: (input: any, ctx: any) => Promise<{ data: any }>;
  configure: (
    input: any,
    ctx: any
  ) => Promise<{ status: number; data: { rewardWinnerAmount: number; rewardItemAmount: number } }>;
  saveRound: (input: any, ctx: any) => Promise<{ status: number }>;
  confirmProfile: (input: any, ctx: any) => Promise<{ status: number }>;
  auth: (input: any, ctx: any) => Promise<{ status: number }>;
  normalizeAddress: (input: any, ctx: any) => Promise<{ status: number }>;
  getRandomReward: (input: any, ctx: any) => Promise<{ status: number }>;
  connect: (input: any, ctx: any) => Promise<{ status: number }>;
  disconnect: (input: any, ctx: any) => Promise<{ status: number }>;
  seerDisconnected: (input: any, ctx: any) => Promise<{ status: number }>;
};
