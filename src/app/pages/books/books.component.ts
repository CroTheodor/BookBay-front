import { Component, OnInit } from '@angular/core';
import { ListingCardComponent } from '../../components/listing-card/listing-card.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ListingsService } from '../../services/listings.service';
import { Router } from '@angular/router';
import { HttpResponse, PaginatedRequest, PaginatedResponse } from '../../interfaces/http.model';
import { catchError, of } from 'rxjs';
import { ListingDTO } from '../../interfaces/listing.model';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [ListingCardComponent, MatPaginatorModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent implements OnInit{
  length: number = 20;
  pageSize: number = 20;
  pageIndex: number = 0;

  pageSizeOptions = [20];

  pageEvent!: PageEvent;
  bookList: ListingDTO[] = [];

  constructor(
    private listingService: ListingsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getActiveListings();
  }

  handlePageEvent(event: PageEvent) {
    this.pageEvent = event;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.getActiveListings();
  }

  getActiveListings(){
    const paginator: PaginatedRequest ={
      page:this.pageIndex + 1,
      limit: this.pageSize
    }
    this.listingService.getActive(paginator)
      .pipe(
        catchError(err=>of(err))
      ).subscribe(
        (response: HttpResponse<PaginatedResponse<ListingDTO>>)=>{
          this.length = response.response.totalItems;
          this.bookList = response.response.content;
        }
      )
  }

  goToDetails(id: string){
    this.router.navigate([`books/${id}`]);
  }
}
