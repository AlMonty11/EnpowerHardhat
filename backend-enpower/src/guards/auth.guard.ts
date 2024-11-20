import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken'; // Asegúrate de tener esta biblioteca instalada

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1]; // Suponiendo que el token está en formato Bearer

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
        const secret = process.env.JWT_SECRET!; // Aserción no nula
        const decoded = jwt.verify(token, secret);
        request.user = decoded; // Ahora esto no debería dar error
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
  }
}
