import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideTranslateService } from "@ngx-translate/core";
import { SectionBestSelling } from "./section-best-selling";
import { Component, input } from "@angular/core";
import { Product } from "../../../products/model/product";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { By } from "@angular/platform-browser";
import {
  selectBestProducts,
  selectBestProductsError,
  selectBestProductsLoading,
} from "../../../products/store/products.selectors";
import { ProductCardComponent } from "@rose-app/ui";
import { ProductsActions } from "../../../products/store/products.actions";

// Fake card
@Component({ selector: "app-product-card", template: "" })
class ProductCard {
  readonly product = input<unknown>();
}

const mockProducts: Product[] = [
  {
    id: "2e6519c6-9a06-41d8-8b34-a698cfe35775",
    title: "Countdown Celebration Bouquet",
    description:
      "A hand-tied bouquet of fresh, carefully balanced blooms for New Year. Bright flowers to welcome the New Year with positivity.",
    rating: 5,
    ratings: 2,
    stock: 9,
    price: "720",
    discountType: null,
    discountValue: null,
    cover:
      "https://rose-app.elevate-bootcamp.cloud/storage/entities/product/product-d9e8168767c7-1784745913993.jpeg",
    gallery: "[]",
    categoryId: "89b21293-0d1c-4602-8e10-56580a431e60",
    subCategoryId: "b0451a3e-7544-41fd-9452-9561790aef26",
    immutable: false,
    deletedAt: null,
    createdAt: "2026-07-22T18:45:13.996Z",
    updatedAt: "2026-10-03T15:48:08.162Z",
    category: {
      id: "89b21293-0d1c-4602-8e10-56580a431e60",
      title: "Mixed Flowers",
    },
    subCategory: {
      id: "b0451a3e-7544-41fd-9452-9561790aef26",
      title: "Celebration Bouquets",
    },
    occasions: [
      {
        id: "7b2998a5-0a34-4ab4-b38c-1ba255478a0d",
        productId: "2e6519c6-9a06-41d8-8b34-a698cfe35775",
        occasionId: "911cd456-2ed2-4016-abd3-c5f05f17fe80",
        createdAt: "2026-09-30T14:18:41.439Z",
        occasion: {
          id: "911cd456-2ed2-4016-abd3-c5f05f17fe80",
          title: "Engagement",
          description: "Ut reiciendis ut qui",
          image: null,
          immutable: false,
          createdAt: "2026-09-15T13:56:00.117Z",
          updatedAt: "2026-09-17T10:03:58.427Z",
        },
      },
    ],
    _count: {
      reviews: 1,
      cartItems: 4,
      wishlistItems: 4,
      orderItems: 12,
    },
  },
  {
    id: "dcc73348-ceb2-4901-bb42-9f4f56aac2c3",
    title: "Golden Firework Floral Centerpiece",
    description:
      "A statement floral centerpiece designed for a memorable table display for New Year. Bright flowers to welcome the New Year with positivity.",
    rating: 5,
    ratings: 1,
    stock: 26,
    price: "1370",
    discountType: "PERCENT",
    discountValue: "15",
    cover:
      "https://rose-app.elevate-bootcamp.cloud/storage/entities/product/product-c73a175621be-1784745914498.jpeg",
    gallery: "[]",
    categoryId: "ac9e50a7-3438-478f-ab52-805d913edea8",
    subCategoryId: "4598bb42-8f80-44a9-a7fb-eb3f73355fb6",
    immutable: false,
    deletedAt: null,
    createdAt: "2026-07-22T18:45:14.502Z",
    updatedAt: "2026-09-15T12:58:34.669Z",
    category: {
      id: "ac9e50a7-3438-478f-ab52-805d913edea8",
      title: "ssdds",
    },
    subCategory: {
      id: "4598bb42-8f80-44a9-a7fb-eb3f73355fb6",
      title: "Party Decorations",
    },
    occasions: [
      {
        id: "7e29922e-5838-4e5a-bee6-5626b4d453a8",
        productId: "dcc73348-ceb2-4901-bb42-9f4f56aac2c3",
        occasionId: "911cd456-2ed2-4016-abd3-c5f05f17fe80",
        createdAt: "2026-09-30T14:18:41.989Z",
        occasion: {
          id: "911cd456-2ed2-4016-abd3-c5f05f17fe80",
          title: "Engagement",
          description: "Ut reiciendis ut qui",
          image: null,
          immutable: false,
          createdAt: "2026-09-15T13:56:00.117Z",
          updatedAt: "2026-09-17T10:03:58.427Z",
        },
      },
    ],
    _count: {
      reviews: 0,
      cartItems: 0,
      wishlistItems: 0,
      orderItems: 2,
    },
  },
  {
    id: "7ca7e0bd-d1a8-4cdd-8202-6fda54571253",
    title: "Confetti Garden Flower Box",
    description:
      "A presentation-ready flower box with a polished, giftable finish for New Year. Bright flowers to welcome the New Year with positivity.",
    rating: 4.666666666666667,
    ratings: 3,
    stock: 22,
    price: "1160",
    discountType: "PERCENT",
    discountValue: "10",
    cover:
      "https://rose-app.elevate-bootcamp.cloud/storage/entities/product/product-5d0846ac88ef-1784745914692.jpeg",
    gallery: "[]",
    categoryId: "02cefa3f-767a-4683-980a-7eef5df5295c",
    subCategoryId: "afc9146c-e845-4666-853c-d576f4d4a8d7",
    immutable: false,
    deletedAt: null,
    createdAt: "2026-07-22T18:45:14.694Z",
    updatedAt: "2026-09-15T13:52:17.909Z",
    category: {
      id: "02cefa3f-767a-4683-980a-7eef5df5295c",
      title: "Category 1",
    },
    subCategory: {
      id: "afc9146c-e845-4666-853c-d576f4d4a8d7",
      title: "Luxury Flower Boxes",
    },
    occasions: [
      {
        id: "acecd4cb-c4a9-4af9-a855-affafb15d56a",
        productId: "7ca7e0bd-d1a8-4cdd-8202-6fda54571253",
        occasionId: "911cd456-2ed2-4016-abd3-c5f05f17fe80",
        createdAt: "2026-09-30T14:18:41.718Z",
        occasion: {
          id: "911cd456-2ed2-4016-abd3-c5f05f17fe80",
          title: "Engagement",
          description: "Ut reiciendis ut qui",
          image: null,
          immutable: false,
          createdAt: "2026-09-15T13:56:00.117Z",
          updatedAt: "2026-09-17T10:03:58.427Z",
        },
      },
    ],
    _count: {
      reviews: 2,
      cartItems: 0,
      wishlistItems: 0,
      orderItems: 1,
    },
  },
];

