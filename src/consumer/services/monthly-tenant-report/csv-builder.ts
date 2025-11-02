import { format } from 'fast-csv';
import { TenantReportData } from './types';

/**
 * Returns the human-readable column headers for the tenant report CSV
 * These will appear as the header row in the CSV file
 */
export function getTenantReportColumns(): string[] {
  return [
    'Account Number',
    'Equifax Account Number',
    'Reporting Month',
    'Tenant First Name',
    'Tenant Middle Name',
    'Tenant Surname',
    'Tenant Suffix',
    'Address: House/Building Number',
    'Address: Street Name',
    'Address: Unit / Suite',
    'Address: PO Box / Rural Route',
    'Address: City',
    'Address: Province',
    'Address: Postal Code',
    'Date of Birth',
    'Telephone',
    'SIN',
    'Date Account Opened',
    'Lease Start Date / Date Account Opened',
    'Monthly Rent Amount',
    'Expected Payment',
    'Actual Payment Received',
    'Payment Status (Days Late)',
    'Historical Account Status',
    'Rent Past Due',
    'Date of First Missed Rent Payment (if applicable)',
    'Date Account Closed (if applicable)',
    'Date of Last Rent Payment',
    'Lease Type',
  ];
}

/**
 * Generates a CSV buffer from tenant report data
 * @param data - Array of tenant records to convert to CSV
 * @returns Promise that resolves to a CSV Buffer
 */
export function generateTenantReportCsv(
  data: TenantReportData[],
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const rows: Buffer[] = [];

    // Get the column headers
    const headers = getTenantReportColumns();

    // use custom headers
    const csvStream = format({ headers });

    csvStream.on('data', (chunk: Buffer) => rows.push(chunk));
    csvStream.on('end', () => resolve(Buffer.concat(rows)));
    csvStream.on('error', reject);

    // Map each data object to an array matching the header order
    data.forEach((row) => {
      csvStream.write([
        row.accountNumber,
        row.equifaxAccountNumber,
        row.reportingMonth,
        row.tenantFirstName,
        row.tenantMiddleName,
        row.tenantSurname,
        row.tenantSuffix,
        row.addressNumber,
        row.addressStreet,
        row.addressUnit,
        row.addressPOBox,
        row.addressCity,
        row.addressProvince,
        row.addressPostalCode,
        row.dateOfBirth,
        row.telephoneNumber,
        row.sin,
        row.dateAccountOpened,
        row.monthlyRentAmount,
        row.expectedPayment,
        row.actualPaymentReceived,
        row.paymentStatus,
        row.historicalAccountStatus,
        row.rentPastDue,
        row.dateOfFirstMissedRentPayment,
        row.dateAccountClosed,
        row.dateOfLastRentPayment,
        row.leaseType,
      ]);
    });
    csvStream.end();
  });
}
