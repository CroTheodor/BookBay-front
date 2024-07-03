import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginFormComponent } from '../login-form/login-form.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-manager',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, RouterModule],
  templateUrl: './auth-manager.component.html',
  styleUrl: './auth-manager.component.scss'
})
export class AuthManagerComponent {

  public displayProfile: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router
  ){

  }

  public isAuthenticated(): boolean{
    return this.authService.isAuthenticated();
  }

  public clicked(){
    this.displayProfile = !this.displayProfile;
  }

  confirmLogin() {
    this.displayProfile = false;
    this.router.navigate([""]);
  }

}
