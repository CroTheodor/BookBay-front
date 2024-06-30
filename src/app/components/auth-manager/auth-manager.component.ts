import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-manager',
  standalone: true,
  imports: [],
  templateUrl: './auth-manager.component.html',
  styleUrl: './auth-manager.component.scss'
})
export class AuthManagerComponent {

  constructor(){

  }

  public isAuthenticated(){
    return true;
  }

  public clicked(){
    console.log("hi");

  }

}
