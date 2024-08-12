import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ListingsService } from '../../services/listings.service';
import { ListingDTO } from '../../interfaces/listing.model';
import { HttpResponse, PaginatedResponse } from '../../interfaces/http.model';
import { catchError, of } from 'rxjs';
import { ListingCardComponent } from '../../components/listing-card/listing-card.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, ListingCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public latestListings: ListingDTO[] = [];
  public soonToEnd: ListingDTO[] = [];

  constructor(
    private authService: AuthService,
    private listingService: ListingsService,
    private router: Router
  ) {
    this.getLatest();
    this.getSoonToEnd();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public getLatest() {
    this.listingService
      .getActive({ page: 0, limit: 3 })
      .pipe(catchError((err) => of(err)))
      .subscribe((response: HttpResponse<PaginatedResponse<ListingDTO>>) => {
        this.latestListings = response.response.content;
      });
  }

  public getSoonToEnd(){
    this.listingService.getSoonToExpire()
      .subscribe(
        (res: any)=>{
          this.soonToEnd = res.response;
        }
      )
  }

  public goToListing(id: string){
    this.router.navigate(['/books/details/' + id ])
  }
}
