import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListingDTO, ListingRequestFilter } from '../interfaces/listing.model';
import { generateParams } from '../utils/util-funs';
import {
  HttpResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '../interfaces/http.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListingsService {
  private readonly ROUTES = {
    getAll: () => `${this.completeUrl}`,
    getById: (id: string) => `${this.completeUrl}/${id}`,
    bid: (id: string) => `${this.ROUTES.getById(id)}/bid`,
    active: () => `${this.completeUrl}/active`,
    userActive: ()=>`${this.completeUrl}/user/active`,
    userExpired: ()=>`${this.completeUrl}/user/expired`,
  };

  private url = 'http://localhost:3500';
  private api = 'listings';
  private completeUrl = `${this.url}/${this.api}`;

  constructor(private http: HttpClient) {}

  public getActive(
    pagination?: PaginatedRequest,
    filter?: ListingRequestFilter,
  ): Observable<HttpResponse<PaginatedResponse<ListingDTO>>>{
    const params: HttpParams = generateParams({ ...filter, ...pagination });
    return this.http.get<HttpResponse<PaginatedResponse<ListingDTO>>>(this.ROUTES.active(), { params }).pipe(
      tap((res) => {
        return JSON.parse(JSON.stringify(res));
      }),
    );
  }

  public createListing(listing: ListingDTO){
    return this.http.post(this.ROUTES.getAll(), listing ).pipe(
      tap((res)=>{
        return JSON.parse(JSON.stringify(res));
      })
    )
  }

  public getById(id:string){
    return this.http.get(this.ROUTES.getById(id), {}).pipe(
      tap(res=>JSON.parse(JSON.stringify(res)))
    )
  }

  public placeBid(id: string, amount: number) {
    return this.http.post(this.ROUTES.bid(id), {amount: amount}).pipe(
      tap((res)=>JSON.parse(JSON.stringify(res)))
    )
  }

  public getUserActiveListings(pagination: PaginatedRequest){
    const params = generateParams(pagination);
    return this.http.get<HttpResponse<PaginatedResponse<ListingDTO>>>(this.ROUTES.userActive(), { params }).pipe(
      tap((res) => {
        return JSON.parse(JSON.stringify(res));
      }),
    );
  }

  public getUserExpiredListings(pagination: PaginatedRequest){
    const params = generateParams(pagination);
    return this.http.get<HttpResponse<PaginatedResponse<ListingDTO>>>(this.ROUTES.userExpired(), { params }).pipe(
      tap((res) => {
        return JSON.parse(JSON.stringify(res));
      }),
    );
  }
}
