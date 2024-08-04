import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, WritableSignal, computed, signal } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { RegisterDTO, UserDTO } from '../interfaces/user.model';
import { jwtDecode } from 'jwt-decode';

export enum AUTH_EVENT {
  login = 'login',
  logout = 'logout',
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: WritableSignal<string | null> = signal(null);
  private userInfo = computed(() => {
    if (this.token()) {
      const decodedToken: UserDTO = jwtDecode(this.token()!);
      return decodedToken;
    }
    return null;
  });

  private readonly routes = {
    login: () => `${this.url}/${this.api}/login`,
    register: () => `${this.url}/${this.api}/register`,
    changePassword: () => `${this.url}/${this.api}/change-password`,
  };

  public authEvents: BehaviorSubject<AUTH_EVENT> =
    new BehaviorSubject<AUTH_EVENT>(AUTH_EVENT.login);

  private url = 'http://localhost:3500';
  private api = 'auth';

  constructor(private http: HttpClient) { }

  public setToken(token: string) {
    this.token.set(token);
  }

  public login(mail: string, password: string, remember?: boolean) {
    const options = {
      headers: new HttpHeaders({
        authorization: 'Basic ' + btoa(mail + ':' + password),
        'cache-control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
    return this.http.get(this.routes.login(), options).pipe(
      tap((data: any) => {
        this.token.set(data.token);
        if (remember) {
          localStorage.setItem('authToken', data.token);
        }
        this.authEvents.next(AUTH_EVENT.login);
      }),
    );
  }

  public register(info: RegisterDTO) {
    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post(this.routes.register(), info, options).pipe(
      tap((data: any) => {
        this.token.set(data.token!);
        this.authEvents.next(AUTH_EVENT.login);
      }),
    );
  }

  public changePassword(newPassword: string) {
    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      }),
    };
    return this.http.put(
      this.routes.changePassword(),
      { password: newPassword },
      options,
    );
  }

  public logOut() {
    localStorage.removeItem('authToken');
    this.token.set(null);
    this.authEvents.next(AUTH_EVENT.logout)
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

  public isUsersId(id: string) {
    return this.userInfo()?._id === id;
  }
}
