/**
 * Interface representing a single tenant record in the monthly report
 */
export interface TenantReportData {
  accountNumber: string;
  equifaxAccountNumber: string;
  reportingMonth: string;
  tenantFirstName: string;
  tenantMiddleName: string;
  tenantSurname: string;
  tenantSuffix: string | null; 
  addressNumber: string;
  addressStreet: string;
  addressUnit: string | null;
  addressPOBox: string | null;
  addressCity: string;
  addressProvince: string;
  addressPostalCode: string;
  dateOfBirth: string; 
  telephoneNumber: string | null; 
  sin : string | null; 
  dateAccountOpened: string;
  monthlyRentAmount: string;
  expectedPayment: string;
  actualPaymentReceived: string;
  paymentStatus: string;
  historicalAccountStatus: string | null; 
  rentPastDue: string;
  dateOfFirstMissedRentPayment: string | null;
  dateAccountClosed: string | null;
  dateOfLastRentPayment: string;
  leaseType: string;
}
