import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthUser } from '../auth/decorators/current-user.decorator';
import { AppState, AppStateDocument } from './app-state.schema';

// Only app UI state is accepted. Authentication tokens and secrets are never persisted here.
const ALLOWED_KEY = /^(userName|userEmail|userPhone|family[A-Za-z0-9_-]*|everSenior[A-Za-z0-9_-]*|companion[A-Za-z0-9_-]*|training[A-Za-z0-9_-]*|psychometric[A-Za-z0-9_-]*|onboarding[A-Za-z0-9_-]*|notification[A-Za-z0-9_-]*|messages[A-Za-z0-9_-]*|sos[A-Za-z0-9_-]*|favorite[A-Za-z0-9_-]*|profile[A-Za-z0-9_-]*|senior[A-Za-z0-9_-]*|booking[A-Za-z0-9_-]*|ticket[A-Za-z0-9_-]*|activity[A-Za-z0-9_-]*|settings[A-Za-z0-9_-]*|theme[A-Za-z0-9_-]*|language[A-Za-z0-9_-]*|event[A-Za-z0-9_-]*)$/i;

@Injectable()
export class AppStateService {
  constructor(@InjectModel(AppState.name) private readonly states: Model<AppStateDocument>) {}

  async get(user: AuthUser) {
    const state = await this.states.findOne({ userId: new Types.ObjectId(user.id) }).lean();
    return { data: state?.data ?? {} };
  }

  async update(user: AuthUser, data: Record<string, unknown>) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new BadRequestException('data must be an object');
    }
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (!ALLOWED_KEY.test(key) || key === 'accessToken' || key === 'JWT_SECRET') continue;
      if (value === undefined) continue;
      updates[`data.${key}`] = value;
    }
    if (Object.keys(updates).length) {
      await this.states.findOneAndUpdate(
        { userId: new Types.ObjectId(user.id) },
        { $set: updates, $setOnInsert: { userId: new Types.ObjectId(user.id) } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
    return this.get(user);
  }

  async remove(user: AuthUser, key: string) {
    if (!ALLOWED_KEY.test(key)) throw new BadRequestException('Unsupported app-state key');
    await this.states.updateOne(
      { userId: new Types.ObjectId(user.id) },
      { $unset: { [`data.${key}`]: 1 } },
    );
    return this.get(user);
  }
}
