import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { firstValueFrom } from "rxjs";
import { WishlistService } from "./wishlist.service";
import {
  WishlistGetResponse,
  WishlistItem,
  WishlistPostResponse,
  WishlistRes,
} from "../models/wishlist";
import { environment } from "../../../../environments/environment";

describe("WishlistService", () => {
  let service: WishlistService;
  let httpTesting: HttpTestingController;

  const wishlistItem = {
    id: "w1",
    userId: "u1",
    productId: "p1",
    createdAt: "2026-11-01T12:00:00.000Z",
  } as WishlistItem;

  const deleteResponse: WishlistRes = {
    status: true,
    code: 200,
    message: "success",
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(WishlistService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  // test the crud operations:
  // GET
  it("should send a GET request to /wishlist", async () => {
    const response: WishlistGetResponse = {
      status: true,
      code: 200,
      payload: { wishlistItems: [wishlistItem] },
    };
    const result = firstValueFrom(service.getWishlistProducts());

    const req = httpTesting.expectOne({
      method: "GET",
      url: `${environment.baseUrl}wishlist`,
    });

    req.flush(response);
    expect(await result).toEqual(response);
  });

  // POST
  it("should send a POST request to /wishlist with the product id", async () => {
    const response: WishlistPostResponse = {
      status: true,
      code: 201,
      payload: { wishlistItem },
    };
    const result = firstValueFrom(service.addWishlist("p1"));

    const req = httpTesting.expectOne({
      method: "POST",
      url: `${environment.baseUrl}wishlist`,
    });

    expect(req.request.body).toEqual({ productId: "p1" });
    req.flush(response);
    expect(await result).toEqual(response);
  });

  // DELETE
  it("should send a DELETE request to /wishlist/${id} to remove one item", async () => {
    const result = firstValueFrom(service.deleteWishlistItem("w1"));

    const req = httpTesting.expectOne({
      method: "DELETE",
      url: `${environment.baseUrl}wishlist/w1`,
    });

    req.flush(deleteResponse);
    expect(await result).toEqual(deleteResponse);
  });

  // BULK DELETE
  it("should send a DELETE request to /wishlist to clear the wishlist", async () => {
    const result = firstValueFrom(service.clearWishlist());

    const req = httpTesting.expectOne({
      method: "DELETE",
      url: `${environment.baseUrl}wishlist`,
    });

    req.flush(deleteResponse);
    expect(await result).toEqual(deleteResponse);
  });
});
