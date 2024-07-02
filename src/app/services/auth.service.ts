import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, WritableSignal, computed, signal } from '@angular/core';
import { tap } from 'rxjs';
import { RegisterDTO, UserDTO } from '../interfaces/user.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: WritableSignal<string | null> = signal(null);
  private userInfo = computed(() => {
    if (this.token()) {
      const decodedToken: UserDTO = jwtDecode(this.token()!);
      return decodedToken;
    }
    return null
  });

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
      tap((data: any) => {
        this.token.set(data.token);
        if (remember) {
          localStorage.setItem("user_toke", data);
        }
      })
    )
  }

  public register(info: RegisterDTO) {
    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };

    return this.http.post(this.routes.register(), info, options).pipe(
      tap((data: any) => {
        this.token.set(data.token!);
      })
    )
  }

  public changePassword(newPassword: string) {
    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token()}`
      })
    }
    return this.http.put(this.routes.changePassword(), { password: newPassword }, options);
  }

  public getAuthToken(): string | null {
    return this.token();
  }

  public getUserInfo(): UserDTO | null {
    return this.userInfo();
  }

  public isAuthenticated(): boolean {
    return !!this.token();
  }
}
