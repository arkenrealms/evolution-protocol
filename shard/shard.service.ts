import { createTRPCProxyClient, httpBatchLink, createWSClient, wsLink } from '@trpc/client';
import { Router } from './shard.router';
import { Character, Application, Client } from './shard.types';

export class Service {
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
