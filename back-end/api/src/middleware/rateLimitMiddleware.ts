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
    console.log('Rate limit rateLimit');
    await rateLimiter.consume(username);
    next();
  } catch (err) {
    try{
      console.log('Rate limit lock');
      await userService.lockAccount(username);
    }catch(e){
      console.log('Rate limit lock error');
      res.status(404).json({ error: 'User Not Found' })
    }
    console.log('Rate limit lock exceed');
    console.warn(`Rate limit exceeded for ${username}`);
    res.status(429).json({ error: 'Too many requests, please try again later' });
    return;
  }
};

