import { Component, signal } from "@angular/core";
import {
  LucideDynamicIcon,
  LucideHeadset,
  LucideRefreshCw,
  LucideShieldCheck,
  LucideTruck,
} from "@lucide/angular";

@Component({
  selector: "app-section-features",
  imports: [LucideDynamicIcon],
  templateUrl: "./section-features.html",
})
export class SectionFeatures {
  data = signal([
    {
      icon: LucideTruck,
      title: "Free Delivery",
      description: "For orders above 120 EGP",
    },
    {
      icon: LucideRefreshCw,
      title: "Get Refund",
      description: "Refunds within 30 days",
    },
    {
      icon: LucideShieldCheck,
      title: "Safe Payment",
      description: "100% Secure Payment",
    },
    {
      icon: LucideHeadset,
      title: "24/7 Support",
      description: "Contact us at any time",
    },
  ]);
}
