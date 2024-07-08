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
}
