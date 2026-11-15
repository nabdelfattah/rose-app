import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { describe, it, expect, beforeEach } from "vitest";
import { CategoryService } from "./categories.service";

describe("CategoryService", () => {
  let service: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CategoryService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
