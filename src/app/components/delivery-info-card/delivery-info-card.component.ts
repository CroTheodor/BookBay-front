import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShipmentInfoDTO } from '../../interfaces/user.model';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-delivery-info-card',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './delivery-info-card.component.html',
  styleUrl: './delivery-info-card.component.scss',
})
export class DeliveryInfoCardComponent implements OnChanges {
  @Input()
  display: boolean = false;

  @Input()
  info: ShipmentInfoDTO | null = null;

  @Input()
  edit: boolean = false;

  deliveryInfo: FormGroup;

  constructor(private fb: FormBuilder) {
    this.deliveryInfo = this.fb.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      post_code: ['', Validators.required],
      county: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['info']) {
      if(!!this.info){
        this.deliveryInfo.patchValue({"address": this.info.address});
        this.deliveryInfo.patchValue({"city": this.info.city});
        this.deliveryInfo.patchValue({"post_code": this.info.post_code});
        this.deliveryInfo.patchValue({"county": this.info.county});
      }
    }
  }
}
