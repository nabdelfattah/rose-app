import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { Router } from "@angular/router";
import { Home } from "./home";
import { ProductsActions } from "../products/store/products.actions";
import { Product } from "../products/model/product";
import {
  selectAllProducts,
  selectError,
  selectLoading,
} from "../products/store/products.selectors";
import { By } from "@angular/platform-browser";

describe("Home", () => {
  let fixture: ComponentFixture<Home>;
  let component: Home;
  let store: MockStore;
  let router: Router;

  const mockProducts: Product[] = [
    {
      id: "1",
      title: "Wedding Bouquet",
      description: "Beautiful wedding flowers",
      rating: 4.5,
      ratings: 10,
      stock: 20,
      price: "150",
      cover: "wedding.jpg",
      gallery: "wedding-gallery.jpg",
      categoryId: "cat-1",
      immutable: false,
      deletedAt: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      category: {
        id: "cat-1",
        title: "Flowers",
      },
      occasions: [
        {
          id: "occ-1",
          productId: "1",
          occasionId: "wedding",
          createdAt: "2026-01-01T00:00:00.000Z",
          occasion: {
            id: "wedding",
            title: "Wedding",
            description: "Wedding occasion",
            immutable: false,
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        },
      ],
      _count: {
        reviews: 10,
        cartItems: 2,
        wishlistItems: 3,
        orderItems: 1,
      },
    },
    {
      id: "2",
      title: "Birthday Flowers",
      description: "Colorful birthday flowers",
      rating: 4,
      ratings: 5,
      stock: 15,
      price: "100",
      cover: "birthday.jpg",
      gallery: "birthday-gallery.jpg",
      categoryId: "cat-1",
      immutable: false,
      deletedAt: null,
      createdAt: "2026-01-02T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
      category: {
        id: "cat-1",
        title: "Flowers",
      },
      occasions: [
        {
          id: "occ-2",
          productId: "2",
          occasionId: "birthday",
          createdAt: "2026-01-02T00:00:00.000Z",
          occasion: {
            id: "birthday",
            title: "Birthday",
            description: "Birthday occasion",
            immutable: false,
            createdAt: "2026-01-02T00:00:00.000Z",
            updatedAt: "2026-01-02T00:00:00.000Z",
          },
        },
      ],
      _count: {
        reviews: 5,
        cartItems: 1,
        wishlistItems: 0,
        orderItems: 2,
      },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectAllProducts,
              value: mockProducts,
            },
            {
              selector: selectLoading,
              value: false,
            },
            {
              selector: selectError,
              value: null,
            },
          ],
        }),
        {
          provide: Router,
          useValue: {
            navigate: vi.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch loadProducts on initialization", () => {
    const dispatchSpy = vi.spyOn(store, "dispatch");
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(ProductsActions.loadProducts());
  });

  it("should select All by default", () => {
    expect(component.selected()).toBe("All");
  });

  it("should return all products when All is selected", () => {
    expect(component.filtered()).toEqual(mockProducts);
  });

  it("should filter products by selected occasion", () => {
    component.selected.set("Wedding");
    expect(component.filtered()).toEqual([mockProducts[0]]);
  });

  it("should return an empty array when no products match", () => {
    component.selected.set("Graduation");
    expect(component.filtered()).toEqual([]);
  });

  it("should navigate to products page when viewMore is called", () => {
    const navigateSpy = vi.spyOn(router, "navigate");
    component.viewMore();
    expect(navigateSpy).toHaveBeenCalledWith(["/products"]);
  });

  it("should expose the loading state from the store", () => {
    expect(component.isLoading()).toBe(false);
  });

  it("should expose the error state from the store", () => {
    expect(component.error()).toBeNull();
  });

  // Template
  describe("Home template", () => {
    it("should display the Most Popular section title", () => {
      const sectionTitle = fixture.debugElement.query(
        By.css("app-section-title"),
      );
      expect(sectionTitle).toBeTruthy();
      expect(sectionTitle.nativeElement.textContent.trim()).toBe(
        "Most Popular",
      );
    });

    it("should display all occasion tabs", () => {
      const buttons = fixture.debugElement.queryAll(By.css(".tabs button"));
      expect(buttons.length).toBe(5);
      expect(
        buttons.map((button) => button.nativeElement.textContent.trim()),
      ).toEqual(["All", "Wedding", "Anniversary", "Birthday", "Engagement"]);
    });

    it("should update the selected tab when clicking Wedding", () => {
      const weddingButton = fixture.debugElement
        .queryAll(By.css(".tabs button"))
        .find(
          (button) => button.nativeElement.textContent.trim() === "Wedding",
        );

      expect(weddingButton).toBeTruthy();

      weddingButton!.triggerEventHandler("click", null);
      fixture.detectChanges();

      expect(component.selected()).toBe("Wedding");
    });

    it("should display product cards for the filtered products", () => {
      const cards = fixture.debugElement.queryAll(By.css("app-product-card"));
      expect(cards.length).toBe(mockProducts.length);
    });

    it("should display no more than 12 product cards", () => {
      const thirteenProducts = Array.from({ length: 13 }, (_, index) => ({
        ...mockProducts[0],
        id: `product-${index}`,
      }));
      store.overrideSelector(selectAllProducts, thirteenProducts);
      store.refreshState();
      fixture.detectChanges();
      const cards = fixture.debugElement.queryAll(By.css("app-product-card"));
      expect(cards.length).toBe(12);
    });

    it("should call viewMore when clicking the View More button", () => {
      const viewMoreSpy = vi.spyOn(component, "viewMore");
      const button = fixture.debugElement
        .queryAll(By.css("button"))
        .find(
          (element) => element.nativeElement.textContent.trim() === "View More",
        );

      expect(button).toBeTruthy();
      button!.triggerEventHandler("click", null);
      expect(viewMoreSpy).toHaveBeenCalled();
    });
  });
});
