import { Component, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Testimonials } from './testimonials';
import { TestimonialsService } from './service/testimonials.service';
import { Testimonial } from './model/testimonials.model';

@Component({
  selector: 'app-sub-title',
  standalone: true,
  template: '<ng-content />',
})
class MockSubTitleComponent {}

@Component({
  selector: 'app-section-title',
  standalone: true,
  template: '<ng-content />',
})
class MockSectionTitleComponent {}

@Pipe({
  name: 'translate',
  standalone: true,
})
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

const createTestimonial = (
  overrides: Partial<Testimonial> = {},
): Testimonial => ({
  id: "1",
  name: 'Yasmine',
  email: 'yasmine@example.com',
  content: 'Excellent service and beautiful flowers!',
  rating: 4,
  image: null,
  isApproved: true,
  immutable: false,
  createdAt: '2026-06-27T20:16:33.739Z',
  updatedAt: '2026-06-27T20:16:33.739Z',
  ...overrides,
});

describe('Testimonials', () => {
  let fixture: ComponentFixture<Testimonials>;
  let component: Testimonials;

  const mockTestimonials: Testimonial[] = [
    createTestimonial(),
    createTestimonial({
      id: '2',
      name: 'Hady',
      image: 'https://example.com/hady.jpg',
      rating: 5,
      content: 'Amazing experience!',
    }),
    createTestimonial({
      id: '3',
      name: 'Asmaa',
      rating: 3,
    }),
    createTestimonial({
      id: '4',
      name: 'Omar',
      content: 'This testimonial should not appear.',
    }),
  ];

  const mockResponse = {
    status: true,
    code: 200,
    payload: {
      data: mockTestimonials,
      metadata: {
        page: 1,
        limit: 20,
        total: 4,
        totalPages: 1,
      },
    },
  };

  const testimonialsServiceMock = {
    getTestimonials: vi.fn(() => of(mockResponse)),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [Testimonials],
      providers: [
        {
          provide: TestimonialsService,
          useValue: testimonialsServiceMock,
        },
      ],
    })
      .overrideComponent(Testimonials, {
        remove: {
          imports: [
            (await import('@ngx-translate/core')).TranslatePipe,
            (await import('@rose-app/ui')).SubTitleComponent,
            (await import('@rose-app/ui')).SectionTitleComponent,
            (await import('@lucide/angular')).LucideStar,
          ],
        },
        add: {
          imports: [
            MockTranslatePipe,
            MockSubTitleComponent,
            MockSectionTitleComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Testimonials);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch testimonials from the service', () => {
    expect(testimonialsServiceMock.getTestimonials).toHaveBeenCalledTimes(1);
    expect(component.testimonials()).toHaveLength(4);
  });

  it('should display only the first three testimonials', () => {
    const cards = fixture.nativeElement.querySelectorAll('.testimonials-card');
    expect(cards.length).toBe(3);
  });

  it('should display the testimonial name and content', () => {
    const firstCard = fixture.nativeElement.querySelector('.testimonials-card');
    expect(firstCard.textContent).toContain('Yasmine');
    expect(firstCard.textContent).toContain(
      'Excellent service and beautiful flowers!',
    );
  });

  it('should display the image when a testimonial has one', () => {
    const images: HTMLImageElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.testimonials-card img'),
    );
    expect(images).toHaveLength(1);
    expect(images[0].getAttribute('src')).toBe('https://example.com/hady.jpg');
    expect(images[0].getAttribute('alt')).toBe('Hady');
  });

  it('should display the first letter when the image is null', () => {
    const firstCard = fixture.nativeElement.querySelector('.testimonials-card');
    expect(firstCard.querySelector('img')).toBeNull();
    expect(firstCard.querySelector('.image p').textContent.trim()).toBe('Y');
  });

  it('should format the testimonial date', () => {
    const firstCard = fixture.nativeElement.querySelector('.testimonials-card');
    expect(firstCard.querySelector('.date').textContent.trim()).toBe(
      new DatePipe('en-US').transform(
        '2026-06-27T20:16:33.739Z',
        'MMM d, y',
      )
    );
  });
});
