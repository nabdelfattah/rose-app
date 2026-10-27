import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ProductDetailsInfo } from './product-details-info';
import { Product } from '../../model/product';

describe('ProductDetailsInfo', () => {
  let component: ProductDetailsInfo;
  let fixture: ComponentFixture<ProductDetailsInfo>;

  const mockProduct: Product = {
    id: 'test-prod-1',
    title: 'Red Velvet Rose Bouquet',
    description: 'A luxurious bouquet of 50 red roses.',
    rating: 4.8,
    ratings: 25,
    stock: 12,
    price: '250',
    discountType: 'PERCENT',
    discountValue: '20',
    cover: 'https://example.com/cover.jpg',
    gallery: JSON.stringify([
      'https://example.com/cover.jpg',
      'https://example.com/thumb1.jpg',
      'https://example.com/thumb2.jpg',
    ]),
    categoryId: 'cat-1',
    immutable: false,
    deletedAt: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    category: {
      id: 'cat-1',
      title: 'Luxury Bouquets',
    },
    occasions: [],
    _count: {
      reviews: 25,
      cartItems: 2,
      wishlistItems: 5,
      orderItems: 10,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsInfo],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsInfo);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display product title, description, and category', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Red Velvet Rose Bouquet');
    expect(el.textContent).toContain('A luxurious bouquet of 50 red roses.');
    expect(el.textContent).toContain('Luxury Bouquets');
  });

  it('should deduplicate images if cover is in gallery', () => {
    expect(component.images().length).toBe(3);
    expect(component.images()[0]).toBe('https://example.com/cover.jpg');
    expect(component.images()[1]).toBe('https://example.com/thumb1.jpg');
    expect(component.images()[2]).toBe('https://example.com/thumb2.jpg');
  });

  it('should change selected image when thumbnail is clicked', () => {
    expect(component.selectedImage()).toBe('https://example.com/cover.jpg');
    component.selectImage(1);
    expect(component.selectedImage()).toBe('https://example.com/thumb1.jpg');
  });

  it('should compute discounted price correctly', () => {
    // 250 - 20% = 200
    expect(component.discountedPrice()).toBe(200);
    expect(component.currentPrice()).toBe(200);
    expect(component.originalPrice()).toBe(250);
  });

  it('should emit addToCart when Add to Cart button is clicked and product is in stock', () => {
    let emittedProduct: Product | undefined;
    component.addToCart.subscribe((p) => (emittedProduct = p));

    component.onAddToCart();
    expect(emittedProduct).toEqual(mockProduct);
  });

  it('should toggle wishlist state and emit addToWishlist', () => {
    let emittedProduct: Product | undefined;
    component.addToWishlist.subscribe((p) => (emittedProduct = p));

    expect(component.isWishlisted()).toBe(false);
    component.onToggleWishlist();
    expect(component.isWishlisted()).toBe(true);
    expect(emittedProduct).toEqual(mockProduct);
  });

  it('should disable add to cart button when product is out of stock', () => {
    fixture.componentRef.setInput('product', {
      ...mockProduct,
      stock: 0,
    });
    fixture.detectChanges();

    expect(component.isOutOfStock()).toBe(true);
    const btn = fixture.nativeElement.querySelector(
      'button:has(svg[lucideShoppingCart])',
    ) as HTMLButtonElement;
    expect(btn?.disabled).toBe(true);
  });
});
