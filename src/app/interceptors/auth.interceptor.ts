import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if(req.url.includes('/api/auth/login')){
    return next(req);
  }

  if(token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token.trim()}`
      }
    });
    return next(authReq);
  }

  return next(req);

};
