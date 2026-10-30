import {sql} from 'drizzle-orm';
import { sqliteTable, text, integer, index, uniqueIndex, blob, primaryKey, check } from 'drizzle-orm/sqlite-core';
export const erpRecords=sqliteTable('erp_records',{
 id:text('id').primaryKey(),ownerId:text('owner_id').notNull(),kind:text('kind').notNull(),studentId:text('student_id'),termId:text('term_id'),courseId:text('course_id'),body:text('body').notNull(),dedupeKey:text('dedupe_key'),revision:integer('revision').notNull().default(1),archived:integer('archived').notNull().default(0),createdAt:text('created_at').notNull(),updatedAt:text('updated_at').notNull(),
},t=>[index('records_owner_kind').on(t.ownerId,t.kind),index('records_course').on(t.ownerId,t.courseId),uniqueIndex('records_owner_dedupe').on(t.ownerId,t.dedupeKey)]);
export const changes=sqliteTable('erp_changes',{
 id:text('id').primaryKey(),ownerId:text('owner_id').notNull(),recordId:text('record_id').notNull(),revision:integer('revision').notNull(),action:text('action').notNull(),reason:text('reason').notNull(),snapshot:text('snapshot').notNull(),createdAt:text('created_at').notNull(),
},t=>[index('changes_owner_record').on(t.ownerId,t.recordId),uniqueIndex('changes_record_revision').on(t.recordId,t.revision)]);
export const attachments=sqliteTable('erp_attachments',{
 id:text('id').primaryKey(),ownerId:text('owner_id').notNull(),recordId:text('record_id').notNull(),name:text('name').notNull(),contentType:text('content_type').notNull(),size:integer('size').notNull(),objectKey:text('object_key').notNull(),createdAt:text('created_at').notNull(),
},t=>[index('attachments_owner_record').on(t.ownerId,t.recordId)]);

export const evidenceObjects=sqliteTable('erp_evidence_objects',{
 objectKey:text('object_key').primaryKey(),size:integer('size').notNull(),sha256:text('sha256').notNull(),
},t=>[check('evidence_size_limit',sql`${t.size} > 0 AND ${t.size} <= 10485760`)]);
export const evidenceChunks=sqliteTable('erp_evidence_chunks',{
 objectKey:text('object_key').notNull().references(()=>evidenceObjects.objectKey,{onDelete:'cascade'}),part:integer('part').notNull(),data:blob('data').notNull(),
},t=>[primaryKey({columns:[t.objectKey,t.part]})]);

export const portalUsers=sqliteTable('portal_users',{
 id:text('id').primaryKey().notNull(),username:text('username').unique(),passwordHash:text('password_hash'),role:text('role').notNull(),mustChange:integer('must_change').notNull().default(1),disabled:integer('disabled').notNull().default(0),created:integer('created').notNull(),
},t=>[check('portal_role',sql`${t.role} IN ('owner','viewer')`)]);
export const portalSessions=sqliteTable('portal_sessions',{
 tokenHash:text('token_hash').primaryKey().notNull(),userId:text('user_id').notNull().references(()=>portalUsers.id),method:text('method').notNull(),created:integer('created').notNull(),lastSeen:integer('last_seen').notNull(),expires:integer('expires').notNull(),
},t=>[index('portal_sessions_expiry').on(t.expires),index('portal_sessions_user').on(t.userId)]);
export const portalLoginLimits=sqliteTable('portal_login_limits',{
 key:text('key').primaryKey().notNull(),window:integer('window').notNull(),hits:integer('hits').notNull(),
});
