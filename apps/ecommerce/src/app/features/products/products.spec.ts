import { Component, input, output } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Products } from "./products";
import {
  selectAllCategories,
  selectAllOccasions,
  selectAllProducts,
  selectAllProductsForFiltering,
  selectError,
  selectLoading,
  selectProductsMetadata,
} from "./store/products.selectors";
import { ProductsActions } from "./store/products.actions";
import { ProductCardComponent } from "@rose-app/ui";
import { Paginator } from "@rose-app/ui";
import {
  Category,
  Metadata,
  Occasion,
  Occasion2,
  Product,
} from "./model/product";
import { provideTranslateService } from "@ngx-translate/core";
import { OccasionItem } from "./model/occasions";

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

const makeProduct = (
  id: number,
  overrides: Partial<Product> = {},
): Product => ({
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

const makeOccasion = (occasionId: string): Occasion => ({
  id: `relation-${occasionId}`,
  productId: "product-1",
  occasionId,
  createdAt: "2026-01-01T00:00:00.000Z",
  occasion: {
    id: occasionId,
    title: `Occasion ${occasionId}`,
    description: "Test occasion",
    image: null,
    immutable: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
});

const makeMetadata = (overrides: Partial<Metadata> = {}): Metadata => ({
  page: 1,
  limit: 12,
  total: 12,
  totalPages: 1,
  ...overrides,
});

const mockCategories: Category[] = [
  { id: "cat-1", title: "Flowers" },
  { id: "cat-2", title: "Gifts" },
  { id: "cat-3", title: "Accessories" },
];

const mockOccasions: OccasionItem[] = [
  {
    id: "occasion-1",
    title: "Wedding",
    description: "Wedding occasion",
    image: "wedding.jpg",
    immutable: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "occasion-2",
    title: "Birthday",
    description: "Birthday occasion",
    image: "birthday.jpg",
    immutable: false,
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
];

describe("Products", () => {
  let fixture: ComponentFixture<Products>;
  let component: Products;
  let store: MockStore;
  let dispatchSpy: ReturnType<typeof vi.spyOn>;

  function setState(opts: {
    products?: Product[];
    allProducts?: Product[];
    categories?: Category[];
    occasions?: OccasionItem[];
    metadata?: Metadata | null;
  }) {
    store.overrideSelector(selectAllProducts, opts.products ?? []);
    store.overrideSelector(
      selectAllProductsForFiltering,
      opts.allProducts ?? [],
    );
    store.overrideSelector(selectAllCategories, opts.categories ?? []);
    store.overrideSelector(selectAllOccasions, opts.occasions ?? []);
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
            { selector: selectAllProductsForFiltering, value: [] },
            { selector: selectAllCategories, value: [] },
            { selector: selectAllOccasions, value: [] },
            { selector: selectLoading, value: false },
            { selector: selectError, value: null },
            { selector: selectProductsMetadata, value: null },
          ],
        }),
        provideTranslateService({ fallbackLang: "en" }),
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

    it("should dispatch loadCategories", () => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        ProductsActions.loadCategories(),
      );
    });

    it("should dispatch loadOccasions", () => {
      expect(dispatchSpy).toHaveBeenCalledWith(ProductsActions.loadOccasions());
    });

    it("should dispatch loadAllProducts", () => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        ProductsActions.loadAllProducts(),
      );
    });

    it("should dispatch all initial loading actions exactly once", () => {
      expect(dispatchSpy).toHaveBeenCalledTimes(4);
    });
  });

  describe("computed values", () => {
    it("should default page and totalPages to 1 when metadata is null", () => {
      expect(component.page()).toBe(1);
      expect(component.totalPages()).toBe(1);
      expect(component.showPagination()).toBe(false);
    });

    it("should read page and totalPages from metadata", () => {
      setState({
        metadata: makeMetadata({ page: 3, total: 95, totalPages: 8 }),
      });

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

  // Categories
  describe("toggleCategory", () => {
    it("should add category to selectedCategories", () => {
      component.toggleCategory("cat-1");
      expect(component.selectedCategories()).toEqual(["cat-1"]);
    });

    it("should remove category if it is already selected", () => {
      component.selectedCategories.set(["cat-1"]);
      component.toggleCategory("cat-1");
      expect(component.selectedCategories()).toEqual([]);
    });

    it("should allow selecting multiple categories", () => {
      component.toggleCategory("cat-1");
      component.toggleCategory("cat-2");
      expect(component.selectedCategories()).toEqual(["cat-1", "cat-2"]);
    });
  });

  // Occasions
  describe("toggleOccasion", () => {
    it("should add occasion to selectedOccasions", () => {
      component.toggleOccasion("occasion-1");
      expect(component.selectedOccasions()).toEqual(["occasion-1"]);
    });

    it("should remove occasion if it is already selected", () => {
      component.selectedOccasions.set(["occasion-1"]);
      component.toggleOccasion("occasion-1");
      expect(component.selectedOccasions()).toEqual([]);
    });

    it("should allow selecting multiple occasions", () => {
      component.toggleOccasion("occasion-1");
      component.toggleOccasion("occasion-2");
      expect(component.selectedOccasions()).toEqual([
        "occasion-1",
        "occasion-2",
      ]);
    });
  });

  // Rating
  describe("selectRating", () => {
    it("should select the requested rating", () => {
      component.selectRating(4);
      expect(component.selectedRating()).toBe(4);
    });

    it("should deselect rating if it is already selected", () => {
      component.selectedRating.set(4);
      component.selectRating(4);
      expect(component.selectedRating()).toBeNull();
    });

    it("should replace the previously selected rating", () => {
      component.selectedRating.set(3);
      component.selectRating(5);
      expect(component.selectedRating()).toBe(5);
    });
  });

  // Price
  describe("getPriceAfterDiscount", () => {
    it("should calculate price after percentage discount", () => {
      const product = makeProduct(1, {
        price: "1000",
        discountType: "PERCENT",
        discountValue: "15",
      });

      expect(component.getPriceAfterDiscount(product)).toBe(850);
    });

    it("should return original price when there is no discount", () => {
      const product = makeProduct(1, {
        price: "1000",
        discountType: null,
        discountValue: null,
      });

      expect(component.getPriceAfterDiscount(product)).toBe(1000);
    });

    it("should return original price when discount value is zero", () => {
      const product = makeProduct(1, {
        price: "1000",
        discountType: "PERCENT",
        discountValue: "0",
      });

      expect(component.getPriceAfterDiscount(product)).toBe(1000);
    });
  });

  // Filtered Products
  describe("filteredProducts", () => {
    it("should return all products when no filters are selected", () => {
      const products = makeProducts(5);
      setState({ allProducts: products });
      expect(component.filteredProducts()).toHaveLength(5);
    });

    it("should filter products by selected categories", () => {
      const products = [
        makeProduct(1, { categoryId: "cat-1" }),
        makeProduct(2, { categoryId: "cat-2" }),
        makeProduct(3, { categoryId: "cat-1" }),
      ];

      setState({ allProducts: products });
      component.selectedCategories.set(["cat-1"]);
      expect(component.filteredProducts().map((p) => p.id)).toEqual(["1", "3"]);
    });

    it("should filter products by selected occasions", () => {
      const products = [
        makeProduct(1, {
          occasions: [makeOccasion("occasion-1")],
        }),
        makeProduct(2, {
          occasions: [makeOccasion("occasion-2")],
        }),
        makeProduct(3, {
          occasions: [],
        }),
      ];

      setState({ allProducts: products });
      component.selectedOccasions.set(["occasion-1"]);
      expect(component.filteredProducts().map((p) => p.id)).toEqual(["1"]);
    });

    it("should filter products by minimum rating", () => {
      const products = [
        makeProduct(1, { rating: 2 }),
        makeProduct(2, { rating: 4 }),
        makeProduct(3, { rating: 5 }),
      ];
      setState({ allProducts: products });
      component.selectedRating.set(4);
      expect(component.filteredProducts().map((p) => p.id)).toEqual(["2", "3"]);
    });

    it("should filter products by minimum price", () => {
      const products = [
        makeProduct(1, { price: "100" }),
        makeProduct(2, { price: "500" }),
        makeProduct(3, { price: "1000" }),
      ];

      setState({ allProducts: products });
      component.minPrice.set(500);

      expect(component.filteredProducts().map((p) => p.id)).toEqual(["2", "3"]);
    });

    it("should filter products by maximum price", () => {
      const products = [
        makeProduct(1, { price: "100" }),
        makeProduct(2, { price: "500" }),
        makeProduct(3, { price: "1000" }),
      ];

      setState({ allProducts: products });
      component.maxPrice.set(500);

      expect(component.filteredProducts().map((p) => p.id)).toEqual(["1", "2"]);
    });

    it("should filter products by minimum and maximum price", () => {
      const products = [
        makeProduct(1, { price: "100" }),
        makeProduct(2, { price: "500" }),
        makeProduct(3, { price: "1000" }),
      ];

      setState({ allProducts: products });
      component.minPrice.set(200);
      component.maxPrice.set(600);

      expect(component.filteredProducts().map((p) => p.id)).toEqual(["2"]);
    });

    it("should filter products using discounted price", () => {
      const products = [
        makeProduct(1, {
          price: "1000",
          discountType: "PERCENT",
          discountValue: "50",
        }),
        makeProduct(2, { price: "600" }),
      ];

      setState({ allProducts: products });
      component.maxPrice.set(550);

      expect(component.filteredProducts().map((p) => p.id)).toEqual(["1"]);
    });

    it("should combine multiple filters using AND condition", () => {
      const products = [
        makeProduct(1, {
          categoryId: "cat-1",
          rating: 5,
          price: "500",
        }),
        makeProduct(2, {
          categoryId: "cat-1",
          rating: 3,
          price: "500",
        }),
        makeProduct(3, {
          categoryId: "cat-2",
          rating: 5,
          price: "500",
        }),
        makeProduct(4, {
          categoryId: "cat-1",
          rating: 5,
          price: "1000",
        }),
      ];

      setState({ allProducts: products });

      component.selectedCategories.set(["cat-1"]);
      component.selectedRating.set(4);
      component.maxPrice.set(600);

      expect(component.filteredProducts().map((p) => p.id)).toEqual(["1"]);
    });

    it("should match products belonging to any selected category", () => {
      const products = [
        makeProduct(1, { categoryId: "cat-1" }),
        makeProduct(2, { categoryId: "cat-2" }),
        makeProduct(3, { categoryId: "cat-3" }),
      ];

      setState({ allProducts: products });
      component.selectedCategories.set(["cat-1", "cat-2"]);

      expect(component.filteredProducts().map((p) => p.id)).toEqual(["1", "2"]);
    });
  });

  // Paginated Filtered Products
  describe("paginatedFilteredProducts", () => {
    it("should return first 12 products by default", () => {
      setState({ allProducts: makeProducts(25) });
      expect(component.paginatedFilteredProducts()).toHaveLength(12);
      expect(component.paginatedFilteredProducts()[0].id).toBe("1");
    });

    it("should return products of the requested page", () => {
      setState({ allProducts: makeProducts(25) });
      component.filteredPage.set(2);
      expect(component.paginatedFilteredProducts()).toHaveLength(12);
      expect(component.paginatedFilteredProducts()[0].id).toBe("13");
      expect(component.paginatedFilteredProducts()[11].id).toBe("24");
    });
  });

  // Filtered Total Pages
  describe("filteredTotalPages", () => {
    it("should return 1 when there are no filtered products", () => {
      setState({ allProducts: [] });
      expect(component.filteredTotalPages()).toBe(0);
    });

    it("should return 1 when products are less than 12", () => {
      setState({ allProducts: makeProducts(5) });
      expect(component.filteredTotalPages()).toBe(1);
    });

    it("should calculate total pages correctly", () => {
      setState({ allProducts: makeProducts(25) });
      expect(component.filteredTotalPages()).toBe(3);
    });

    it("should return exact page count when products are divided by 12", () => {
      setState({ allProducts: makeProducts(24) });
      expect(component.filteredTotalPages()).toBe(2);
    });
  });

  // Filtered Pages
  describe("onFilteredPageChange", () => {
    it("should update filteredPage with the requested page", () => {
      component.onFilteredPageChange(3);
      expect(component.filteredPage()).toBe(3);
    });
  });

  //Has Active Filters
  describe("hasActiveFilters", () => {
    it("should return false when no filters are selected", () => {
      expect(component.hasActiveFilters()).toBe(false);
    });

    it("should return true when category filter is active", () => {
      component.selectedCategories.set(["cat-1"]);
      expect(component.hasActiveFilters()).toBe(true);
    });

    it("should return true when occasion filter is active", () => {
      component.selectedOccasions.set(["occasion-1"]);
      expect(component.hasActiveFilters()).toBe(true);
    });

    it("should return true when rating filter is active", () => {
      component.selectedRating.set(4);
      expect(component.hasActiveFilters()).toBe(true);
    });

    it("should return true when minimum price is active", () => {
      component.minPrice.set(100);
      expect(component.hasActiveFilters()).toBe(true);
    });

    it("should return true when maximum price is active", () => {
      component.maxPrice.set(500);
      expect(component.hasActiveFilters()).toBe(true);
    });
  });

  // Min Price
  describe("onMinPriceChange", () => {
    it("should set minimum price as a number", () => {
      component.onMinPriceChange("200");
      expect(component.minPrice()).toBe(200);
    });

    it("should set minimum price to null when input is empty", () => {
      component.minPrice.set(200);
      component.onMinPriceChange("");
      expect(component.minPrice()).toBeNull();
    });
  });

  // Max Price
  describe("onMaxPriceChange", () => {
    it("should set maximum price as a number", () => {
      component.onMaxPriceChange("1000");
      expect(component.maxPrice()).toBe(1000);
    });

    it("should set maximum price to null when input is empty", () => {
      component.maxPrice.set(1000);
      component.onMaxPriceChange("");
      expect(component.maxPrice()).toBeNull();
    });
  });

  // Reset Categories
  describe("resetCategories", () => {
    it("should clear all selected categories", () => {
      component.selectedCategories.set(["cat-1", "cat-2"]);
      component.resetCategories();
      expect(component.selectedCategories()).toEqual([]);
    });
  });

  // Reset Occasions
  describe("resetOccasions", () => {
    it("should clear all selected occasions", () => {
      component.selectedOccasions.set(["occasion-1", "occasion-2"]);
      component.resetOccasions();
      expect(component.selectedOccasions()).toEqual([]);
    });
  });

  // Reset Rating
  describe("resetRating", () => {
    it("should clear selected rating", () => {
      component.selectedRating.set(4);
      component.resetRating();
      expect(component.selectedRating()).toBeNull();
    });
  });

  // Reset Price
  describe("resetPrice", () => {
    it("should clear minimum and maximum prices", () => {
      component.minPrice.set(100);
      component.maxPrice.set(500);
      component.resetPrice();
      expect(component.minPrice()).toBeNull();
      expect(component.maxPrice()).toBeNull();
    });
  });

  // Reset All
  describe("resetAll", () => {
    it("should reset all filters", () => {
      component.selectedCategories.set(["cat-1"]);
      component.selectedOccasions.set(["occasion-1"]);
      component.selectedRating.set(4);
      component.minPrice.set(100);
      component.maxPrice.set(500);

      component.resetAll();

      expect(component.selectedCategories()).toEqual([]);
      expect(component.selectedOccasions()).toEqual([]);
      expect(component.selectedRating()).toBeNull();
      expect(component.minPrice()).toBeNull();
      expect(component.maxPrice()).toBeNull();
      expect(component.hasActiveFilters()).toBe(false);
    });
  });

  // Template
  describe("template", () => {
    // Products
    describe("Products", () => {
      it("should render a card for each product", () => {
        setState({
          products: makeProducts(5),
          metadata: makeMetadata({ total: 5 }),
        });

        const cards = fixture.debugElement.queryAll(
          By.directive(ProductCardStub),
        );

        expect(cards).toHaveLength(5);
      });

      it("should show the empty message when there are no products", () => {
        setState({ products: [] });

        const message = fixture.debugElement.query(By.css("p.text-center"));

        expect(message).toBeTruthy();
        expect(message.nativeElement.textContent).toContain(
          "products.products-page.no-products",
        );

        expect(
          fixture.debugElement.query(By.directive(PaginatorStub)),
        ).toBeNull();
      });

      it("should show the empty message when no products match active filters", () => {
        setState({
          products: makeProducts(3),
          allProducts: makeProducts(3),
        });

        component.selectedCategories.set(["non-existing-category"]);
        fixture.detectChanges();

        const message = fixture.debugElement.query(By.css("p.text-center"));

        expect(message).toBeTruthy();
        expect(message.nativeElement.textContent).toContain(
          "products.products-page.no-products",
        );

        expect(
          fixture.debugElement.query(By.directive(ProductCardStub)),
        ).toBeNull();
      });

      it("should render only filtered products when filters are active", () => {
        const products = [
          makeProduct(1, { categoryId: "cat-1" }),
          makeProduct(2, { categoryId: "cat-2" }),
          makeProduct(3, { categoryId: "cat-1" }),
        ];

        setState({
          products: makeProducts(3),
          allProducts: products,
        });

        component.selectedCategories.set(["cat-1"]);
        fixture.detectChanges();

        const cards = fixture.debugElement.queryAll(
          By.directive(ProductCardStub),
        );

        expect(cards).toHaveLength(2);
      });
    });

    // Categories
    describe("Categories", () => {
      it("should render all categories", () => {
        setState({ categories: mockCategories });

        const categories = fixture.debugElement.queryAll(
          By.css(".categories-items li"),
        );

        expect(categories).toHaveLength(3);
      });

      it("should render categories in alphabetical order", () => {
        setState({ categories: mockCategories });

        const categories = fixture.debugElement.queryAll(
          By.css(".categories-items li"),
        );

        const categoryNames = categories.map((item) =>
          item.nativeElement.textContent.trim(),
        );

        expect(categoryNames).toEqual(["Accessories", "Flowers", "Gifts"]);
      });

      it("should select a category when clicking it", () => {
        setState({ categories: mockCategories });
        const category = fixture.debugElement
          .queryAll(By.css(".categories-items li"))
          .find((item) => item.nativeElement.textContent.includes("Flowers"));

        expect(category).toBeTruthy();
        category!.triggerEventHandler("click", null);
        expect(component.selectedCategories()).toContain("cat-1");
      });

      it("should deselect a category when clicking it again", () => {
        setState({ categories: mockCategories });

        component.selectedCategories.set(["cat-1"]);
        fixture.detectChanges();

        const category = fixture.debugElement
          .queryAll(By.css(".categories-items li"))
          .find((item) => item.nativeElement.textContent.includes("Flowers"));

        category!.triggerEventHandler("click", null);

        expect(component.selectedCategories()).not.toContain("cat-1");
      });

      it("should reset selected categories when clicking reset", () => {
        setState({ categories: mockCategories });

        component.selectedCategories.set(["cat-1", "cat-2"]);
        fixture.detectChanges();

        const resetButton = fixture.debugElement.query(
          By.css(".categories-clear"),
        );

        resetButton.triggerEventHandler("click", null);

        expect(component.selectedCategories()).toEqual([]);
      });
    });

    // Occasions
    describe("Occasions", () => {
      it("should render all occasions", () => {
        setState({ occasions: mockOccasions });

        const occasions = fixture.debugElement.queryAll(
          By.css(".occasions-items .item"),
        );

        expect(occasions).toHaveLength(2);
      });

      it("should display occasion titles", () => {
        setState({ occasions: mockOccasions });

        const occasions = fixture.debugElement.queryAll(
          By.css(".occasions-items .item h3"),
        );

        expect(
          occasions.map((item) => item.nativeElement.textContent.trim()),
        ).toEqual(["Wedding", "Birthday"]);
      });

      it("should select an occasion when clicking it", () => {
        setState({ occasions: mockOccasions });

        const occasion = fixture.debugElement.query(
          By.css(".occasions-items .item"),
        );

        occasion.triggerEventHandler("click", null);

        expect(component.selectedOccasions()).toContain("occasion-1");
      });

      it("should deselect an occasion when clicking it again", () => {
        setState({ occasions: mockOccasions });

        component.selectedOccasions.set(["occasion-1"]);
        fixture.detectChanges();

        const occasion = fixture.debugElement.query(
          By.css(".occasions-items .item"),
        );

        occasion.triggerEventHandler("click", null);

        expect(component.selectedOccasions()).not.toContain("occasion-1");
      });

      it("should reset selected occasions when clicking reset", () => {
        setState({ occasions: mockOccasions });

        component.selectedOccasions.set(["occasion-1", "occasion-2"]);
        fixture.detectChanges();

        const resetButton = fixture.debugElement.query(
          By.css(".occasions-clear"),
        );

        resetButton.triggerEventHandler("click", null);

        expect(component.selectedOccasions()).toEqual([]);
      });
    });

    // Rating
    describe("Rating", () => {
      it("should render five rating stars", () => {
        const stars = fixture.debugElement.queryAll(By.css(".rating-body svg"));

        expect(stars).toHaveLength(5);
      });

      it("should select a rating when clicking a star", () => {
        const stars = fixture.debugElement.queryAll(By.css(".rating-body svg"));

        stars[3].triggerEventHandler("click", null);

        expect(component.selectedRating()).toBe(4);
      });

      it("should deselect the rating when clicking the selected star", () => {
        component.selectedRating.set(4);
        fixture.detectChanges();

        const stars = fixture.debugElement.queryAll(By.css(".rating-body svg"));

        stars[3].triggerEventHandler("click", null);

        expect(component.selectedRating()).toBeNull();
      });

      it("should reset the selected rating when clicking reset", () => {
        component.selectedRating.set(5);
        fixture.detectChanges();

        const resetButton = fixture.debugElement.query(By.css(".rating-clear"));

        resetButton.triggerEventHandler("click", null);

        expect(component.selectedRating()).toBeNull();
      });
    });

    // Price
    describe("Price", () => {
      it("should render minimum and maximum price inputs", () => {
        const minInput = fixture.debugElement.query(By.css("#minPrice"));
        const maxInput = fixture.debugElement.query(By.css("#maxPrice"));

        expect(minInput).toBeTruthy();
        expect(maxInput).toBeTruthy();
      });

      it("should update minimum price when entering a value", () => {
        const minInput = fixture.debugElement.query(By.css("#minPrice"))
          .nativeElement as HTMLInputElement;

        minInput.value = "200";
        minInput.dispatchEvent(new Event("input"));
        fixture.detectChanges();

        expect(component.minPrice()).toBe(200);
      });

      it("should update maximum price when entering a value", () => {
        const maxInput = fixture.debugElement.query(By.css("#maxPrice"))
          .nativeElement as HTMLInputElement;

        maxInput.value = "1000";
        maxInput.dispatchEvent(new Event("input"));
        fixture.detectChanges();

        expect(component.maxPrice()).toBe(1000);
      });

      it("should clear minimum price when input is empty", () => {
        component.minPrice.set(200);
        fixture.detectChanges();

        const minInput = fixture.debugElement.query(By.css("#minPrice"))
          .nativeElement as HTMLInputElement;

        minInput.value = "";
        minInput.dispatchEvent(new Event("input"));
        fixture.detectChanges();

        expect(component.minPrice()).toBeNull();
      });

      it("should clear maximum price when input is empty", () => {
        component.maxPrice.set(1000);
        fixture.detectChanges();

        const maxInput = fixture.debugElement.query(By.css("#maxPrice"))
          .nativeElement as HTMLInputElement;

        maxInput.value = "";
        maxInput.dispatchEvent(new Event("input"));
        fixture.detectChanges();

        expect(component.maxPrice()).toBeNull();
      });

      it("should reset minimum and maximum prices when clicking reset", () => {
        component.minPrice.set(100);
        component.maxPrice.set(500);
        fixture.detectChanges();

        const resetButton = fixture.debugElement.query(By.css(".price-clear"));

        resetButton.triggerEventHandler("click", null);

        expect(component.minPrice()).toBeNull();
        expect(component.maxPrice()).toBeNull();
      });
    });

    // Reset All
    describe("Reset All", () => {
      it("should reset all filters when clicking reset all", () => {
        component.selectedCategories.set(["cat-1"]);
        component.selectedOccasions.set(["occasion-1"]);
        component.selectedRating.set(4);
        component.minPrice.set(100);
        component.maxPrice.set(500);

        fixture.detectChanges();

        const resetButton = fixture.debugElement.query(
          By.css(".reset-all button"),
        );

        expect(resetButton).toBeTruthy();

        resetButton.triggerEventHandler("click", null);

        expect(component.selectedCategories()).toEqual([]);
        expect(component.selectedOccasions()).toEqual([]);
        expect(component.selectedRating()).toBeNull();
        expect(component.minPrice()).toBeNull();
        expect(component.maxPrice()).toBeNull();
        expect(component.hasActiveFilters()).toBe(false);
      });
    });

    // Pagination
    describe("Pagination", () => {
      it("should hide the paginator when there is only one page", () => {
        setState({
          products: makeProducts(3),
          metadata: makeMetadata({
            total: 3,
            totalPages: 1,
          }),
        });

        expect(
          fixture.debugElement.query(By.directive(PaginatorStub)),
        ).toBeNull();
      });

      it("should show the paginator when there is more than one page", () => {
        setState({
          products: makeProducts(12),
          metadata: makeMetadata({
            total: 40,
            totalPages: 4,
          }),
        });

        expect(
          fixture.debugElement.query(By.directive(PaginatorStub)),
        ).not.toBeNull();
      });

      it("should pass current page and total pages to the paginator", () => {
        setState({
          products: makeProducts(12),
          metadata: makeMetadata({
            page: 2,
            total: 40,
            totalPages: 4,
          }),
        });

        const paginator = getPaginator();

        expect(paginator.page()).toBe(2);
        expect(paginator.totalPages()).toBe(4);
      });

      it("should load the requested page when paginator emits pageChange", () => {
        setState({
          products: makeProducts(12),
          metadata: makeMetadata({
            total: 40,
            totalPages: 4,
          }),
        });

        dispatchSpy.mockClear();

        getPaginator().pageChange.emit(3);

        expect(dispatchSpy).toHaveBeenCalledWith(
          ProductsActions.loadProductsPage({
            page: 3,
            limit: 12,
          }),
        );
      });

      it("should show filtered pagination when filtered products have multiple pages", () => {
        const products = makeProducts(13).map((product) => ({
          ...product,
          categoryId: "cat-1",
        }));

        setState({
          allProducts: products,
          products: makeProducts(12),
        });

        component.selectedCategories.set(["cat-1"]);
        fixture.detectChanges();

        expect(
          fixture.debugElement.query(By.directive(PaginatorStub)),
        ).not.toBeNull();

        expect(getPaginator().totalPages()).toBe(2);
      });

      it("should update filtered page when filtered paginator emits pageChange", () => {
        const products = makeProducts(13).map((product) => ({
          ...product,
          categoryId: "cat-1",
        }));

        setState({
          allProducts: products,
          products: makeProducts(12),
        });

        component.selectedCategories.set(["cat-1"]);
        fixture.detectChanges();

        getPaginator().pageChange.emit(2);

        expect(component.filteredPage()).toBe(2);
      });
    });
  });
});
