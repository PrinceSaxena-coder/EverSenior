import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export const REQUEST_ID_HEADER = 'x-request-id';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const incoming = req.header(REQUEST_ID_HEADER);
    const requestId = incoming && /^[a-zA-Z0-9._-]{1,100}$/.test(incoming) ? incoming : randomUUID();
    res.setHeader(REQUEST_ID_HEADER, requestId);
    (req as Request & { requestId: string }).requestId = requestId;
    next();
  }
}
