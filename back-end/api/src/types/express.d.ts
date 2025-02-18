import { Request } from 'express';

interface JwtPayload {
  username: string;
  role: string;
  
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
