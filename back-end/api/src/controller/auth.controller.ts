import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import rateLimiter from '../services/rateLimitService';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';
import { User } from '../models/userModel';

const userService = new UserService();
const authService = new AuthService();

export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    try {
        if(!username ||!password){
            console.error("Invalid credentials")
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const user = await userService.getUserByUsername(username);
        if(!user){
            console.error("User Not Found")
            res.status(404).json({ error: 'User Not Found' });
            return;
        }
        const token = await authService.authenticateUser(user,username,password)
        if(!token){
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const requestMagicLink = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.body;
    try {
        const user = await userService.getUserByUsername(username);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        try {
            const link = authService.generateMagicLink(username);
            res.json({ message: 'Magic link generated', link });
        } catch (error) {
            res.status(404).json({ error: 'User Not Found' });
        }
       
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};

export const validateMagicLink = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers['authorization']?.split(' ')[1] as string;
    try {
        const tokenData = await authService.getTokenByTokenValue(token);
        if (!tokenData) {
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }
        const decoded:any = jwt.verify(token, config.JWT_SECRET);
        if(decoded.username){
            const userDetails= await userService.getUserByUsername(decoded.username)
            res.json({ user: userDetails });
        }else{
            res.json({ user: decoded });
        }
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export const validateToken= async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers['authorization']?.split(' ')[1] as string;
        const decoded:any = jwt.verify(token, config.JWT_SECRET);
        if(decoded.username){
            const userDetails= await userService.getUserByUsername(decoded.username)
            res.json({ user: userDetails });
        }else{
            res.json({ user: decoded });
        }
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}

export const kickoutUser = async (req: Request, res: Response): Promise<void> => {

    const request= await req.body;
    const user= request.user
    try {
        if(!user.locked){
            await authService.deleteToken(user.username);
            await userService.lockAccount(user.username);
            res.json({ message: `User ${user.username} has been logged out` });
        }else{
            await userService.unLockAccount(user.username);
            res.json({ message: `User ${user.username} has been un blocked` });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to kick out user' });
    }
};

export const getAllUsers =async( req:Request, res:Response) =>{
    try {
        const user = await userService.getAllUsers()
        res.json({ userList: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get all user' });
    }
}