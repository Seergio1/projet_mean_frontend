import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueServiceComponent } from './historique-service.component';

describe('HistoriqueServiceComponent', () => {
  let component: HistoriqueServiceComponent;
  let fixture: ComponentFixture<HistoriqueServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
