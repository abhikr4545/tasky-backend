import { Global, Module } from '@nestjs/common';
import { DRIZZLE_OPTIONS } from './drizzle.constants';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { tasks } from '../tasks/schema';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_OPTIONS,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow('DATABASE_URL'),
        });
        return drizzle(pool, {
          schema: { tasks },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DRIZZLE_OPTIONS],
})
export class DrizzleModule {}
