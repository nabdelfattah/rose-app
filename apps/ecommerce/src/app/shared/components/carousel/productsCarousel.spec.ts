import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsCarousel } from './productsCarousel';

describe('ProductsCarousel', () => {
  let component: ProductsCarousel;
  let fixture: ComponentFixture<ProductsCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsCarousel]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsCarousel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
