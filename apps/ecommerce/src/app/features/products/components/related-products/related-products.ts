import { Component, input } from "@angular/core";
import { CarouselModule } from "@openng/optimus-ui/carousel";
import { Product } from "../../model/product";
import { ProductCardComponent, SectionTitleComponent } from "@rose-app/ui";
import { TranslatePipe } from "@ngx-translate/core";
@Component({
  selector: "app-related-products",
  standalone: true,
  imports: [
    CarouselModule,
    ProductCardComponent,
    SectionTitleComponent,
    TranslatePipe,
  ],
  templateUrl: "./related-products.html",
  styleUrl: "./related-products.css",
})
export class RelatedProducts {
  products = input<Product[]>([]);
  responsiveOptions = [
    {
      breakpoint: "1280px",
      numVisible: 4,
      numScroll: 1,
    },
    {
      breakpoint: "1200px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "992px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "768px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "640px",
      numVisible: 1,
      numScroll: 1,
    },
  ];
}
