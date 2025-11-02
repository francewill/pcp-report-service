import { pgTable, serial, varchar, date, boolean, timestamp, numeric, integer } from 'drizzle-orm/pg-core';

const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  first_name: varchar('first_name', { length: 255 }).notNull(),
  middle_name: varchar('middle_name', { length: 255 }),
  last_name: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }),
  google_id: varchar('google_id', { length: 255 }),
  suffix: varchar('suffix', { length: 255 }),
  company_name: varchar('company_name', { length: 255 }),
  birth_date: date('birth_date'),
  profile_picture_key: varchar('profile_picture_key', { length: 255 }),
  is_profile_complete: boolean('is_profile_complete').notNull().default(false),
  is_verified: boolean('is_verified').notNull().default(false),
  status: varchar('status', { length: 50 }).notNull(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  auth_id: integer('auth_id'),
  civil_status: varchar('civil_status', { length: 255 }).default(''),
  gross_monthly_income: numeric('gross_monthly_income', { precision: 10, scale: 2 }).notNull().default('0'),
  otp_attempts: integer('otp_attempts').notNull().default(0),
  otp_reset_at: timestamp('otp_reset_at', { withTimezone: true }).notNull().defaultNow(),
  otp_max_sent: integer('otp_max_sent').notNull().default(0),
  stripe_customer_id: varchar('stripe_customer_id', { length: 255 }),
  social_insurance_number: varchar('social_insurance_number', { length: 255 }),
});

export default tenants;
