import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PromotionalBanners } from './promotional-banners';

describe('PromotionalBanners', () => {
  let fixture: ComponentFixture<PromotionalBanners>;
  let component: PromotionalBanners;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionalBanners],
      providers: [provideRouter([])],
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

  afterEach(() => {
    fixture.destroy();
  });

  it('should advance slide on autoplay interval and loop', () => {
    jasmine.clock().install();
    const localFixture = TestBed.createComponent(PromotionalBanners);
    const localComp = localFixture.componentInstance;
    localFixture.detectChanges();

    expect(localComp.currentSlide()).toBe(0);
    jasmine.clock().tick(5001);
    expect(localComp.currentSlide()).toBe(1);
    jasmine.clock().tick(5001);
    expect(localComp.currentSlide()).toBe(2);
    jasmine.clock().tick(5001);
    expect(localComp.currentSlide()).toBe(0);

    localFixture.destroy();
    jasmine.clock().uninstall();
  });
});

