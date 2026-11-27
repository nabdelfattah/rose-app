import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@rose-app/ui';

@Component({
  selector: 'app-unauthorized',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css'
})
export class Unauthorized {
  private readonly languageService = inject(LanguageService);
}
