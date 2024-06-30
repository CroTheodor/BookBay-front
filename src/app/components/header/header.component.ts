import { Component } from '@angular/core';
import { AuthManagerComponent } from '../auth-manager/auth-manager.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AuthManagerComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
