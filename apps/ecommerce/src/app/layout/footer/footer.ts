import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideArrowRight } from '@lucide/angular';
import { LanguageService } from '@rose-app/ui';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideArrowRight],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private readonly languageService = inject(LanguageService, { optional: true });

  readonly isArabic = computed(() => this.languageService?.currentLang() === 'ar');

  readonly email = signal('');
  readonly emailError = signal<string | null>(null);

  onSubscribe(event: Event): void {
    event.preventDefault();
    const val = this.email().trim();
    if (!val) {
      this.emailError.set(
        this.isArabic()
          ? 'يرجى إدخال البريد الإلكتروني'
          : 'Please enter your email address'
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      this.emailError.set(
        this.isArabic()
          ? 'يرجى إدخال بريد إلكتروني صالح'
          : 'Please enter a valid email address'
      );
      return;
    }

    this.emailError.set(null);
  }
}
