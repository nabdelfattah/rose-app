import { Component, computed, inject, Signal,} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionTitleComponent, SubTitleComponent } from '@rose-app/ui';
import { TestimonialsService } from './service/testimonials.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Testimonial } from './model/testimonials.model';
import { DatePipe } from '@angular/common';
import { LucideStar } from '@lucide/angular';

@Component({
  selector: 'app-testimonials',
  imports: [SubTitleComponent, SectionTitleComponent, TranslatePipe, DatePipe, LucideStar],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css'
})
export class Testimonials{
  private readonly testimonialsService = inject(TestimonialsService);
  readonly stars = [1, 2, 3, 4, 5];
  testimonials:Signal<Testimonial[]> = toSignal(
    this.testimonialsService.getTestimonials().pipe(
      map((response)=> response.payload.data)
    ),{initialValue: []}
  )
}
