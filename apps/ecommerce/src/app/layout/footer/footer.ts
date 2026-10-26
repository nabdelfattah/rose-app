import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideArrowRight } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule, RouterLink, LucideArrowRight, TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  readonly email = signal('');
  readonly emailError = signal<string | null>(null);

  onSubscribe(event: Event): void {
    event.preventDefault();
    const val = this.email().trim();
    if (!val) {
      this.emailError.set('footer.newsletter.error-required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      this.emailError.set('footer.newsletter.error-invalid');
      return;
    }

    this.emailError.set(null);
  }
}
