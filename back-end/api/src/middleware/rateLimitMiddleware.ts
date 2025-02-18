import { Request, Response, NextFunction } from 'express';
import rateLimiter from '../services/rateLimitService';
import { UserService } from '../services/userService';

const userService = new UserService()

export const rateLimit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const username = req.body.username || req.query.username;
  if (!username) {
    console.warn('Rate limit check skipped: Missing username');
    return next();
  }
  try {
    await rateLimiter.consume(username);
    next();
  } catch (err) {
    try{
      await userService.lockAccount(username);
    }catch(e){
      res.status(404).json({ error: 'User Not Found' })
    }
    console.warn(`Rate limit exceeded for ${username}`);
    res.status(429).json({ error: 'Too many requests, please try again later' });
    return;
  }
};

