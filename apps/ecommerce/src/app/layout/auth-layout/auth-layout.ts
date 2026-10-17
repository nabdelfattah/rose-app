import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ThemeButtonComponent, LangButton, ThemeService } from "@rose-app/ui";

@Component({
  selector: "app-auth-layout",
  imports: [RouterOutlet, ThemeButtonComponent, LangButton],
  templateUrl: "./auth-layout.html",
  styleUrl: "./auth-layout.css",
})
export class AuthLayout {
  private readonly themeService = inject(ThemeService);
  readonly isDark = this.themeService.isDark;
}
