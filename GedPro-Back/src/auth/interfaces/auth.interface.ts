import { Roles } from 'src/users/enums/user.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Roles;
  full_name: string;
}
