import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatStockComponent } from './etat-stock.component';

describe('EtatStockComponent', () => {
  let component: EtatStockComponent;
  let fixture: ComponentFixture<EtatStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtatStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtatStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
