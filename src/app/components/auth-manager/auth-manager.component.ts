import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  selector: 'app-auth-manager',
  standalone: true,
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './auth-manager.component.html',
  styleUrl: './auth-manager.component.scss'
})
export class AuthManagerComponent {

  public displayProfile: boolean = false;
  constructor(private authService: AuthService){

  }

  public isAuthenticated(): boolean{
    return this.authService.isAuthenticated();
  }

  public clicked(){
    console.log("hi");
    this.displayProfile = !this.displayProfile;
  }

}
