import { Module } from '@nestjs/common';
import { MonthlyTenantReportPublisherService } from './services/monthly-tenant-report-publisher.service.js';

@Module({
  providers: [MonthlyTenantReportPublisherService],
  exports: [MonthlyTenantReportPublisherService],
})
export class PublisherModule {}
