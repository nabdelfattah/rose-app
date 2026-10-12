import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../../language/language.service';

@Component({
  selector: 'app-lang-button',
  standalone: true,
  templateUrl: './lang-button.html',
})
export class LangButton {
  readonly languageService = inject(LanguageService);
}