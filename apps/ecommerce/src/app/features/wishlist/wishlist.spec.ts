import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import {
  TranslateLoader,
  TranslationObject,
  provideTranslateService,
} from "@ngx-translate/core";
import { ConfirmationService } from "@openng/optimus-ui/api";
import { Observable, of } from "rxjs";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Wishlist } from "./wishlist";
import { wishlistActions } from "./store/wishlist.actions";
import { selectWishlistProducts } from "./store/wishlist.selector";
import { WishlistItem } from "./models/wishlist";

class MockTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({
      wishlist: {
        title: "Wishlist",
        items: "items",
        item: "item",
        "clear-wishlist": "Clear Wishlist",
      },
    });
  }
}

// generate wishlist items from the provided id
const createItem = (id: string): WishlistItem => ({
  id,
  userId: "u1",
  productId: `prod-${id}`,
  createdAt: "2026-11-01",
  product: {
    id: `prod-${id}`,
    title: `Rose ${id}`,
    description: "Fresh roses",
    price: "100",
    cover: "https://example.com/rose.jpg",
    rating: 4.5,
    ratings: 10,
    stock: 5,
    gallery: "",
    categoryId: "cat-1",
    immutable: false,
    deletedAt: null,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    category: { id: "cat-1", title: "Flowers" },
    occasions: [],
    _count: { reviews: 10, cartItems: 0, wishlistItems: 1, orderItems: 0 },
  },
});

describe("Wishlist", () => {
  let component: Wishlist;
  let fixture: ComponentFixture<Wishlist>;
  let store: MockStore;
  let confirmationService: ConfirmationService;

  const setItems = (items: WishlistItem[]) => {
    store.overrideSelector(selectWishlistProducts, items);
    store.refreshState();
    fixture.detectChanges();
  };

  // get the clear button (appear only if there is items in the wishlist)
  const clearButton = (): HTMLButtonElement | undefined =>
    Array.from<HTMLButtonElement>(
      fixture.nativeElement.querySelectorAll("button"),
    ).find((button) => button.textContent?.includes("Clear Wishlist"));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Wishlist],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [{ selector: selectWishlistProducts, value: [] }],
        }),
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
          fallbackLang: "en",
        }),
        ConfirmationService,
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    confirmationService = TestBed.inject(ConfirmationService);
    vi.spyOn(store, "dispatch");

    fixture = TestBed.createComponent(Wishlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch pageOpen on init", () => {
    expect(store.dispatch).toHaveBeenCalledWith(wishlistActions.pageOpen());
  });

  it("should show 0 items and hide the clear button when the wishlist is empty", () => {
    expect(component.itemsCount()).toBe(0);
    expect(fixture.nativeElement.textContent).toContain("0 items");
    expect(clearButton()).toBeUndefined();
  });

  it("should render one wishlist item per product and show the clear button", () => {
    setItems([createItem("1"), createItem("2")]);

    expect(component.itemsCount()).toBe(2);
    expect(
      fixture.nativeElement.querySelectorAll("app-wishlist-item").length,
    ).toBe(2);
    expect(clearButton()).toBeDefined();
  });

  it("should dispatch deleteBulk only when the confirmation is accepted", () => {
    const confirmSpy = vi.spyOn(confirmationService, "confirm");

    component.clearWishlist();
    expect(store.dispatch).not.toHaveBeenCalledWith(
      wishlistActions.deleteBulk(),
    );

    confirmSpy.mock.calls[0][0].accept?.(); //accept in the confirmation dialog
    expect(store.dispatch).toHaveBeenCalledWith(wishlistActions.deleteBulk());
  });
});
