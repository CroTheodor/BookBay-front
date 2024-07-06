import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  constructor(private authService: AuthService) { }

  initializeApp(): Promise<void>{
    return new Promise((resolve) => {
      const localToken = localStorage.getItem("authToken");
      if(localToken){
        console.log("TOKEN FOUND!");
        this.authService.setToken(localToken);
      }
      else {
        console.log("NO TOKEN FOUND");
      }
      resolve();
    })
  }
}
