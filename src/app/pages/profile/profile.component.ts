import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserDTO } from '../../interfaces/user.model';
import { DeliveryInfoCardComponent } from '../../components/delivery-info-card/delivery-info-card.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DeliveryInfoCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {

  userInfo: UserDTO | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    console.log(this.userInfo)

  }
}
