import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedRequest } from '../interfaces/http.model';
import { generateParams } from '../utils/util-funs';
import { Observable } from 'rxjs';
import { UserDTO } from '../interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API_ROUTES = {
    all: ()=>`${this.fullUrl}`,
    id: (id:string)=>`${this.fullUrl}/${id}`,
    counties: ()=>`${this.fullUrl}/info/counties`,
  }

  private readonly url = "http://localhost:3500";
  private readonly api = "users";
  private readonly fullUrl = `${this.url}/${this.api}`;

  constructor(private http: HttpClient) { }

  public updateUser(id: string, body: any){
    return this.http.put(this.API_ROUTES.id(id), body);
  }

  public getSupportedCounties(){
    return this.http.get(this.API_ROUTES.counties());
  }

  public getUsers(paginator: PaginatedRequest, filter:{key: string}): Observable<HttpResponse<UserDTO>>{
    const httpParams = generateParams({...paginator, ...filter});
    return this.http.get<HttpResponse<UserDTO>>(this.API_ROUTES.all(), {params: httpParams});
  }

  public deleteUser(id: string){
    return this.http.delete(this.API_ROUTES.id(id));
  }

}
