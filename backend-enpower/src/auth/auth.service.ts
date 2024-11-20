/* eslint-disable prettier/prettier */
// src/auth/auth.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import qs from 'qs';
// import jwt_decode from 'jwt-decode';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthService {
    private keycloakUrl = `http://${process.env.KEYCLOAK_IP}:8180/auth/realms/market-app/protocol/openid-connect/token`;

    async exchangeCodeForToken(code: string) {
        try {
            
            const tokenResponse = await axios.post( this.keycloakUrl,
                qs.stringify({
                    client_id: 'frontend',
                    client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
                    grant_type: 'authorization_code',
                    redirect_uri: `http://${process.env.FRONTEND_IP}:4200/callback`,
                    code: code,
                }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
            );
            return tokenResponse.data;
        } catch (error) {
            throw new InternalServerErrorException('Failed to exchange code for token: '+ error);
        }
    }

    getUserInfoFromToken(token: string) {
        try {
            // const decodedToken: any = jwt_decode(token);
            const decodedToken = jwt.decode(token) as any;

            const username = decodedToken.preferred_username || 'Unknown Username';

            const email = decodedToken.email || 'Unknown Email';
            const roles = decodedToken.realm_access?.roles || [];
            return { token, username, email, roles };
        } catch (error) {
            throw new InternalServerErrorException('Failed to decode token: '+ error);
        }
    }
}
