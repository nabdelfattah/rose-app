import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { OrderItem } from './orderItem';

describe('OrderItem', () => {
  let component: OrderItem;
  let fixture: ComponentFixture<OrderItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderItem],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
