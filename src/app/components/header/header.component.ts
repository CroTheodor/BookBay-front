import { Component } from '@angular/core';
import { AuthManagerComponent } from '../auth-manager/auth-manager.component';
import { RouterModule } from '@angular/router';

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

}
