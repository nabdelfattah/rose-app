import { TestBed } from "@angular/core/testing";
import { CreateReviewRequest, ReviewsService } from "./reviews.service";
import { request } from "express";
import { firstValueFrom } from "rxjs";
import { BASE_URL } from "../../../core/constants/apiUrl";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { Review } from "../model/product";

describe("ReviewsService", () => {
  let service: ReviewsService;
  let httpTesting: HttpTestingController;

  const request: CreateReviewRequest = {
    productId: "p1",
    headline: "Beautiful roses",
    content: "The flowers arrived fresh and smelled amazing.",
    rating: 4.5,
  };

  const createdReview: Review = {
    id: "r1",
    productId: "p1",
    headline: request.headline,
    content: request.content,
    rating: request.rating,
    createdAt: "2026-10-26T12:00:00.000Z",
    updatedAt: "2026-10-26T12:00:00.000Z",
    userId: "u1",
    user: {
      id: "u1",
      firstName: "Nada",
      lastName: "Wael",
      username: "nadaw.",
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ReviewsService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should send a POST request to /reviews with the review body", async () => {
    const result = firstValueFrom(service.addReview(request));

    const req = httpTesting.expectOne({
      method: "POST",
      url: `${BASE_URL}/reviews`,
    });

    expect(req.request.body).toEqual(request);
    req.flush(createdReview);
    expect(await result).toEqual(createdReview);
  });
});
