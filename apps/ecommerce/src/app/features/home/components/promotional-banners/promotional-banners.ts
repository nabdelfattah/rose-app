import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  PLATFORM_ID,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { BannerSlide } from './promotional-banners.interface';

export interface OccasionCard {
  pill: string;
  title: string;
  imageUrl: string;
  alt: string;
  link: string;
}

@Component({
  selector: 'app-promotional-banners',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './promotional-banners.html',
  styleUrl: './promotional-banners.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionalBanners implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly autoplayIntervalMs = 5000;
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;

  readonly currentSlide = signal<number>(0);

  // Top Left: Static promotional card (not part of the carousel)
  readonly leftBanner = {
    pill: 'home.banners.leftBanner.pill',
    heading: 'home.banners.leftBanner.heading',
    ctaText: 'home.banners.leftBanner.cta',
    link: '/products',
    imageUrl:
      'https://rose-app.elevate-bootcamp.cloud/storage/entities/product/product-3454bd6fe74a-1784745925012.jpeg',
    alt: 'Special Gifts For The People You Love - Flower and Gift Box',
  };

  // Top Right: Main promotional carousel
  readonly slides: BannerSlide[] = [
    {
      heading: 'home.banners.slides.slide1.heading',
      subtitle: 'home.banners.slides.slide1.subtitle',
      ctaText: 'home.banners.slides.slide1.cta',
      ctaRoute: '/products',
      imageUrl:
        'https://rose-app.elevate-bootcamp.cloud/storage/entities/product/product-2b1cb9dfe154-1784745922942.jpeg',
      alt: 'Say It with Flowers - Premium Red Roses Bouquet',
    },
    {
      heading: 'home.banners.slides.slide2.heading',
      subtitle: 'home.banners.slides.slide2.subtitle',
      ctaText: 'home.banners.slides.slide2.cta',
      ctaRoute: '/products',
      imageUrl:
        'https://rose-app.elevate-bootcamp.cloud/storage/entities/product/product-f32e57ca382f-1790837522209.webp',
      alt: 'Blooms That Brighten Every Day - Mega Bouquet',
    },
    {
      heading: 'home.banners.slides.slide3.heading',
      subtitle: 'home.banners.slides.slide3.subtitle',
      ctaText: 'home.banners.slides.slide3.cta',
      ctaRoute: '/products',
      imageUrl:
        'https://rose-app.elevate-bootcamp.cloud/storage/entities/product/product-7ef81d0c9782-1784745924181.jpeg',
      alt: 'Cherish Every Milestone - Luxury Roses Collection',
    },
  ];

  // Bottom Row: 3 Occasion Cards (Wedding, Engagement, Anniversary - NO CTA button)
  readonly occasionCards: OccasionCard[] = [
    {
      pill: 'home.banners.occasions.wedding.pill',
      title: 'home.banners.occasions.wedding.title',
      imageUrl:
        'https://rose-app.elevate-bootcamp.cloud/storage/entities/product/product-ba7e649bda9a-1784745923881.jpeg',
      alt: "Wedding Gift - Celebrate Her Forever with a Gift She'll Always Remember",
      link: '/products',
    },
    {
      pill: 'home.banners.occasions.engagement.pill',
      title: 'home.banners.occasions.engagement.title',
      imageUrl:
        'https://rose-app.elevate-bootcamp.cloud/storage/entities/product/product-d4da3bb0c97c-1784745923489.jpeg',
      alt: 'Engagement Gift - Honor the Beginning of a Beautiful Journey Together',
      link: '/products',
    },
    {
      pill: 'home.banners.occasions.anniversary.pill',
      title: 'home.banners.occasions.anniversary.title',
      imageUrl:
        'https://rose-app.elevate-bootcamp.cloud/storage/entities/product/product-323b37fd5f67-1784745922993.jpeg',
      alt: 'Anniversary Gift - Mark Every Year of Love with a Meaningful Surprise',
      link: '/products',
    },
  ];

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  nextSlide(): void {
    this.currentSlide.update((idx) => (idx + 1) % this.slides.length);
    this.resetAutoplay();
  }

  prevSlide(): void {
    this.currentSlide.update((idx) => (idx - 1 + this.slides.length) % this.slides.length);
    this.resetAutoplay();
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.slides.length) {
      this.currentSlide.set(index);
      this.resetAutoplay();
    }
  }

  private startAutoplay(): void {
    if (!this.isBrowser || this.slides.length <= 1) {
      return;
    }
    this.stopAutoplay();
    this.autoplayTimer = setInterval(() => {
      this.currentSlide.update((idx) => (idx + 1) % this.slides.length);
    }, this.autoplayIntervalMs);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer !== null) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  private resetAutoplay(): void {
    this.startAutoplay();
  }
}

