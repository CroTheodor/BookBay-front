import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewlistingsComponent } from './newlistings.component';

describe('NewlistingsComponent', () => {
  let component: NewlistingsComponent;
  let fixture: ComponentFixture<NewlistingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewlistingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewlistingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
