import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router,
              private http: HttpClient) {}
  
  canActivate() {
    return this.auth.checkSession()
      .then(() => {
        if (!this.auth.user) {
          return this.auth.recoverSessionData()
          .then(() => {
            console.log('%c ✓ Sesión iniciada ', 'background: green')
            return true;
          }).catch(() =>{
            return false
          })
        } else {
          console.log('%c ✓ Sesión iniciada ', 'background: green')
          return true
        }
      })
      .catch(() => {
        this.router.navigate(['/login']);
        console.log('%c ✕ Sesión no iniciada ', 'background: red')
        return false;
      });
  }
  
}
