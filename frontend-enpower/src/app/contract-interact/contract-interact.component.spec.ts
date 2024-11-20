import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractInteractComponent } from './contract-interact.component';

describe('ContractInteractComponent', () => {
  let component: ContractInteractComponent;
  let fixture: ComponentFixture<ContractInteractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractInteractComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractInteractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
