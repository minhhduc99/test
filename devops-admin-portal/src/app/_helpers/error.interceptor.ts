import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.log(err);
            if ([401, 403].indexOf(err.status) !== -1) {
              if(err.url.endsWith('/login') == false && err.url.endsWith('/login-sso') == false && err.url.endsWith('/registerWithCIPAccount') == false) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                this.authenticationService.logout();
                location.reload(true);
              }
            }
            var error =  err.statusText;
            if(err.error) {
              error = err.error.message;
            }
            return throwError(error);
        }))
    }
}
