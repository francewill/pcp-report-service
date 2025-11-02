CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(100),
	"name" varchar(500),
	"status" varchar(100),
	"description" text,
	"file_name" varchar(500),
	"file_key" varchar(500),
	"metadata" jsonb,
	"error_message" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
