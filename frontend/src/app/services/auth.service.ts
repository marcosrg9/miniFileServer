import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

interface User {

  name:     string;
  lastPath: string;

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;

  constructor(private http: HttpClient,
              private router: Router) { }

  public logIn(user: { name: string, pass: string }) {
    const { name, pass } = user;
    return new Promise((resolve, reject) => {
      
      if (!name || !pass) return reject('empty');
  
      this.http.post<User>('/api/auth/login', user, { withCredentials: true })
      .subscribe({
        next: (a) => {
          this.user = a;
          console.log(this.user)
          resolve(a)
        },
        error: (err) => reject(err)
      })

    })
  }

  public logOut() {
    return this.http.get('api/auth/logout', { responseType: 'text' })
    .subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  public recoverSessionData() {
    return new Promise<void>((resolve, reject) => {
      this.http.get<User>('/api/auth/sessionData')
      .subscribe({
        next: ((a) => {
          this.user = a;
          resolve();
        }),
        error: ((err) => {
          reject(err);
        })
      })
    })
  }

  public checkSession() {
    return new Promise((resolve, reject) => {
      firstValueFrom(this.http.head('/api/auth/islogged'))
        .then(a => {
          return resolve(true);
        })
        .catch((err: HttpErrorResponse) => {
          return reject(err);
        });
    })
  }
}
