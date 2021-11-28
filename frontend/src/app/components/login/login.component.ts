import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  user = { name: 'Marcos', pass: '1234' };
  error: 'wrong' | 'empty' | 'server';

  constructor(private auth: AuthService,
              private router: Router) { }

  login() {
    this.auth.logIn(this.user)
      .then(a => {
        this.router.navigate(['/dashboard/explorer'])
      })
      .catch((err: HttpErrorResponse) => {
        if (err.status === 304) this.router.navigate(['/dashboard/explorer'])
        else if (err.status === 404) this.error = 'wrong'
        else if (err.status >= 500) this.error = 'server'
        else if (err.status === 400) this.error = 'empty'
      })
    
  }

}
