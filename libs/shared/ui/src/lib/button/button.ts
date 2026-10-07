import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  inject,
  input,
} from "@angular/core";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "subtle"
  | "ghost"
  | "destructive";

type Size = "sm" | "md" | "lg" | "full";

const BASE =
  "inline-flex items-center justify-center gap-2.5 rounded-[10px] text-base font-normal cursor-pointer " +
  "disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 disabled:border-zinc-200 " +
  "aria-disabled:pointer-events-none aria-disabled:bg-zinc-200 aria-disabled:text-zinc-400 aria-disabled:border-zinc-200";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-maroon-600 hover:bg-maroon-700 text-white",
  secondary: "bg-maroon-50 hover:bg-maroon-100 text-maroon-600",
  outline: "border border-maroon-600 text-maroon-600 hover:bg-maroon-50",
  subtle: "bg-zinc-50 border border-zinc-400 hover:bg-zinc-100 text-zinc-800",
  ghost: "text-zinc-800 hover:bg-zinc-100",
  destructive: "bg-red-600 hover:bg-red-700 text-white",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3",
  md: "h-11 px-4",
  lg: "h-12 px-6",
  full: "h-12 px-6 w-full",
};

/**
 * Design-system button, applied as an attribute on a native `<button>` or `<a>`
 * so the element keeps its built-in semantics (form submission, navigation,
 * keyboard handling).
 *
 * Disabled and loading states are handled per element:
 * - on `<button>` the native `disabled` attribute is set;
 * - on `<a>` (which has no `disabled`) it sets `aria-disabled="true"`,
 *   `tabindex="-1"` and blocks pointer events.
 *
 * While `loading` is true the button is also disabled, shows a spinner after
 * its content and exposes `aria-busy="true"` to screen readers.
 *
 * @example Basic usage
 * ```html
 * <button appButton>Add to cart</button>
 * ```
 *
 * @example Variants and sizes
 * ```html
 * <button appButton variant="secondary" size="sm">Details</button>
 * <button appButton variant="destructive">Delete</button>
 * ```
 *
 * @example Form submit with loading state
 * ```html
 * <button appButton type="submit" [loading]="isSaving()">Save</button>
 * ```
 *
 * @example As a link
 * ```html
 * <a appButton variant="outline" routerLink="/products">Browse</a>
 * <a appButton href="/checkout" disabled>Checkout</a>
 * ```
 */
@Component({
  selector: "button[appButton], a[appButton]",
  imports: [],
  templateUrl: "./button.html",
  host: {
    "[class]": "classes()",
    "[attr.aria-busy]": "loading() ? 'true' : null", // for screen reader (Accessibility)
    // Only for <button>
    "[attr.type]": "isLink ? null : type()",
    "[attr.disabled]": "!isLink && off() ? '' : null",
    // Only for <a>
    "[attr.aria-disabled]": "isLink && off() ? 'true' : null",
    "[attr.tabindex]": "isLink && off() ? -1 : null", // not accessibe by tab
  },
})
export class Button {
  variant = input<Variant>("primary");
  size = input<Size>("md");
  type = input<"button" | "submit" | "reset">("button");
  disabled = input(false, { transform: booleanAttribute }); // With it, your button accepts loading and disabled the same way normal HTML does.

  loading = input(false, { transform: booleanAttribute });

  protected isLink =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName === "A";
  protected off = computed(() => this.disabled() || this.loading());

  protected classes = computed(
    () => `${BASE} ${VARIANTS[this.variant()]} ${SIZES[this.size()]}`,
  );
}
