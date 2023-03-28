import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../Shared/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (route.routeConfig?.path === 'auth') {
      
      if (this.authService.getUser().uid ) {
        this.router.navigate(['/workspaces']);
      }
      return true;
    }

    if (this.authService.getUser().uid) {
      return true;
    }

    if (await this.authService.tryAutoLogin()) {
      return true;
    }

    this.router.navigate(['/auth']);
    return false;
  }

  async canLoad(route: Route, state: UrlSegment[]): Promise<boolean> {
    
    if (this.authService.getUser().uid) {
      return true;
    }
    
    if (await this.authService.tryAutoLogin()) {
      return true;
    }

    this.router.navigate(['/auth']);
    return false;
  }
}
