import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, ROLES_KEY } from './roles.decorator';
import { UserService } from '../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Grabbing the roles we injected through SetMetadata in our route and class (if we had class level authorization)
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    // Checking to see our user object in our request has the routes in them
    const { user } = context.switchToHttp().getRequest();
    if (user && user.email !== undefined) {
      console.log(user);
      const foundUser = await this.userService.getSingleUser(user.email);
      if (foundUser) {
        console.log(foundUser);
        return requiredRoles.some(role => foundUser.roles?.includes(role));
      }
    }

    console.log('No user in request object...');
    return Promise.resolve(false);
  }
}
