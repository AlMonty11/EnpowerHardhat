import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Ajusta el tipo según tus necesidades
    }
  }
}
