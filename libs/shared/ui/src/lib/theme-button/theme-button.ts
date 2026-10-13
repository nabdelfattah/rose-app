import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../../theme/theme.service';
import { Button } from '../button/button';
import { LucideSun, LucideMoon } from "@lucide/angular";

@Component({
  selector: 'app-theme-button',
  standalone: true,
  imports: [Button, LucideSun, LucideMoon],
  templateUrl: './theme-button.html',
})
export class ThemeButtonComponent {
    readonly _themeService = inject(ThemeService);

    toggle(){
        this._themeService.toggle();
    }
}