import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../schema';
import reports from '../schema/reports.schema';

export interface CreateReportDto {
  type: string;
  name: string;
  status: string;
  description?: string;
  file_name: string;
  file_key: string;
  metadata?: Record<string, any>;
  error_message?: string;
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async createReport(data: CreateReportDto) {
    try {
      const [report] = await this.db
        .insert(reports)
        .values({
          type: data.type,
          name: data.name,
          status: data.status,
          description: data.description || null,
          file_name: data.file_name,
          file_key: data.file_key,
          metadata: data.metadata || null,
          error_message: data.error_message || null,
        })
        .returning();

      this.logger.log(`Report created successfully: ${report.id}`);
      return report;
    } catch (error) {
      this.logger.error(`Failed to create report: ${error.message}`, error.stack);
      throw error;
    }
  }

  // async getReportById(id: number) {
  //   try {
  //     const report = await this.db.query.reports.findFirst({
  //       where: (reports, { eq }) => eq(reports.id, id),
  //     });
  //     return report;
  //   } catch (error) {
  //     this.logger.error(`Failed to get report by ID: ${error.message}`, error.stack);
  //     throw error;
  //   }
  // }
}
