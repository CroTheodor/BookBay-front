import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, WritableSignal, computed, signal } from '@angular/core';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { E_ROLE, RegisterDTO, UserDTO } from '../interfaces/user.model';
import { jwtDecode } from 'jwt-decode';
import { extractRole } from '../utils/util-funs';

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
      decodedToken.displayedRole = extractRole(decodedToken.roles);
      return decodedToken;
    }
    return null;
  });

  //Needed for change password logic
  private tokenTemp: string | undefined;

  private readonly routes = {
    login: () => `${this.url}/${this.api}/login`,
    register: () => `${this.url}/${this.api}/register`,
    registerMod: () => `${this.url}/${this.api}/register/moderator`,
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

  public registerMod(info: RegisterDTO) {
    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post(this.routes.registerMod(), info, options);
  }

  public finalizePasswordChangeProcedure(newPassword: string) {
    if (!this.tokenTemp) {
      return;
    }
    this.token.set(this.tokenTemp!);
    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .put(this.routes.changePassword(), { password: newPassword }, options)
      .pipe(
        tap(() => {
          this.token.set(null);
        }),
      );
  }

  public logOut() {
    localStorage.removeItem('authToken');
    this.token.set(null);
    this.authEvents.next(AUTH_EVENT.logout);
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

  public isModerator() {
    const userInfo = this.userInfo();
    if (!userInfo) return false;
    return userInfo.roles.includes(E_ROLE.MODRATOR);
  }

  public isAdministrator() {
    const userInfo = this.userInfo();
    if (!userInfo) return false;
    return userInfo.roles.includes(E_ROLE.ADMINISTRATOR);
  }

  public initPasswordChangeProcedure() {
    this.tokenTemp = this.token() ?? undefined;
    this.token.set(null);
    localStorage.removeItem('authToken');
  }
}
