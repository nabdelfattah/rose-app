import { isPlatformBrowser } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
  ViewChild,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LucideEye, LucideEyeOff } from "@lucide/angular";
import { TranslatePipe } from "@ngx-translate/core";
import intlTelInput from "intl-tel-input";
import { LanguageService } from "../../../../language/language.service";

@Component({
  selector: "app-input",
  standalone: true,
  imports: [ReactiveFormsModule, LucideEye, LucideEyeOff, TranslatePipe],
  templateUrl: './inputs.html',
  // the id belongs to the inner <input> only, so <label for> can target it
  host: { '[attr.id]': 'null' },
})
export class Input implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private languageService = inject(LanguageService);
  label = input.required<string>();
  type = input<"text" | "email" | "password" | "number" | "tel" | "textarea">(
    "text",
  );
  // only used when type is "textarea"
  rows = input<number>(4);
  placeholder = input<string>("");
  value = input<string>("");
  control = input.required<FormControl>();
  id = input.required<string>();
  helperText = input<string>("");
  readonly = input<boolean>(false);
  showPassword = signal<boolean>(false);

  @ViewChild("input") phoneInput!: ElementRef<HTMLInputElement>;

  toggleType() {
    if (!this.showPassword()) {
      this.phoneInput.nativeElement.type = "text";
      this.showPassword.set(true);
    } else {
      this.phoneInput.nativeElement.type = "password";
      this.showPassword.set(false);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId) && this.type() === "tel") {
      const isArabic = this.languageService.currentLang() === "ar";
      intlTelInput(this.phoneInput.nativeElement, {
        initialCountry: "eg",
        separateDialCode: true,
        onlyCountries: ["eg"],
        strictMode: true,
        containerClass: "w-full",
        countryNameLocale: "ar",
      });
    }
  }
}
