import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ShipmentInfoDTO } from '../../interfaces/user.model';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

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

  @Input()
  save: boolean = true;

  @Output()
  shipmentInfoChage: EventEmitter<ShipmentInfoDTO> = new EventEmitter<ShipmentInfoDTO>();

  deliveryInfo: FormGroup;

  supportedCounties: string[] = [];

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.deliveryInfo = this.fb.group({
      address: new FormControl(
        { value: '', disabled: !this.edit },
        Validators.required,
      ),
      city: new FormControl(
        { value: '', disabled: !this.edit },
        Validators.required,
      ),
      post_code: new FormControl(
        { value: '', disabled: !this.edit },
        Validators.required,
      ),
      county: new FormControl(
        { value: '', disabled: !this.edit },
        Validators.required,
      ),
    });
    this.loadCounties();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['info']) {
      if (!!this.info) {
        this.deliveryInfo.patchValue({ address: this.info.address });
        this.deliveryInfo.patchValue({ city: this.info.city });
        this.deliveryInfo.patchValue({ post_code: this.info.post_code });
        this.deliveryInfo.patchValue({ county: this.info.county });
      }
    }
  }

  public enableEdit() {
    this.edit = true;
    this.setFormFieldsStatus(true);
  }

  private setFormFieldsStatus(disabled: boolean) {
    const addressFormControl = this.deliveryInfo.get('address');
    const cityFormControl = this.deliveryInfo.get('city');
    const postCodeFormControl = this.deliveryInfo.get('post_code');
    const countyFormControl = this.deliveryInfo.get('county');

    if (!disabled) {
      addressFormControl?.disable();
      cityFormControl?.disable();
      postCodeFormControl?.disable();
      countyFormControl?.disable();
    } else {
      addressFormControl?.enable();
      cityFormControl?.enable();
      postCodeFormControl?.enable();
      countyFormControl?.enable();
    }
  }

  private loadCounties(){
    this.userService.getSupportedCounties()
      .subscribe(
        (res: any)=>{
          this.supportedCounties = res.response;
        }
      )
  }

  public saveInfo(){
    if(!this.save){
      this.shipmentInfoChage.emit(this.deliveryInfo.value);
      return;
    }
    if(this.deliveryInfo.valid){
      this.userService.updateUser(this.authService.getUserInfo()?._id!,{shipmentInfo: this.deliveryInfo.value} ).subscribe(

        (res)=>{
          if(res instanceof HttpErrorResponse){
            alert("Something didn't go right");
          } else {
            this.edit = false;
            this.setFormFieldsStatus(false);
          }
        }
      )
    }
  }

  public disableEdit(){
    this.setFormFieldsStatus(false);
    this.edit = false;
  }
}
