import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { E_ROLE, UserDTO } from '../../interfaces/user.model';
import { DeliveryInfoCardComponent } from '../../components/delivery-info-card/delivery-info-card.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DeliveryInfoCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {

  isAuthenticated = false;
  userInfo: UserDTO | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  public calcRole(){
    if(this.userInfo?.roles.includes(E_ROLE.MODRATOR)){
      return "Moderator";
    } else return "Student";
  }
}
