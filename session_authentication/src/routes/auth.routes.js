import express from 'express';
import {login, logout,  register} from "../controllers";

export const authRoute = express.Router();


authRoute.post('/register', register);
authRoute.route('/login')
    .post(login)
    .patch(logout)


