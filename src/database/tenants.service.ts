import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { isNull } from 'drizzle-orm';
import * as schema from '../schema';
import tenants from '../schema/tenants.schema';

export interface TenantNameData {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
}

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);

  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getAllActiveTenants(): Promise<TenantNameData[]> {
    try {
      const activeTenants = await this.db
        .select({
          id: tenants.id,
          first_name: tenants.first_name,
          middle_name: tenants.middle_name,
          last_name: tenants.last_name,
        })
        .from(tenants)
        .where(isNull(tenants.deleted_at));

      this.logger.log(`Fetched ${activeTenants.length} active tenants`);
      return activeTenants;
    } catch (error) {
      this.logger.error(`Failed to fetch tenants: ${error.message}`, error.stack);
      throw error;
    }
  }
}
