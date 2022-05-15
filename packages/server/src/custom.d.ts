import { User as PrismaUser } from '@prisma/client';

export {};

declare global {
  namespace Express {
    export interface User extends PrismaUser {
      id: PrismaUser['id'];
    }
  }
}
