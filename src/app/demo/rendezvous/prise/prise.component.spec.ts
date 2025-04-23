import { ComponentFixture, TestBed } from '@angular/core/testing';
import PriseComponent from './prise.component';

describe('PriseComponent', () => {
  let component: PriseComponent;
  let fixture: ComponentFixture<PriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
