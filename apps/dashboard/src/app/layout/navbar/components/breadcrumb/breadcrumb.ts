import { Component, inject } from '@angular/core';
import { BreadcrumbModule } from '@openng/optimus-ui/breadcrumb';
import { BreadcrumbService } from '../../services/breadcrumb.service';
@Component({
  selector: 'app-breadcrumb',
  imports: [BreadcrumbModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css'
})
export class Breadcrumb {
  private readonly breadcrumb = inject(BreadcrumbService);

  items = this.breadcrumb.items
}
