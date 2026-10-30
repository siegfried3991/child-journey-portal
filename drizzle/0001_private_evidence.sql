CREATE TABLE `erp_evidence_chunks` (
	`object_key` text NOT NULL,
	`part` integer NOT NULL,
	`data` blob NOT NULL,
	PRIMARY KEY(`object_key`, `part`),
	FOREIGN KEY (`object_key`) REFERENCES `erp_evidence_objects`(`object_key`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `erp_evidence_objects` (
	`object_key` text PRIMARY KEY NOT NULL,
	`size` integer NOT NULL,
	`sha256` text NOT NULL,
	CONSTRAINT "evidence_size_limit" CHECK("erp_evidence_objects"."size" > 0 AND "erp_evidence_objects"."size" <= 10485760)
);
