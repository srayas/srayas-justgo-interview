import { Router } from 'express';
import { rateLimit } from '../../middleware/rateLimitMiddleware';
import { login, requestMagicLink } from '../../controller/auth.controller';


export class AuthRoutes{
    router: Router
    constructor(){
        this.router=Router()
        this.init()
    }
    init(){
        this.router.post('/login', rateLimit, login);
        this.router.post('/magic-link', rateLimit, requestMagicLink);  
    }
}