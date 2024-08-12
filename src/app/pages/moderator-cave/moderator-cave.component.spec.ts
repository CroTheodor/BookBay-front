import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorCaveComponent } from './moderator-cave.component';

describe('ModeratorCaveComponent', () => {
  let component: ModeratorCaveComponent;
  let fixture: ComponentFixture<ModeratorCaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorCaveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeratorCaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
