import { inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";

export type Language = "en" | "ar";

@Injectable({
  providedIn: "root",
})
export class LanguageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly translate = inject(TranslateService);

  currentLang = signal<Language>("en");

  constructor() {
    this.loadLanguage();
  }

  toggleLanguage(): void {
    const lang: Language = this.currentLang() === "en" ? "ar" : "en";
    this.setLanguage(lang);
  }

  setLanguage(lang: Language): void {
    this.currentLang.set(lang);

    if (!isPlatformBrowser(this.platformId)) {
      this.translate.use(lang);
      return;
    }

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    localStorage.setItem("language", lang);
    this.translate.use(lang);
  }

   loadLanguage(): void {
    if (isPlatformBrowser(this.platformId)) {
        const savedLang = localStorage.getItem("language");
        const lang: Language = savedLang === "ar" ? "ar" : "en";
        this.setLanguage(lang);
    }
    return;
  }
}
