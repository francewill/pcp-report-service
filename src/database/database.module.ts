import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../schema';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          host: configService.get('DB_HOST'),
          user: configService.get('DB_USER'),
          password: configService.get('DB_PASS'),
          database: configService.get('DB_NAME'),
          port: configService.get('DB_PORT'),
          ssl: false,
        });
        return drizzle({ client: pool, schema });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
