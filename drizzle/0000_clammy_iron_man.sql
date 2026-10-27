CREATE TABLE `erp_attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`record_id` text NOT NULL,
	`name` text NOT NULL,
	`content_type` text NOT NULL,
	`size` integer NOT NULL,
	`object_key` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `attachments_owner_record` ON `erp_attachments` (`owner_id`,`record_id`);--> statement-breakpoint
CREATE TABLE `erp_changes` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`record_id` text NOT NULL,
	`revision` integer NOT NULL,
	`action` text NOT NULL,
	`reason` text NOT NULL,
	`snapshot` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `changes_owner_record` ON `erp_changes` (`owner_id`,`record_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `changes_record_revision` ON `erp_changes` (`record_id`,`revision`);--> statement-breakpoint
CREATE TABLE `erp_records` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`kind` text NOT NULL,
	`student_id` text,
	`term_id` text,
	`course_id` text,
	`body` text NOT NULL,
	`dedupe_key` text,
	`revision` integer DEFAULT 1 NOT NULL,
	`archived` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `records_owner_kind` ON `erp_records` (`owner_id`,`kind`);--> statement-breakpoint
CREATE INDEX `records_course` ON `erp_records` (`owner_id`,`course_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `records_owner_dedupe` ON `erp_records` (`owner_id`,`dedupe_key`);