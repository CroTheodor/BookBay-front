import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { io } from "socket.io-client";
import { AuthService } from './services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bayb';

  constructor(
    private authService: AuthService
  ) {
    this.testLogin();
  }

  private testLogin() {
    this.authService.login('king@gmail.com', "test_password", false).subscribe((el) => console.log(el));
  }
}
