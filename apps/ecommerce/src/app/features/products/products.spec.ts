import { Component, input, output } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Products } from "./products";
import { selectAllProducts, selectError, selectLoading, selectProductsMetadata } from "./store/products.selectors";
import { ProductsActions } from "./store/products.actions";
import { ProductCardComponent } from "@rose-app/ui";
import { Paginator } from "../../shared/components/paginator/paginator";
import { Metadata, Product } from "./model/product";

@Component({ selector: "app-product-card", template: "" })
class ProductCardStub {
  product = input<Product>();
}
 
@Component({ selector: "app-paginator", template: "" })
class PaginatorStub {
  page = input(1);
  totalPages = input(1);
  pageChange = output<number>();
}
  
const makeProduct = (id: number, overrides: Partial<Product> = {}): Product => ({
  id: String(id),
  title: `Product ${id}`,
  description: "Test description",
  rating: 4,
  ratings: 10,
  stock: 5,
  price: "100",
  discountType: null,
  discountValue: null,
  cover: "cover.jpg",
  gallery: "gallery.jpg",
  categoryId: "cat-1",
  immutable: false,
  deletedAt: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  category: { id: "cat-1", title: "Category" },
  occasions: [],
  _count: { reviews: 0, cartItems: 0, wishlistItems: 0, orderItems: 0 },
  ...overrides,
});
 
const makeProducts = (n: number): Product[] =>
  Array.from({ length: n }, (_, i) => makeProduct(i + 1));
 
const makeMetadata = (overrides: Partial<Metadata> = {}): Metadata => ({
  page: 1,
  limit: 12,
  total: 12,
  totalPages: 1,
  ...overrides,
});
 
describe("Products", () => {
  let fixture: ComponentFixture<Products>;
  let component: Products;
  let store: MockStore;
  let dispatchSpy: ReturnType<typeof vi.spyOn>;
 
  function setState(opts: { products?: Product[]; metadata?: Metadata | null }) {
    store.overrideSelector(selectAllProducts, opts.products ?? []);
    store.overrideSelector(selectProductsMetadata, opts.metadata ?? null);
    store.refreshState();
    fixture.detectChanges();
  }
 
  function getPaginator(): PaginatorStub {
    return fixture.debugElement.query(By.directive(PaginatorStub))
      .componentInstance as PaginatorStub;
  }
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Products],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectAllProducts, value: [] },
            { selector: selectLoading, value: false },
            { selector: selectError, value: null },
            { selector: selectProductsMetadata, value: null },
          ],
        }),
      ],
    })
      .overrideComponent(Products, {
        remove: { imports: [ProductCardComponent, Paginator] },
        add: { imports: [ProductCardStub, PaginatorStub] },
      })
      .compileComponents();
 
    store = TestBed.inject(MockStore);
    dispatchSpy = vi.spyOn(store, "dispatch"); 
    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
 
  describe("initialization", () => {
    it("should dispatch loadProductsPage for page 1 with limit 12", () => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        ProductsActions.loadProductsPage({ page: 1, limit: 12 }),
      );
    });
  });
 
  describe("computed values", () => {
    it("should default page and totalPages to 1 when metadata is null", () => {
      expect(component.page()).toBe(1);
      expect(component.totalPages()).toBe(1);
      expect(component.showPagination()).toBe(false);
    });
 
    it("should read page and totalPages from metadata", () => {
      setState({ metadata: makeMetadata({ page: 3, total: 95, totalPages: 8 }) });
 
      expect(component.page()).toBe(3);
      expect(component.totalPages()).toBe(8);
    });
 
    it("should show pagination only when totalPages > 1", () => {
      setState({ metadata: makeMetadata({ totalPages: 1 }) });
      expect(component.showPagination()).toBe(false);
 
      setState({ metadata: makeMetadata({ total: 30, totalPages: 3 }) });
      expect(component.showPagination()).toBe(true);
    });
  });
 
  describe("onPageChange", () => {
    it("should dispatch loadProductsPage with the requested page", () => {
      dispatchSpy.mockClear();
      component.onPageChange(4);
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        ProductsActions.loadProductsPage({ page: 4, limit: 12 }),
      );
    });
  });
 
  describe("template", () => {
    it("should render a card for each product", () => {
      setState({
        products: makeProducts(5),
        metadata: makeMetadata({ total: 5 }),
      });
      expect(fixture.debugElement.queryAll(By.directive(ProductCardStub))).toHaveLength(5);
    });
 
    it("should show the empty message when there are no products", () => {
      setState({ products: [] });
      expect(fixture.nativeElement.textContent).toContain("No products are currently available.");
      expect(fixture.debugElement.query(By.directive(PaginatorStub))).toBeNull();
    });
 
    it("should hide the paginator when there is only one page", () => {
      setState({
        products: makeProducts(3),
        metadata: makeMetadata({ total: 3, totalPages: 1 }),
      });
 
      expect(fixture.debugElement.query(By.directive(PaginatorStub))).toBeNull();
    });
 
    it("should show the paginator when there is more than one page", () => {
      setState({
        products: makeProducts(12),
        metadata: makeMetadata({ total: 40, totalPages: 4 }),
      });

      expect(fixture.debugElement.query(By.directive(PaginatorStub))).not.toBeNull();
    });
 
    it("should pass page and totalPages to the paginator", () => {
      setState({
        products: makeProducts(12),
        metadata: makeMetadata({ page: 2, total: 40, totalPages: 4 }),
      });
 
      const paginator = getPaginator();
      expect(paginator.page()).toBe(2);
      expect(paginator.totalPages()).toBe(4);
    });
 
    it("should load the new page when the paginator emits pageChange", () => {
      setState({
        products: makeProducts(12),
        metadata: makeMetadata({ total: 40, totalPages: 4 }),
      });
      dispatchSpy.mockClear();
      getPaginator().pageChange.emit(3);
 
      expect(dispatchSpy).toHaveBeenCalledWith(
        ProductsActions.loadProductsPage({ page: 3, limit: 12 }),
      );
    });
  });
});
 