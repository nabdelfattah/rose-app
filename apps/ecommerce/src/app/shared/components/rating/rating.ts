import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  signal,
} from "@angular/core";
import { LucideStar } from "@lucide/angular";

@Component({
  selector: "app-rating",
  imports: [LucideStar],
  templateUrl: "./rating.html",
})
export class Rating {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly rating = model(0);
  readonly max = input(5);
  readonly readonly = input(false);

  // The star the mouse is over (null = no hover)
  protected readonly hoverValue = signal<number | null>(null);

  // Saved rating, rounded to the nearest half
  protected readonly currentValue = computed(
    () => Math.round(this.rating() * 2) / 2,
  );

  // What the stars show: the hover preview first, otherwise the saved rating
  private readonly shownValue = computed(
    () => this.hoverValue() ?? this.currentValue(),
  );

  protected readonly stars = computed(() =>
    Array.from(
      { length: this.max() },
      (_, i) => Math.min(Math.max(this.shownValue() - i, 0), 1) * 100,
    ),
  );

  protected readonly label = computed(
    () => `${this.currentValue()} out of ${this.max()} stars`,
  );

  protected select(value: number) {
    if (this.readonly()) return;
    this.rating.set(value);
  }

  protected preview(value: number | null) {
    if (this.readonly()) return;
    this.hoverValue.set(value);
  }

  protected onKeydown(event: KeyboardEvent) {
    if (this.readonly()) return;

    const isRtl = getComputedStyle(this.host.nativeElement).direction === "rtl";
    const step = 0.5;
    const current = this.currentValue();
    let next: number | null = null;

    switch (event.key) {
      case "ArrowUp":
        next = current + step;
        break;
      case "ArrowDown":
        next = current - step;
        break;
      case "ArrowRight":
        next = current + (isRtl ? -step : step);
        break;
      case "ArrowLeft":
        next = current + (isRtl ? step : -step);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = this.max();
        break;
    }

    if (next === null) return;
    event.preventDefault(); // stop the page from scrolling
    this.rating.set(Math.min(Math.max(next, 0), this.max()));
  }
}
