import { Module } from '@nestjs/common';
import { MonthlyTenantReportConsumerService } from './services/monthly-tenant-report/monthly-tenant-report-consumer.service.js';
import CommonModule from '../common/common.module.js';

@Module({
  imports: [CommonModule],
  providers: [MonthlyTenantReportConsumerService],
})
export class ConsumerModule {}
