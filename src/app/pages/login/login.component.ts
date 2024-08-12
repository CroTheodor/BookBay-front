import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginFormComponent ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  constructor(private router: Router, private auth: AuthService){}

  public onLoginSuccess(): void{
    const authInfo = this.auth.getUserInfo()!;
    if(authInfo.passwordReset){
      this.router.navigate(['/change-password']);
    } else {
      this.router.navigate(['']);
    }
  }
}
