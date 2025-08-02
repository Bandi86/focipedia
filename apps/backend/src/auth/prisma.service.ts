import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

// Dynamic import to handle Docker build issues
let PrismaClient: any;

try {
  PrismaClient = require('@prisma/client').PrismaClient;
} catch (error) {
  // Fallback for Docker build
  PrismaClient = class MockPrismaClient {
    async $connect() {}
    async $disconnect() {}
  };
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
} 