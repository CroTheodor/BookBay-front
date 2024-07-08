import { Component, Input } from '@angular/core';
import { ListingDTO } from '../../interfaces/listing.model';

@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [],
  templateUrl: './listing-card.component.html',
  styleUrl: './listing-card.component.scss'
})
export class ListingCardComponent {

  @Input()
  listingInfo!: ListingDTO;

}
