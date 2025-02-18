import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/config';
import { createToken, deleteToken, getTokenByTokenValueFromDb, getTokenByTokenValueFromDbByUserId } from '../models/tokenModel';
import { getUserDetailsByUsername, User } from '../models/userModel';
import bcrypt from 'bcryptjs';
import { UserService } from './userService';

const userService = new UserService();
export class AuthService {
    constructor() { }
    async generateToken(username: string): Promise<string> {
        try {
            const user = await getUserDetailsByUsername(username);
            if (!user) {
                throw new Error('User not found');
            }
            const secret = config.JWT_SECRET;
            const expiration = '1h';
            const payload = {
                username: user.username,
            };
            return jwt.sign(payload, secret, { expiresIn: expiration, algorithm: 'HS256' });
        } catch (error) {
            console.error("User not found")
            throw error
        }

    }

    generateMagicLink = async (username: string) => {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + config.MAGIC_LINK_EXPIRATION);
        const user=await  userService.getUserByUsername(username)
            if(user && user.id){
                createToken(user.id.toString(), token, expiresAt);
                return `http://localhost:3000/magic-link/${token}`;
            }
        else{
            throw new Error("User not Found")
        }
    }

    async getTokenByTokenValue(token: string) {
        try {
            return getTokenByTokenValueFromDb(token);
        } catch (error) {
            console.log("Error in getTokenByTokenValueFromDb", error)
            throw error
        }
    }

    async deleteToken(username: string) {
        try {
            const user=await  userService.getUserByUsername(username)
            if(user && user.id){
                const isTokenExist=await getTokenByTokenValueFromDbByUserId(user.id.toString())
                console.log("isTokenExist",isTokenExist)
                if(!isTokenExist)
                    return null;
                await deleteToken(user.id.toString());
            }
            
        } catch (error) {
            console.error("Error in deleteToken", error)
            throw error
        }
    }

    async authenticateUser(user: User, username:string ,password: string) {
        try {
            if (user &&user.password && !bcrypt.compare(password, user.password)) {
                await userService.updateFailedAttempts(user.username, user.failed_attempts + 1);
                if (user.failed_attempts&&user.failed_attempts + 1 >= 5) {
                    await userService.lockAccount(user.username);
                    console.error("Account locked due to too many failed login attempts")
                    return;
                }
                console.error("Invalid credentials")
                return;
            }
            await userService.resetFailedAttempts(username);
            const token = this.generateToken(username);
            return token;
        } catch (error) {
            console.error("Error in authenticateUser",error)
            throw error
        }
    }
}
