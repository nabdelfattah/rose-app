import { TestBed } from "@angular/core/testing";
import { describe, it, expect, beforeEach } from "vitest";
import { GoogleMapsService } from "./google-maps.service";

describe("GoogleMapsService", () => {
  let service: GoogleMapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleMapsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
