import { Component, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ListingCardComponent } from '../../components/listing-card/listing-card.component';
import { ListingDTO } from '../../interfaces/listing.model';
import { ListingsService } from '../../services/listings.service';
import { HttpResponse, PaginatedRequest, PaginatedResponse } from '../../interfaces/http.model';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-listings',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, ListingCardComponent],
  templateUrl: './user-listings.component.html',
  styleUrl: './user-listings.component.scss'
})
export class UserListingsComponent implements OnInit{

  public activeListings: ListingDTO[] = [];
  public pageIndexActive: number = 0;
  public pageSizeActive: number = 10;
  public lengthActive: number = 10;

  public expiredListings: ListingDTO[] = [];
  public pageIndexExpired: number = 0;
  public pageSizeExpired: number = 10;
  public lengthExpired: number = 10;

  public selectedTab: number = 0;

  public wonListings: ListingDTO[] = [];
  public pageIndexWon: number = 0;
  public pageSizeWon: number = 10;
  public lengthWon: number = 10;


  pageSizeOptions: number[] = [10];

  pageEvent!: PageEvent;

  constructor(
    private listingService: ListingsService,
    private router: Router
  ){
  }

  ngOnInit(): void {
    this.getActiveListings();
    this.getExpiredListings();
    this.getWonListings();
  }

  handlePageEventActive(event: PageEvent) {
    this.pageEvent = event;
    this.lengthActive = event.length;
    this.pageSizeActive = event.pageSize;
    this.pageIndexActive = event.pageIndex;

    this.getActiveListings();
  }

  handlePageEventExpired(event: PageEvent) {
    this.pageEvent = event;
    this.lengthExpired = event.length;
    this.pageSizeExpired = event.pageSize;
    this.pageIndexExpired = event.pageIndex;

    this.getActiveListings();
  }

  handlePageEventWon(event: PageEvent) {
    this.pageEvent = event;
    this.lengthWon = event.length;
    this.pageSizeWon = event.pageSize;
    this.pageIndexWon = event.pageIndex;

    this.getActiveListings();
  }

  public getActiveListings(){

    const paginator: PaginatedRequest = {
      page: this.pageIndexActive,
      limit: this.pageSizeActive,
    };

    this.listingService
      .getUserActiveListings(paginator)
      .pipe(catchError((err) => of(err)))
      .subscribe((response: HttpResponse<PaginatedResponse<ListingDTO>>) => {
        this.lengthActive = response.response.totalItems;
        this.activeListings = response.response.content;
      });
  }

  public getExpiredListings(){

    const paginator: PaginatedRequest = {
      page: this.pageIndexExpired,
      limit: this.pageSizeExpired,
    };

    this.listingService
      .getUserExpiredListings(paginator)
      .pipe(catchError((err) => of(err)))
      .subscribe((response: HttpResponse<PaginatedResponse<ListingDTO>>) => {
        this.lengthExpired= response.response.totalItems;
        this.expiredListings = response.response.content;
      });

  }

  public getWonListings(){

    const paginator: PaginatedRequest = {
      page: this.pageIndexWon,
      limit: this.pageSizeWon,
    };

    this.listingService
      .getUserWonListings(paginator)
      .pipe(catchError((err) => of(err)))
      .subscribe((response: HttpResponse<PaginatedResponse<ListingDTO>>) => {
        this.lengthWon= response.response.totalItems;
        this.wonListings = response.response.content;
      });

  }

  goToDetails(id: string) {
    this.router.navigate([`books/details/${id}`]);
  }

  updateListing(id: string) {
    this.router.navigate([`listings/edit/${id}`]);
  }

  goToPayment(id: string) {
    this.router.navigate([`user/listings/pay/${id}`]);
  }

  public setTab(i: number){
    this.selectedTab = i;
  }

}
