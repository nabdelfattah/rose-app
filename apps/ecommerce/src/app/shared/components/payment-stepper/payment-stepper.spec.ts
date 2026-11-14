import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentStepper } from './payment-stepper';

describe('PaymentStepper', () => {
  let component: PaymentStepper;
  let fixture: ComponentFixture<PaymentStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentStepper]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentStepper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
