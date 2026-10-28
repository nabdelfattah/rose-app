import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Rating } from './rating';

describe('Rating', () => {
  let component: Rating;
  let fixture: ComponentFixture<Rating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rating]
    }).compileComponents();

    fixture = TestBed.createComponent(Rating);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const filledStars = () =>
    fixture.nativeElement.querySelectorAll('svg.fill-\\[\\#FFA508\\]').length;

  it('should round a decimal rating to whole stars', async () => {
    fixture.componentRef.setInput('rating', 3.6);
    await fixture.whenStable();
    expect(filledStars()).toBe(4);
  });

  it('should select a whole number when a star is clicked', async () => {
    const onChange = vi.fn();
    component.registerOnChange(onChange);
    const stars: NodeListOf<HTMLElement> =
      fixture.nativeElement.querySelectorAll('span[aria-hidden]');
    stars[2].click();
    await fixture.whenStable();
    expect(onChange).toHaveBeenCalledWith(3);
    expect(component.rating()).toBe(3);
  });

  it('should step by one star with the arrow keys', () => {
    const onChange = vi.fn();
    component.registerOnChange(onChange);
    component.writeValue(2);
    const slider: HTMLElement = fixture.nativeElement.querySelector('[role="slider"]');
    slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    expect(onChange).toHaveBeenLastCalledWith(3);
    slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(onChange).toHaveBeenLastCalledWith(2);
  });
});
