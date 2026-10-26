import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestimonialsService } from './testimonials.service';
import { BASE_URL } from '../../../../../core/constants/apiUrl';
import { TestimonialRes } from '../model/testimonials.model';

describe('TestimonialsService', () => {
  let service: TestimonialsService;
  let httpMock: HttpTestingController;
  const mockResponse: TestimonialRes = {
    status: true,
    code: 200,
    payload: {
      data: [],
      metadata: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TestimonialsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(TestimonialsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET request to fetch testimonials', () => {
    service.getTestimonials().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
    const request = httpMock.expectOne(`${BASE_URL}/testimonials`);
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });
});
