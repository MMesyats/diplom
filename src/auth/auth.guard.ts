import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return await this.validateRequest(request);
  }

  async validateRequest(request: Request) {
    const { token } = request.cookies;
    if (!token) return false;
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      request.cookies.userId = decodedToken.user_id;
      request.body.userData = decodedToken;
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
