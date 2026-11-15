import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { describe, it, expect, beforeEach } from "vitest";
import { AddressService } from "./address.service";

describe("AddressService", () => {
  let service: AddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddressService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AddressService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
