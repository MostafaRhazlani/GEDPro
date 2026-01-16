import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles as RoleEnum } from 'src/users/enums/user.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    console.log('here');

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest() as { user: { role: RoleEnum } };
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        'Your role does not have permission to access this resource',
      );
    }

    return true;
  }
}
