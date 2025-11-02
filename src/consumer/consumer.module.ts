import { Module } from '@nestjs/common';
import { MonthlyTenantReportConsumerService } from './services/monthly-tenant-report/monthly-tenant-report-consumer.service.js';
import CommonModule from '../common/common.module.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [CommonModule, DatabaseModule],
  providers: [MonthlyTenantReportConsumerService],
})
export class ConsumerModule {}
