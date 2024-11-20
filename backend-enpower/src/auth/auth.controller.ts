/* eslint-disable prettier/prettier */
// auth.controller.ts
import { Controller, Post, Body, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    private authService : AuthService,
  ){

  }
  
  @Post('callback')
  async callback(@Body('code') body: any) {
    if (!body) {
      throw new InternalServerErrorException('Code is undefined');
    }

    try {
      console.log("Code: ",body);
      try{
        const tokenData = await this.authService.exchangeCodeForToken(body);
        const userInfo = this.authService.getUserInfoFromToken(tokenData.access_token);
        console.log("UserInfo: ",userInfo);
        return userInfo;
      }catch(error){
        throw new Error("Failed to obtain token from code or decode user info 1: "+ error)
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to obtain token or decode user info 2: '+error);
    }
  }
}

// import { Controller, Post, Body, InternalServerErrorException } from '@nestjs/common';
// import axios from 'axios';
// import qs from 'qs';

// @Controller('auth')
// export class AuthController {
//   @Post('callback')
//   async callback(@Body() body:any) {
//     const code = body; 

//     if (!code) {
//       throw new InternalServerErrorException('Code is undefined');
//     }

//     try {
//       const tokenResponse = await axios.post(
//         `http://${process.env.KEYCLOAK_IP}:8180/auth/realms/market-app/protocol/openid-connect/token`,
//         qs.stringify({
//           client_id: 'frontend',
//           client_secret: process.env.KEYCLOAK_CLIENT_SECRET, // Solo si es un cliente "confidential"
//           grant_type: 'authorization_code',
//           redirect_uri: `http://${process.env.FRONTEND_IP}:4200/callback`,
//           code: code,
//         }),
//         {
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//         }
//       );

//       return tokenResponse.data; // Retorna los datos del token
//     } catch (error) {
//       // console.error('Error obtaining token:', error);
//       throw new InternalServerErrorException(`Failed to obtain token: ${error}`);
//     }
//   }
// }

