import { TestBed } from "@angular/core/testing";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { ProductService } from "./product.service";
import { Product, ProductRes } from "../model/product";
import { BASE_URL } from "../../../core/constants/apiUrl";

describe("ProductService", () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const apiUrl = `${BASE_URL}/products`;

  const mockProduct: Product = {
    id: "product-123",
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
        productId: "product-123",
        occasionId: "occasion-1",
        createdAt: "2026-01-01T00:00:00.000Z",
        occasion: {
          id: "occasion-1",
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
  };

  const mockResponse: ProductRes = {
    status: true,
    code: 200,
    payload: {
      data: [mockProduct],
      metadata: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("getProducts", () => {
    it("should send a GET request to the products endpoint", () => {
      service.getProducts().subscribe();
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe("GET");
      req.flush(mockResponse);
    });

    it("should return the products response", () => {
      service.getProducts().subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(apiUrl);

      req.flush(mockResponse);
    });
  });

  describe("getProductById", () => {
    const productId = "product-123";

    it("should send a GET request to the product details endpoint", () => {
      service.getProductById(productId).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/${productId}`);
      expect(req.request.method).toBe("GET");
      req.flush(mockResponse);
    });

    it("should return the product response", () => {
      service.getProductById(productId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });
      const req = httpMock.expectOne(`${apiUrl}/${productId}`);

      req.flush(mockResponse);
    });
  });
});
