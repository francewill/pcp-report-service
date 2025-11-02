import { pgTable, serial, varchar, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 100 }),
  name: varchar('name', { length: 500 }),
  status: varchar('status', { length: 100 }),
  description: text('description'),
  file_name: varchar('file_name', { length: 500 }),
  file_key: varchar('file_key', { length: 500 }),
  metadata: jsonb('metadata'),
  error_message: text('error_message'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export default reports;
