import { Component, OnInit } from '@angular/core';
import { ListingCardComponent } from '../../components/listing-card/listing-card.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ListingsService } from '../../services/listings.service';
import { Router } from '@angular/router';
import {
  HttpResponse,
  PaginatedRequest,
  PaginatedResponse,
} from '../../interfaces/http.model';
import { catchError, of } from 'rxjs';
import {
  ListingDTO,
  ListingRequestFilter,
} from '../../interfaces/listing.model';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    ListingCardComponent,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent implements OnInit {
  length: number = 10;
  pageSize: number = 10;
  pageIndex: number = 0;

  pageSizeOptions = [10];

  pageEvent!: PageEvent;
  bookList: ListingDTO[] = [];

  supportedFilters: string[] = ['-', 'Author', 'Title', 'Publisher', 'Course'];

  selectedFilter: FormControl = new FormControl('', Validators.required);
  filter: FormControl = new FormControl(
    {
      value: '',
      disabled: true,
    },
    [Validators.required],
  );

  activeFilter: ListingRequestFilter = {};

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

  getActiveListings() {
    const paginator: PaginatedRequest = {
      page: this.pageIndex,
      limit: this.pageSize,
    };

    this.listingService
      .getActive(paginator, this.activeFilter)
      .pipe(catchError((err) => of(err)))
      .subscribe((response: HttpResponse<PaginatedResponse<ListingDTO>>) => {
        this.length = response.response.totalItems;
        this.bookList = response.response.content;
      });
  }

  goToDetails(id: string) {
    this.router.navigate([`books/details/${id}`]);
  }

  filterChange(filter: string) {
    this.filter.setValue('');
    if (filter === '-') {
      this.filter.disable();
      if (Object.keys(this.activeFilter).length > 0) {
        this.activeFilter = {};
        this.getActiveListings();
        this.selectedFilter.setValue('');
      }
    } else {
      this.filter.enable();
    }
    this.activeFilter = {};
  }

  applyFilter() {
    if (!this.filter.valid) {
      return;
    }
    const filter: string = (this.filter.value as string).trim();
    const selectedFilter: string = (this.selectedFilter.value as string)
      .toLowerCase()
      .trim();
    this.pageIndex = 0;
    this.activeFilter = {};
    if (selectedFilter === 'publisher') {
      this.activeFilter.publisher = filter;
    }
    if (selectedFilter === 'author') {
      this.activeFilter.author = filter;
    }
    if (selectedFilter === 'title') {
      this.activeFilter.title = filter;
    }
    if (selectedFilter === 'course') {
      this.activeFilter.course = filter;
    }
    this.getActiveListings();
  }
}
