import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueDevisComponent } from './historique-devis.component';

describe('HistoriqueDevisComponent', () => {
  let component: HistoriqueDevisComponent;
  let fixture: ComponentFixture<HistoriqueDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueDevisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
