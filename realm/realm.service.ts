import { RouterInput, RouterOutput } from './realm.router';
import { ServiceContext, Seer } from './realm.types';

export type Service = {
  seer: Seer;
  subProcesses: any[];

  auth(input: RouterInput['auth'], ctx: ServiceContext): Promise<RouterOutput['auth']>;
  connectSeer(input: RouterInput['connectSeer'], ctx: ServiceContext): Promise<RouterOutput['connectSeer']>;
  ping(input: RouterInput['ping'], ctx: ServiceContext): Promise<RouterOutput['ping']>;
  setConfig(input: RouterInput['setConfig'], ctx: ServiceContext): Promise<RouterOutput['setConfig']>;
  info(input: RouterInput['info'], ctx: ServiceContext): Promise<RouterOutput['info']>;
  createShard(input: RouterInput['createShard'], ctx: ServiceContext): Promise<RouterOutput['createShard']>;
  getShards(input: RouterInput['getShards'], ctx: ServiceContext): Promise<RouterOutput['getShards']>;
  addMod(input: RouterInput['addMod'], ctx: ServiceContext): Promise<RouterOutput['addMod']>;
  removeMod(input: RouterInput['removeMod'], ctx: ServiceContext): Promise<RouterOutput['removeMod']>;
  banClient(input: RouterInput['banClient'], ctx: ServiceContext): Promise<RouterOutput['banClient']>;
  banUser(input: RouterInput['banUser'], ctx: ServiceContext): Promise<RouterOutput['banUser']>;
  unbanClient(input: RouterInput['unbanClient'], ctx: ServiceContext): Promise<RouterOutput['unbanClient']>;
  matchShard(input: RouterInput['matchShard'], ctx: ServiceContext): Promise<RouterOutput['matchShard']>;

  // call({
  //   data,
  //   signature,
  // }: {
  //   data: { method: string };
  //   signature?: { address?: string; hash?: string };
  // }): Promise<ServiceResponse>;
};
