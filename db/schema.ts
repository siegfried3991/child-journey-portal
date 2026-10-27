import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
export const erpRecords=sqliteTable('erp_records',{
 id:text('id').primaryKey(),ownerId:text('owner_id').notNull(),kind:text('kind').notNull(),studentId:text('student_id'),termId:text('term_id'),courseId:text('course_id'),body:text('body').notNull(),dedupeKey:text('dedupe_key'),revision:integer('revision').notNull().default(1),archived:integer('archived').notNull().default(0),createdAt:text('created_at').notNull(),updatedAt:text('updated_at').notNull(),
},t=>[index('records_owner_kind').on(t.ownerId,t.kind),index('records_course').on(t.ownerId,t.courseId),uniqueIndex('records_owner_dedupe').on(t.ownerId,t.dedupeKey)]);
export const changes=sqliteTable('erp_changes',{
 id:text('id').primaryKey(),ownerId:text('owner_id').notNull(),recordId:text('record_id').notNull(),revision:integer('revision').notNull(),action:text('action').notNull(),reason:text('reason').notNull(),snapshot:text('snapshot').notNull(),createdAt:text('created_at').notNull(),
},t=>[index('changes_owner_record').on(t.ownerId,t.recordId),uniqueIndex('changes_record_revision').on(t.recordId,t.revision)]);
export const attachments=sqliteTable('erp_attachments',{
 id:text('id').primaryKey(),ownerId:text('owner_id').notNull(),recordId:text('record_id').notNull(),name:text('name').notNull(),contentType:text('content_type').notNull(),size:integer('size').notNull(),objectKey:text('object_key').notNull(),createdAt:text('created_at').notNull(),
},t=>[index('attachments_owner_record').on(t.ownerId,t.recordId)]);
