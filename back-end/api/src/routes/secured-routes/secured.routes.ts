

import express, { Router } from 'express';
import {  getAllUsers, kickoutUser, validateMagicLink, validateToken } from '../../controller/auth.controller';
import { getTime } from '../../controller/time.controller';
import { isAdmin } from '../../middleware/authMiddleware';


export class SecuredRoutes{
    router: Router
    constructor(){
        this.router=Router()
        this.init()
    }

    init(){
        this.router.post('/kickout',isAdmin, kickoutUser);
        this.router.get('/time', getTime);
        this.router.get('/verify-magic-link',validateMagicLink);
        this.router.get('/me',validateToken)
        this.router.get('/users',getAllUsers)
    }
}

