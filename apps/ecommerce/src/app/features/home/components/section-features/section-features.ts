import { Component, signal } from "@angular/core";
import {
  LucideDynamicIcon,
  LucideHeadset,
  LucideRefreshCw,
  LucideShieldCheck,
  LucideTruck,
} from "@lucide/angular";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-section-features",
  imports: [LucideDynamicIcon, TranslatePipe],
  templateUrl: "./section-features.html",
})
export class SectionFeatures {
  data = signal([
    {
      icon: LucideTruck,
      title: "home.feature.delivery.title",
      description: "home.feature.delivery.description",
    },
    {
      icon: LucideRefreshCw,
      title: "home.feature.refund.title",
      description: "home.feature.refund.description",
    },
    {
      icon: LucideShieldCheck,
      title: "home.feature.payment.title",
      description: "home.feature.payment.description",
    },
    {
      icon: LucideHeadset,
      title: "home.feature.support.title",
      description: "home.feature.support.description",
    },
  ]);
}
