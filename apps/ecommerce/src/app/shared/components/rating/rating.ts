import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { LucideStar } from "@lucide/angular";

@Component({
  selector: "app-rating",
  imports: [LucideStar],
  templateUrl: "./rating.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, // to make the component work with reactive forms
      useExisting: forwardRef(() => Rating),
      multi: true,
    },
  ],
})
export class Rating implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly rating = model(0);
  readonly max = input(5);
  readonly readonly = input(false);

  protected readonly disabled = signal(false);
  protected readonly interactive = computed(
    () => !this.readonly() && !this.disabled(),
  );
  protected readonly hoverValue = signal<number | null>(null);

  protected readonly currentValue = computed(
    () => Math.round(this.rating() * 2) / 2,
  );
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

  // ----- ControlValueAccessor -----
  private onChange: (value: number) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(value: number | null): void {
    this.rating.set(value ?? 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
  // --------------------------------

  protected select(value: number) {
    if (!this.interactive()) return;
    this.update(value);
    this.onTouched();
  }

  protected preview(value: number | null) {
    if (!this.interactive()) return;
    this.hoverValue.set(value);
  }

  protected onKeydown(event: KeyboardEvent) {
    if (!this.interactive()) return;

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
    event.preventDefault();
    this.update(next);
  }

  // One place that changes the value, so the form is always told
  private update(value: number) {
    const clamped = Math.min(Math.max(value, 0), this.max());
    this.rating.set(clamped);
    this.onChange(clamped);
  }
}
