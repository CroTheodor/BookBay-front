import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token : string = "";
  private readonly routes = {
    login: () => `${this.url}/${this.api}/login`,
    register: () => `${this.url}/${this.api}/register`,
    changePassword: () => `${this.url}/${this.api}/change-password`
  }

  private url = 'http://localhost:3500';
  private api = 'auth';

  constructor(private http: HttpClient) { }

  public login(mail: string, password: string, remember?: boolean) {
    const options = {
      headers: new HttpHeaders({
        authorization: 'Basic ' + btoa(mail + ':' + password),
        'cache-control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    return this.http.get(this.routes.login(), options).pipe(
      tap((data: any)=>{
        this.token = data;
        if(remember) {
          localStorage.setItem("user_toke", data);
        }
      })
    )
  }
}
