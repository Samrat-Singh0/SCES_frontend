import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {catchError, switchMap} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const accessToken = localStorage.getItem('accessToken');
  const userJson = localStorage.getItem('loggedInUser');
  const WHITELIST_API = ['http://localhost:8008/api/auth/login', 'http://localhost:8080/api/auth/refresh']

  if(!accessToken || !userJson) {
    return next(req);
  }

  const user = JSON.parse(userJson);

  const accessExpiry: Date = new Date(user.accessExpiryDate);
  const refreshExpiry: Date = new Date(user.refreshExpiryDate);

  if(WHITELIST_API.includes(req.url)){
    return next(req);
  }

  const now = new Date();

  if(accessExpiry > now){
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return next(authReq);
  }else{
    if(refreshExpiry > now) {
      return authService.refreshToken().pipe(
        switchMap(res => {
          const newAccessToken = res.headers.get('Authorization');
          const newAccessExpiry = res.body?.body?.accessExpiryDate;

          localStorage.setItem('accessToken', newAccessToken);
          const updatedUser = {...user, accessExpiryDate: newAccessExpiry};
          localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${newAccessToken}`
            }
          });
          return next(retryReq);
        }), catchError(error => {
          // console.log(error);
          return next(req);
        })
      );

    } else {
      localStorage.setItem('accessToken', '');
      localStorage.setItem('refreshToken', '');
      localStorage.setItem('role', '');
      localStorage.setItem('loggedInUser', '');
      router.navigate(['login']);
      return next(req);
    }
  }
};





