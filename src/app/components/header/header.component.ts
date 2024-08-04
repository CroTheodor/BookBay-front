import { Component } from '@angular/core';
import { AuthManagerComponent } from '../auth-manager/auth-manager.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AuthManagerComponent,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  public isModerator: boolean = false;

  constructor(private auth: AuthService){
    this.isModerator = this.auth.isModerator();
  }

}
