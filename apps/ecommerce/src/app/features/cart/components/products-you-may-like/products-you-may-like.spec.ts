import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  TranslateLoader,
  TranslationObject,
  TranslateService,
  provideTranslateService,
} from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductsYouMayLike } from './products-you-may-like';
import { ProductService } from '../../../products/service/product.service';
import { Product, ProductRes } from '../../../products/model/product';
import { CartActions } from '../../store/cart.actions';
import { selectCartItems } from '../../store/cart.selectors';
import { CartItem } from '../../models/cart';

class MockTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    if (lang === 'ar') {
      return of({
        cart: {
          'products-you-may-like': 'منتجات قد تعجبك',
        },
      });
    }
    return of({
      cart: {
        'products-you-may-like': 'Products You May Like',
      },
    });
  }
}

describe('ProductsYouMayLike', () => {
  let component: ProductsYouMayLike;
  let fixture: ComponentFixture<ProductsYouMayLike>;
  let store: MockStore;
  let productServiceMock: { getRecommendedProducts: ReturnType<typeof vi.fn> };

  const createMockProduct = (id: string, title: string): Product => ({
    id,
    title,
    description: 'Description ' + title,
    price: '50.00',
    cover: 'https://example.com/' + id + '.jpg',
    rating: 4.5,
    ratings: 10,
    stock: 5,
    gallery: '',
    categoryId: 'cat-1',
    immutable: false,
    deletedAt: null,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    category: { id: 'cat-1', title: 'Flowers' },
    occasions: [],
    _count: { reviews: 10, cartItems: 2, wishlistItems: 3, orderItems: 1 },
  });

  const mockProducts: Product[] = [
    createMockProduct('prod-1', 'Product 1'),
    createMockProduct('prod-2', 'Product 2'),
    createMockProduct('prod-3', 'Product 3'),
  ];

  const mockProductResponse: ProductRes = {
    status: true,
    code: 200,
    payload: {
      data: mockProducts,
      metadata: { page: 1, limit: 10, total: 3, totalPages: 1 },
    },
  };

  const initialCartItems: CartItem[] = [
    {
      id: 'cart-item-1',
      productId: 'prod-2', // prod-2 is already in the cart
      quantity: 1,
      price: 50.0,
      product: mockProducts[1],
    },
  ];

  beforeEach(async () => {
    productServiceMock = {
      getRecommendedProducts: vi.fn().mockReturnValue(of(mockProductResponse)),
    };

    await TestBed.configureTestingModule({
      imports: [ProductsYouMayLike],
      providers: [
        provideRouter([]),
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
          fallbackLang: 'en',
        }),
        provideMockStore({
          selectors: [
            {
              selector: selectCartItems,
              value: initialCartItems,
            },
          ],
        }),
        { provide: ProductService, useValue: productServiceMock },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    vi.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ProductsYouMayLike);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load recommended products on init', () => {
    expect(component).toBeTruthy();
    expect(productServiceMock.getRecommendedProducts).toHaveBeenCalledWith(10);
    expect(component.rawProducts().length).toBe(3);
    expect(component.isLoading()).toBe(false);
  });

  it('should filter out products already present in the cart', () => {
    // prod-2 is in initialCartItems, so filteredProducts should only contain prod-1 and prod-3
    const filtered = component.filteredProducts();
    expect(filtered.length).toBe(2);
    expect(filtered.map((p) => p.id)).toEqual(['prod-1', 'prod-3']);
  });

  it('should reactively update filtered products when cart state changes', () => {
    // Add prod-1 to the cart
    const updatedCartItems: CartItem[] = [
      ...initialCartItems,
      {
        id: 'cart-item-2',
        productId: 'prod-1',
        quantity: 1,
        price: 50.0,
        product: mockProducts[0],
      },
    ];

    store.overrideSelector(selectCartItems, updatedCartItems);
    store.refreshState();
    fixture.detectChanges();

    // Now only prod-3 should remain
    expect(component.filteredProducts().map((p) => p.id)).toEqual(['prod-3']);
  });

  it('should dispatch CartActions.addItemToCart when onAddToCart is called', () => {
    const productToAdd = mockProducts[0];
    component.onAddToCart(productToAdd);

    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.addItemToCart({ productId: 'prod-1', quantity: 1 })
    );
  });

  it('should resolve the translation key in both English and Arabic', () => {
    const translate = TestBed.inject(TranslateService);
    translate.use('en');
    expect(translate.instant('cart.products-you-may-like')).toBe('Products You May Like');

    translate.use('ar');
    expect(translate.instant('cart.products-you-may-like')).toBe('منتجات قد تعجبك');
  });
});

