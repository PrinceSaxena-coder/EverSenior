import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({ collection: 'audit_logs', versionKey: false })
export class AuditLog {
  @Prop({ required: true })
  action!: string;

  @Prop({ required: false, index: true })
  actorId?: string;

  @Prop({ required: false })
  actorRole?: string;

  @Prop({ required: true })
  requestId!: string;

  @Prop({ required: false })
  resourceType?: string;

  @Prop({ required: false })
  resourceId?: string;

  @Prop({ type: Object, required: false })
  metadata?: Record<string, unknown>;

  @Prop({ required: true, default: Date.now })
  createdAt!: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
AuditLogSchema.index({ createdAt: -1 });
