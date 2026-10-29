import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

import { UserRole } from '../../users/user.schema';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user: AuthUser }>();

    return request.user;
  },
);