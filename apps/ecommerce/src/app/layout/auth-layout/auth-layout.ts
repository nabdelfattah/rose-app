import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ThemeButtonComponent, LangButton } from "@rose-app/ui";

@Component({
  selector: "app-auth-layout",
  imports: [RouterOutlet, ThemeButtonComponent, LangButton],
  templateUrl: "./auth-layout.html",
  styleUrl: "./auth-layout.css",
})
export class AuthLayout {}
