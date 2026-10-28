import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { provideTranslateService } from "@ngx-translate/core";
import { of } from "rxjs";
import { ProductDetails } from "./product-details";
import {
  selectAllProducts,
  selectSelectedProduct,
} from "../../store/products.selectors";
import { selectToken } from "../../../auth/store/user.selector";
import { ProductsActions } from "../../store/products.actions";
import { ReviewsService } from "../../service/reviews.service";
import { Product } from "../../model/product";

describe("ProductDetails", () => {
  let fixture: ComponentFixture<ProductDetails>;
  let component: ProductDetails;
  let store: MockStore;

  // the page is opened for product "p2"
  const products = [
    { id: "p1", title: "Product 1" },
    { id: "p2", title: "Product 2" },
    { id: "p3", title: "Product 3" },
  ] as Product[];

  const selectedProduct = {
    id: "p2",
    rating: 4,
    ratings: 10,
    reviews: [],
  } as unknown as Product; // as unknown is a work around to force typescript

  const reviewsService = { addReview: vi.fn(() => of({})) };

  // the form is protected in the component, so reach it through `any` (workaround)
  const form = () => (component as any).form;

  const fillValidReview = () =>
    form().setValue({
      rating: 5,
      headline: "Beautiful flowers",
      content: "They arrived fresh and smelled amazing.",
    });

  // use for the test suite of the user not logged in. see line 147
  const text = () => fixture.nativeElement.textContent as string;

  beforeEach(async () => {
    reviewsService.addReview.mockClear();

    await TestBed.configureTestingModule({
      imports: [ProductDetails],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectAllProducts, value: products },
            { selector: selectSelectedProduct, value: selectedProduct },
            { selector: selectToken, value: "fake-token" }, // logged in
          ],
        }),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => "p2" } } },
        },
        { provide: ReviewsService, useValue: reviewsService },
        // no loader => the pipe shows the translation keys
        provideTranslateService({ fallbackLang: "en" }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    vi.spyOn(store, "dispatch");

    fixture = TestBed.createComponent(ProductDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it("should load the product from the route id", () => {
    expect(store.dispatch).toHaveBeenCalledWith(
      ProductsActions.loadSelectedProduct({ id: "p2" }),
    );
  });

  it("should exclude the current product from related products", () => {
    const ids = component.relatedProducts().map((product) => product.id);
    expect(ids).toEqual(["p1", "p3"]);
  });

  it("should not send an invalid review", () => {
    component.submitHandler();

    expect(reviewsService.addReview).not.toHaveBeenCalled();
    expect(form().touched).toBe(true); // so the errors show up
  });

  it("should send a valid review with the product id", () => {
    fillValidReview();
    component.submitHandler();

    expect(reviewsService.addReview).toHaveBeenCalledWith({
      rating: 5,
      headline: "Beautiful flowers",
      content: "They arrived fresh and smelled amazing.",
      productId: "p2",
    });
  });

  it("should reset the form and reload the product after the review is added", () => {
    fillValidReview();
    vi.mocked(store.dispatch).mockClear();

    component.submitHandler();

    expect(form().getRawValue()).toEqual({
      rating: 0,
      headline: "",
      content: "",
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      ProductsActions.loadSelectedProduct({ id: "p2" }),
    );
  });

  describe("when the user is logged out", () => {
    beforeEach(() => {
      store.overrideSelector(selectToken, "");
      store.refreshState();
      fixture.detectChanges();
    });

    it("should ask the user to login", () => {
      expect(text()).toContain(
        "products.product-details.reviews.login-required",
      );
    });

    it("should not send the review", () => {
      fillValidReview();
      component.submitHandler();

      expect(reviewsService.addReview).not.toHaveBeenCalled();
    });
  });

  it('should resolve the current product for ProductDetailsInfo', () => {
    expect(component.product()?.id).toBe('p2');
  });
});
