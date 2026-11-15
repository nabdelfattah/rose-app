import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { describe, it, expect, beforeEach } from "vitest";
import { OccasionsService } from "./occasions.service";

describe("OccasionsService", () => {
  let service: OccasionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OccasionsService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(OccasionsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
