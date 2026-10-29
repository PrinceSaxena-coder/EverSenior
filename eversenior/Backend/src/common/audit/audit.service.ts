import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './audit.schema';

@Injectable()
export class AuditService {
  constructor(@InjectModel(AuditLog.name) private readonly model: Model<AuditLogDocument>) {}

  async record(input: {
    action: string;
    requestId: string;
    actorId?: string;
    actorRole?: string;
    resourceType?: string;
    resourceId?: string;
    metadata?: Record<string, unknown>;
  }) {
    const safeMetadata = input.metadata ? this.redact(input.metadata) : undefined;
    return this.model.create({ ...input, metadata: safeMetadata });
  }

  private redact(value: Record<string, unknown>) {
    const blocked = /password|token|secret|authorization|cookie|card(number|cvv|expiry)?|aadhaar|pan|bank|otp/i;
    const output: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      if (blocked.test(key)) continue;
      output[key] = item;
    }
    return output;
  }
}
