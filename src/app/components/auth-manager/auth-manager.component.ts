import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginFormComponent } from '../login-form/login-form.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SocketService } from '../../services/socket.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth-manager',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, RouterModule],
  templateUrl: './auth-manager.component.html',
  styleUrl: './auth-manager.component.scss'
})
export class AuthManagerComponent implements OnInit {

  public displayProfile: boolean = false;
  public notification$!: Observable<boolean>;
  constructor(
    private authService: AuthService,
    private router: Router,
    private socket: SocketService,
  ) {
    this.notification$ = this.socket.getAppNotificationObservabe();
  }

  ngOnInit(): void {
    this.router.events.subscribe(
      (event)=>{
        if(event instanceof NavigationEnd){
          this.displayProfile = false;
        }
      }
    )
  }


  public isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public clicked() {
    this.displayProfile = !this.displayProfile;
  }

  confirmLogin() {
    this.displayProfile = false;
    this.router.navigate([""]);
  }

  logOut(){
    this.authService.logOut();
    this.router.navigate([""]);
  }

}
