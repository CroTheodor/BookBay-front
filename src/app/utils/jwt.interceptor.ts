import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const isLoggedIn = this.auth.isAuthenticated();
    const isApiCall = request.url.startsWith(environment.baseUrl);
    if (isLoggedIn && isApiCall) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${this.auth.getAuthToken()}` },
      });
    }
    return next.handle(request);
  }
}