describe("SectionBestSelling", () => {
  let component: SectionBestSelling;
  let fixture: ComponentFixture<SectionBestSelling>;
  let store: MockStore;
  let el: HTMLElement;
  let dispatchSpy: ReturnType<typeof vi.spyOn>;

  const getShownProducts = () =>
    fixture.debugElement
      .queryAll(By.directive(ProductCard))
      .map((d) => (d.componentInstance as ProductCard).product());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionBestSelling],
      providers: [
        provideTranslateService(),
        provideMockStore({
          selectors: [
            { selector: selectBestProducts, value: mockProducts },
            { selector: selectBestProductsLoading, value: false },
            { selector: selectBestProductsError, value: null },
          ],
        }),
      ],
    })
      .overrideComponent(SectionBestSelling, {
        remove: { imports: [ProductCardComponent] },
        add: { imports: [ProductCard] },
      })
      .compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = vi.spyOn(store, "dispatch");

    fixture = TestBed.createComponent(SectionBestSelling);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should dispatch loadBestProducts once on init", () => {
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      ProductsActions.loadBestProducts(),
    );
  });
  it("should show every product from the store in a card", () => {
    const shown = getShownProducts();

    mockProducts.forEach((product) => expect(shown).toContain(product));
    shown.forEach((product) => expect(mockProducts).toContain(product));
  });

  // loading and error state testing
  it("should show loading and hide the cards while loading", async () => {
    store.overrideSelector(selectBestProductsLoading, true);
    store.refreshState();
    await fixture.whenStable();

    expect(el.querySelector('[data-testid="best-loading"]')).toBeTruthy();
    expect(getShownProducts().length).toBe(0);
  });

  it("should show an error message when loading fails", async () => {
    store.overrideSelector(selectBestProductsError, "Network error");
    store.refreshState();
    await fixture.whenStable();

    expect(el.querySelector('[data-testid="best-error"]')).toBeTruthy();
    expect(getShownProducts().length).toBe(0);
  });
});
