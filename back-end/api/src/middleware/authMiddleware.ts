import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { JwtPayload } from '../types/express';
import { UserService } from '../services/userService';
import { User } from '../models/userModel';

const userService = new UserService();

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    console.error("Access denied. No token provided")
    res.status(401).json({ error: 'Access denied. No token provided' });
    return;
  }

  jwt.verify(token, config.JWT_SECRET, async (err, user:any) => {
    if (err) {
      console.error("Invalid token")
      res.status(403).json({ error: 'Invalid token' });
      return;
    }
    if(user.username){
      const userFromDb= await userService.getUserByUsername(user.username)
      try {
        const useLocked=await userService.getLockedUserByUserName(user.username)
        if(useLocked){
          res.status(403).json({ error: 'User has been Blocked' });
          return;
        }
      } catch (error) {
        
      }
      req.user = userFromDb as any
    }
    next();
  });
};

export const isAdmin =(req:Request, res:Response, next:NextFunction): void =>{
    if(!req.user){
      console.error("Access denied. No token provided")
        res.status(401).json({ error: 'Access denied. No token provided' });
        return ;
    }
    if(!req.user['role']||(req.user['role']&&req.user['role']!='admin')){
        console.error("UnAuthorized")
        res.status(403).json({error:'UnAuthorized'})
        return ;
    }
    next();
}
