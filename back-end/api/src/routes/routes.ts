import express, { Router } from 'express'
import { AuthRoutes } from './public-routes/auth.routes';
import { authenticateJWT } from '../middleware/authMiddleware';
import { SecuredRoutes } from './secured-routes/secured.routes';
export class Routes {
    constructor() {
    }
    public SetRoutes():Router {
        const router = express.Router();
        const authRoutes = new AuthRoutes();
        const securedRoutes = new SecuredRoutes()
        router.use('/auth',authRoutes.router)
        router.use('/secured',authenticateJWT,securedRoutes.router)
        return router;
    }
}