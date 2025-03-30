CREATE TYPE "public"."task_priority" AS ENUM('P1', 'P2', 'P3');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"created_by" text NOT NULL,
	"task_name" text NOT NULL,
	"task_description" text,
	"createdAt" timestamp (6) with time zone DEFAULT now(),
	"updatedAt" timestamp (6) with time zone DEFAULT now(),
	"status" "task_status" DEFAULT 'NOT_STARTED' NOT NULL,
	"priority" "task_priority" DEFAULT 'P3' NOT NULL,
	"category" varchar(100),
	"completedAt" timestamp (6) with time zone DEFAULT null,
	CONSTRAINT "tasks_id_unique" UNIQUE("id")
);
