import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryInfoCardComponent } from './delivery-info-card.component';

describe('DeliveryInfoCardComponent', () => {
  let component: DeliveryInfoCardComponent;
  let fixture: ComponentFixture<DeliveryInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryInfoCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliveryInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
