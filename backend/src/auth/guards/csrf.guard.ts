import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

interface RequestWithSession extends Request {
  session?: {
    csrfToken?: string;
  };
}

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithSession>();
    
    // Skip CSRF check for GET requests
    if (request.method === 'GET') {
      return true;
    }
    
    // Skip CSRF check in development
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    
    const csrfToken = request.headers['x-csrf-token'] as string;
    const sessionToken = request.session?.csrfToken;
    
    if (!csrfToken || !sessionToken || csrfToken !== sessionToken) {
      throw new ForbiddenException('Invalid CSRF token');
    }
    
    return true;
  }
}