import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from "@angular/core";
import {
  DatePipe,
  DecimalPipe,
  NgTemplateOutlet,
  TitleCasePipe,
} from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import {
  LucideBanknote,
  LucideCheck,
  LucideChevronDown,
  LucideCircleCheck,
  LucideCreditCard,
  LucideTriangleAlert,
  LucideTruck,
} from "@lucide/angular";
import { Order } from "../models/orders";

import { Tag } from "@openng/optimus-ui/tag";

type Tone = "yellow" | "emerald" | "red";
type TagSeverity = "success" | "info" | "warn" | "danger";

// Number of order items visible before "Show All" is clicked.
const PREVIEW_COUNT = 2;

// Custom Styling for the p-tag according to the given arguments
const solidTag = (severity: TagSeverity, fill: string) => {
  const scheme = { [severity]: { background: fill, color: "#ffffff" } };
  return {
    root: {
      fontSize: "0.75rem",
      fontWeight: "500",
      padding: "0.125rem 0.625rem",
    },
    colorScheme: { light: scheme, dark: scheme },
  };
};

const TAG_TOKENS: Record<TagSeverity, object> = {
  success: solidTag("success", "var(--color-emerald-500)"),
  info: solidTag("info", "var(--color-blue-500)"),
  warn: solidTag("warn", "var(--color-yellow-500)"),
  danger: solidTag("danger", "var(--color-red-600)"),
};

const TONE_TEXT: Record<Tone, string> = {
  yellow: "text-yellow-600",
  emerald: "text-emerald-600",
  red: "text-red-600",
};

// order status
const STATUS_SEVERITY: Record<Order["status"], TagSeverity> = {
  PENDING: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
};

// for payment status (in the header)
const PAYMENT_SEVERITY: Record<Order["paymentStatus"], TagSeverity> = {
  PROCESSING: "warn",
  DONE: "success",
};

// the Delivery Status in the figma (status in the orders interface)
const DELIVERY_TONE: Record<Order["status"], Tone> = {
  PENDING: "yellow",
  COMPLETED: "emerald",
  CANCELLED: "red",
};

@Component({
  selector: "app-order-item",
  imports: [
    DatePipe,
    DecimalPipe,
    NgTemplateOutlet,
    TitleCasePipe,
    RouterLink,
    TranslatePipe,
    LucideBanknote,
    LucideCheck,
    LucideChevronDown,
    LucideCircleCheck,
    LucideCreditCard,
    LucideTriangleAlert,
    LucideTruck,
    Tag,
  ],
  templateUrl: "./orderItem.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "block" },
})
export class OrderItem {
  item = input<Order>({} as Order);
  protected readonly tagTokens = TAG_TOKENS;
  readonly orderItems = computed(() => this.item().orderItems ?? []);

  readonly expanded = signal(false);
  readonly visibleItems = computed(() =>
    this.expanded()
      ? this.orderItems()
      : this.orderItems().slice(0, PREVIEW_COUNT),
  );

  readonly fadedItems = computed(() =>
    this.expanded()
      ? []
      : this.orderItems().slice(PREVIEW_COUNT, PREVIEW_COUNT * 2),
  );

  readonly hasMore = computed(() => this.orderItems().length > PREVIEW_COUNT);

  readonly orderNumber = computed(
    () =>
      this.item().trackingNumber ??
      this.item().id?.slice(-6).toUpperCase() ??
      "",
  );

  readonly isCard = computed(() => this.item().paymentMethod === "CREDIT_CARD");

  readonly statusSeverity = computed(
    () => STATUS_SEVERITY[this.item().status] ?? "info",
  );
  readonly paymentSeverity = computed(
    () => PAYMENT_SEVERITY[this.item().paymentStatus] ?? "info",
  );
  readonly deliveryTone = computed(
    () => DELIVERY_TONE[this.item().status] ?? "yellow",
  );
  protected readonly toneText = TONE_TEXT;

  toggleExpanded(): void {
    this.expanded.update((value) => !value);
  }
}
