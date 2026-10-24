import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { ProductDetails } from './product-details';
import { selectAllProducts } from '../../store/products.selectors';
import { Product } from '../../model/product';
import { provideTranslateService } from '@ngx-translate/core';

describe('ProductDetails', () => {
  let fixture: ComponentFixture<ProductDetails>;
  let component: ProductDetails;
  let store: MockStore;

  const products = [
    { id: 'p1', title: 'Product 1' },
    { id: 'p2', title: 'Product 2' },
    { id: 'p3', title: 'Product 3' },
  ] as Product[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetails],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectAllProducts,
              value: products,
            },
          ],
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => key === 'id' ? 'p2' : null,
              },
            },
          },
        },
        provideTranslateService({ fallbackLang: "en" }),
      ],
    })
      .compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ProductDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should exclude the current product from related products', () => {
    const result = component.relatedProducts();
    expect(result.map(product => product.id)).toEqual(['p1', 'p3']);
  });

  it('should not include the current product in related products', () => {
    expect(
      component.relatedProducts().some(product => product.id === 'p2')
    ).toBe(false);
  });
});
