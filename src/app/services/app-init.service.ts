import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  constructor(private authService: AuthService) { }

  initializeApp(): Promise<void>{
    return new Promise((resolve) => {
      const localToken = localStorage.getItem("authToken");
      if(localToken){
        const decodedToken = jwtDecode(localToken);
        const expireTime = decodedToken.exp! * 1000;
        if(Date.now() < expireTime){
          this.authService.setToken(localToken);
        } else{
          localStorage.removeItem("authToken");
        }
      }
      resolve();
    })
  }
}
