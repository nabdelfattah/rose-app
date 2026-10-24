import { Component, signal } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { Button } from "@rose-app/ui";
import { Header } from "../header/header";

@Component({
  selector: "app-main-layout",
  imports: [RouterOutlet, RouterLink, Button, Header],
  templateUrl: "./main-layout.html",
  styleUrl: "./main-layout.css",
})
export class MainLayout {
  protected isLoading = signal(false);

  protected toggleLoading() {
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 2000);
  }
}
