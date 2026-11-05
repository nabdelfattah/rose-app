import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateLoader, TranslationObject, provideTranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';
import { CartItemComponent } from './cart-item';
import { CartItem } from '../../models/cart';

class MockTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({
      cart: {
        remove: 'Remove',
      },
    });
  }
}

describe('CartItemComponent', () => {
  let component: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;

  const mockItem: CartItem = {
    id: 'item-1',
    productId: 'prod-1',
    quantity: 2,
    price: 35.5,
    product: {
      id: 'prod-1',
      title: 'Red Rose Bouquet',
      description: 'Fresh red roses',
      price: '35.5',
      cover: 'https://example.com/rose.jpg',
      rating: 4.8,
      ratings: 24,
      stock: 10,
      gallery: '',
      categoryId: 'cat-1',
      immutable: false,
      deletedAt: null,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      category: { id: 'cat-1', title: 'Flowers' },
      occasions: [],
      _count: { reviews: 24, cartItems: 5, wishlistItems: 12, orderItems: 2 },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemComponent],
      providers: [
        provideRouter([]),
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
          fallbackLang: 'en',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', mockItem);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute product info correctly', () => {
    expect(component.title()).toBe('Red Rose Bouquet');
    expect(component.unitPrice()).toBe(35.5);
    expect(component.totalPrice()).toBe(71);
    expect(component.rating()).toBe(4.8);
    expect(component.ratingsCount()).toBe(24);
  });

  it('should emit quantityChange on increment', () => {
    let emittedQty = 0;
    component.quantityChange.subscribe((qty) => {
      emittedQty = qty;
    });

    component.onIncrement();
    expect(emittedQty).toBe(3);
  });

  it('should emit quantityChange on decrement when quantity > 1', () => {
    let emittedQty = 0;
    component.quantityChange.subscribe((qty) => {
      emittedQty = qty;
    });

    component.onDecrement();
    expect(emittedQty).toBe(1);
  });

  it('should emit remove on remove click', () => {
    let removed = false;
    component.remove.subscribe(() => {
      removed = true;
    });

    component.onRemove();
    expect(removed).toBe(true);
  });
});
