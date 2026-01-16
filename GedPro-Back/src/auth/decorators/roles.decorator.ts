import { SetMetadata } from '@nestjs/common';
import { Roles as RoleEnum } from 'src/users/enums/user.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
