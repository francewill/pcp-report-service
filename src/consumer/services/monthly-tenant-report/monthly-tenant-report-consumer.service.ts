import { Injectable, Logger } from '@nestjs/common';
import type { Message } from '@aws-sdk/client-sqs';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import S3Service from '../../../common/services/s3.service';
import { randomUUID } from 'crypto';
import { generateTenantReportCsv, getTenantReportColumns } from './csv-builder';
import { TenantReportData } from './types';

@Injectable()
export class MonthlyTenantReportConsumerService {
  private readonly logger = new Logger(MonthlyTenantReportConsumerService.name);
  private reportCounter = 0;

  constructor(private readonly s3Service: S3Service) {}

  @SqsMessageHandler('pcp-tenant-monthly-report', false)
  public async handleMessage(message: Message) {
    this.logger.log('Received message from SQS queue');

    try {
      const messageBody = message.Body;

      if (!messageBody) {
        this.logger.warn('Received message with empty body');
        return;
      }

      this.logger.log(`hey i received the message, it says "${messageBody}"`);

      const parsedBody = JSON.parse(messageBody);
      this.logger.log('Parsed message data:', JSON.stringify(parsedBody, null, 2));

      // Generate and upload CSV report
      await this.generateAndUploadReport();

    } catch (error) {
      this.logger.error('Error processing monthly tenant report message', error);
      throw error;
    }
  }

  private async generateAndUploadReport(): Promise<void> {
    try {
      // Increment counter and format as 4-digit string  for testing
      this.reportCounter++;
      const reportId = this.reportCounter.toString().padStart(4, '0');
      const uuid = randomUUID();

      this.logger.log(`Generating report: rental_credit_report_${reportId}`);

      // Generate CSV content
      const csvBuffer = await this.generateCsvBuffer();

      // Build file key
      const fileKey = `reports/rental_credit_report/rental_credit_report_${reportId}-${uuid}/rental_credit_report_${reportId}.csv`;

      // Upload to MinIO
      await this.s3Service.uploadFile(csvBuffer, 'text/csv', fileKey);

      this.logger.log(`Report uploaded successfully to: ${fileKey}`);
    } catch (error) {
      this.logger.error('Error generating and uploading report', error);
      throw error;
    }
  }

  private async generateCsvBuffer(): Promise<Buffer> {
    // TODO: Fetch tenant data from database
    // For now, using sample data
    const tenantData: TenantReportData[] = [
      {
        accountNumber: '001',
        equifaxAccountNumber: 'EQ001',
        reportingMonth: '2024-05',
        tenantFirstName: 'John',
        tenantMiddleName: 'A',
        tenantSurname: 'Doe',
        tenantSuffix: null,
        addressNumber: '123',
        addressStreet: 'Main St',
        addressUnit: '4B',
        addressPOBox: null,
        addressCity: 'Metropolis',
        addressProvince: 'ON',
        addressPostalCode: 'A1A1A1',
        dateOfBirth: '1990-01-01',
        telephoneNumber: '555-1234',
        sin: '123-456-789',
        dateAccountOpened: '2020-01-15',
        monthlyRentAmount: '1200.00',
        expectedPayment: '1200.00',
        actualPaymentReceived: '1200.00',
        paymentStatus: 'On Time',
        historicalAccountStatus: null,
        rentPastDue: '0.00',
        dateOfFirstMissedRentPayment: null,
        dateAccountClosed: null,
        dateOfLastRentPayment: '2024-05-01',
        leaseType: '1',
      },

    ];

    // Log column names optional for debugging
    const columns = getTenantReportColumns();
    this.logger.log(`CSV Columns: ${columns.join(', ')}`);

    // Generate CSV buffer using the csv-builder
    return generateTenantReportCsv(tenantData);
  }
}
