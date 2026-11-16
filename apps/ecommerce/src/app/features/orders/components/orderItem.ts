import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from "@angular/core";
import { DatePipe, DecimalPipe, NgTemplateOutlet } from "@angular/common";
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

type Tone = "yellow" | "blue" | "emerald" | "red";
type TagSeverity = "success" | "info" | "danger";

/** Number of order items visible before "Show All" is clicked. */
const PREVIEW_COUNT = 2;

/**
 * Per-instance design tokens for `p-tag`: Aura's default tags are pale,
 * the Figma design uses solid pills with white text.
 */
const solidTag = (severity: TagSeverity, fill: string) => {
  const scheme = { [severity]: { background: fill, color: "#ffffff" } };
  return {
    root: { fontSize: "0.75rem", fontWeight: "500", padding: "0.125rem 0.625rem" },
    colorScheme: { light: scheme, dark: scheme },
  };
};

const TAG_TOKENS: Record<TagSeverity, object> = {
  success: solidTag("success", "var(--color-emerald-500)"),
  info: solidTag("info", "var(--color-blue-500)"),
  danger: solidTag("danger", "var(--color-red-600)"),
};

const TONE_TEXT: Record<Tone, string> = {
  yellow: "text-yellow-600",
  blue: "text-blue-600",
  emerald: "text-emerald-600",
  red: "text-red-600",
};

@Component({
  selector: "app-order-item",
  imports: [
    DatePipe,
    DecimalPipe,
    NgTemplateOutlet,
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

  /** Items shown faded under the preview to hint that more exist. */
  readonly peekItems = computed(() =>
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

  readonly isPaid = computed(() => {
    const s = (this.item().paymentStatus ?? "").toUpperCase();
    return s === "PAID" || s === "SUCCEEDED" || s === "COMPLETED";
  });

  readonly isCard = computed(() => this.item().paymentMethod === "CREDIT_CARD");

  /** Overall order status shown at the top-right of the card. */
  readonly orderStatus = computed(() => {
    const status = this.normalizedStatus();
    if (status === "cancelled")
      return { key: "orders.status.canceled", severity: "danger" as const };
    if (status === "delivered")
      return { key: "orders.status.done", severity: "success" as const };
    return { key: "orders.status.in-progress", severity: "info" as const };
  });

  /** Delivery status shown in the details list. */
  readonly deliveryStatus = computed(() => {
    const status = this.normalizedStatus();
    const map: Record<string, { key: string; tone: Tone }> = {
      pending: { key: "orders.delivery.pending", tone: "yellow" },
      processing: { key: "orders.delivery.processing", tone: "yellow" },
      shipped: { key: "orders.delivery.shipped", tone: "blue" },
      delivered: { key: "orders.delivery.delivered", tone: "emerald" },
      cancelled: { key: "orders.delivery.canceled", tone: "red" },
    };
    const entry = map[status] ?? map["pending"];
    return { ...entry, cls: TONE_TEXT[entry.tone] };
  });

  toggleExpanded(): void {
    this.expanded.update((v) => !v);
  }

  private normalizedStatus(): string {
    const s = (this.item().status ?? "").toLowerCase();
    if (s === "canceled") return "cancelled";
    if (s === "completed") return "delivered";
    return s;
  }
}
