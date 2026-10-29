import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type AppStateDocument = HydratedDocument<AppState>;

@Schema({ timestamps: true, collection: 'app_state' })
export class AppState {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  data!: Record<string, unknown>;
}

export const AppStateSchema = SchemaFactory.createForClass(AppState);
