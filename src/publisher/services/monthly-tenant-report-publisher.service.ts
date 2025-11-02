import { Injectable, Logger } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class MonthlyTenantReportPublisherService {
  private readonly logger = new Logger(MonthlyTenantReportPublisherService.name);

  constructor(private readonly sqsService: SqsService) {}
  @Cron('* * * * *')
  async sendMonthlyReportMessage(): Promise<void> {
    try {
      await this.sqsService.send('pcp-tenant-monthly-report', {
        id: `monthly-report-${Date.now()}`,
        body: { 
          reportType: 'monthly-tenant-report', 
          timestamp: new Date().toISOString(), 
          message: 'This is a monthly tenant report message' 
        },
        delaySeconds: 0,
      });

      this.logger.log('Monthly report message sent to SQS successfully');
    } catch (error) {
      this.logger.error('Failed to send monthly report message to SQS', error);
      throw error;
    }
  }
}
