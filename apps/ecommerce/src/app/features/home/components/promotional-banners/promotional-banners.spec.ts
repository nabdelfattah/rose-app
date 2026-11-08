import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateLoader, TranslationObject, provideTranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PromotionalBanners } from './promotional-banners';

class MockTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({
      home: {
        banners: {
          leftBanner: {
            pill: 'Starting from 10.99 EGP',
            heading: 'Special Gifts For The\nPeople You Love',
            cta: 'Shop Now',
          },
          slides: {
            slide1: {
              heading: 'Say It with Flowers',
              subtitle: 'Elegant gifts for every special moment.',
              cta: 'I’m buying!',
            },
            slide2: {
              heading: 'Blooms That Brighten Every Day',
              subtitle: 'Handcrafted floral arrangements designed to delight.',
              cta: 'I’m buying!',
            },
            slide3: {
              heading: 'Cherish Every Milestone',
              subtitle: 'Luxury arrangements crafted with passion and love.',
              cta: 'I’m buying!',
            },
          },
          occasions: {
            wedding: {
              pill: 'Wedding',
              title: "Celebrate Her Forever with a Gift\nShe’ll Always Remember",
            },
            engagement: {
              pill: 'Engagement',
              title: 'Honor the Beginning of a\nBeautiful Journey Together',
            },
            anniversary: {
              pill: 'Anniversary',
              title: 'Mark Every Year of Love with a\nMeaningful Surprise',
            },
          },
        },
      },
    });
  }
}

describe('PromotionalBanners', () => {
  let fixture: ComponentFixture<PromotionalBanners>;
  let component: PromotionalBanners;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionalBanners],
      providers: [
        provideRouter([]),
        provideTranslateService({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
          fallbackLang: 'en',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PromotionalBanners);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the promotional banners component', () => {
    expect(component).toBeTruthy();
  });

  it('should render top left static promotional card with pill, heading, and CTA', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Starting from 10.99 EGP');
    expect(compiled.textContent).toContain('Special Gifts For The');
    expect(compiled.textContent).toContain('People You Love');
    expect(compiled.textContent).toContain('Shop Now');
  });

  it('should render top right carousel with slides, indicators, and navigation', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Say It with Flowers');
    expect(compiled.textContent).toContain('Elegant gifts for every special moment.');
    expect(compiled.textContent).toContain('I’m buying!');

    // Test carousel next and prev
    expect(component.currentSlide()).toBe(0);
    component.nextSlide();
    expect(component.currentSlide()).toBe(1);
    component.prevSlide();
    expect(component.currentSlide()).toBe(0);

    // Test direct jump
    component.goToSlide(2);
    expect(component.currentSlide()).toBe(2);
  });

  it('should render bottom occasion cards with pills and titles but NO Shop Now buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Wedding');
    expect(compiled.textContent).toContain('Celebrate Her Forever with a Gift');
    expect(compiled.textContent).toContain('Engagement');
    expect(compiled.textContent).toContain('Honor the Beginning of a');
    expect(compiled.textContent).toContain('Anniversary');
    expect(compiled.textContent).toContain('Mark Every Year of Love with a');

    // Verify bottom cards do not contain Shop Now
    const bottomCards = compiled.querySelectorAll('.promotional-banners .grid:last-of-type a');
    expect(bottomCards.length).toBe(3);
    bottomCards.forEach((card) => {
      expect(card.textContent).not.toContain('Shop Now');
      expect(card.textContent).not.toContain('I’m buying!');
    });
  });

  it('should have proper RTL-aware layout classes on carousel controls and indicators', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const pagination = compiled.querySelector('[aria-label="Carousel pagination"]');
    expect(pagination?.className).toContain('rtl:right-auto');
    expect(pagination?.className).toContain('rtl:left-5');

    const navControls = compiled.querySelector('[aria-label="Carousel navigation"]')?.parentElement;
    expect(navControls?.className).toContain('rtl:right-auto');
    expect(navControls?.className).toContain('rtl:left-5');
  });

  it('should apply whitespace-nowrap and cursor-pointer to CTA buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const leftCta = compiled.querySelector('article a');
    expect(leftCta?.className).toContain('cursor-pointer');
    expect(leftCta?.className).toContain('whitespace-nowrap');

    const carouselCta = compiled.querySelector('[aria-roledescription="carousel"] a');
    expect(carouselCta?.className).toContain('cursor-pointer');
    expect(carouselCta?.className).toContain('whitespace-nowrap');
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should advance slide on autoplay interval and loop', () => {
    vi.useFakeTimers();
    const localFixture = TestBed.createComponent(PromotionalBanners);
    const localComp = localFixture.componentInstance;
    localFixture.detectChanges();

    expect(localComp.currentSlide()).toBe(0);
    vi.advanceTimersByTime(5001);
    expect(localComp.currentSlide()).toBe(1);
    vi.advanceTimersByTime(5001);
    expect(localComp.currentSlide()).toBe(2);
    vi.advanceTimersByTime(5001);
    expect(localComp.currentSlide()).toBe(0);

    localFixture.destroy();
    vi.useRealTimers();
  });
});
